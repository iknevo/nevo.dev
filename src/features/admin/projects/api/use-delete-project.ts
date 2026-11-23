import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { toApiError } from "@/src/lib/api-error";
import { api } from "@/src/lib/hono";

export function useDeleteProject(id?: string) {
  const queryClient = useQueryClient();
  return useMutation<null, Error>({
    mutationFn: async () => {
      const res = await api.projects[":id"].$delete({ param: { id } });
      if (!res.ok) throw await toApiError(res);
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project"], refetchType: "none" });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted");
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.message);
    },
  });
}
