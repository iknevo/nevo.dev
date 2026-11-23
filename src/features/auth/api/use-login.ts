import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { toApiError } from "@/src/lib/api-error";
import { api } from "@/src/lib/hono";

type ResponseType = InferResponseType<typeof api.auth.login.$post, 200>;
type RequestType = InferRequestType<typeof api.auth.login.$post>["json"];

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await api.auth.login.$post({ json });
      if (!res.ok) throw await toApiError(res);
      return res.json();
    },
    onSuccess: ({ message }) => {
      queryClient.clear();
      toast.success(message);
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.message);
    },
  });
}
