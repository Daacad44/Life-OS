import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  useCurrentUser,
  useCompleteOnboarding,
  useUpdateProfile,
} from '@/features/auth/hooks/useAuth'
import { useCreateGoal } from '@/features/goals/hooks/useGoals'
import * as goalsApi from '@/features/goals/api'
import { useCreateTask } from '@/features/tasks/hooks/useTasks'
import { useCoachChat } from '@/features/coach/hooks/useCoach'

type Step = 'profile' | 'goal' | 'coach'

const STEPS: { key: Step; label: string }[] = [
  { key: 'profile', label: 'Profile' },
  { key: 'goal', label: 'First goal' },
  { key: 'coach', label: 'Meet your coach' },
]

function detectedTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  } catch {
    return 'UTC'
  }
}

export function OnboardingPage() {
  const { data: user } = useCurrentUser()
  const navigate = useNavigate()

  const [step, setStep] = useState<Step>('profile')
  const [name, setName] = useState('')
  const [timezone, setTimezone] = useState(detectedTimezone)
  const [goalTitle, setGoalTitle] = useState('')
  const [goalCreated, setGoalCreated] = useState(false)
  const [goalSetupPending, setGoalSetupPending] = useState(false)
  const [coachSent, setCoachSent] = useState(false)
  const [coachInput, setCoachInput] = useState('')

  const updateProfile = useUpdateProfile()
  const createGoal = useCreateGoal()
  const createTask = useCreateTask({})
  const coachChat = useCoachChat()
  const completeOnboarding = useCompleteOnboarding()

  if (user?.onboardedAt) {
    return <Navigate to="/" replace />
  }

  function goToStep(next: Step) {
    setStep(next)
  }

  function handleProfileSubmit(e: FormEvent) {
    e.preventDefault()
    updateProfile.mutate(
      { name: name.trim() || undefined, timezone },
      {
        onSuccess: () => goToStep('goal'),
        onError: () => goToStep('goal'),
      },
    )
  }

  async function handleGoalSubmit(e: FormEvent) {
    e.preventDefault()
    const title = goalTitle.trim()
    if (!title) {
      goToStep('coach')
      return
    }
    createGoal.mutate(
      { title },
      {
        onSuccess: async (goal) => {
          setGoalCreated(true)
          setGoalSetupPending(true)
          try {
            await goalsApi.breakdownGoal(goal.id)
          } catch {
            // AI unavailable — fall back to one manual suggested task so the
            // dashboard still isn't empty, matching the app's usual
            // graceful-AI-degradation pattern.
            try {
              await createTask.mutateAsync({
                title: `Take the first step on: ${goal.title}`,
                goalId: goal.id,
                status: 'TODO',
                priority: 'MEDIUM',
              })
            } catch {
              // Non-fatal — the user can add tasks manually from the dashboard.
            }
          }
          setGoalSetupPending(false)
          goToStep('coach')
        },
        onError: () => goToStep('coach'),
      },
    )
  }

  async function handleCoachSend() {
    const trimmed = coachInput.trim()
    if (!trimmed) return
    setCoachInput('')
    setCoachSent(true)
    await coachChat.send(trimmed)
  }

  function handleFinish() {
    completeOnboarding.mutate(undefined, {
      onSuccess: () => navigate('/'),
      onError: () => navigate('/'),
    })
  }

  const stepIndex = STEPS.findIndex((s) => s.key === step)

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-1.5">
            {STEPS.map((s, i) => (
              <span
                key={s.key}
                className={`h-1.5 flex-1 rounded-full ${i <= stepIndex ? 'bg-primary' : 'bg-primary-muted'}`}
              />
            ))}
          </div>
          <CardTitle>{STEPS[stepIndex].label}</CardTitle>
        </CardHeader>
        <CardContent>
          {step === 'profile' && (
            <form className="flex flex-col gap-4" onSubmit={handleProfileSubmit}>
              <p className="text-sm text-text-muted">
                Welcome to Life OS. Let&apos;s set a few things up.
              </p>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="ob-name">What should we call you?</Label>
                <Input
                  id="ob-name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="ob-timezone">Timezone</Label>
                <Input
                  id="ob-timezone"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={updateProfile.isPending}>
                {updateProfile.isPending ? 'Saving…' : 'Continue'}
              </Button>
            </form>
          )}

          {step === 'goal' && (
            <form className="flex flex-col gap-4" onSubmit={handleGoalSubmit}>
              <p className="text-sm text-text-muted">
                What&apos;s one thing you&apos;re working toward? We&apos;ll suggest a
                first task to get you moving.
              </p>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="ob-goal">A goal (optional)</Label>
                <Input
                  id="ob-goal"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  placeholder="e.g. Run a 5K, Launch my side project…"
                />
              </div>
              <Button type="submit" disabled={createGoal.isPending || goalSetupPending}>
                {createGoal.isPending || goalSetupPending
                  ? 'Setting up…'
                  : goalTitle.trim()
                    ? 'Create goal & continue'
                    : 'Skip for now'}
              </Button>
              {goalCreated && (
                <p className="text-xs text-success">
                  Goal created — check your dashboard after this.
                </p>
              )}
            </form>
          )}

          {step === 'coach' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-2 rounded-md bg-primary-muted px-3 py-2 text-sm text-text">
                <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
                <p>
                  Hi, I&apos;m your AI coach. Tell me a little about what you&apos;re
                  hoping to get done this week, and I&apos;ll remember it for next time.
                </p>
              </div>

              {coachChat.pending.map((m) => (
                <div
                  key={m.id}
                  className={
                    m.role === 'USER'
                      ? 'ml-auto max-w-[85%] rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground'
                      : 'max-w-[85%] rounded-lg bg-primary-muted px-3 py-2 text-sm text-text'
                  }
                >
                  {m.content || (coachChat.isStreaming ? '…' : '')}
                </div>
              ))}

              {coachChat.error && (
                <p className="text-xs text-danger">
                  Couldn&apos;t reach your coach right now — that&apos;s okay, you can
                  chat anytime from the Coach page.
                </p>
              )}

              {!coachSent && (
                <div className="flex gap-2">
                  <Input
                    value={coachInput}
                    onChange={(e) => setCoachInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        void handleCoachSend()
                      }
                    }}
                    placeholder="This week I want to…"
                  />
                  <Button
                    type="button"
                    onClick={() => void handleCoachSend()}
                    disabled={!coachInput.trim() || coachChat.isStreaming}
                  >
                    Send
                  </Button>
                </div>
              )}

              <Button
                onClick={handleFinish}
                disabled={completeOnboarding.isPending || coachChat.isStreaming}
              >
                {completeOnboarding.isPending
                  ? 'Finishing…'
                  : coachSent
                    ? 'Go to dashboard'
                    : "Skip, I'll chat later"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
