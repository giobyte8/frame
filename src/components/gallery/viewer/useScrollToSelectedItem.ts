import { useLayoutEffect, useRef, type MutableRefObject } from 'react';

interface UseScrollToSelectedItemParams {
  selectedMediaIdx: number;
  itemsLength: number;
  itemRefs: MutableRefObject<Map<number, HTMLDivElement>>;
}

export function useScrollToSelectedItem({
  selectedMediaIdx,
  itemsLength,
  itemRefs,
}: UseScrollToSelectedItemParams): void {
  const hasRestoredRef = useRef(false);

  useLayoutEffect(() => {
    if (hasRestoredRef.current) {
      return;
    }

    if (selectedMediaIdx < 0 || selectedMediaIdx >= itemsLength) {
      return;
    }

    const itemElement = itemRefs.current.get(selectedMediaIdx);
    if (!itemElement) {
      return;
    }

    itemElement.scrollIntoView({
      behavior: 'auto',
      block: 'center',
      inline: 'nearest',
    });

    hasRestoredRef.current = true;
  }, [selectedMediaIdx, itemsLength, itemRefs]);
}
