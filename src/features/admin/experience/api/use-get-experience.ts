import { useQuery } from "@tanstack/react-query";

import { toApiError } from "@/src/lib/api-error";
import { api } from "@/src/lib/hono";
import { ExperienceResponse } from "@/src/types";

export function useGetExperience(withHidden: boolean = false) {
  const query = useQuery<ExperienceResponse[]>({
    queryKey: ["experience", withHidden],
    queryFn: async () => {
      const res = await api.experience.$get({
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
