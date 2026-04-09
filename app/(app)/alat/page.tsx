import { EquipmentPage } from "./components/equipment-page"
import { getEquipmentPageData } from "./queries"

export default async function AlatPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const data = await getEquipmentPageData(searchParams)

  return <EquipmentPage {...data} />
}
