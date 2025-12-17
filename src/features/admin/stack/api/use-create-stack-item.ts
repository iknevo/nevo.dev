import { stackFormValues } from "@/src/definitions/stack-validations";
import { api } from "@/src/lib/hono";
import { useMutation } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof api.stack.$post>;

export function useCreateStackItem() {
  return useMutation<ResponseType, Error, stackFormValues>({
    mutationFn: async (values) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("icon", values.icon);
      formData.append("type", values.type);

      const res = await fetch("/api/stack", {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || `Request failed (${res.status})`);
      }

      const data = await res.json();
      toast.success("Stack Item Created");
      return data;
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.message);
    }
  });
}
