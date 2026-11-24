import { useQuery } from "@tanstack/react-query";

import type { ProfileValues } from "@/src/definitions/profile-validations";
import { toApiError } from "@/src/lib/api-error";
import { api } from "@/src/lib/hono";

export function useGetProfile() {
  return useQuery<ProfileValues>({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await api.profile.$get();
      if (!res.ok) throw await toApiError(res);
      const { data } = await res.json();
      return data;
    },
  });
}
