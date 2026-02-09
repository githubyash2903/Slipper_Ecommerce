import pool from "../database/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/errors";


import { randomUUID } from "crypto"; 

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = "1d";

export async function register(data: any, role: "USER" | "ADMIN") {
  const { name, email, phoneCountryCode, phoneNumber, password } = data;

  const existing = await pool.query("SELECT 1 FROM users WHERE email = $1", [
    email,
  ]);
  if (existing.rowCount) {
    throw new AppError("Email already registered", 409);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const userId = randomUUID(); 

  await pool.query(
    `
    INSERT INTO users 
      (id, name, email, phone_country_code, phone_number, password_hash, role)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    `,
    [userId, name, email, phoneCountryCode, phoneNumber, passwordHash, role]
  );

  return { id: userId, email, name };
}
export async function registerUser(data: any) {
  return register(data, "USER");
}
export async function registerAdmin(data: any) {
  return register(data, "ADMIN");
}

export async function loginUser(data: any) {
  const { email, password } = data;

  const { rows } = await pool.query(
    "SELECT id, name, email, role, is_active, password_hash FROM users WHERE email = $1",
    [email]
  );

  if (!rows.length) throw new AppError("Invalid credentials", 401);

  const user = rows[0];
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw new AppError("Invalid credentials", 401);

  if (!user.is_active) {
    throw new AppError("Account deactivated. Contact support.", 403);
  }

  const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return { 
    token, 
    user: { id: user.id, name: user.name, email: user.email, role: user.role } 
  };
}