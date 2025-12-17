import { useQuery } from "@tanstack/react-query";

import { api } from "@/src/lib/hono";

export function useGetStack() {
  const query = useQuery({
    queryKey: ["stack"],
    queryFn: async () => {
      const res = await api.stack.$get();
      if (!res.ok) throw new Error("Failed to fetch stack");
      const { data } = await res.json();
      return data;
    }
  });
  return query;
}
