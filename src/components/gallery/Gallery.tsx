import { Alert, Empty, Skeleton } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { useGalleryImages } from "../../hooks/useGalleryImages";
import { thumbsFor, ThumbWidth } from "../../services/thumbSvc";
import type { ImageModel, UUID } from "../../types/api";

const S = {
  Masonry: styled.div`
    column-count: 4;
    column-gap: ${({ theme }) => theme.spacing.md};

    @media (max-width: 1200px) {
      column-count: 3;
    }

    @media (max-width: 900px) {
      column-count: 2;
    }

    @media (max-width: 640px) {
      column-count: 1;
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
  folderId: UUID
}


const Gallery: React.FC<GalleryProps> = ({ folderId }) => {
  const { page, isLoading, error } = useGalleryImages(folderId);

  if (isLoading) {
    return <Skeleton active paragraph={{ rows: 10 }} />;
  }

  if (error) {
    return <Alert
      type="error"
      showIcon
      title="Error loading gallery"
      description={error.message}
    />;
  }

  if (page.content.length === 0) {
    return <Empty description="No images found for this directory" />;
  }

  return (
    <S.Masonry>
      {page.content.map((image: ImageModel) => {
        const thumbnailUri = thumbsFor(image)[ThumbWidth.PX_512];

        return (
          <S.Item key={image.contentHash}>
            <S.Image src={thumbnailUri} alt={image.path} loading="lazy" />
          </S.Item>
        );
      })}
    </S.Masonry>
  );
}

export default Gallery;
