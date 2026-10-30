import { useQuery } from "@tanstack/react-query";

import { api } from "@/src/lib/hono";
import { ProjectResponse } from "@/src/types";

export function useGetProjects(withHidden: boolean = false) {
  const query = useQuery<ProjectResponse[]>({
    queryKey: ["projects", withHidden],
    queryFn: async () => {
      const res = await api.projects.$get({
        query: {
          withHidden,
        },
      });
      if (!res.ok) throw new Error("Failed to load projects");
      const { data } = await res.json();
      return data;
    },
  });
  return query;
}
