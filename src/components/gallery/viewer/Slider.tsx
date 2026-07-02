import React, { useCallback, useContext, useEffect, useState } from 'react'
import styled from 'styled-components';
import { Button } from 'antd';
import {
  PauseOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';

import * as mediaSvc from '../../../services/mediaSvc';
import Toolbar from '../Toolbar';
import { GalleryCtx, type DisplayMode } from '../Gallery';
import { useKeyboardHandler } from '../../../services/keyboardSvc';
import type { GalleryMedia } from '../../../hooks/useGalleryMedia';

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

function nextMediaItem(
  media: GalleryMedia,
  selectedMediaIdx: number,
  setSelectedMediaIdx: (idx: number) => void
) {
  if (selectedMediaIdx < media.items.length - 1) {
    setSelectedMediaIdx(selectedMediaIdx + 1);

    // Trigger fetching more?
    const reachingEnd = selectedMediaIdx >= media.items.length - 10;
    if (reachingEnd && media.canFetchMore && !media.isLoadingMore) {
      media.fetchMore();
    }
  }
}

function prevMediaItem(
  selectedMediaIdx: number,
  setSelectedMediaIdx: (idx: number) => void
) {
  if (selectedMediaIdx > 0) {
    setSelectedMediaIdx(selectedMediaIdx - 1);
  }
}

function useKeyboardNav(
  media: GalleryMedia,

  selectedMediaIdx: number,
  setSelectedMediaIdx: (idx: number) => void,

  prevDisplayMode: DisplayMode,
  setDisplayMode: (mode: DisplayMode) => void,
) {

  useKeyboardHandler('Escape', useCallback(() => {
    setDisplayMode(prevDisplayMode);
  }, [setDisplayMode, prevDisplayMode]));

  // Prev item navigation
  useKeyboardHandler('ArrowLeft', useCallback(() => {
    prevMediaItem(selectedMediaIdx, setSelectedMediaIdx);
  }, [selectedMediaIdx, setSelectedMediaIdx]));

  // Next item navigation
  useKeyboardHandler('ArrowRight', useCallback(() => {
    nextMediaItem(media, selectedMediaIdx, setSelectedMediaIdx);
  }, [media, selectedMediaIdx, setSelectedMediaIdx]));
}

function useSlideshow(
  media: GalleryMedia,
  selectedMediaIdx: number,
  setSelectedMediaIdx: (idx: number) => void,
) {
  const [playingSlideshow, setPlayingSlideshow] = useState<boolean>(false);

  useEffect(() => {
    const mediaItem = media.items[selectedMediaIdx!];

    if (!playingSlideshow || mediaItem.mediaType !== 'IMAGE') {
      return;
    }

    const interval = setTimeout(() => {
      console.debug('Slideshow advancing to next media item');
      nextMediaItem(media, selectedMediaIdx, setSelectedMediaIdx);
    }, 3000);

    return () => clearTimeout(interval);
  }, [media, selectedMediaIdx, setSelectedMediaIdx, playingSlideshow]);

  return {
    playingSlideshow,
    setPlayingSlideshow,
  };
}

const Slider: React.FC = _ => {
  const {
      media,
      selectedMediaIdx, setSelectedMediaIdx,
      prevDisplayMode, setDisplayMode,
  } = useContext(GalleryCtx);

  useKeyboardNav(
    media,
    selectedMediaIdx,
    setSelectedMediaIdx,
    prevDisplayMode,
    setDisplayMode
  );

  const { playingSlideshow, setPlayingSlideshow } = useSlideshow(
    media,
    selectedMediaIdx,
    setSelectedMediaIdx
  );

  console.debug('Rendering Slider with %s items', media.items.length);
  console.debug('Selected media index: %s', selectedMediaIdx);

  const mediaItem = media.items[selectedMediaIdx!];

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
            onEnded={() => playingSlideshow && nextMediaItem(
              media, selectedMediaIdx, setSelectedMediaIdx
            )}
          />
        )}
      </S.MediaFrame>

      <S.TBWrapper>
        <Toolbar>

          <Button
            icon={ playingSlideshow
              ? <PauseOutlined />
              : <PlayCircleOutlined />
            }
            type="text"
            onClick={() => setPlayingSlideshow(!playingSlideshow)}
          >
            Slideshow
          </Button>
        </Toolbar>
      </S.TBWrapper>
    </S.Slider>
  );
}

export default Slider;
