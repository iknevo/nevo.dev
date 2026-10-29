import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/src/lib/api-error";
import { api } from "@/src/lib/hono";

export function useDeletePost(id?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await api.blog[":id"].$delete({
        param: { id },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(getApiErrorMessage(data, res.status));
      }
      return null;
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["blog_post", id] });
      queryClient.invalidateQueries({ queryKey: ["blog_posts"] });
      toast.success("Post Deleted");
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.message || "Failed to delete post");
    },
  });

  return mutation;
}
