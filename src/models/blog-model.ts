import { InferSchemaType, Model, Schema, model, models } from "mongoose";
import readingTime from "reading-time";

import { uniqueSlug } from "@/src/lib/slug";

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Blog's name is required"],
      trim: true,
    },
    summary: {
      type: String,
      required: [true, "Blog's summary is required"],
      trim: true,
    },
    tags: {
      type: [String],
    },
    image: {
      type: String,
    },
    imagePublicId: String,
    doc: {
      type: String,
      default: "",
      validate: {
        validator: function (this: { externalUrl?: string }, value: string) {
          return Boolean(this.externalUrl) || Boolean(value?.trim());
        },
        message: "Blog's body is required",
      },
    },
    externalUrl: { type: String, trim: true },
    source: {
      type: String,
      enum: ["x", "devto", "medium", "youtube", "other"],
    },
    readingTime: String,
    slug: String,
    hide: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

blogSchema.index({ slug: 1 });
blogSchema.index({ createdAt: -1 });
blogSchema.index({ hide: 1 });

blogSchema.pre("save", async function (next) {
  if (this.isNew || !this.slug) {
    this.slug = await uniqueSlug(this.constructor as Model<any>, this.title, this._id);
  }
  next();
});

blogSchema.pre("save", async function (next) {
  this.readingTime = this.externalUrl ? undefined : readingTime(this.doc ?? "").text;
  next();
});

export type blogType = InferSchemaType<typeof blogSchema>;
export const Blog: Model<blogType> = models.Blog || model<blogType>("Blog", blogSchema);
