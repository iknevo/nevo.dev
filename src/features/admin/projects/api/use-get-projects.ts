import { api } from "@/src/lib/hono";
import { useQuery } from "@tanstack/react-query";

export function useGetProjects() {
  const query = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await api.projects.$get();
      // const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Failed to fetch projects");
      const { data } = await res.json();
      return data;
    },
  });
  return query;
}
