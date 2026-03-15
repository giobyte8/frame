import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';

interface GalleryErrorBoundaryProps {
  children: ReactNode;
}

interface GalleryErrorBoundaryState {
  hasError: boolean;
}

const S = {
  Wrapper: styled.div`
    border: 1px solid ${({ theme }) => theme.colors.dangerBorder};
    background: ${({ theme }) => theme.colors.dangerBg};
    color: ${({ theme }) => theme.colors.dangerText};
    border-radius: ${({ theme }) => theme.radius.md};
    padding: ${({ theme }) => theme.spacing.lg};
  `,
  Title: styled.h3`
    margin: 0 0 ${({ theme }) => theme.spacing.xs};
    font-size: 18px;
  `,
  Text: styled.p`
    margin: 0;
  `,
};

export class GalleryErrorBoundary extends Component<
  GalleryErrorBoundaryProps,
  GalleryErrorBoundaryState
> {
  public state: GalleryErrorBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError(): GalleryErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Gallery render error', error, errorInfo);
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <S.Wrapper>
          <S.Title>Unable to render gallery</S.Title>
          <S.Text>Please refresh the page and try again.</S.Text>
        </S.Wrapper>
      );
    }

    return this.props.children;
  }
}
