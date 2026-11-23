import { useQuery } from "@tanstack/react-query";

import { expItemType } from "@/src/definitions/experience-validations";
import { toApiError } from "@/src/lib/api-error";
import { api } from "@/src/lib/hono";

export function useGetExperienceItem(id?: string, enabled: boolean = true) {
  const query = useQuery<expItemType>({
    enabled: enabled && !!id,
    queryKey: ["exp_item", id],
    queryFn: async () => {
      const res = await api.experience[":id"].$get({
        param: { id },
      });
      if (!res.ok) throw await toApiError(res);
      const { data } = await res.json();
      return data;
    },
  });
  return query;
}
