import { Request, Response, NextFunction } from "express";

interface CustomeError extends Error {
  status?: number;
}

export const errorHandler = (
  err: CustomeError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`[ERROR] ${err.message}`);

  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";

  res
    .status(statusCode)
    .json({ status: "error", status_code: statusCode, message });
};
