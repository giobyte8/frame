import {
  Alert,
  Divider,
  Empty,
  Skeleton
} from 'antd';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import SquaredGrid from './viewer/SquaredGrid';
import MasonryGrid from './viewer/MasonryGrid';
import Slider from './viewer/Slider';
import { useDirectories } from '../../hooks/useDirectories';
import { useGalleryMedia } from '../../hooks/useGalleryMedia';
import { DirectoriesGrid } from '../directories/DirectoriesGrid';

import type { UUID } from '../../types/api';
import type { ViewerProps } from './viewer/types';

const S = {
  GridWrapper: styled.div`
    display: grid;
    gap: ${({ theme }) => theme.spacing.lg};
    padding: ${({ theme }) => theme.spacing.md};
  `,
};

// Available display modes for the gallery
type DisplayMode = 'squared' | 'masonry' | 'slider';

interface GalleryProps {
  directoryId: UUID
}

/**
 * Setups keyboard navigation for all display modes
 */
function useKeyboardNav(
  selectedMediaIdx: number,
  setSelectedMediaIdx: (idx: number) => void,

  mediaItemsCount: number,
  loadingMore: boolean,
  hasMore: boolean,
  fetchMore: () => void
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {

      if (e.key === 'ArrowLeft' && selectedMediaIdx > 0) {
        e.preventDefault();
        setSelectedMediaIdx(selectedMediaIdx - 1);
      }

      else if (e.key === 'ArrowRight' && selectedMediaIdx < mediaItemsCount - 1) {
        e.preventDefault();
        setSelectedMediaIdx(selectedMediaIdx + 1);

        // Load more?
        const reachingEnd = selectedMediaIdx >= mediaItemsCount - 10;
        if (reachingEnd && hasMore && !loadingMore) {
          fetchMore();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMediaIdx, setSelectedMediaIdx, mediaItemsCount, hasMore, loadingMore, fetchMore]);
}


const Gallery: React.FC<GalleryProps> = ({ directoryId }) => {
  const [selectedMediaIdx, setSelectedMediaIdx] = useState<number>(0);

  const [displayMode, setDisplayMode] = useState<DisplayMode>('squared');
  const [prevDisplayMode, setPrevDisplayMode] = useState<DisplayMode>('squared');

  const {
    page: directoriesPage,
    isLoading: isLoadingDirectories,
    error: directoriesError,
  } = useDirectories(directoryId);

  const {
    items: mediaItems,
    isLoading: isLoadingMedia,
    isLoadingMore: isLoadingMoreMedia,
    error: mediaError,
    hasMore,
    fetchMore,
  } = useGalleryMedia(directoryId);



  useKeyboardNav(
    selectedMediaIdx,
    setSelectedMediaIdx,
    mediaItems.length,
    isLoadingMoreMedia,
    hasMore,
    fetchMore
  );


  if (isLoadingMedia || isLoadingDirectories) {
    return <Skeleton active paragraph={{ rows: 10 }} />;
  }

  const error = mediaError ?? directoriesError;
  if (error) {
    return <Alert type="error" showIcon title="Error loading gallery" description={error.message} />;
  }

  if (!mediaItems.length && !directoriesPage.content.length) {
    return <Empty description="No media found for this directory" />;
  }

  // Prepare viewer props for selected media viewer
  var viewerProps: ViewerProps = {
    mediaItems,
    hasMore,
    fetchMore,
    isLoading: isLoadingMoreMedia,
    selectedMediaIdx
  };

  switch (displayMode) {
    case 'squared':
      return <>
        {directoriesPage.content.length > 0 && (
          <DirectoriesGrid directories={directoriesPage.content} />
        )}

        <SquaredGrid
          {...viewerProps}
          openMedia={(idx) => {
            setSelectedMediaIdx(idx);

            setPrevDisplayMode(displayMode);
            setDisplayMode('slider');
          }}
        />
      </>;

    case 'masonry':
      return <S.GridWrapper>
        {directoriesPage.content.length > 0 && (
          <DirectoriesGrid directories={directoriesPage.content} />
        )}

        <MasonryGrid {...viewerProps} />
      </S.GridWrapper>;

    case 'slider':
      return <Slider
        {...viewerProps}
        onClose={() => setDisplayMode(prevDisplayMode)}
      />;
  }
};

export default Gallery;
