import { useEffect } from 'react';


interface KeyboardLikeEvent {
  key: string;
}

export function isKeyboardSelect(event: KeyboardLikeEvent): boolean {
  return event.key === 'Enter' || event.key === ' ';
}

export function useKeyboardHandler(key: string, handler: () => void) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === key) {
        e.preventDefault();
        handler();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [key, handler]);
}
