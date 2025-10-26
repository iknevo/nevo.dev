import { api } from "@/src/lib/hono";
import { ProjectResponse } from "@/src/types";
import { useQuery } from "@tanstack/react-query";

export function useGetProject(id?: string) {
  const query = useQuery<ProjectResponse>({
    enabled: !!id,
    queryKey: ["project", id],
    queryFn: async () => {
      const res = await api.projects[":id"].$get({
        param: { id },
      });
      if (!res.ok) throw new Error("Failed to fetch project");
      const { data } = await res.json();
      return data;
    },
  });
  return query;
}
