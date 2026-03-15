/**
 * api/sitemap.js — Vercel Serverless Function
 * Serves /sitemap.xml — auto-generated from live database.
 */

import { sql } from '../lib/db.js';

const BASE_URL = 'https://jsowallpaper.co.ke';

export default async function handler(req, res) {
  try {
    const [{ rows: products }, { rows: categories }] = await Promise.all([
      sql`SELECT slug FROM products`,
      sql`SELECT slug FROM categories`,
    ]);

    const staticPages = ['/', '/products', '/about', '/contact'];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    staticPages.forEach(p => {
      xml += `\n  <url><loc>${BASE_URL}${p}</loc><changefreq>weekly</changefreq><priority>${p==='/'?'1.0':'0.8'}</priority></url>`;
    });
    categories.forEach(c => {
      xml += `\n  <url><loc>${BASE_URL}/products/${c.slug}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`;
    });
    products.forEach(p => {
      xml += `\n  <url><loc>${BASE_URL}/product/${p.slug}</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>`;
    });

    xml += '\n</urlset>';
    res.setHeader('Content-Type', 'application/xml');
    return res.status(200).send(xml);

  } catch (err) {
    console.error('[/sitemap.xml]', err);
    return res.status(500).send('Error generating sitemap');
  }
}
