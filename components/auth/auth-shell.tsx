import Link from "next/link"
import { CheckCircle2, Fish } from "lucide-react"

type AuthShellProps = {
  badge: string
  children: React.ReactNode
  description: string
  highlights: string[]
  panelDescription: string
  supportCopy: string
  supportTitle: string
  panelTitle: string
  title: string
}

export function AuthShell({
  badge,
  children,
  description,
  highlights,
  panelDescription,
  supportCopy,
  supportTitle,
  panelTitle,
  title,
}: AuthShellProps) {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7fbfa_0%,#edf6f4_100%)] px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between pb-6 sm:pb-8">
        <Link className="flex items-center gap-3" href="/aplikasi-budidaya-ikan">
          <div className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-2xl">
            <Fish className="size-5" />
          </div>
          <div>
            <p className="text-base font-semibold tracking-tight text-[#163042]">
              Tebar Panen
            </p>
            <p className="text-xs text-[#5b7483]">
              Aplikasi budidaya ikan yang lebih rapi
            </p>
          </div>
        </Link>
      </div>

      <section className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)] lg:gap-8">
        <aside className="overflow-hidden rounded-[2rem] border border-[#d9e9e4] bg-[linear-gradient(155deg,#163042_0%,#125e8a_56%,#0f9d8a_100%)] p-6 text-white sm:p-8">
          <div className="max-w-lg space-y-6">
            <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/85">
              {badge}
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {panelTitle}
              </h1>
              <p className="text-sm leading-7 text-white/80 sm:text-base">
                {panelDescription}
              </p>
            </div>

            <div className="grid gap-3">
              {highlights.map((item) => (
                <div
                  className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/8 px-4 py-4"
                  key={item}
                >
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-white/85" />
                  <p className="text-sm leading-6 text-white/88">{item}</p>
                </div>
              ))}
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-5">
              <p className="text-sm font-medium text-white/76">{supportTitle}</p>
              <p className="mt-3 text-sm leading-7 text-white/84">
                {supportCopy}
              </p>
            </div>
          </div>
        </aside>

        <section className="rounded-[2rem] border border-[#d9e9e4] bg-white p-6 shadow-[0_20px_55px_rgba(22,48,66,0.08)] sm:p-8">
          <div className="mb-6 space-y-3">
            <div className="inline-flex rounded-full border border-[#d9e9e4] bg-[#f7fbfa] px-3 py-1 text-xs font-medium text-[#456473]">
              {badge}
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight text-[#163042] sm:text-3xl">
                {title}
              </h2>
              <p className="max-w-xl text-sm leading-7 text-[#5b7483] sm:text-base">
                {description}
              </p>
            </div>
          </div>

          {children}
        </section>
      </section>
    </main>
  )
}
