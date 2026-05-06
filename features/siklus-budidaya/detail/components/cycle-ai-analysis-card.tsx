import { Bot, CircleAlert, Sparkles } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

import type { CycleAiNarrativeResult } from "../ai-analysis"

export function CycleAiAnalysisCard({
  result,
}: {
  result: CycleAiNarrativeResult
}) {
  return (
    <Card className="relative overflow-hidden border-[#d9e9e4] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbfb_100%)]">
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,rgba(18,94,138,0),rgba(18,94,138,0.45),rgba(18,94,138,0))]" />
      <div className="absolute -right-10 top-0 size-32 rounded-full bg-[#edf7ff] blur-3xl" />
      <div className="absolute -left-10 bottom-0 size-32 rounded-full bg-[#dff4ee] blur-3xl" />
      <CardHeader className="relative border-b border-[#e3efeb] pb-4">
        <div className="flex items-start gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-[#eef6f3] text-[#355565]">
            <Bot className="size-5" />
          </div>
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#eef6f3] px-3 py-1 text-xs font-medium text-[#355565]">
              <Sparkles className="size-3.5" />
              Analisis AI
            </div>
            <CardTitle className="mt-3 text-[#163042]">
              Bacaan AI dari data yang sudah tercatat
            </CardTitle>
            <CardDescription className="mt-1 max-w-3xl leading-6 text-[#5b7483]">
              Ringkasan ini membantu Anda membaca pola mortalitas dengan bahasa
              yang lebih sederhana. Gunakan sebagai evaluasi awal, bukan
              diagnosis pasti.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative pt-4 sm:pt-5">
        {result.status === "ready" ? (
          <div className="space-y-5">
            <div className="rounded-[1.6rem] border border-[#d9e9e4] bg-[linear-gradient(135deg,#f8fbfb_0%,#f2f9f6_55%,#eef7ff_100%)] px-4 py-4">
              <p className="text-xs font-medium tracking-[0.18em] text-[#6d8590] uppercase">
                Ringkasan utama
              </p>
              <p className="mt-2 text-sm leading-7 text-[#163042]">
                {result.analysis.summary}
              </p>
              <p className="mt-3 text-xs text-[#6d8590]">
                Model: {result.analysis.model}
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-[#163042] sm:text-base">
                  Kemungkinan penyebab
                </h3>
                <div className="space-y-3">
                  {result.analysis.probableCauses.map((cause, index) => (
                    <div
                      className={cn(
                        "rounded-2xl border px-4 py-4",
                        cause.confidence === "tinggi"
                          ? "border-destructive/20 bg-[linear-gradient(180deg,rgba(255,245,245,0.8)_0%,#ffffff_100%)]"
                          : cause.confidence === "sedang"
                            ? "border-[#F5DFC0] bg-[linear-gradient(180deg,#fffaf0_0%,#ffffff_100%)]"
                            : "border-primary/20 bg-[linear-gradient(180deg,rgba(238,246,243,0.9)_0%,#ffffff_100%)]"
                      )}
                      key={cause.title}
                    >
                      <p className="text-xs font-medium tracking-[0.14em] text-[#6d8590] uppercase">
                        Dugaan {index + 1}
                      </p>
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <p className="font-medium text-[#163042]">{cause.title}</p>
                        <span
                          className={cn(
                            "inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium",
                            cause.confidence === "tinggi"
                              ? "bg-destructive/10 text-destructive"
                              : cause.confidence === "sedang"
                                ? "bg-[#FFF5E2] text-[#A87412]"
                                : "bg-primary/10 text-primary"
                          )}
                        >
                          Tingkat keyakinan AI: {cause.confidence}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-[#5b7483]">
                        {cause.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-[#163042] sm:text-base">
                    Yang paling perlu dicek lebih dulu
                  </h3>
                  <ul className="space-y-2">
                    {result.analysis.actionPriorities.map((item, index) => (
                      <li
                        className="flex items-start gap-3 rounded-2xl border border-[#d9e9e4] bg-white/90 px-4 py-3 text-sm leading-6 text-[#163042]"
                        key={item}
                      >
                        <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#eef6f3] text-xs font-semibold text-[#355565]">
                          {index + 1}
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-[#d9e9e4] bg-[linear-gradient(180deg,#fbfdfd_0%,#f6fbf9_100%)] px-4 py-4">
                  <h3 className="font-medium text-[#163042]">
                    Catatan singkat untuk Anda
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#5b7483]">
                    {result.analysis.ownerNote}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3 rounded-2xl border border-dashed border-[#d9e9e4] bg-[#fbfdfd] px-4 py-4">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-[#eef6f3] text-[#355565]">
              <CircleAlert className="size-4.5" />
            </div>
            <div>
              <p className="font-medium text-[#163042]">
                {result.status === "disabled"
                  ? "Analisis AI belum aktif"
                  : "Analisis AI belum tersedia"}
              </p>
              <p className="mt-1 text-sm leading-6 text-[#5b7483]">
                {result.message}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
