import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

type ListPaginationProps = {
  currentPage: number
  pathname: string
  searchParams: Record<string, string | undefined>
  totalPages: number
}

export function ListPagination({
  currentPage,
  pathname,
  searchParams,
  totalPages,
}: ListPaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  const pages = buildPageItems(currentPage, totalPages)

  return (
    <Pagination className="justify-between">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            aria-disabled={currentPage <= 1}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : undefined}
            href={createPageHref(pathname, searchParams, currentPage - 1)}
            text="Sebelumnya"
          />
        </PaginationItem>
      </PaginationContent>

      <PaginationContent>
        {pages.map((item, index) => (
          <PaginationItem key={`${item}-${index}`}>
            {item === "ellipsis" ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href={createPageHref(pathname, searchParams, item)}
                isActive={item === currentPage}
              >
                {item}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
      </PaginationContent>

      <PaginationContent>
        <PaginationItem>
          <PaginationNext
            aria-disabled={currentPage >= totalPages}
            className={currentPage >= totalPages ? "pointer-events-none opacity-50" : undefined}
            href={createPageHref(pathname, searchParams, currentPage + 1)}
            text="Berikutnya"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

function buildPageItems(currentPage: number, totalPages: number) {
  const pages = new Set<number>([1, totalPages, currentPage - 1, currentPage, currentPage + 1])
  const sortedPages = Array.from(pages)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b)

  const items: Array<number | "ellipsis"> = []

  sortedPages.forEach((page, index) => {
    if (index > 0 && page - sortedPages[index - 1] > 1) {
      items.push("ellipsis")
    }

    items.push(page)
  })

  return items
}

function createPageHref(
  pathname: string,
  searchParams: Record<string, string | undefined>,
  page: number
) {
  const params = new URLSearchParams()

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) {
      params.set(key, value)
    }
  })

  if (page > 1) {
    params.set("page", String(page))
  } else {
    params.delete("page")
  }

  const queryString = params.toString()

  return queryString ? `${pathname}?${queryString}` : pathname
}
