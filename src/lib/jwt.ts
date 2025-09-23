import { env } from "@/src/config/env";
import { Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { sign, verify } from "hono/jwt";
import { JWTPayload } from "hono/utils/jwt/types";

export interface AccessPayload extends JWTPayload {
  id: string;
  exp: number;
  [key: string]: any;
}

function sendAccessCookie(c: Context, token: string) {
  setCookie(c, "accessToken", token, {
    path: "/",
    httpOnly: true,
    secure: env.production,
    sameSite: "Strict",
  });
}

function sendRefreshCookie(c: Context, token: string) {
  setCookie(c, "refreshToken", token, {
    path: "/",
    httpOnly: true,
    secure: env.production,
    sameSite: "Strict",
    maxAge: env.refreshCookiesMaxAge,
  });
}

export async function generateAccessToken(id: string): Promise<string> {
  const payload: AccessPayload = {
    id,
    exp: Math.floor(Date.now() / 1000) + 60 * env.jwt.accessExpiresIn,
  };
  return await sign(payload, env.jwt.secret, "HS256");
}

export async function generateRefreshToken(id: string): Promise<string> {
  const payload: AccessPayload = {
    id,
    exp:
      Math.floor(Date.now() / 1000) + 60 * 60 * 24 * env.jwt.refreshExpiresIn,
  };
  return await sign(payload, env.jwt.refreshSecret, "HS256");
}

export async function sendTokens(c: Context, id: string): Promise<void> {
  const accessToken = await generateAccessToken(id);
  const refreshToken = await generateRefreshToken(id);
  sendAccessCookie(c, accessToken);
  sendRefreshCookie(c, refreshToken);
}

export async function verifyAccessToken(
  token: string
): Promise<AccessPayload | null> {
  try {
    return (await verify(token, env.jwt.secret, "HS256")) as AccessPayload;
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(
  token: string
): Promise<AccessPayload | null> {
  try {
    return (await verify(
      token,
      env.jwt.refreshSecret,
      "HS256"
    )) as AccessPayload;
  } catch {
    return null;
  }
}

export const authMiddleware = createMiddleware(async (c, next) => {
  const refreshToken = getCookie(c, "refreshToken");

  if (!refreshToken) {
    return c.json({ success: false, message: "Unauthorized" }, 401);
  }

  const payload = await verifyRefreshToken(refreshToken);
  if (!payload) {
    return c.json({ success: false, message: "Unauthorized" }, 401);
  }

  const accessToken = await generateAccessToken(payload.id);
  sendAccessCookie(c, accessToken);

  c.set("user", {
    id: payload.id,
    exp: Math.floor(Date.now() / 1000) + 60 * env.jwt.accessExpiresIn,
  });
  c.header("Authorization", `Bearer ${accessToken}`);

  await next();
});
