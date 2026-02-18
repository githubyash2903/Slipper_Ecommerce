import { Migration } from '../migrate';

// Ek NAYI migration entry add karein
export const fixMissingTaxes: Migration = {
  id: 11, // Naya ID zaroori hai tabhi yeh run hoga
  name: 'emergency_fix_taxes_column',
  up: `
    ALTER TABLE orders 
    ADD COLUMN IF NOT EXISTS taxes DECIMAL(10, 2) DEFAULT 0;
  `,
};