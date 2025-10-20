import { CreateProjectSchema } from "@/src/definitions/projects.validations";
import { cloudinary } from "@/src/lib/cloudinary";
import dbConnect from "@/src/lib/db";
import { authMiddleware } from "@/src/lib/jwt";
import { Project } from "@/src/models/project.model";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import status from "http-status";
import { z } from "zod";

const uploadToCloudinary = async (file: File, folder: string) => {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise<string>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error || !result) reject(error);
        else resolve(result.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
};

const app = new Hono()
  .get("/", async (c) => {
    await dbConnect();
    const data = await Project.find().lean();
    if (!data)
      return c.json(
        { message: "Error getting projects!, Try again later" },
        status.NOT_FOUND
      );
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
    async (c) => {
      const { id } = c.req.valid("param");
      if (!id) {
        return c.json({ error: "Missing project id" }, status.BAD_REQUEST);
      }
      await dbConnect();
      const data = await Project.findById(id);
      if (!data) {
        return c.json({ error: "Not Found" }, 404);
      }
      return c.json({ data });
    }
  )
  .post("/", authMiddleware, async (c) => {
    await dbConnect();
    const body = await c.req.formData();
    const name = body.get("name");
    const year = body.get("year");
    const liveUrl = body.get("liveUrl");
    const sourceCode = body.get("sourceCode");
    const description = body.get("description");
    const images = body.getAll("images");
    const thumbnail = body.get("thumbnail");
    const features = body.getAll("features");
    const techStack = body.getAll("techStack");
    const parsedData = {
      name,
      year,
      liveUrl,
      sourceCode,
      description,
      features: features.map((f) => ({ item: f as string })),
      techStack: techStack.map((t) => ({ item: t as string })),
      thumbnail,
      images: images.map((f) => ({ item: f as File })),
    };

    const result = CreateProjectSchema.safeParse(parsedData);

    if (!result.success) {
      const errors = result.error.issues.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      }));
      return c.json(
        { success: false, message: "Validation failed", errors },
        status.BAD_REQUEST
      );
    }
    const data = result.data;
    const thumbnailUrl = await uploadToCloudinary(
      data.thumbnail,
      "projects/thumbnails"
    );
    const imageUrls = await Promise.all(
      data.images.map((file) => {
        if (file.item instanceof File)
          return uploadToCloudinary(file.item, "projects/images");
      })
    );
    const newProject = {
      name: data.name,
      year: Number(data.year),
      liveUrl: data.liveUrl,
      sourceCode: data.sourceCode,
      description: data.description,
      features: data.features.map((f) => f.item),
      techStack: data.techStack.map((t) => t.item),
      thumbnail: thumbnailUrl,
      images: imageUrls,
    };
    const project = await Project.create(newProject);
    if (!project) {
      return c.json(
        { message: "Error creating project!, Try again later" },
        status.BAD_REQUEST
      );
    }
    return c.json({
      success: true,
      project,
    });
  });

export default app;
