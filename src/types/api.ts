export type UUID = `${string}-${string}-${string}-${string}-${string}`;

export interface Directory {
  id: UUID;
  path: string;
  recursive: boolean;
  status: string;
  version: number;
}

export interface DirWithLineage {
  directory: Directory;
  lineage: Directory[];
}

export type ISODateString = string;

export interface Image {
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

export interface MediaItem {
  path: string,
  version: number,
  fileSize: number,
  lastModified: string,

  captureDateTime: string | null,
  captureInstant: string | null,
  rawCaptureDateTime: string | null,

  gpsLatitude: number | null,
  gpsLongitude: number | null,
  cameraMaker: string | null,
  cameraModel: string | null,

  status: string,
  mediaType: string
  format: string;
}

export interface Page<T> {
  content: T[];
  pageIdx: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
}
