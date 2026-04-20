"use client"

import { usePathname, useRouter } from "next/navigation"
import { type FormEvent, useState, useTransition } from "react"

import { FormSubmitButton } from "@/components/form-submit-button"

type AnalysisCycleFormOption = {
  id: string
  mortalityLabel: string
  pondsLabel: string
  startDateLabel: string
  title: string
}

export function AnalysisCycleForm({
  defaultCycleId,
  isGenerated = false,
  options,
}: {
  defaultCycleId?: string | null
  isGenerated?: boolean
  options: AnalysisCycleFormOption[]
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [selectedCycleId, setSelectedCycleId] = useState(defaultCycleId ?? "")

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!selectedCycleId) {
      return
    }

    const targetParams = new URLSearchParams()
    targetParams.set("cycleId", selectedCycleId)
    targetParams.set("generate", "1")

    startTransition(() => {
      if (selectedCycleId === (defaultCycleId ?? "") && isGenerated) {
        router.refresh()
        return
      }

      router.replace(`${pathname}?${targetParams.toString()}`, { scroll: false })
    })
  }

  return (
    <form className="space-y-4" method="GET" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label
          className="text-sm font-medium text-[#163042]"
          htmlFor="cycleId"
        >
          Siklus aktif
        </label>
        <select
          className="border-input bg-white text-foreground h-10 w-full rounded-xl border px-3 text-sm outline-none transition-[border-color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3"
          id="cycleId"
          name="cycleId"
          onChange={(event) => setSelectedCycleId(event.target.value)}
          value={selectedCycleId}
        >
          <option value="">Pilih siklus aktif</option>
          {options.map((cycle) => (
            <option key={cycle.id} value={cycle.id}>
              {cycle.title} • {cycle.pondsLabel}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <FormSubmitButton
          className="w-full sm:w-auto"
          disabled={!selectedCycleId || isPending}
          isPending={isPending}
          pendingLabel="Sedang membuat analisis..."
          size="sm"
          type="submit"
        >
          Generate Analisis
        </FormSubmitButton>
      </div>
    </form>
  )
}
