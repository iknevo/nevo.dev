import { useEffect } from "react";

import { usePostView } from "@/src/features/blog/api/use-post-view";

export function useTrackPostView(postId: string | undefined) {
  const viewMutation = usePostView();

  useEffect(() => {
    if (!postId) return;
    const key = `viewed_${postId}`;
    if (sessionStorage.getItem(key)) return;
    viewMutation.mutate(postId);
    sessionStorage.setItem(key, "1");
  }, [postId, viewMutation]);
}
