import styled from 'styled-components';
import type { Image } from '../../types/api';

interface GalleryImageCardProps {
  image: Image;
}

const S = {
  Card: styled.figure`
    margin: 0;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radius.md};
    overflow: hidden;
    background: ${({ theme }) => theme.colors.surface};
  `,
  Image: styled.img`
    display: block;
    width: 100%;
    height: auto;
  `,
};

export function GalleryImageCard({ image }: GalleryImageCardProps) {
  return (
    <S.Card>
      <S.Image
        src={image.url}
        alt={image.id}
        loading="lazy"
        width={image.metadata.width}
        height={image.metadata.height}
      />
    </S.Card>
  );
}
