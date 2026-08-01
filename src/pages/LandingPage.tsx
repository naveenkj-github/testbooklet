import { Link } from 'react-router-dom'
import { Clock3, FileQuestion, ArrowRight } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { MOCK_TESTS } from '@/data/tests'
import { formatInr } from '@/lib/commerce'

export default function LandingPage() {
  return (
    <div className="min-h-[100dvh] w-full bg-[#F3F7FB] text-[#1F2937]">
      <div
        className="relative overflow-hidden"
        style={{
          background:
            'radial-gradient(ellipse 90% 70% at 15% -10%, rgba(0,174,239,0.22), transparent 55%), radial-gradient(ellipse 70% 50% at 90% 10%, rgba(15,118,110,0.12), transparent 50%), linear-gradient(180deg, #E8F4FA 0%, #F3F7FB 55%, #F3F7FB 100%)',
        }}
      >
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00AEEF] text-xs font-extrabold text-white shadow-sm">
              CBT
            </div>
            <span className="text-sm font-bold tracking-tight sm:text-base">CBT Mock Tests</span>
          </div>
          <Link
            to="/login"
            className="text-sm font-semibold text-[#0E7490] transition hover:text-[#00AEEF]"
          >
            Have a passcode? Login
          </Link>
        </header>

        <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-14 pt-6 sm:px-6 sm:pb-20 sm:pt-10 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div className="max-w-xl">
            <p className="mb-3 text-[11px] font-bold tracking-[0.2em] text-[#00AEEF] uppercase sm:text-xs">
              CBT
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#0F172A] sm:text-4xl lg:text-5xl">
              Buy a mock. Get a passcode. Take the test.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-[#64748B] sm:text-base">
              Choose a Bank PO or Clerk mock, complete a mock checkout, and unlock the exam with
              your unique passcode.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#pricing">
                <Button size="lg">View pricing</Button>
              </a>
              <Link to="/login">
                <Button size="lg" variant="outline">
                  Enter passcode
                </Button>
              </Link>
            </div>
          </div>

          <div
            className="relative h-44 w-full max-w-md overflow-hidden rounded-2xl border border-white/70 shadow-lg sm:h-56 lg:h-64"
            style={{
              background:
                'linear-gradient(135deg, #0B4F6C 0%, #00AEEF 55%, #5EEAD4 100%)',
            }}
            aria-hidden
          >
            <div className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
            />
            <div className="absolute right-5 bottom-5 left-5 rounded-xl bg-white/15 p-4 backdrop-blur-sm">
              <p className="text-xs font-semibold tracking-wide text-white/80 uppercase">Exam shell</p>
              <p className="mt-1 text-lg font-bold text-white">Palette · Timer · Sections</p>
            </div>
          </div>
        </section>
      </div>

      <section id="pricing" className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-8 max-w-xl">
          <h2 className="text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">
            Mock test pricing
          </h2>
          <p className="mt-2 text-sm text-[#64748B] sm:text-base">
            Pick a test to continue to mock payment. You will receive a passcode after purchase.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {MOCK_TESTS.map((test) => (
            <article
              key={test.id}
              className="flex flex-col border border-[#E2E8F0] bg-white p-5 shadow-sm transition duration-200 hover:border-[#00AEEF]/50 hover:shadow-md sm:p-6"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-bold tracking-wide text-[#00AEEF] uppercase">
                    {test.examType}
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-[#0F172A]">{test.title}</h3>
                </div>
                {test.badge ? (
                  <span className="shrink-0 bg-[#E8F8FD] px-2 py-1 text-[10px] font-bold tracking-wide text-[#0284C7] uppercase">
                    {test.badge}
                  </span>
                ) : null}
              </div>

              <p className="text-sm leading-relaxed text-[#64748B]">{test.subtitle}</p>

              <div className="mt-4 flex flex-wrap gap-3 text-xs font-medium text-[#475569]">
                <span className="inline-flex items-center gap-1.5">
                  <FileQuestion className="h-3.5 w-3.5 text-[#00AEEF]" />
                  {test.questions} Qs
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="h-3.5 w-3.5 text-[#00AEEF]" />
                  {test.durationMinutes} min
                </span>
              </div>

              <ul className="mt-4 space-y-2 border-t border-[#F1F5F9] pt-4 text-sm text-[#475569]">
                {test.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00AEEF]" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex items-end justify-between gap-3 pt-6">
                <div>
                  <p className="text-xs font-medium text-[#94A3B8]">Price</p>
                  <p className="text-2xl font-extrabold text-[#0F172A]">{formatInr(test.priceInr)}</p>
                </div>
                <Link to={`/checkout/${test.id}`}>
                  <Button className="gap-1.5">
                    Buy now
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t border-[#E2E8F0] px-4 py-8 text-center text-xs text-[#94A3B8] sm:px-6">
        Mock payments only — no real charges. Passcodes are stored locally in this browser.
      </footer>
    </div>
  )
}
