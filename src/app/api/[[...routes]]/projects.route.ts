import { CreateProjectSchema } from "@/src/definitions/projects.validations";
import dbConnect from "@/src/lib/db";
import { authMiddleware } from "@/src/lib/jwt";
// import { zValidator } from "@/src/lib/zod-wrapper";
import { Project } from "@/src/models/project.model";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import status from "http-status";
// import { z } from "zod";

// type Env = {
//   Variables: {
//     user: AccessPayload;
//   };
// };

const app = new Hono()
  .get("/", async (c) => {
    await dbConnect();
    const data = await Project.find();

    return c.json({
      data,
    });
  })
  .post(
    "/",
    authMiddleware,
    zValidator("json", CreateProjectSchema),
    async (c) => {
      const values = c.req.valid("json");
      await dbConnect();
      const data = await Project.create(values);
      if (!data)
        return c.json(
          { message: "Error creating project!, Try again later" },
          status.NOT_FOUND
        );
      return c.json({ data }, status.OK);
    }
  );
export default app;
