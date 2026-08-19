import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { toast } from "sonner";

import { stackFormValues } from "@/src/definitions/stack-validations";
import { api } from "@/src/lib/hono";

type ResponseType = InferResponseType<(typeof api.stack)[":id"]["$patch"]>;

export function useUpdateStackItem(id?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: stackFormValues): Promise<ResponseType> => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("icon", values.icon);
      formData.append("type", values.type);
      formData.append("hide", String(values.hide));

      const res = await fetch(`/api/stack/${id}`, {
        method: "PATCH",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || `Request failed (${res.status})`);
      }
      const data = await res.json();
      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["stack"],
      });
      queryClient.invalidateQueries({
        queryKey: ["stack_item", id],
      });
      toast.success("Stack item Updated");
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.message);
    },
  });
}
