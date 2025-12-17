import { InferSchemaType, Model, Schema, model, models } from "mongoose";
import readingTime from "reading-time";
import slugify from "slugify";

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Blog's name is required"],
      trim: true
    },
    summary: {
      type: String,
      required: [true, "Blog's summary is required"],
      trim: true
    },
    tags: {
      type: [String]
    },
    image: {
      type: String
    },
    doc: {
      type: String,
      required: [true, "Blog's body is required"]
    },
    readingTime: String,
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

blogSchema.pre("save", async function (next) {
  this.slug = slugify(this.title, {
    replacement: "-",
    lower: true,
    trim: true
  });
  next();
});

blogSchema.pre("save", async function (next) {
  const stats = readingTime(this.doc);
  this.readingTime = stats.text;
  next();
});

export type blogType = InferSchemaType<typeof blogSchema>;
export const Blog: Model<blogType> =
  models.Blog || model<blogType>("Blog", blogSchema);
