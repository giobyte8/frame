import Gallery from '../components/gallery/Gallery';
import { useParams } from 'react-router-dom';
import type { UUID } from '../types/api';

export default function GalleryPage() {
  const { folderId } = useParams<{ folderId: UUID }>();

  if (!folderId) {
    return <div>Folder id is missing in route.</div>;
  }

  return <Gallery folderId={folderId} />;
}
