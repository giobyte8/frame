import { useRoots } from "../../hooks/useRoots";
import { DirectoriesGrid } from "./DirectoriesGrid";

export function Roots() {
  const { roots, isLoading, error } = useRoots();

  if (isLoading) {
    return <div>Loading directories...</div>;
  }

  if (error) {
    return <div>Error loading directories: {error.message}</div>;
  }

  return <DirectoriesGrid directories={roots} />;
}
