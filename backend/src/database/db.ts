import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";
console.log(process.env.DATABASE_URL, process.env.NODE_ENV)
const pool = isProduction
  ? new Pool({
  
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false, 
      },
    })
  : new Pool({
      host: process.env.DB_HOST || "localhost",
      database: process.env.DB_DATABASE,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      port: Number(process.env.DB_PORT) || 5432,
    });

export default pool;