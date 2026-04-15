import type { Metadata } from "next"

import { Toaster } from "@/components/ui/sonner"

import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "Tebar Panen",
    template: "%s | Tebar Panen",
  },
  description:
    "Sistem operasional budidaya untuk mencatat siklus, penjualan, dan laporan keuangan dalam satu tempat.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col" cz-shortcut-listen="true">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
