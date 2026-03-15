import { createContext } from 'react';

export type GalleryLayout = 'grid' | 'masonry';

export interface GalleryContextValue {
  layout: GalleryLayout;
  selectedFolderId: string | null;
  setLayout: (layout: GalleryLayout) => void;
  setSelectedFolderId: (folderId: string | null) => void;
}

export const GalleryContext = createContext<GalleryContextValue | undefined>(undefined);
