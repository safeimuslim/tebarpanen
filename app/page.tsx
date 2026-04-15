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
    "Catat budidaya, penjualan, dan keuangan dalam satu tempat untuk operasional farm yang lebih rapi.",
}

const featureItems = [
  {
    copy: "Pantau perjalanan budidaya dari awal sampai panen.",
    icon: Fish,
    title: "Siklus Budidaya",
  },
  {
    copy: "Catat hasil panen yang dijual dan status pembayarannya.",
    icon: ReceiptText,
    title: "Penjualan",
  },
  {
    copy: "Lihat pendapatan dan biaya dengan lebih ringkas.",
    icon: ChartColumn,
    title: "Keuangan",
  },
  {
    copy: "Simpan data aset farm dalam satu sistem.",
    icon: Waves,
    title: "Kolam dan Alat",
  },
]

const workflowItems = [
  "Buat farm dan mulai siklus budidaya",
  "Catat operasional harian",
  "Simpan hasil penjualan",
  "Pantau laporan usaha",
]

const highlightItems = [
  "Kelola siklus budidaya dengan lebih jelas",
  "Catat pakan, mortalitas, sampling, dan biaya",
  "Simpan hasil penjualan langsung per siklus",
  "Lihat laporan keuangan berdasarkan periode",
]

export default function HomePage() {
  return (
    <main className="relative overflow-hidden bg-[linear-gradient(180deg,#f6fbfa_0%,#edf6f5_46%,#f8fbfb_100%)]">
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
              <p className="text-base font-semibold tracking-tight">Tebar Panen</p>
              <p className="text-muted-foreground text-xs">
                Operasional budidaya yang lebih rapi
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-[#355565] md:flex">
            <a className="transition-colors hover:text-foreground" href="#fitur">
              Fitur
            </a>
            <a className="transition-colors hover:text-foreground" href="#cara-kerja">
              Cara Kerja
            </a>
            <a className="transition-colors hover:text-foreground" href="#tentang">
              Tentang
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
            <Link className={cn(buttonVariants(), "h-10 px-4 text-sm")} href="/register">
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
              Operasional budidaya yang lebih rapi
            </div>

            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-[#163042] sm:text-5xl lg:text-6xl">
                Catat budidaya, penjualan, dan keuangan dalam satu tempat.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-[#4b6473] sm:text-lg">
                Tebar Panen membantu farm mengelola siklus budidaya, hasil
                penjualan, dan laporan usaha dengan lebih mudah.
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
                href="/login"
              >
                Masuk
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {highlightItems.map((item) => (
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
                    <p className="mt-2 text-2xl font-semibold">Dashboard Farm</p>
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
                      Semua siklus lebih mudah dipantau.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-sm text-white/70">Penjualan Bulan Ini</p>
                    <p className="mt-2 text-3xl font-semibold">Rp84,5 jt</p>
                    <p className="mt-2 text-sm text-white/70">
                      Panen dan penjualan langsung tercatat.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-4">
                <div className="rounded-[1.5rem] border border-[#dce9e8] bg-[#f8fbfb] p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[#163042]">
                        Semua data penting, lebih mudah dipantau
                      </p>
                      <p className="mt-1 text-sm text-[#5b7483]">
                        Alur sederhana untuk kegiatan budidaya harian.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {featureItems.map((item) => (
                      <div
                        className="rounded-2xl border border-[#dce9e8] bg-white px-4 py-4"
                        key={item.title}
                      >
                        <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
                          <item.icon className="size-5" />
                        </div>
                        <p className="mt-4 font-semibold text-[#163042]">{item.title}</p>
                        <p className="mt-2 text-sm leading-6 text-[#5b7483]">
                          {item.copy}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 rounded-[1.5rem] border border-[#dce9e8] bg-white p-5">
                  <div>
                    <p className="text-sm font-semibold text-[#163042]">
                      Cara kerjanya sederhana
                    </p>
                    <p className="mt-1 text-sm text-[#5b7483]">
                      Langkah ringkas untuk mulai lebih rapi.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {workflowItems.map((item, index) => (
                      <div
                        className="flex gap-3 rounded-2xl bg-[#f4f8f8] px-3 py-3"
                        key={item}
                      >
                        <div className="bg-primary text-primary-foreground flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                          {index + 1}
                        </div>
                        <p className="text-sm leading-6 text-[#355565]">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 border-y border-white/70 bg-white/75 backdrop-blur" id="fitur">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium text-primary">Fitur utama</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#163042]">
              Disusun mengikuti kebutuhan farm sehari-hari
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#5b7483] sm:text-base">
              Semua dirancang agar pencatatan terasa lebih ringan, bukan lebih
              rumit.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {featureItems.map((item) => (
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
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:px-8 lg:py-20">
          <div className="space-y-4">
            <p className="text-sm font-medium text-primary">Cara kerja</p>
            <h2 className="text-3xl font-semibold tracking-tight text-[#163042]">
              Mulai dari langkah kecil, lalu semua data terasa lebih jelas
            </h2>
            <p className="max-w-xl text-sm leading-7 text-[#5b7483] sm:text-base">
              Anda tidak perlu sistem yang terasa berat. Cukup mulai dari data yang
              paling sering dipakai setiap hari.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {workflowItems.map((item, index) => (
              <article
                className="rounded-[1.75rem] border border-[#dce9e8] bg-white p-5 shadow-[0_16px_40px_rgba(22,48,66,0.05)]"
                key={item}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-accent text-accent-foreground flex size-10 items-center justify-center rounded-2xl text-sm font-semibold">
                    0{index + 1}
                  </div>
                  <p className="font-semibold text-[#163042]">{item}</p>
                </div>
                <p className="mt-4 text-sm leading-7 text-[#5b7483]">
                  {index === 0
                    ? "Siapkan data dasar farm dan mulai susun siklus budidaya dengan lebih teratur."
                    : index === 1
                      ? "Masukkan kegiatan lapangan seperti pakan, mortalitas, sampling, dan biaya dalam satu alur."
                      : index === 2
                        ? "Saat panen dijual, simpan langsung ke sistem agar riwayat penjualan tetap rapi."
                        : "Lihat perkembangan usaha dari data operasional dan keuangan yang sudah tersusun."}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 pb-16 sm:pb-20" id="tentang">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[2rem] border border-[#dce9e8] bg-[linear-gradient(135deg,#163042_0%,#125e8a_58%,#0f9d8a_100%)] px-6 py-8 text-white sm:px-8 sm:py-10 lg:flex lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-white/75">
                Mulai kelola farm dengan lebih rapi
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Gunakan Tebar Panen untuk menyusun data budidaya dan usaha dalam
                satu alur yang mudah dipahami.
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
                href="/login"
              >
                Masuk
              </Link>
            </div>
          </div>

          <footer className="flex flex-col gap-3 px-1 pt-6 pb-2 text-sm text-[#5b7483] sm:flex-row sm:items-center sm:justify-between">
            <p>
              Tebar Panen membantu operasional budidaya jadi lebih sederhana dan
              terpusat.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link className="hover:text-foreground transition-colors" href="/login">
                Masuk
              </Link>
              <Link className="hover:text-foreground transition-colors" href="/register">
                Daftarkan Farm
              </Link>
            </div>
          </footer>
        </div>
      </section>
    </main>
  )
}
