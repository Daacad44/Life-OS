import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Avatar,
  Button,
  Card,
  CardTitle,
  Input,
  Modal,
  Tabs,
  type TabItem,
} from '@/components/ui-kit'
import { cn } from '@/lib/utils'
import {
  useCurrentUser,
  useUpdateProfile,
  useLogout,
} from '@/features/auth/hooks/useAuth'
import { exportData, deleteAccount } from '@/features/auth/api'
import {
  useNotificationPreferences,
  useUpdatePreferences,
} from '@/features/notifications/hooks/useNotifications'
import { useThemeStore, type Theme } from '@/stores/themeStore'
import { browserTimezone } from '@/lib/datetime'
import type { NotificationCategory } from '@life-os/shared'

type SettingsTab = 'profile' | 'preferences' | 'security' | 'notifications'

const tabs: TabItem<SettingsTab>[] = [
  { key: 'profile', label: 'Profile' },
  { key: 'preferences', label: 'Preferences' },
  { key: 'security', label: 'Security' },
  { key: 'notifications', label: 'Notifications' },
]

const themeOptions: { key: Theme; label: string }[] = [
  { key: 'light', label: 'Light' },
  { key: 'dark', label: 'Dark' },
  { key: 'system', label: 'System' },
]

const prefLabels: Record<NotificationCategory, string> = {
  habitMilestones: 'Habit milestones',
  budgetThreshold: 'Budget threshold alerts',
  weeklyReview: 'Weekly review ready',
  automationRan: 'Automation ran',
}

function timezoneList(): string[] {
  const withValues = Intl as unknown as { supportedValuesOf?: (k: string) => string[] }
  if (withValues.supportedValuesOf) {
    try {
      return withValues.supportedValuesOf('timeZone')
    } catch {
      /* fall through */
    }
  }
  return [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Africa/Nairobi',
    'Asia/Dubai',
    'Asia/Kolkata',
    'Asia/Singapore',
    'Asia/Tokyo',
    'Australia/Sydney',
  ]
}

export function SettingsPage() {
  const { data: user } = useCurrentUser()
  const updateProfile = useUpdateProfile()
  const logout = useLogout()
  const navigate = useNavigate()
  const { theme, setTheme } = useThemeStore()
  const { data: prefs } = useNotificationPreferences()
  const updatePrefs = useUpdatePreferences()

  const [tab, setTab] = useState<SettingsTab>('profile')
  const [name, setName] = useState(user?.name ?? '')
  const [timezone, setTimezone] = useState(user?.timezone ?? browserTimezone())
  const [saved, setSaved] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const zones = timezoneList()

  function saveProfile() {
    updateProfile.mutate(
      { name: name.trim() || undefined, timezone },
      { onSuccess: () => setSaved(true) },
    )
  }

  async function handleExport() {
    const data = await exportData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'life-os-export.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleDelete() {
    await deleteAccount()
    await logout.mutateAsync()
    navigate('/welcome')
  }

  const selectClass =
    'w-full rounded-[11px] border border-app-hairline bg-app-canvas px-3.5 py-[13px] font-display text-base text-app-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500'

  return (
    <div className="flex flex-col gap-[18px]">
      <Tabs items={tabs} value={tab} onChange={setTab} ariaLabel="Settings sections" />

      {tab === 'profile' ? (
        <Card padding="lg" className="max-w-[640px]">
          <CardTitle className="mb-5">Profile Information</CardTitle>

          <div className="mb-6 flex items-center gap-[18px]">
            <Avatar name={name || user?.email || 'User'} size="lg" shape="circle" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setSaved(false)
              }}
            />
            <Input label="Email" value={user?.email ?? ''} disabled readOnly />
            <div className="flex flex-col gap-[7px] sm:col-span-2">
              <label htmlFor="tz" className="text-[13px] font-semibold text-app-ink-soft">
                Timezone
              </label>
              <select
                id="tz"
                value={timezone}
                onChange={(e) => {
                  setTimezone(e.target.value)
                  setSaved(false)
                }}
                className={selectClass}
              >
                {zones.map((z) => (
                  <option key={z} value={z}>
                    {z.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <Button size="md" onClick={saveProfile} disabled={updateProfile.isPending}>
              {updateProfile.isPending ? 'Saving…' : 'Save Changes'}
            </Button>
            {saved ? (
              <span className="text-sm font-semibold text-accent-emerald">Saved</span>
            ) : null}
            {updateProfile.isError ? (
              <span className="text-sm font-semibold text-accent-red">
                Couldn't save. Try again.
              </span>
            ) : null}
          </div>
        </Card>
      ) : null}

      {tab === 'preferences' ? (
        <Card padding="lg" className="max-w-[640px]">
          <CardTitle className="mb-5">Appearance</CardTitle>
          <span className="text-[13px] font-semibold text-app-ink-soft">Theme</span>
          <div className="mt-2 flex gap-2">
            {themeOptions.map((o) => (
              <button
                key={o.key}
                type="button"
                onClick={() => setTheme(o.key)}
                className={cn(
                  'rounded-[10px] border px-4 py-2 text-sm font-semibold',
                  theme === o.key
                    ? 'border-amber-500 bg-amber-100 text-amber-700'
                    : 'border-app-hairline bg-app-surface text-app-ink-soft hover:bg-app-raised',
                )}
              >
                {o.label}
              </button>
            ))}
          </div>
        </Card>
      ) : null}

      {tab === 'notifications' ? (
        <Card padding="lg" className="max-w-[640px]">
          <CardTitle className="mb-5">Notification Preferences</CardTitle>
          <div className="flex flex-col divide-y divide-app-hairline">
            {(Object.keys(prefLabels) as NotificationCategory[]).map((key) => {
              const enabled = prefs?.[key] ?? false
              return (
                <label
                  key={key}
                  className="flex items-center justify-between py-3.5 text-sm font-semibold text-app-ink-soft"
                >
                  {prefLabels[key]}
                  <input
                    type="checkbox"
                    checked={enabled}
                    disabled={!prefs || updatePrefs.isPending}
                    onChange={(e) => updatePrefs.mutate({ [key]: e.target.checked })}
                    className="size-5 accent-amber-500"
                  />
                </label>
              )
            })}
          </div>
        </Card>
      ) : null}

      {tab === 'security' ? (
        <Card padding="lg" className="max-w-[640px]">
          <CardTitle className="mb-2">Your Data</CardTitle>
          <p className="mb-4 text-sm font-medium text-app-ink-muted">
            Export a copy of your Life OS data, or permanently delete your account.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="surface" size="md" onClick={handleExport}>
              Export my data
            </Button>
            <Button
              variant="surface"
              size="md"
              className="text-accent-red"
              onClick={() => setConfirmDelete(true)}
            >
              Delete account
            </Button>
          </div>
        </Card>
      ) : null}

      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Delete your account?"
        description="This permanently removes your account and all your data. This cannot be undone."
        footer={
          <>
            <Button variant="surface" size="sm" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
            <Button
              variant="navy"
              size="sm"
              className="bg-accent-red hover:bg-accent-red/90"
              onClick={handleDelete}
            >
              Delete account
            </Button>
          </>
        }
      />
    </div>
  )
}
