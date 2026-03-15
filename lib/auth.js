/**
 * lib/auth.js
 * Shared admin authentication helper.
 * Checks the X-Admin-Password request header against ADMIN_PASSWORD env var.
 */

export function isAdmin(req) {
  const supplied = req.headers['x-admin-password'] || req.query?.password;
  return supplied && supplied === process.env.ADMIN_PASSWORD;
}

export function requireAdmin(req, res) {
  if (!isAdmin(req)) {
    res.status(401).json({ error: 'Unauthorised. Incorrect admin password.' });
    return false;
  }
  return true;
}
