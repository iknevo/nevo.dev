import { Hono } from "hono";
import { logger } from "hono/logger";
import { handle } from "hono/vercel";
import auth from "./auth.route";

const app = new Hono().basePath("/api");
app.use(logger());

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app.route("/auth", auth);

const handler = handle(app);
export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const DELETE = handler;

export type AppType = typeof routes;
