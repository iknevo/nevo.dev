import { api } from "@/src/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteStackItem(id?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await api.stack[":id"].$delete({
        param: { id },
      });
      const data = await res.json();
      return data;
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["stack_item", id] });
      queryClient.invalidateQueries({ queryKey: ["stack"] });
      toast.success("Stack Item Deleted");
    },
    onError: (err) => {
      console.error(err);
      toast.error("Failed to delete stack item");
    },
  });

  return mutation;
}
