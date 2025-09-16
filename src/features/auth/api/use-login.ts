import { useAuthState } from "@/src/features/auth/state/auth-state";
import { api } from "@/src/lib/hono";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof api.auth.login.$post>;
type RequestType = InferRequestType<typeof api.auth.login.$post>["json"];

export default function useLogin() {
  const { setAuth } = useAuthState();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await api.auth.login.$post({ json });
      const data: ResponseType = await res.json();
      if ("success" in data && data.success === false) {
        throw new Error(data.message);
      }
      return data;
    },
    onSuccess: (session: ResponseType) => {
      if ("user" in session) setAuth(session.user, session.accessToken);
      toast.success("Welcome NEVO.");
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.message);
    },
  });
  return mutation;
}
