import pool from '../../database/db';
import { AppError } from '../../utils/errors';

/**
 * Get all users with optional pagination
 */
export async function listUsers(query: any) {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 100, 1), 100);
  const offset = (page - 1) * limit;

  const type =
    typeof query.type === 'string' ? query.type.toLowerCase() : undefined;

  // base conditions
  const conditions: string[] = [];
  const values: any[] = [];

  // role filter: only USER
  conditions.push(`role = $${values.length + 1}`);
  values.push('USER');

  // active / inactive filter
  if (type === 'all') {
    // no is_active filter
  } else if (type === 'active' || !type) {
    conditions.push(`is_active = $${values.length + 1}`);
    values.push(true);
  } else if (type === 'inactive') {
    conditions.push(`is_active = $${values.length + 1}`);
    values.push(false);
  }

  // pagination params
  values.push(limit, offset);

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const sql = `
    SELECT
      id,
      name,
      email,
      phone_country_code,
      phone_number,
      role,
      is_active,
      created_at,
      updated_at
    FROM users
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT $${values.length - 1}
    OFFSET $${values.length}
  `;

  const { rows } = await pool.query(sql, values);
  return rows;
}



/**
 * Get user by ID
 */
export async function getUserById(id: string) {
  const { rows } = await pool.query(
    `SELECT id, name, email, phone_country_code, phone_number, role, is_active, created_at, updated_at 
     FROM users 
     WHERE id = $1`,
    [id]
  );

  if (!rows.length) {
    throw new AppError('User not found', 404);
  }

  return rows[0];
}

/**
 * Deactivate user
 */
export async function deactivateUser(id: string) {
  const { rowCount } = await pool.query(
    `UPDATE users SET is_active = false, updated_at = now() WHERE id = $1 AND is_active = true`,
    [id]
  );

  if (!rowCount) {
    throw new AppError('User not found or already inactive', 404);
  }
}
