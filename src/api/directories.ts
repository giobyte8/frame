import type { Directory, Page } from '../types/api';
import { apiClient } from './client';

export async function fetchRoots(): Promise<Directory[]> {
  const { data } = await apiClient.get<Page<Directory>>('/directories');
  return data.content;
}
