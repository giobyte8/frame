import { useEffect } from 'react';
import { GalleryErrorBoundary } from '../components/gallery/GalleryErrorBoundary';
import { GalleryViewer } from '../components/gallery/GalleryViewer';
import { useGalleryContext } from '../context/gallery/useGalleryContext';

export default function MasonryGalleryPage() {
  const { setLayout } = useGalleryContext();

  useEffect(() => {
    setLayout('masonry');
  }, [setLayout]);

  return (
    <GalleryErrorBoundary>
      <GalleryViewer />
    </GalleryErrorBoundary>
  );
}
