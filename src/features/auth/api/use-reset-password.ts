import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/src/lib/api-error";
import { api } from "@/src/lib/hono";

type ResponseType = InferResponseType<(typeof api.auth)["reset-password"][":token"]["$patch"]>;
type RequestType = InferRequestType<
  (typeof api.auth)["reset-password"][":token"]["$patch"]
>["json"];

export function useResetPassword(token: string) {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await api.auth["reset-password"][":token"].$patch({
        param: { token },
        json,
      });
      const data: ResponseType = await res.json();
      if (!res.ok) {
        throw new Error(getApiErrorMessage(data, res.status));
      }
      return data;
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.message);
    },
  });
  return mutation;
}
