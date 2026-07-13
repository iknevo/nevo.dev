import { Hono } from "hono";
import { rateLimiter } from "hono-rate-limiter";
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
      if (!origin) return undefined;
      return allowedOrigins.includes(origin) ? origin : undefined;
    },
    credentials: true,
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposeHeaders: ["Set-Cookie"],
  })
);

app.use(
  "*",
  rateLimiter({
    windowMs: 60 * 1000,
    limit: 60,
    keyGenerator: (c) =>
      c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ??
      c.req.header("x-real-ip") ??
      "unknown",
    standardHeaders: "draft-7",
    message: { message: "Too many requests, please try again later." },
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
