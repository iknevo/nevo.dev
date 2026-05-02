import { InferSchemaType, Model, Schema, Types, model, models } from "mongoose";

const stackSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Stack's name is required"],
      trim: true,
      unique: true,
    },
    icon: {
      type: String,
      required: [true, "Stack's icon is required"],
    },
    type: {
      type: String,
      enum: ["frontend", "backend", "mobile", "testing", "tools", "studying"],
      required: true,
      default: "front",
    },
    hide: {
      type: Boolean,
      default: false,
    },
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

export type stackType = InferSchemaType<typeof stackSchema>;
export type stackItem = stackType & {
  _id: Types.ObjectId;
};
export const Stack: Model<stackType> = models.Stack || model<stackType>("Stack", stackSchema);
