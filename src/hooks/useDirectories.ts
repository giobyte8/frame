import { useQuery } from '@tanstack/react-query';
import { fetchDirectories } from '../api/directories';
import type { Directory, Page, UUID } from '../types/api';

interface UseDirectoriesResult {
  page: Page<Directory>;
  isLoading: boolean;
  error: Error | null;
}

const EMPTY_PAGE: Page<Directory> = {
  content: [],
  pageIdx: 0,
  pageSize: 0,
  totalPages: 0,
  totalElements: 0,
};

export function useDirectories(directoryId: UUID): UseDirectoriesResult {
  const { data, isLoading, error } = useQuery({
    queryKey: ['directories', directoryId],
    queryFn: () => fetchDirectories(directoryId),
    enabled: !!directoryId,
  });

  return {
    page: data ?? EMPTY_PAGE,
    isLoading,
    error: error instanceof Error ? error : null,
  };
}
