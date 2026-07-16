import { Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { sign, verify } from "hono/jwt";
import { JWTPayload } from "hono/utils/jwt/types";
import status from "http-status";

import { env } from "@/src/config/env";
import dbConnect from "@/src/lib/db";
import { User } from "@/src/models/user-model";

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

async function generateAccessToken(id: string): Promise<string> {
  const payload: AccessPayload = {
    id,
    exp: Math.floor(Date.now() / 1000) + 60 * env.jwt.accessExpiresIn,
  };
  return await sign(payload, env.jwt.secret, "HS256");
}

export async function generateRefreshToken(id: string): Promise<string> {
  const payload: AccessPayload = {
    id,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * env.jwt.refreshExpiresIn,
  };
  return await sign(payload, env.jwt.refreshSecret, "HS256");
}

export async function sendTokens(c: Context, id: string): Promise<void> {
  const accessToken = await generateAccessToken(id);
  const refreshToken = await generateRefreshToken(id);
  sendAccessCookie(c, accessToken);
  sendRefreshCookie(c, refreshToken);
}

export async function verifyAccessToken(token: string): Promise<AccessPayload | null> {
  try {
    return (await verify(token, env.jwt.secret, "HS256")) as AccessPayload;
  } catch (err) {
    console.error("Access token verification failed:", err instanceof Error ? err.message : err);
    return null;
  }
}

export async function verifyRefreshToken(token: string): Promise<AccessPayload | null> {
  try {
    return (await verify(token, env.jwt.refreshSecret, "HS256")) as AccessPayload;
  } catch (err) {
    console.error("Refresh token verification failed:", err instanceof Error ? err.message : err);
    return null;
  }
}

export const withHiddenAuth = createMiddleware(async (c, next) => {
  const withHidden = c.req.query("withHidden") === "true";
  if (!withHidden) {
    return next();
  }

  const accessToken = getCookie(c, "accessToken");
  const refreshToken = getCookie(c, "refreshToken");

  if (accessToken) {
    const payload = await verifyAccessToken(accessToken);
    if (payload) {
      await dbConnect();
      const user = await User.findById(payload.id);
      if (user && !user.changedPasswordAfter(payload.iat!)) {
        c.set("user", { id: payload.id });
        return next();
      }
    }
  }

  if (!refreshToken) {
    return c.json({ success: false, message: "Unauthorized" }, status.UNAUTHORIZED);
  }

  const payload = await verifyRefreshToken(refreshToken);
  if (!payload) {
    return c.json({ success: false, message: "Unauthorized" }, status.UNAUTHORIZED);
  }

  await dbConnect();
  const user = await User.findById(payload.id);
  if (!user || user.changedPasswordAfter(payload.iat!)) {
    return c.json({ success: false, message: "Unauthorized" }, status.UNAUTHORIZED);
  }

  c.set("user", { id: payload.id });
  await next();
});

export const authMiddleware = createMiddleware(async (c, next) => {
  const accessToken = getCookie(c, "accessToken");
  const refreshToken = getCookie(c, "refreshToken");

  // Try access token first
  if (accessToken) {
    const payload = await verifyAccessToken(accessToken);
    if (payload) {
      await dbConnect();
      const user = await User.findById(payload.id);
      if (user && !user.changedPasswordAfter(payload.iat!)) {
        c.set("user", {
          id: payload.id,
          exp: payload.exp,
        });
        return next();
      }
    }
  }

  // Fall back to refresh token
  if (!refreshToken) {
    return c.json({ success: false, message: "Unauthorized" }, status.UNAUTHORIZED);
  }

  const payload = await verifyRefreshToken(refreshToken);
  if (!payload) {
    return c.json({ success: false, message: "Unauthorized" }, status.UNAUTHORIZED);
  }

  await dbConnect();
  const user = await User.findById(payload.id);
  if (!user) {
    return c.json({ success: false, message: "Unauthorized" }, status.UNAUTHORIZED);
  }

  if (user.changedPasswordAfter(payload.iat!)) {
    return c.json({ success: false, message: "Unauthorized" }, status.UNAUTHORIZED);
  }

  const newAccessToken = await generateAccessToken(payload.id);
  sendAccessCookie(c, newAccessToken);

  c.set("user", {
    id: payload.id,
    exp: Math.floor(Date.now() / 1000) + 60 * env.jwt.accessExpiresIn,
  });

  await next();
});
