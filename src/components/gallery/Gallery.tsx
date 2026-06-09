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

const S = {
  Wrapper: styled.div`
    display: grid;
    gap: ${({ theme }) => theme.spacing.lg};
  `,
};

interface GalleryProps {
  directoryId: UUID
}


const Gallery: React.FC<GalleryProps> = ({ directoryId }) => {
  const [selectedMediaIdx, setSelectedMediaIdx] = useState<number | null>(null);

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

  if (selectedMediaIdx !== null) {
    return (
      <Slider
        mediaItems={mediaItems}
        hasMore={hasMore}
        fetchMore={fetchMore}
        isLoading={isLoadingMoreMedia}
        selectedMediaIdx={selectedMediaIdx}
        selectMedia={idx => setSelectedMediaIdx(idx)}
      />
    );
  }

  return (
    <S.Wrapper>
      {directoriesPage.content.length > 0 && (
        <DirectoriesGrid directories={directoriesPage.content} />
      )}

      <SquaredGrid
        mediaItems={mediaItems}
        hasMore={hasMore}
        fetchMore={fetchMore}
        isLoading={isLoadingMoreMedia}

        selectedMediaIdx={selectedMediaIdx}
        selectMedia={idx => setSelectedMediaIdx(idx)}
      />
    </S.Wrapper>
  );
};

export default Gallery;
