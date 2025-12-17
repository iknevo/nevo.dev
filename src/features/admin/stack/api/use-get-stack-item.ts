import { useQuery } from "@tanstack/react-query";

import { stackItemType } from "@/src/definitions/stack-validations";
import { api } from "@/src/lib/hono";

export function useGetStackItem(id?: string) {
  const query = useQuery<stackItemType>({
    enabled: !!id,
    queryKey: ["stack_item", id],
    queryFn: async () => {
      const res = await api.stack[":id"].$get({
        param: { id }
      });
      if (!res.ok) throw new Error("Failed to fetch stack item");
      const { data } = await res.json();
      return data;
    }
  });
  return query;
}
