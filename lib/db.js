/**
 * lib/db.js
 * Shared database helpers using @neondatabase/serverless directly
 * (bypasses @vercel/postgres, which was failing to bundle correctly).
 */

import { neon } from '@neondatabase/serverless';

const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL_UNPOOLED;

const rawSql = neon(connectionString);

// Wrap so every call still returns { rows } just like before —
// this means no other file in the project needs to change.
export async function sql(strings, ...values) {
  const rows = await rawSql(strings, ...values);
  return { rows, rowCount: rows.length };
}

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
