import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import status from "http-status";
import { env } from "../config/env";

export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function handleCastErr(err: any) {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, status.BAD_REQUEST);
}
export function handleDuplicateErr(err: any) {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `Duplicate value for field (${field}: ${value}). Please use another value!`;
  return new AppError(message, status.BAD_REQUEST);
}
export function handleValidationErr(err: any) {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Invalid input. ${errors.join(". ")}`;
  return new AppError(message, status.BAD_REQUEST);
}
function sendError(err: any, c: Context) {
  return c.json(
    {
      status: err.isOperational ? err.status : "error",
      error: err,
      message: err.isOperational
        ? err.message
        : "Something Went Wrong!, Please try again.",
      ...(env.development && { stack: err.stack }),
    },
    err.isOperational ? err.statusCode : status.INTERNAL_SERVER_ERROR
  );
}

export const errorHandler = async (err: Error, c: Context) => {
  console.error("Error occurred:", err);
  let error = err as any;
  if (error.name === "CastError") error = handleCastErr(error);
  if (error.code === 11000) error = handleDuplicateErr(error);
  if (error.name === "ValidationError") error = handleValidationErr(error);
  if (err instanceof HTTPException) {
    return c.json({ message: err.message }, err.status);
  }
  return sendError(error, c);
};
