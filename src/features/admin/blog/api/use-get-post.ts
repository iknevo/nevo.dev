import { blogItemType } from "@/src/definitions/blog-validation";
import { api } from "@/src/lib/hono";
import { useQuery } from "@tanstack/react-query";

export function useGetPost(id?: string) {
  const query = useQuery<blogItemType>({
    enabled: !!id,
    queryKey: ["blog_post", id],
    queryFn: async () => {
      const res = await api.blog[":id"].$get({
        param: { id },
      });
      if (!res.ok) throw new Error("Failed to fetch post");
      const { data } = await res.json();
      return data;
    },
  });
  return query;
}
