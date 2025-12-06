import { blogFormValues } from "@/src/definitions/blog-validation";
import { api } from "@/src/lib/hono";
import { useMutation } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof api.blog.$post>;

export function useCreatePost() {
  return useMutation<ResponseType, Error, blogFormValues>({
    mutationFn: async (values) => {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("summary", values.summary);
      formData.append("doc", values.doc);
      formData.append("image", values.image);
      values.tags.forEach((tag) => {
        if (tag) formData.append("tags", tag);
      });

      const res = await fetch("/api/blog", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || `Request failed (${res.status})`);
      }

      const data = await res.json();
      toast.success("Post Created");
      return data;
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.message);
    },
  });
}
