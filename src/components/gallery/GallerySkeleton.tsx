import styled from 'styled-components';

interface GallerySkeletonProps {
  count?: number;
}

const S = {
  Grid: styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: ${({ theme }) => theme.spacing.md};
  `,
  Card: styled.div`
    width: 100%;
    aspect-ratio: 4 / 5;
    border-radius: ${({ theme }) => theme.radius.md};
    border: 1px solid ${({ theme }) => theme.colors.border};
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.colors.background} 25%,
      ${({ theme }) => theme.colors.surface} 50%,
      ${({ theme }) => theme.colors.background} 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.2s infinite;

    @keyframes shimmer {
      from {
        background-position: 200% 0;
      }
      to {
        background-position: -200% 0;
      }
    }
  `,
};

export function GallerySkeleton({ count = 12 }: GallerySkeletonProps) {
  return (
    <S.Grid>
      {Array.from({ length: count }).map((_, index) => (
        <S.Card key={index} />
      ))}
    </S.Grid>
  );
}
