import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { plans } from './data'

/** The three pricing tiers (Free / Pro / Premium), Pro raised and flagged. */
export function Pricing() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 pb-[90px]">
      <div className="mb-11 text-center">
        <h2 className="text-[34px] font-extrabold">Choose Your Plan</h2>
        <p className="mt-3 font-medium text-slate-400">Start free. Upgrade anytime.</p>
      </div>

      <div className="mx-auto grid max-w-[960px] gap-5 md:grid-cols-3">
        {plans.map((p) => (
          <div
            key={p.name}
            className={cn(
              'relative rounded-[18px] border p-7',
              p.popular
                ? 'border-amber-500 bg-linear-160 from-navy-700 to-navy-800 md:scale-[1.04]'
                : 'border-white/10 bg-white/[0.04]',
            )}
          >
            {p.popular ? (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-500 px-3.5 py-[5px] text-xs font-bold text-navy-900">
                Popular
              </div>
            ) : null}
            <div className="text-[15px] font-bold text-slate-300">{p.name}</div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-[40px] font-extrabold tabular-nums">{p.price}</span>
              <span className="text-sm text-slate-400">/mo</span>
            </div>
            <div className="mt-5 flex flex-col gap-2.5">
              {p.perks.map((perk) => (
                <div
                  key={perk}
                  className="flex items-center gap-2.5 text-sm font-medium text-slate-200"
                >
                  <Check size={16} className="text-amber-500" aria-hidden="true" />
                  {perk}
                </div>
              ))}
            </div>
            <Link
              to="/signup"
              className={cn(
                'mt-[22px] block rounded-[11px] py-3 text-center text-sm font-bold',
                p.popular
                  ? 'bg-amber-500 text-navy-900 hover:bg-amber-600'
                  : 'border border-white/20 text-white hover:bg-white/5',
              )}
            >
              {p.cta}
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}
