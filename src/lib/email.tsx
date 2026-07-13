"use server";

import { render } from "@react-email/render";
import { Resend } from "resend";

import { env } from "@/src/config/env";

import PasswordResetEmail from "./emails/password-reset";

type Options = {
  email: string;
  subject: string;
  html: string;
};

const resend = new Resend(env.resendKey);

export const sendEmail = async (options: Options) => {
  await resend.emails.send({
    from: "NEVO.dev <onboarding@resend.dev>",
    to: options.email,
    subject: options.subject,
    html: options.html,
  });
};

export const sendPasswordResetEmail = async (email: string, resetUrl: string) => {
  const html = await render(<PasswordResetEmail resetUrl={resetUrl} />);
  await sendEmail({
    email,
    subject: "Reset your password — NEVO.dev",
    html,
  });
};
