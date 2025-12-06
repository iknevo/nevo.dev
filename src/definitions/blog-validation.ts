import { z } from "zod";

export const blogSchema = z.object({
  title: z.string().min(3, "Blog's title is required"),
  summary: z.string().min(3, "Blog's summary is required"),
  tags: z.array(z.string()).min(1, "Add at least one tag"),
  image: z.union([z.string(), z.instanceof(File)]),
  doc: z.string().min(3, "Blog's body is required"),
});

export type blogFormValues = z.infer<typeof blogSchema>;
export type blogItemType = z.infer<typeof blogSchema>;
export type extendedBlogType = blogItemType & { _id: string };

export const blogFormDefaults: blogFormValues = {
  title: "",
  summary: "",
  tags: [],
  image: "",
  doc: "",
};
