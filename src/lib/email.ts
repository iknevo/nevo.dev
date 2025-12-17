"use server";

import { env } from "@/src/config/env";
import { Resend } from "resend";

type Options = {
  email: string;
  subject: string;
  message: string;
};

const resend = new Resend(env.resendKey);
export const sendEmail = async (options: Options) => {
  await resend.emails.send({
    from: "NEVO.dev <onboarding@resend.dev>",
    to: options.email,
    subject: options.subject,
    html: `<p>${options.message}</p>`
  });
};
