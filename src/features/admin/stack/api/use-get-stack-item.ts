import { useQuery } from "@tanstack/react-query";

import { stackItemType } from "@/src/definitions/stack-validations";
import { toApiError } from "@/src/lib/api-error";
import { api } from "@/src/lib/hono";

export function useGetStackItem(id?: string, enabled: boolean = true) {
  const query = useQuery<stackItemType>({
    enabled: enabled && !!id,
    queryKey: ["stack_item", id],
    queryFn: async () => {
      const res = await api.stack[":id"].$get({
        param: { id },
      });
      if (!res.ok) throw await toApiError(res);
      const { data } = await res.json();
      return data;
    },
  });
  return query;
}
