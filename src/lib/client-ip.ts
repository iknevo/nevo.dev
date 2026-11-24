import type { Context } from "hono";

export function getClientIp(c: Context) {
  return (
    c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ?? c.req.header("x-real-ip") ?? "unknown"
  );
}
