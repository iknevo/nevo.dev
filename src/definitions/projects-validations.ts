import { z } from "zod";

export const projectSchema = z.object({
  name: z.string().trim().min(3, "Project's name is required"),
  year: z.string().refine((val) => Number(val) >= 2000 && Number(val) <= new Date().getFullYear(), {
    error: `Year must be between 2000 and ${new Date().getFullYear()}`,
  }),
  liveUrl: z.url("Please enter a valid URL").or(z.literal("")),
  sourceCode: z.url("Please enter a valid URL").or(z.literal("")),
  description: z.string().trim().min(3, "Project's description is required"),
  features: z
    .array(
      z.object({
        item: z.string().trim().min(1, "Feature item cannot be empty"),
      })
    )
    .min(1, "Add at least one feature"),
  techStack: z
    .array(
      z.object({
        item: z.string().trim().min(1, "Technology cannot be empty"),
      })
    )
    .min(1, "Add at least one tech stack item"),
  thumbnail: z.union([
    z.string().trim().min(1, "Please add a Thumbnail"),
    z.instanceof(File).refine((file) => file.size > 0, { error: "Please add a Thumbnail" }),
  ]),
  sortIndex: z.number().min(1, "Sort Index can't be less than 1").optional(),
  hide: z.boolean(),
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
  hide: false,
};
