import { useEffect } from 'react';
import { Select } from 'antd';
import styled from 'styled-components';
import { useGalleryContext } from '../../context/gallery/useGalleryContext';
import { useGalleries } from '../../hooks/useGalleries';
import { GalleryGrid } from './grid/GalleryGrid';
import { GalleryMasonry } from './masonry/GalleryMasonry';
import { GallerySkeleton } from './GallerySkeleton';

const S = {
  Wrapper: styled.section`
    display: grid;
    gap: ${({ theme }) => theme.spacing.lg};
  `,
  Controls: styled.div`
    display: flex;
    justify-content: flex-end;
  `,
  FolderSelect: styled(Select)`
    min-width: 240px;
  `,
  EmptyState: styled.p`
    margin: 0;
    color: ${({ theme }) => theme.colors.textMuted};
  `,
};

export function GalleryViewer() {
  const { layout, selectedFolderId, setSelectedFolderId } = useGalleryContext();
  const { folders, images, isLoadingFolders, isLoadingImages, error } = useGalleries(selectedFolderId);

  useEffect(() => {
    if (!selectedFolderId && folders.length > 0) {
      setSelectedFolderId(folders[0].id);
    }
  }, [folders, selectedFolderId, setSelectedFolderId]);

  if (error) {
    throw error;
  }

  return (
    <S.Wrapper>
      <S.Controls>
        <S.FolderSelect
          placeholder="Select folder"
          value={selectedFolderId ?? undefined}
          loading={isLoadingFolders}
          options={folders.map((folder) => ({
            value: folder.id,
            label: `${folder.name} (${folder.imageCount})`,
          }))}
          onChange={(value) => setSelectedFolderId(value as string)}
        />
      </S.Controls>

      {(isLoadingFolders || isLoadingImages) && <GallerySkeleton />}

      {!isLoadingFolders && !isLoadingImages && images.length === 0 && (
        <S.EmptyState>No images available for this folder.</S.EmptyState>
      )}

      {!isLoadingFolders && !isLoadingImages && images.length > 0 && layout === 'grid' && (
        <GalleryGrid images={images} />
      )}

      {!isLoadingFolders && !isLoadingImages && images.length > 0 && layout === 'masonry' && (
        <GalleryMasonry images={images} />
      )}
    </S.Wrapper>
  );
}
