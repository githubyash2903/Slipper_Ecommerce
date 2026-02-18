import { Migration } from '../migrate';

export const fixAllMissingColumns: Migration = {
  // IMPORTANT: ID ko 12 kar diya taaki ye PAKKA run ho
  id: 12, 
  name: 'fix_orders_schema_final',
  up: `
    -- 1. Updated At (Current Error Fix)
    ALTER TABLE orders 
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

    -- 2. Created At (Safety ke liye check)
    ALTER TABLE orders 
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();

    -- 3. Taxes
    ALTER TABLE orders 
    ADD COLUMN IF NOT EXISTS taxes DECIMAL(10, 2) DEFAULT 0;

    -- 4. Payment Method
    ALTER TABLE orders 
    ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'COD';

    -- 5. Payment Status
    ALTER TABLE orders 
    ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending';

    -- 6. Shipping Address (Agar ye bhi missing hua toh)
    ALTER TABLE orders 
    ADD COLUMN IF NOT EXISTS shipping_address JSONB;

    -- 7. Razorpay ID
    ALTER TABLE orders 
    ADD COLUMN IF NOT EXISTS razorpay_order_id VARCHAR(255);
  `,
};