import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchMediaPage } from '../api/images';
import type { MediaItem, Page, UUID } from '../types/api';


export interface GalleryMedia {
  items: MediaItem[];
  /** True on the initial fetch. */
  isLoading: boolean;
  /** True while fetching a subsequent page. */
  isLoadingMore: boolean;
  error: Error | null;

  canFetchMore: boolean;
  fetchMore: () => void;
}

export function useGalleryMedia(
  directoryId: UUID,
  recursive: boolean = true
): GalleryMedia {
  const PAGE_SIZE = 10;
  console.debug('Using gallery media');

  // Fetch media via 'useInfiniteQuery'
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['galleryMediaInfinite', directoryId],
    queryFn: ({ pageParam = 0 }) => fetchMediaPage(
      directoryId,
      recursive,
      pageParam,
      PAGE_SIZE
    ),
    initialPageParam: 0,
    getNextPageParam: (lastPage: Page<MediaItem>) => {
      const nextPage = lastPage.pageIdx + 1;
      return nextPage < lastPage.totalPages ? nextPage : undefined;
    },
  });

  // Flatten paginated results into a single array of media items
  const mediaItems = data?.pages?.flatMap(page => page.content) ?? [];

  return {
    items: mediaItems,
    isLoading,
    isLoadingMore: isFetchingNextPage,
    error: error instanceof Error ? error : null,

    canFetchMore: hasNextPage,
    fetchMore: fetchNextPage,
  };
}
