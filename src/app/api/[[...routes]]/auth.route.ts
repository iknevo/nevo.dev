import dbConnect from "@/src/lib/db";
import { sendTokens } from "@/src/lib/jwt";
import { zValidator } from "@/src/lib/zod-wrapper";
import { User } from "@/src/models/user.model";
import { loginSchema } from "@/src/validation/login.schema";
import { Hono } from "hono";
import status from "http-status";

const app = new Hono();

app.post("/login", zValidator("json", loginSchema), async (c) => {
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
    user,
    accessToken,
  });
});
app.post("/signup");

export default app;
