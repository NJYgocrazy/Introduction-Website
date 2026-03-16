# Lab Website (Vue + NestJS + MySQL)

This repo contains:

- `server/`: NestJS REST API + Prisma (MySQL), admin auth, CRUD, uploads
- `web/`: Vue 3 + Vite, multi-page routes, bilingual (zh/en), admin panel

## Local Development

### 1) Start MySQL

```powershell
docker compose up -d
```

If `3306` is occupied on your machine, this repo maps Docker MySQL to host port `3307`.

### 2) Configure server

Copy `server/.env.example` to `server/.env` and adjust if needed.

### 3) Install deps

```powershell
npm install
```

### 4) Initialize DB

```powershell
npm run db:migrate
npm run db:seed
```

If `db:migrate` fails with shadow DB permission, use:

```powershell
cd server
npx prisma db push
npm run prisma:seed
```

### 5) Run dev

```powershell
npm run dev
```

- Web: `http://localhost:5173`
- API: `http://localhost:3000`
- Adminer: `http://localhost:8080` (DB GUI)

## Cloud Deploy (Vercel + Render)

This is the recommended no-server setup:

- Frontend: Vercel (`web`)
- Backend: Render Web Service (`server`)
- Database: Render MySQL (or any managed MySQL compatible with Prisma)

### 1) Push code to GitHub

Vercel and Render both deploy from your GitHub repo.

### 2) Deploy database on Render

Create a MySQL instance on Render and copy its **Internal Database URL**.

### 3) Deploy backend on Render

Option A (recommended): use this repo's `render.yaml` Blueprint.

- In Render, choose **Blueprint** and connect this repo.
- It creates one web service `labsite-api` with build/start commands already set.

Option B (manual Web Service settings):

- Build Command: `npm install --include=dev && npm --workspace server run build`
- Start Command: `npm --workspace server run start`

Set env vars in Render service:

- `DATABASE_URL=<your-render-mysql-internal-url>`
- `JWT_SECRET=<strong-random-secret>`
- `WEB_ORIGIN=https://<your-vercel-domain>.vercel.app`
- `UPLOAD_DIR=uploads`
- `NODE_ENV=production`

After first successful deploy, open Render Shell and run:

```bash
cd server
npx prisma db push
npm run prisma:seed
```

### 4) Deploy frontend on Vercel

- Import same GitHub repo in Vercel
- Framework: `Vite`
- Root Directory: `web`
- Environment Variable:
  - `VITE_API_BASE_URL=https://<your-render-service>.onrender.com`

`web/vercel.json` already includes SPA rewrite for Vue history routes.

### 5) Verify

- Backend health: `https://<render-service>.onrender.com/public/lab-profile`
- Frontend: `https://<vercel-project>.vercel.app`
- Admin login: `https://<vercel-project>.vercel.app/admin/login`

## Production Deploy (Ubuntu, Docker Compose, IP + HTTP)

### 1) Server prerequisites

Install Docker + Compose plugin and open port `80` on firewall/security group.

### 2) Pull project and set env

```bash
git clone <your-repo-url>
cd introduction-website
```

Set production secrets before start:

```bash
export JWT_SECRET='replace-with-a-strong-secret'
export WEB_ORIGIN='http://<your-public-ip>'
```

### 3) Build and start containers

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

### 4) Initialize database (first deploy only)

```bash
docker compose -f docker-compose.prod.yml exec server npx prisma db push
docker compose -f docker-compose.prod.yml exec server npm run prisma:seed
```

### 5) Verify

```bash
docker compose -f docker-compose.prod.yml ps
curl http://<your-public-ip>/api/public/lab-profile
```

Open in browser:

- Web: `http://<your-public-ip>`
- API example: `http://<your-public-ip>/api/public/people`

## HTTPS Upgrade (when domain is ready)

1. Point domain A record to server public IP.
2. Add Nginx reverse proxy with certbot on host (or edge gateway).
3. Configure HTTP -> HTTPS redirect.
4. Keep `/api` reverse proxy to backend unchanged.
5. Enable auto-renew (`certbot renew` via cron/systemd timer).

## Notes

- Render free instances may cold start on first request.
- Upload files are stored on local service disk now. For long-term stability, migrate uploads to object storage (Cloudinary/S3/OSS).

## Admin Login (seed)

- Username: `admin`
- Password: `admin123`
