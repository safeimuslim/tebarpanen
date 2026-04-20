export { auth as proxy } from "@/auth"

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/keuangan/:path*",
    "/kolam/:path*",
    "/alat/:path*",
    "/analisis-ai/:path*",
    "/transaksi-panen/:path*",
    "/siklus-budidaya/:path*",
    "/pakan/:path*",
    "/sampling/:path*",
    "/kualitas-air/:path*",
    "/mortalitas/:path*",
    "/pengobatan/:path*",
    "/biaya/:path*",
    "/panen/:path*",
    "/laporan/:path*",
    "/profile/:path*",
    "/pengaturan/:path*",
  ],
}
