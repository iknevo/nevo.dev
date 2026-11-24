import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { toApiError } from "@/src/lib/api-error";
import { api } from "@/src/lib/hono";

type Endpoint = typeof api.profile.$patch;
type ResponseType = InferResponseType<Endpoint, 200>;
type RequestType = InferRequestType<Endpoint>["json"];

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await api.profile.$patch({ json });
      if (!res.ok) throw await toApiError(res);
      return res.json();
    },
    onSuccess: ({ data }) => {
      queryClient.setQueryData(["profile"], data);
    },
  });
}
