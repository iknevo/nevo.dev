import { useQuery } from "@tanstack/react-query";

import { toApiError } from "@/src/lib/api-error";
import { api } from "@/src/lib/hono";
import { ProjectResponse } from "@/src/types";

export function useGetProject(id?: string, withHidden: boolean = false, enabled: boolean = true) {
  const query = useQuery<ProjectResponse>({
    enabled: enabled && !!id,
    queryKey: ["project", id, withHidden],
    queryFn: async () => {
      const res = await api.projects[":id"].$get({
        param: { id },
        query: { withHidden: String(withHidden) },
      });
      if (!res.ok) throw await toApiError(res);
      const { data } = await res.json();
      return data;
    },
  });
  return query;
}
