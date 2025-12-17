import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { verifyRefreshToken } from "./lib/jwt";

export async function proxy(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  const refreshToken = req.cookies.get("refreshToken")?.value;
  if (pathname.startsWith("/auth") && refreshToken) {
    const decoded = (await verifyRefreshToken(refreshToken)) as {
      id: string;
    };
    if (decoded?.id) {
      const redirectTo = searchParams.get("from") || "/admin";
      return NextResponse.redirect(new URL(redirectTo, req.url));
    }
  }
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }
  if (!refreshToken) {
    return redirectToLogin(req);
  }
  try {
    const decoded = (await verifyRefreshToken(refreshToken)) as { id?: string };
    if (!decoded?.id) {
      return redirectToLogin(req);
    }
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", decoded.id);
    return NextResponse.next({
      request: { headers: requestHeaders }
    });
  } catch (err) {
    console.error("Invalid or expired refresh token:", err);
    return redirectToLogin(req);
  }
}

function redirectToLogin(req: NextRequest) {
  const loginUrl = new URL("/auth/login", req.url);
  loginUrl.searchParams.set("from", req.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/auth/reset-password/:path*", "/auth/login"]
};
