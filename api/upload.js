/**
 * api/upload.js — Vercel Serverless Function
 *
 * POST /api/upload
 * Accepts a base64-encoded image in the request body and uploads it to Cloudinary.
 * Returns the secure Cloudinary URL to store in the products table.
 *
 * Request body (JSON):
 *   { "image": "data:image/jpeg;base64,/9j/4AAQ...", "folder": "jso_products" }
 *
 * Note: Vercel serverless functions do not support multipart/form-data natively
 * (no filesystem). We receive images as base64 strings instead.
 * The admin panel encodes the file to base64 before sending.
 *
 * Required env vars:
 *   CLOUDINARY_CLOUD_NAME
 *   CLOUDINARY_API_KEY
 *   CLOUDINARY_API_SECRET
 */

import cloudinary from '../lib/cloudinary.js';
import { requireAdmin } from '../lib/auth.js';

// Tell Vercel not to parse the body automatically — we handle it
export const config = {
  api: { bodyParser: { sizeLimit: '10mb' } },
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Password');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Method not allowed' });

  if (!requireAdmin(req, res)) return;

  try {
    const { image, folder = 'jso_products' } = req.body;

    if (!image) return res.status(400).json({ error: 'image (base64) is required' });

    const result = await cloudinary.uploader.upload(image, {
      folder,
      transformation: [{ width: 1200, crop: 'limit' }],
      resource_type: 'image',
    });

    return res.status(201).json({
      success:   true,
      url:       result.secure_url,     // store this in products.image
      public_id: result.public_id,
      width:     result.width,
      height:    result.height,
    });

  } catch (err) {
    console.error('[/api/upload]', err);
    return res.status(500).json({ error: 'Upload failed', detail: err.message });
  }
}
