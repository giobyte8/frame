interface KeyboardLikeEvent {
  key: string;
}

export function isKeyboardSelect(event: KeyboardLikeEvent): boolean {
  return event.key === 'Enter' || event.key === ' ';
}