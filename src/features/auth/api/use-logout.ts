import { api } from "@/src/lib/hono";
import { useMutation } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof api.auth.logout.$post>;

export function useLogout() {
  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const res = await api.auth.logout.$post();
      const data: ResponseType = await res.json();
      return data;
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.message);
    }
  });
  return mutation;
}
