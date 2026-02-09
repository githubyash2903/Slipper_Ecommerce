import { Request, Response } from 'express';
import pool from '../../database/db';


// 1. GET DASHBOARD DATA
export const getStockDashboard = async (req: Request, res: Response) => {
  try {
    const overallStockResult = await pool.query(`SELECT SUM(stock) as total FROM products`);
    const overallStock = Number(overallStockResult.rows[0]?.total || 0);

    const employeesQuery = `
      SELECT 
        id, name, total_assigned_stock, total_sold, 
        (total_assigned_stock - total_sold) as remaining_liability,
        updated_at
      FROM employees 
      WHERE status = 'active'
      ORDER BY name ASC
    `;
    const employeesResult = await pool.query(employeesQuery);

    const holdingsQuery = `
      SELECT h.employee_id, h.product_id, p.name as product_name, h.quantity_assigned
      FROM employee_holdings h
      JOIN products p ON h.product_id = p.id
      WHERE h.quantity_assigned > 0
    `;
    const holdingsResult = await pool.query(holdingsQuery);

    const formattedEmployees = employeesResult.rows.map((emp: any) => {
      const myProducts = holdingsResult.rows
        .filter((h: any) => h.employee_id === emp.id)
        .map((h: any) => ({
          productId: h.product_id,
          productName: h.product_name,
          quantity: h.quantity_assigned
        }));

      return {
        employeeId: emp.id,
        employeeName: emp.name,
        products: myProducts,
        totalAssigned: emp.total_assigned_stock,
        totalSold: emp.total_sold,
        remainingStock: Number(emp.remaining_liability),
        lastUpdated: emp.updated_at
      };
    });

    const historyQuery = `
      SELECT l.id, l.type, l.quantity, l.created_at as date, l.note,
             e.name as employee_name, p.name as product_name
      FROM stock_logs l
      JOIN employees e ON l.employee_id = e.id
      LEFT JOIN products p ON l.product_id = p.id
      ORDER BY l.created_at DESC
      LIMIT 50
    `;
    const historyResult = await pool.query(historyQuery);

    res.json({
      success: true,
      data: {
        overallStock,
        employees: formattedEmployees,
        history: historyResult.rows
      }
    });

  } catch (error) {
    console.error('Stock Dashboard Error:', error);
    res.status(500).json({ message: 'Failed to fetch stock data' });
  }
};

// 2. ASSIGN STOCK (Warehouse -> Employee)
export const assignStock = async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    const { employeeId, productId, quantity } = req.body;
    const qty = Number(quantity);

    if (qty <= 0) throw new Error("Quantity must be positive");

    await client.query('BEGIN'); 

    // Check Warehouse Stock
    const productCheck = await client.query('SELECT stock, name FROM products WHERE id = $1', [productId]);
    if (productCheck.rows.length === 0) throw new Error("Product not found");
    
    const product = productCheck.rows[0];
    if (product.stock < qty) throw new Error(`Insufficient warehouse stock. Only ${product.stock} available.`);

    // 1. Deduct from Warehouse
    await client.query('UPDATE products SET stock = stock - $1 WHERE id = $2', [qty, productId]);

    // 2. Add to Employee Holdings 
    const upsertQuery = `
      INSERT INTO employee_holdings (employee_id, product_id, quantity_assigned, assigned_at)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (employee_id, product_id)
      DO UPDATE SET quantity_assigned = employee_holdings.quantity_assigned + $3, assigned_at = NOW();
    `;
    await client.query(upsertQuery, [employeeId, productId, qty]);

    // 3. Update Employee Totals
    await client.query(`
      UPDATE employees 
      SET total_assigned_stock = total_assigned_stock + $1, updated_at = NOW()
      WHERE id = $2
    `, [qty, employeeId]);

    // 4. Create Log
    await client.query(`
      INSERT INTO stock_logs (employee_id, product_id, type, quantity, note)
      VALUES ($1, $2, 'ASSIGN', $3, $4)
    `, [employeeId, productId, qty, `Assigned ${qty} pcs of ${product.name}`]);

    await client.query('COMMIT');
    res.json({ success: true, message: 'Stock assigned successfully' });

  } catch (error: any) {
    await client.query('ROLLBACK');
    res.status(400).json({ message: error.message || 'Assignment failed' });
  } finally {
    client.release();
  }
};

// 3. RECORD SALES (Employee Liability Reduces)
export const recordSale = async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    const { employeeId, quantity } = req.body;
    const qty = Number(quantity);

    if (qty <= 0) throw new Error("Quantity must be positive");

    await client.query('BEGIN');

    // Check Employee Liability
    const empCheck = await client.query(`
      SELECT name, (total_assigned_stock - total_sold) as remaining 
      FROM employees WHERE id = $1
    `, [employeeId]);

    if (empCheck.rows.length === 0) throw new Error("Employee not found");
    const remaining = Number(empCheck.rows[0].remaining);

    if (remaining < qty) {
      throw new Error(`Cannot sell ${qty}. Employee only has ${remaining} pieces remaining.`);
    }

    // Update Employee Totals
    await client.query(`
      UPDATE employees 
      SET total_sold = total_sold + $1, updated_at = NOW()
      WHERE id = $2
    `, [qty, employeeId]);

    // Create Log
    await client.query(`
      INSERT INTO stock_logs (employee_id, type, quantity, note)
      VALUES ($1, 'SALE', $2, $3)
    `, [employeeId, qty, `Reported sale of ${qty} mixed pieces`]);

    await client.query('COMMIT');
    res.json({ success: true, message: 'Sales recorded successfully' });

  } catch (error: any) {
    await client.query('ROLLBACK');
    res.status(400).json({ message: error.message || 'Sales recording failed' });
  } finally {
    client.release();
  }
};


