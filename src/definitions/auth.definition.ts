import { z } from "zod";

export const LoginFormSchema = z.object({
  email: z.email({ error: "Please enter a valid email." }),
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters" }),
});

export const PasswordResetSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    passwordConfirm: z.string().min(8, {
      message: "Password confirmation must be at least 8 characters",
    }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords must match",
    path: ["passwordConfirm"],
  });
