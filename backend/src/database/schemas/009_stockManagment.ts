import { Migration } from '../migrate';

export const stockManagementTable: Migration = {
  id: 9, 
  name: 'create_stock_management_tables',
  up: `
    -- 1. Update Existing Employees Table (Add Aggregate Columns)
    ALTER TABLE employees 
    ADD COLUMN IF NOT EXISTS total_assigned_stock INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS total_sold INTEGER DEFAULT 0;

    -- 2. Create Holdings Table 
    -- (Tracks which specific products are currently with an employee)
    CREATE TABLE IF NOT EXISTS employee_holdings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
      product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      quantity_assigned INTEGER DEFAULT 0,
      assigned_at TIMESTAMPTZ DEFAULT now(),
      
      -- Constraint: One record per product per employee
      UNIQUE(employee_id, product_id)
    );

    -- 3. Create Logs Table (History)
    CREATE TABLE IF NOT EXISTS stock_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
      product_id UUID REFERENCES products(id) ON DELETE SET NULL, -- Nullable for Sales
      type VARCHAR(20) NOT NULL, -- 'ASSIGN', 'SALE', 'REASSIGN'
      quantity INTEGER NOT NULL,
      note TEXT,
      created_at TIMESTAMPTZ DEFAULT now()
    );

    -- Indexes for performance
    CREATE INDEX IF NOT EXISTS idx_stock_logs_emp ON stock_logs(employee_id);
    CREATE INDEX IF NOT EXISTS idx_holdings_emp ON employee_holdings(employee_id);
  `,
};