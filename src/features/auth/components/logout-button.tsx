"use client";
import { Button } from "@/src/components/ui/button";
import useLogout from "@/src/features/auth/api/use-logout";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const logoutMutation = useLogout();
  const { isPending } = logoutMutation;
  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        router.push("/auth/login");
      },
    });
  };
  return (
    <Button
      size="lg"
      disabled={isPending}
      className="cursor text-sm font-bold"
      onClick={handleLogout}
    >
      {isPending ? <Loader2 className="animate-spin" /> : "Logout"}
    </Button>
  );
}
