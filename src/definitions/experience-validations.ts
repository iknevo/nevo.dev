import { z } from "zod";

export const experienceSchema = z.object({
  title: z.string().min(3, "Experience's title is required"),
  company: z.string().min(3, "Experience's company is required"),
  startDate: z.string().min(3, "Experience's start date is required"),
  endDate: z.string().min(3, "Experience's end date is required")
});

export type expFormValues = z.infer<typeof experienceSchema>;
export type expItemType = z.infer<typeof experienceSchema>;
export type extendedExpType = expItemType & { _id: string };

export const expFormDefaults: expFormValues = {
  title: "",
  company: "",
  startDate: "",
  endDate: "Present"
};
