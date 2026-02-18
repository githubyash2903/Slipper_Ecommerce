import { Migration } from '../migrate';

export const fixAllMissingColumns: Migration = {
  id: 11, // Agar ye deploy karne par na chale, toh isse 12 kar dena
  name: 'fix_all_missing_columns_in_orders',
  up: `
    -- 1. Taxes Column Fix
    ALTER TABLE orders 
    ADD COLUMN IF NOT EXISTS taxes DECIMAL(10, 2) DEFAULT 0;

    -- 2. Payment Method Fix (Jo abhi error aya tha)
    ALTER TABLE orders 
    ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'COD';

    -- 3. Payment Status Fix (Safety ke liye)
    ALTER TABLE orders 
    ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending';

    -- 4. Shipping Address Fix (Agar future me error na chahiye toh)
    ALTER TABLE orders 
    ADD COLUMN IF NOT EXISTS shipping_address JSONB;

    -- 5. Razorpay ID Fix (Agar migration 10 fail hua ho toh ye sambhal lega)
    ALTER TABLE orders 
    ADD COLUMN IF NOT EXISTS razorpay_order_id VARCHAR(255);
  `,
};