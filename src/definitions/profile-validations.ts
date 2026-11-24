import { z } from "zod";

export const ProfileSchema = z.object({
  openToWork: z.boolean(),
  note: z.string().trim().max(120, "Keep the note under 120 characters"),
  location: z.string().trim().max(60, "Keep the location under 60 characters"),
  timezone: z.string().trim().max(20, "Keep the timezone under 20 characters"),
});

export type ProfileValues = z.infer<typeof ProfileSchema>;
