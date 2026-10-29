import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { api } from "@/src/lib/hono";
import { getSafeAdminRedirect } from "@/src/lib/safe-redirect";

class MeRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "MeRequestError";
  }
}

export function useMe() {
  const router = useRouter();
  const pathname = usePathname();
  const query = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await api.auth.me.$get();
      if (!res.ok) {
        throw new MeRequestError("Failed to fetch account", res.status);
      }
      const data = await res.json();
      return data;
    },
    retry: (failureCount, error) =>
      !(error instanceof MeRequestError && error.status === 401) && failureCount < 2,
  });

  useEffect(() => {
    if (!(query.error instanceof MeRequestError) || query.error.status !== 401) return;

    const redirectTo = getSafeAdminRedirect(pathname);
    router.replace(`/auth/login?from=${encodeURIComponent(redirectTo)}`);
  }, [pathname, query.error, router]);

  return query;
}
