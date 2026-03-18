import { env } from '../config/env';
import type { Image } from '../types/api';

export const ThumbWidth = {
  PX_256: '256px',
  PX_512: '512px',
} as const;

export type ThumbWidth = (typeof ThumbWidth)[keyof typeof ThumbWidth];

export type ThumbUriMap = Record<ThumbWidth, string>;

function stripTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

function trimExtension(path: string): string {
  const extensionIndex = path.lastIndexOf('.');

  if (extensionIndex === -1) {
    return path;
  }

  return path.slice(0, extensionIndex);
}

export function thumbsFor(image: Image): ThumbUriMap {
  const baseUrl = stripTrailingSlash(env.estaticoBaseUrl);
  const pathWithoutExtension = trimExtension(image.path);

  return {
    [ThumbWidth.PX_256]: `${baseUrl}/thumbs/${pathWithoutExtension}_${ThumbWidth.PX_256}.jpg`,
    [ThumbWidth.PX_512]: `${baseUrl}/thumbs/${pathWithoutExtension}_${ThumbWidth.PX_512}.jpg`,
  };
}
