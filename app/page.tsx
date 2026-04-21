import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowRight, ChartColumn, Fish, ReceiptText, Sparkles } from "lucide-react"

import { auth } from "@/auth"
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Aplikasi Budidaya Ikan | Tebar Panen",
  description:
    "Aplikasi budidaya ikan untuk mencatat operasional kolam, penjualan, laporan laba rugi, dan Analisis AI dalam satu tempat.",
  alternates: {
    canonical: "/aplikasi-budidaya-ikan",
  },
}

const problemItems = [
  {
    copy:
      "Catatan mortalitas, pakan, panen, dan penjualan sering tersimpan di tempat yang berbeda, sehingga sulit dicari saat dibutuhkan.",
    title: "Data harian mudah tercecer",
  },
  {
    copy:
      "Saat kolam aktif bertambah, tim lebih sulit melihat kolam mana yang perlu dicek lebih dulu dan panen mana yang siap dijual.",
    title: "Kolam yang perlu perhatian tidak terlihat cepat",
  },
  {
    copy:
      "Pendapatan dan biaya sering baru direkap di akhir periode, sehingga keputusan harian berjalan tanpa gambaran usaha yang jelas.",
    title: "Laporan usaha terlambat terlihat",
  },
]

const valueItems = [
  {
    copy:
      "Catat benih, pakan, mortalitas, sampling, dan panen dalam satu alur yang rapi.",
    icon: Fish,
    title: "Siklus Budidaya",
  },
  {
    copy:
      "Catat penjualan panen, pembeli, berat, harga, dan status pembayaran dalam satu tempat.",
    icon: ReceiptText,
    title: "Penjualan Panen",
  },
  {
    copy:
      "Lihat pendapatan, biaya, dan laporan laba rugi agar kondisi usaha lebih mudah dipantau.",
    icon: ChartColumn,
    title: "Laporan Keuangan",
  },
  {
    copy:
      "Ringkas kondisi budidaya dan lihat hal yang perlu diperhatikan lebih dulu.",
    icon: Sparkles,
    title: "Analisis AI",
  },
]

const fitItems = [
  "Budidaya lele",
  "Budidaya nila",
  "Budidaya patin",
  "Budidaya gurame",
  "Usaha budidaya ikan air tawar lainnya",
]

const trustItems = [
  {
    copy:
      "Pencatatan mengikuti kegiatan harian budidaya, dari kolam aktif sampai panen dan penjualan.",
    title: "Alur kerja terasa familiar",
  },
  {
    copy:
      "Bisa dimulai dari satu kolam dulu, lalu dipakai lebih luas saat operasional sudah makin rapi.",
    title: "Mudah mulai dari skala kecil",
  },
  {
    copy:
      "Data kolam, penjualan, dan laporan usaha tetap nyambung sehingga lebih mudah dipantau.",
    title: "Data tetap terhubung",
  },
  {
    copy:
      "Ringkasan kondisi budidaya lebih mudah dibaca setelah data harian tercatat.",
    title: "Kondisi usaha lebih mudah dibaca",
  },
]

const workflowItems = [
  {
    copy:
      "Masukkan data usaha, kolam, dan siklus budidaya yang sedang berjalan.",
    title: "Mulai dari kolam aktif",
  },
  {
    copy:
      "Isi mortalitas, pakan, sampling, biaya, dan panen sesuai aktivitas di lapangan.",
    title: "Catat kegiatan harian",
  },
  {
    copy:
      "Setelah panen dijual, data penjualan dan laporan usaha ikut tersusun lebih rapi.",
    title: "Pantau penjualan dan laporan",
  },
  {
    copy:
      "AI membantu merangkum kondisi budidaya dan hal yang perlu diperhatikan lebih dulu.",
    title: "Lihat ringkasan AI",
  },
]

const advantageItems = [
  {
    copy:
      "Kolam aktif, penjualan, dan laporan usaha bisa dilihat dalam satu alur tanpa membuka banyak catatan.",
    title: "Lebih cepat dipantau",
  },
  {
    copy:
      "Data yang sudah tercatat lebih mudah dibaca kembali saat Anda ingin mengecek biaya, hasil panen, dan penjualan.",
    title: "Lebih mudah saat rekap",
  },
  {
    copy:
      "Saat jumlah kolam dan aktivitas bertambah, pencatatan tetap lebih tertata dan tidak mudah berantakan.",
    title: "Lebih siap saat usaha berkembang",
  },
  {
    copy:
      "Masalah lebih cepat terlihat sehingga keputusan harian bisa diambil dengan lebih tenang.",
    title: "Lebih mudah mengambil tindakan",
  },
]

type SocialProofQuote = {
  company: string
  name: string
  quote: string
  role: string
}

const customerQuotes: SocialProofQuote[] = [
  {
    company: "Amanah Farm",
    name: "Shakeel Al Farizi",
    quote:
      "Pencatatan panen, biaya, dan penjualan jadi lebih rapi daripada pakai catatan terpisah.",
    role: "Owner",
  },
  {
    company: "Barokah Farm",
    name: "Ammar Al Ghifari",
    quote:
      "Tim kami lebih cepat cek data kolam aktif dan panen yang siap dijual setiap hari.",
    role: "Owner",
  },
  {
    company: "Aisyah Farm",
    name: "Aisyah",
    quote:
      "Aplikasi sangat bermanfaat, saya bisa langsung lihat laporan penjualan.",
    role: "Owner",
  },
]

const faqItems = [
  {
    answer:
      "Tebar Panen membantu Anda mencatat kolam, pakan, mortalitas, panen, penjualan, dan laporan usaha dalam satu alur yang lebih rapi agar operasional harian lebih mudah dipantau.",
    question: "Sebenarnya Tebar Panen ini untuk apa?",
  },
  {
    answer:
      "Cocok. Banyak usaha budidaya ikan memang mulai dari satu atau beberapa kolam dulu, lalu mulai terasa repot saat catatan manual makin banyak. Tebar Panen bisa dipakai bertahap, jadi Anda tidak perlu menunggu usaha besar dulu untuk mulai lebih rapi.",
    question: "Kalau usaha saya masih kecil, apakah tetap cocok?",
  },
  {
    answer:
      "Tebar Panen bisa dipakai untuk budidaya lele, nila, patin, gurame, dan ikan air tawar lainnya. Selama alur harian usaha Anda mirip, seperti mencatat kolam, pakan, mortalitas, panen, dan penjualan, aplikasi ini tetap nyaman dipakai.",
    question: "Bisa dipakai untuk budidaya ikan apa saja?",
  },
  {
    answer:
      "Anda bisa mencatat kolam aktif, tebar benih, mortalitas, pakan, sampling, biaya, panen ikan, transaksi penjualan, dan laporan usaha. Jadi, data penting tidak perlu lagi tersebar di buku, chat, atau spreadsheet yang berbeda-beda.",
    question: "Apa saja yang bisa saya catat di sini?",
  },
  {
    answer:
      "Analisis AI membantu merangkum kondisi siklus dari data yang sudah dicatat, seperti hal yang perlu dicek lebih dulu dan catatan yang masih perlu dilengkapi. Fungsinya bukan menggantikan keputusan Anda, tetapi membantu agar membaca data terasa lebih cepat.",
    question: "Analisis AI di Tebar Panen bisa membantu apa?",
  },
  {
    answer:
      "Spreadsheet tetap bisa membantu di awal, tetapi biasanya mulai terasa berat saat kolam, panen, dan transaksi makin banyak. Tebar Panen membantu Anda menyusun data harian, penjualan, dan laporan usaha dalam satu alur yang lebih enak dibaca dan lebih mudah dicek kembali.",
    question: "Apa bedanya dengan spreadsheet biasa?",
  },
  {
    answer:
      "Cara paling mudah adalah mulai dari kolam yang sedang aktif sekarang. Setelah itu, lanjutkan dengan pencatatan kegiatan harian dan penjualan panen. Anda tidak perlu langsung sempurna. Yang penting, mulai dulu dari data yang paling sering dipakai.",
    question: "Kalau mau mulai, langkah paling mudahnya bagaimana?",
  },
]

export default async function HomePage() {
  const session = await auth()

  if (session?.user) {
    redirect("/dashboard")
  }

  const hasSocialProof = customerQuotes.length > 0

  return (
    <main className="bg-[#f7fbfa] text-[#163042]">
      <header className="border-b border-[#deebe8] bg-white/92">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link
            className="flex items-center gap-3"
            href="/aplikasi-budidaya-ikan"
          >
            <div className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-2xl">
              <Fish className="size-5" />
            </div>
            <div>
              <p className="text-base font-semibold tracking-tight">
                Tebar Panen
              </p>
              <p className="text-xs text-[#5b7483]">
                Aplikasi budidaya ikan yang lebih rapi
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-10 rounded-xl border-[#d9e9e4] bg-white px-4 text-sm text-[#163042] hover:bg-[#f7fbfa]",
              )}
              href="/login"
            >
              Login
            </Link>
            <Link
              className={cn(
                buttonVariants(),
                "h-10 rounded-xl px-4 text-sm shadow-[0_14px_30px_rgba(15,157,138,0.2)]",
              )}
              href="/register"
            >
              Daftarkan Usaha
            </Link>
          </div>
        </div>
      </header>

      <section className="border-b border-[#deebe8] bg-[linear-gradient(180deg,#f7fbfa_0%,#eef7f5_100%)]">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.88fr)] lg:px-8 lg:py-20">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center rounded-full border border-[#d9e9e4] bg-white px-3 py-1.5 text-sm text-[#456473]">
              Untuk operasional budidaya ikan
            </div>

            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Aplikasi budidaya ikan dengan bantuan AI (Artificial
                Intelligence)
              </h1>
              <p className="max-w-2xl text-base leading-7 text-[#4f6775] sm:text-lg">
                Catat operasional budidaya, penjualan, dan laporan laba rugi
                dalam satu tempat. AI membantu merangkum kondisi siklus budidaya
                agar Anda lebih cepat membaca masalah dan mengambil tindakan.
              </p>
            </div>

            <div className="flex flex-col items-start gap-3">
              <Link
                className={cn(
                  buttonVariants(),
                  "h-12 w-full rounded-xl px-5 text-lg shadow-[0_16px_34px_rgba(15,157,138,0.22)] sm:w-auto font-medium",
                )}
                href="/register"
              >
                Daftarkan Usaha Budidaya
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#d9e9e4] bg-white p-4 shadow-[0_20px_50px_rgba(22,48,66,0.08)]">
            <div className="rounded-[1.5rem] bg-[linear-gradient(160deg,#163042_0%,#125e8a_54%,#0f9d8a_100%)] p-5 text-white">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-white/70">
                    Tebar Panen
                  </p>
                  <p className="mt-2 text-2xl font-semibold">
                    Ringkasan Hari Ini
                  </p>
                </div>
                <div className="rounded-full bg-white/12 px-3 py-1 text-xs">
                  Hari ini
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-white/72">Kolam aktif</p>
                  <p className="mt-2 text-3xl font-semibold">12</p>
                  <p className="mt-2 text-sm text-white/72">
                    Semua siklus aktif terlihat cepat dalam satu layar.
                  </p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-white/72">Analisis AI terbaru</p>
                  <p className="mt-2 text-3xl font-semibold">3 prioritas</p>
                  <p className="mt-2 text-sm text-white/72">
                    AI merangkum hal yang perlu dicek lebih dulu hari ini.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-[1.5rem] border border-[#d9e9e4] bg-[#f8fbfb] p-5">
              <p className="text-sm font-semibold text-[#163042]">
                Yang biasanya dicek tim hari ini
              </p>
              <div className="mt-4 space-y-3">
                {[
                  "Mortalitas kolam C-12 belum dicatat",
                  "Panen 10 kg siap dijual ke pembeli hari ini",
                  "AI menyarankan cek kualitas air",
                ].map((item) => (
                  <div
                    className="rounded-2xl border border-[#d9e9e4] bg-white px-4 py-3 text-sm text-[#355565]"
                    key={item}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#deebe8] bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight">
              Masalah yang sering terjadi di usaha budidaya ikan
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#5b7483] sm:text-base">
              Saat data masih tersebar di buku, chat, atau spreadsheet,
              operasional harian jadi lebih sulit dipantau.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {problemItems.map((item) => (
              <article
                className="rounded-[1.75rem] border border-[#d9e9e4] bg-[#fbfdfd] p-6"
                key={item.title}
              >
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#5b7483]">
                  {item.copy}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {hasSocialProof ? (
        <section className="border-b border-[#deebe8] bg-[#f7fbfa]">
          <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-medium text-primary">
                Testimoni pengguna
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Pengguna Tebar Panen merasakan manfaat yang nyata
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#5b7483] sm:text-base">
                Mereka merasakan hal yang sederhana tapi penting: catatan panen
                lebih rapi, data kolam lebih cepat dicek, dan laporan penjualan
                lebih mudah dipahami.
              </p>
            </div>

            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {customerQuotes.map((item) => (
                <article
                  className="rounded-[1.75rem] border border-[#d9e9e4] bg-white p-6"
                  key={`${item.name}-${item.company}`}
                >
                  <div className="flex items-center gap-4">
                    <Image
                      alt={item.name}
                      className="size-14 rounded-2xl object-cover"
                      height={56}
                      src={getAvatarDataUrl(item.name)}
                      unoptimized
                      width={56}
                    />
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-[#5b7483]">
                        {item.role} • {item.company}
                      </p>
                    </div>
                  </div>
                  <p className="mt-5 text-base leading-7 text-[#355565]">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="border-b border-[#deebe8] bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium text-primary">Fitur utama</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Fitur inti untuk operasional budidaya ikan
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#5b7483] sm:text-base">
              Fitur yang Anda butuhkan untuk mencatat budidaya, penjualan,
              laporan keuangan, dan memahami kondisi usaha dengan lebih cepat.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {valueItems.map((item) => (
              <article
                className="rounded-[1.75rem] border border-[#d9e9e4] bg-[#fbfdfd] p-5"
                key={item.title}
              >
                <div className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-2xl">
                  <item.icon className="size-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#5b7483]">
                  {item.copy}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#deebe8] bg-[#f7fbfa]">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium text-primary">Cocok untuk</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Dibuat khusus untuk budidaya ikan air tawar
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#5b7483] sm:text-base">
              Tebar Panen dirancang untuk budidaya ikan air tawar, dengan alur
              kerja yang familiar agar lebih mudah dipakai sejak awal.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {fitItems.map((item) => (
              <div
                className="rounded-full border border-[#d9e9e4] bg-white px-4 py-2 text-sm text-[#355565]"
                key={item}
              >
                {item}
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {trustItems.map((item) => (
              <article
                className="rounded-[1.5rem] border border-[#d9e9e4] bg-white p-5"
                key={item.title}
              >
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#5b7483]">
                  {item.copy}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#deebe8] bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium text-primary">Keunggulan</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Kenapa lebih praktis daripada catatan manual
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#5b7483] sm:text-base">
              Untuk budidaya ikan yang berjalan setiap hari, pencatatan yang
              rapi membantu Anda melihat kondisi usaha lebih cepat dan
              mengambil keputusan dengan lebih tenang.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {advantageItems.map((item) => (
              <article
                className="rounded-[1.5rem] border border-[#d9e9e4] bg-[#fbfdfd] p-5"
                key={item.title}
              >
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#5b7483]">
                  {item.copy}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#deebe8] bg-[#f7fbfa]">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(280px,0.72fr)_minmax(0,1.28fr)] lg:items-start lg:px-8">
          <div className="space-y-4 rounded-[1.75rem] border border-[#d9e9e4] bg-white p-6 lg:sticky lg:top-24">
            <p className="text-sm font-medium text-primary">Cara kerja</p>
            <h2 className="text-3xl font-semibold tracking-tight">
              Cara kerja yang sederhana untuk budidaya ikan
            </h2>
            <p className="text-sm leading-7 text-[#5b7483] sm:text-base">
              Mulai dari kolam yang sedang berjalan, catat kegiatan harian,
              lalu lihat ringkasan kondisi budidaya agar lebih mudah dipahami.
            </p>
            <div className="rounded-2xl border border-[#d9e9e4] bg-[#f7fbfa] px-4 py-3 text-sm text-[#355565]">
              Mulai dari data yang paling sering dipakai dulu. Setelah alurnya
              terasa nyaman, langkah berikutnya akan mengikuti lebih mudah.
            </div>
          </div>

          <div className="relative space-y-4 md:pl-14">
            <div className="absolute top-0 bottom-0 left-5 hidden w-px bg-[#d9e9e4] md:block" />
            {workflowItems.map((item, index) => (
              <article
                className="relative rounded-[1.75rem] border border-[#d9e9e4] bg-white p-5 md:p-6"
                key={item.title}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start">
                  <div className="hidden md:absolute md:top-6 md:-left-14 md:block">
                    <div className="bg-primary text-primary-foreground flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold shadow-[0_10px_24px_rgba(15,157,138,0.18)]">
                      {index + 1}
                    </div>
                  </div>
                  <div className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-full text-sm font-semibold md:hidden">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[#5b7483]">
                      {item.copy}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#deebe8] bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium text-primary">FAQ</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Pertanyaan yang sering muncul sebelum mulai
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#5b7483] sm:text-base">
              Jika Anda masih membandingkan dengan cara lama, pertanyaan di
              bawah ini biasanya jadi jawaban yang paling dicari sebelum mulai.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-4xl space-y-4">
            {faqItems.map((item, index) => (
              <Accordion
                className="rounded-[1.75rem] border border-[#d9e9e4] bg-[#fbfdfd] p-2"
                defaultValue={index === 0 ? [item.question] : []}
                key={item.question}
              >
                <AccordionItem
                  className="border-0 bg-transparent"
                  value={item.question}
                >
                  <AccordionHeader>
                    <AccordionTrigger className="rounded-[1.1rem] px-4 py-4 text-base font-semibold text-[#163042] hover:bg-white">
                      {item.question}
                    </AccordionTrigger>
                  </AccordionHeader>
                  <AccordionContent className="px-4 pb-4 pt-1 text-sm leading-7 text-[#5b7483]">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7fbfa]">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-[#d9e9e4] bg-[linear-gradient(135deg,#163042_0%,#125e8a_58%,#0f9d8a_100%)] px-6 py-8 text-white sm:px-8 sm:py-10 lg:flex lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-white/75">
                Siap mulai lebih rapi?
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Mulai rapikan pencatatan budidaya ikan dari kolam yang sedang
                berjalan hari ini.
              </h2>
              <p className="mt-3 text-sm leading-7 text-white/80">
                Jika Anda ingin kolam, penjualan, dan laporan usaha lebih mudah
                dipantau, Anda bisa mulai dari satu langkah kecil: buka halaman
                pendaftaran dan isi data yang paling sering dipakai.
              </p>
            </div>

            <div className="mt-6 lg:mt-0">
              <Link
                className={cn(
                  buttonVariants(),
                  "h-11 rounded-xl bg-white px-5 text-sm text-[#163042] hover:bg-white/92",
                )}
                href="/register"
              >
                Daftarkan Usaha Budidaya
              </Link>
            </div>
          </div>

          <footer className="px-1 pt-6 pb-2 text-sm text-[#5b7483]">
            Tebar Panen membantu operasional budidaya ikan jadi lebih sederhana
            dari pencatatan harian sampai ringkasan kondisi usaha.
          </footer>
        </div>
      </section>
    </main>
  );
}

function getAvatarDataUrl(name: string) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="112" height="112" viewBox="0 0 112 112" fill="none">
      <rect width="112" height="112" rx="28" fill="#D8F1EA"/>
      <rect x="8" y="8" width="96" height="96" rx="24" fill="url(#paint0_linear)"/>
      <circle cx="56" cy="41" r="18" fill="rgba(255,255,255,0.18)"/>
      <path d="M28 89c4.5-14.3 16-22 28-22s23.5 7.7 28 22" fill="rgba(255,255,255,0.18)"/>
      <text x="56" y="66" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="700" fill="#ffffff">${initials}</text>
      <defs>
        <linearGradient id="paint0_linear" x1="12" y1="10" x2="98" y2="102" gradientUnits="userSpaceOnUse">
          <stop stop-color="#125E8A"/>
          <stop offset="1" stop-color="#0F9D8A"/>
        </linearGradient>
      </defs>
    </svg>
  `

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}
