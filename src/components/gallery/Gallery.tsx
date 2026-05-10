import { Alert, Empty, Skeleton } from 'antd';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useDirectories } from '../../hooks/useDirectories';
import { useGalleryMediaInfinite } from '../../hooks/useGalleryMedia';
import { useMediaViewer } from '../../hooks/useMediaViewer';
import type { UUID } from '../../types/api';
import { DirectoriesGrid } from '../directories/DirectoriesGrid';
import MediaViewer from './viewer/MediaViewer';
import SquaredGrid from './grid/SquaredGrid';

const S = {
  Wrapper: styled.div`
    display: grid;
    gap: ${({ theme }) => theme.spacing.lg};
  `,
};

interface GalleryProps {
  directoryId: UUID
}


const Gallery: React.FC<GalleryProps> = ({ directoryId }) => {
  const {
    page: directoriesPage,
    isLoading: isLoadingDirectories,
    error: directoriesError,
  } = useDirectories(directoryId);

  // Fetch media items for current directory
  const infiniteMedia = useGalleryMediaInfinite(directoryId);

  // Join (flatten) all media items from paginated results
  // useMemo avoids re-flattening the pages array on every render
  const mediaItems = useMemo(
    () => infiniteMedia.pages?.flatMap(page => page.content) ?? [],
    [infiniteMedia.pages]
  );
  const totalCount = infiniteMedia.pages?.[0]?.totalElements ?? mediaItems.length;

  const viewer = useMediaViewer({
    mediaItems,
    hasNextPage: infiniteMedia.hasNextPage,
    isFetchingNextPage: infiniteMedia.isFetchingNextPage,
    fetchNextPage: infiniteMedia.fetchNextPage,
    directoryId,
  });

  if (infiniteMedia.isLoading || isLoadingDirectories) {
    return <Skeleton active paragraph={{ rows: 10 }} />;
  }

  const error = infiniteMedia.error ?? directoriesError;
  if (error) {
    return <Alert type="error" showIcon title="Error loading gallery" description={error.message} />;
  }

  if (!mediaItems.length && !directoriesPage.content.length) {
    return <Empty description="No media found for this directory" />;
  }

  return (
    <>
      <S.Wrapper>
        {directoriesPage.content.length > 0 && (
          <DirectoriesGrid directories={directoriesPage.content} />
        )}

        <SquaredGrid
          mediaItems={mediaItems}
          hasNextPage={infiniteMedia.hasNextPage}
          fetchNextPage={infiniteMedia.fetchNextPage}
          isFetchingNextPage={infiniteMedia.isFetchingNextPage}
          onMediaClick={viewer.open}
        />
      </S.Wrapper>

      <MediaViewer
        isOpen={viewer.isOpen}
        media={viewer.activeMedia}
        activeIndex={viewer.activeIdx}
        totalCount={totalCount}
        hasPrev={viewer.hasPrev}
        hasNext={viewer.hasNext}
        isLoadingAdjacent={viewer.isLoadingAdjacent}
        onClose={viewer.close}
        onPrev={viewer.prev}
        onNext={viewer.next}
      />
    </>
  );
};

export default Gallery;
