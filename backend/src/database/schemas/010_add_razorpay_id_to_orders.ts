import { Migration } from '../migrate';

export const add_razorpay_id_and_fix_taxes: Migration = {
  id: 10, 
  name: 'add_razorpay_id_and_fix_taxes', // Naam thoda change kiya taaki yaad rahe
  up: `
    -- 1. Razorpay ID add kar rahe hain
    ALTER TABLE orders 
    ADD COLUMN IF NOT EXISTS razorpay_order_id VARCHAR(255);

    -- 2. IMPORTANT: Taxes column jo missing tha, use bhi yahan add kar do
    ALTER TABLE orders 
    ADD COLUMN IF NOT EXISTS taxes DECIMAL(10, 2) DEFAULT 0;

    -- Search fast karne ke liye index
    CREATE INDEX IF NOT EXISTS idx_orders_razorpay_link ON orders(razorpay_order_id);
  `,
};