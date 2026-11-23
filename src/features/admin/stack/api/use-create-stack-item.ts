import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { toast } from "sonner";

import { stackFormValues } from "@/src/definitions/stack-validations";
import { toApiError } from "@/src/lib/api-error";
import { api } from "@/src/lib/hono";

import { toStackFormData } from "./stack-form-data";

type ResponseType = InferResponseType<typeof api.stack.$post, 200>;

export function useCreateStackItem() {
  const queryClient = useQueryClient();
  return useMutation<ResponseType, Error, stackFormValues>({
    mutationFn: async (values) => {
      const res = await fetch("/api/stack", { method: "POST", body: toStackFormData(values) });
      if (!res.ok) throw await toApiError(res);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stack"] });
      toast.success("Skill created");
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.message);
    },
  });
}
