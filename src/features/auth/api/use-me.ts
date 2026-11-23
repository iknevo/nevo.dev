import { useQuery } from "@tanstack/react-query";

import { toApiError } from "@/src/lib/api-error";
import { api } from "@/src/lib/hono";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await api.auth.me.$get();
      if (!res.ok) throw await toApiError(res);
      return res.json();
    },
  });
}
