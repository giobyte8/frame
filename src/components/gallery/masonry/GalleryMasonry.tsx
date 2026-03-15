import styled from 'styled-components';
import type { Image } from '../../../types/api';
import { GalleryImageCard } from '../GalleryImageCard';

interface GalleryMasonryProps {
  images: Image[];
}

const S = {
  Wrapper: styled.div`
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
  Item: styled.div`
    break-inside: avoid;
    margin-bottom: ${({ theme }) => theme.spacing.md};
  `,
};

export function GalleryMasonry({ images }: GalleryMasonryProps) {
  return (
    <S.Wrapper>
      {images.map((image) => (
        <S.Item key={image.id}>
          <GalleryImageCard image={image} />
        </S.Item>
      ))}
    </S.Wrapper>
  );
}
