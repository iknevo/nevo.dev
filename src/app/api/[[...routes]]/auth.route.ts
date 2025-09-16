import { env } from "@/src/config/env";
import { LoginFormSchema } from "@/src/definitions/login.definition";
import dbConnect from "@/src/lib/db";
import {
  generateAccessToken,
  sendTokens,
  verifyRefreshToken,
} from "@/src/lib/jwt";
import { zValidator } from "@/src/lib/zod-wrapper";
import { User } from "@/src/models/user.model";
import { Hono } from "hono";
import { deleteCookie, getCookie } from "hono/cookie";
import status from "http-status";

const app = new Hono()
  .post("/login", zValidator("json", LoginFormSchema), async (c) => {
    const { email, password } = c.req.valid("json");
    await dbConnect();
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.checkPassword(password, user.password))) {
      return c.json(
        {
          success: false,
          message: "Invalid Email or Password",
        },
        status.FORBIDDEN
      );
    }
    const accessToken = await sendTokens(c, user._id);
    return c.json({
      user: {
        name: user.name,
        email: user.email,
      },
      accessToken,
    });
  })
  .post("/refresh", async (c) => {
    const token = getCookie(c, "refreshToken");
    if (!token) {
      return c.json(
        { success: false, message: "Unauthorized" },
        status.UNAUTHORIZED
      );
    }
    const decoded = await verifyRefreshToken(token);
    if (!decoded) {
      return c.json(
        { success: false, message: "Unauthorized" },
        status.UNAUTHORIZED
      );
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      return c.json(
        { success: false, message: "User not found" },
        status.UNAUTHORIZED
      );
    }
    const accessToken = await generateAccessToken(decoded.id);
    return c.json({
      accessToken,
      user: { name: user.name, email: user.email },
    });
  })
  .post("/logout", async (c) => {
    deleteCookie(c, "refreshToken", {
      path: "/",
      httpOnly: true,
      secure: env.production,
      sameSite: "strict",
    });
    return c.json({ message: "Successfully logged out" }, status.OK);
  });

export default app;
