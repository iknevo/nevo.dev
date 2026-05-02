import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { api } from "@/src/lib/hono";

type ResponseType = InferResponseType<(typeof api.experience)[":id"]["$patch"]>;
type RequestType = InferRequestType<(typeof api.experience)[":id"]["$patch"]>["json"];

export function useUpdateExperienceItem(id?: string) {
  const queryClient = useQueryClient();
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await api.experience[":id"].$patch({ param: { id }, json });
      const data = await res.json();
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["experience"],
      });
      queryClient.invalidateQueries({
        queryKey: ["exp_item", id],
      });
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.message);
    },
  });
}
