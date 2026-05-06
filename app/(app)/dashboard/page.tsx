import {
  ActiveCyclesOverview,
  DashboardAttentionGrid,
  DashboardHero,
  DashboardSummaryCards,
} from "@/features/dashboard/components/dashboard-sections"
import { getDashboardPageData } from "@/features/dashboard/queries"

export default async function Dashboard() {
  const data = await getDashboardPageData()

  return (
    <div className="-m-4 space-y-6 bg-[linear-gradient(180deg,#f7fbfa_0%,#edf6f4_100%)] p-4 sm:-m-6 sm:p-6">
      <DashboardHero data={data} />
      <DashboardSummaryCards data={data} />
      <DashboardAttentionGrid data={data} />
      <ActiveCyclesOverview data={data} />
    </div>
  )
}
