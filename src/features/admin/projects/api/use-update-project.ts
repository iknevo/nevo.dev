import { useMutation } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { toast } from "sonner";

import { projectFormValues } from "@/src/definitions/projects-validations";
import { api } from "@/src/lib/hono";

type ResponseType = InferResponseType<(typeof api.projects)[":id"]["$patch"]>;

export function useUpdateProject(id?: string) {
  return useMutation({
    mutationFn: async (values: projectFormValues): Promise<ResponseType> => {
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("year", values.year);
      formData.append("liveUrl", values.liveUrl);
      formData.append("sourceCode", values.sourceCode);
      formData.append("description", values.description);
      formData.append("thumbnail", values.thumbnail);
      formData.append("image", values.image);

      values.features.forEach((feat) => {
        if (feat.item) formData.append("features", feat.item);
      });
      values.techStack.forEach((tech) => {
        if (tech.item) formData.append("techStack", tech.item);
      });
      const res = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        body: formData
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || `Request failed (${res.status})`);
      }

      const data = await res.json();
      toast.success("Project Updated");
      return data;
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.message);
    }
  });
}
