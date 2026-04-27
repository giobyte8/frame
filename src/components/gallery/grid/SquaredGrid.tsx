import React from "react";
import { useEffect } from "react";
import styled from "styled-components";
import type { MediaItem } from "../../../types/api";
import { thumbsFor, ThumbWidth } from '../../../services/thumbSvc';

const S = {
  Grid: styled.div`
    display: grid;
    gap: ${({ theme }) => theme.spacing.md};
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  `,
  GridItem: styled.div`
    background: ${({ theme }) => theme.colors.surface};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radius.md};
    height: 400px;
    overflow: hidden;
  `,
  Image: styled.img`
    object-fit: contain;
    width: 100%;
    height: 100%;
  `,
  Sentinel: styled.div`
    grid-column: 1 / -1;
    height: 1px;
    pointer-events: none;
  `,
};

interface SquaredGridProps {
  mediaItems: MediaItem[];
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
}

const SquaredGrid: React.FC<SquaredGridProps> = ({
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

  console.debug('Rendering SquaredGrid with %s items', mediaItems.length);

  return (
    <S.Grid>
      { mediaItems.map((mItem) => {
        const thumbUri = thumbsFor(mItem)[ThumbWidth.PX_512];

        return <S.GridItem key={mItem.path}>
          <S.Image src={thumbUri} alt={mItem.path} loading="lazy" />
        </S.GridItem>;
      })}
      {hasNextPage && <S.Sentinel ref={sentinelRef} aria-hidden="true" />}
    </S.Grid>
  );
};

export default SquaredGrid;
