import { projectSchema } from "@/src/definitions/projects-validations";
import { uploadToCloudinary } from "@/src/lib/cloudinary";
import dbConnect from "@/src/lib/db";
import { authMiddleware } from "@/src/lib/jwt";
import { Project, projectType } from "@/src/models/project-model";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import status from "http-status";
import { z } from "zod";

const app = new Hono()
  .get("/", async (c) => {
    await dbConnect();
    const data = await Project.find();
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
    const thumbnail = body.get("thumbnail");
    const image = body.get("image");
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
      image,
    };
    const result = projectSchema.safeParse(parsedData);
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
    const { data } = result;
    let thumbnailUrl = data.thumbnail;
    if (data.thumbnail instanceof File) {
      thumbnailUrl = await uploadToCloudinary(
        data.thumbnail,
        "projects/thumbnails"
      );
    }
    let imageUrl = data.image;
    if (data.image instanceof File) {
      imageUrl = await uploadToCloudinary(data.image, "projects/thumbnails");
    }
    const newProject = {
      name: data.name,
      year: Number(data.year),
      liveUrl: data.liveUrl,
      sourceCode: data.sourceCode,
      description: data.description,
      features: data.features.map((f) => f.item),
      techStack: data.techStack.map((t) => t.item),
      thumbnail: thumbnailUrl,
      image: imageUrl,
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
      const body = await c.req.formData();
      const name = body.get("name");
      const year = body.get("year");
      const liveUrl = body.get("liveUrl");
      const sourceCode = body.get("sourceCode");
      const description = body.get("description");
      const thumbnail = body.get("thumbnail");
      const image = body.get("image");
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
        image,
      };
      const result = projectSchema.safeParse(parsedData);
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
      const { data } = result;
      let thumbnailUrl = data.thumbnail;
      if (data.thumbnail instanceof File) {
        thumbnailUrl = await uploadToCloudinary(
          data.thumbnail,
          "projects/thumbnails"
        );
      }
      let imageUrl = data.image;
      if (data.image instanceof File) {
        imageUrl = await uploadToCloudinary(data.image, "projects/thumbnails");
      }
      const newProject = {
        name: data.name,
        year: Number(data.year),
        liveUrl: data.liveUrl,
        sourceCode: data.sourceCode,
        description: data.description,
        features: data.features.map((f) => f.item),
        techStack: data.techStack.map((t) => t.item),
        thumbnail: thumbnailUrl,
        image: imageUrl,
      };
      let project = await Project.findById(id);
      if (!project) {
        return c.json({ message: "Project not found!" }, status.BAD_REQUEST);
      }
      Object.assign(project, newProject);
      project = await project.save();
      return c.json<{ success: true; project: projectType }>({
        success: true,
        project,
      });
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
      const project = await Project.findByIdAndDelete(id);
      if (!project) {
        return c.json(
          { message: "Error deleting project!, Try again later" },
          status.NOT_FOUND
        );
      }
      return c.status(status.NO_CONTENT);
    }
  );

export default app;
