import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type ReorderVariables = {
  ids: string[];
  type?: string;
};

type ReorderResponse = {
  success: boolean;
};

export function useReorder(queryKey: unknown[]) {
  const queryClient = useQueryClient();
  const resource = queryKey[0] as string;

  return useMutation<ReorderResponse, Error, ReorderVariables>({
    mutationFn: async ({ ids, type }: ReorderVariables) => {
      const body: Record<string, unknown> = { ids };
      if (type) body.type = type;

      const res = await fetch(`/api/${resource}/reorder`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || `Reorder failed (${res.status})`);
      }

      return res.json();
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
    },
    onError: (err) => {
      toast.error(err.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
