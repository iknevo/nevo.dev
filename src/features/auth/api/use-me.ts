import { useQuery } from "@tanstack/react-query";

import { api } from "@/src/lib/hono";

export function useMe() {
  const query = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await api.auth.me.$get();
      if (!res.ok) throw new Error("Failed to fetch accounts");
      const data = await res.json();
      return data;
    }
  });
  return query;
}
