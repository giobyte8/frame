import type { Image, Page, UUID } from '../types/api';
import { apiClient } from './client';


export async function fetchImages(directoryId: UUID): Promise<Page<Image>> {
    const { data } = await apiClient.get<Page<Image>>(
        `/directories/${directoryId}/images`
    );

    return data;
}
