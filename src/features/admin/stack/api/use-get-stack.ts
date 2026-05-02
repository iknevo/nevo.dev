import { useQuery } from "@tanstack/react-query";

import { api } from "@/src/lib/hono";

export function useGetStack(withHidden: boolean = false) {
  const query = useQuery({
    queryKey: ["stack", withHidden],
    queryFn: async () => {
      const res = await api.stack.$get({
        query: {
          withHidden,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch stack");
      const { data } = await res.json();
      return data;
    },
  });
  return query;
}
