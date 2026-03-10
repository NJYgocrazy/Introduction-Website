# Lab Website (Vue + NestJS + MySQL)

This repo contains:

- `server/`: NestJS REST API + Prisma (MySQL), admin auth, CRUD, uploads
- `web/`: Vue 3 + Vite, multi-page routes, bilingual (zh/en), admin panel

## Quick Start

### 1) Start MySQL

```powershell
docker compose up -d
```

If you already have MySQL running on your machine and `3306` is occupied, this repo maps Docker MySQL to host port `3307`.

### 2) Configure server

Copy `server/.env.example` to `server/.env` and adjust if needed.

### 3) Install deps

```powershell
npm install
```

### 4) Migrate + seed

```powershell
npm run db:migrate
npm run db:seed
```

### 5) Run dev

```powershell
npm run dev
```

- Web: `http://localhost:5173`
- API: `http://localhost:3000`
- Adminer: `http://localhost:8080` (DB GUI)

## Admin Login (seed)

- Username: `admin`
- Password: `admin123`
