import { useQuery } from "@tanstack/react-query";

import { toApiError } from "@/src/lib/api-error";
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
      if (!res.ok) throw await toApiError(res);
      const { data } = await res.json();
      return data;
    },
  });
  return query;
}
