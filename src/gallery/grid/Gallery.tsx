import React from "react";

// Define component to render a gallery of images in a grid
const Gallery: React.FC = () => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
      {/* Placeholder images */}
      {Array.from({ length: 120 }).map((_, index) => (
        <div key={index} style={{ borderRadius: '8px', border: '1px dashed #d9d9d9', padding: '16px', textAlign: 'center' }}>
          Image {index + 1}
        </div>
      ))}
    </div>
  );
};

export default Gallery;
