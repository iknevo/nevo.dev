import { blogItemType } from "@/src/definitions/blog-validation";
import { api } from "@/src/lib/hono";
import { useQuery } from "@tanstack/react-query";

export function useGetPosts() {
  const query = useQuery<blogItemType[]>({
    queryKey: ["blog_posts"],
    queryFn: async () => {
      const res = await api.blog.$get();
      if (!res.ok) throw new Error("Failed to fetch posts");
      const { data } = await res.json();
      return data;
    },
  });
  return query;
}
