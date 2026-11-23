import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { toApiError } from "@/src/lib/api-error";
import { api } from "@/src/lib/hono";

export function useDeleteStackItem(id?: string) {
  const queryClient = useQueryClient();
  return useMutation<null, Error>({
    mutationFn: async () => {
      const res = await api.stack[":id"].$delete({ param: { id } });
      if (!res.ok) throw await toApiError(res);
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stack_item"], refetchType: "none" });
      queryClient.invalidateQueries({ queryKey: ["stack"] });
      toast.success("Skill deleted");
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.message);
    },
  });
}
