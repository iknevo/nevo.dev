import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { toast } from "sonner";

import { expFormValues } from "@/src/definitions/experience-validations";
import { getApiErrorMessage } from "@/src/lib/api-error";
import { api } from "@/src/lib/hono";

type ResponseType = InferResponseType<typeof api.experience.$post>;

export function useCreateExperience() {
  const queryClient = useQueryClient();
  return useMutation<ResponseType, Error, expFormValues>({
    mutationFn: async (json) => {
      const res = await api.experience.$post({ json });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(getApiErrorMessage(data, res.status));
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experience"] });
      toast.success("Experience Created");
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.message);
    },
  });
}
