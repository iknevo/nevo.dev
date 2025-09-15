import { env } from "@/src/config/env";
import { Context } from "hono";
import { setCookie } from "hono/cookie";
import { sign, verify } from "hono/jwt";

// Generate an access token using hono/jwt
export async function generateAccessToken(id: any): Promise<string> {
  const payload = {
    id,
    exp: Math.floor(Date.now() / 1000) + 60 * env.jwt.accessExpiresIn,
  };
  return await sign(payload, env.jwt.secret, "HS256");
}

// Generate a refresh token using hono/jwt
export async function generateRefreshToken(id: any): Promise<string> {
  const payload = {
    id,
    exp:
      Math.floor(Date.now() / 1000) + 60 * env.jwt.refreshExpiresIn * 24 * 60,
  };
  return await sign(payload, env.jwt.refreshSecret, "HS256");
}

// Send tokens in response, setting refresh token as a cookie
export async function sendTokens(c: Context, id: any): Promise<string> {
  const accessToken = await generateAccessToken(id);
  const refreshToken = await generateRefreshToken(id);

  setCookie(c, "refreshToken", refreshToken, {
    httpOnly: true,
    secure: env.production,
    sameSite: "strict",
    maxAge: env.cookiesMaxAge,
  });

  return accessToken;
}

export async function verifyAccessToken(token: string) {
  try {
    const decoded = await verify(token, env.jwt.secret, "HS256");
    return decoded;
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(token: string) {
  try {
    const decoded = await verify(token, env.jwt.refreshSecret, "HS256");
    return decoded; // contains { id, exp }
  } catch {
    return null;
  }
}
