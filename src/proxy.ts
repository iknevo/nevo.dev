import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { SESSION_COOKIE, verifySessionToken } from "./lib/jwt";
import { getSafeAdminRedirect } from "./lib/safe-redirect";

export async function proxy(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (pathname === "/auth/login") {
    if (!session?.id) return NextResponse.next();
    return NextResponse.redirect(new URL(getSafeAdminRedirect(searchParams.get("from")), req.url));
  }

  if (!session?.id) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("from", getSafeAdminRedirect(pathname));
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/auth/login"],
};
