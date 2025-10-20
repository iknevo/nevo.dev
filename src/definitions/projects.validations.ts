import { z } from "zod";

export const CreateProjectSchema = z.object({
  name: z.string().min(3, "project's name is required"),
  year: z
    .string()
    .refine(
      (val) => Number(val) >= 2000 && Number(val) <= new Date().getFullYear(),
      { error: `year must be between 2000 and ${new Date().getFullYear()}` }
    ),
  liveUrl: z.string(),
  sourceCode: z.string(),
  description: z.string(),
  features: z
    .array(
      z.object({
        item: z.string().min(1, "feature item cannot be empty"),
      })
    )
    .min(1, "add at least one feature"),
  techStack: z
    .array(
      z.object({
        item: z.string(),
      })
    )
    .min(1, "add at least one tech stack item"),
  thumbnail: z.union([
    z.string(),
    z
      .instanceof(File)
      .refine((file) => file.size > 0, { error: "Please add a thumbnail" }),
  ]),
  images: z
    .array(
      z.object({
        item: z
          .union([z.string(), z.instanceof(File)])
          .refine(
            (f) => f instanceof File && f.size > 0,
            "Please upload an image"
          ),
      })
    )
    .min(1, "Add at least one image"),
});

export type CreateProjectFormValues = z.infer<typeof CreateProjectSchema>;

export const ProjectFormDefaults: CreateProjectFormValues = {
  name: "",
  year: new Date().getFullYear().toString(),
  liveUrl: "",
  sourceCode: "",
  description: "",
  features: [{ item: "" }],
  techStack: [{ item: "" }],
  thumbnail: new File([], ""),
  images: [{ item: "" }],
};
