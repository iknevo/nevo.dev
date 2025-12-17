import Cursor from "@/src/components/cursor";
import LoginForm from "@/src/features/auth/components/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LOGIN"
};

export default function Page() {
  return (
    <div className="grid h-screen place-items-center">
      <LoginForm />
      <Cursor />
    </div>
  );
}
