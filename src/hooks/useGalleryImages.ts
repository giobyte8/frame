import { useQuery } from '@tanstack/react-query';
import { fetchImages } from '../api/images';
import type { Image, Page, UUID } from '../types/api';

interface UseGalleryImagesResult {
  page: Page<Image>;
  isLoading: boolean;
  error: Error | null;
}

const EMPTY_PAGE: Page<Image> = {
  content: [],
  pageIdx: 0,
  pageSize: 0,
  totalPages: 0,
  totalElements: 0,
};

export function useGalleryImages(directoryId: UUID): UseGalleryImagesResult {
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