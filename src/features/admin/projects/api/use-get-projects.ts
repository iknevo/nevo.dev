import { api } from "@/src/lib/hono";
import { IProject } from "@/src/types";
import { useQuery } from "@tanstack/react-query";

export function useGetProjects() {
  const query = useQuery<IProject[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await api.projects.$get();
      if (!res.ok) throw new Error("Failed to fetch projects");
      const { data } = await res.json();
      return data;
    },
  });
  return query;
}
