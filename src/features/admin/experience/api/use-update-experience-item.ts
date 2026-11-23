import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { toApiError } from "@/src/lib/api-error";
import { api } from "@/src/lib/hono";

type ResponseType = InferResponseType<(typeof api.experience)[":id"]["$patch"], 200>;
type RequestType = InferRequestType<(typeof api.experience)[":id"]["$patch"]>["json"];

export function useUpdateExperienceItem(id?: string) {
  const queryClient = useQueryClient();
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await api.experience[":id"].$patch({ param: { id }, json });
      if (!res.ok) throw await toApiError(res);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exp_item"] });
      queryClient.invalidateQueries({ queryKey: ["experience"] });
      toast.success("Experience updated");
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.message);
    },
  });
}
