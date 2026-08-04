import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { LoginPage } from '@/pages/LoginPage'
import { SignupPage } from '@/pages/SignupPage'
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage'

const OnboardingPage = lazy(() =>
  import('@/pages/OnboardingPage').then((m) => ({ default: m.OnboardingPage })),
)

// Lazy-loaded so each authenticated page ships as its own chunk instead of all
// 25+ pages landing in one bundle — see the Phase 6 performance pass.
const DashboardPage = lazy(() =>
  import('@/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })),
)
const SettingsPage = lazy(() =>
  import('@/pages/SettingsPage').then((m) => ({ default: m.SettingsPage })),
)
const TasksPage = lazy(() =>
  import('@/pages/TasksPage').then((m) => ({ default: m.TasksPage })),
)
const PlannerPage = lazy(() =>
  import('@/pages/PlannerPage').then((m) => ({ default: m.PlannerPage })),
)
const GoalsPage = lazy(() =>
  import('@/pages/GoalsPage').then((m) => ({ default: m.GoalsPage })),
)
const GoalDetailPage = lazy(() =>
  import('@/pages/GoalDetailPage').then((m) => ({ default: m.GoalDetailPage })),
)
const CalendarPage = lazy(() =>
  import('@/pages/CalendarPage').then((m) => ({ default: m.CalendarPage })),
)
const HabitsPage = lazy(() =>
  import('@/pages/HabitsPage').then((m) => ({ default: m.HabitsPage })),
)
const CoachPage = lazy(() =>
  import('@/pages/CoachPage').then((m) => ({ default: m.CoachPage })),
)
const ReflectionPage = lazy(() =>
  import('@/pages/ReflectionPage').then((m) => ({ default: m.ReflectionPage })),
)
const NotesPage = lazy(() =>
  import('@/pages/NotesPage').then((m) => ({ default: m.NotesPage })),
)
const SearchPage = lazy(() =>
  import('@/pages/SearchPage').then((m) => ({ default: m.SearchPage })),
)
const WeeklyReviewPage = lazy(() =>
  import('@/pages/WeeklyReviewPage').then((m) => ({ default: m.WeeklyReviewPage })),
)
const AnalyticsPage = lazy(() =>
  import('@/pages/AnalyticsPage').then((m) => ({ default: m.AnalyticsPage })),
)
const FinancePage = lazy(() =>
  import('@/pages/FinancePage').then((m) => ({ default: m.FinancePage })),
)
const FocusPage = lazy(() =>
  import('@/pages/FocusPage').then((m) => ({ default: m.FocusPage })),
)
const HealthPage = lazy(() =>
  import('@/pages/HealthPage').then((m) => ({ default: m.HealthPage })),
)
const StudyPage = lazy(() =>
  import('@/pages/StudyPage').then((m) => ({ default: m.StudyPage })),
)
const CareerPage = lazy(() =>
  import('@/pages/CareerPage').then((m) => ({ default: m.CareerPage })),
)
const BusinessPage = lazy(() =>
  import('@/pages/BusinessPage').then((m) => ({ default: m.BusinessPage })),
)
const AutomationsPage = lazy(() =>
  import('@/pages/AutomationsPage').then((m) => ({ default: m.AutomationsPage })),
)
const RecommendationsPage = lazy(() =>
  import('@/pages/RecommendationsPage').then((m) => ({ default: m.RecommendationsPage })),
)
const VoicePage = lazy(() =>
  import('@/pages/VoicePage').then((m) => ({ default: m.VoicePage })),
)
const AchievementsPage = lazy(() =>
  import('@/pages/AchievementsPage').then((m) => ({ default: m.AchievementsPage })),
)
const CommunityPage = lazy(() =>
  import('@/pages/CommunityPage').then((m) => ({ default: m.CommunityPage })),
)

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/onboarding',
        element: (
          <Suspense fallback={null}>
            <OnboardingPage />
          </Suspense>
        ),
      },
      {
        element: <AppShell />,
        children: [
          { path: '/', element: <DashboardPage /> },
          { path: '/planner', element: <PlannerPage /> },
          { path: '/tasks', element: <TasksPage /> },
          { path: '/goals', element: <GoalsPage /> },
          { path: '/goals/:id', element: <GoalDetailPage /> },
          { path: '/calendar', element: <CalendarPage /> },
          { path: '/habits', element: <HabitsPage /> },
          { path: '/notes', element: <NotesPage /> },
          { path: '/search', element: <SearchPage /> },
          { path: '/coach', element: <CoachPage /> },
          { path: '/reflection', element: <ReflectionPage /> },
          { path: '/weekly-review', element: <WeeklyReviewPage /> },
          { path: '/analytics', element: <AnalyticsPage /> },
          { path: '/finance', element: <FinancePage /> },
          { path: '/focus', element: <FocusPage /> },
          { path: '/health', element: <HealthPage /> },
          { path: '/study', element: <StudyPage /> },
          { path: '/career', element: <CareerPage /> },
          { path: '/business', element: <BusinessPage /> },
          { path: '/automations', element: <AutomationsPage /> },
          { path: '/recommendations', element: <RecommendationsPage /> },
          { path: '/voice', element: <VoicePage /> },
          { path: '/achievements', element: <AchievementsPage /> },
          { path: '/community', element: <CommunityPage /> },
          { path: '/settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
])
