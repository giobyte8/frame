import type { ImageModel, Page, UUID } from '../types/api';
import { apiClient } from './client';


export async function fetchImages(folderId: UUID): Promise<Page<ImageModel>> {
    const { data } = await apiClient.get<Page<ImageModel>>(
        `/directories/${folderId}/images`
    );

    return data;
}
