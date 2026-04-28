import type { Directory, Page } from '../types/api';
import type { UUID } from '../types/api';
import { apiClient } from './client';

export async function fetchRoots(): Promise<Directory[]> {
  const { data } = await apiClient.get<Page<Directory>>('/directories');
  return data.content;
}

export async function fetchDirectories(directoryId: UUID): Promise<Page<Directory>> {
  const { data } = await apiClient.get<Page<Directory>>(`/directories/${directoryId}/directories`, {
    params: {
      size: 100,
    },
  });

  return data;
}

export async function fetchDirectory(directoryId: UUID): Promise<Directory> {
  const { data } = await apiClient
    .get<Directory>(`/directories/${directoryId}`);

  return data;
}
