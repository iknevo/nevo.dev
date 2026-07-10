import { useQuery } from "@tanstack/react-query";

import { api } from "@/src/lib/hono";
import { PostResponse } from "@/src/types";

export function useGetPost(id?: string, withHidden: boolean = false) {
  const query = useQuery<PostResponse>({
    enabled: !!id,
    queryKey: ["blog_post", id, withHidden],
    queryFn: async () => {
      const res = await api.blog[":id"].$get({
        param: { id },
        query: { withHidden: String(withHidden) },
      });
      if (!res.ok) throw new Error("Failed to fetch post");
      const { data } = await res.json();
      return data;
    },
  });
  return query;
}
