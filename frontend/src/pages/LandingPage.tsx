import { Features } from '@/features/marketing/Features'
import { Footer } from '@/features/marketing/Footer'
import { Hero } from '@/features/marketing/Hero'
import { MarketingNav } from '@/features/marketing/MarketingNav'
import { Pricing } from '@/features/marketing/Pricing'

/**
 * The marketing landing page from Life_OS_dc.html: sticky nav, hero, feature
 * grid, pricing, CTA band, and footer, on the dark navy surface.
 */
export function LandingPage() {
  return (
    <div className="min-h-dvh bg-navy-900 font-display text-white">
      <MarketingNav />
      <Hero />
      <Features />
      <Pricing />
      <Footer />
    </div>
  )
}
