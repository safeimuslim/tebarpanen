export { auth as proxy } from "@/auth"

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/kolam/:path*",
    "/alat/:path*",
    "/siklus-budidaya/:path*",
    "/pakan/:path*",
    "/sampling/:path*",
    "/kualitas-air/:path*",
    "/mortalitas/:path*",
    "/pengobatan/:path*",
    "/biaya/:path*",
    "/panen/:path*",
    "/laporan/:path*",
    "/pengaturan/:path*",
  ],
}
