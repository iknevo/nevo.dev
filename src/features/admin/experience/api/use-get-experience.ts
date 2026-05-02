import { useQuery } from "@tanstack/react-query";

import { api } from "@/src/lib/hono";
import { ExperienceResponse } from "@/src/types";

export function useGetExperience(withHidden: boolean = false) {
  const query = useQuery<ExperienceResponse[]>({
    queryKey: ["experience"],
    queryFn: async () => {
      const res = await api.experience.$get({
        query: {
          withHidden,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch experience");
      const { data } = await res.json();
      return data;
    },
  });
  return query;
}
