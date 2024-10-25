import { getDriverSalaryList } from "../controllers/driverController";
import { validateSalaryListQuery } from "../middlewares/validationMiddleware";
import { errorHandler } from "../utils/errorHandler";
const router = require("express").Router();

router.get(
  "/v1/salary/driver/list",
  validateSalaryListQuery,
  getDriverSalaryList
);

router.use(errorHandler);

export default router;
