import type { Metadata } from "next"

import { getSiteUrl } from "@/app/lib/site-url"
import { Toaster } from "@/components/ui/sonner"

import "./globals.css"

const metadataBase = getSiteUrl()

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: "Tebar Panen",
    template: "%s",
  },
  description:
    "Rapikan pencatatan budidaya ikan dari kolam hingga penjualan panen dalam satu aplikasi.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="flex min-h-full flex-col" cz-shortcut-listen="true">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
