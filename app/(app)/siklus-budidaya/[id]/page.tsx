import Link from "next/link"
import {
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  Droplets,
  FileText,
  Fish,
  HeartPulse,
  Pill,
  Scale,
  Utensils,
  Wallet,
  Waves,
} from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const detail = {
  name: "Siklus Lele Batch 01",
  status: "Aktif",
  startDate: "12 Apr 2026",
  targetHarvestDate: "28 Jul 2026",
  seedCount: "8.000 ekor",
  seedSize: "5-7 cm",
  seedPrice: "Rp 1.600.000",
  estimatedAlive: "7.680 ekor",
  survivalRate: "96%",
  ponds: [
    { name: "Kolam A1", type: "Terpal", shape: "Persegi", status: "Aktif" },
    { name: "Kolam A2", type: "Beton", shape: "Bulat", status: "Aktif" },
  ],
}

const summary = [
  { label: "Estimasi Ikan Hidup", value: detail.estimatedAlive },
  { label: "Total Pakan", value: "214 kg" },
  { label: "Mortalitas", value: "320 ekor" },
  { label: "Estimasi Biaya", value: "Rp 4.850.000" },
]

const modules = [
  {
    modalId: "feed-modal",
    title: "Pakan",
    description: "Input pakan harian, jenis pakan, berat, dan harga.",
    value: "214 kg",
    icon: Utensils,
  },
  {
    modalId: "sampling-modal",
    title: "Sampling",
    description: "Catat berat rata-rata, panjang rata-rata, dan kondisi ikan.",
    value: "4 data",
    icon: Scale,
  },
  {
    modalId: "water-quality-modal",
    title: "Kualitas Air",
    description: "Pantau pH, suhu, DO, amonia, dan warna air.",
    value: "18 data",
    icon: Droplets,
  },
  {
    modalId: "mortality-modal",
    title: "Mortalitas",
    description: "Catat jumlah ikan mati, gejala, penyebab, dan catatan.",
    value: "320 ekor",
    icon: HeartPulse,
  },
  {
    modalId: "treatment-modal",
    title: "Pengobatan",
    description: "Catat obat, vitamin, dosis, dan tindak lanjut.",
    value: "2 data",
    icon: Pill,
  },
  {
    modalId: "cost-modal",
    title: "Biaya",
    description: "Pantau bibit, pakan, tenaga kerja, listrik, dan lain-lain.",
    value: "Rp 4,85 jt",
    icon: Wallet,
  },
  {
    modalId: "harvest-modal",
    title: "Panen",
    description: "Input total berat, jumlah ikan, harga jual, dan pembeli.",
    value: "Belum panen",
    icon: Fish,
  },
  {
    modalId: "report-modal",
    title: "Laporan",
    description: "Wireframe cetak laporan performa dan biaya siklus.",
    value: "Draft",
    icon: FileText,
  },
]

const operationRecords: Record<
  string,
  Array<{ title: string; meta: string; description: string }>
> = {
  Pakan: [
    {
      title: "PF-1000 / 18 kg",
      meta: "06 Mei 2026",
      description: "Harga Rp 252.000. Catatan: pakan pagi dan sore.",
    },
    {
      title: "PF-1000 / 16 kg",
      meta: "05 Mei 2026",
      description: "Harga Rp 224.000. Respon makan normal.",
    },
  ],
  Sampling: [
    {
      title: "Sampling 40 ekor",
      meta: "06 Mei 2026",
      description: "Berat rata-rata 78 gram, panjang rata-rata 16 cm.",
    },
    {
      title: "Sampling 30 ekor",
      meta: "29 Apr 2026",
      description: "Berat rata-rata 64 gram, ikan aktif.",
    },
  ],
  "Kualitas Air": [
    {
      title: "Kolam A1 / pH 7,1",
      meta: "05 Mei 2026",
      description: "Suhu 28 C, DO 5,4, amonia rendah, warna hijau muda.",
    },
    {
      title: "Kolam A2 / pH 7,3",
      meta: "05 Mei 2026",
      description: "Suhu 28,5 C, DO 5,2, warna air normal.",
    },
  ],
  Mortalitas: [
    {
      title: "Kolam A1 / 18 ekor",
      meta: "04 Mei 2026",
      description: "Gejala lemas, dipantau setelah pergantian air.",
    },
    {
      title: "Kolam A2 / 12 ekor",
      meta: "03 Mei 2026",
      description: "Penyebab belum diketahui, tidak ada luka terlihat.",
    },
  ],
  Pengobatan: [
    {
      title: "Vitamin C",
      meta: "02 Mei 2026",
      description: "Dosis 200 gram dicampur pakan, biaya Rp 85.000.",
    },
    {
      title: "Garam ikan",
      meta: "27 Apr 2026",
      description: "Treatment ringan setelah sampling, biaya Rp 40.000.",
    },
  ],
  Biaya: [
    {
      title: "Pakan",
      meta: "06 Mei 2026",
      description: "Pembelian PF-1000, nominal Rp 252.000.",
    },
    {
      title: "Tenaga Kerja",
      meta: "01 Mei 2026",
      description: "Upah perawatan mingguan, nominal Rp 350.000.",
    },
  ],
  Panen: [
    {
      title: "Belum ada panen",
      meta: "Target 28 Jul 2026",
      description: "Data panen akan muncul setelah panen pertama dicatat.",
    },
  ],
  Laporan: [
    {
      title: "Ringkasan Siklus",
      meta: "Draft",
      description: "Preview laporan performa, biaya, mortalitas, dan pakan.",
    },
  ],
}

const activities = [
  {
    title: "Sampling mingguan",
    description: "Rata-rata berat 78 gram, kondisi ikan aktif.",
    date: "06 Mei 2026",
  },
  {
    title: "Pakan harian",
    description: "Pakan PF-1000 sebanyak 18 kg.",
    date: "06 Mei 2026",
  },
  {
    title: "Kualitas air",
    description: "pH 7,1, suhu 28 C, DO 5,4.",
    date: "05 Mei 2026",
  },
]

export default async function SiklusBudidayaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Link
          className={cn(buttonVariants({ variant: "ghost" }), "gap-2 px-0")}
          href="/siklus-budidaya"
        >
          <ArrowLeft className="size-4" />
          Kembali ke Siklus Budidaya
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-muted-foreground text-sm">
              Siklus Budidaya / Detail
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-semibold tracking-tight">
                {detail.name}
              </h1>
              <span className="border-border bg-muted rounded-full border px-2 py-0.5 text-xs font-medium">
                {detail.status}
              </span>
            </div>
            <p className="text-muted-foreground mt-2 max-w-2xl text-sm">
              Wireframe detail untuk siklus `{id}`. Belum terhubung ke database.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline">
              Edit Siklus
            </Button>
            <Button className="gap-2" type="button">
              <FileText className="size-4" />
              Cetak Laporan
            </Button>
          </div>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        {summary.map((item) => (
          <SummaryCard key={item.label} label={item.label} value={item.value} />
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(20rem,0.6fr)]">
        <div className="border-border bg-card text-card-foreground rounded-lg border p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
              <CalendarDays className="size-5" />
            </div>
            <div>
              <h2 className="font-semibold">Informasi Siklus</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Data awal tebar dan target panen.
              </p>
            </div>
          </div>

          <dl className="mt-5 grid gap-4 text-sm md:grid-cols-3">
            <DetailMetric label="Tanggal Tebar" value={detail.startDate} />
            <DetailMetric
              label="Target Panen"
              value={detail.targetHarvestDate}
            />
            <DetailMetric label="Jumlah Bibit" value={detail.seedCount} />
            <DetailMetric label="Ukuran Awal" value={detail.seedSize} />
            <DetailMetric label="Harga Bibit" value={detail.seedPrice} />
            <DetailMetric label="Survival Rate" value={detail.survivalRate} />
          </dl>
        </div>

        <div className="border-border bg-card text-card-foreground rounded-lg border p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
              <Waves className="size-5" />
            </div>
            <div>
              <h2 className="font-semibold">Kolam Dalam Siklus</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Kolam yang dipilih saat siklus dibuat.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {detail.ponds.map((pond) => (
              <div
                className="border-border bg-background rounded-lg border p-3"
                key={pond.name}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{pond.name}</p>
                  <span className="text-muted-foreground text-xs">
                    {pond.status}
                  </span>
                </div>
                <p className="text-muted-foreground mt-1 text-sm">
                  {pond.type} / {pond.shape}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="font-semibold">Operasional Siklus</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Area pencatatan per siklus. Untuk MVP, tiap kartu nanti bisa masuk
            ke form/log masing-masing.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {modules.map((module) => {
            const Icon = module.icon

            return (
              <article
                className="border-border bg-card text-card-foreground rounded-lg border p-4 shadow-sm"
                key={module.title}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
                    <Icon className="size-5" />
                  </div>
                  <span className="text-muted-foreground text-sm">
                    {module.value}
                  </span>
                </div>
                <h3 className="mt-4 font-semibold">{module.title}</h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  {module.description}
                </p>
                <button
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "mt-4 w-full"
                  )}
                  popoverTarget={module.modalId}
                  type="button"
                >
                  Buka Wireframe
                </button>
              </article>
            )
          })}
        </div>

        {modules.map((module) => (
          <OperationModal
            description={module.description}
            id={module.modalId}
            key={module.modalId}
            title={module.title}
          />
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="border-border bg-card text-card-foreground rounded-lg border p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
              <ClipboardList className="size-5" />
            </div>
            <div>
              <h2 className="font-semibold">Timeline Terakhir</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Contoh aktivitas pencatatan pada siklus ini.
              </p>
            </div>
          </div>

          <div className="divide-border mt-5 divide-y">
            {activities.map((activity) => (
              <div className="py-4 first:pt-0 last:pb-0" key={activity.title}>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="font-medium">{activity.title}</h3>
                  <span className="text-muted-foreground text-sm">
                    {activity.date}
                  </span>
                </div>
                <p className="text-muted-foreground mt-1 text-sm">
                  {activity.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-border bg-card text-card-foreground rounded-lg border p-5 shadow-sm">
          <h2 className="font-semibold">Catatan Siklus</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Pertumbuhan stabil. Fokus minggu ini menjaga kualitas air dan
            konsistensi pakan harian. Area ini masih berupa wireframe.
          </p>
          <div className="border-border bg-muted/50 mt-5 rounded-lg border p-4">
            <p className="text-sm font-medium">Estimasi panen terdekat</p>
            <p className="mt-2 text-2xl font-semibold">28 Jul 2026</p>
            <p className="text-muted-foreground mt-1 text-sm">
              Berdasarkan target panen awal.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-border bg-card rounded-lg border p-4 shadow-sm">
      <p className="text-muted-foreground text-sm">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  )
}

function DetailMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted-foreground text-xs">{label}</dt>
      <dd className="mt-1 font-medium">{value}</dd>
    </div>
  )
}

function OperationModal({
  description,
  id,
  title,
}: {
  description: string
  id: string
  title: string
}) {
  return (
    <div
      className="backdrop:bg-foreground/30 open:flex fixed inset-0 m-auto hidden h-fit max-h-[90vh] w-[min(92vw,46rem)] overflow-y-auto rounded-lg border border-border bg-card p-0 text-card-foreground shadow-lg"
      id={id}
      popover="auto"
    >
      <div className="w-full">
        <div className="border-border border-b p-5">
          <p className="text-muted-foreground text-sm">Wireframe Operasional</p>
          <h2 className="mt-1 text-xl font-semibold">{title}</h2>
          <p className="text-muted-foreground mt-1 text-sm">{description}</p>
        </div>

        <div className="space-y-5 p-5">
          <OperationRecordList title={title} />

          <form className="border-border space-y-5 border-t pt-5">
            <div>
              <h3 className="font-semibold">Tambah Data</h3>
              <p className="text-muted-foreground mt-1 text-sm">
                Form input data baru untuk modul {title}.
              </p>
            </div>

            <OperationFields title={title} />

            <div className="border-border flex justify-end gap-2 border-t pt-4">
              <button
                className={cn(buttonVariants({ variant: "outline" }))}
                popoverTarget={id}
                popoverTargetAction="hide"
                type="button"
              >
                Batal
              </button>
              <Button type="button">Simpan Wireframe</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

function OperationRecordList({ title }: { title: string }) {
  const records = operationRecords[title] ?? []

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold">List Data</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            Contoh data yang sudah diinput pada modul ini.
          </p>
        </div>
        <span className="text-muted-foreground text-sm">
          {records.length} data
        </span>
      </div>

      <div className="border-border divide-border overflow-hidden rounded-lg border divide-y">
        {records.map((record) => (
          <div className="bg-background p-3" key={`${title}-${record.title}`}>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-medium">{record.title}</p>
              <span className="text-muted-foreground text-sm">
                {record.meta}
              </span>
            </div>
            <p className="text-muted-foreground mt-1 text-sm">
              {record.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

function OperationFields({ title }: { title: string }) {
  if (title === "Pakan") {
    return (
      <>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Tanggal" name="feedDate" type="date" />
          <FormField label="Jenis Pakan" name="feedType" />
          <FormField label="Berat Pakan (kg)" name="feedWeight" type="number" />
          <FormField label="Harga Pakan" name="feedPrice" type="number" />
        </div>
        <NotesField placeholder="Catatan pemberian pakan" />
      </>
    )
  }

  if (title === "Sampling") {
    return (
      <>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Tanggal Sampling" name="samplingDate" type="date" />
          <FormField label="Jumlah Sampel" name="sampleCount" type="number" />
          <FormField label="Berat Rata-rata (gram)" name="avgWeight" type="number" />
          <FormField label="Panjang Rata-rata (cm)" name="avgLength" type="number" />
        </div>
        <NotesField placeholder="Catatan kondisi ikan" />
      </>
    )
  }

  if (title === "Kualitas Air") {
    return (
      <>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Tanggal" name="waterDate" type="date" />
          <SelectField
            label="Kolam"
            name="pond"
            options={["Kolam A1", "Kolam A2"]}
          />
          <FormField label="pH" name="ph" type="number" />
          <FormField label="Suhu (C)" name="temperature" type="number" />
          <FormField label="DO" name="do" type="number" />
          <FormField label="Amonia" name="ammonia" type="number" />
          <FormField label="Warna Air" name="waterColor" />
        </div>
        <NotesField placeholder="Catatan kualitas air" />
      </>
    )
  }

  if (title === "Mortalitas") {
    return (
      <>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Tanggal" name="mortalityDate" type="date" />
          <SelectField
            label="Kolam"
            name="pond"
            options={["Kolam A1", "Kolam A2"]}
          />
          <FormField label="Jumlah Ikan Mati" name="deadCount" type="number" />
          <FormField label="Penyebab / Gejala" name="cause" />
        </div>
        <NotesField placeholder="Catatan mortalitas" />
      </>
    )
  }

  if (title === "Pengobatan") {
    return (
      <>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Tanggal" name="treatmentDate" type="date" />
          <FormField label="Nama Obat / Vitamin" name="medicineName" />
          <FormField label="Dosis" name="dosage" />
          <FormField label="Biaya" name="medicineCost" type="number" />
        </div>
        <NotesField placeholder="Catatan pengobatan dan tindak lanjut" />
      </>
    )
  }

  if (title === "Biaya") {
    return (
      <>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Tanggal Biaya" name="costDate" type="date" />
          <SelectField
            label="Kategori"
            name="category"
            options={["Bibit", "Pakan", "Obat/Vitamin", "Tenaga Kerja", "Listrik", "Lain-lain"]}
          />
          <FormField label="Nominal" name="amount" type="number" />
          <FormField label="Deskripsi" name="description" />
        </div>
        <NotesField placeholder="Catatan biaya operasional" />
      </>
    )
  }

  if (title === "Panen") {
    return (
      <>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Tanggal Panen" name="harvestDate" type="date" />
          <FormField label="Total Berat Panen (kg)" name="totalWeight" type="number" />
          <FormField label="Jumlah Ikan Terpanen" name="fishCount" type="number" />
          <FormField label="Harga Jual per kg" name="pricePerKg" type="number" />
          <FormField label="Pembeli" name="buyer" />
        </div>
        <NotesField placeholder="Catatan panen" />
      </>
    )
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <SelectField
          label="Jenis Laporan"
          name="reportType"
          options={["Ringkasan Siklus", "Biaya Operasional", "Performa Panen", "Log Lengkap"]}
        />
        <SelectField
          label="Format"
          name="format"
          options={["PDF", "Excel", "Print Preview"]}
        />
        <FormField label="Tanggal Mulai" name="dateFrom" type="date" />
        <FormField label="Tanggal Akhir" name="dateTo" type="date" />
      </div>
      <div className="border-border bg-muted/50 rounded-lg border p-4">
        <p className="text-sm font-medium">Preview laporan</p>
        <p className="text-muted-foreground mt-2 text-sm">
          Area ini akan menampilkan ringkasan pakan, sampling, kualitas air,
          mortalitas, biaya, dan panen sebelum laporan dicetak.
        </p>
      </div>
    </>
  )
}

function FormField({
  label,
  name,
  type = "text",
}: {
  label: string
  name: string
  type?: string
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium" htmlFor={name}>
        {label}
      </label>
      <input
        className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
        id={name}
        name={name}
        type={type}
      />
    </div>
  )
}

function SelectField({
  label,
  name,
  options,
}: {
  label: string
  name: string
  options: string[]
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium" htmlFor={name}>
        {label}
      </label>
      <select
        className="border-input bg-background text-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
        id={name}
        name={name}
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  )
}

function NotesField({ placeholder }: { placeholder: string }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium" htmlFor={`${placeholder}-notes`}>
        Catatan
      </label>
      <textarea
        className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 min-h-24 w-full rounded-md border px-3 py-2 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
        id={`${placeholder}-notes`}
        name="notes"
        placeholder={placeholder}
      />
    </div>
  )
}
