import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui-kit'

/** Hero: eyebrow, headline, sub-copy, CTAs, and the floating dashboard mock. */
export function Hero() {
  return (
    <section className="mx-auto grid max-w-[1200px] items-center gap-12 px-6 py-[72px] lg:grid-cols-[1.05fr_1fr]">
      <div>
        <Badge tone="eyebrow" size="md">
          AI-POWERED PERSONAL OS
        </Badge>
        <h1 className="mt-[22px] text-[44px] leading-[1.05] font-extrabold tracking-[-0.02em] sm:text-[60px]">
          Your Life.
          <br />
          Organized.
          <br />
          <span className="text-amber-500">Powered by AI.</span>
        </h1>
        <p className="mt-[22px] max-w-[460px] text-lg leading-relaxed font-medium text-slate-400">
          Plan better. Focus more. Achieve everything. One intelligent workspace for your
          tasks, goals, habits, and health.
        </p>
        <div className="mt-[34px] flex flex-wrap gap-3.5">
          <Link
            to="/signup"
            className="rounded-xl bg-amber-500 px-[26px] py-[15px] text-[15px] font-bold text-navy-900 hover:bg-amber-600"
          >
            Get Started Free
          </Link>
          <a
            href="#features"
            className="rounded-xl border border-white/18 px-[26px] py-[15px] text-[15px] font-semibold text-slate-200 hover:bg-white/5 hover:text-white"
          >
            See Features
          </a>
        </div>
        <div className="mt-10 flex gap-7 text-[13px] font-semibold text-slate-400">
          <span>★★★★★ 4.9/5</span>
          <span>12k+ users</span>
          <span>Free forever plan</span>
        </div>
      </div>

      <div className="relative">
        <div className="absolute -inset-8 bg-[radial-gradient(circle_at_60%_40%,rgba(245,158,11,0.28),transparent_60%)] blur-xl" />
        <div className="relative rounded-[20px] border border-white/10 bg-linear-160 from-navy-800 to-navy-900 p-[18px] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)]">
          <div className="mb-3.5 flex gap-1.5">
            <span className="size-2.5 rounded-full bg-accent-red-bright" />
            <span className="size-2.5 rounded-full bg-amber-500" />
            <span className="size-2.5 rounded-full bg-accent-green-bright" />
          </div>
          <div className="rounded-[14px] border border-white/8 bg-white/[0.04] p-[18px]">
            <div className="text-[13px] font-semibold text-slate-400">
              Good morning, Alex
            </div>
            <div className="mt-3.5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white/[0.04] p-3.5">
                <div className="text-xs font-semibold text-slate-400">Tasks Today</div>
                <div className="mt-1 text-[26px] font-extrabold tabular-nums">12</div>
              </div>
              <div className="rounded-xl bg-amber-500/[0.12] p-3.5">
                <div className="text-xs font-semibold text-amber-400">Streak</div>
                <div className="mt-1 text-[26px] font-extrabold tabular-nums text-amber-500">
                  12🔥
                </div>
              </div>
            </div>
            <div className="mt-3.5 h-[88px] overflow-hidden rounded-xl bg-white/[0.04]">
              <svg
                viewBox="0 0 300 88"
                preserveAspectRatio="none"
                className="h-full w-full"
              >
                <path
                  d="M0,70 C40,60 60,30 100,38 C140,46 160,20 200,26 C240,32 270,14 300,20 L300,88 L0,88 Z"
                  fill="rgba(245,158,11,0.18)"
                />
                <path
                  d="M0,70 C40,60 60,30 100,38 C140,46 160,20 200,26 C240,32 270,14 300,20"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
