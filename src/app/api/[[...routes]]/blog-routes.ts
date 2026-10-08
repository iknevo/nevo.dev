import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import status from "http-status";
import mongoose from "mongoose";
import { z } from "zod";

import { blogSchema } from "@/src/definitions/blog-validation";
import { destroyCloudinaryAsset, deriveCloudinaryPublicId, uploadToCloudinary } from "@/src/lib/cloudinary";
import dbConnect from "@/src/lib/db";
import { authMiddleware, withHiddenAuth } from "@/src/lib/jwt";
import { Blog, blogType } from "@/src/models/blog-model";

const app = new Hono()
  .get("/", withHiddenAuth, async (c) => {
    await dbConnect();
    const withHidden = c.req.query("withHidden") === "true";
    const query = withHidden ? {} : { hide: { $ne: true } };
    const data = await Blog.find(query).select("-doc").sort({ createdAt: -1 });
    if (!data)
      return c.json({ message: "Error getting blog posts!, Try again later" }, status.NOT_FOUND);
    return c.json({
      data,
    });
  })
  .get(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),
    zValidator(
      "query",
      z.object({
        withHidden: z.string().optional(),
      })
    ),
    withHiddenAuth,
    async (c) => {
      const { id } = c.req.valid("param");
      if (!id) {
        return c.json({ error: "Missing post id" }, status.BAD_REQUEST);
      }
      await dbConnect();
      const withHidden = c.req.query("withHidden") === "true";
      let data;
      if (mongoose.Types.ObjectId.isValid(id)) {
        data = await Blog.findById(id);
      } else {
        data = await Blog.findOne({ slug: id });
      }
      if (!data || (!withHidden && data.hide)) {
        return c.json({ error: "Post Not Found", id }, status.NOT_FOUND);
      }
      return c.json({ data });
    }
  )
  .post("/", authMiddleware, async (c) => {
    await dbConnect();
    const body = await c.req.formData();
    const title = body.get("title");
    const summary = body.get("summary");
    let image = body.get("image");
    if (image instanceof File && image.size === 0) image = "";
    const doc = body.get("doc");
    const hideRaw = body.get("hide");
    const hide = hideRaw === "true";
    const tags = body.getAll("tags");
    const parsedData = {
      title,
      summary,
      doc,
      tags,
      image,
      hide,
    };
    const result = blogSchema.safeParse(parsedData);
    if (!result.success) {
      const errors = result.error.issues.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      }));
      return c.json({ success: false, message: "Validation failed", errors }, status.BAD_REQUEST);
    }
    const { data } = result;
    let imageUrl: string;
    let imagePublicId: string | undefined;
    if (data.image instanceof File) {
      const uploaded = await uploadToCloudinary(data.image, "blogs/images");
      imageUrl = uploaded.url;
      imagePublicId = uploaded.publicId;
    } else {
      imageUrl = data.image;
      imagePublicId = deriveCloudinaryPublicId(imageUrl) ?? undefined;
    }
    const newPost = {
      title: data.title,
      summary: data.summary,
      tags: data.tags,
      doc: data.doc,
      image: imageUrl,
      imagePublicId,
      hide: data.hide,
    };
    const post = await Blog.create(newPost);
    if (!post) {
      return c.json({ message: "Error creating blog post!, Try again later" }, status.BAD_REQUEST);
    }
    return c.json({
      success: true,
      post,
    });
  })
  .patch(
    "/:id",
    authMiddleware,
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),
    async (c) => {
      const { id } = c.req.valid("param");
      if (!id) {
        return c.json({ error: "Missing id" }, status.BAD_REQUEST);
      }
      await dbConnect();
      const existingPost = await Blog.findById(id);
      if (!existingPost) {
        return c.json({ message: "Blog Post not found" }, status.BAD_REQUEST);
      }
      const body = await c.req.formData();
      const title = body.get("title");
      const summary = body.get("summary");
      let image = body.get("image");
      if (image instanceof File && image.size === 0) image = existingPost.image ?? "";
      const doc = body.get("doc");
      const hideRaw = body.get("hide");
      const hide = hideRaw === "true";
      const tags = body.getAll("tags");
      const parsedData = {
        title,
        summary,
        doc,
        tags,
        image,
        hide,
      };
      const result = blogSchema.safeParse(parsedData);
      if (!result.success) {
        const errors = result.error.issues.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        }));
        return c.json({ success: false, message: "Validation failed", errors }, status.BAD_REQUEST);
      }
      const { data } = result;
      const oldImageUrl = existingPost.image;
      const oldImagePublicId =
        existingPost.imagePublicId ??
        (oldImageUrl ? deriveCloudinaryPublicId(oldImageUrl) : null);

      let imageUrl: string;
      let imagePublicId: string | undefined;
      if (data.image instanceof File) {
        const uploaded = await uploadToCloudinary(data.image, "blogs/images");
        imageUrl = uploaded.url;
        imagePublicId = uploaded.publicId;
      } else {
        imageUrl = data.image;
        imagePublicId =
          imageUrl && imageUrl !== oldImageUrl
            ? (deriveCloudinaryPublicId(imageUrl) ?? undefined)
            : (existingPost.imagePublicId ?? undefined);
      }
      const newPost = {
        title: data.title,
        summary: data.summary,
        tags: data.tags,
        doc: data.doc,
        image: imageUrl,
        imagePublicId,
        hide: data.hide,
      };
      Object.assign(existingPost, newPost);
      await existingPost.save();

      if (oldImagePublicId && imageUrl !== oldImageUrl && oldImagePublicId !== imagePublicId) {
        await destroyCloudinaryAsset(oldImagePublicId);
      }
      return c.json<{ success: true; post: blogType }>({
        success: true,
        post: existingPost,
      });
    }
  )
  .patch(
    "/:id/view",
    zValidator(
      "param",
      z.object({
        id: z.string(),
      })
    ),
    async (c) => {
      const { id } = c.req.valid("param");
      await dbConnect();
      const post = await Blog.findByIdAndUpdate(id, { $inc: { views: 1 } });
      if (!post) {
        return c.json({ error: "Not Found" }, status.NOT_FOUND);
      }
      return c.json({ success: true });
    }
  )
  .delete(
    "/:id",
    authMiddleware,
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),
    async (c) => {
      const { id } = c.req.valid("param");
      if (!id) {
        return c.json({ error: "Missing id" }, status.BAD_REQUEST);
      }
      await dbConnect();
      const post = await Blog.findByIdAndDelete(id);
      if (!post) {
        return c.json({ message: "Error deleting blog post!, Try again later" }, status.NOT_FOUND);
      }
      const publicId =
        post.imagePublicId ?? (post.image ? deriveCloudinaryPublicId(post.image) : null);
      if (publicId) {
        await destroyCloudinaryAsset(publicId);
      }
      return c.status(status.NO_CONTENT);
    }
  );

export default app;
