/**
 * lib/setup.js
 * Runs at deploy time (see vercel.json "buildCommand").
 * Only ensures database tables exist — never inserts or overwrites
 * any product/category data. Safe to run on every deployment.
 */

import { ensureTables } from './db.js';

async function main() {
  await ensureTables();
  console.log('✅ Tables verified — no sample data touched.');
}

main().catch((err) => {
  console.error('❌ Setup failed:', err);
  process.exit(1);
});
