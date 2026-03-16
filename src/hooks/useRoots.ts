import { useQuery } from '@tanstack/react-query';
import { fetchRoots } from '../api/directories';
import type { Directory } from '../types/api';

interface UseRootsResult {
  roots: Directory[];
  isLoading: boolean;
  error: Error | null;
}

export function useRoots(): UseRootsResult {
  const { data, isLoading, error } = useQuery({
    queryKey: ['roots'],
    queryFn: fetchRoots,
  });

  return {
    roots: data ?? [],
    isLoading,
    error: error instanceof Error ? error : null,
  };
}
