import { features } from './data'

/** The six-tile feature grid from the prototype. */
export function Features() {
  return (
    <section id="features" className="mx-auto max-w-[1200px] px-6 pt-10 pb-20">
      <div className="text-center">
        <h2 className="text-[34px] font-extrabold tracking-[-0.01em]">
          Everything You Need In One Powerful OS
        </h2>
        <p className="mt-3 font-medium text-slate-400">
          Life OS brings all aspects of your life together with the power of AI.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-2xl border border-white/8 bg-white/[0.04] p-[22px] transition-transform hover:-translate-y-1"
          >
            <div className="grid size-11 place-items-center rounded-[11px] bg-amber-500/[0.14] text-amber-500">
              <f.icon size={22} aria-hidden="true" />
            </div>
            <div className="mt-3.5 text-base font-extrabold">{f.title}</div>
            <div className="mt-1.5 text-sm leading-relaxed font-medium text-slate-400">
              {f.desc}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
