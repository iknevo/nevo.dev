import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { verifyRefreshToken } from "./lib/jwt";
import { getSafeAdminRedirect } from "./lib/safe-redirect";

export async function proxy(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const session = refreshToken ? await verifyRefreshToken(refreshToken) : null;

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
