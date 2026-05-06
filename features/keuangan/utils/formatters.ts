export function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    currency: "IDR",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value)
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("id-ID").format(value)
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
