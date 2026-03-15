import { useEffect, useState } from 'react';
import { fetchFolders, fetchImages } from '../api/galleries';
import type { Folder, Image } from '../types/api';

let foldersCache: Folder[] | null = null;
const imagesCache = new Map<string, Image[]>();

interface UseGalleriesResult {
  folders: Folder[];
  images: Image[];
  isLoadingFolders: boolean;
  isLoadingImages: boolean;
  error: Error | null;
}

export function useGalleries(selectedFolderId: string | null): UseGalleriesResult {
  const [folders, setFolders] = useState<Folder[]>(foldersCache ?? []);
  const [imagesByFolder, setImagesByFolder] = useState<Record<string, Image[]>>(() =>
    Array.from(imagesCache.entries()).reduce<Record<string, Image[]>>((accumulator, [folderId, images]) => {
      accumulator[folderId] = images;
      return accumulator;
    }, {}),
  );
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isCancelled = false;

    if (foldersCache) {
      return () => {
        isCancelled = true;
      };
    }

    fetchFolders()
      .then((result) => {
        if (isCancelled) {
          return;
        }
        foldersCache = result;
        setFolders(result);
      })
      .catch((fetchError: unknown) => {
        if (isCancelled) {
          return;
        }
        setError(fetchError instanceof Error ? fetchError : new Error('Failed to fetch folders'));
      })
    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    let isCancelled = false;

    if (!selectedFolderId) {
      return () => {
        isCancelled = true;
      };
    }

    const cachedImages = imagesCache.get(selectedFolderId);
    if (cachedImages) {
      return () => {
        isCancelled = true;
      };
    }

    fetchImages(selectedFolderId)
      .then((result) => {
        if (isCancelled) {
          return;
        }
        imagesCache.set(selectedFolderId, result);
        setImagesByFolder((previous) => ({
          ...previous,
          [selectedFolderId]: result,
        }));
      })
      .catch((fetchError: unknown) => {
        if (isCancelled) {
          return;
        }
        setError(fetchError instanceof Error ? fetchError : new Error('Failed to fetch images'));
      });

    return () => {
      isCancelled = true;
    };
  }, [selectedFolderId]);

  const isLoadingFolders = !foldersCache && folders.length === 0 && !error;

  let images: Image[] = [];
  let isLoadingImages = false;

  if (selectedFolderId) {
    images = imagesByFolder[selectedFolderId] ?? [];
    isLoadingImages = !imagesByFolder[selectedFolderId] && !error;
  }

  return {
    folders,
    images,
    isLoadingFolders,
    isLoadingImages,
    error,
  };
}
