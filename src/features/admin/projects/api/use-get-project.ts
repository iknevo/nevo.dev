import { useQuery } from "@tanstack/react-query";

import { api } from "@/src/lib/hono";
import { ProjectResponse } from "@/src/types";

export function useGetProject(id?: string, withHidden: boolean = false) {
  const query = useQuery<ProjectResponse>({
    enabled: !!id,
    queryKey: ["project", id, withHidden],
    queryFn: async () => {
      const res = await api.projects[":id"].$get({
        param: { id },
        query: { withHidden: String(withHidden) },
      });
      if (!res.ok) throw new Error("Failed to fetch project");
      const { data } = await res.json();
      return data;
    },
  });
  return query;
}
