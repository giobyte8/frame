import React, { useEffect } from 'react'
import styled from 'styled-components';
import { Button } from 'antd';
import {
  PauseOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';

import type { SliderViewerProps } from './types';
import * as mediaSvc from '../../../services/mediaSvc';
import Toolbar from '../Toolbar';

const S = {
  Slider: styled.div`
    background: rgba(0, 0, 0, 0.91);

    display: flex;
    flex-direction: column;
    height: 100dvh;
    width: 100vw;

    max-height: 100%;
  `,

  TBWrapper: styled.div`
    flex-shrink: 0;
  `,

  MediaFrame: styled.div`
    flex-grow: 1;
    overflow-y: auto;

    display: flex;
    justify-content: center;
    align-items: center;

    box-sizing: border-box;
  `,

  Image: styled.img`
    width: auto;
    height: auto;

    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  `,

  Video: styled.video`
    width: auto;
    height: auto;

    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    // background: #000000;
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

function useSlideshow() {

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
            src={mediaSvc.urlFor(mediaItem)}
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

      <S.TBWrapper>
        <Toolbar>

          <Button
            icon={ <PauseOutlined /> }
            type="text"
          >
            Slideshow
          </Button>
        </Toolbar>
      </S.TBWrapper>
    </S.Slider>
  );
}

export default Slider;
