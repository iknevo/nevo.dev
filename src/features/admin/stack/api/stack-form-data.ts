import { stackFormValues } from "@/src/definitions/stack-validations";

export function toStackFormData(values: stackFormValues) {
  const formData = new FormData();
  formData.append("name", values.name);
  formData.append("icon", values.icon);
  formData.append("type", values.type);
  formData.append("hide", String(values.hide));
  return formData;
}
