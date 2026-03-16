import styled from "styled-components";
import type { Directory } from "../../types/api";

interface DirectoriesGridProps {
  directories: Directory[];
}

const S = {
  Grid: styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: ${({ theme }) => theme.spacing.md};
  `,
  Card: styled.div`
    padding: ${({ theme }) => theme.spacing.md};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radius.md};
    background: ${({ theme }) => theme.colors.surface};
  `,
};

export function DirectoriesGrid({ directories }: DirectoriesGridProps) {
  return (
    <S.Grid>
      {directories.map((dir) => (
        <S.Card key={dir.id}>{dir.path}</S.Card>
      ))}
    </S.Grid>
  );
}
