import styled from 'styled-components';
import type { Image } from '../../../types/api';
import { GalleryImageCard } from '../GalleryImageCard';

interface GalleryGridProps {
  images: Image[];
}

const S = {
  Grid: styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: ${({ theme }) => theme.spacing.md};
  `,
};

export function GalleryGrid({ images }: GalleryGridProps) {
  return (
    <S.Grid>
      {images.map((image) => (
        <GalleryImageCard key={image.id} image={image} />
      ))}
    </S.Grid>
  );
}
