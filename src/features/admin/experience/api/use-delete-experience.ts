import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { toApiError } from "@/src/lib/api-error";
import { api } from "@/src/lib/hono";

export function useDeleteExperience(id?: string) {
  const queryClient = useQueryClient();
  return useMutation<null, Error>({
    mutationFn: async () => {
      const res = await api.experience[":id"].$delete({ param: { id } });
      if (!res.ok) throw await toApiError(res);
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exp_item"], refetchType: "none" });
      queryClient.invalidateQueries({ queryKey: ["experience"] });
      toast.success("Experience deleted");
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.message);
    },
  });
}
