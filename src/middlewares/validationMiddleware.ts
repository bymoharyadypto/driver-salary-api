import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const salaryListSchema = z.object({
  month: z.number().min(1).max(12),
  year: z.number().min(2000).max(2100),
  current: z.number().min(1).default(1),
  page_size: z.number().min(1).max(100).default(10),
  driver_code: z.string().optional(),
  status: z.enum(["PENDING", "CONFIRMED", "PAID"]).optional(),
  name: z.string().optional(),
});

export const validateSalaryListQuery = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    salaryListSchema.parse(req.query);
    next();
  } catch (error: any) {
    res.status(400).json({ error: error.errors });
  }
};
