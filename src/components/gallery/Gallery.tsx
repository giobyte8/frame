import React, { createContext, useState } from 'react';

import SquaredGrid from './viewer/SquaredGrid';
import MasonryGrid from './viewer/MasonryGrid';
import Slider from './viewer/Slider';
import { useDirectories } from '../../hooks/useDirectories';
import { useGalleryMedia, type GalleryMedia } from '../../hooks/useGalleryMedia';
import { DirectoriesGrid } from '../directories/DirectoriesGrid';

import type { UUID } from '../../types/api';


// Available display modes for the gallery
export type DisplayMode = 'squared' | 'masonry' | 'slider';

interface GalleryProps { directoryId: UUID }

interface GalleryState {
  media: GalleryMedia;

  displayMode: DisplayMode;
  setDisplayMode: (mode: DisplayMode) => void;

  prevDisplayMode: DisplayMode;
  setPrevDisplayMode: (mode: DisplayMode) => void;

  selectedMediaIdx: number;
  setSelectedMediaIdx: (idx: number) => void;
}

const defGalleryState: GalleryState = {
  media: {
    items: [],
    isLoading: true,
    isLoadingMore: false,
    error: null,
    canFetchMore: false,
    fetchMore: () => {},
  },

  displayMode: 'squared',
  setDisplayMode: _ => {},

  prevDisplayMode: 'squared',
  setPrevDisplayMode: _ => {},

  selectedMediaIdx: 0,
  setSelectedMediaIdx: _ => {},
};

export const GalleryCtx = createContext<GalleryState>(defGalleryState);

const Gallery: React.FC<GalleryProps> = ({ directoryId }) => {
  const [selectedMediaIdx, setSelectedMediaIdx] = useState<number>(0);
  const [displayMode, setDisplayMode] = useState<DisplayMode>('squared');
  const [prevDisplayMode, setPrevDisplayMode] = useState<DisplayMode>('squared');

  const media = useGalleryMedia(directoryId);

  const galleryState: GalleryState = {
    media,
    displayMode, setDisplayMode,
    prevDisplayMode, setPrevDisplayMode,
    selectedMediaIdx, setSelectedMediaIdx,
  };

  const { page: directoriesPage } = useDirectories(directoryId);

  // if (isLoadingMedia || isLoadingDirectories) {
  //   return <Skeleton active paragraph={{ rows: 10 }} />;
  // }

  // const error = mediaError ?? directoriesError;
  // if (error) {
  //   return <Alert type="error" showIcon title="Error loading gallery" description={error.message} />;
  // }

  // if (!mediaItems.length && !directoriesPage.content.length) {
  //   return <Empty description="No media found for this directory" />;
  // }

  switch (displayMode) {
    case 'squared':
      return <GalleryCtx value={ galleryState }>
        {directoriesPage.content.length > 0 && (
          <DirectoriesGrid directories={directoriesPage.content} />
        )}

        <SquaredGrid/>
      </GalleryCtx>;

    // case 'masonry':
    //   return <>
    //     {directoriesPage.content.length > 0 && (
    //       <DirectoriesGrid directories={directoriesPage.content} />
    //     )}

    //     <MasonryGrid {...viewerProps} />
    //   </>;

    case 'slider':
      return <GalleryCtx value={ galleryState }>
        <Slider />
      </GalleryCtx>;
  }
};

export default Gallery;
