/**
 * MediaViewer - Fullscreen media viewer overlay
 *
 * Responsibilities:
 * - Render images/videos in fullscreen with contained sizing
 * - Keyboard navigation (ESC to close, arrows for prev/next, space for video play/pause)
 * - Autoplay toggle: auto-advance images every 5s, videos on end
 * - Show loading state while paginating
 *
 * Design: Stateless component (props-driven). Local state (autoplay) only.
 * Keyboard & video control logic extracted into discrete effect hooks.
 */

import {
  CaretRightOutlined,
  CloseOutlined,
  LeftOutlined,
  LoadingOutlined,
  PauseOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { Button, Spin, Typography } from 'antd';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { isImage, isVideo, urlFor } from '../../../services/mediaSvc';
import type { MediaItem } from '../../../types/api';

const IMAGE_AUTOPLAY_MS = 5000;

const S = {
  Overlay: styled.div<{ $isOpen: boolean }>`
    position: fixed;
    inset: 0;
    z-index: 1200;
    display: ${({ $isOpen }) => ($isOpen ? 'grid' : 'none')};
    grid-template-rows: auto minmax(0, 1fr) auto;
    background: rgba(10, 15, 24, 0.94);
    backdrop-filter: blur(10px);
  `,
  CloseButton: styled(Button)`
    border-color: rgba(255, 255, 255, 0.16);
    background: rgba(255, 255, 255, 0.08);
    color: #ffffff;

    &:hover,
    &:focus-visible {
      border-color: rgba(255, 255, 255, 0.28) !important;
      background: rgba(255, 255, 255, 0.14) !important;
      color: #ffffff !important;
    }
  `,
  MediaFrame: styled.div`
    min-height: 0;
    min-width: 0;
    max-width: 100%;
    height: 100%;
    max-height: 100%;
    display: grid;
    place-items: center;
    padding: ${({ theme }) => theme.spacing.md};
    overflow: hidden;
    gap: ${({ theme }) => theme.spacing.md};
  `,
  Image: styled.img`
    display: block;
    min-width: 0;
    min-height: 0;
    width: auto;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: ${({ theme }) => theme.radius.md};
  `,
  Video: styled.video`
    display: block;
    min-width: 0;
    min-height: 0;
    width: auto;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: ${({ theme }) => theme.radius.md};
    background: #000000;
  `,
  Footer: styled.div`
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    align-items: center;
    gap: ${({ theme }) => theme.spacing.md};
    padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
    background: linear-gradient(180deg, rgba(10, 15, 24, 0) 0%, rgba(10, 15, 24, 0.8) 32%, rgba(10, 15, 24, 0.92) 100%);

    @media (max-width: 640px) {
      grid-template-columns: 1fr;
      justify-items: center;
      padding: ${({ theme }) => theme.spacing.md};
    }
  `,
  Nav: styled.div`
    display: inline-flex;
    gap: ${({ theme }) => theme.spacing.sm};
    align-items: center;
  `,
  NavButton: styled(Button)`
    min-width: 120px;
  `,
};

interface MediaViewerProps {
  isOpen: boolean;
  media: MediaItem | null;
  activeIndex: number | null;
  totalCount: number;
  hasPrev: boolean;
  hasNext: boolean;
  isLoadingAdjacent: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

// Check if a DOM element is an interactive form/input element
function isInteractiveElement(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && !!target.closest('button, a, input, textarea, select');
}

// Handle keyboard shortcuts: ESC, arrows, spacebar
function useKeyboardNavigation(
  isOpen: boolean,
  isSelectedVideo: boolean,
  hasPrev: boolean,
  hasNext: boolean,
  videoRef: React.RefObject<HTMLVideoElement | null>,
  onClose: () => void,
  onPrev: () => void,
  onNext: () => void,
) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === 'ArrowLeft' && hasPrev) {
        event.preventDefault();
        onPrev();
        return;
      }

      if (event.key === 'ArrowRight' && hasNext) {
        event.preventDefault();
        onNext();
        return;
      }

      // Space: play/pause video only when video is active
      if (event.key === ' ' && isSelectedVideo) {
        if (isInteractiveElement(event.target)) {
          return;
        }

        event.preventDefault();
        const video = videoRef.current;
        if (!video) return;

        video.paused ? void video.play() : video.pause();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSelectedVideo, hasPrev, hasNext, onClose, onPrev, onNext, videoRef]);
}

// Auto-play videos on open
function useVideoAutoPlay(isOpen: boolean, isSelectedVideo: boolean, mediaUrl: string, videoRef: React.RefObject<HTMLVideoElement | null>) {
  useEffect(() => {
    if (!isOpen || !isSelectedVideo || !videoRef.current) {
      return;
    }

    void videoRef.current.play().catch(() => undefined);

    return () => {
      videoRef.current?.pause();
    };
  }, [isOpen, isSelectedVideo, mediaUrl, videoRef]);
}

// Image auto-advance on interval
function useImageAutoplay(isAutoplayEnabled: boolean, isSelectedImage: boolean, hasNext: boolean, isOpen: boolean, onNext: () => void) {
  useEffect(() => {
    if (!isOpen || !isAutoplayEnabled || !isSelectedImage || !hasNext) {
      return;
    }

    const timer = setTimeout(onNext, IMAGE_AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [isAutoplayEnabled, isSelectedImage, hasNext, isOpen, onNext]);
}

const MediaViewer: React.FC<MediaViewerProps> = ({
  isOpen,
  media,
  activeIndex,
  totalCount,
  hasPrev,
  hasNext,
  isLoadingAdjacent,
  onClose,
  onPrev,
  onNext,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isAutoplayEnabled, setIsAutoplayEnabled] = useState(false);

  // Derive media type and URL
  const isSelectedVideo = media ? isVideo(media) : false;
  const isSelectedImage = media ? isImage(media) : false;
  const mediaUrl = media ? urlFor(media) : '';

  // Set up all effect hooks
  useVideoAutoPlay(isOpen, isSelectedVideo, mediaUrl, videoRef);
  useImageAutoplay(isAutoplayEnabled, isSelectedImage, hasNext, isOpen, onNext);
  useKeyboardNavigation(isOpen, isSelectedVideo, hasPrev, hasNext, videoRef, onClose, onPrev, onNext);

  // Reset autoplay when viewer closes
  useEffect(() => {
    if (!isOpen) {
      setIsAutoplayEnabled(false);
    }
  }, [isOpen]);

  const itemLabel = activeIndex === null ? 'No media selected' : `${activeIndex + 1} of ${totalCount}`;

  return (
    <S.Overlay
      $isOpen={isOpen}
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
      aria-label="Media viewer"
    >
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px' }}>
        <S.CloseButton
          type="text"
          size="large"
          icon={<CloseOutlined />}
          aria-label="Close viewer"
          onClick={onClose}
        />
      </div>

      <S.MediaFrame>
        {media && isImage(media) && (
          <S.Image src={mediaUrl} alt={media.path} />
        )}

        {media && isVideo(media) && (
          <S.Video
            ref={videoRef}
            src={mediaUrl}
            autoPlay
            playsInline
            controls
            preload="metadata"
            onEnded={() => {
              if (isAutoplayEnabled && hasNext) {
                onNext();
              }
            }}
          >
            Your browser does not support the video tag.
          </S.Video>
        )}

        {!media && (
          <div style={{ display: 'grid', gap: '8px', justifyItems: 'center', textAlign: 'center' }}>
            <Typography.Title level={4} style={{ color: '#ffffff', margin: 0 }}>
              Viewer unavailable
            </Typography.Title>
            <Typography.Text style={{ color: 'rgba(255, 255, 255, 0.72)' }}>
              No media item is currently selected.
            </Typography.Text>
          </div>
        )}

        {media && !isImage(media) && !isVideo(media) && (
          <div style={{ display: 'grid', gap: '8px', justifyItems: 'center', textAlign: 'center' }}>
            <Typography.Title level={4} style={{ color: '#ffffff', margin: 0 }}>
              Unsupported media type
            </Typography.Title>
            <Typography.Text style={{ color: 'rgba(255, 255, 255, 0.72)' }}>
              {media.mediaType || 'Unknown media type'}
            </Typography.Text>
          </div>
        )}
      </S.MediaFrame>

      <S.Footer>
        <div style={{ minWidth: 0, display: 'grid', gap: '4px' }}>
          <Typography.Text ellipsis={{ tooltip: media?.path ?? '' }} style={{ color: '#ffffff' }}>
            {media?.path ?? 'No media selected'}
          </Typography.Text>
          <Typography.Text style={{ color: 'rgba(255, 255, 255, 0.72)' }}>
            {itemLabel}
          </Typography.Text>
        </div>

        <S.Nav>
          <S.NavButton
            icon={<LeftOutlined />}
            size="large"
            disabled={!hasPrev}
            onClick={onPrev}
          >
            Previous
          </S.NavButton>
          <S.NavButton
            size="large"
            icon={isAutoplayEnabled ? <PauseOutlined /> : <CaretRightOutlined />}
            onClick={() => setIsAutoplayEnabled(prev => !prev)}
            disabled={!media || !hasNext}
          >
            {isAutoplayEnabled ? 'Pause' : 'Play'}
          </S.NavButton>
          <S.NavButton
            type="primary"
            icon={<RightOutlined />}
            iconPosition="end"
            size="large"
            disabled={!hasNext}
            loading={isLoadingAdjacent}
            onClick={onNext}
          >
            Next
          </S.NavButton>
        </S.Nav>

        <div
          style={{
            justifySelf: 'end',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            color: 'rgba(255, 255, 255, 0.72)',
          }}
          aria-live="polite"
        >
          {isLoadingAdjacent && (
            <>
              <Spin indicator={<LoadingOutlined spin />} size="small" />
              <span>Loading more media…</span>
            </>
          )}
        </div>
      </S.Footer>
    </S.Overlay>
  );
};

export default MediaViewer;
