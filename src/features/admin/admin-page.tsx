"use client";
import LogoutButton from "../auth/components/logout-button";
import useMe from "./api/use-me";

export default function AdminPage() {
  const meQuery = useMe();
  if (!meQuery.data) {
    return <p>empty</p>;
  }
  const { user } = meQuery.data;

  return (
    <div className="min-h-screen flex justify-between">
      <p className="text-2xl">{user.name.toUpperCase()}</p>
      <LogoutButton />
    </div>
  );
}
