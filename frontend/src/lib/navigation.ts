import {
  Award,
  BarChart3,
  Bell,
  Bot,
  Briefcase,
  Building2,
  Calendar,
  CalendarDays,
  CheckSquare,
  Compass,
  GraduationCap,
  HeartPulse,
  LayoutDashboard,
  Mic,
  NotebookText,
  Repeat,
  Settings,
  SunMoon,
  Target,
  Timer,
  TrendingUp,
  Users,
  Wallet,
  Zap,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  /** One-line description shown on the dashboard group hub. */
  blurb?: string
  end?: boolean
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

/**
 * The single source of truth for Life OS navigation — consumed by both the
 * Sidebar and the Dashboard group hub so the two never drift. Grouped exactly as
 * the product's four workspaces: Core, AI, Life, Growth (plus Account).
 */
export const navGroups: NavGroup[] = [
  {
    label: 'Core',
    items: [
      {
        to: '/',
        label: 'Dashboard',
        icon: LayoutDashboard,
        end: true,
        blurb: 'Your day at a glance',
      },
      {
        to: '/planner',
        label: 'Planner',
        icon: CalendarDays,
        blurb: 'Plan and schedule each day',
      },
      {
        to: '/tasks',
        label: 'Tasks',
        icon: CheckSquare,
        blurb: 'Track what needs doing',
      },
      { to: '/goals', label: 'Goals', icon: Target, blurb: 'Set and pursue your goals' },
      {
        to: '/calendar',
        label: 'Calendar',
        icon: Calendar,
        blurb: 'See events and deadlines',
      },
      { to: '/habits', label: 'Habits', icon: Repeat, blurb: 'Build streaks that stick' },
      {
        to: '/notes',
        label: 'Notes',
        icon: NotebookText,
        blurb: 'Capture ideas and notes',
      },
      {
        to: '/focus',
        label: 'Focus Mode',
        icon: Timer,
        blurb: 'Deep-work timer sessions',
      },
    ],
  },
  {
    label: 'AI',
    items: [
      { to: '/coach', label: 'AI Coach', icon: Bot, blurb: 'Chat and plan with AI' },
      {
        to: '/reflection',
        label: 'Reflection',
        icon: SunMoon,
        blurb: 'Daily guided reflection',
      },
      {
        to: '/weekly-review',
        label: 'Weekly Review',
        icon: TrendingUp,
        blurb: 'Review your week',
      },
      {
        to: '/analytics',
        label: 'Analytics',
        icon: BarChart3,
        blurb: 'Insights from your data',
      },
      {
        to: '/recommendations',
        label: 'Recommendations',
        icon: Compass,
        blurb: 'Smart next steps',
      },
      {
        to: '/voice',
        label: 'Voice Assistant',
        icon: Mic,
        blurb: 'Speak to get things done',
      },
    ],
  },
  {
    label: 'Life',
    items: [
      {
        to: '/health',
        label: 'Health',
        icon: HeartPulse,
        blurb: 'Log sleep, water, mood',
      },
      { to: '/finance', label: 'Finance', icon: Wallet, blurb: 'Track money in and out' },
      {
        to: '/study',
        label: 'Study',
        icon: GraduationCap,
        blurb: 'Subjects and study time',
      },
      {
        to: '/career',
        label: 'Career',
        icon: Briefcase,
        blurb: 'Goals and applications',
      },
    ],
  },
  {
    label: 'Growth',
    items: [
      {
        to: '/business',
        label: 'Business',
        icon: Building2,
        blurb: 'Projects and revenue',
      },
      {
        to: '/automations',
        label: 'Automations',
        icon: Zap,
        blurb: 'Rules that run for you',
      },
      {
        to: '/achievements',
        label: 'Achievements',
        icon: Award,
        blurb: 'Badges you have earned',
      },
      { to: '/community', label: 'Community', icon: Users, blurb: 'Connect and share' },
    ],
  },
  {
    label: 'Account',
    items: [
      {
        to: '/notifications',
        label: 'Notifications',
        icon: Bell,
        blurb: 'Alerts and reminders',
      },
      {
        to: '/settings',
        label: 'Settings',
        icon: Settings,
        blurb: 'Preferences and account',
      },
    ],
  },
]

/** The four workspace groups shown on the dashboard hub (Account excluded). */
export const workspaceGroups = navGroups.filter((g) => g.label !== 'Account')
