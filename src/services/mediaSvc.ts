import { env } from '../config/env';
import type { MediaItem } from '../types/api';

function stripTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

export function urlFor(media: MediaItem): string {
  const baseUrl = stripTrailingSlash(env.estaticoBaseUrl);

  return `${baseUrl}/media/${media.path}`;
}

export function isVideo(media: MediaItem): boolean {
  return media.mediaType.toLowerCase() === 'video';
}

export function isImage(media: MediaItem): boolean {
  return media.mediaType.toLowerCase() === 'image';
}