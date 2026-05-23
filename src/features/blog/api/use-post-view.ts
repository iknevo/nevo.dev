import { useMutation } from "@tanstack/react-query";

import { api } from "@/src/lib/hono";

export function usePostView() {
  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.blog[":id"].view.$patch({
        param: { id },
      });
      if (!res.ok) throw new Error("Failed to record view");
      return res.json();
    },
  });
  return mutation;
}
