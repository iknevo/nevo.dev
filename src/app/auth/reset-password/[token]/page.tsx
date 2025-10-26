import Cursor from "@/src/components/cursor";
import ResetPasswordForm from "@/src/features/auth/components/reset-password-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "RESET PASSWORD",
};

export default async function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return (
    <div className="h-screen grid place-items-center">
      <ResetPasswordForm token={token} />
      <Cursor />
    </div>
  );
}
