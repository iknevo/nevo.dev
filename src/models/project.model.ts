import { InferSchemaType, Model, Schema, model, models } from "mongoose";
import slugify from "slugify";

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

projectSchema.pre("save", async function (next) {
  this.slug = slugify(this.name, {
    replacement: "-",
    lower: true,
    trim: true,
  });
  console.log(this);
  next();
});

type projectType = InferSchemaType<typeof projectSchema>;
export const Project: Model<projectType> =
  models.Project || model<projectType>("Project", projectSchema);
