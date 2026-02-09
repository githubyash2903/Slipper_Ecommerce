import { Migration } from '../migrate';

export const usersTable: Migration = {
  id: 1,
  name: 'users',
  up: `
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone_country_code VARCHAR(5) NOT NULL,
      phone_number VARCHAR(15) NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('USER', 'ADMIN')),
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now(),
      UNIQUE (phone_country_code, phone_number)
    );

    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  `,
};
