import { useState } from 'react'
import {
  Avatar,
  Button,
  Card,
  CardTitle,
  Input,
  Tabs,
  type TabItem,
} from '@/components/ui-kit'
import { useCurrentUser } from '@/features/auth/hooks/useAuth'

type SettingsTab = 'profile' | 'preferences' | 'security' | 'notifications'

const tabs: TabItem<SettingsTab>[] = [
  { key: 'profile', label: 'Profile' },
  { key: 'preferences', label: 'Preferences' },
  { key: 'security', label: 'Security' },
  { key: 'notifications', label: 'Notifications' },
]

export function SettingsPage() {
  const { data: user } = useCurrentUser()
  const [tab, setTab] = useState<SettingsTab>('profile')
  const name = user?.name ?? 'Alex Morgan'
  const email = user?.email ?? 'alex@example.com'

  return (
    <div className="flex flex-col gap-[18px]">
      <Tabs items={tabs} value={tab} onChange={setTab} ariaLabel="Settings sections" />

      {tab === 'profile' ? (
        <Card padding="lg" className="max-w-[640px]">
          <CardTitle className="mb-5">Profile Information</CardTitle>

          <div className="mb-6 flex items-center gap-[18px]">
            <Avatar name={name} size="lg" shape="circle" />
            <Button variant="surface" size="sm">
              Upload photo
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Name" defaultValue={name} />
            <Input label="Email" defaultValue={email} />
            <Input label="Timezone" defaultValue="UTC+03:00 Nairobi" />
            <Input label="Language" defaultValue="English" />
          </div>

          <Button size="md" className="mt-6">
            Save Changes
          </Button>
        </Card>
      ) : (
        <Card padding="lg" className="max-w-[640px]">
          <CardTitle className="mb-2 capitalize">{tab}</CardTitle>
          <p className="text-sm font-medium text-slate-500">
            {tab} settings are coming soon.
          </p>
        </Card>
      )}
    </div>
  )
}
