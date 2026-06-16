import React, { useEffect } from 'react'
import styled from 'styled-components';
import { thumbsFor, ThumbWidth } from '../../../services/thumbSvc';
import * as mediaSvc from '../../../services/mediaSvc';

import type { SliderViewerProps } from './types';

const S = {
  Slider: styled.div`
    background: rgba(0, 0, 0, 0.8);
    width: 100vw;
    height: 100dvh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${({ theme }) => `${theme.spacing.md} 0`};
  `,

  MediaFrame: styled.div`
    // border: 1px solid red;
    height: 100%;
  `,

  Image: styled.img`
    display: block;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  `,

  Video: styled.video`
    display: block;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    background: #000000;
  `,
};

function useKeyboardNav(
  onClose: () => void
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
}

const Slider: React.FC<SliderViewerProps> = ({
  mediaItems, selectedMediaIdx, onClose
}) => {
  console.debug('Rendering Slider with %s items', mediaItems.length);
  console.debug('Selected media index: %s', selectedMediaIdx);

  useKeyboardNav(onClose);

  const mediaItem = mediaItems[selectedMediaIdx!];

  return (
    <S.Slider>
      <S.MediaFrame>
        {mediaSvc.isImage(mediaItem) && (
          <S.Image
            src={thumbsFor(mediaItem)[ThumbWidth.PX_512]}
            alt={mediaItem.path}
          />
        )}

        {mediaSvc.isVideo(mediaItem) && (
          <S.Video
            src={mediaSvc.urlFor(mediaItem)}
            autoPlay
            playsInline
            controls
            preload="metadata"
          />
        )}
      </S.MediaFrame>
    </S.Slider>
  );
}

export default Slider;
