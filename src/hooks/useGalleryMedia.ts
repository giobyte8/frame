import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { fetchImages, fetchMedia, fetchMediaPage } from '../api/images';
import type { Image, MediaItem, Page, UUID } from '../types/api';


interface PaginatedResult<T> {
  page: Page<T>;
  isLoading: boolean;
  error: Error | null;
}

interface InfiniteResult<T> {
  pages: Page<T>[];
  isLoading: boolean;
  error: Error | null;
  fetchNextPage: () => void;
  hasNextPage: boolean;
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

export function useGalleryMediaInfinite(
  directoryId: UUID,
  recursive: boolean = true
): InfiniteResult<MediaItem> {
  const PG_SIZE = 10;
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['galleryMediaInfinite', directoryId],
    queryFn: ({ pageParam = 0 }) => fetchMediaPage(
      directoryId,
      recursive,
      pageParam,
      PG_SIZE
    ),
    initialPageParam: 0,
    getNextPageParam: (lastPage: Page<MediaItem>) => {
      const nextPage = lastPage.pageIdx + 1;
      return nextPage < lastPage.totalPages ? nextPage : undefined;
    },
  });

  return {
    pages: data?.pages ?? [],
    isLoading,
    error: error instanceof Error ? error : null,
    fetchNextPage,
    hasNextPage,
  };
}
