import type { MediaItem } from '../../../types/api';

export interface ViewerProps {
  mediaItems: MediaItem[];
  isLoading: boolean;
  hasMore: boolean;
  fetchMore: () => void;

  selectedMediaIdx: number;
}

export interface GridViewerProps extends ViewerProps {
  openMedia: (idx: number) => void;
}

export interface SliderViewerProps extends ViewerProps {
  onClose: () => void;
}
