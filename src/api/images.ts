import type { Image, MediaItem, Page, UUID } from '../types/api';
import { apiClient } from './client';


export async function fetchImages(directoryId: UUID): Promise<Page<Image>> {
    const { data } = await apiClient.get<Page<Image>>(
        `/directories/${directoryId}/images`,
        { params: {
            recursive: true,
            size: 1000,
        }}
    );

    return data;
}

export async function fetchMedia(directoryId: UUID): Promise<Page<MediaItem>> {
    const { data } = await apiClient.get<Page<MediaItem>>(
        `/directories/${directoryId}/media`,
        { params: {
            recursive: true,
            size: 200,
        }}
    );

    return data;
}
