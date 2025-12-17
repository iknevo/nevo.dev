import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/src/lib/hono";

export function useDeleteExperience(id?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await api.experience[":id"].$delete({
        param: { id }
      });
      const data = await res.json();
      return data;
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["exp_item", id] });
      queryClient.invalidateQueries({ queryKey: ["experience"] });
      toast.success("Experience Deleted");
    },
    onError: (err) => {
      console.error(err);
      toast.error("Failed to delete experience");
    }
  });

  return mutation;
}
