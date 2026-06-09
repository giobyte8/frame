import React from "react";
import { useEffect } from "react";
import styled from "styled-components";
import { isKeyboardSelect } from '../../../services/keyboardSvc';
import { thumbsFor, ThumbWidth } from '../../../services/thumbSvc';
import type { ViewerProps } from './types';

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
    cursor: pointer;

    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme.colors.textMuted};
      outline-offset: 2px;
    }
  `,
  Image: styled.img`
    object-fit: cover;
    width: 100%;
    height: 100%;
  `,
  Sentinel: styled.div`
    grid-column: 1 / -1;
    height: 1px;
    pointer-events: none;
  `,
};

const SquaredGrid: React.FC<ViewerProps> = ({
  mediaItems, hasMore, fetchMore, isLoading, selectedMediaIdx, selectMedia
}) => {
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry.isIntersecting && hasMore && !isLoading) {
          fetchMore();
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
  }, [fetchMore, hasMore, isLoading]);

  console.debug('Rendering SquaredGrid with %s items', mediaItems.length);
  console.debug('Selected media index: %s', selectedMediaIdx);

  return (
    <S.Grid>
      { mediaItems.map((mItem, idx) => {
        const thumbUri = thumbsFor(mItem)[ThumbWidth.PX_512];

        return <S.GridItem
          key={mItem.path}
          role="button"
          tabIndex={0}
          aria-label={`Open ${mItem.path}`}
          onClick={() => selectMedia(idx)}
          onKeyDown={(event) => {
            if (isKeyboardSelect(event)) {
              event.preventDefault();
              selectMedia(idx);
            }
          }}
        >
          <S.Image src={thumbUri} alt={mItem.path} loading="lazy" />
        </S.GridItem>;
      })}
      {hasMore && <S.Sentinel ref={sentinelRef} aria-hidden="true" />}
    </S.Grid>
  );
};

export default SquaredGrid;
