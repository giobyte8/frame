import type { Directory } from "../types/api";

export function basename(dir: Directory): string {

  // Remove leading/trailing whitespace and slashes from the path
  const path = dir.path.trim().replace(/^\/+|\/+$/g, '');

  const lastSlashIndex = path.lastIndexOf('/');
  if (lastSlashIndex === -1) return path;

  return path.substring(lastSlashIndex + 1);
}
