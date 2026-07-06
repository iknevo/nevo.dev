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
import resume from "./resume-routes";
import stack from "./stack-routes";

const app = new Hono().basePath("/api");

const allowedOrigins = [
  "https://nevo.is-a.dev",
  "https://nevo.qzz.io",
  "https://iknevo-dev.vercel.app",
];

app.use(
  "*",
  cors({
    origin: (origin) => {
      if (!origin) return "";
      return allowedOrigins.includes(origin) ? origin : undefined;
    },
    credentials: true,
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposeHeaders: ["Set-Cookie"],
  })
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app
  .route("/auth", auth)
  .route("/projects", projects)
  .route("/stack", stack)
  .route("/experience", experience)
  .route("/blog", blog)
  .route("/resume", resume);

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
export const OPTIONS = handler;

export type AppTypes = typeof routes;
export { app };
