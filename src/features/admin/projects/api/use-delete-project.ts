import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/src/lib/api-error";
import { api } from "@/src/lib/hono";

export function useDeleteProject(id?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await api.projects[":id"].$delete({
        param: { id },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(getApiErrorMessage(data, res.status));
      }
      return null;
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["project", id] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project Deleted");
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.message || "Failed to delete project");
    },
  });

  return mutation;
}
