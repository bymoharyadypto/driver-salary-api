import { Request, Response, NextFunction } from "express";
import { getDriverSalaries } from "../services/driverService";
import { BadRequestError, NotFoundError } from "../utils/customeErrors";

export const getDriverSalaryList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { month, year, current, page_size, driver_code, status, name } =
      req.query;

    if (!month || !year)
      throw new BadRequestError("Month and Year are required");

    const salaries = await getDriverSalaries(
      parseInt(month as string),
      parseInt(year as string),
      parseInt(current as string),
      parseInt(page_size as string),
      driver_code as string | undefined,
      status as string | undefined,
      name as string | undefined
    );

    if (!salaries) throw new NotFoundError("Data Driver Salaries Not Found");

    res.status(200).json(salaries);
  } catch (error: any) {
    next(error);
  }
};
