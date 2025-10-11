import { errorHandler } from "@/src/lib/error-handlers";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { handle } from "hono/vercel";
import status from "http-status";
import auth from "./auth.route";
import projects from "./projects.route";
const app = new Hono().basePath("/api");

app.use(logger());

app.onError(errorHandler);

app.notFound((c) => {
  return c.json({ message: `${c.req.path} is not found` }, status.NOT_FOUND);
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app.route("/auth", auth).route("/projects", projects);

const handler = handle(app);
export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const DELETE = handler;

export type AppTypes = typeof routes;
