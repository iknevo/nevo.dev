import { client } from "@/src/lib/hono";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.auth.login.$post>;
type RequestType = InferRequestType<typeof client.api.auth.login.$post>["json"];

export default function useLogin() {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await client.api.auth.login.$post({ json });
      const data: ResponseType = await res.json();
      if ("success" in data && data.success === false) {
        throw new Error(data.message);
      }
      return data;
    },
    onSuccess: () => {
      toast.success("Welcome NEVO.");
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.message);
    },
  });
  return mutation;
}
