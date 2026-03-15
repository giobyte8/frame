import type { Folder, Image } from '../types/api';

const FOLDERS: Folder[] = [
  { id: 'travel', name: 'Travel', imageCount: 24 },
  { id: 'nature', name: 'Nature', imageCount: 30 },
  { id: 'portraits', name: 'Portraits', imageCount: 18 },
  { id: 'architecture', name: 'Architecture', imageCount: 20 },
];

const imageStore = new Map<string, Image[]>();

function wait(durationMs: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, durationMs);
  });
}

function buildFolderImages(folder: Folder): Image[] {
  return Array.from({ length: folder.imageCount }).map((_, index) => {
    const width = 600 + ((index % 3) * 120);
    const height = 700 + ((index % 5) * 90);

    return {
      id: `${folder.id}-${index + 1}`,
      url: `https://picsum.photos/seed/${folder.id}-${index + 1}/${width}/${height}`,
      metadata: {
        width,
        height,
      },
    };
  });
}

export async function fetchFolders(): Promise<Folder[]> {
  await wait(250);
  return FOLDERS;
}

export async function fetchImages(folderId: string): Promise<Image[]> {
  await wait(350);

  const folder = FOLDERS.find((item) => item.id === folderId);
  if (!folder) {
    throw new Error(`Unknown folder id: ${folderId}`);
  }

  const existingImages = imageStore.get(folderId);
  if (existingImages) {
    return existingImages;
  }

  const newImages = buildFolderImages(folder);
  imageStore.set(folderId, newImages);
  return newImages;
}
