import type { AppTypes } from "@/src/app/api/[[...routes]]/route";
import { useAuthState } from "@/src/features/auth/state/auth-state";
import { hc } from "hono/client";

// const client = hc<AppTypes>(process.env.NEXT_PUBLIC_APP_URL!);
const client = hc<AppTypes>(process.env.NEXT_PUBLIC_APP_URL!, {
  fetch: async (input: RequestInfo | URL, requestInit?: RequestInit) => {
    const { accessToken, setToken } = useAuthState.getState();
    const headers = new Headers(requestInit?.headers);
    headers.set("Content-Type", "application/json");
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    const response = await fetch(input, {
      ...requestInit,
      headers,
      credentials: "include",
    });
    if (response.status === 401) {
      const refreshResponse = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/refresh`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (refreshResponse.ok) {
        const { accessToken: newToken } = await refreshResponse.json();
        setToken(newToken);
        headers.set("Authorization", `Bearer ${newToken}`);
        return fetch(input, { ...requestInit, headers });
      } else {
        useAuthState.getState().clearAuth();
        throw new Error("Unauthorized - please log in");
      }
    }
    return response;
  },
});

export const api = client.api;
