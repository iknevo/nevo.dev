import { env } from "@/src/config/env";
import {
  LoginFormSchema,
  PasswordResetSchema,
  PasswordUpdateSchema
} from "@/src/definitions/auth-validations";
import dbConnect from "@/src/lib/db";
import { sendEmail } from "@/src/lib/email";
import type { AccessPayload } from "@/src/lib/jwt";
import { authMiddleware, sendTokens } from "@/src/lib/jwt";
import { zValidator } from "@/src/lib/zod-wrapper";
import { User } from "@/src/models/user-model";
import { createHash } from "crypto";
import { Hono } from "hono";
import { deleteCookie } from "hono/cookie";
import status from "http-status";
import { z } from "zod";

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
        { message: "Invalid Email or Password!" },
        status.FORBIDDEN
      );
    }
    await sendTokens(c, user._id.toString());
    return c.json({ message: "Welcome NEVO." }, status.OK);
  })
  .post("/logout", authMiddleware, async (c) => {
    deleteCookie(c, "accessToken", {
      path: "/",
      httpOnly: true,
      secure: env.production,
      sameSite: "Strict"
    });
    deleteCookie(c, "refreshToken", {
      path: "/",
      httpOnly: true,
      secure: env.production,
      sameSite: "Strict"
    });
    return c.json({ message: "Successfully logged out" }, status.OK);
  })
  .post(
    "/forgot-password",
    zValidator(
      "json",
      z.object({
        email: z.email()
      })
    ),
    async (c) => {
      const { email } = c.req.valid("json");
      await dbConnect();
      const user = await User.findOne({ email });
      if (!user) {
        return c.json(
          { success: false, message: "User not found" },
          status.UNAUTHORIZED
        );
      }
      const resetPasswordToken = user.createPasswordResetToken();
      await user.save({ validateBeforeSave: false });
      const host = c.req.header("host");
      const protocol = c.req.url.startsWith("https") ? "https" : "http";
      const resetUrl = `${protocol}://${host}/auth/reset-password/${resetPasswordToken}`;
      const message = `Forgot your password? submit a request with you new password to ${resetUrl}.\nIf you didn't forget your password please ignore this email`;
      try {
        await sendEmail({
          email: user.email,
          subject: "Your password reset token (valid for 10 minutes)",
          message
        });
        return c.json(
          {
            success: true,
            message: `email sent, please check your email.`,
            token: resetPasswordToken
          },
          status.OK
        );
      } catch (err) {
        console.error(err);
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return c.json(
          {
            success: false,
            message: "There was an error sending email, Please try again later."
          },
          status.INTERNAL_SERVER_ERROR
        );
      }
    }
  )
  .patch(
    "/reset-password/:token",
    zValidator(
      "param",
      z.object({
        token: z.string()
      })
    ),
    zValidator("json", PasswordResetSchema),
    async (c) => {
      const { token } = c.req.valid("param");
      const { password, passwordConfirm } = c.req.valid("json");
      const hashedToken = createHash("sha256").update(token).digest("hex");
      await dbConnect();
      const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
      }).select("+password");
      if (!user) {
        return c.json(
          { success: false, message: "User not found" },
          status.UNAUTHORIZED
        );
      }
      user.password = password;
      user.passwordConfirm = passwordConfirm;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
      await sendTokens(c, user._id.toString());
      return c.json(
        {
          success: true,
          message: "Password Reset Successfully"
        },
        status.OK
      );
    }
  )
  .patch(
    "/update-password",
    zValidator("json", PasswordUpdateSchema),
    authMiddleware,
    async (c) => {
      const userPayload = c.get("user");
      const { password, passwordConfirm, passwordCurrent } =
        c.req.valid("json");
      await dbConnect();
      const user = await User.findById(userPayload.id).select("+password");
      if (
        !user ||
        !(await user.checkPassword(passwordCurrent, user.password))
      ) {
        return c.json(
          { success: false, message: "Your current password is wrong!" },
          status.UNAUTHORIZED
        );
      }
      user.password = password;
      user.passwordConfirm = passwordConfirm;
      await user.save();
      await sendTokens(c, user._id.toString());
      return c.json(
        {
          success: true,
          message: "Password Updated Successfully"
        },
        status.OK
      );
    }
  );
export default app;
