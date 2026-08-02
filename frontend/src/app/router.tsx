import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { LoginPage } from '@/pages/LoginPage'
import { SignupPage } from '@/pages/SignupPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { TasksPage } from '@/pages/TasksPage'
import { PlannerPage } from '@/pages/PlannerPage'
import { GoalsPage } from '@/pages/GoalsPage'
import { GoalDetailPage } from '@/pages/GoalDetailPage'
import { CalendarPage } from '@/pages/CalendarPage'
import { HabitsPage } from '@/pages/HabitsPage'
import { CoachPage } from '@/pages/CoachPage'
import { ReflectionPage } from '@/pages/ReflectionPage'
import { NotesPage } from '@/pages/NotesPage'
import { SearchPage } from '@/pages/SearchPage'
import { WeeklyReviewPage } from '@/pages/WeeklyReviewPage'
import { AnalyticsPage } from '@/pages/AnalyticsPage'
import { FinancePage } from '@/pages/FinancePage'
import { FocusPage } from '@/pages/FocusPage'
import { HealthPage } from '@/pages/HealthPage'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },
  {
    element: <ProtectedRoute />,
    children: [
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
          { path: '/settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
])
