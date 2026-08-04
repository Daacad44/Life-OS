import {
  BarChart3,
  Bot,
  Calendar,
  CheckSquare,
  Repeat,
  Target,
  type LucideIcon,
} from 'lucide-react'

// MOCK — static marketing copy from the prototype; no API backs this surface.

export interface Feature {
  title: string
  desc: string
  icon: LucideIcon
}

export const features: Feature[] = [
  {
    title: 'AI Coach',
    desc: 'Personalized guidance 24/7 to keep you on track.',
    icon: Bot,
  },
  {
    title: 'Smart Tasks',
    desc: 'Prioritized, AI-organized to-dos that adapt to you.',
    icon: CheckSquare,
  },
  {
    title: 'Goals',
    desc: 'Set, break down, and crush long-term ambitions.',
    icon: Target,
  },
  {
    title: 'Calendar',
    desc: 'A unified view of everything on your plate.',
    icon: Calendar,
  },
  { title: 'Habits', desc: 'Build streaks and make good routines stick.', icon: Repeat },
  {
    title: 'Analytics',
    desc: 'See your progress with beautiful insights.',
    icon: BarChart3,
  },
]

export interface Plan {
  name: string
  price: string
  popular: boolean
  perks: string[]
  cta: string
}

export const plans: Plan[] = [
  {
    name: 'Free',
    price: '$0',
    popular: false,
    perks: ['3 Goals', '7 days history', 'Basic AI access'],
    cta: 'Get Started',
  },
  {
    name: 'Pro',
    price: '$6.99',
    popular: true,
    perks: ['Unlimited goals', 'Full AI Coach', 'Advanced analytics', 'Priority support'],
    cta: 'Go Pro',
  },
  {
    name: 'Premium',
    price: '$12.99',
    popular: false,
    perks: ['Everything in Pro', 'Family sharing', 'Daily coaching', 'Early features'],
    cta: 'Get Premium',
  },
]
