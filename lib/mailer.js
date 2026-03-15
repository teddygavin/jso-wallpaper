/**
 * lib/mailer.js
 * Sends email notifications using Nodemailer + Gmail (or any SMTP).
 *
 * Required env vars:
 *   EMAIL_USER   — your Gmail address, e.g. hello@jsowallpaper.co.ke
 *   EMAIL_PASS   — Gmail App Password (not your normal Gmail password)
 *   EMAIL_TO     — address that receives enquiry notifications
 *
 * To create a Gmail App Password:
 *   Google Account → Security → 2-Step Verification → App passwords
 */

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * sendEnquiryEmail({ name, email, phone, service, message })
 * Sends a notification email to EMAIL_TO when a new enquiry arrives.
 */
export async function sendEnquiryEmail({ name, email, phone, service, message }) {
  const waText = encodeURIComponent(
    `🏠 *New JSO Enquiry*\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nService: ${service}\n\nMessage:\n${message}`
  );
  const waLink = `https://wa.me/254726729794?text=${waText}`;

  await transporter.sendMail({
    from:    `"JSO Website" <${process.env.EMAIL_USER}>`,
    to:      process.env.EMAIL_TO,
    subject: `New Enquiry from ${name} — ${service}`,
    html: `
      <h2 style="color:#C0392B">New Enquiry — J.S.O Wallpaper & Interiors</h2>
      <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;width:100%">
        <tr><td style="padding:8px;color:#666;width:120px">Name</td><td style="padding:8px"><strong>${name}</strong></td></tr>
        <tr><td style="padding:8px;color:#666">Email</td><td style="padding:8px">${email}</td></tr>
        <tr><td style="padding:8px;color:#666">Phone</td><td style="padding:8px">${phone || '—'}</td></tr>
        <tr><td style="padding:8px;color:#666">Service</td><td style="padding:8px">${service}</td></tr>
        <tr><td style="padding:8px;color:#666;vertical-align:top">Message</td><td style="padding:8px">${message}</td></tr>
      </table>
      <p style="margin-top:24px">
        <a href="${waLink}" style="background:#25D366;color:#fff;padding:12px 24px;text-decoration:none;font-family:sans-serif;font-size:14px">
          Reply on WhatsApp
        </a>
      </p>
    `,
  });
}
