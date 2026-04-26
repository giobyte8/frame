import { Alert, Empty, Skeleton } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { DirectoriesGrid } from '../directories/DirectoriesGrid';
import { useDirectories } from '../../hooks/useDirectories';
import { useGalleryMedia } from "../../hooks/useGalleryMedia";
import { thumbsFor, ThumbWidth } from "../../services/thumbSvc";
import type { MediaItem, UUID } from "../../types/api";

const S = {
  Wrapper: styled.div`
    display: grid;
    gap: ${({ theme }) => theme.spacing.lg};
  `,
  Masonry: styled.div`
    column-count: 6;
    column-gap: ${({ theme }) => theme.spacing.md};

    @media (max-width: 1400px) {
      column-count: 5;
    }

    @media (max-width: 1200px) {
      column-count: 4;
    }

    @media (max-width: 900px) {
      column-count: 3;
    }

    @media (max-width: 640px) {
      column-count: 2;
    }
  `,
  Item: styled.figure`
    display: inline-block;
    width: 100%;
    margin-top: 0;
    margin: 0 0 ${({ theme }) => theme.spacing.md};
    -webkit-column-break-inside: avoid;
    break-inside: avoid;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radius.md};
    overflow: hidden;
    background: ${({ theme }) => theme.colors.surface};

    &:first-child {
      margin-top: 0;
    }
  `,
  Image: styled.img`
    display: block;
    width: 100%;
    height: auto;
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
        <S.Masonry>
          {mediaPage.content.map((media: MediaItem) => {
            const thumbnailUri = thumbsFor(media)[ThumbWidth.PX_512];

            return (
              <S.Item key={media.path}>
                <S.Image src={thumbnailUri} alt={media.path} loading="lazy" />
              </S.Item>
            );
          })}
        </S.Masonry>
      )}
    </S.Wrapper>
  );
}

export default Gallery;
