import { zValidator as zv } from "@hono/zod-validator";
import type { ValidationTargets } from "hono";
import status from "http-status";
import { ZodType } from "zod";

export const zValidator = <T extends ZodType, Target extends keyof ValidationTargets>(
  target: Target,
  schema: T
) =>
  zv(target, schema, (result, c) => {
    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }));
      return c.json(
        { success: false, message: errors[0]?.message ?? "Validation failed", errors },
        status.BAD_REQUEST
      );
    }
  });
