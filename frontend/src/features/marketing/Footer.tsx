import { Link } from 'react-router-dom'
import { Logo } from '@/components/ui-kit'

const columns = [
  { title: 'Product', links: ['Features', 'Pricing', 'Roadmap'] },
  { title: 'Company', links: ['About', 'Careers', 'Contact'] },
  { title: 'Legal', links: ['Privacy', 'Terms'] },
]

/** The amber→navy CTA band plus the dark footer from the prototype. */
export function Footer() {
  return (
    <>
      <section className="bg-linear-100 from-amber-500 to-navy-800">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-6 px-6 py-14">
          <div>
            <h2 className="text-[30px] font-extrabold text-navy-900">
              Start organizing your life today
            </h2>
            <p className="mt-2 font-semibold text-navy-900/75">
              Join thousands building a better life with Life OS.
            </p>
          </div>
          <Link
            to="/signup"
            className="rounded-xl bg-navy-900 px-7 py-[15px] text-[15px] font-bold text-white hover:bg-navy-800"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/6 bg-navy-950">
        <div className="mx-auto flex max-w-[1200px] flex-wrap justify-between gap-6 px-6 py-11 text-[13px] font-medium text-slate-400">
          <div className="max-w-[260px]">
            <Logo size="sm" />
            <p className="mt-3 leading-relaxed">
              Your intelligent personal operating system.
            </p>
          </div>
          <div className="flex flex-wrap gap-14">
            {columns.map((col) => (
              <div key={col.title} className="flex flex-col gap-2.5">
                <span className="font-bold text-white">{col.title}</span>
                {col.links.map((l) => (
                  <a key={l} href="#" className="text-slate-400 hover:text-amber-500">
                    {l}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="mx-auto max-w-[1200px] px-6 pb-7 text-[12.5px] text-slate-500">
          © 2026 Life OS. All rights reserved.
        </div>
      </footer>
    </>
  )
}
