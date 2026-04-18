import Link from "next/link"
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Droplets,
  Fish,
  FlaskConical,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  Waves,
} from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

import { generateCycleAiNarrative } from "../siklus-budidaya/[id]/ai-analysis"
import { analyzeCycleOperationalInsight } from "../siklus-budidaya/[id]/analysis"
import { CycleAiAnalysisCard } from "../siklus-budidaya/[id]/components/cycle-ai-analysis-card"
import { CycleOperationalInsightCard } from "../siklus-budidaya/[id]/components/cycle-operational-insight-card"
import {
  formatCurrency,
  formatDate,
  formatNumber,
  getSurvivalRate,
} from "../siklus-budidaya/utils"
import { AnalysisCycleForm } from "./components/analysis-cycle-form"
import { getAiAnalysisPageData } from "./queries"

const MS_PER_DAY = 1000 * 60 * 60 * 24

export default async function AnalisisAiPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const query = await searchParams
  const cycleId = readCycleId(query.cycleId)
  const shouldGenerate = readGenerateFlag(query.generate)
  const { cycles, selectedCycle } = await getAiAnalysisPageData(cycleId)

  if (!cycles.length) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-muted-foreground text-sm">Analisis AI</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Analisis AI
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm">
            Pilih siklus aktif untuk membuat analisis AI berdasarkan data
            operasional yang sudah tercatat.
          </p>
        </div>

        <Card className="border-[#d9e9e4]">
          <CardContent className="py-10 text-center">
            <h2 className="font-medium text-[#163042]">
              Belum ada siklus aktif untuk dianalisis
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#5b7483]">
              Tambahkan atau aktifkan siklus budidaya terlebih dulu agar fitur
              AI bisa membaca pola mortalitas dan operasional.
            </p>
            <div className="mt-4">
              <Link
                className={buttonVariants({ size: "sm" })}
                href="/siklus-budidaya"
              >
                Buka Siklus Budidaya
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const insight =
    shouldGenerate && selectedCycle
      ? analyzeCycleOperationalInsight(selectedCycle)
      : null
  const aiNarrative =
    shouldGenerate && selectedCycle && insight
      ? await generateCycleAiNarrative(selectedCycle, insight)
      : null
  const totalDead = selectedCycle
    ? selectedCycle.mortalityLogs.reduce(
        (sum, log) => sum + log.deadCount,
        0
      )
    : 0
  const now = new Date()
  const recentDead = shouldGenerate && selectedCycle
    ? getDeadCountWithinDays(selectedCycle.mortalityLogs, now, 7)
    : null
  const previousDead = shouldGenerate && selectedCycle
    ? getDeadCountWithinDays(selectedCycle.mortalityLogs, now, 14, 7)
    : null
  const latestWater = shouldGenerate && selectedCycle
    ? [...selectedCycle.waterQualityLogs].sort(
        (a, b) => b.logDate.getTime() - a.logDate.getTime()
      )[0]
    : null
  const latestFeed = shouldGenerate && selectedCycle
    ? [...selectedCycle.feedLogs].sort(
        (a, b) => b.logDate.getTime() - a.logDate.getTime()
      )[0]
    : null
  const totalFeedKg = shouldGenerate && selectedCycle
    ? selectedCycle.feedLogs.reduce((sum, log) => sum + log.quantityKg, 0)
    : null
  const totalFeedCost = shouldGenerate && selectedCycle
    ? selectedCycle.feedLogs.reduce(
        (sum, log) => sum + (Number(log.priceTotal?.toString() ?? 0) || 0),
        0
      )
    : null
  const recentDeadCount = recentDead ?? 0
  const previousDeadCount = previousDead ?? 0
  const totalFeedKgValue = totalFeedKg ?? 0
  const totalFeedCostValue = totalFeedCost ?? 0
  const severityTheme = insight ? getSeverityTheme(insight.severity) : null
  const SeverityIcon = severityTheme?.Icon ?? ShieldCheck
  const actionSummary =
    shouldGenerate && selectedCycle && insight
      ? buildActionSummary({
          aiNarrative,
          insight,
        })
      : null
  const cycleOptions = cycles.map((cycle) => ({
    id: cycle.id,
    mortalityLabel: `${formatNumber(cycle.mortalityCount)} ekor mati`,
    pondsLabel: cycle.pondsLabel,
    startDateLabel: formatDate(cycle.startDate),
    title: cycle.title,
  }))

  return (
    <div className="space-y-5 sm:space-y-6">
      <section className="overflow-hidden rounded-[1.75rem] border border-[#d9e9e4] bg-[linear-gradient(145deg,#163042_0%,#125e8a_58%,#0f9d8a_100%)] p-5 text-white sm:rounded-[2rem] sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3.5">
            <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/85">
              Analisis AI
            </div>
            <div className="space-y-2">
              <p className="text-sm text-white/74">Analisis operasional</p>
              <h1 className="text-[1.95rem] leading-tight font-semibold tracking-tight sm:text-4xl">
                Dugaan penyebab mortalitas dari data budidaya Anda
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-white/82 sm:text-base sm:leading-7">
                Pilih satu siklus aktif, lalu tekan tombol generate untuk
                membuat analisis AI dari data operasional yang sudah tercatat.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5 pt-2 text-xs text-white/82">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1">
                <span className="font-medium">1</span>
                Pilih siklus aktif
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1">
                <ArrowRight className="size-3.5" />
                Generate analisis
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1">
                <CheckCircle2 className="size-3.5" />
                Baca prioritas tindakan
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:gap-6">
        <Card className="border-[#d9e9e4] bg-white">
          <CardHeader className="pb-4">
            <div className="flex items-start gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-[#eef6f3] text-[#355565]">
                <Sparkles className="size-5" />
              </div>
              <div>
                <CardTitle>Pilih Siklus</CardTitle>
                <CardDescription className="mt-1 leading-6">
                  Hanya siklus aktif yang ditampilkan. Pilih satu siklus lalu
                  tekan tombol untuk mulai membuat analisis.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <AnalysisCycleForm
              defaultCycleId={selectedCycle?.id ?? null}
              isGenerated={shouldGenerate}
              options={cycleOptions}
            />
          </CardContent>
        </Card>
      </section>

      {shouldGenerate && selectedCycle ? (
        <>
          <section className="space-y-3">
            <SectionEyebrow
              description="Versi singkat ini membantu Anda langsung tahu apa masalah utamanya, apa yang dicek hari ini, dan data apa yang perlu dilengkapi berikutnya."
              label="Action Summary"
            />
            <ActionSummaryCard
              severity={insight!.severity}
              summary={actionSummary!}
            />
          </section>

          <section className="space-y-3">
            <SectionEyebrow
              description="Baca hasil mulai dari ringkasan umum, lalu lanjut ke dugaan penyebab dan tindakan yang disarankan."
              label="Hasil Analisis"
            />

            <Card
              className={cn(
                "relative overflow-hidden border-[#d9e9e4]",
                severityTheme?.cardClass
              )}
            >
              <div
                className={cn(
                  "absolute inset-x-0 top-0 h-px",
                  severityTheme?.lineClass
                )}
              />
              <div
                className={cn(
                  "absolute -top-16 right-0 size-36 rounded-full blur-3xl",
                  severityTheme?.orbPrimaryClass
                )}
              />
              <div
                className={cn(
                  "absolute bottom-0 left-0 size-28 rounded-full blur-3xl",
                  severityTheme?.orbSecondaryClass
                )}
              />
              <CardContent className="relative flex flex-col gap-5 p-4 sm:p-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3.5">
                  <div
                    className={cn(
                      "inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium",
                      severityTheme?.badgeClass
                    )}
                  >
                    {insight?.severity === "high"
                      ? "Perlu perhatian segera"
                      : insight?.severity === "medium"
                        ? "Perlu dipantau dekat"
                        : "Kondisi cukup stabil"}
                  </div>
                  <div>
                    <p className="text-sm text-[#5b7483]">
                      Hasil untuk {selectedCycle.title}
                    </p>
                    <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#163042] sm:text-2xl">
                      {insight?.headline}
                    </h2>
                    <p className="mt-2 max-w-3xl text-sm leading-7 text-[#5b7483]">
                      {insight?.summary}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "flex items-start gap-3 rounded-2xl border px-4 py-3",
                      severityTheme?.statusPanelClass
                    )}
                  >
                    <div
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-2xl",
                        severityTheme?.statusIconWrapClass
                      )}
                    >
                      <SeverityIcon className="size-4.5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#163042]">
                        {severityTheme?.title}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-[#5b7483]">
                        {severityTheme?.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[420px]">
                  <SummaryStat
                    label="Bibit awal"
                    note="Jumlah tebar"
                    tone={insight?.severity}
                    value={`${formatNumber(selectedCycle.seedCount)} ekor`}
                    variant="highlight"
                  />
                  <SummaryStat
                    label="Mortalitas tercatat"
                    note="Akumulasi saat ini"
                    tone={insight?.severity}
                    value={`${formatNumber(totalDead)} ekor`}
                    variant="highlight"
                  />
                  <SummaryStat
                    label="Kolam aktif"
                    note="Lingkup analisis"
                    tone={insight?.severity}
                    value={selectedCycle.pondsLabel}
                    variant="highlight"
                  />
                </div>
              </CardContent>
            </Card>
          </section>

          <CycleAiAnalysisCard result={aiNarrative!} />

          <CycleOperationalInsightCard insight={insight!} />

          <section className="space-y-3">
            <SectionEyebrow
              description="Data ini membantu Anda membaca apakah hasil analisis didukung oleh catatan operasional terbaru."
              label="Data Pendukung"
            />
            <Card className="border-[#d9e9e4]">
              <CardHeader className="pb-4">
                <CardTitle>Data pendukung terakhir</CardTitle>
                <CardDescription>
                  Ringkasan input operasional yang paling sering membantu membaca
                  hasil analisis mortalitas.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <MiniMetric
                  icon={Activity}
                  label="Kondisi 7 hari terakhir"
                  note="Membantu melihat apakah kondisi terbaru membaik atau memburuk."
                  value={
                    recentDeadCount > previousDeadCount
                      ? `Naik ${formatNumber(recentDeadCount - previousDeadCount)} ekor`
                      : previousDeadCount > recentDeadCount
                        ? `Turun ${formatNumber(previousDeadCount - recentDeadCount)} ekor`
                        : "Stabil"
                  }
                />
                <MiniMetric
                  icon={Fish}
                  label="Survival Rate"
                  note="Persentase perkiraan ikan yang masih hidup dibanding jumlah tebar awal."
                  value={getSurvivalRate(selectedCycle.seedCount, totalDead)}
                />
                <MiniMetric
                  icon={Waves}
                  label="Pakan tercatat"
                  note={
                    latestFeed
                      ? `Update terakhir ${formatDate(latestFeed.logDate)} • biaya ${formatCurrency(totalFeedCostValue)}`
                      : "Belum ada log pakan"
                  }
                  value={`${formatNumber(totalFeedKgValue)} kg`}
                />
                <MiniMetric
                  icon={Droplets}
                  label="Kualitas air terakhir"
                  note={
                    latestWater
                      ? `pH ${formatNullableNumber(latestWater.ph)} • DO ${formatNullableNumber(latestWater.doMgL)}`
                      : "Belum ada log kualitas air"
                  }
                  value={latestWater ? formatDate(latestWater.logDate) : "-"}
                />
              </CardContent>
            </Card>
          </section>
        </>
      ) : (
        <Card className="border-[#d9e9e4] bg-white">
          <CardHeader>
            <CardTitle>
              {selectedCycle
                ? "Siap membuat analisis"
                : "Mulai dari memilih siklus aktif"}
            </CardTitle>
            <CardDescription>
              Setelah analisis dibuat, hasil akan ditampilkan dengan urutan yang
              mudah dibaca untuk pemilik farm dan tim operasional.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            <AnalysisStep
              description={
                selectedCycle
                  ? `Siklus ${selectedCycle.title} sudah siap dianalisis.`
                  : "Pilih satu siklus aktif agar sistem tahu data mana yang akan dibaca."
              }
              step="1"
              title={selectedCycle ? "Siklus sudah dipilih" : "Pilih siklus aktif"}
            />
            <AnalysisStep
              description="Tekan tombol Generate Analisis untuk memproses data operasional yang sudah tercatat."
              step="2"
              title="Buat analisis"
            />
            <AnalysisStep
              description="Halaman ini akan menampilkan ringkasan AI, prioritas tindakan, dan data pendukung terbaru."
              step="3"
              title="Baca hasilnya"
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function readCycleId(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

function readGenerateFlag(value: string | string[] | undefined) {
  const resolvedValue = Array.isArray(value) ? value[0] : value
  return resolvedValue === "1"
}

function MiniMetric({
  icon: Icon,
  label,
  note,
  value,
}: {
  icon: typeof Fish
  label: string
  note: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-[#d9e9e4] bg-[#fbfdfd] px-4 py-4">
      <div className="flex items-start gap-3">
        <div className="flex size-10 items-center justify-center rounded-2xl bg-[#eef6f3] text-[#355565]">
          <Icon className="size-4.5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-[#163042]">{label}</p>
          <p className="mt-1 text-base font-semibold text-[#163042]">{value}</p>
          <p className="mt-1 text-sm leading-6 text-[#5b7483]">{note}</p>
        </div>
      </div>
    </div>
  )
}

function SummaryStat({
  label,
  note,
  tone,
  value,
  variant = "default",
}: {
  label: string
  note: string
  tone?: "high" | "low" | "medium"
  value: string
  variant?: "default" | "highlight"
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border px-4 py-3.5",
        variant === "highlight"
          ? tone === "high"
            ? "border-destructive/15 bg-white/85 backdrop-blur"
            : tone === "medium"
              ? "border-[#F0DFC2] bg-white/85 backdrop-blur"
              : "border-primary/15 bg-white/85 backdrop-blur"
          : "border-[#d9e9e4] bg-[#fbfdfd]"
      )}
    >
      <p className="text-xs font-medium tracking-[0.14em] text-[#6d8590] uppercase">
        {label}
      </p>
      <p className="mt-2 text-base font-semibold text-[#163042] sm:text-lg">
        {value}
      </p>
      <p className="mt-1 text-xs leading-5 text-[#5b7483]">{note}</p>
    </div>
  )
}

function ActionSummaryCard({
  severity,
  summary,
}: {
  severity: "high" | "low" | "medium"
  summary: {
    nextRecord: string
    todayCheck: string
    topIssue: string
  }
}) {
  return (
    <Card
      className={cn(
        "border-[#d9e9e4]",
        severity === "high"
          ? "bg-[linear-gradient(180deg,#ffffff_0%,#fff7f7_100%)]"
          : severity === "medium"
            ? "bg-[linear-gradient(180deg,#ffffff_0%,#fffaf3_100%)]"
            : "bg-[linear-gradient(180deg,#ffffff_0%,#f6fbf9_100%)]"
      )}
    >
      <CardContent className="grid gap-3 p-4 sm:p-5 lg:grid-cols-3">
        <ActionSummaryItem
          description={summary.topIssue}
          icon={TriangleAlert}
          title="Apa masalah utamanya"
          tone={severity}
        />
        <ActionSummaryItem
          description={summary.todayCheck}
          icon={ClipboardList}
          title="Apa yang dicek hari ini"
          tone={severity}
        />
        <ActionSummaryItem
          description={summary.nextRecord}
          icon={FlaskConical}
          title="Apa yang perlu dicatat berikutnya"
          tone={severity}
        />
      </CardContent>
    </Card>
  )
}

function ActionSummaryItem({
  description,
  icon: Icon,
  title,
  tone,
}: {
  description: string
  icon: typeof TriangleAlert
  title: string
  tone: "high" | "low" | "medium"
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border px-4 py-4",
        tone === "high"
          ? "border-destructive/15 bg-white"
          : tone === "medium"
            ? "border-[#F0DFC2] bg-white"
            : "border-primary/15 bg-white"
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-2xl",
            tone === "high"
              ? "bg-destructive/10 text-destructive"
              : tone === "medium"
                ? "bg-[#FFF5E2] text-[#A87412]"
                : "bg-primary/10 text-primary"
          )}
        >
          <Icon className="size-4.5" />
        </div>
        <div>
          <p className="text-sm font-medium text-[#163042]">{title}</p>
          <p className="mt-1 text-sm leading-6 text-[#5b7483]">{description}</p>
        </div>
      </div>
    </div>
  )
}

function buildActionSummary({
  aiNarrative,
  insight,
}: {
  aiNarrative:
    | Awaited<ReturnType<typeof generateCycleAiNarrative>>
    | null
  insight: NonNullable<ReturnType<typeof analyzeCycleOperationalInsight>>
}) {
  const topIssue =
    aiNarrative?.status === "ready"
      ? aiNarrative.analysis.probableCauses[0]?.title ??
        insight.factors[0]?.title ??
        "Belum ada masalah utama yang menonjol dari data saat ini."
      : insight.factors[0]?.title ??
        "Belum ada masalah utama yang menonjol dari data saat ini."

  const todayCheck =
    aiNarrative?.status === "ready"
      ? aiNarrative.analysis.actionPriorities[0] ??
        insight.recommendations[0] ??
        "Lanjutkan pemantauan rutin kolam dan catat perubahan penting hari ini."
      : insight.recommendations[0] ??
        "Lanjutkan pemantauan rutin kolam dan catat perubahan penting hari ini."

  const nextRecord =
    insight.missingData[0] ??
    "Data inti sudah cukup. Lanjutkan pencatatan rutin agar analisis berikutnya tetap akurat."

  return {
    nextRecord,
    todayCheck,
    topIssue,
  }
}

function getSeverityTheme(severity: "high" | "low" | "medium") {
  if (severity === "high") {
    return {
      badgeClass: "bg-destructive/10 text-destructive",
      cardClass:
        "bg-[linear-gradient(180deg,#ffffff_0%,#fff5f5_46%,#fffaf7_100%)]",
      description:
        "Ada sinyal yang cukup kuat bahwa siklus ini butuh pengecekan cepat agar masalah tidak meluas.",
      Icon: TriangleAlert,
      lineClass:
        "bg-[linear-gradient(90deg,rgba(220,38,38,0),rgba(220,38,38,0.55),rgba(220,38,38,0))]",
      orbPrimaryClass: "bg-[#fde4e4]",
      orbSecondaryClass: "bg-[#fff0da]",
      statusIconWrapClass: "bg-destructive/10 text-destructive",
      statusPanelClass: "border-destructive/15 bg-white/80",
      title: "Status saat ini: perlu perhatian segera",
    }
  }

  if (severity === "medium") {
    return {
      badgeClass: "bg-[#FFF5E2] text-[#A87412]",
      cardClass:
        "bg-[linear-gradient(180deg,#ffffff_0%,#fffaf0_44%,#fdfbf5_100%)]",
      description:
        "Belum darurat, tetapi ada beberapa tanda yang layak dipantau lebih dekat dalam waktu dekat.",
      Icon: Activity,
      lineClass:
        "bg-[linear-gradient(90deg,rgba(168,116,18,0),rgba(168,116,18,0.5),rgba(168,116,18,0))]",
      orbPrimaryClass: "bg-[#fff0cf]",
      orbSecondaryClass: "bg-[#fef6e6]",
      statusIconWrapClass: "bg-[#FFF5E2] text-[#A87412]",
      statusPanelClass: "border-[#F0DFC2] bg-white/80",
      title: "Status saat ini: perlu dipantau dekat",
    }
  }

  return {
    badgeClass: "bg-primary/10 text-primary",
    cardClass:
      "bg-[linear-gradient(180deg,#ffffff_0%,#f4faf8_46%,#eef7ff_100%)]",
    description:
      "Data saat ini belum menunjukkan tekanan besar, tetapi pencatatan rutin tetap penting agar kondisi tetap terjaga.",
    Icon: ShieldCheck,
    lineClass:
      "bg-[linear-gradient(90deg,rgba(15,157,138,0),rgba(15,157,138,0.45),rgba(15,157,138,0))]",
    orbPrimaryClass: "bg-[#dff4ee]",
    orbSecondaryClass: "bg-[#edf7ff]",
    statusIconWrapClass: "bg-primary/10 text-primary",
    statusPanelClass: "border-primary/15 bg-white/80",
    title: "Status saat ini: kondisi cukup stabil",
  }
}

function AnalysisStep({
  description,
  step,
  title,
}: {
  description: string
  step: string
  title: string
}) {
  return (
    <div className="rounded-2xl border border-[#d9e9e4] bg-[#fbfdfd] px-4 py-4">
      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#eef6f3] text-sm font-semibold text-[#355565]">
          {step}
        </div>
        <div>
          <h3 className="font-medium text-[#163042]">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-[#5b7483]">{description}</p>
        </div>
      </div>
    </div>
  )
}

function SectionEyebrow({
  description,
  label,
}: {
  description: string
  label: string
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium tracking-[0.18em] text-[#6d8590] uppercase">
          {label}
        </span>
        <span className="h-px flex-1 bg-[linear-gradient(90deg,rgba(15,157,138,0.35),rgba(15,157,138,0))]" />
      </div>
      <p className="max-w-3xl text-sm leading-6 text-[#5b7483]">
        {description}
      </p>
    </div>
  )
}

function getDeadCountWithinDays(
  logs: Array<{ deadCount: number; logDate: Date }>,
  now: Date,
  endDaysAgo: number,
  startDaysAgo = 0
) {
  return logs.reduce((sum, log) => {
    const diff = getDaysSince(log.logDate, now)

    if (diff >= startDaysAgo && diff < endDaysAgo) {
      return sum + log.deadCount
    }

    return sum
  }, 0)
}

function getDaysSince(date: Date, now: Date) {
  return Math.max(0, Math.floor((now.getTime() - date.getTime()) / MS_PER_DAY))
}

function formatNullableNumber(value?: number | null) {
  if (value == null) {
    return "-"
  }

  return formatNumber(value)
}
