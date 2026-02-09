import { Request, Response, NextFunction } from 'express';
import { loginSchema, registerSchema } from '../validation/auth.schema';
import { loginUser, registerAdmin, registerUser } from '../service/auth.service';
import { success } from '../utils/response';
import pool from '../database/db';

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const payload = registerSchema.parse(req.body);
    const user = await registerUser(payload);
    return success(res, user, 'User registered');
  } catch (err) {
    next(err);
  }
}

export async function registerAdminController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const payload = registerSchema.parse(req.body);
    const user = await registerAdmin(payload);
    return success(res, user, 'Admin registered');
  } catch (err) {
    next(err);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const payload = loginSchema.parse(req.body);
    const token = await loginUser(payload);
    return success(res, token, 'Login successful');
  } catch (err) {
    next(err);
  }
}

export async function getProfile(
  req: Request | any, 
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user.id; 

    const result = await pool.query(
      `SELECT id, email, first_name, last_name, address, city, state, zip_code 
       FROM users 
       WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    return success(res, result.rows[0], 'Profile details fetched');
  } catch (err) {
    next(err);
  }
}

export const requireAdmin = (req: Request | any, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
     res.status(403).json({ 
      success: false, 
      message: "Access Denied: You do not have admin privileges" 
    });
    return;
  }

  next();
};