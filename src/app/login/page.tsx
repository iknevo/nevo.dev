import LoginForm from "@/src/features/auth/components/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LOGIN",
};

export default function Page() {
  return (
    <div className="h-screen grid place-items-center">
      <LoginForm />
    </div>
  );
}
