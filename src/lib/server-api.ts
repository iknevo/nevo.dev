import "server-only";

import { app } from "@/src/app/api/[[...routes]]/route";

export async function serverFetch(path: string) {
  const res = await app.request(path);
  if (!res.ok) throw new Error(`Failed to fetch ${path}`);
  return res.json();
}
