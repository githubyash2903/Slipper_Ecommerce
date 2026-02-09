import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();


const pool = new Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  connectionString: process.env.DATABASE_URL,
});

export default pool;
