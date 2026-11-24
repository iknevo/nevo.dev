import { blogFormValues } from "@/src/definitions/blog-validation";

export function toPostFormData(values: blogFormValues) {
  const formData = new FormData();
  formData.append("title", values.title);
  formData.append("summary", values.summary);
  formData.append("doc", values.doc);
  formData.append("image", values.image);
  formData.append("externalUrl", values.externalUrl);
  formData.append("source", values.source);
  formData.append("hide", String(values.hide));
  values.tags.forEach((tag) => {
    if (tag) formData.append("tags", tag);
  });
  return formData;
}
