import Gallery from '../components/gallery/Gallery';
import { useParams } from 'react-router-dom';
import type { UUID } from '../types/api';

export default function GalleryPage() {
  const { directoryId } = useParams<{ directoryId: UUID }>();

  if (!directoryId) {
    return <div>Directory id is missing in route.</div>;
  }

  return <Gallery directoryId={directoryId} />;
}
