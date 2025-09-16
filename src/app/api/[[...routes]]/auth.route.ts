import { env } from "@/src/config/env";
import { LoginFormSchema } from "@/src/definitions/login.definition";
import dbConnect from "@/src/lib/db";
import type { AccessPayload } from "@/src/lib/jwt";
import { authMiddleware, sendTokens } from "@/src/lib/jwt";
import { zValidator } from "@/src/lib/zod-wrapper";
import { User } from "@/src/models/user.model";
import { Hono } from "hono";
import { deleteCookie } from "hono/cookie";
import status from "http-status";

type Env = {
  Variables: {
    user: AccessPayload;
  };
};

const app = new Hono<Env>()
  .get("/me", authMiddleware, async (c) => {
    const userPayload = c.get("user");
    await dbConnect();
    const user = await User.findById(userPayload.id);
    if (!user) {
      return c.json(
        { success: false, message: "User not found" },
        status.UNAUTHORIZED
      );
    }
    return c.json({ user: { name: user.name, email: user.email } }, status.OK);
  })
  .post("/login", zValidator("json", LoginFormSchema), async (c) => {
    const { email, password } = c.req.valid("json");
    await dbConnect();
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.checkPassword(password, user.password))) {
      return c.json(
        { success: false, message: "Invalid Email or Password" },
        status.FORBIDDEN
      );
    }
    await sendTokens(c, user._id.toString());
    return c.json({ message: "Welcome NEVO." }, status.OK);
  })
  .post("/logout", async (c) => {
    deleteCookie(c, "accessToken", {
      path: "/",
      httpOnly: true,
      secure: env.production,
      sameSite: "Strict",
    });
    deleteCookie(c, "refreshToken", {
      path: "/",
      httpOnly: true,
      secure: env.production,
      sameSite: "Strict",
    });
    return c.json({ message: "Successfully logged out" }, status.OK);
  });

export default app;
