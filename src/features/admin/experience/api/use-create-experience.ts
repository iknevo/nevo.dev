import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { toast } from "sonner";

import { expFormValues } from "@/src/definitions/experience-validations";
import { toApiError } from "@/src/lib/api-error";
import { api } from "@/src/lib/hono";

type ResponseType = InferResponseType<typeof api.experience.$post, 200>;

export function useCreateExperience() {
  const queryClient = useQueryClient();
  return useMutation<ResponseType, Error, expFormValues>({
    mutationFn: async (json) => {
      const res = await api.experience.$post({ json });
      if (!res.ok) throw await toApiError(res);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experience"] });
      toast.success("Experience created");
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.message);
    },
  });
}
