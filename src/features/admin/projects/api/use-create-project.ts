import { api } from "@/src/lib/hono";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof api.projects.$post>;
type RequestType = InferRequestType<typeof api.projects.$post>["json"];

export default function useCreateProject() {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await api.projects.$post({ json });
      if (!res.ok) {
        let message = `Request failed with status ${res.status}`;
        try {
          const errData = await res.json();
          message = errData.message || message;
        } catch {
          const text = await res.text();
          if (text) message = text;
        }
        throw new Error(message);
      }
      const data: ResponseType = await res.json();
      return data;
    },
    onSuccess: () => {
      toast.success("Project Created");
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.message);
    },
  });
  return mutation;
}
