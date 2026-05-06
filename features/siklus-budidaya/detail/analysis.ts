import type { MortalityLog, WaterQualityLog } from "@/app/generated/prisma/client"

import type { CycleDetailData } from "../types"

const MS_PER_DAY = 1000 * 60 * 60 * 24

type InsightSeverity = "low" | "medium" | "high"
type InsightTone = "neutral" | "warning" | "danger" | "success"

type InsightItem = {
  description: string
  title: string
  tone: InsightTone
}

export type CycleOperationalInsight = {
  factors: InsightItem[]
  headline: string
  missingData: string[]
  recommendations: string[]
  severity: InsightSeverity
  summary: string
}

export function analyzeCycleOperationalInsight(
  cycle: CycleDetailData
): CycleOperationalInsight {
  const now = new Date()
  const totalDead = cycle.mortalityLogs.reduce((sum, log) => sum + log.deadCount, 0)
  const mortalityRate =
    cycle.seedCount > 0 ? (totalDead / cycle.seedCount) * 100 : 0
  const recentDead = getDeadCountWithinDays(cycle.mortalityLogs, now, 7)
  const previousDead = getDeadCountWithinDays(cycle.mortalityLogs, now, 14, 7)
  const latestWaterQuality = getLatestByDate(cycle.waterQualityLogs)
  const latestFeedDate = getLatestDate(cycle.feedLogs.map((log) => log.logDate))
  const latestWaterDate = getLatestDate(cycle.waterQualityLogs.map((log) => log.logDate))
  const latestSamplingDate = getLatestDate(cycle.samplingLogs.map((log) => log.logDate))
  const mortalityLogsWithCause = cycle.mortalityLogs.filter((log) => Boolean(log.cause?.trim()))

  const factors: InsightItem[] = []
  const missingData: string[] = []
  const recommendations: string[] = []

  let score = 0

  if (mortalityRate >= 15) {
    score += 3
    factors.push({
      title: "Tingkat mortalitas sudah tinggi",
      description: `${mortalityRate.toFixed(1)}% dari bibit awal sudah tercatat mati pada siklus ini.`,
      tone: "danger",
    })
    recommendations.push(
      "Prioritaskan pengecekan kualitas air, kepadatan aktual, dan riwayat perubahan pakan pada 7 hari terakhir."
    )
  } else if (mortalityRate >= 8) {
    score += 2
    factors.push({
      title: "Mortalitas perlu dipantau lebih ketat",
      description: `${mortalityRate.toFixed(1)}% dari bibit awal sudah tercatat mati dan mulai memengaruhi survival siklus.`,
      tone: "warning",
    })
  } else {
    factors.push({
      title: "Mortalitas total masih relatif terkendali",
      description:
        totalDead > 0
          ? `${mortalityRate.toFixed(1)}% dari bibit awal tercatat mati sampai hari ini.`
          : "Belum ada mortalitas yang tercatat pada siklus ini.",
      tone: "success",
    })
  }

  if (recentDead >= Math.max(20, previousDead * 1.5) && recentDead > previousDead) {
    score += 2
    factors.push({
      title: "Ada lonjakan mortalitas dalam 7 hari terakhir",
      description: `${recentDead} ekor mati tercatat dalam 7 hari terakhir, lebih tinggi dari periode 7 hari sebelumnya (${previousDead} ekor).`,
      tone: "danger",
    })
    recommendations.push(
      "Bandingkan kejadian 7 hari terakhir: perpindahan kolam, perubahan pakan, hujan deras, aerasi, atau gejala fisik ikan."
    )
  }

  if (!latestWaterQuality) {
    score += 1
    missingData.push(
      "Belum ada data kualitas air. Analisis penyebab mortalitas akan jauh lebih akurat jika ada input pH, suhu, DO, atau amonia."
    )
    recommendations.push(
      "Mulai input kualitas air secara rutin, minimal saat ada mortalitas meningkat atau perubahan perilaku ikan."
    )
  } else {
    const waterFlags = evaluateWaterQuality(latestWaterQuality)

    if (waterFlags.length) {
      score += waterFlags.some((flag) => flag.tone === "danger") ? 3 : 2
      factors.push(...waterFlags)
      recommendations.push(
        "Cek ulang kualitas air hari ini untuk memastikan nilai terakhir bukan anomali sesaat, lalu korelasikan dengan mortalitas terbaru."
      )
    }

    if (latestWaterDate && getDaysSince(latestWaterDate, now) > 7) {
      score += 1
      missingData.push(
        `Data kualitas air terakhir diinput ${getDaysSince(latestWaterDate, now)} hari lalu, sehingga pembacaan kondisi sekarang bisa sudah berubah.`
      )
    }
  }

  if (!cycle.samplingLogs.length) {
    missingData.push(
      "Belum ada data sampling. Tanpa bobot rata-rata, analisis performa pertumbuhan dan tekanan kepadatan belum bisa dibaca dengan baik."
    )
    recommendations.push(
      "Lakukan sampling berkala agar analisis AI bisa membandingkan pertumbuhan dengan pola mortalitas."
    )
  } else if (latestSamplingDate && getDaysSince(latestSamplingDate, now) > 14) {
    score += 1
    missingData.push(
      `Sampling terakhir dilakukan ${getDaysSince(latestSamplingDate, now)} hari lalu. Data pertumbuhan terbaru belum tersedia.`
    )
  }

  if (latestFeedDate && getDaysSince(latestFeedDate, now) > 3) {
    score += 1
    missingData.push(
      `Tidak ada input pakan dalam ${getDaysSince(latestFeedDate, now)} hari terakhir. Jika pakan tetap diberikan, pencatatannya belum lengkap.`
    )
  }

  if (cycle.mortalityLogs.length > 0 && mortalityLogsWithCause.length === 0) {
    missingData.push(
      "Penyebab atau gejala mortalitas belum diisi pada log yang ada, sehingga sistem belum bisa mengenali pola penyebab yang lebih spesifik."
    )
    recommendations.push(
      "Saat mencatat mortalitas, tambahkan gejala singkat seperti ikan megap-megap, luka, berenang lemah, atau air berubah warna."
    )
  }

  const severity = getSeverity(score)

  return {
    factors,
    headline: getHeadline(severity),
    missingData,
    recommendations: Array.from(new Set(recommendations)),
    severity,
    summary: getSummary({
      mortalityRate,
      previousDead,
      recentDead,
      score,
      totalDead,
    }),
  }
}

function getSummary({
  mortalityRate,
  previousDead,
  recentDead,
  score,
  totalDead,
}: {
  mortalityRate: number
  previousDead: number
  recentDead: number
  score: number
  totalDead: number
}) {
  const trendSummary =
    recentDead > previousDead
      ? `Mortalitas 7 hari terakhir meningkat dari ${previousDead} menjadi ${recentDead} ekor.`
      : recentDead > 0
        ? `${recentDead} ekor mati tercatat dalam 7 hari terakhir.`
        : "Tidak ada mortalitas baru yang tercatat dalam 7 hari terakhir."

  if (score >= 6) {
    return `Berdasarkan data yang tersedia, siklus ini menunjukkan risiko operasional tinggi. Total mortalitas saat ini ${mortalityRate.toFixed(1)}% (${totalDead} ekor). ${trendSummary}`
  }

  if (score >= 3) {
    return `Berdasarkan data yang tersedia, ada beberapa sinyal risiko yang perlu dicek lebih lanjut. Total mortalitas saat ini ${mortalityRate.toFixed(1)}% (${totalDead} ekor). ${trendSummary}`
  }

  return `Berdasarkan data yang tersedia, belum terlihat sinyal kuat yang mengarah ke masalah mortalitas besar. Total mortalitas saat ini ${mortalityRate.toFixed(1)}% (${totalDead} ekor). ${trendSummary}`
}

function getHeadline(severity: InsightSeverity) {
  if (severity === "high") {
    return "Mortalitas siklus ini perlu perhatian segera."
  }

  if (severity === "medium") {
    return "Ada beberapa faktor risiko yang perlu dicek."
  }

  return "Kondisi siklus relatif stabil, tetapi pencatatan tetap perlu dijaga."
}

function getSeverity(score: number): InsightSeverity {
  if (score >= 6) {
    return "high"
  }

  if (score >= 3) {
    return "medium"
  }

  return "low"
}

function evaluateWaterQuality(log: WaterQualityLog): InsightItem[] {
  const flags: InsightItem[] = []

  if (log.doMgL != null && log.doMgL < 4) {
    flags.push({
      title: "DO terakhir berada di bawah batas aman",
      description: `DO tercatat ${log.doMgL} mg/L. Oksigen terlarut yang rendah sering berkaitan dengan stres dan kematian ikan.`,
      tone: "danger",
    })
  }

  if (log.ammoniaMgL != null && log.ammoniaMgL >= 0.05) {
    flags.push({
      title: "Amonia terakhir cukup tinggi",
      description: `Amonia tercatat ${log.ammoniaMgL} mg/L dan berpotensi menambah stres pada ikan.`,
      tone: "danger",
    })
  } else if (log.ammoniaMgL != null && log.ammoniaMgL >= 0.02) {
    flags.push({
      title: "Amonia mulai perlu diawasi",
      description: `Amonia tercatat ${log.ammoniaMgL} mg/L. Nilai ini belum ideal untuk dipertahankan terlalu lama.`,
      tone: "warning",
    })
  }

  if (log.ph != null && (log.ph < 6.5 || log.ph > 8.5)) {
    flags.push({
      title: "pH terakhir di luar rentang nyaman",
      description: `pH tercatat ${log.ph}. Perubahan pH yang terlalu rendah atau terlalu tinggi bisa memicu stres.`,
      tone: "warning",
    })
  }

  if (log.temperatureC != null && (log.temperatureC < 24 || log.temperatureC > 32)) {
    flags.push({
      title: "Suhu air terakhir tidak ideal",
      description: `Suhu tercatat ${log.temperatureC}°C. Suhu ekstrem dapat memperburuk kondisi ikan yang sudah lemah.`,
      tone: "warning",
    })
  }

  return flags
}

function getDeadCountWithinDays(
  logs: MortalityLog[],
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

function getLatestByDate<T extends { logDate: Date }>(items: T[]) {
  return [...items].sort((a, b) => b.logDate.getTime() - a.logDate.getTime())[0] ?? null
}

function getLatestDate(dates: Date[]) {
  return [...dates].sort((a, b) => b.getTime() - a.getTime())[0] ?? null
}

function getDaysSince(date: Date, now: Date) {
  return Math.max(0, Math.floor((now.getTime() - date.getTime()) / MS_PER_DAY))
}
