import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { toast } from "sonner";

import { blogFormValues } from "@/src/definitions/blog-validation";
import { toApiError } from "@/src/lib/api-error";
import { api } from "@/src/lib/hono";

import { toPostFormData } from "./post-form-data";

type ResponseType = InferResponseType<typeof api.blog.$post, 200>;

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation<ResponseType, Error, blogFormValues>({
    mutationFn: async (values) => {
      const res = await fetch("/api/blog", { method: "POST", body: toPostFormData(values) });
      if (!res.ok) throw await toApiError(res);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog_posts"] });
      toast.success("Post created");
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.message);
    },
  });
}
