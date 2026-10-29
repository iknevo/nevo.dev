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
      const data = await res.json();
      if (!res.ok) {
        throw new Error(getApiErrorMessage(data, res.status));
      }
      return data;
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
