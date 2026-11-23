import type { Model, Types } from "mongoose";
import slugify from "slugify";

export async function uniqueSlug(
  model: Model<any>,
  text: string,
  id: Types.ObjectId | string
): Promise<string> {
  const base = slugify(text, { lower: true, strict: true, trim: true }) || id.toString();
  let slug = base;
  for (let n = 2; await model.exists({ slug, _id: { $ne: id } }); n++) {
    slug = `${base}-${n}`;
  }
  return slug;
}
