import { databaseConfig } from "../config/database";
import { NotFoundError } from "../utils/customeErrors";

const getMonthlyAttendanceSalary = async (): Promise<number> => {
  const result = await databaseConfig.query(`
    SELECT value::numeric FROM variable_configs WHERE key = 'DRIVER_MONTHLY_ATTENDANCE_SALARY';
  `);

  if (result.rows.length === 0)
    throw new NotFoundError("Monthly salary not found");
  return result.rows[0].value;
};

export const getDriverSalaries = async (
  month: number,
  year: number,
  current: number,
  pageSize: number,
  driverCode?: string,
  status?: string,
  name?: string
) => {
  const attendanceSalary = await getMonthlyAttendanceSalary();
  const offset = (current - 1) * pageSize;

  const query = `
    WITH driver_data AS (
      SELECT 
        d.driver_code,
        d.name,
        SUM(CASE WHEN sc.cost_status = 'PENDING' AND s.shipment_status != 'CANCELLED' THEN sc.total_costs ELSE 0 END) AS total_pending,
        SUM(CASE WHEN sc.cost_status = 'CONFIRMED' AND s.shipment_status != 'CANCELLED' THEN sc.total_costs ELSE 0 END) AS total_confirmed,
        SUM(CASE WHEN sc.cost_status = 'PAID' AND s.shipment_status != 'CANCELLED' THEN sc.total_costs ELSE 0 END) AS total_paid,
        COUNT(da.id) * $1 AS total_attendance_salary,
        COUNT(DISTINCT s.shipment_no) AS count_shipment
      FROM drivers d
      LEFT JOIN driver_attendances da ON d.driver_code = da.driver_code 
        AND EXTRACT(MONTH FROM da.attendance_date) = $2 
        AND EXTRACT(YEAR FROM da.attendance_date) = $3 
        AND da.attendance_status = TRUE
      LEFT JOIN shipment_costs sc ON d.driver_code = sc.driver_code
      LEFT JOIN shipments s ON sc.shipment_no = s.shipment_no 
        AND EXTRACT(MONTH FROM s.shipment_date) = $2 
        AND EXTRACT(YEAR FROM s.shipment_date) = $3
      GROUP BY d.driver_code, d.name
    )
    SELECT *, total_p ending + total_confirmed + total_paid + total_attendance_salary AS total_salary
    FROM driver_data
    WHERE ($4::text IS NULL OR driver_code = $4)
      AND ($5::text IS NULL OR name ILIKE '%' || $5 || '%')
      AND ($6::text IS NULL OR 
          ($6 = 'PENDING' AND total_pending > 0) OR 
          ($6 = 'CONFIRMED' AND total_confirmed > 0) OR 
          ($6 = 'PAID' AND total_paid > 0 AND total_confirmed = 0 AND total_pending = 0)
      )
    ORDER BY driver_code
    LIMIT $7 OFFSET $8;
  `;

  const result = await databaseConfig.query(query, [
    attendanceSalary,
    month,
    year,
    driverCode,
    name,
    status,
    pageSize,
    offset,
  ]);

  const totalQuery = "SELECT COUNT(*) AS total_row FROM drivers;";
  const totalResult = await databaseConfig.query(totalQuery);

  return {
    data: result.rows,
    total_row: parseInt(totalResult.rows[0].total_row, 10),
    current,
    page_size: pageSize,
  };
};
