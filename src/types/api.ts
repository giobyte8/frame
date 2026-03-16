export interface Folder {
  id: string;
  name: string;
  imageCount: number;
}

export type UUID = `${string}-${string}-${string}-${string}-${string}`;

export interface Directory {
  id: UUID;
  path: string;
  recursive: boolean;
  status: string;
  version: number;
}

export type ISODateString = string;

export interface ImageModel {
  cameraMaker?: string | null;
  cameraModel?: string | null;
  contentHash: string;
  datetimeOriginal?: ISODateString | null;
  gpsLatitude?: number | null;
  gpsLongitude?: number | null;
  path: string;
  status: string;
  version: number;
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

export interface Page<T> {
  content: T[];
  pageIdx: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
}
