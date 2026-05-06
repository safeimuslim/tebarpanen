export type CycleDetailTab =
  | "ringkasan"
  | "biaya"
  | "panen"
  | "pakan"
  | "mortalitas"
  | "sampling"
  | "pengobatan"
  | "kualitas-air"

export function readDetailTab(value: string | string[] | undefined): CycleDetailTab {
  const tab = Array.isArray(value) ? value[0] : value

  if (
    tab === "biaya" ||
    tab === "panen" ||
    tab === "pakan" ||
    tab === "mortalitas" ||
    tab === "sampling" ||
    tab === "pengobatan" ||
    tab === "kualitas-air"
  ) {
    return tab
  }

  return "ringkasan"
}

export function getProfitValueClassName(value: number) {
  if (value > 0) {
    return "text-primary"
  }

  if (value < 0) {
    return "text-destructive"
  }

  return undefined
}
