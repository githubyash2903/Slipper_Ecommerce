import { Migration } from '../migrate';

export const wishlistTable: Migration = {
  id: 6, 
  name: 'create_wishlist_table',
  up: `
    CREATE TABLE IF NOT EXISTS wishlist (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ DEFAULT now(),
      
      -- Constraint: User can't add same product twice
      UNIQUE(user_id, product_id)
    );

    CREATE INDEX IF NOT EXISTS idx_wishlist_user ON wishlist(user_id);
  `,
};