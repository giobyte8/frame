import React, { useCallback, useContext, useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';

import type { GalleryMedia } from "../../../hooks/useGalleryMedia";
import Toolbar from "../Toolbar";
import { isKeyboardSelect } from '../../../services/keyboardSvc';
import { thumbsFor, ThumbWidth } from '../../../services/thumbSvc';
import { GalleryCtx } from "../Gallery";
import { useScrollToSelectedItem } from './useScrollToSelectedItem';

const S = {
  Grid: styled.div`
    display: grid;
    gap: ${({ theme }) => theme.spacing.md};
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    padding: ${({ theme }) => theme.spacing.md};
  `,

  GridItem: styled.div<{ isSelected: boolean }>`
    background: ${({ theme }) => theme.colors.surface};
    // border: 1px solid ${({ theme }) => theme.colors.border};
    // border-radius: ${({ theme }) => theme.radius.md};
    height: 300px;
    overflow: hidden;
    cursor: pointer;

    ${({ isSelected, theme }) => isSelected && css`
      // border: 1px solid ${theme.colors.dangerBorder};
    `}

    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme.colors.textMuted};
      outline-offset: 2px;
    }
  `,

  TBWrapper: styled.div`
    position: sticky;
    bottom: 0;
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

/**
 * Setups a sentinel observer to fetch more media items when the sentinel
 * is visible (or close to be) in the viewport.
 *
 * Use this for infinite scrolling in the gallery.
 *
 * @param media Current gallery media
 */
const useSentinelObserver = (media: GalleryMedia):
    React.RefObject<HTMLDivElement | null> => {
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !media.canFetchMore) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry.isIntersecting && media.canFetchMore && !media.isLoadingMore) {
          media.fetchMore();
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
  }, [media.fetchMore, media.canFetchMore, media.isLoadingMore]);

  return sentinelRef;
}

const SquaredGrid: React.FC = _ => {
  const {
    media,
    selectedMediaIdx, setSelectedMediaIdx,
    setPrevDisplayMode, setDisplayMode
  } = useContext(GalleryCtx);
  const sentinelRef = useSentinelObserver(media);
  const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const openMedia = useCallback((idx: number) => {
    setSelectedMediaIdx(idx);

    setPrevDisplayMode('squared');
    setDisplayMode('slider');
  }, [setSelectedMediaIdx, setPrevDisplayMode, setDisplayMode]);

  // Stores grid item references in a map, so that scroll position
  // can be restored when rendering the grid view after Slider
  const setItemRef = useCallback((idx: number, element: HTMLDivElement | null) => {
    if (element) {
      itemRefs.current.set(idx, element);
      return;
    }

    itemRefs.current.delete(idx);
  }, []);

  // Scrolls to the selected item when the component is mounted
  // or when the selected index changes
  useScrollToSelectedItem({
    selectedMediaIdx,
    itemsLength: media.items.length,
    itemRefs,
  });

  console.debug('Rendering SquaredGrid with %s items', media.items.length);
  console.debug('Selected media index: %s', selectedMediaIdx);

  return <>
    <S.Grid>
      { media.items.map((mItem, idx) => {
        const thumbUri = thumbsFor(mItem)[ThumbWidth.PX_512];

        return <S.GridItem
          key={mItem.path}
          role="button"
          tabIndex={0}
          aria-label={`Open ${mItem.path}`}

          isSelected={selectedMediaIdx === idx}
          ref={(element) => setItemRef(idx, element)}
          onClick={() => openMedia(idx)}
          onKeyDown={(event) => {
            if (isKeyboardSelect(event)) {
              event.preventDefault();
              openMedia(idx);
            }
          }}
        >
          <S.Image src={thumbUri} alt={mItem.path} loading="lazy" />
        </S.GridItem>;
      })}

      {media.canFetchMore && <S.Sentinel ref={sentinelRef} aria-hidden="true" />}
    </S.Grid>

    <S.TBWrapper>
      <Toolbar />
    </S.TBWrapper>
  </>;
};

export default SquaredGrid;
