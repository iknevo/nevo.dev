import { Metadata } from "next";

import UpdatePasswordForm from "@/src/features/auth/components/update-password-form";

export const metadata: Metadata = {
  title: "UPDATE PASSWORD",
};

export default function Page() {
  return <UpdatePasswordForm />;
}
