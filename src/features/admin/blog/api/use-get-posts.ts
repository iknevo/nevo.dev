import { useQuery } from "@tanstack/react-query";

import { toApiError } from "@/src/lib/api-error";
import { api } from "@/src/lib/hono";
import { PostResponse } from "@/src/types";

export function useGetPosts(withHidden: boolean = false) {
  const query = useQuery<PostResponse[]>({
    queryKey: ["blog_posts", withHidden],
    queryFn: async () => {
      const res = await api.blog.$get({
        query: {
          withHidden,
        },
      });
      if (!res.ok) throw await toApiError(res);
      const { data } = await res.json();
      return data;
    },
  });
  return query;
}
