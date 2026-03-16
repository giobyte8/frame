import { useQuery } from '@tanstack/react-query';
import { fetchImages } from '../api/images';
import type { ImageModel, Page, UUID } from '../types/api';

interface UseGalleryImagesResult {
  page: Page<ImageModel>;
  isLoading: boolean;
  error: Error | null;
}

const EMPTY_PAGE: Page<ImageModel> = {
  content: [],
  pageIdx: 0,
  pageSize: 0,
  totalPages: 0,
  totalElements: 0,
};

export function useGalleryImages(folderId: UUID): UseGalleryImagesResult {
  const { data, isLoading, error } = useQuery({
    queryKey: ['galleryImages', folderId],
    queryFn: () => fetchImages(folderId),
    enabled: !!folderId,
  });

  return {
    page: data ?? EMPTY_PAGE,
    isLoading,
    error: error instanceof Error ? error : null,
  };
}