import { z } from "zod";

export const BLOG_SOURCES = [
  { value: "x", label: "X" },
  { value: "devto", label: "DEV" },
  { value: "medium", label: "Medium" },
  { value: "youtube", label: "YouTube" },
  { value: "other", label: "Elsewhere" },
] as const;

const sourceValues = BLOG_SOURCES.map((source) => source.value) as [
  (typeof BLOG_SOURCES)[number]["value"],
  ...(typeof BLOG_SOURCES)[number]["value"][],
];

export const blogSchema = z
  .object({
    title: z.string().trim().min(3, "Blog's title is required"),
    summary: z.string().trim().min(3, "Blog's summary is required"),
    tags: z.array(z.string().trim().min(1, "Tags can't be empty")).min(1, "Add at least one tag"),
    image: z.union([z.string(), z.instanceof(File)]),
    doc: z.string(),
    externalUrl: z.union([z.literal(""), z.url("Enter a valid URL")]),
    source: z.union([z.literal(""), z.enum(sourceValues)]),
    hide: z.boolean(),
  })
  .superRefine((values, ctx) => {
    if (!values.externalUrl && values.doc.trim().length < 3) {
      ctx.addIssue({ code: "custom", path: ["doc"], message: "Blog's body is required" });
    }
    if (values.externalUrl && !values.source) {
      ctx.addIssue({ code: "custom", path: ["source"], message: "Pick where it's published" });
    }
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
  externalUrl: "",
  source: "",
  hide: false,
};
