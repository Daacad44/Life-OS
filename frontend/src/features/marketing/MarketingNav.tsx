import { Link } from 'react-router-dom'
import { Logo } from '@/components/ui-kit'

const links = ['Features', 'Pricing', 'About', 'Blog']

/** Sticky translucent navy header from the prototype's landing page. */
export function MarketingNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-navy-900/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-6 py-4">
        <Logo size="md" />

        <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-300 md:flex">
          {links.map((l) => (
            <a key={l} href="#" className="text-slate-300 hover:text-white">
              {l}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-[10px] px-3 py-2.5 text-sm font-semibold text-slate-200 hover:text-white"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="rounded-[10px] bg-amber-500 px-[18px] py-2.5 text-sm font-bold text-navy-900 hover:bg-amber-600"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  )
}
