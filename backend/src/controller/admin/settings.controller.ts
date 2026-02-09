import { Request, Response } from 'express';
import pool from '../../database/db';

// GET Settings
export const getStoreSettings = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM store_settings WHERE id = 1');
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// UPDATE Settings
export const updateStoreSettings = async (req: Request, res: Response) => {
  const { store_name, support_email, support_phone, store_address, currency, tax_rate } = req.body;
  
  try {
    const query = `
      UPDATE store_settings 
      SET store_name = $1, support_email = $2, support_phone = $3, 
          store_address = $4, currency = $5, tax_rate = $6, updated_at = NOW()
      WHERE id = 1
      RETURNING *
    `;
    const result = await pool.query(query, [store_name, support_email, support_phone, store_address, currency, tax_rate]);
    
    res.json({ success: true, message: 'Settings updated', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Update failed' });
  }
};