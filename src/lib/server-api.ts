import "server-only";

import { app } from "@/src/app/api/[[...routes]]/route";

export async function serverFetch(path: string) {
  const res = await app.request(path);
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message || body?.error || `Request failed with status ${res.status}`);
  }
  return res.json();
}
