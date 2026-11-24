import { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { sign, verify } from "hono/jwt";
import { JWTPayload } from "hono/utils/jwt/types";
import status from "http-status";

import { env } from "@/src/config/env";
import dbConnect from "@/src/lib/db";
import { User } from "@/src/models/user-model";

export const SESSION_COOKIE = "session";

export interface SessionPayload extends JWTPayload {
  id: string;
  v: number;
  iat: number;
  exp: number;
}

const sessionCookieOptions = {
  path: "/",
  httpOnly: true,
  secure: env.production,
  sameSite: "Strict",
} as const;

export async function sendSession(c: Context, id: string, tokenVersion: number): Promise<void> {
  const now = Math.floor(Date.now() / 1000);
  const maxAge = 60 * 60 * 24 * env.jwt.expiresInDays;
  const payload: SessionPayload = { id, v: tokenVersion, iat: now, exp: now + maxAge };
  const token = await sign(payload, env.jwt.secret, "HS256");
  setCookie(c, SESSION_COOKIE, token, { ...sessionCookieOptions, maxAge });
}

export function clearSession(c: Context) {
  deleteCookie(c, SESSION_COOKIE, sessionCookieOptions);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    return (await verify(token, env.jwt.secret, "HS256")) as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSessionUser(c: Context) {
  const token = getCookie(c, SESSION_COOKIE);
  if (!token) return null;
  const payload = await verifySessionToken(token);
  if (!payload) return null;
  await dbConnect();
  const user = await User.findById(payload.id);
  if (!user) return null;
  if ((user.tokenVersion ?? 0) !== payload.v) return null;
  if (user.changedPasswordAfter(payload.iat)) return null;
  return user;
}

function unauthorized(c: Context) {
  clearSession(c);
  return c.json({ success: false, message: "Unauthorized" }, status.UNAUTHORIZED);
}

export const authMiddleware = createMiddleware(async (c, next) => {
  const user = await getSessionUser(c);
  if (!user) return unauthorized(c);
  c.set("user", { id: user._id.toString() });
  await next();
});

export const withHiddenAuth = createMiddleware(async (c, next) => {
  if (c.req.query("withHidden") !== "true") return next();
  const user = await getSessionUser(c);
  if (!user) return unauthorized(c);
  c.set("user", { id: user._id.toString() });
  await next();
});
