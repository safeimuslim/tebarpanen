## Release Checklist

Checklist singkat untuk memastikan deploy ke production tetap aman dan konsisten.

## Sebelum Merge

- Jalankan `npm run check`
- Pastikan preview deployment sukses
- Pastikan migration preview sukses
- Test login di preview
- Test dashboard di preview
- Test halaman siklus budidaya di preview
- Test transaksi penjualan di preview
- Test halaman keuangan di preview
- Test halaman Analisis AI di preview

## Saat Release Production

- Merge branch yang sudah lolos preview ke `main`
- Pastikan Vercel menjalankan deploy `Production`
- Pastikan build command yang dipakai adalah `npm run vercel-build`
- Pastikan tidak ada error `prisma migrate deploy`

## Setelah Deploy Production

- Buka landing page
- Buka halaman login
- Login dengan akun aktif
- Pastikan redirect setelah login benar
- Buka dashboard
- Buka halaman siklus budidaya
- Buka salah satu detail siklus
- Buat atau edit satu data ringan yang aman diuji
- Buka halaman penjualan
- Buka halaman keuangan
- Buka halaman Analisis AI
- Test logout

## Validasi Database

- Pastikan data baru benar-benar tersimpan di production
- Pastikan `DATABASE_URL` production mengarah ke branch/database production
- Pastikan `DATABASE_URL_UNPOOLED` production terisi
- Pastikan production tidak memakai database preview atau development

## Validasi Logs

- Cek `Vercel Deployment Logs`
- Cek `Vercel Runtime Logs`
- Cek `Neon` jika ada query error atau connection issue

## Catatan Operasional

- Jangan release langsung tanpa preview
- Jangan jalankan `prisma migrate dev` di production
- Gunakan `npm run db:migrate:dev` hanya untuk local development
- Gunakan `prisma migrate deploy` melalui `npm run vercel-build` untuk preview dan production
