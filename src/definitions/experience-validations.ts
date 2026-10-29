import { z } from "zod";

const monthYearPattern = /^(0[1-9]|1[0-2])\/\d{4}$/;

const monthYearSchema = z.string().trim().regex(monthYearPattern, "Use the MM/YYYY format");

const endDateSchema = z
  .string()
  .trim()
  .transform((value) => (value.toLowerCase() === "present" ? "Present" : value))
  .refine((value) => value === "Present" || monthYearPattern.test(value), {
    message: "Use MM/YYYY or Present",
  });

export const experienceSchema = z
  .object({
    title: z.string().trim().min(3, "Experience's title is required"),
    company: z.string().trim().min(3, "Experience's company is required"),
    startDate: monthYearSchema,
    endDate: endDateSchema,
    sortIndex: z.number().min(1, "Sort Index can't be less than 1").optional(),
    hide: z.boolean(),
  })
  .refine(
    ({ startDate, endDate }) => {
      if (endDate === "Present" || !monthYearPattern.test(startDate)) return true;
      if (!monthYearPattern.test(endDate)) return true;

      const toMonthIndex = (value: string) => {
        const [month, year] = value.split("/").map(Number);
        return year * 12 + month;
      };

      return toMonthIndex(endDate) >= toMonthIndex(startDate);
    },
    {
      message: "End date must be after the start date",
      path: ["endDate"],
    }
  );

export type expFormValues = z.infer<typeof experienceSchema>;
export type expItemType = z.infer<typeof experienceSchema>;
export type extendedExpType = expItemType & { _id: string };

export const expFormDefaults: expFormValues = {
  title: "",
  company: "",
  startDate: "",
  endDate: "Present",
  hide: false,
};
