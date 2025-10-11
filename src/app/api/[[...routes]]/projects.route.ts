import { CreateProjectSchema } from "@/src/definitions/projects.validations";
import dbConnect from "@/src/lib/db";
import { authMiddleware, type AccessPayload } from "@/src/lib/jwt";
// import { zValidator } from "@/src/lib/zod-wrapper";
import { Project } from "@/src/models/project.model";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import status from "http-status";
// import { z } from "zod";

type Env = {
  Variables: {
    user: AccessPayload;
  };
};

const app = new Hono<Env>()
  .get("/", async (c) => {
    await dbConnect();
    const data = await Project.find();

    return c.json({
      data,
    });
  })
  // .get(
  //   "/:id",
  //   zValidator(
  //     "param",
  //     z.object({
  //       id: z.string().optional(),
  //     })
  //   ),
  //   clerkMiddleware(),
  //   async (c) => {
  //     const auth = getAuth(c);
  //     const { id } = c.req.valid("param");
  //     if (!id) {
  //       return c.json({ error: "Missing account id" }, 400);
  //     }
  //     if (!auth?.userId) {
  //       return c.json({ error: "Unauthorized" }, 401);
  //     }
  //     const [data] = await db
  //       .select({ id: accounts.id, name: accounts.name })
  //       .from(accounts)
  //       .where(and(eq(accounts.userId, auth.userId), eq(accounts.id, id)));
  //     if (!data) {
  //       return c.json({ error: "Not Found" }, 404);
  //     }
  //     return c.json({ data });
  //   }
  // )
  .post(
    "/",
    authMiddleware,
    zValidator("json", CreateProjectSchema),
    async (c) => {
      const values = c.req.valid("json");
      await dbConnect();
      const data = await Project.create(values);
      return c.json({ data }, status.OK);
    }
  );
// .post(
//   "/bulk-delete",
//   clerkMiddleware(),
//   zValidator(
//     "json",
//     z.object({
//       ids: z.array(z.string()),
//     })
//   ),
//   async (c) => {
//     const auth = getAuth(c);
//     const { ids } = c.req.valid("json");
//     if (!auth?.userId) {
//       return c.json({ error: "Unauthorized" }, 401);
//     }
//     const data = await db
//       .delete(accounts)
//       .where(and(eq(accounts.userId, auth.userId), inArray(accounts.id, ids)))
//       .returning({
//         id: accounts.id,
//       });
//     return c.json({ data });
//   }
// )
// .patch(
//   "/:id",
//   clerkMiddleware(),
//   zValidator(
//     "param",
//     z.object({
//       id: z.string().optional(),
//     })
//   ),
//   zValidator(
//     "json",
//     insertAccountSchema.pick({
//       name: true,
//     })
//   ),
//   async (c) => {
//     const auth = getAuth(c);
//     const { id } = c.req.valid("param");
//     const values = c.req.valid("json");

//     if (!id) {
//       return c.json({ error: "Missing id" }, 400);
//     }

//     if (!auth?.userId) {
//       return c.json({ error: "Unauthorized" }, 401);
//     }

//     const [data] = await db
//       .update(accounts)
//       .set(values)
//       .where(and(eq(accounts.userId, auth.userId), eq(accounts.id, id)))
//       .returning();

//     if (!data) {
//       return c.json({ error: "Not found" }, 404);
//     }

//     return c.json({ data });
//   }
// )
// .delete(
//   "/:id",
//   clerkMiddleware(),
//   zValidator(
//     "param",
//     z.object({
//       id: z.string().optional(),
//     })
//   ),
//   async (c) => {
//     const auth = getAuth(c);
//     const { id } = c.req.valid("param");

//     if (!id) {
//       return c.json({ error: "Missing id" }, 400);
//     }

//     if (!auth?.userId) {
//       return c.json({ error: "Unauthorized" }, 401);
//     }

//     const [data] = await db
//       .delete(accounts)
//       .where(and(eq(accounts.userId, auth.userId), eq(accounts.id, id)))
//       .returning({
//         id: accounts.id,
//       });

//     if (!data) {
//       return c.json({ error: "Not found" }, 404);
//     }

//     return c.json({ data });
//   }
// );
export default app;
