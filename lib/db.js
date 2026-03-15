/**
 * lib/db.js
 * Shared database helpers using @vercel/postgres (Neon serverless Postgres).
 * Every serverless function imports { query, getClient } from here.
 *
 * CONNECTION:  set POSTGRES_URL in Vercel environment variables.
 *              Vercel creates this automatically when you add a Postgres store
 *              in the Vercel dashboard (Storage → Create → Postgres).
 */

import { sql } from '@vercel/postgres';

// Re-export the tagged-template helper so functions can write:
//   import { sql } from '../lib/db.js';
//   const { rows } = await sql`SELECT * FROM products`;
export { sql };

/**
 * Ensure all tables exist.
 * Called once by lib/seed.js at deploy time (buildCommand in vercel.json).
 */
export async function ensureTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS categories (
      id           SERIAL PRIMARY KEY,
      name         TEXT    NOT NULL,
      slug         TEXT    UNIQUE NOT NULL,
      description  TEXT,
      seo_title    TEXT,
      seo_desc     TEXT,
      seo_keywords TEXT,
      icon         TEXT,
      sort_order   INTEGER DEFAULT 0,
      created_at   TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id            SERIAL PRIMARY KEY,
      name          TEXT    NOT NULL,
      slug          TEXT    UNIQUE NOT NULL,
      category_slug TEXT    NOT NULL,
      description   TEXT,
      price         NUMERIC,
      price_label   TEXT,
      unit          TEXT    DEFAULT 'per item',
      image         TEXT,
      badge         TEXT,
      in_stock      INTEGER DEFAULT 1,
      featured      INTEGER DEFAULT 0,
      seo_title     TEXT,
      seo_desc      TEXT,
      seo_keywords  TEXT,
      created_at    TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS enquiries (
      id         SERIAL PRIMARY KEY,
      name       TEXT,
      email      TEXT,
      phone      TEXT,
      service    TEXT,
      message    TEXT,
      status     TEXT DEFAULT 'new',
      source     TEXT DEFAULT 'website',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}
