import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const experienceSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Experience's name is required"],
      trim: true,
    },
    company: {
      type: String,
      required: [true, "Experience's company is required"],
      trim: true,
    },
    startDate: {
      type: String,
      required: [true, "Experience's start date is required"],
      trim: true,
    },
    endDate: {
      type: String,
      trim: true,
      default: "Present",
    },
    hide: {
      type: Boolean,
      default: false,
    },
    sortIndex: { type: Number, required: true },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

export type expType = InferSchemaType<typeof experienceSchema>;
export const Experience: Model<expType> =
  models.Experience || model<expType>("Experience", experienceSchema);
