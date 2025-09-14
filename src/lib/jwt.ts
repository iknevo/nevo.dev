import config from "@/src/lib/config";
import { Context } from "hono";
import { setCookie } from "hono/cookie";
import { sign } from "hono/jwt";

// Generate an access token using hono/jwt
export async function generateAccessToken(id: any): Promise<string> {
  const payload = {
    id,
    exp: Math.floor(Date.now() / 1000) + 60 * config.jwt.accessExpiresIn,
  };
  return await sign(payload, config.jwt.secret, "HS256");
}

// Generate a refresh token using hono/jwt
export async function generateRefreshToken(id: any): Promise<string> {
  const payload = {
    id,
    exp:
      Math.floor(Date.now() / 1000) +
      60 * config.jwt.refreshExpiresIn * 24 * 60,
  };
  return await sign(payload, config.jwt.refreshSecret, "HS256");
}

// Send tokens in response, setting refresh token as a cookie
export async function sendTokens(c: Context, id: any): Promise<string> {
  const accessToken = await generateAccessToken(id);
  const refreshToken = await generateRefreshToken(id);

  setCookie(c, "refreshToken", refreshToken, {
    httpOnly: true,
    secure: config.production,
    sameSite: "strict",
    maxAge: config.cookiesMaxAge,
  });

  return accessToken;
}
