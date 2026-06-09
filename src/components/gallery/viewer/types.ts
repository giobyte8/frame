import type { MediaItem } from '../../../types/api';

export interface ViewerProps {
  mediaItems: MediaItem[];
  isLoading: boolean;
  hasMore: boolean;
  fetchMore: () => void;

  selectedMediaIdx: number | null;
  selectMedia: (idx: number) => void;
}
