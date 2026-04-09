import { CyclePage } from "./components/cycle-page"
import { getCyclePageData } from "./queries"

export default async function SiklusBudidayaPage() {
  const data = await getCyclePageData()

  return <CyclePage {...data} />
}
