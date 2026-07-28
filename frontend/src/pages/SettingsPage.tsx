import { useState, type FormEvent } from 'react'
import { updateProfileSchema } from '@life-os/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCurrentUser, useUpdateProfile } from '@/features/auth/hooks/useAuth'
import { MemorySettingsCard } from '@/features/memory/components/MemorySettingsCard'
import { useThemeStore, type Theme } from '@/stores/themeStore'

const THEME_OPTIONS: { value: Theme; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
]

export function SettingsPage() {
  const { data: user } = useCurrentUser()
  const updateProfile = useUpdateProfile()
  const { theme, setTheme } = useThemeStore()
  const [name, setName] = useState(user?.name ?? '')
  const [timezone, setTimezone] = useState(user?.timezone ?? 'UTC')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const result = updateProfileSchema.safeParse({ name, timezone })
    if (result.success) updateProfile.mutate(result.data)
  }

  return (
    <div className="flex max-w-lg flex-col gap-6">
      <h1 className="text-2xl font-semibold text-text">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user?.email ?? ''} disabled />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="timezone">Timezone</Label>
              <Input
                id="timezone"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={updateProfile.isPending} className="w-fit">
              {updateProfile.isPending ? 'Saving…' : 'Save changes'}
            </Button>
            {updateProfile.isSuccess && (
              <p className="text-sm text-success">Profile updated.</p>
            )}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-1.5">
            <Label>Theme</Label>
            <div className="flex gap-2">
              {THEME_OPTIONS.map((opt) => (
                <Button
                  key={opt.value}
                  type="button"
                  variant={theme === opt.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTheme(opt.value)}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <MemorySettingsCard />
    </div>
  )
}
