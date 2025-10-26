import { api } from "@/src/lib/hono";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof api.auth)["reset-password"][":token"]["$patch"]
>;
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
      if ("success" in data && data.success === false) {
        throw new Error(data.message);
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
