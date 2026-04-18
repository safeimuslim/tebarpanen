import { getOpenAiConfig, createOpenAiResponse, readOpenAiOutputText } from "@/app/lib/openai"

import type { CycleOperationalInsight } from "./analysis"
import type { CycleDetailData } from "../types"
import { formatDate, formatNumber } from "../utils"

type AiCauseConfidence = "rendah" | "sedang" | "tinggi"

export type CycleAiNarrative = {
  actionPriorities: string[]
  model: string
  ownerNote: string
  probableCauses: Array<{
    confidence: AiCauseConfidence
    explanation: string
    title: string
  }>
  summary: string
}

export type CycleAiNarrativeResult =
  | {
      analysis: CycleAiNarrative
      status: "ready"
    }
  | {
      message: string
      status: "disabled" | "error"
    }

export async function generateCycleAiNarrative(
  cycle: CycleDetailData,
  insight: CycleOperationalInsight
): Promise<CycleAiNarrativeResult> {
  const { apiKey, model } = getOpenAiConfig()

  if (!apiKey) {
    return {
      message:
        "Analisis AI belum aktif karena `OPENAI_API_KEY` belum diisi di environment.",
      status: "disabled",
    }
  }

  try {
    const response = await createOpenAiResponse({
      model,
      instructions: [
        "Anda adalah analis operasional budidaya ikan air tawar.",
        "Tugas Anda bukan memberi diagnosis pasti, tetapi memberi dugaan penyebab yang masuk akal berdasarkan data.",
        "Gunakan bahasa Indonesia yang ringkas, hangat, dan mudah dipahami pemilik farm.",
        "Jangan menyebut sesuatu sebagai pasti jika datanya belum kuat.",
        "Fokus pada mortalitas, kualitas air, pakan, sampling, dan kelengkapan pencatatan.",
      ].join(" "),
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: JSON.stringify(buildAiInput(cycle, insight)),
            },
          ],
        },
      ],
      max_output_tokens: 900,
      text: {
        format: {
          type: "json_schema",
          name: "cycle_mortality_analysis",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              summary: {
                type: "string",
                description:
                  "Ringkasan 2-3 kalimat tentang kondisi mortalitas siklus dan dugaan utama.",
              },
              probableCauses: {
                type: "array",
                minItems: 1,
                maxItems: 3,
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    title: { type: "string" },
                    confidence: {
                      type: "string",
                      enum: ["rendah", "sedang", "tinggi"],
                    },
                    explanation: { type: "string" },
                  },
                  required: ["title", "confidence", "explanation"],
                },
              },
              actionPriorities: {
                type: "array",
                minItems: 2,
                maxItems: 5,
                items: { type: "string" },
              },
              ownerNote: {
                type: "string",
                description:
                  "Satu catatan singkat untuk pemilik farm tentang batasan analisis atau prioritas tindak lanjut.",
              },
            },
            required: ["summary", "probableCauses", "actionPriorities", "ownerNote"],
          },
        },
      },
    })

    const outputText = readOpenAiOutputText(response)

    if (!outputText) {
      return {
        message: "OpenAI tidak mengembalikan output teks yang bisa dibaca.",
        status: "error",
      }
    }

    const parsed = JSON.parse(outputText) as Omit<CycleAiNarrative, "model">

    return {
      analysis: {
        ...parsed,
        model,
      },
      status: "ready",
    }
  } catch (error) {
    return {
      message:
        error instanceof Error
          ? `Analisis AI belum bisa dimuat: ${error.message}`
          : "Analisis AI belum bisa dimuat saat ini.",
      status: "error",
    }
  }
}

function buildAiInput(cycle: CycleDetailData, insight: CycleOperationalInsight) {
  const totalDead = cycle.mortalityLogs.reduce((sum, log) => sum + log.deadCount, 0)
  const recentMortalityLogs = cycle.mortalityLogs.slice(0, 8).map((log) => ({
    date: formatDate(log.logDate),
    deadCount: log.deadCount,
    cause: log.cause || null,
    notes: log.notes || null,
  }))
  const recentWaterQualityLogs = cycle.waterQualityLogs.slice(0, 5).map((log) => ({
    ammoniaMgL: log.ammoniaMgL,
    date: formatDate(log.logDate),
    doMgL: log.doMgL,
    ph: log.ph,
    temperatureC: log.temperatureC,
    waterColor: log.waterColor || null,
  }))
  const recentFeedLogs = cycle.feedLogs.slice(0, 5).map((log) => ({
    date: formatDate(log.logDate),
    feedName: log.feedName,
    quantityKg: log.quantityKg,
  }))
  const recentSamplingLogs = cycle.samplingLogs.slice(0, 5).map((log) => ({
    averageLengthCm: log.averageLengthCm,
    averageWeightG: log.averageWeightG,
    date: formatDate(log.logDate),
    sampleCount: log.sampleCount,
  }))

  return {
    cycle: {
      cycleName: cycle.cycleName,
      startDate: formatDate(cycle.startDate),
      status: cycle.status,
      seedCount: cycle.seedCount,
      targetHarvestDate: formatDate(cycle.targetHarvestDate),
      totalMortality: totalDead,
      totalMortalityRate:
        cycle.seedCount > 0
          ? `${((totalDead / cycle.seedCount) * 100).toFixed(1)}%`
          : "0%",
      ponds: cycle.ponds.map((item) => item.pond.name),
    },
    ruleBasedInsight: {
      factors: insight.factors.map((factor) => ({
        description: factor.description,
        title: factor.title,
      })),
      headline: insight.headline,
      missingData: insight.missingData,
      recommendations: insight.recommendations,
      severity: insight.severity,
      summary: insight.summary,
    },
    recentOperationalData: {
      feedLogs: recentFeedLogs,
      mortalityLogs: recentMortalityLogs,
      samplingLogs: recentSamplingLogs,
      waterQualityLogs: recentWaterQualityLogs,
    },
    guidance: {
      note:
        "Gunakan data yang ada. Jika data kurang, tulis sebagai dugaan dengan confidence rendah atau sedang.",
      preferredAudience: "Pemilik farm budidaya ikan air tawar",
      style: "Ringkas, praktis, tidak terlalu teknis",
    },
    metadata: {
      generatedAt: formatDate(new Date()),
      totalFeedLogs: formatNumber(cycle.feedLogs.length),
      totalMortalityLogs: formatNumber(cycle.mortalityLogs.length),
      totalSamplingLogs: formatNumber(cycle.samplingLogs.length),
      totalWaterQualityLogs: formatNumber(cycle.waterQualityLogs.length),
    },
  }
}
