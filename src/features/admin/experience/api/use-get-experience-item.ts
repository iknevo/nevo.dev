import { expItemType } from "@/src/definitions/experience-validations";
import { api } from "@/src/lib/hono";
import { useQuery } from "@tanstack/react-query";

export function useGetExperienceItem(id?: string) {
  const query = useQuery<expItemType>({
    enabled: !!id,
    queryKey: ["exp_item", id],
    queryFn: async () => {
      const res = await api.experience[":id"].$get({
        param: { id },
      });
      if (!res.ok) throw new Error("Failed to fetch experience item");
      const { data } = await res.json();
      return data;
    },
  });
  return query;
}
