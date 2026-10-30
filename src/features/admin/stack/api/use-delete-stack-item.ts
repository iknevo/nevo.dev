import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/src/lib/api-error";
import { api } from "@/src/lib/hono";

export function useDeleteStackItem(id?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await api.stack[":id"].$delete({
        param: { id },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(getApiErrorMessage(data, res.status));
      }
      return null;
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["stack_item", id] });
      queryClient.invalidateQueries({ queryKey: ["stack"] });
      toast.success("Stack Item Deleted");
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.message || "Failed to delete stack item");
    },
  });

  return mutation;
}
