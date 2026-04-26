import { Alert, Empty, Skeleton } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { env } from '../../config/env';
import { useDirectories } from '../../hooks/useDirectories';
import { useGalleryMedia } from '../../hooks/useGalleryMedia';
import type { UUID } from '../../types/api';
import { DirectoriesGrid } from '../directories/DirectoriesGrid';
import MediaMasonry from './MediaMasonry';
import VirtualizedMediaGrid from './VirtualizedMediaGrid';

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
  const { page: mediaPage, isLoading: isLoadingMedia, error: mediaError } = useGalleryMedia(directoryId);
  const {
    page: directoriesPage,
    isLoading: isLoadingDirectories,
    error: directoriesError,
  } = useDirectories(directoryId);

  if (isLoadingMedia || isLoadingDirectories) {
    return <Skeleton active paragraph={{ rows: 10 }} />;
  }

  if (mediaError || directoriesError) {
    const error = mediaError ?? directoriesError;

    return <Alert
      type="error"
      showIcon
      title="Error loading gallery"
      description={error?.message}
    />;
  }

  if (mediaPage.content.length === 0 && directoriesPage.content.length === 0) {
    return <Empty description="No media found for this directory" />;
  }

  return (
    <S.Wrapper>
      {directoriesPage.content.length > 0 && <DirectoriesGrid directories={directoriesPage.content} />}

      {mediaPage.content.length > 0 && (
        env.featureVirtualGallery
          ? <VirtualizedMediaGrid mediaItems={mediaPage.content} />
          : <MediaMasonry mediaItems={mediaPage.content} />
      )}
    </S.Wrapper>
  );
};

export default Gallery;
