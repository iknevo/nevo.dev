import "server-only";

import { headers } from "next/headers";
import { cache } from "react";

import { app } from "@/src/app/api/[[...routes]]/route";

type ServerFetchOptions = {
  withCookies?: boolean;
};

export async function serverFetch(path: string, { withCookies = false }: ServerFetchOptions = {}) {
  const incoming = await headers();
  const forwarded: Record<string, string> = {};
  const forwardedFor = incoming.get("x-forwarded-for");
  if (forwardedFor) forwarded["x-forwarded-for"] = forwardedFor;
  const cookie = withCookies ? incoming.get("cookie") : null;
  if (cookie) forwarded.cookie = cookie;

  const res = await app.request(path, { headers: forwarded });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message || body?.error || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export const getPost = cache(async (id: string, withHidden: boolean) => {
  const { data } = await serverFetch(
    withHidden ? `/api/blog/${id}?withHidden=true` : `/api/blog/${id}`,
    { withCookies: withHidden }
  );
  return data;
});

export const getProject = cache(async (id: string) => {
  const { data } = await serverFetch(`/api/projects/${id}`);
  return data;
});
