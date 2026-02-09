import { Migration } from '../migrate';

export const productsTable: Migration = {
  id: 3,
  name: 'create_products_table',
  up: `
    -- 1. ⚠️ Purani table ko delete karein (Taki naya structure aa sake)
    DROP TABLE IF EXISTS products CASCADE;

    -- 2. Extension ensure karein
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";

    -- 3. Nayi Table Banayein
    CREATE TABLE products (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      
      -- Basic Details
      name VARCHAR(255) NOT NULL,
      description TEXT,
      
      -- Pricing & Inventory
      price DECIMAL(10, 2) NOT NULL,
      wholesale_price DECIMAL(10, 2) DEFAULT 0,
      bulk_threshold INTEGER DEFAULT 0,
      stock INTEGER DEFAULT 0,
      
      -- Categorization
      category VARCHAR(100),
      gender VARCHAR(50),
      
      -- Images & Media
      image_url TEXT,
      images TEXT[],
      
      -- Variants
      sizes NUMERIC[],
      colors TEXT[],
      
      -- Status Flags
      is_new BOOLEAN DEFAULT false,
      is_sale BOOLEAN DEFAULT false,
      sale_percent INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT true,
      
      -- Timestamps
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );

    -- 4. Indexes create karein
    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
    CREATE INDEX IF NOT EXISTS idx_products_gender ON products(gender);
    CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
  `,
};