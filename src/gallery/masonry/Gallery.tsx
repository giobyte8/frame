import React from "react";

// Define component to render a gallery of images in a masonry layout
const Gallery: React.FC = () => {
  return (
    <div style={{ columnCount: 4, columnGap: '16px' }}>
      {/* Placeholder images */}
      {Array.from({ length: 120 }).map((_, index) => (
        <div key={index} style={{ breakInside: 'avoid', borderRadius: '8px', border: '1px dashed #d9d9d9', padding: '16px', marginBottom: '16px', textAlign: 'center' }}>
          Image {index + 1}
        </div>
      ))}
    </div>
  );
};

export default Gallery;
