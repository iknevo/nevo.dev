import { z } from "zod";

export const projectSchema = z.object({
  name: z.string().min(3, "Project's name is required"),
  year: z
    .string()
    .refine(
      (val) => Number(val) >= 2000 && Number(val) <= new Date().getFullYear(),
      { error: `Year must be between 2000 and ${new Date().getFullYear()}` }
    ),
  liveUrl: z.string(),
  sourceCode: z.string(),
  description: z.string().min(3, "Project's description is required"),
  features: z
    .array(
      z.object({
        item: z.string().min(1, "Feature item cannot be empty")
      })
    )
    .min(1, "Add at least one feature"),
  techStack: z
    .array(
      z.object({
        item: z.string()
      })
    )
    .min(1, "Add at least one tech stack item"),
  thumbnail: z.union([
    z.string(),
    z
      .instanceof(File)
      .refine((file) => file.size > 0, { error: "Please add a Thumbnail" })
  ]),
  image: z.union([
    z.string(),
    z
      .instanceof(File)
      .refine((file) => file.size > 0, { error: "Please add an Image" })
  ])
});

export type projectFormValues = z.infer<typeof projectSchema>;

export const projectFormDefaults: projectFormValues = {
  name: "",
  year: new Date().getFullYear().toString(),
  liveUrl: "",
  sourceCode: "",
  description: "",
  features: [{ item: "" }],
  techStack: [{ item: "" }],
  thumbnail: "",
  image: ""
};
