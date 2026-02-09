import pool from '../../database/db';
import { AppError } from '../../utils/errors';

/**
 * Get logged-in user's profile (Includes avatar)
 */
export async function getProfile(userId: string) {
  const { rows } = await pool.query(
    `
    SELECT
      id,
      name,
      email,
      phone_country_code,
      phone_number,
      role,
      avatar_url, -- Added Avatar
      is_active,
      created_at,
      updated_at
    FROM users
    WHERE id = $1 AND is_active = true
    `,
    [userId]
  );

  if (!rows.length) {
    throw new AppError('User not found or inactive', 404);
  }

  return rows[0];
}

/**
 * Update logged-in user's profile (Name & Phone)
 */
export async function updateProfile(userId: string, data: { name?: string; phone?: string }) {
  const { rowCount, rows } = await pool.query(
    `
    UPDATE users
    SET
      name = COALESCE($2, name),          -- Update name if provided
      phone_number = COALESCE($3, phone_number), -- Update phone if provided
      updated_at = now()
    WHERE id = $1 AND is_active = true
    RETURNING
      id, name, email, phone_number, role, avatar_url, is_active, updated_at
    `,
    [userId, data.name, data.phone]
  );

  if (!rowCount) {
    throw new AppError('User not found or inactive', 404);
  }

  return rows[0];
}

// ---------------- ADDRESS SERVICES ----------------

export async function getAddresses(userId: string) {
  const { rows } = await pool.query(
    'SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC',
    [userId]
  );
  return rows;
}

export async function addAddress(userId: string, payload: any) {
  // If user wants this as default, unset other defaults first
  if (payload.isDefault) {
    await pool.query('UPDATE addresses SET is_default = false WHERE user_id = $1', [userId]);
  }

  const { rows } = await pool.query(
    `INSERT INTO addresses (user_id, name, street, city, state, zip_code, is_default)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [userId, payload.name, payload.street, payload.city, payload.state, payload.zipCode, payload.isDefault || false]
  );
  
  return rows[0];
}

export async function deleteAddress(userId: string, addressId: string) {
  const { rowCount } = await pool.query(
    'DELETE FROM addresses WHERE id = $1 AND user_id = $2',
    [addressId, userId]
  );

  if (!rowCount) {
    throw new AppError('Address not found', 404);
  }
  return true;
}

// ---------------- ORDER SERVICES ----------------

export async function getOrders(userId: string) {
  const { rows } = await pool.query(
    `SELECT id, total_amount, status, item_count, created_at 
     FROM orders 
     WHERE user_id = $1 
     ORDER BY created_at DESC`,
    [userId]
  );
  return rows;
}