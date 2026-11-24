import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const profileSchema = new Schema(
  {
    openToWork: { type: Boolean, default: false },
    note: { type: String, trim: true, default: "" },
    location: { type: String, trim: true, default: "" },
    timezone: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

export type profileType = InferSchemaType<typeof profileSchema>;
export const Profile: Model<profileType> =
  models.Profile || model<profileType>("Profile", profileSchema);
