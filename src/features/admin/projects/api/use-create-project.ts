import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { toast } from "sonner";

import { projectFormValues } from "@/src/definitions/projects-validations";
import { toApiError } from "@/src/lib/api-error";
import { api } from "@/src/lib/hono";

import { toProjectFormData } from "./project-form-data";

type ResponseType = InferResponseType<typeof api.projects.$post, 200>;

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation<ResponseType, Error, projectFormValues>({
    mutationFn: async (values) => {
      const res = await fetch("/api/projects", {
        method: "POST",
        body: toProjectFormData(values),
      });
      if (!res.ok) throw await toApiError(res);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project created");
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.message);
    },
  });
}
