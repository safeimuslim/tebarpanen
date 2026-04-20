export default function Loading() {
  return (
    <div className="space-y-5 p-4 md:p-6">
      <section className="rounded-[1.75rem] border border-[#d9e9e4] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbfa_100%)] p-5">
        <div className="space-y-3">
          <div className="h-4 w-28 animate-pulse rounded bg-[#e7f1ee]" />
          <div className="h-9 w-full max-w-xl animate-pulse rounded bg-[#e7f1ee]" />
          <div className="h-5 w-full max-w-2xl animate-pulse rounded bg-[#f1f7f5]" />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            className="rounded-[1.4rem] border border-[#d9e9e4] bg-white p-5"
            key={index}
          >
            <div className="space-y-3">
              <div className="h-4 w-24 animate-pulse rounded bg-[#eef5f3]" />
              <div className="h-7 w-32 animate-pulse rounded bg-[#eef5f3]" />
              <div className="h-4 w-full animate-pulse rounded bg-[#f3f8f6]" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-[#f3f8f6]" />
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
