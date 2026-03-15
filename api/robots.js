export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.send(`User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: https://jsowallpaper.co.ke/sitemap.xml`);
}
