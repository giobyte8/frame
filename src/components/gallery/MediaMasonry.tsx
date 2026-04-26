import React from 'react';
import styled from 'styled-components';
import { thumbsFor, ThumbWidth } from '../../services/thumbSvc';
import type { MediaItem } from '../../types/api';

interface MediaMasonryProps {
  mediaItems: MediaItem[];
}

const S = {
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

const MediaMasonry: React.FC<MediaMasonryProps> = ({ mediaItems }) => {
  return (
    <S.Masonry>
      {mediaItems.map((media) => {
        const thumbnailUri = thumbsFor(media)[ThumbWidth.PX_512];

        return (
          <S.Item key={media.path}>
            <S.Image src={thumbnailUri} alt={media.path} loading="lazy" decoding="async" />
          </S.Item>
        );
      })}
    </S.Masonry>
  );
};

export default MediaMasonry;
