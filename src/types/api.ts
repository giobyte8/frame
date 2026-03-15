export interface Folder {
  id: string;
  name: string;
  imageCount: number;
}

export interface ImageMetadata {
  width: number;
  height: number;
}

export interface Image {
  id: string;
  url: string;
  metadata: ImageMetadata;
}
