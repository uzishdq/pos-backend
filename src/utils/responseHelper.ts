import { Response } from "express";
import { ZodError } from "zod";

export const successResponse = (
  res: Response,
  message: string,
  data?: any,
  status: number = 200
) => {
  return res.status(status).json({ success: true, message, data });
};

export const errorResponse = (
  res: Response,
  error: any,
  status: number = 400
) => {
  if (error instanceof ZodError) {
    return res.status(status).json({
      success: false,
      message: "validation failed",
      errors: error.issues.map((issue) => ({
        path: issue.path.join("/"),
        message: issue.message,
      })),
    });
  }

  return res
    .status(status)
    .json({ success: false, message: error.message || "An Error Occurred" });
};
