"use client";
import Button from "@/src/components/button";
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
        router.push("/login");
      },
    });
  };
  return (
    <Button
      as="button"
      disabled={isPending}
      className="rounded-md cursor"
      onClick={handleLogout}
    >
      {isPending ? <Loader2 className="animate-spin" /> : "Logout"}
    </Button>
  );
}
