/**
 * api/categories.js — Vercel Serverless Function
 *
 * GET  /api/categories          — all categories ordered by sort_order
 * GET  /api/categories?slug=xxx — single category
 */

import { sql } from '../lib/db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'GET')
    return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { slug } = req.query;

    if (slug) {
      const { rows } = await sql`SELECT * FROM categories WHERE slug = ${slug}`;
      if (!rows.length) return res.status(404).json({ error: 'Category not found' });
      return res.json({ success: true, data: rows[0] });
    }

    const { rows } = await sql`SELECT * FROM categories ORDER BY sort_order`;
    return res.json({ success: true, data: rows });

  } catch (err) {
    console.error('[/api/categories]', err);
    return res.status(500).json({ error: 'Internal server error', detail: err.message });
  }
}
