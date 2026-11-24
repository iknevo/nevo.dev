import { Hono } from "hono";

import { ProfileSchema, ProfileValues } from "@/src/definitions/profile-validations";
import dbConnect from "@/src/lib/db";
import { authMiddleware } from "@/src/lib/jwt";
import { zValidator } from "@/src/lib/zod-wrapper";
import { Profile } from "@/src/models/profile-model";

const EMPTY_PROFILE: ProfileValues = {
  openToWork: false,
  note: "",
  location: "",
  timezone: "",
};

function toValues(doc: ProfileValues | null): ProfileValues {
  if (!doc) return EMPTY_PROFILE;
  return {
    openToWork: doc.openToWork,
    note: doc.note,
    location: doc.location,
    timezone: doc.timezone,
  };
}

const app = new Hono()
  .get("/", async (c) => {
    await dbConnect();
    const profile = await Profile.findOne().lean();
    return c.json({ data: toValues(profile) });
  })
  .patch("/", authMiddleware, zValidator("json", ProfileSchema), async (c) => {
    const values = c.req.valid("json");
    await dbConnect();
    const profile = await Profile.findOneAndUpdate({}, values, {
      upsert: true,
      new: true,
      runValidators: true,
    }).lean();
    return c.json({ success: true, message: "Profile updated", data: toValues(profile) });
  });

export default app;
