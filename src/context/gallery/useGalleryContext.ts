import { useContext } from 'react';
import { GalleryContext } from './GalleryState';
import type { GalleryContextValue } from './GalleryState';

export function useGalleryContext(): GalleryContextValue {
  const context = useContext(GalleryContext);

  if (!context) {
    throw new Error('useGalleryContext must be used within a GalleryProvider');
  }

  return context;
}
