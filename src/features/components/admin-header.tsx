"use client";
import { Skeleton } from "@/src/components/ui/skeleton";
import Link from "next/link";
import { useMe } from "../auth/api/use-me";
import LogoutButton from "../auth/components/logout-button";

export const AdminHeader = () => {
  const meQuery = useMe();
  if (!meQuery.data) {
    return (
      <div className="flex dark items-center justify-between">
        <Skeleton className="h-8 w-18" />
        <Skeleton className="h-10 w-20" />
      </div>
    );
  }
  const { user } = meQuery.data;
  return (
    <div className="flex justify-between items-center">
      <Link href="/" className="text-2xl">
        {user.name.toUpperCase()}
      </Link>
      <LogoutButton />
    </div>
  );
};
