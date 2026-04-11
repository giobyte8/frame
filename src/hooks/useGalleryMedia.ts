import { useQuery } from '@tanstack/react-query';
import { fetchImages, fetchMedia } from '../api/images';
import type { Image, MediaItem, Page, UUID } from '../types/api';


interface PaginatedResult<T> {
  page: Page<T>;
  isLoading: boolean;
  error: Error | null;
}

const EMPTY_PAGE: Page<any> = {
  content: [],
  pageIdx: 0,
  pageSize: 0,
  totalPages: 0,
  totalElements: 0,
};

export function useGalleryImages(directoryId: UUID):
    PaginatedResult<Image> {

  const { data, isLoading, error } = useQuery({
    queryKey: ['galleryImages', directoryId],
    queryFn: () => fetchImages(directoryId),
    enabled: !!directoryId,
  });

  return {
    page: data ?? EMPTY_PAGE,
    isLoading,
    error: error instanceof Error ? error : null,
  };
}

export function useGalleryMedia(directoryId: UUID):
    PaginatedResult<MediaItem> {

  const { data, isLoading, error } = useQuery({
    queryKey: ['galleryMedia', directoryId],
    queryFn: () => fetchMedia(directoryId),
    enabled: !!directoryId,
  });

  return {
    page: data ?? EMPTY_PAGE,
    isLoading,
    error: error instanceof Error ? error : null,
  };
}
