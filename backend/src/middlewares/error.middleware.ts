import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/response";

export class AppError extends Error {
  public status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error("Error:", err.message);

  const statusCode = err instanceof AppError ? err.status : 500;

  res.status(statusCode).json(errorResponse(err.message || "Internal Server Error"));
}
