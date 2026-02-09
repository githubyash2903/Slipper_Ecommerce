import { Migration } from '../migrate';

export const userProfileMigration: Migration = {
  id: 2, 
  name: 'user_profile_tables',
  up: `
    -- 1. Add avatar_url to users table
    ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;

    -- 2. Create Addresses Table
    CREATE TABLE IF NOT EXISTS addresses (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(50) NOT NULL, -- e.g., 'Home', 'Work'
      street TEXT NOT NULL,
      city VARCHAR(100) NOT NULL,
      state VARCHAR(100) NOT NULL,
      zip_code VARCHAR(20) NOT NULL,
      country VARCHAR(100) DEFAULT 'India',
      is_default BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT now()
    );

    -- 3. Create Orders Table
    CREATE TABLE IF NOT EXISTS orders (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      total_amount DECIMAL(10, 2) NOT NULL,
      status VARCHAR(20) CHECK (status IN ('processing', 'shipped', 'delivered', 'cancelled')),
      item_count INT DEFAULT 1,
      created_at TIMESTAMPTZ DEFAULT now()
    );

    -- 4. Create Indexes for performance
    CREATE INDEX IF NOT EXISTS idx_addresses_user ON addresses(user_id);
    CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
  `,
};