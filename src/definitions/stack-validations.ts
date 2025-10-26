import { z } from "zod";

export const stackSchema = z.object({
  name: z.string().min(3, "Stack's name is required"),
  icon: z.union([
    z.string(),
    z
      .instanceof(File)
      .refine((file) => file.size > 0, { error: "Please add an Icon" }),
  ]),
  type: z.string()
});

export type stackFormValues = z.infer<typeof stackSchema>;
export type stackItemType = z.infer<typeof stackSchema>;

export const stackFormDefaults: stackFormValues = {
  name: "",
  icon: "",
  type: "frontend"
};
