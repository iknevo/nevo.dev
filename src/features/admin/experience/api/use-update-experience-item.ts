import { api } from "@/src/lib/hono";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<(typeof api.experience)[":id"]["$patch"]>;
type RequestType = InferRequestType<
  (typeof api.experience)[":id"]["$patch"]
>["json"];

export function useUpdateExperienceItem(id?: string) {
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await api.experience[":id"].$patch({ param: { id }, json });
      const data = await res.json();
      return data;
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.message);
    }
  });
}
