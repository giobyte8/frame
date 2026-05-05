import React from 'react';
import { useEffect } from 'react';
import styled from 'styled-components';
import { thumbsFor, ThumbWidth } from '../../../services/thumbSvc';
import type { GridProps } from './types';

const S = {
  Masonry: styled.div`
    width: 100%;
    box-sizing: border-box;
    overflow-x: hidden;
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
  GridItem: styled.figure`
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
  Sentinel: styled.div`
    grid-column: 1 / -1;
    height: 1px;
    pointer-events: none;
  `,
};

const MasonryGrid: React.FC<GridProps> = ({
  mediaItems, hasNextPage, fetchNextPage, isFetchingNextPage
}) => {
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: '0px 0px 500px 0px',
        threshold: 0.1,
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <S.Masonry>
      {mediaItems.map((mItem) => {
        const thumbnailUri = thumbsFor(mItem)[ThumbWidth.PX_512];

        return <S.GridItem key={mItem.path}>
            <S.Image src={thumbnailUri} alt={mItem.path} loading="lazy" decoding="async" />
        </S.GridItem>
      })}
      {hasNextPage && <S.Sentinel ref={sentinelRef} aria-hidden="true" />}
    </S.Masonry>
  );
};

export default MasonryGrid;
