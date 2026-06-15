import { Alert, Empty, Skeleton } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useDirectories } from '../../hooks/useDirectories';
import { useGalleryMedia } from '../../hooks/useGalleryMedia';
import type { UUID } from '../../types/api';

import { DirectoriesGrid } from '../directories/DirectoriesGrid';
import SquaredGrid from './viewer/SquaredGrid';
import MasonryGrid from './viewer/MasonryGrid';
import Slider from './viewer/Slider';
import type { ViewerProps } from './viewer/types';

const S = {
  Wrapper: styled.div`
    display: grid;
    gap: ${({ theme }) => theme.spacing.lg};
  `,
};

// Available display modes for the gallery
type DisplayMode = 'squared' | 'masonry' | 'slider';

interface GalleryProps {
  directoryId: UUID
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
    selectedMediaIdx,
    selectMedia: idx => {
      setSelectedMediaIdx(idx);

      if (displayMode !== 'slider') {
        setPrevDisplayMode(displayMode);
        setDisplayMode('slider');
      }
    },
  };

  switch (displayMode) {
    case 'squared':
      return <S.Wrapper>
        {directoriesPage.content.length > 0 && (
          <DirectoriesGrid directories={directoriesPage.content} />
        )}

        <SquaredGrid {...viewerProps} />
      </S.Wrapper>;

    case 'masonry':
      return <S.Wrapper>
        {directoriesPage.content.length > 0 && (
          <DirectoriesGrid directories={directoriesPage.content} />
        )}

        <MasonryGrid {...viewerProps} />
      </S.Wrapper>;

    case 'slider':
      return <Slider
        {...viewerProps}
        onClose={() => setDisplayMode(prevDisplayMode)}
      />;
  }
};

export default Gallery;
