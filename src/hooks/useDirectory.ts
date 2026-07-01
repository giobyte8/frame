import { useQuery } from "@tanstack/react-query";
import { fetchDirWithLineage } from "../api/directories";
import type { DirWithLineage, UUID } from "../types/api";

interface UseDirectoryResult {
  dirWithLineage: DirWithLineage | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Fetches details of a single directory along with its lineage by its ID.
 *
 * @param directoryId Directory Id
 * @returns Fetched directory with lineage
 */
export function useDirWithLineage(directoryId?: UUID): UseDirectoryResult {
    const { data, isLoading, error } = useQuery({
      queryKey: ['directory', directoryId],
      queryFn: () => fetchDirWithLineage(directoryId as UUID),
      enabled: !!directoryId,
    });

    return {
        dirWithLineage: data ?? null,
        isLoading,
        error: error instanceof Error ? error : null,
    };
}
