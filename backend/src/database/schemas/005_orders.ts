import { Migration } from '../migrate';

export const ordersTable: Migration = {
  id: 5,
  name: 'orders_and_items',
  up: `
    -- 1. Create Orders Table
    CREATE TABLE IF NOT EXISTS orders (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      
      -- Payment & Amount Details
      taxes DECIMAL(10, 2) DEFAULT 0,
      total_amount DECIMAL(10, 2) NOT NULL,
      payment_method VARCHAR(50) DEFAULT 'COD', -- COD, STRIPE, UPI
      payment_status VARCHAR(50) DEFAULT 'pending', -- pending, paid, failed
      
      -- Order Status
      status VARCHAR(50) DEFAULT 'pending', -- pending, processing, shipped, delivered, cancelled
      
      -- Address Snapshot (Hum address JSON me save karenge taaki user baad me address change kare toh purane order par asar na pade)
      shipping_address JSONB NOT NULL,
      
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );

    -- 2. Create Order Items Table (Details of what was bought)
    CREATE TABLE IF NOT EXISTS order_items (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id UUID NOT NULL REFERENCES products(id),
      
      quantity INTEGER NOT NULL,
      price DECIMAL(10, 2) NOT NULL, 
      size VARCHAR(20) NOT NULL,
      color VARCHAR(50) NOT NULL,
      
      created_at TIMESTAMPTZ DEFAULT now()
    );

    -- Indexes for faster queries
    CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
    CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
  `,
};