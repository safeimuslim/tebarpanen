import { redirect } from "next/navigation"

export default async function LegacyMortalitasAnalysisPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  redirect(`/analisis-ai?cycleId=${id}`)
}
