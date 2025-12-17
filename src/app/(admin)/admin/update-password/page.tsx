import UpdatePasswordForm from "@/src/features/auth/components/update-password-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "UPDATE PASSWORD"
};

export default async function Page() {
  return (
    <div className="grid h-screen place-items-center">
      <UpdatePasswordForm />
    </div>
  );
}
