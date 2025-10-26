import { zValidator as zv } from "@hono/zod-validator";
import type { ValidationTargets } from "hono";
import status from "http-status";
import { ZodType } from "zod";

export const zValidator = <
  T extends ZodType,
  Target extends keyof ValidationTargets,
>(
  target: Target,
  schema: T
) =>
  zv(target, schema, (result, c) => {
    if (!result.success) {
      const errorsArr = JSON.parse(result.error.message);
      const errorMessages = errorsArr.map((error: any) => {
        const field = error.path.join(".");
        return `${field}: ${error.message}`;
      });
      return c.json(
        { success: false, errors: errorMessages },
        status.BAD_REQUEST
      );
    }
  });
