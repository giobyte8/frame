import { env } from '../config/env';
import { thumbsFor, ThumbWidth } from './thumbSvc';
import type { MediaItem } from '../types/api';

function stripTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

export function urlFor(media: MediaItem): string {
  const baseUrl = stripTrailingSlash(env.estaticoBaseUrl);

  if (media.format === 'Heic' && !isSafari()) {
    // For HEIC images, we serve the converted JPEG version.
    return thumbsFor(media)[ThumbWidth.PX_512];
  }

  return `${baseUrl}/media/${media.path}`;
}

export function isVideo(media: MediaItem): boolean {
  return media.mediaType.toLowerCase() === 'video';
}

export function isImage(media: MediaItem): boolean {
  return media.mediaType.toLowerCase() === 'image';
}

function isSafari(): boolean {

   return/^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}
