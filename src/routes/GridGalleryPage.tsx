import { useEffect } from 'react';
import { GalleryErrorBoundary } from '../components/gallery/GalleryErrorBoundary';
import { GalleryViewer } from '../components/gallery/GalleryViewer';
import { useGalleryContext } from '../context/gallery/useGalleryContext';

export default function GridGalleryPage() {
  const { setLayout } = useGalleryContext();

  useEffect(() => {
    setLayout('grid');
  }, [setLayout]);

  return (
    <GalleryErrorBoundary>
      <GalleryViewer />
    </GalleryErrorBoundary>
  );
}
