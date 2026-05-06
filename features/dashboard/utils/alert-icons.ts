import {
  CalendarDays,
  FlaskConical,
  Package,
  TrendingDown,
} from "lucide-react"

export function getAlertIcon(
  type: "feed" | "harvest" | "mortality" | "water-quality"
) {
  switch (type) {
    case "feed":
      return Package
    case "water-quality":
      return FlaskConical
    case "mortality":
      return TrendingDown
    case "harvest":
    default:
      return CalendarDays
  }
}
