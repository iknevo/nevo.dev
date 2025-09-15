import { LoginFormSchema } from "@/src/definitions/login.definition";
import dbConnect from "@/src/lib/db";
import { sendTokens } from "@/src/lib/jwt";
import { zValidator } from "@/src/lib/zod-wrapper";
import { User } from "@/src/models/user.model";
import { Hono } from "hono";
import status from "http-status";

const app = new Hono().post(
  "/login",
  zValidator("json", LoginFormSchema),
  async (c) => {
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
  }
);

export default app;
