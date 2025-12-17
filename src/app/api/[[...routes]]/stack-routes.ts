import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import status from "http-status";
import { z } from "zod";

import { STACK, STACK_SORT } from "@/src/config/constants";
import { stackSchema } from "@/src/definitions/stack-validations";
import { uploadToCloudinary } from "@/src/lib/cloudinary";
import dbConnect from "@/src/lib/db";
import { authMiddleware } from "@/src/lib/jwt";
import { Stack, stackType } from "@/src/models/stack-model";

const app = new Hono()
  .get("/", async (c) => {
    await dbConnect();
    const data = await Stack.aggregate([
      {
        $group: {
          _id: "$type",
          items: { $push: "$$ROOT" }
        }
      },
      {
        $addFields: {
          order: {
            $switch: {
              branches: [
                {
                  case: { $eq: ["$_id", STACK.frontend] },
                  then: STACK_SORT.frontend
                },
                {
                  case: { $eq: ["$_id", STACK.backend] },
                  then: STACK_SORT.backend
                },
                {
                  case: { $eq: ["$_id", STACK.tools] },
                  then: STACK_SORT.tools
                },
                {
                  case: { $eq: ["$_id", STACK.studying] },
                  then: STACK_SORT.studying
                }
              ],
              default: STACK_SORT.default
            }
          }
        }
      },
      { $sort: { order: 1 } },
      {
        $project: {
          _id: 0,
          type: "$_id",
          items: 1
        }
      }
    ]);
    if (!data)
      return c.json(
        { message: "Error getting stack!, Try again later" },
        status.NOT_FOUND
      );
    return c.json<{
      data: {
        type: string;
        items: { name: string; _id: string; icon: string }[];
      }[];
    }>({
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
        return c.json({ error: "Missing stack item id" }, status.BAD_REQUEST);
      }
      await dbConnect();
      const data = await Stack.findById(id);
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
    const icon = body.get("icon");
    const type = body.get("type");
    const parsedData = {
      name,
      icon,
      type
    };

    const result = stackSchema.safeParse(parsedData);

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
    let iconUrl = data.icon;
    if (data.icon instanceof File) {
      iconUrl = await uploadToCloudinary(data.icon, "tech-stack");
    }
    const newStack = {
      name: data.name,
      icon: iconUrl,
      type: data.type
    };
    const stack = await Stack.create(newStack);
    if (!stack) {
      return c.json(
        { message: "Error creating stack!, Try again later" },
        status.BAD_REQUEST
      );
    }
    return c.json({
      success: true,
      stack
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
      const name = body.get("name");
      const icon = body.get("icon");
      const type = body.get("type");
      const parsedData = {
        name,
        icon,
        type
      };

      const result = stackSchema.safeParse(parsedData);

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
      let iconUrl = data.icon;
      if (data.icon instanceof File) {
        iconUrl = await uploadToCloudinary(data.icon, "tech-stack");
      }
      const newStack = {
        name: data.name,
        icon: iconUrl,
        type: data.type
      };
      let stack = await Stack.findById(id);
      if (!stack) {
        return c.json({ message: "stack item not found" }, status.BAD_REQUEST);
      }
      Object.assign(stack, newStack);
      stack = await stack.save();
      return c.json<{ success: true; stack: stackType }>({
        success: true,
        stack
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
      const stack = await Stack.findByIdAndDelete(id);
      if (!stack) {
        return c.json(
          { message: "Error deleting stack item!, Try again later" },
          status.NOT_FOUND
        );
      }
      return c.status(status.NO_CONTENT);
    }
  );

export default app;
