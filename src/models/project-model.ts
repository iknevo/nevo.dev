import { InferSchemaType, Model, Schema, model, models } from "mongoose";
import slugify from "slugify";

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Project's name is required"],
      trim: true,
      unique: true
    },
    year: {
      type: Number,
      required: [true, "A project must have a year"],
      min: 2000,
      max: new Date().getFullYear()
    },
    liveUrl: {
      type: String,
      trim: true
    },
    sourceCode: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true,
      required: [true, "A project must have a description"]
    },
    features: {
      type: [String],
      required: true,
      default: []
    },
    techStack: {
      type: [String],
      required: true,
      default: []
    },
    thumbnail: { type: String, required: true },
    image: {
      type: String,
      required: true
    },
    slug: String,
    createdAt: {
      type: Date,
      default: Date.now()
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
  }
);

projectSchema.pre("save", async function (next) {
  this.slug = slugify(this.name, {
    replacement: "-",
    lower: true,
    trim: true
  });
  next();
});

export type projectType = InferSchemaType<typeof projectSchema>;
export const Project: Model<projectType> =
  models.Project || model<projectType>("Project", projectSchema);
