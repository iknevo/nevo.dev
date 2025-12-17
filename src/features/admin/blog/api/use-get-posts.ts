import { useQuery } from "@tanstack/react-query";

import { api } from "@/src/lib/hono";
import { PostResponse } from "@/src/types";

export function useGetPosts() {
  const query = useQuery<PostResponse[]>({
    queryKey: ["blog_posts"],
    queryFn: async () => {
      const res = await api.blog.$get();
      if (!res.ok) throw new Error("Failed to fetch posts");
      const { data } = await res.json();
      return data;
    }
  });
  return query;
}
