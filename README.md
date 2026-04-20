## Tebar Panen

Aplikasi operasional budidaya ikan berbasis Next.js untuk mencatat siklus budidaya, mortalitas, pakan, penjualan panen, dan laporan usaha.

## Stack

- Next.js 16
- Prisma 7
- PostgreSQL
- NextAuth credentials
- Vercel
- Neon

## Environment

Salin `.env.example` ke `.env` untuk local development.

```bash
cp .env.example .env
```

Minimal variabel yang harus diisi:

```bash
DATABASE_URL="postgresql://..."
DATABASE_URL_UNPOOLED="postgresql://..."
AUTH_SECRET="secret-yang-panjang-dan-aman"
OPENAI_API_KEY=""
OPENAI_MODEL="gpt-4o-mini"
```

Catatan:

- `DATABASE_URL` dipakai runtime aplikasi.
- `DATABASE_URL_UNPOOLED` dipakai Prisma CLI untuk migration.
- `OPENAI_API_KEY` bersifat opsional.

## Development

Install dependency lalu jalankan server:

```bash
npm install
npm run dev
```

Perintah database yang umum:

```bash
npm run db:generate
npm run db:migrate:dev
npm run db:studio
```

## Struktur Environment Neon + Vercel

Disarankan memakai 3 lingkungan terpisah:

- `Development`
  - Vercel environment: `Development`
  - Neon branch: `dev` atau `vercel-dev`
- `Preview`
  - Vercel environment: `Preview`
  - Neon preview branch otomatis per deployment/PR
- `Production`
  - Vercel environment: `Production`
  - Neon branch: `main` atau `prod`

Jangan pernah memakai branch/database production untuk preview atau local development.

## Setup Vercel + Neon

1. Hubungkan repository ke Vercel.
2. Pasang integrasi Neon ke project Vercel.
3. Pastikan Vercel menerima environment variables berikut:
   - `DATABASE_URL`
   - `DATABASE_URL_UNPOOLED`
   - `AUTH_SECRET`
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL`
4. Aktifkan preview branching di Neon untuk environment `Preview`.
5. Buat `AUTH_SECRET` yang berbeda untuk:
   - Development
   - Preview
   - Production

## Release Flow

### 1. Development

Saat mengubah schema Prisma:

```bash
npm run db:migrate:dev
```

Commit juga folder `prisma/migrations`.

### 2. Preview

Setiap push ke branch/PR:

- Vercel membuat preview deployment
- Neon membuat branch preview terpisah
- aplikasi menjalankan migration ke branch preview tersebut

### 3. Production

Saat merge ke branch production:

- Vercel deploy ke environment `Production`
- migration dijalankan dengan `prisma migrate deploy`
- aplikasi build dan start dengan schema terbaru

Perintah yang dipakai untuk build production:

```bash
npm run vercel-build
```

## Vercel Build Command

Set build command di Vercel menjadi:

```bash
npm run vercel-build
```

Script ini akan menjalankan:

1. `prisma generate`
2. `prisma migrate deploy`
3. `next build --webpack`

## Checklist Sebelum Production

- `DATABASE_URL` production mengarah ke branch/database production
- `DATABASE_URL_UNPOOLED` production sudah terisi
- `AUTH_SECRET` production berbeda dari preview dan development
- migration Prisma sudah committed
- preview deployment sudah lolos test
- login, pembuatan siklus, penjualan, dan analisis AI sudah diuji di preview

## Catatan Keamanan

- Jangan simpan API key asli di `.env.example`.
- Jika pernah ada key asli yang tercommit, segera rotate key tersebut.
- Jangan gunakan data production sebagai sumber preview jika datanya sensitif.
