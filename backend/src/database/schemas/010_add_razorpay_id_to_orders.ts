import { Migration } from '../migrate';

export const add_razorpay_id_and_fix_taxes: Migration = {
  id: 10, 
  name: 'add_razorpay_id_and_fix_taxes', 
  up: `
    -- 1. Razorpay ID column add karein
    ALTER TABLE orders 
    ADD COLUMN IF NOT EXISTS razorpay_order_id VARCHAR(255);

    -- 2. CRITICAL FIX: Missing 'taxes' column ko yahan manually add karein
    ALTER TABLE orders 
    ADD COLUMN IF NOT EXISTS taxes DECIMAL(10, 2) DEFAULT 0;

    -- 3. Payment Status column bhi ensure karein (safety ke liye)
    ALTER TABLE orders 
    ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending';

    -- 4. Search fast karne ke liye index
    CREATE INDEX IF NOT EXISTS idx_orders_razorpay_link ON orders(razorpay_order_id);
  `,
};