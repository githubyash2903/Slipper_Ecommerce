import { Request, Response } from 'express';
import pool from '../../database/db'; 

// 1. Get All Employees
export const getEmployees = async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT 
        id, name, email, phone, status, created_at as join_date,
        COALESCE(total_assigned_stock, 0) as total_assigned,
        COALESCE(total_sold, 0) as total_sold,
        (COALESCE(total_assigned_stock, 0) - COALESCE(total_sold, 0)) as current_holding
      FROM employees
      ORDER BY created_at DESC
    `;

    const result = await pool.query(query);

    res.status(200).json({
      success: true,
      data: result.rows
    });

  } catch (error: any) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


// 2. Add New Employee
export const addEmployee = async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    const { name, email, phone } = req.body;

    const checkQuery = 'SELECT id FROM employees WHERE email = $1';
    const checkResult = await client.query(checkQuery, [email]);

    if (checkResult.rows.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const insertQuery = `
      INSERT INTO employees (name, email, phone, status, join_date)
      VALUES ($1, $2, $3, 'active', NOW())
      RETURNING *
    `;
    
    const result = await client.query(insertQuery, [name, email, phone]);

    res.status(201).json({ 
      success: true, 
      message: 'Employee added', 
      data: result.rows[0] 
    });
  } catch (error) {
    console.error('Add employee error:', error);
    res.status(500).json({ message: 'Could not add employee' });
  } finally {
    client.release();
  }
};

// 3. Update Employee
export const updateEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    const query = `
      UPDATE employees 
      SET name = $1, email = $2, phone = $3, updated_at = NOW()
      WHERE id = $4
      RETURNING *
    `;

    const result = await pool.query(query, [name, email, phone, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json({ success: true, message: 'Employee updated', data: result.rows[0] });
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({ message: 'Update failed' });
  }
};

// 4. Toggle Status (Active <-> Inactive)
export const toggleEmployeeStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const query = `
      UPDATE employees
      SET status = CASE 
        WHEN status = 'active' THEN 'inactive' 
        ELSE 'active' 
      END,
      updated_at = NOW()
      WHERE id = $1
      RETURNING status, id
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json({ 
      success: true, 
      message: `Status changed to ${result.rows[0].status}`, 
      data: result.rows[0] 
    });
  } catch (error) {
    console.error('Toggle status error:', error);
    res.status(500).json({ message: 'Status update failed' });
  }
};

// 5. Delete Employee
export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM employees WHERE id = $1 RETURNING id';
    
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json({ success: true, message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({ message: 'Delete failed' });
  }
};


