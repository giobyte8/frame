import styled from "styled-components";
import { useNavigate } from "react-router-dom";
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
  Card: styled.button`
    width: 100%;
    text-align: left;
    cursor: pointer;
    padding: ${({ theme }) => theme.spacing.md};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radius.md};
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.textPrimary};

    &:hover {
      border-color: ${({ theme }) => theme.colors.textMuted};
    }
  `,
};

export function DirectoriesGrid({ directories }: DirectoriesGridProps) {
  const navigate = useNavigate();

  return (
    <S.Grid>
      {directories.map((dir) => (
        <S.Card key={dir.id} type="button" onClick={() => navigate(`/gallery/${dir.id}`)}>
          {dir.path}
        </S.Card>
      ))}
    </S.Grid>
  );
}
