import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const resumeSchema = new Schema(
  {
    url: {
      type: String,
      required: [true, "Resume URL is required"],
    },
  },
  { timestamps: true }
);

export type resumeType = InferSchemaType<typeof resumeSchema>;
export const Resume: Model<resumeType> = models.Resume || model<resumeType>("Resume", resumeSchema);
