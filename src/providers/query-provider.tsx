"use client";

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
  isServer,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { ApiError, isUnauthorizedError } from "@/src/lib/api-error";
import { getSafeAdminRedirect } from "@/src/lib/safe-redirect";

let redirectingToLogin = false;

function handleUnauthorized(error: unknown) {
  if (isServer || redirectingToLogin || !isUnauthorizedError(error)) return;
  const { pathname } = window.location;
  if (!pathname.startsWith("/admin")) return;
  redirectingToLogin = true;
  const from = encodeURIComponent(getSafeAdminRedirect(pathname));
  window.location.replace(`/auth/login?from=${from}`);
}

function makeQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({ onError: handleUnauthorized }),
    mutationCache: new MutationCache({ onError: handleUnauthorized }),
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: (failureCount, error) =>
          !(error instanceof ApiError && error.status < 500) && failureCount < 2,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}
type Props = {
  children: React.ReactNode;
};
export function QueryProvider({ children }: Props) {
  const queryClient = getQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
