"use client";

import Link from "next/link";

import { Skeleton } from "@/src/components/ui/skeleton";
import { useMe } from "@/src/features/auth/api/use-me";
import LogoutButton from "@/src/features/auth/components/logout-button";

export const AdminHeader = () => {
  const meQuery = useMe();
  if (!meQuery.data) {
    return (
      <div className="dark flex items-center justify-between">
        <Skeleton className="h-8 w-18" />
        <Skeleton className="h-10 w-20" />
      </div>
    );
  }
  const { user } = meQuery.data;
  return (
    <div className="flex items-center justify-between">
      <Link href="/" className="text-2xl">
        {user.name.toUpperCase()}
      </Link>
      <LogoutButton />
    </div>
  );
};
