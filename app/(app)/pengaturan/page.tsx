import Link from "next/link"
import {
  Bell,
  ChevronRight,
  KeyRound,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const settingsCards = [
  {
    title: "User",
    description: "Tambah dan kelola akun karyawan yang bisa mengakses aplikasi.",
    href: "/pengaturan/user",
    icon: Users,
  },
  {
    title: "Role & Akses",
    description: "Atur hak akses untuk owner, admin, dan pekerja.",
    href: "/pengaturan/role-akses",
    icon: ShieldCheck,
  },
  {
    title: "Keamanan",
    description: "Wireframe pengaturan password, sesi login, dan audit akses.",
    href: "/pengaturan",
    icon: KeyRound,
  },
  {
    title: "Notifikasi",
    description: "Wireframe pengingat sampling, pakan, mortalitas, dan panen.",
    href: "/pengaturan",
    icon: Bell,
  },
]

export default function PengaturanPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-muted-foreground text-sm">Pengaturan</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Pengaturan
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-sm">
          Kelola akses pengguna, keamanan akun, dan preferensi operasional
          aplikasi.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <SummaryCard label="Total User" value="8" />
        <SummaryCard label="Admin" value="2" />
        <SummaryCard label="Pekerja" value="5" />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {settingsCards.map((item) => {
          const Icon = item.icon

          return (
            <Link
              className="border-border bg-card text-card-foreground hover:bg-muted/50 rounded-lg border p-5 shadow-sm transition-colors"
              href={item.href}
              key={item.title}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
                  <Icon className="size-5" />
                </div>
                <ChevronRight className="text-muted-foreground size-4" />
              </div>
              <h2 className="mt-4 font-semibold">{item.title}</h2>
              <p className="text-muted-foreground mt-2 text-sm">
                {item.description}
              </p>
            </Link>
          )
        })}
      </section>

      <section className="border-border bg-card text-card-foreground rounded-lg border p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
              <Settings className="size-5" />
            </div>
            <div>
              <h2 className="font-semibold">Preferensi Aplikasi</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Wireframe untuk pengaturan default farm, format laporan, dan
                satuan pengukuran.
              </p>
            </div>
          </div>
          <Link
            className={cn(buttonVariants({ variant: "outline" }), "w-fit")}
            href="/pengaturan"
          >
            Atur Nanti
          </Link>
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
