/**
 * useMediaViewer - Media viewer state and navigation
 *
 * Manages fullscreen viewer state including:
 * - Active media index tracking with bounds validation
 * - Pagination: auto-fetches next page when navigating beyond current items
 * - Navigation: prev/next with boundary checks
 * - UX: scroll preservation (open/close) + body scroll lock
 *
 * Design: Single activeIdx drives derived state (activeMedia, hasPrev, hasNext).
 * Effects handle side-effects in isolation (directory reset, boundary clamp, pagination, scroll lock).
 */

import { useEffect, useRef, useState } from 'react';
import type { MediaItem } from '../types/api';

interface UseMediaViewerOptions {
  mediaItems: MediaItem[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  directoryId: string;
}

export interface UseMediaViewerResult {
  isOpen: boolean;
  activeIdx: number | null;
  activeMedia: MediaItem | null;
  hasPrev: boolean;
  hasNext: boolean;
  isLoadingAdjacent: boolean;
  open: (media: MediaItem, idx: number) => void;
  close: () => void;
  prev: () => void;
  next: () => void;
}

// Lock/unlock body scroll when viewer is active
function useBodyScrollLock(isOpen: boolean) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const saved = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = saved;
    };
  }, [isOpen]);
}

export function useMediaViewer({
  mediaItems,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  directoryId,
}: UseMediaViewerOptions): UseMediaViewerResult {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [pendingNext, setPendingNext] = useState(false);
  const scrollPos = useRef(0);

  // Reset on directory change
  useEffect(() => {
    setActiveIdx(null);
    setPendingNext(false);
  }, [directoryId]);

  // Clamp index if items shrink (e.g., after filtering or reload)
  useEffect(() => {
    if (activeIdx === null || activeIdx < mediaItems.length) {
      return;
    }
    setActiveIdx(mediaItems.length > 0 ? mediaItems.length - 1 : null);
  }, [activeIdx, mediaItems.length]);

  // Advance to next once pending page load completes
  useEffect(() => {
    if (!pendingNext || activeIdx === null) {
      return;
    }

    const canAdvance = activeIdx < mediaItems.length - 1;
    if (canAdvance) {
      setActiveIdx(activeIdx + 1);
      setPendingNext(false);
      return;
    }

    // Clear pending if no more pages coming
    if (!hasNextPage && !isFetchingNextPage) {
      setPendingNext(false);
    }
  }, [activeIdx, hasNextPage, isFetchingNextPage, mediaItems.length, pendingNext]);

  // Lock scroll while viewing
  useBodyScrollLock(activeIdx !== null);

  const open = (_media: MediaItem, idx: number) => {
    scrollPos.current = window.scrollY;
    setPendingNext(false);
    setActiveIdx(idx);
  };

  const close = () => {
    setPendingNext(false);
    setActiveIdx(null);
    requestAnimationFrame(() => {
      window.scrollTo({ top: scrollPos.current });
    });
  };

  const prev = () => {
    if (activeIdx === null || activeIdx === 0) {
      return;
    }
    setPendingNext(false);
    setActiveIdx(activeIdx - 1);
  };

  const next = () => {
    if (activeIdx === null) {
      return;
    }

    // Move to next in current page
    if (activeIdx < mediaItems.length - 1) {
      setPendingNext(false);
      setActiveIdx(activeIdx + 1);
      return;
    }

    // Request next page if available
    if (!hasNextPage) {
      return;
    }

    setPendingNext(true);
    if (!isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // Derived state
  const activeMedia = activeIdx === null ? null : mediaItems[activeIdx] ?? null;
  const hasPrev = activeIdx !== null && activeIdx > 0;
  const hasNext = activeIdx !== null && (activeIdx < mediaItems.length - 1 || hasNextPage);

  return {
    isOpen: activeIdx !== null,
    activeIdx,
    activeMedia,
    hasPrev,
    hasNext,
    isLoadingAdjacent: pendingNext,
    open,
    close,
    prev,
    next,
  };
}
