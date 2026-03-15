/**
 * api/enquiries.js — Vercel Serverless Function
 *
 * POST  /api/enquiries          — submit new enquiry (public)
 * GET   /api/enquiries          — list all enquiries (admin)
 * PATCH /api/enquiries?id=xxx   — update status: new → read → done (admin)
 */

import { sql }              from '../lib/db.js';
import { requireAdmin }     from '../lib/auth.js';
import { sendEnquiryEmail } from '../lib/mailer.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Password');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {

    /* ── POST — new enquiry ── */
    if (req.method === 'POST') {
      const { name, email, phone, service, message } = req.body;
      if (!name || !email)
        return res.status(400).json({ error: 'name and email are required' });

      // Save to DB
      const { rows } = await sql`
        INSERT INTO enquiries (name, email, phone, service, message)
        VALUES (${name}, ${email}, ${phone||null}, ${service}, ${message})
        RETURNING id
      `;

      // Send email notification (non-blocking — we don't fail the request if email fails)
      sendEnquiryEmail({ name, email, phone, service, message })
        .catch(err => console.warn('Email send failed (non-fatal):', err.message));

      // Build a WhatsApp pre-fill link so owner can reply instantly
      const waText = encodeURIComponent(
        `🏠 *New JSO Enquiry*\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone||'N/A'}\nService: ${service}\n\nMessage:\n${message}`
      );

      return res.status(201).json({
        success: true,
        id: rows[0].id,
        message: 'Enquiry received. We will be in touch within 24 hours.',
        whatsapp_notify: `https://wa.me/254726729794?text=${waText}`,
      });
    }

    /* ── GET — list enquiries (admin only) ── */
    if (req.method === 'GET') {
      if (!requireAdmin(req, res)) return;
      const { status } = req.query;

      const { rows } = status
        ? await sql`SELECT * FROM enquiries WHERE status = ${status} ORDER BY created_at DESC`
        : await sql`SELECT * FROM enquiries ORDER BY created_at DESC`;

      return res.json({ success: true, data: rows, total: rows.length });
    }

    /* ── PATCH — update status ── */
    if (req.method === 'PATCH') {
      if (!requireAdmin(req, res)) return;
      const { id } = req.query;
      const { status } = req.body;
      if (!id || !status) return res.status(400).json({ error: 'id and status required' });

      await sql`UPDATE enquiries SET status = ${status} WHERE id = ${id}`;
      return res.json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (err) {
    console.error('[/api/enquiries]', err);
    return res.status(500).json({ error: 'Internal server error', detail: err.message });
  }
}
