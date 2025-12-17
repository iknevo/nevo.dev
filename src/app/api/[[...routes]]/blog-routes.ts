import { blogSchema } from "@/src/definitions/blog-validation";
import { uploadToCloudinary } from "@/src/lib/cloudinary";
import dbConnect from "@/src/lib/db";
import { authMiddleware } from "@/src/lib/jwt";
import { Blog, blogType } from "@/src/models/blog-model";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import status from "http-status";
import mongoose from "mongoose";
import { z } from "zod";

const app = new Hono()
  .get("/", async (c) => {
    await dbConnect();
    const data = await Blog.find();
    if (!data)
      return c.json(
        { message: "Error getting blog posts!, Try again later" },
        status.NOT_FOUND
      );
    return c.json({
      data
    });
  })
  .get(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.string().optional()
      })
    ),
    async (c) => {
      const { id } = c.req.valid("param");
      if (!id) {
        return c.json({ error: "Missing post id" }, status.BAD_REQUEST);
      }
      await dbConnect();
      let data;
      if (mongoose.Types.ObjectId.isValid(id)) {
        data = await Blog.findById(id);
      } else {
        data = await Blog.findOne({ slug: id });
      }
      if (!data) {
        return c.json({ error: "Not Found", id }, 404);
      }
      return c.json({ data });
    }
  )
  .post("/", authMiddleware, async (c) => {
    await dbConnect();
    const body = await c.req.formData();
    const title = body.get("title");
    const summary = body.get("summary");
    const image = body.get("image");
    const doc = body.get("doc");
    const tags = body.getAll("tags");
    const parsedData = {
      title,
      summary,
      doc,
      tags,
      image
    };
    const result = blogSchema.safeParse(parsedData);
    if (!result.success) {
      const errors = result.error.issues.map((err) => ({
        path: err.path.join("."),
        message: err.message
      }));
      return c.json(
        { success: false, message: "Validation failed", errors },
        status.BAD_REQUEST
      );
    }
    const { data } = result;
    let imageUrl = data.image;
    if (data.image instanceof File) {
      imageUrl = await uploadToCloudinary(data.image, "blogs/images");
    }
    const newPost = {
      title: data.title,
      summary: data.summary,
      tags: data.tags,
      doc: data.doc,
      image: imageUrl
    };
    const post = await Blog.create(newPost);
    if (!post) {
      return c.json(
        { message: "Error creating blog post!, Try again later" },
        status.BAD_REQUEST
      );
    }
    return c.json({
      success: true,
      post
    });
  })
  .patch(
    "/:id",
    authMiddleware,
    zValidator(
      "param",
      z.object({
        id: z.string().optional()
      })
    ),
    async (c) => {
      const { id } = c.req.valid("param");
      if (!id) {
        return c.json({ error: "Missing id" }, status.BAD_REQUEST);
      }
      await dbConnect();
      const body = await c.req.formData();
      const title = body.get("title");
      const summary = body.get("summary");
      const image = body.get("image");
      const doc = body.get("doc");
      const tags = body.getAll("tags");
      const parsedData = {
        title,
        summary,
        doc,
        tags,
        image
      };
      const result = blogSchema.safeParse(parsedData);
      if (!result.success) {
        const errors = result.error.issues.map((err) => ({
          path: err.path.join("."),
          message: err.message
        }));
        return c.json(
          { success: false, message: "Validation failed", errors },
          status.BAD_REQUEST
        );
      }
      const { data } = result;
      let imageUrl = data.image;
      if (data.image instanceof File) {
        imageUrl = await uploadToCloudinary(data.image, "blogs/images");
      }
      const newPost = {
        title: data.title,
        summary: data.summary,
        tags: data.tags,
        doc: data.doc,
        image: imageUrl
      };
      let post = await Blog.findById(id);
      if (!post) {
        return c.json({ message: "Blog Post not found!" }, status.BAD_REQUEST);
      }
      Object.assign(post, newPost);
      post = await post.save();
      return c.json<{ success: true; post: blogType }>({
        success: true,
        post
      });
    }
  )
  .delete(
    "/:id",
    authMiddleware,
    zValidator(
      "param",
      z.object({
        id: z.string().optional()
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
        return c.json(
          { message: "Error deleting blog post!, Try again later" },
          status.NOT_FOUND
        );
      }
      return c.status(status.NO_CONTENT);
    }
  );

export default app;
