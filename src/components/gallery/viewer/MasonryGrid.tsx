import { Masonry } from 'antd';
import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';

import { GalleryCtx } from '../Gallery';
import { isKeyboardSelect } from '../../../services/keyboardSvc';
import { thumbsFor, ThumbWidth } from '../../../services/thumbSvc';

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
    cursor: pointer;

    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme.colors.textMuted};
      outline-offset: 3px;
    }

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

const MasonryGrid: React.FC = _ => {
  console.info('Rendering MasonryGrid');

  const {
    media,
    selectedMediaIdx, setSelectedMediaIdx,
    setPrevDisplayMode, setDisplayMode
  } = useContext(GalleryCtx);

  // const sentinelRef = React.useRef<HTMLDivElement | null>(null);
  // useEffect(() => {
  //   const sentinel = sentinelRef.current;
  //   if (!sentinel || !hasMore) {
  //     return;
  //   }

  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       const [entry] = entries;

  //       if (entry.isIntersecting && hasMore && !isLoading) {
  //         fetchMore();
  //       }
  //     },
  //     {
  //       root: null,
  //       rootMargin: '0px 0px 500px 0px',
  //       threshold: 0.1,
  //     }
  //   );

  //   observer.observe(sentinel);

  //   return () => {
  //     observer.disconnect();
  //   };
  // }, [fetchMore, hasMore, isLoading]);

  console.debug('Rendering MasonryGrid with %s items', media.items.length);
  console.debug('Selected media index: %s', selectedMediaIdx);

  // return (
  //   <S.Masonry>
  //     {media.items.map((mItem, idx) => {
  //       const thumbnailUri = thumbsFor(mItem)[ThumbWidth.PX_512];

  //       return <S.GridItem
  //           key={mItem.path}
  //           role="button"
  //           tabIndex={0}
  //           aria-label={`Open ${mItem.path}`}
  //           // onClick={() => selectMedia(idx)}
  //           // onKeyDown={(event) => {
  //           //   if (isKeyboardSelect(event)) {
  //           //     event.preventDefault();
  //           //     selectMedia(idx);
  //           //   }
  //           // }}
  //         >
  //           <S.Image src={thumbnailUri} alt={mItem.path} loading="lazy" decoding="async" />
  //       </S.GridItem>
  //     })}

  //     {/* {hasMore && <S.Sentinel ref={sentinelRef} aria-hidden="true" />} */}
  //   </S.Masonry>
  // );

  return <Masonry
    columns={4}
    gutter={16}
    items={ media.items.map((mItem, idx) => ({
      key: mItem.path,
      data: mItem,
    }) )}

    itemRender={ ({ data: mItem }) => {
      const thumbUri = thumbsFor(mItem)[ThumbWidth.PX_512];
      return <S.Image src={thumbUri} alt={mItem.path} loading="lazy" decoding="async" />;
    }}
  />;
};

export default MasonryGrid;
