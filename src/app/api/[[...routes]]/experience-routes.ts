import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import status from "http-status";
import { z } from "zod";

import { experienceSchema } from "@/src/definitions/experience-validations";
import dbConnect from "@/src/lib/db";
import { authMiddleware } from "@/src/lib/jwt";
import { Experience } from "@/src/models/experience-model";

const app = new Hono()
  .get("/", async (c) => {
    await dbConnect();
    const data = await Experience.find().sort({ createdAt: -1 });
    if (!data)
      return c.json(
        { message: "Error getting experiences!, Try again later" },
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
    authMiddleware,
    async (c) => {
      const { id } = c.req.valid("param");
      if (!id) {
        return c.json({ error: "Missing experience id" }, status.BAD_REQUEST);
      }
      await dbConnect();
      const data = await Experience.findById(id);
      if (!data) {
        return c.json({ error: "Not Found" }, status.NOT_FOUND);
      }
      return c.json({ data });
    }
  )
  .post(
    "/",
    authMiddleware,
    zValidator("json", experienceSchema),
    async (c) => {
      await dbConnect();
      const data = c.req.valid("json");
      const exp = await Experience.create(data);
      if (!exp) {
        return c.json(
          { message: "Error creating experience!, Try again later" },
          status.BAD_REQUEST
        );
      }
      return c.json({
        success: true,
        experience: exp
      });
    }
  )
  .patch(
    "/:id",
    authMiddleware,
    zValidator(
      "param",
      z.object({
        id: z.string().optional()
      })
    ),

    zValidator("json", experienceSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      if (!id) {
        return c.json({ error: "Missing id" }, status.BAD_REQUEST);
      }
      await dbConnect();
      const data = c.req.valid("json");
      const exp = await Experience.findByIdAndUpdate(id, data);
      if (!exp) {
        return c.json({ message: "experience not found" }, status.BAD_REQUEST);
      }
      return c.json({
        success: true,
        experience: exp
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
      const stack = await Experience.findByIdAndDelete(id);
      if (!stack) {
        return c.json(
          { message: "Error deleting experience!, Try again later" },
          status.NOT_FOUND
        );
      }
      return c.status(status.NO_CONTENT);
    }
  );

export default app;
