import { Alert, Empty, Skeleton } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { useDirectories } from '../../hooks/useDirectories';
import { useGalleryMediaInfinite } from '../../hooks/useGalleryMedia';
import type { UUID } from '../../types/api';
import { DirectoriesGrid } from '../directories/DirectoriesGrid';
import SquaredGrid from './grid/SquaredGrid';

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
  const {
    page: directoriesPage,
    isLoading: isLoadingDirectories,
    error: directoriesError,
  } = useDirectories(directoryId);

  // Fetch media items for current directory
  const infiniteMedia = useGalleryMediaInfinite(directoryId);

  if (infiniteMedia.isLoading || isLoadingDirectories) {
    return <Skeleton active paragraph={{ rows: 10 }} />;
  }

  if (infiniteMedia.error || directoriesError) {
    const error = infiniteMedia.error ?? directoriesError;

    return <Alert
      type="error"
      showIcon
      title="Error loading gallery"
      description={error?.message}
    />;
  }

  if (!infiniteMedia.pages?.[0]?.content.length && !directoriesPage.content.length) {
    return <Empty description="No media found for this directory" />;
  }

  // Join (flatten) all media items from paginated results
  const mediaItems = infiniteMedia.pages?.flatMap(page => page.content) ?? [];

  return (
    <S.Wrapper>
      {directoriesPage.content.length > 0 && <DirectoriesGrid directories={directoriesPage.content} />}

      <SquaredGrid
        mediaItems={mediaItems}
        hasNextPage={infiniteMedia.hasNextPage}
        fetchNextPage={infiniteMedia.fetchNextPage}
      />
    </S.Wrapper>
  );
};

export default Gallery;
