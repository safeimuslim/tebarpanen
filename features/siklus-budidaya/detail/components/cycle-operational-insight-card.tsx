import { AlertTriangle, ClipboardList, FlaskConical, Sparkles } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

import type { CycleOperationalInsight } from "../analysis"

export function CycleOperationalInsightCard({
  insight,
}: {
  insight: CycleOperationalInsight
}) {
  const theme = getSeverityTheme(insight.severity)

  return (
    <Card className={cn("relative overflow-hidden border-[#d9e9e4]", theme.cardClass)}>
      <div className={cn("absolute inset-x-0 top-0 h-px", theme.lineClass)} />
      <div className={cn("absolute right-0 top-0 size-36 rounded-full blur-3xl", theme.orbClass)} />
      <CardHeader className="relative border-b border-[#e3efeb] pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#eef6f3] px-3 py-1 text-xs font-medium text-[#355565]">
              <Sparkles className="size-3.5" />
              Prioritas tindakan
            </div>
            <CardTitle className="text-[#163042]">{insight.headline}</CardTitle>
            <CardDescription className="max-w-3xl leading-6 text-[#5b7483]">
              Bagian ini merangkum apa yang perlu dicek lebih dulu, tindakan
              awal yang paling masuk akal, dan catatan data yang masih bisa
              dilengkapi.
            </CardDescription>
          </div>

          <span
            className={cn(
              "inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium",
              theme.badgeClass
            )}
          >
            {insight.severity === "high"
              ? "Perlu perhatian segera"
              : insight.severity === "medium"
                ? "Perlu dipantau dekat"
                : "Cukup stabil"}
          </span>
        </div>

      </CardHeader>

      <CardContent className="relative grid gap-5 pt-4 sm:pt-5">
        <div className={cn("space-y-3 rounded-[1.65rem] border bg-white/75 p-4 sm:p-5", theme.panelClass)}>
          <SectionHeading
            description="Hal utama yang paling memengaruhi kesimpulan saat ini."
            icon={AlertTriangle}
            title="Prioritas pengecekan"
          />

          <div className="space-y-3">
            {insight.factors.map((factor) => (
              <div
                className={cn(
                  "rounded-2xl border px-4 py-4",
                  factor.tone === "danger"
                    ? "border-destructive/20 bg-[linear-gradient(180deg,rgba(255,245,245,0.85)_0%,#ffffff_100%)]"
                    : factor.tone === "warning"
                      ? "border-[#F5DFC0] bg-[linear-gradient(180deg,#fffaf0_0%,#ffffff_100%)]"
                      : factor.tone === "success"
                        ? "border-primary/20 bg-[linear-gradient(180deg,rgba(238,246,243,0.9)_0%,#ffffff_100%)]"
                        : "border-[#d9e9e4] bg-white"
                )}
                key={factor.title}
              >
                <p
                  className={cn(
                    "font-medium",
                    factor.tone === "danger"
                      ? "text-destructive"
                      : factor.tone === "warning"
                        ? "text-[#A87412]"
                        : factor.tone === "success"
                          ? "text-primary"
                          : "text-[#163042]"
                  )}
                >
                  {factor.title}
                </p>
                <p className="mt-1 text-sm leading-6 text-[#5b7483]">
                  {factor.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className={cn("space-y-3 rounded-[1.65rem] border bg-white/75 p-4 sm:p-5", theme.panelClass)}>
          <SectionHeading
            description="Langkah sederhana yang paling masuk akal untuk dilakukan lebih dulu."
            icon={ClipboardList}
            title="Tindakan yang disarankan"
          />

          {insight.recommendations.length ? (
            <ul className="space-y-2">
              {insight.recommendations.map((item, index) => (
                <li
                  className="flex items-start gap-3 rounded-2xl border border-[#d9e9e4] bg-white px-4 py-3 text-sm leading-6 text-[#163042]"
                  key={item}
                >
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#eef6f3] text-xs font-semibold text-[#355565]">
                    {index + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyHint text="Belum ada tindakan khusus yang perlu diprioritaskan dari data saat ini." />
          )}
        </div>

        <div className={cn("space-y-3 rounded-[1.65rem] border bg-white/75 p-4 sm:p-5", theme.panelClass)}>
          <SectionHeading
            description="Catatan ini membantu Anda tahu bagian mana yang masih bisa dilengkapi agar hasil analisis makin kuat."
            icon={FlaskConical}
            title="Data yang masih bisa dilengkapi"
          />

          {insight.missingData.length ? (
            <ul className="space-y-2">
              {insight.missingData.map((item, index) => (
                <li
                  className="flex items-start gap-3 rounded-2xl border border-[#d9e9e4] bg-white px-4 py-3 text-sm leading-6 text-[#5b7483]"
                  key={item}
                >
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#eef6f3] text-xs font-semibold text-[#355565]">
                    {index + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyHint text="Data inti sudah cukup untuk membaca pola dasar mortalitas pada siklus ini." />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function getSeverityTheme(severity: "high" | "low" | "medium") {
  if (severity === "high") {
    return {
      badgeClass: "bg-destructive/10 text-destructive",
      cardClass:
        "bg-[linear-gradient(180deg,#ffffff_0%,#fff5f5_45%,#fffaf7_100%)]",
      lineClass:
        "bg-[linear-gradient(90deg,rgba(220,38,38,0),rgba(220,38,38,0.45),rgba(220,38,38,0))]",
      orbClass: "bg-[#fde6e6]",
      panelClass: "border-destructive/10",
    }
  }

  if (severity === "medium") {
    return {
      badgeClass: "bg-[#FFF5E2] text-[#A87412]",
      cardClass:
        "bg-[linear-gradient(180deg,#ffffff_0%,#fffaf0_45%,#fdfbf5_100%)]",
      lineClass:
        "bg-[linear-gradient(90deg,rgba(168,116,18,0),rgba(168,116,18,0.45),rgba(168,116,18,0))]",
      orbClass: "bg-[#fff1d5]",
      panelClass: "border-[#F0DFC2]",
    }
  }

  return {
    badgeClass: "bg-primary/10 text-primary",
    cardClass:
      "bg-[linear-gradient(180deg,#ffffff_0%,#f7fbfa_45%,#eef7ff_100%)]",
    lineClass:
      "bg-[linear-gradient(90deg,rgba(15,157,138,0),rgba(15,157,138,0.4),rgba(15,157,138,0))]",
    orbClass: "bg-[#e7f7f1]",
    panelClass: "border-primary/10",
  }
}

function EmptyHint({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#d9e9e4] bg-white px-4 py-3 text-sm leading-6 text-[#5b7483]">
      {text}
    </div>
  )
}

function SectionHeading({
  description,
  icon: Icon,
  title,
}: {
  description: string
  icon: typeof AlertTriangle
  title: string
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-10 items-center justify-center rounded-2xl bg-[#eef6f3] text-[#355565]">
        <Icon className="size-4.5" />
      </div>
      <div>
        <h3 className="font-medium text-[#163042]">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-[#5b7483]">{description}</p>
      </div>
    </div>
  )
}
