import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { toApiError } from "@/src/lib/api-error";
import { api } from "@/src/lib/hono";

type Endpoint = (typeof api.auth)["forgot-password"]["$post"];
type ResponseType = InferResponseType<Endpoint, 200>;
type RequestType = InferRequestType<Endpoint>["json"];

export function useForgetPassword() {
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await api.auth["forgot-password"].$post({ json });
      if (!res.ok) throw await toApiError(res);
      return res.json();
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.message);
    },
  });
}
