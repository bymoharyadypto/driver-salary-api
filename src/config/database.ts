import dotenv from "dotenv";
import { Pool } from "pg";
dotenv.config();

const databaseConfig = new Pool({
  user: process.env.DB_USER || "",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "",
  host: process.env.DB_HOST || "",
  port: Number(process.env.DB_PORT) || 5432,
});

databaseConfig
  .connect()
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Database connection failed:", err.message));

export { databaseConfig };
