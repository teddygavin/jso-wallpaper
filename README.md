# J.S.O Wallpaper & Interiors — Vercel Deployment

## 📁 Project Structure
```
jso-vercel/
├── api/
│   ├── products.js       ← Serverless: GET/POST/PUT/PATCH/DELETE products
│   ├── categories.js     ← Serverless: GET categories
│   ├── enquiries.js      ← Serverless: POST enquiry + email notification
│   ├── upload.js         ← Serverless: upload image to Cloudinary
│   ├── sitemap.js        ← Serverless: /sitemap.xml
│   └── robots.js         ← Serverless: /robots.txt
├── lib/
│   ├── db.js             ← Vercel Postgres connection + table creation
│   ├── seed.js           ← Seeds categories & products (runs at deploy)
│   ├── auth.js           ← Admin password check
│   ├── cloudinary.js     ← Cloudinary client config
│   └── mailer.js         ← Nodemailer email helper
├── public/
│   ├── index.html        ← Full SEO-optimised frontend
│   └── admin.html        ← Admin panel
├── .env.example          ← Template — copy to .env.local, never push to GitHub
├── .gitignore
├── package.json
└── vercel.json           ← Vercel routing + env var references
```

---

## 🚀 Step-by-step: GitHub → Vercel

### Step 1 — Push to GitHub
```bash
# In your terminal, inside the jso-vercel folder:
git init
git add .
git commit -m "Initial commit — JSO Wallpaper & Interiors"

# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/jso-wallpaper.git
git branch -M main
git push -u origin main
```

### Step 2 — Create a Vercel account
Go to vercel.com → sign up with GitHub.

### Step 3 — Import the GitHub repo into Vercel
Vercel Dashboard → Add New → Project → Import Git Repository → select jso-wallpaper.

### Step 4 — Add Vercel Postgres database
Vercel Dashboard → Storage → Create → Postgres (Neon).
Name it `jso-db`. Vercel will automatically add `POSTGRES_URL` to your project.

### Step 5 — Set Environment Variables in Vercel
Vercel Project → Settings → Environment Variables. Add each one:

| Variable                 | Where to get it                              |
|--------------------------|----------------------------------------------|
| `POSTGRES_URL`           | Auto-added by Vercel Postgres (Step 4)        |
| `CLOUDINARY_CLOUD_NAME`  | cloudinary.com → Dashboard                   |
| `CLOUDINARY_API_KEY`     | cloudinary.com → Dashboard                   |
| `CLOUDINARY_API_SECRET`  | cloudinary.com → Dashboard                   |
| `EMAIL_USER`             | Your Gmail address                           |
| `EMAIL_PASS`             | Gmail App Password (not your normal password)|
| `EMAIL_TO`               | Email to receive enquiry notifications       |
| `ADMIN_PASSWORD`         | Choose any strong password                   |

### Step 6 — Deploy
Click Deploy in Vercel. It will:
1. Install dependencies (`npm install`)
2. Run `node lib/seed.js` (creates tables + seeds all products)
3. Deploy all serverless functions
4. Serve `public/index.html` for all other routes

### Step 7 — Connect your domain
Vercel Project → Settings → Domains → Add `jsowallpaper.co.ke`.
Update your domain registrar's nameservers to the 4 Vercel nameservers shown.

---

## 🔑 Environment Variables — local development

```bash
cp .env.example .env.local
# Fill in your real values, then:
npm run dev    # starts local Vercel dev server at localhost:3000
```

---

## 📡 API Quick Reference

| Method | URL                                | Auth    | Description            |
|--------|------------------------------------|---------|------------------------|
| GET    | /api/products                      | Public  | All products           |
| GET    | /api/products?category=wallpapers  | Public  | Filter by category     |
| GET    | /api/products?slug=xxx             | Public  | Single product         |
| POST   | /api/products                      | Admin   | Create product         |
| PUT    | /api/products?id=1                 | Admin   | Update product         |
| DELETE | /api/products?id=1                 | Admin   | Delete product         |
| GET    | /api/categories                    | Public  | All categories         |
| POST   | /api/enquiries                     | Public  | Submit enquiry         |
| GET    | /api/enquiries                     | Admin   | List all enquiries     |
| POST   | /api/upload                        | Admin   | Upload image           |

**Admin auth:** Send header `X-Admin-Password: your_password` with protected requests.
