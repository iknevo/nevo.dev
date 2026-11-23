import { projectFormValues } from "@/src/definitions/projects-validations";

export function toProjectFormData(values: projectFormValues) {
  const formData = new FormData();
  formData.append("name", values.name);
  formData.append("year", values.year);
  formData.append("liveUrl", values.liveUrl);
  formData.append("sourceCode", values.sourceCode);
  formData.append("description", values.description);
  formData.append("thumbnail", values.thumbnail);
  formData.append("hide", String(values.hide));
  values.features.forEach((feat) => {
    if (feat.item) formData.append("features", feat.item);
  });
  values.techStack.forEach((tech) => {
    if (tech.item) formData.append("techStack", tech.item);
  });
  return formData;
}
