import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ChartColumn, Fish, ReceiptText, Waves } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Aplikasi Budidaya Ikan | Tebar Panen",
  description:
    "Aplikasi budidaya ikan untuk mencatat kolam, mortalitas, panen, penjualan, dan laporan usaha dalam satu tempat.",
  alternates: {
    canonical: "/aplikasi-budidaya-ikan",
  },
}

const benefitItems = [
  "Pencatatan kolam lebih rapi",
  "Panen dan penjualan langsung terhubung",
  "Laporan usaha lebih cepat dilihat",
]

const problemItems = [
  {
    copy:
      "Banyak usaha budidaya ikan masih mencatat mortalitas, pakan, panen, dan penjualan di buku tulis, chat, atau spreadsheet terpisah. Saat data dibutuhkan, tim harus membuka banyak catatan dan hasilnya sering tidak sinkron.",
    title: "Data harian mudah tercecer",
  },
  {
    copy:
      "Ketika kolam aktif mulai bertambah, pemilik usaha biasanya kesulitan melihat kolam mana yang perlu dicek lebih dulu, panen mana yang siap dijual, dan biaya mana yang belum masuk ke rekap.",
    title: "Operasional kolam sulit dipantau",
  },
  {
    copy:
      "Laporan usaha sering baru dirapikan di akhir minggu atau akhir bulan. Akibatnya, keputusan tentang pakan, panen, dan penjualan sering dibuat tanpa data yang benar-benar lengkap.",
    title: "Laporan usaha terlambat terlihat",
  },
]

const valueItems = [
  {
    copy:
      "Pantau tebar benih, pakan, mortalitas, sampling, dan panen ikan dalam satu alur pencatatan yang rapi sehingga tim tidak perlu memecah data ke banyak tempat.",
    icon: Fish,
    title: "Siklus Budidaya",
  },
  {
    copy:
      "Catat setiap panen ikan yang dijual, pembeli, berat, harga, dan status pembayarannya agar riwayat transaksi selalu terhubung ke kolam yang tepat.",
    icon: ReceiptText,
    title: "Penjualan Panen",
  },
  {
    copy:
      "Lihat pendapatan, biaya, dan hasil usaha budidaya ikan berdasarkan periode laporan agar pemilik usaha lebih cepat membaca kondisi bisnisnya.",
    icon: ChartColumn,
    title: "Laporan Keuangan",
  },
  {
    copy:
      "Simpan data kolam dan alat budidaya supaya kebutuhan operasional harian tetap tertata dan tidak bergantung pada ingatan atau chat lama.",
    icon: Waves,
    title: "Kolam dan Alat",
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
      "Alur pencatatan dibuat mengikuti kegiatan yang memang biasa terjadi di kolam, mulai dari pengecekan harian sampai panen dan penjualan.",
    title: "Alur kerja terasa familiar",
  },
  {
    copy:
      "Usaha budidaya ikan bisa mulai dari satu kolam dulu. Saat operasional makin rapi, penggunaan aplikasi bisa diperluas tanpa harus mengubah cara kerja secara drastis.",
    title: "Cocok untuk mulai bertahap",
  },
  {
    copy:
      "Data kolam, panen, penjualan, dan keuangan tetap terhubung. Ini membantu saat pemilik usaha ingin melihat kondisi operasional sekaligus hasil usahanya dalam satu alur.",
    title: "Semua data tetap nyambung",
  },
]

const workflowItems = [
  {
    copy:
      "Mulai dari data usaha, kolam, dan siklus aktif yang sedang berjalan. Tim tidak perlu menunggu semua proses sempurna untuk mulai mencatat lebih rapi.",
    title: "Mulai dari kolam yang sedang berjalan",
  },
  {
    copy:
      "Catat mortalitas, pakan, sampling, biaya, dan panen ikan sesuai kegiatan lapangan. Fokusnya adalah konsisten mengisi data yang memang dipakai setiap hari.",
    title: "Isi pencatatan seperlunya setiap hari",
  },
  {
    copy:
      "Saat panen dijual, transaksi dan laporan usaha langsung ikut tersusun. Pemilik usaha tidak perlu menunggu rekap manual di akhir periode untuk membaca hasil penjualan.",
    title: "Pantau penjualan dan hasil usaha",
  },
]

const advantageItems = [
  {
    copy:
      "Aplikasi budidaya ikan membantu tim melihat kolam aktif, kegiatan harian, dan transaksi penjualan dari satu layar. Ini jauh lebih cepat dibanding mencari data dari file yang tersebar.",
    title: "Lebih cepat daripada catatan manual",
  },
  {
    copy:
      "Karena data harian masuk ke alur yang sama, pemilik usaha bisa lebih mudah membandingkan biaya, hasil panen, dan penjualan tanpa harus merapikan ulang dari awal.",
    title: "Lebih mudah dibaca saat rekap",
  },
  {
    copy:
      "Ketika usaha bertambah besar, kebutuhan pencatatan biasanya ikut kompleks. Sistem yang rapi sejak awal membuat transisi ke operasional yang lebih tertata jadi tidak terlalu berat.",
    title: "Siap dipakai saat usaha berkembang",
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
      "Tebar Panen adalah aplikasi budidaya ikan yang membantu Anda mencatat kolam, mortalitas, pakan, panen, penjualan, dan laporan usaha harian dalam satu alur yang lebih rapi. Tujuannya sederhana: supaya operasional harian terasa lebih ringan dan data lebih mudah dibaca saat dibutuhkan.",
    question: "Sebenarnya Tebar Panen ini untuk apa?",
  },
  {
    answer:
      "Cocok. Banyak usaha budidaya ikan memang mulai dari satu atau beberapa kolam dulu, lalu mulai terasa repot saat catatan manual makin banyak. Tebar Panen bisa dipakai bertahap, jadi Anda tidak perlu menunggu usaha besar dulu untuk mulai rapi.",
    question: "Kalau usaha saya masih kecil, apakah tetap cocok?",
  },
  {
    answer:
      "Tebar Panen bisa dipakai untuk budidaya lele, nila, patin, gurame, dan ikan air tawar lainnya. Selama alur harian usaha Anda mirip, seperti mencatat kolam, pakan, mortalitas, panen, dan penjualan, aplikasi ini tetap relevan dipakai.",
    question: "Bisa dipakai untuk budidaya ikan apa saja?",
  },
  {
    answer:
      "Anda bisa mencatat kolam aktif, tebar benih, mortalitas, pakan, sampling, biaya, panen ikan, transaksi penjualan, dan laporan usaha. Jadi, data penting tidak perlu lagi tersebar di buku, chat, atau spreadsheet yang berbeda-beda.",
    question: "Apa saja yang bisa saya catat di sini?",
  },
  {
    answer:
      "Spreadsheet tetap bisa membantu di awal, tetapi biasanya mulai terasa berat saat kolam, panen, dan transaksi makin banyak. Tebar Panen membantu Anda menyusun data harian, penjualan, dan laporan usaha dalam satu alur yang lebih enak dibaca.",
    question: "Apa bedanya dengan spreadsheet biasa?",
  },
  {
    answer:
      "Cara paling mudah adalah mulai dari kolam yang sedang aktif sekarang. Setelah itu, lanjutkan dengan pencatatan kegiatan harian dan penjualan panen. Anda tidak perlu langsung sempurna, yang penting mulai dulu dari data yang paling sering dipakai.",
    question: "Kalau mau mulai, langkah paling mudahnya bagaimana?",
  },
]

export default function HomePage() {
  const hasSocialProof = customerQuotes.length > 0

  return (
    <main className="bg-[#f7fbfa] text-[#163042]">
      <header className="border-b border-[#deebe8] bg-white/92">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link className="flex items-center gap-3" href="/aplikasi-budidaya-ikan">
            <div className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-2xl">
              <Fish className="size-5" />
            </div>
            <div>
              <p className="text-base font-semibold tracking-tight">Tebar Panen</p>
              <p className="text-xs text-[#5b7483]">
                Aplikasi budidaya ikan yang lebih rapi
              </p>
            </div>
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
      </header>

      <section className="border-b border-[#deebe8] bg-[linear-gradient(180deg,#f7fbfa_0%,#eef7f5_100%)]">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.88fr)] lg:px-8 lg:py-20">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center rounded-full border border-[#d9e9e4] bg-white px-3 py-1.5 text-sm text-[#456473]">
              Untuk operasional budidaya ikan yang lebih tenang
            </div>

            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Aplikasi budidaya ikan untuk mencatat kolam, panen, dan penjualan.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-[#4f6775] sm:text-lg">
                Tebar Panen membantu usaha budidaya ikan mencatat kolam aktif,
                mortalitas, pakan, panen ikan, penjualan, dan laporan usaha
                dalam satu tempat yang lebih rapi.
              </p>
              <p className="max-w-2xl text-base leading-7 text-[#4f6775] sm:text-lg">
                Anda bisa mulai dari kolam yang sedang aktif hari ini, lalu
                merapikan pencatatan pelan-pelan tanpa harus mengubah semua
                proses sekaligus.
              </p>
            </div>

            <div className="flex flex-col items-start gap-3">
              <Link
                className={cn(
                  buttonVariants(),
                  "h-11 w-full rounded-xl px-5 text-sm shadow-[0_16px_34px_rgba(15,157,138,0.22)] sm:w-auto",
                )}
                href="/register"
              >
                Daftarkan Usaha Budidaya
                <ArrowRight className="size-4" />
              </Link>
              <p className="text-sm text-[#5b7483]">
                Cocok untuk usaha budidaya ikan yang ingin mulai lebih rapi
                dari satu kolam dulu.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {benefitItems.map((item) => (
                <div
                  className="rounded-2xl border border-[#d9e9e4] bg-white px-4 py-3 text-sm text-[#355565]"
                  key={item}
                >
                  {item}
                </div>
              ))}
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
                    Semua siklus kolam yang berjalan bisa terlihat cepat tanpa
                    membuka banyak file atau chat lama.
                  </p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-white/72">Penjualan bulan ini</p>
                  <p className="mt-2 text-3xl font-semibold">Rp84,5 jt</p>
                  <p className="mt-2 text-sm text-white/72">
                    Panen ikan yang terjual langsung masuk ke catatan usaha dan
                    lebih mudah direkap kapan pun dibutuhkan.
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
                  "Biaya pakan minggu ini sudah masuk ke laporan",
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
              Masalah yang paling sering terjadi di usaha budidaya ikan
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#5b7483] sm:text-base">
              Jika Anda masih mencatat di buku, chat, atau spreadsheet
              terpisah, masalahnya biasanya bukan kurang data. Masalahnya,
              data sering terasa repot saat dibutuhkan cepat.
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
              <p className="text-sm font-medium text-primary">Testimoni pengguna</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Pengguna Tebar Panen merasakan manfaat yang nyata
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#5b7483] sm:text-base">
                Mereka merasakan hal yang sederhana tapi penting: catatan panen
                lebih rapi, data kolam lebih cepat dicek, dan laporan
                penjualan lebih mudah dipahami.
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
              Fitur inti untuk operasional budidaya ikan harian
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#5b7483] sm:text-base">
              Anda tidak butuh fitur yang rumit untuk mulai rapi. Yang penting,
              data kolam, panen, penjualan, dan laporan usaha tercatat dalam
              alur yang terasa ringan dipakai setiap hari.
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
              Aplikasi ini mengikuti alur kerja yang umum dipakai di usaha air
              tawar, termasuk budidaya lele, nila, patin, dan gurame, supaya
              terasa akrab sejak awal dipakai.
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

          <div className="mt-10 grid gap-4 md:grid-cols-3">
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
              Kenapa sistem yang rapi lebih efektif daripada catatan manual
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#5b7483] sm:text-base">
              Anda mungkin tidak membutuhkan sistem yang rumit. Anda butuh
              pencatatan yang konsisten, mudah dibaca, dan tidak memecah data
              ke banyak tempat saat usaha sedang berjalan.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
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
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,0.74fr)_minmax(0,1.26fr)] lg:px-8">
          <div className="max-w-md space-y-4">
            <p className="text-sm font-medium text-primary">Cara kerja</p>
            <h2 className="text-3xl font-semibold tracking-tight">
              Cara kerja yang sederhana untuk tim budidaya
            </h2>
            <p className="text-sm leading-7 text-[#5b7483] sm:text-base">
              Anda tidak perlu mengganti semua proses sekaligus. Mulailah dari
              kolam yang sedang berjalan, lalu isi pencatatan yang memang
              dipakai tim setiap hari.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {workflowItems.map((item, index) => (
              <article
                className="rounded-[1.75rem] border border-[#d9e9e4] bg-white p-5"
                key={item.title}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary text-primary-foreground flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                    {index + 1}
                  </div>
                  <h3 className="font-semibold">{item.title}</h3>
                </div>
                <p className="mt-4 text-sm leading-7 text-[#5b7483]">
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
            <p className="text-sm font-medium text-primary">FAQ</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Pertanyaan yang sering muncul sebelum mulai
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#5b7483] sm:text-base">
              Jika Anda masih membandingkan dengan cara lama, pertanyaan di
              bawah ini biasanya jadi jawaban yang paling dicari sebelum mulai.
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {faqItems.map((item) => (
              <article
                className="rounded-[1.75rem] border border-[#d9e9e4] bg-[#fbfdfd] p-6"
                key={item.question}
              >
                <h3 className="text-lg font-semibold">{item.question}</h3>
                <p className="mt-3 text-sm leading-7 text-[#5b7483]">
                  {item.answer}
                </p>
              </article>
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
                Jika Anda ingin kolam, panen, penjualan, dan laporan usaha
                lebih mudah dipantau, Anda bisa mulai dari satu langkah kecil:
                buka halaman pendaftaran dan mulai dari data yang paling sering
                dipakai.
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
            dan terpusat.
          </footer>
        </div>
      </section>
    </main>
  )
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
