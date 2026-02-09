import { Migration } from '../migrate';

export const cartItemsTable: Migration = {
  id: 4, 
  name: 'cart_items',
  up: `
    CREATE TABLE IF NOT EXISTS cart_items (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
      size TEXT,
      color TEXT,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );

    -- Index taaki Cart fetch karna fast ho
    CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
    
    -- Composite Index taaki same product/size/color duplicate na ho (Quantity update logic ke liye)
    CREATE UNIQUE INDEX IF NOT EXISTS idx_cart_items_unique 
    ON cart_items (user_id, product_id, size, color);
  `,
};