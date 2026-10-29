import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/src/lib/api-error";
import { api } from "@/src/lib/hono";

export function useDeleteExperience(id?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await api.experience[":id"].$delete({
        param: { id },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(getApiErrorMessage(data, res.status));
      }
      return data;
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["exp_item", id] });
      queryClient.invalidateQueries({ queryKey: ["experience"] });
      toast.success("Experience Deleted");
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.message || "Failed to delete experience");
    },
  });

  return mutation;
}
