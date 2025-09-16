"use client";
import LogoutButton from "../auth/components/logout-button";
import { useAuthState } from "../auth/state/auth-state";

export default function AdminPage() {
  const { user, accessToken } = useAuthState();
  console.log({ user, accessToken });
  return (
    <div>
      admin-page
      <LogoutButton />
    </div>
  );
}
