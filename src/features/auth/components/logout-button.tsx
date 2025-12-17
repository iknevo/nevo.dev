"use client";

import { Button } from "@/src/components/ui/button";
import { useLogout } from "@/src/features/auth/api/use-logout";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const { mutate, isPending } = useLogout();
  const handleLogout = () => {
    mutate(undefined, {
      onSuccess: () => {
        router.push("/auth/login");
      }
    });
  };
  return (
    <Button
      size="lg"
      disabled={isPending}
      className="cursor text-lg font-bold max-sm:px-3 max-sm:text-sm"
      onClick={handleLogout}
    >
      {isPending ? <Loader2 className="animate-spin" /> : "Logout"}
    </Button>
  );
}
