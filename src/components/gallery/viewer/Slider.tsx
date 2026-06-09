import React from 'react'
import styled from 'styled-components';
import { thumbsFor, ThumbWidth } from '../../../services/thumbSvc';

import type { ViewerProps } from './types';

const S = {
  Slider: styled.div`
    background: rgba(0, 0, 0, 0.8);
    width: 100vw;
    height: 100dvh;
    display: flex;
    align-items: center;
    justify-content: center;
  `,
};


const Slider: React.FC<ViewerProps> = ({
  mediaItems, hasMore, fetchMore, isLoading, selectedMediaIdx, selectMedia
}) => {
  console.debug('Rendering Slider with %s items', mediaItems.length);
  console.debug('Selected media index: %s', selectedMediaIdx);

  var mediaItem = mediaItems[selectedMediaIdx!];
  var thumbUri = thumbsFor(mediaItem)[ThumbWidth.PX_512];

  return (
    <S.Slider>
      <img src={thumbUri} alt={mediaItem.path} />
    </S.Slider>
  );
}

export default Slider;
