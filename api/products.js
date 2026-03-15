/**
 * api/products.js — Vercel Serverless Function
 *
 * Routes handled (via vercel.json):
 *   GET    /api/products                  — list all (filter: ?category= &featured=1 &search= &page= &limit=)
 *   GET    /api/products?slug=xxx         — single product by slug
 *   POST   /api/products                  — create product (admin)
 *   PUT    /api/products?id=xxx           — update product (admin)
 *   PATCH  /api/products?id=xxx           — quick update badge/stock (admin)
 *   DELETE /api/products?id=xxx           — delete product (admin)
 */

import { sql }        from '../lib/db.js';
import { requireAdmin } from '../lib/auth.js';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Password');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    /* ── GET ── */
    if (req.method === 'GET') {
      const { slug, category, featured, search, page = '1', limit = '40' } = req.query;

      // Single product by slug
      if (slug) {
        const { rows } = await sql`SELECT * FROM products WHERE slug = ${slug}`;
        if (!rows.length) return res.status(404).json({ error: 'Product not found' });
        return res.json({ success: true, data: rows[0] });
      }

      // Build filtered list — @vercel/postgres doesn't support dynamic WHERE,
      // so we fetch all matching and handle search in JS for simplicity.
      let { rows } = featured
        ? await sql`SELECT * FROM products WHERE featured = 1 ORDER BY created_at DESC LIMIT ${parseInt(limit)} OFFSET ${(parseInt(page)-1)*parseInt(limit)}`
        : category
        ? await sql`SELECT * FROM products WHERE category_slug = ${category} ORDER BY featured DESC, created_at DESC LIMIT ${parseInt(limit)} OFFSET ${(parseInt(page)-1)*parseInt(limit)}`
        : await sql`SELECT * FROM products ORDER BY featured DESC, created_at DESC LIMIT ${parseInt(limit)} OFFSET ${(parseInt(page)-1)*parseInt(limit)}`;

      if (search) {
        const q = search.toLowerCase();
        rows = rows.filter(p =>
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.seo_keywords?.toLowerCase().includes(q)
        );
      }

      return res.json({ success: true, data: rows, page: parseInt(page), limit: parseInt(limit) });
    }

    /* ── POST (create) ── */
    if (req.method === 'POST') {
      if (!requireAdmin(req, res)) return;
      const {
        name, category_slug, description, price, price_label,
        unit, image, badge, in_stock, featured,
        seo_title, seo_desc, seo_keywords
      } = req.body;

      if (!name || !category_slug)
        return res.status(400).json({ error: 'name and category_slug are required' });

      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      const { rows } = await sql`
        INSERT INTO products
          (name, slug, category_slug, description, price, price_label, unit,
           image, badge, in_stock, featured, seo_title, seo_desc, seo_keywords)
        VALUES
          (${name}, ${slug}, ${category_slug}, ${description}, ${price||null},
           ${price_label}, ${unit||'per item'}, ${image||null}, ${badge||null},
           ${in_stock??1}, ${featured??0}, ${seo_title}, ${seo_desc}, ${seo_keywords})
        ON CONFLICT (slug) DO NOTHING
        RETURNING id, slug
      `;

      if (!rows.length)
        return res.status(409).json({ error: 'A product with this slug already exists.' });

      return res.status(201).json({ success: true, id: rows[0].id, slug: rows[0].slug });
    }

    /* ── PUT (full update) ── */
    if (req.method === 'PUT') {
      if (!requireAdmin(req, res)) return;
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'id query param required' });

      const {
        name, category_slug, description, price, price_label,
        unit, image, badge, in_stock, featured,
        seo_title, seo_desc, seo_keywords
      } = req.body;

      await sql`
        UPDATE products SET
          name          = ${name},
          category_slug = ${category_slug},
          description   = ${description},
          price         = ${price||null},
          price_label   = ${price_label},
          unit          = ${unit},
          image         = ${image||null},
          badge         = ${badge||null},
          in_stock      = ${in_stock},
          featured      = ${featured},
          seo_title     = ${seo_title},
          seo_desc      = ${seo_desc},
          seo_keywords  = ${seo_keywords}
        WHERE id = ${id}
      `;
      return res.json({ success: true });
    }

    /* ── PATCH (quick field update) ── */
    if (req.method === 'PATCH') {
      if (!requireAdmin(req, res)) return;
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'id query param required' });

      const { in_stock, featured, badge, price_label } = req.body;
      // Only update fields that were actually sent
      if (in_stock   !== undefined) await sql`UPDATE products SET in_stock    = ${in_stock}    WHERE id = ${id}`;
      if (featured   !== undefined) await sql`UPDATE products SET featured    = ${featured}    WHERE id = ${id}`;
      if (badge      !== undefined) await sql`UPDATE products SET badge       = ${badge}       WHERE id = ${id}`;
      if (price_label!== undefined) await sql`UPDATE products SET price_label = ${price_label} WHERE id = ${id}`;

      return res.json({ success: true });
    }

    /* ── DELETE ── */
    if (req.method === 'DELETE') {
      if (!requireAdmin(req, res)) return;
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'id query param required' });

      await sql`DELETE FROM products WHERE id = ${id}`;
      return res.json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (err) {
    console.error('[/api/products]', err);
    return res.status(500).json({ error: 'Internal server error', detail: err.message });
  }
}
