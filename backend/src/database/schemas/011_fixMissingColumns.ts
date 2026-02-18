import { Migration } from '../migrate';

export const fixMissingOrderColumns: Migration = {
  id: 11, 
  name: 'fix_missing_columns_taxes_and_payment',
  up: `
    -- 1. Taxes (Previous Error Fix)
    ALTER TABLE orders 
    ADD COLUMN IF NOT EXISTS taxes DECIMAL(10, 2) DEFAULT 0;

    -- 2. Payment Method (Current Error Fix)
    ALTER TABLE orders 
    ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'COD';

    -- 3. Payment Status (Future Error Prevention)
    ALTER TABLE orders 
    ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending';

    -- 4. Razorpay ID (Just to be sure)
    ALTER TABLE orders 
    ADD COLUMN IF NOT EXISTS razorpay_order_id VARCHAR(255);
    
    -- 5. Shipping Address (Agar ye bhi missing ho)
    ALTER TABLE orders 
    ADD COLUMN IF NOT EXISTS shipping_address JSONB;
  `,
};