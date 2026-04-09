import { PondPage } from "./components/pond-page"
import { getPondPageData } from "./queries"

export default async function KolamPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const data = await getPondPageData(searchParams)

  return <PondPage {...data} />
}
