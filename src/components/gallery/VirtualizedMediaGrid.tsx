import { useWindowVirtualizer } from '@tanstack/react-virtual';
import React from 'react';
import styled from 'styled-components';
import { thumbsFor, ThumbWidth } from '../../services/thumbSvc';
import type { MediaItem } from '../../types/api';

interface VirtualizedMediaGridProps {
  mediaItems: MediaItem[];
}

const GRID_GAP_PX = 16;
const OVERSCAN_ITEMS = 16;
const ESTIMATED_ITEM_HEIGHT_PX = 320;

function getColumnCount(containerWidth: number): number {
  if (containerWidth <= 640) return 2;
  if (containerWidth <= 900) return 3;
  if (containerWidth <= 1200) return 4;
  if (containerWidth <= 1400) return 5;

  return 6;
}

const S = {
  Wrapper: styled.div`
    width: 100%;
  `,
  Canvas: styled.div`
    position: relative;
    width: 100%;
  `,
  Item: styled.figure<{ $left: number; $top: number; $width: number }>`
    position: absolute;
    left: ${({ $left }) => `${$left}px`};
    top: 0;
    width: ${({ $width }) => `${$width}px`};
    transform: translateY(${({ $top }) => `${$top}px`});
    margin: 0;
    display: inline-block;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radius.md};
    overflow: hidden;
    background: ${({ theme }) => theme.colors.surface};
    -webkit-column-break-inside: avoid;
    break-inside: avoid;
    will-change: transform;

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

const VirtualizedMediaGrid: React.FC<VirtualizedMediaGridProps> = ({ mediaItems }) => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = React.useState(1200);
  const [scrollMargin, setScrollMargin] = React.useState(0);

  React.useEffect(() => {
    const element = containerRef.current;

    if (!element) {
      return;
    }

    const updateWidth = () => {
      setContainerWidth(element.clientWidth || 1200);
    };

    const updateOffset = () => {
      const nextMargin = Math.max(0, element.getBoundingClientRect().top + window.scrollY);

      setScrollMargin(nextMargin);
    };

    updateWidth();
    updateOffset();

    const onResize = () => {
      updateWidth();
      updateOffset();
    };

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const columnCount = getColumnCount(containerWidth);
  const columnWidth = Math.max(
    (containerWidth - GRID_GAP_PX * (columnCount - 1)) / columnCount,
    0,
  );

  const itemVirtualizer = useWindowVirtualizer({
    count: mediaItems.length,
    estimateSize: () => ESTIMATED_ITEM_HEIGHT_PX,
    overscan: OVERSCAN_ITEMS,
    scrollMargin,
    lanes: columnCount,
    gap: GRID_GAP_PX,
    getItemKey: (index) => mediaItems[index]?.path ?? index,
    laneAssignmentMode: 'measured',
    useFlushSync: false,
    useAnimationFrameWithResizeObserver: true,
  });

  const virtualItems = itemVirtualizer.getVirtualItems();

  return (
    <S.Wrapper ref={containerRef}>
      <S.Canvas style={{ height: itemVirtualizer.getTotalSize() }}>
        {virtualItems.map((virtualItem) => {
          const media = mediaItems[virtualItem.index];

          if (!media) {
            return null;
          }

          const thumbnailUri = thumbsFor(media)[ThumbWidth.PX_512];
          const lane = virtualItem.lane;
          const left = lane * (columnWidth + GRID_GAP_PX);

          return (
            <S.Item
              key={virtualItem.key}
              data-index={virtualItem.index}
              ref={itemVirtualizer.measureElement}
              $left={left}
              $top={virtualItem.start - scrollMargin}
              $width={columnWidth}
            >
              <S.Image src={thumbnailUri} alt={media.path} loading="lazy" decoding="async" />
            </S.Item>
          );
        })}
      </S.Canvas>
    </S.Wrapper>
  );
};

export default VirtualizedMediaGrid;
