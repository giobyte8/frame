import type { MediaItem } from '../../../types/api';

export interface GridProps {
  mediaItems: MediaItem[];
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  onMediaClick: (media: MediaItem, index: number) => void;
}
