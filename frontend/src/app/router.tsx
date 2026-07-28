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
          { path: '/settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
])
