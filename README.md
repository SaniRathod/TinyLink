# TinyLink

This is a simple URL shortener built with Next.js (App Router), Prisma and PostgreSQL (Neon). It follows the assignment requirements.

## Quick local run

1. Install Node.js (LTS)
2. Copy `.env.example` to `.env` and set `DATABASE_URL`
3. Install:
   ```
   npm install
   npx prisma generate
   npx prisma migrate dev --name init
   npm run dev
   ```
4. Open http://localhost:3000

## Endpoints
- GET /api/links
- POST /api/links
- GET /api/links/:code
- DELETE /api/links/:code
- GET /healthz
- GET /:code  (redirect)
