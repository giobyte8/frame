import React from "react";
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
};

interface SquaredGridProps {
  mediaItems: MediaItem[];
  hasNextPage: boolean;
  fetchNextPage: () => void;
}

const SquaredGrid: React.FC<SquaredGridProps> = ({
  mediaItems, hasNextPage, fetchNextPage
}) => {
  console.debug('Rendering SquaredGrid with %s items', mediaItems.length);

  return (
    <S.Grid>
      { mediaItems.map((mItem) => {
        const thumbUri = thumbsFor(mItem)[ThumbWidth.PX_512];

        return <S.GridItem key={mItem.path}>
          <S.Image src={thumbUri} alt={mItem.path} />
        </S.GridItem>;
      })}
      {hasNextPage && <S.GridItem key="load-more">
        <button onClick={fetchNextPage}>Load More</button>
      </S.GridItem>}
    </S.Grid>
  );
};

export default SquaredGrid;
