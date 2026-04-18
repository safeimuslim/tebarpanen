function PulseBlock({
  className,
}: {
  className: string
}) {
  return <div className={`animate-pulse rounded-2xl bg-[#e8f1ef] ${className}`} />
}

export default function Loading() {
  return (
    <div className="space-y-5 sm:space-y-6">
      <section className="overflow-hidden rounded-[1.75rem] border border-[#d9e9e4] bg-[linear-gradient(145deg,#163042_0%,#125e8a_58%,#0f9d8a_100%)] p-5 text-white sm:rounded-[2rem] sm:p-8">
        <div className="space-y-4">
          <PulseBlock className="h-7 w-28 bg-white/15" />
          <PulseBlock className="h-12 w-full max-w-3xl bg-white/12" />
          <PulseBlock className="h-5 w-full max-w-2xl bg-white/10" />
          <div className="flex flex-wrap gap-2.5 pt-2">
            <PulseBlock className="h-8 w-36 bg-white/12" />
            <PulseBlock className="h-8 w-36 bg-white/12" />
            <PulseBlock className="h-8 w-40 bg-white/12" />
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <div className="rounded-[1.6rem] border border-[#d9e9e4] bg-white p-5">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <PulseBlock className="size-11 rounded-2xl" />
              <div className="min-w-0 flex-1 space-y-2">
                <PulseBlock className="h-5 w-36" />
                <PulseBlock className="h-4 w-full max-w-md" />
              </div>
            </div>

            <div className="space-y-2">
              <PulseBlock className="h-4 w-40" />
              <PulseBlock className="h-10 w-full rounded-xl" />
              <PulseBlock className="h-4 w-64" />
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <PulseBlock className="h-10 w-full rounded-xl sm:w-56" />
              <PulseBlock className="h-4 w-full max-w-sm" />
            </div>
          </div>
        </div>

        <div className="rounded-[1.6rem] border border-[#d9e9e4] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbfa_100%)] p-5">
          <div className="space-y-4">
            <div className="space-y-2">
              <PulseBlock className="h-5 w-44" />
              <PulseBlock className="h-4 w-full max-w-md" />
            </div>
            <div className="space-y-2">
              <PulseBlock className="h-4 w-24" />
              <PulseBlock className="h-7 w-full max-w-sm" />
              <PulseBlock className="h-4 w-full max-w-md" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <PulseBlock className="h-24 w-full" />
              <PulseBlock className="h-24 w-full" />
              <PulseBlock className="h-24 w-full" />
              <PulseBlock className="h-24 w-full" />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <PulseBlock className="h-4 w-28 rounded-full" />
            <div className="h-px flex-1 bg-[linear-gradient(90deg,rgba(15,157,138,0.35),rgba(15,157,138,0))]" />
          </div>
          <PulseBlock className="h-4 w-full max-w-2xl" />
        </div>

        <div className="rounded-[1.6rem] border border-[#d9e9e4] bg-[linear-gradient(180deg,#ffffff_0%,#f4faf8_100%)] p-5">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)]">
            <div className="space-y-3">
              <PulseBlock className="h-7 w-44 rounded-full" />
              <PulseBlock className="h-8 w-full max-w-2xl" />
              <PulseBlock className="h-4 w-full max-w-3xl" />
              <PulseBlock className="h-4 w-full max-w-2xl" />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <PulseBlock className="h-24 w-full" />
              <PulseBlock className="h-24 w-full" />
              <PulseBlock className="h-24 w-full" />
            </div>
          </div>
        </div>
      </section>

      <div className="rounded-[1.6rem] border border-[#d9e9e4] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbfb_100%)] p-5">
        <div className="space-y-5">
          <div className="flex items-start gap-3">
            <PulseBlock className="size-11 rounded-2xl" />
            <div className="min-w-0 flex-1 space-y-2">
              <PulseBlock className="h-7 w-28 rounded-full" />
              <PulseBlock className="h-6 w-72" />
              <PulseBlock className="h-4 w-full max-w-2xl" />
            </div>
          </div>
          <PulseBlock className="h-32 w-full rounded-[1.6rem]" />
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div className="space-y-3">
              <PulseBlock className="h-5 w-40" />
              <PulseBlock className="h-28 w-full" />
              <PulseBlock className="h-28 w-full" />
            </div>
            <div className="space-y-3">
              <PulseBlock className="h-5 w-52" />
              <PulseBlock className="h-20 w-full" />
              <PulseBlock className="h-20 w-full" />
              <PulseBlock className="h-24 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
