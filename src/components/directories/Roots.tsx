import { styled } from "styled-components";

import { useRoots } from "../../hooks/useRoots";
import { DirectoriesGrid } from "./DirectoriesGrid";

const S = {
  Wrapper: styled.div`
    padding: ${({ theme }) => theme.spacing.md};
  `,
};

export function Roots() {
  const { roots, isLoading, error } = useRoots();

  if (isLoading) {
    return <div>Loading directories...</div>;
  }

  if (error) {
    return <div>Error loading directories: {error.message}</div>;
  }

  return (
    <S.Wrapper>
      <DirectoriesGrid directories={roots} />
    </S.Wrapper>
  );
}
