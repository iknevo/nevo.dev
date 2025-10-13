import { ProjectFormValues } from "@/src/definitions/projects.validations";
import { api } from "@/src/lib/hono";
import { useMutation } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof api.projects.$post>;

export default function useCreateProject() {
  return useMutation<ResponseType, Error, ProjectFormValues>({
    mutationFn: async (values) => {
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("year", values.year);
      formData.append("liveUrl", values.liveUrl);
      formData.append("sourceCode", values.sourceCode);
      formData.append("description", values.description);

      // Thumbnail (single)
      formData.append("thumbnail", values.thumbnail);

      // Multiple image files
      values.images.forEach((img) => {
        if (img.item) formData.append("images", img.item);
      });

      values.features.forEach((feat) => {
        if (feat.item) formData.append("features", feat.item);
      });
      values.techStack.forEach((tech) => {
        if (tech.item) formData.append("techStack", tech.item);
      });

      const res = await fetch("/api/projects", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        try {
          const errData = await res.json();
          throw new Error(errData.message || `Request failed (${res.status})`);
        } catch {
          throw new Error(`Request failed (${res.status})`);
        }
      }

      const data = await res.json();
      toast.success("Project Created");
      return data;
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.message);
    },
  });
}
