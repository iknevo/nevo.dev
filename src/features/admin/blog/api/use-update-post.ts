import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { toast } from "sonner";

import { blogFormValues } from "@/src/definitions/blog-validation";
import { api } from "@/src/lib/hono";

type ResponseType = InferResponseType<(typeof api.blog)[":id"]["$patch"]>;

export function useUpdatePost(id?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: blogFormValues): Promise<ResponseType> => {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("summary", values.summary);
      formData.append("doc", values.doc);
      formData.append("image", values.image);
      formData.append("hide", String(values.hide));
      values.tags.forEach((tag) => {
        if (tag) formData.append("tags", tag);
      });

      const res = await fetch(`/api/blog/${id}`, {
        method: "PATCH",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || `Request failed (${res.status})`);
      }

      const data = await res.json();
      toast.success("Post Updated");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["blog_posts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["blog_post", id],
      });
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.message);
    },
  });
}
