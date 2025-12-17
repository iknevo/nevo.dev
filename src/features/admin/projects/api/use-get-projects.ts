import { useQuery } from "@tanstack/react-query";

import { api } from "@/src/lib/hono";
import { ProjectResponse } from "@/src/types";

export function useGetProjects() {
  const query = useQuery<ProjectResponse[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await api.projects.$get();
      if (!res.ok) throw new Error("Failed to fetch projects");
      const { data } = await res.json();
      return data;
    }
  });
  return query;
}
