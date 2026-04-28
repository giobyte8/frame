import { useQuery } from "@tanstack/react-query";
import { fetchDirectory } from "../api/directories";
import type { Directory, UUID } from "../types/api";

interface UseDirectoryResult {
  directory: Directory | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Fetches details of a single directory by its ID.
 *
 * @param directoryId Directory Id
 * @returns Fetched directory
 */
export function useDirectory(directoryId: UUID): UseDirectoryResult {
    const { data, isLoading, error } = useQuery({
      queryKey: ['directory', directoryId],
      queryFn: () => fetchDirectory(directoryId),
    });

    return {
        directory: data ?? null,
        isLoading,
        error: error instanceof Error ? error : null,
    };
}
