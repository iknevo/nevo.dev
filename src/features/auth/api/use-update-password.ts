import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/src/lib/api-error";
import { api } from "@/src/lib/hono";

type ResponseType = InferResponseType<(typeof api.auth)["update-password"]["$patch"]>;
type RequestType = InferRequestType<(typeof api.auth)["update-password"]["$patch"]>["json"];

export function useUpdatePassword() {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await api.auth["update-password"].$patch({
        json,
      });
      const data: ResponseType = await res.json();
      if (!res.ok) {
        throw new Error(getApiErrorMessage(data, res.status));
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.message);
    },
  });
  return mutation;
}
