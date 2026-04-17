import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowRight,
  ChartColumn,
  Fish,
  Layers3,
  ReceiptText,
  Waves,
} from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Tebar Panen",
  description:
    "Aplikasi budidaya ikan untuk mencatat siklus kolam, penjualan panen, dan laporan keuangan dalam satu tempat.",
}

const valueItems = [
  {
    copy: "Pantau tebar benih, pakan, mortalitas, sampling, dan panen ikan dalam satu alur kerja yang rapi.",
    icon: Fish,
    title: "Siklus Budidaya",
  },
  {
    copy: "Catat setiap panen ikan yang dijual, pembeli, berat, harga, dan status pembayarannya.",
    icon: ReceiptText,
    title: "Penjualan Panen",
  },
  {
    copy: "Lihat pendapatan, biaya, dan hasil usaha budidaya ikan berdasarkan periode laporan.",
    icon: ChartColumn,
    title: "Laporan Keuangan",
  },
  {
    copy: "Simpan data kolam dan alat budidaya agar kebutuhan operasional harian tidak tercecer.",
    icon: Waves,
    title: "Kolam dan Alat",
  },
]

const workflowItems = [
  {
    copy: "Mulai dari data usaha budidaya ikan, kolam, dan siklus aktif tanpa setup yang rumit.",
    title: "Buat usaha dan mulai siklus kolam",
  },
  {
    copy: "Masukkan pakan, mortalitas, sampling, biaya, dan panen ikan secara bertahap sesuai kegiatan lapangan.",
    title: "Catat kegiatan harian seperlunya",
  },
  {
    copy: "Saat hasil panen ikan dijual, simpan transaksi lalu pantau laporan usaha dari data yang sudah terkumpul.",
    title: "Pantau penjualan dan hasil budidaya",
  },
]

const proofItems = [
  "Satu sistem untuk operasional budidaya ikan",
  "Lebih mudah dipakai daripada spreadsheet terpisah",
  "Data kolam, panen, dan keuangan tetap terhubung",
]

export default function HomePage() {
  return (
    <main className="relative overflow-hidden bg-[linear-gradient(180deg,#f6fbfa_0%,#edf6f5_46%,#f8fbfb_100%)]">
      <a
        aria-label="Konsultasi Gratis via WhatsApp"
        className="fixed bottom-5 left-5 z-50 inline-flex items-center gap-3 rounded-full border border-[#b8ead8] bg-[#22c55e] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(34,197,94,0.3)] transition-transform hover:-translate-y-0.5 hover:bg-[#1fb157]"
        href="https://wa.me/6282329230000?text=Hallo%2C%20saya%20mau%20konsultasi%20penggunaan%20Aplikasi%20budidaya%20ikan%20Tebar%20Panen."
        rel="noopener noreferrer"
        target="_blank"
      >
        <span className="flex size-9 items-center justify-center rounded-full bg-white/16">
          <WhatsAppLogo className="size-5" />
        </span>
        <span>Konsultasi Gratis</span>
      </a>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_top_left,#c8efe8_0%,transparent_38%),radial-gradient(circle_at_top_right,#bfdff2_0%,transparent_36%)]" />
      <div className="pointer-events-none absolute top-28 left-1/2 h-72 w-72 -translate-x-[34rem] rounded-full bg-[#0f9d8a]/10 blur-3xl" />
      <div className="pointer-events-none absolute top-16 right-0 h-80 w-80 translate-x-1/3 rounded-full bg-[#125e8a]/10 blur-3xl" />

      <header className="relative z-10">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link className="flex items-center gap-3" href="/">
            <div className="bg-primary/12 text-primary flex size-11 items-center justify-center rounded-2xl">
              <Fish className="size-5" />
            </div>
            <div>
              <p className="text-base font-semibold tracking-tight">
                Tebar Panen
              </p>
              <p className="text-muted-foreground text-xs">
                Operasional budidaya ikan yang lebih rapi
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-[#355565] md:flex">
            <a
              className="transition-colors hover:text-foreground"
              href="#fitur"
            >
              Fitur
            </a>
            <a
              className="transition-colors hover:text-foreground"
              href="#cara-kerja"
            >
              Cara Kerja
            </a>
            <a
              className="transition-colors hover:text-foreground"
              href="#mulai"
            >
              Mulai
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "hidden h-10 px-4 text-sm sm:inline-flex",
              )}
              href="/login"
            >
              Masuk
            </Link>
            <Link
              className={cn(buttonVariants(), "h-10 px-4 text-sm")}
              href="/register"
            >
              Daftarkan Farm
            </Link>
          </div>
        </div>
      </header>

      <section className="relative z-10">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 pt-10 pb-16 sm:px-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:px-8 lg:pt-16 lg:pb-24">
          <div className="max-w-2xl space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-3 py-1.5 text-sm text-[#366070] shadow-[0_10px_30px_rgba(18,94,138,0.08)] backdrop-blur">
              <Layers3 className="size-4 text-primary" />
              Pencatatan budidaya ikan yang lebih rapi
            </div>

            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-[#163042] sm:text-5xl lg:text-6xl">
                Aplikasi budidaya ikan untuk mencatat kolam, panen, dan
                penjualan.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-[#4b6473] sm:text-lg">
                Tebar Panen membantu usaha budidaya ikan mencatat siklus kolam,
                penjualan panen, dan laporan keuangan tanpa spreadsheet yang
                tercecer.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                className={cn(
                  buttonVariants(),
                  "h-11 gap-2 rounded-xl px-5 text-sm shadow-[0_14px_34px_rgba(15,157,138,0.22)]",
                )}
                href="/register"
              >
                Daftarkan Farm
                <ArrowRight className="size-4" />
              </Link>
              <Link
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "border-border/80 bg-white/80 h-11 rounded-xl px-5 text-sm backdrop-blur",
                )}
                href="#cara-kerja"
              >
                Lihat Cara Kerja
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {proofItems.map((item) => (
                <div
                  className="rounded-2xl border border-white/80 bg-white/72 px-4 py-3 text-sm text-[#355565] shadow-[0_16px_40px_rgba(22,48,66,0.06)] backdrop-blur"
                  key={item}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-x-8 top-8 h-full rounded-[2rem] bg-[linear-gradient(180deg,rgba(18,94,138,0.12),rgba(15,157,138,0.04))] blur-2xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/88 p-4 shadow-[0_28px_80px_rgba(18,94,138,0.12)] backdrop-blur">
              <div className="rounded-[1.5rem] bg-[linear-gradient(160deg,#163042_0%,#125e8a_50%,#0f9d8a_100%)] p-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-white/70">
                      Tebar Panen
                    </p>
                    <p className="mt-2 text-2xl font-semibold">
                      Dashboard Budidaya
                    </p>
                  </div>
                  <div className="rounded-full bg-white/12 px-3 py-1 text-xs">
                    Hari ini
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-sm text-white/70">Siklus Aktif</p>
                    <p className="mt-2 text-3xl font-semibold">12</p>
                    <p className="mt-2 text-sm text-white/70">
                      Semua kolam aktif lebih mudah dipantau.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-sm text-white/70">Penjualan Bulan Ini</p>
                    <p className="mt-2 text-3xl font-semibold">Rp84,5 jt</p>
                    <p className="mt-2 text-sm text-white/70">
                      Panen ikan dan penjualan langsung tercatat.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-4">
                <div className="rounded-[1.5rem] border border-[#dce9e8] bg-[#f8fbfb] p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-[#163042]">
                        Fokus operasional hari ini
                      </p>
                      <p className="mt-1 text-sm text-[#5b7483]">
                        Hal yang perlu dicek tim budidaya ikan terlihat cepat
                        dari satu layar.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-[#dce9e8] bg-white px-4 py-4">
                      <p className="text-sm text-[#5b7483]">
                        Pencatatan mortalitas
                      </p>
                      <p className="mt-2 text-3xl font-semibold text-[#163042]">
                        3
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[#5b7483]">
                        Kolam yang perlu dicatat mortalitasnya bisa langsung
                        diprioritaskan hari ini.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-[#dce9e8] bg-white px-4 py-4">
                      <p className="text-sm text-[#5b7483]">Panen terjadwal</p>
                      <p className="mt-2 text-3xl font-semibold text-[#163042]">
                        2
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[#5b7483]">
                        Jadwal panen ikan yang sudah siap jual lebih mudah
                        dipantau tim.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 rounded-[1.5rem] border border-[#dce9e8] bg-white p-5">
                  <div>
                    <p className="text-sm font-semibold text-[#163042]">
                      Aktivitas terbaru
                    </p>
                    <p className="mt-1 text-sm text-[#5b7483]">
                      Contoh alur yang biasa dicatat tim budidaya ikan setiap
                      hari.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {[
                      "Sampling kolam C-12 dicatat hari ini",
                      "Panen 10 kg terjual ke pembeli Toko Mina Jaya",
                      "Biaya pakan minggu ini sudah masuk ke laporan",
                    ].map((item, index) => (
                      <div
                        className="flex gap-3 rounded-2xl bg-[#f4f8f8] px-3 py-3"
                        key={item}
                      >
                        <div className="bg-primary text-primary-foreground flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                          {index + 1}
                        </div>
                        <p className="text-sm leading-6 text-[#355565]">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="relative z-10 border-y border-white/70 bg-white/75 backdrop-blur"
        id="fitur"
      >
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium text-primary">Fitur utama</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#163042]">
              Disusun untuk pekerjaan yang benar-benar terjadi di budidaya ikan
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#5b7483] sm:text-base">
              Bukan sekadar dashboard, tetapi alur pencatatan yang membantu
              operasional kolam dan penjualan ikan tetap rapi.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {valueItems.map((item) => (
              <article
                className="rounded-[1.75rem] border border-[#dce9e8] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbfb_100%)] p-5"
                key={item.title}
              >
                <div className="bg-secondary/10 text-secondary flex size-11 items-center justify-center rounded-2xl">
                  <item.icon className="size-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-[#163042]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-[#5b7483]">
                  {item.copy}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10" id="cara-kerja">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:px-8 lg:py-20">
          <div className="max-w-md space-y-4">
            <p className="text-sm font-medium text-primary">Cara kerja</p>
            <h2 className="text-3xl font-semibold tracking-tight text-[#163042]">
              Mulai dari tiga langkah sederhana
            </h2>
            <p className="max-w-xl text-sm leading-7 text-[#5b7483] sm:text-base">
              Tebar Panen dibuat supaya tim budidaya ikan bisa mulai cepat tanpa
              proses yang terasa berat.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {workflowItems.map((item, index) => (
              <article
                className="rounded-[1.75rem] border border-[#dce9e8] bg-white p-5 shadow-[0_16px_40px_rgba(22,48,66,0.05)]"
                key={item.title}
              >
                <div className="flex items-center gap-3">
                  {/* <div className="bg-accent text-accent-foreground flex size-10 items-center justify-center rounded-2xl text-sm font-semibold"></div> */}
                  <div className="bg-accent text-accent-foreground flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                    {index + 1}
                  </div>
                  <p className="font-semibold text-[#163042]">{item.title}</p>
                </div>
                <p className="mt-4 text-sm leading-7 text-[#5b7483]">
                  {item.copy}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 pb-16 sm:pb-20" id="mulai">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[2rem] border border-[#dce9e8] bg-[linear-gradient(135deg,#163042_0%,#125e8a_58%,#0f9d8a_100%)] px-6 py-8 text-white sm:px-8 sm:py-10 lg:flex lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-white/75">
                Mulai lebih rapi dari sekarang
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Gunakan Tebar Panen untuk menyusun data kolam, panen ikan,
                penjualan, dan laporan usaha dalam satu alur yang mudah
                dipahami.
              </h2>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:mt-0">
              <Link
                className={cn(
                  buttonVariants(),
                  "bg-white text-[#163042] hover:bg-white/90 h-11 rounded-xl px-5",
                )}
                href="/register"
              >
                Daftarkan Farm
              </Link>
              <Link
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "border-white/20 bg-white/10 text-white hover:bg-white/16 h-11 rounded-xl px-5",
                )}
                href="https://wa.me/6282329230000?text=Hallo%2C%20saya%20mau%20konsultasi%20penggunaan%20Aplikasi%20budidaya%20ikan%20Tebar%20Panen."
                rel="noopener noreferrer"
                target="_blank"
              >
                Konsultasi Gratis
              </Link>
            </div>
          </div>

          <footer className="flex flex-col gap-3 px-1 pt-6 pb-2 text-sm text-[#5b7483] sm:flex-row sm:items-center sm:justify-between">
            <p>
              Tebar Panen membantu operasional budidaya ikan jadi lebih
              sederhana dan terpusat.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                className="hover:text-foreground transition-colors"
                href="/login"
              >
                Masuk
              </Link>
              <Link
                className="hover:text-foreground transition-colors"
                href="/register"
              >
                Daftarkan Farm
              </Link>
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}

function WhatsAppLogo({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M19.05 4.94A9.86 9.86 0 0 0 12.02 2C6.55 2 2.1 6.45 2.1 11.92c0 1.75.46 3.47 1.33 4.99L2 22l5.26-1.38a9.9 9.9 0 0 0 4.75 1.21h.01c5.47 0 9.92-4.45 9.92-9.92a9.84 9.84 0 0 0-2.89-6.97Zm-7.03 15.2h-.01a8.23 8.23 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.05-.2-.31a8.24 8.24 0 0 1-1.27-4.35c0-4.55 3.71-8.26 8.28-8.26 2.2 0 4.26.85 5.82 2.42a8.17 8.17 0 0 1 2.42 5.84c0 4.56-3.71 8.26-8.25 8.26Zm4.53-6.18c-.25-.13-1.47-.72-1.7-.8-.23-.08-.39-.13-.56.13-.17.25-.64.8-.79.97-.15.17-.29.19-.54.06-.25-.13-1.05-.39-2-1.23a7.44 7.44 0 0 1-1.39-1.73c-.15-.25-.01-.38.11-.51.11-.11.25-.29.38-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.48-.4-.41-.56-.42h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.09 0 1.23.9 2.43 1.02 2.59.13.17 1.76 2.69 4.27 3.77.6.26 1.06.42 1.42.54.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.67-1.19.21-.59.21-1.09.15-1.19-.05-.1-.22-.16-.47-.29Z" />
    </svg>
  )
}
