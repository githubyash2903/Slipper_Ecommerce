import { Migration } from '../migrate';

export const addRazorpayIdToOrders: Migration = {
  id: 10, 
  name: 'add_razorpay_id_to_orders',
  up: `
    -- orders table me column add kar rahe hain
    ALTER TABLE orders 
    ADD COLUMN IF NOT EXISTS razorpay_order_id VARCHAR(255);

    -- Search fast karne ke liye index
    CREATE INDEX IF NOT EXISTS idx_orders_razorpay_link ON orders(razorpay_order_id);
  `,
};