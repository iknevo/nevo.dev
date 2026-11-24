import { env } from "@/src/config/env";

export function GET() {
  const base = env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  const body = [
    "User-agent: *",
    "Content-Signal: search=yes, ai-train=no",
    "Allow: /",
    "Disallow: /admin",
    "Disallow: /auth",
    "Disallow: /api",
    "",
    `Sitemap: ${base}/sitemap.xml`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
