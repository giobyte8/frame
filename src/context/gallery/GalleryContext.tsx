import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { GalleryContext } from './GalleryState';
import type { GalleryLayout } from './GalleryState';

interface GalleryProviderProps {
  children: ReactNode;
}

export function GalleryProvider({ children }: GalleryProviderProps) {
  const [layout, setLayout] = useState<GalleryLayout>('grid');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  const value = useMemo(
    () => ({
      layout,
      selectedFolderId,
      setLayout,
      setSelectedFolderId,
    }),
    [layout, selectedFolderId],
  );

  return <GalleryContext.Provider value={value}>{children}</GalleryContext.Provider>;
}
