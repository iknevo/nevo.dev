import { api } from "@/src/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteProject(id?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await api.projects[":id"].$delete({
        param: { id }
      });
      const data = await res.json();
      return data;
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["project", id] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Account Deleted");
    },
    onError: (err) => {
      console.error(err);
      toast.error("Failed to delete project");
    }
  });

  return mutation;
}
