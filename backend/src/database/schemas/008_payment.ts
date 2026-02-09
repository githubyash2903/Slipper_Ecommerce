import { Migration } from '../migrate'; 

export const paymentsTable: Migration = {
  id: 8, 
  name: 'create_payments_table',
  up: `
    CREATE TABLE IF NOT EXISTS payments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      razorpay_order_id VARCHAR(255) NOT NULL,
      razorpay_payment_id VARCHAR(255),
      razorpay_signature VARCHAR(255),
      amount DECIMAL(10, 2) NOT NULL,
      currency VARCHAR(10) DEFAULT 'INR',
      status VARCHAR(50) DEFAULT 'pending', 
      created_at TIMESTAMPTZ DEFAULT now()
    );


    CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
    CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(razorpay_order_id);
  `,
};