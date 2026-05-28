import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { handle } from "hono/vercel";
import status from "http-status";

import { errorHandler } from "@/src/lib/error-handlers";

import auth from "./auth-routes";
import blog from "./blog-routes";
import experience from "./experience-routes";
import projects from "./project-routes";
import stack from "./stack-routes";

const app = new Hono().basePath("/api");

app.use(
  "*",
  cors({
    origin: [
      "https://nevo.qzz.io",
      "https://www.nevo.qzz.io",
      "https://iknevo-dev.vercel.app",
      "http://localhost:3000",
    ],
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app
  .route("/auth", auth)
  .route("/projects", projects)
  .route("/stack", stack)
  .route("/experience", experience)
  .route("/blog", blog);

app.use(logger());
app.onError(errorHandler);
app.notFound((c) => {
  return c.json({ message: `${c.req.path} is not found` }, status.NOT_FOUND);
});

const handler = handle(app);
export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const DELETE = handler;

export type AppTypes = typeof routes;
