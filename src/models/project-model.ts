import { InferSchemaType, Model, Schema, model, models } from "mongoose";

import { uniqueSlug } from "@/src/lib/slug";

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Project's name is required"],
      trim: true,
      unique: true,
    },
    year: {
      type: Number,
      required: [true, "A project must have a year"],
      min: 2000,
      validate: {
        validator: (year: number) => Number.isInteger(year) && year <= new Date().getFullYear(),
        message: "Year can't be in the future",
      },
    },
    liveUrl: {
      type: String,
      trim: true,
    },
    sourceCode: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      required: [true, "A project must have a description"],
    },
    features: {
      type: [String],
      required: true,
      default: [],
    },
    techStack: {
      type: [String],
      required: true,
      default: [],
    },
    thumbnail: { type: String, required: true },
    thumbnailPublicId: String,
    sortIndex: { type: Number, required: true, default: 999 },
    slug: String,
    hide: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

projectSchema.index({ slug: 1 });
projectSchema.index({ sortIndex: 1 });
projectSchema.index({ hide: 1 });

projectSchema.pre("save", async function (next) {
  if (this.isNew || !this.slug) {
    this.slug = await uniqueSlug(this.constructor as Model<any>, this.name, this._id);
  }
  next();
});

export type projectType = InferSchemaType<typeof projectSchema>;
export const Project: Model<projectType> =
  models.Project || model<projectType>("Project", projectSchema);
