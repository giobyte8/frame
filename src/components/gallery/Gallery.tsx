import React from "react";
import { useGalleryImages } from "../../hooks/useGalleryImages";
import type { ImageModel, UUID } from "../../types/api";


interface GalleryProps {
  folderId: UUID
}


const Gallery: React.FC<GalleryProps> = ({ folderId }) => {
  const { page, isLoading, error } = useGalleryImages(folderId);

    if (isLoading) {
      return <div>Loading images...</div>;
    }

    if (error) {
      return <div>Error loading images: {error.message}</div>;
    }

    return (
      <div>
        {page?.content.map((image: ImageModel, idx: number) => (
          <div key={`img-${idx}`}>
            <span>{image.path}</span>
          </div>
        ))}
      </div>
    );
}

export default Gallery;
