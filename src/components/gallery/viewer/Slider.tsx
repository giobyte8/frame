import React, { useEffect } from 'react'
import styled from 'styled-components';
import { thumbsFor, ThumbWidth } from '../../../services/thumbSvc';
import * as mediaSvc from '../../../services/mediaSvc';

import type { ViewerProps } from './types';

export interface SliderProps extends ViewerProps {

  /**
   * Function to invoke when the slider should be closed.
   * i.e. User hits 'ESC' or clicks the 'x' button
   */
  onClose: () => void;
}

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
    border: 1px solid red;
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
  selectedMediaIdx: number | null,
  itemCount: number,
  selectMedia: (idx: number) => void,
  onClose: () => void
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedMediaIdx === null) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }

      if (e.key === 'ArrowLeft' && selectedMediaIdx > 0) {
        e.preventDefault();
        selectMedia(selectedMediaIdx - 1);
      } else if (e.key === 'ArrowRight' && selectedMediaIdx < itemCount - 1) {
        e.preventDefault();
        selectMedia(selectedMediaIdx + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMediaIdx, itemCount, selectMedia, onClose]);
}

const Slider: React.FC<SliderProps> = ({
  mediaItems, hasMore, fetchMore, isLoading, selectedMediaIdx, selectMedia, onClose
}) => {
  console.debug('Rendering Slider with %s items', mediaItems.length);
  console.debug('Selected media index: %s', selectedMediaIdx);

  useKeyboardNav(selectedMediaIdx, mediaItems.length, selectMedia, onClose);

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
