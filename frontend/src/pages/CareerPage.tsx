import { useState, type FormEvent } from 'react'
import { Plus, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import {
  useCareerOverview,
  useCreateCareerGoal,
  useCreateMilestone,
  useCreateSkill,
  useGenerateCareerPlan,
  useUpdateMilestone,
} from '@/features/career/hooks/useCareer'

const selectClass =
  'flex h-10 rounded-md border border-border bg-surface px-3 py-2 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'

export function CareerPage() {
  const { data, isLoading, isError, refetch } = useCareerOverview()
  const createGoal = useCreateCareerGoal()
  const createSkill = useCreateSkill()
  const createMilestone = useCreateMilestone()
  const updateMilestone = useUpdateMilestone()
  const generatePlan = useGenerateCareerPlan()

  const [goalTitle, setGoalTitle] = useState('')
  const [targetRole, setTargetRole] = useState('')
  const [skillName, setSkillName] = useState('')
  const [milestoneTitle, setMilestoneTitle] = useState('')
  const [milestoneGoalId, setMilestoneGoalId] = useState('')

  function handleAddGoal(e: FormEvent) {
    e.preventDefault()
    if (!goalTitle.trim()) return
    createGoal.mutate(
      { title: goalTitle.trim(), targetRole: targetRole.trim() || undefined },
      {
        onSuccess: () => {
          setGoalTitle('')
          setTargetRole('')
        },
      },
    )
  }

  function handleAddSkill(e: FormEvent) {
    e.preventDefault()
    if (!skillName.trim()) return
    createSkill.mutate(
      { name: skillName.trim(), level: 1 },
      { onSuccess: () => setSkillName('') },
    )
  }

  function handleAddMilestone(e: FormEvent) {
    e.preventDefault()
    if (!milestoneTitle.trim()) return
    createMilestone.mutate(
      { title: milestoneTitle.trim(), careerGoalId: milestoneGoalId || undefined },
      { onSuccess: () => setMilestoneTitle('') },
    )
  }

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <h1 className="text-2xl font-semibold text-text">Career</h1>

      {isLoading && <div className="h-40 animate-pulse rounded-md bg-primary-muted" />}

      {isError && (
        <div className="flex flex-col items-center gap-2 py-6 text-center">
          <p className="text-sm text-danger">Couldn&apos;t load your career data.</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-text-muted">Career goals</h2>
        <form onSubmit={handleAddGoal} className="flex flex-wrap gap-2">
          <Input
            value={goalTitle}
            onChange={(e) => setGoalTitle(e.target.value)}
            placeholder="Career goal (e.g. Become a Staff Engineer)"
            className="flex-1"
          />
          <Input
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="Target role (optional)"
            className="w-48"
          />
          <Button type="submit" disabled={!goalTitle.trim()}>
            <Plus className="size-4" />
            Add
          </Button>
        </form>
        {data && data.careerGoals.length === 0 && (
          <p className="text-sm text-text-muted">
            No career goals yet — add one to get started.
          </p>
        )}
        {data?.careerGoals.map((goal) => (
          <Card key={goal.id}>
            <CardContent className="flex flex-col gap-2 p-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-medium text-text">{goal.title}</p>
                  {goal.targetRole && (
                    <p className="text-xs text-text-muted">{goal.targetRole}</p>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={generatePlan.isPending}
                  onClick={() => generatePlan.mutate({ careerGoalId: goal.id })}
                >
                  <Sparkles className="size-4" />
                  Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {generatePlan.isError && (
          <p className="text-xs text-danger">Couldn&apos;t generate a plan right now.</p>
        )}
        {generatePlan.isSuccess && (
          <p className="rounded-md bg-primary-muted px-3 py-2 text-sm text-text">
            {generatePlan.data.advice}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-text-muted">Skills</h2>
        <form onSubmit={handleAddSkill} className="flex gap-2">
          <Input
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            placeholder="Add a skill..."
            className="flex-1"
          />
          <Button type="submit" disabled={!skillName.trim()}>
            <Plus className="size-4" />
            Add
          </Button>
        </form>
        {data && data.skills.length === 0 && (
          <p className="text-sm text-text-muted">No skills tracked yet.</p>
        )}
        {(data?.skills.length ?? 0) > 0 && (
          <Card>
            <CardContent className="flex flex-col gap-2 p-4">
              {data?.skills.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center justify-between gap-2 text-sm"
                >
                  <span className="text-text">{skill.name}</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <span
                        key={n}
                        className={`size-2 rounded-full ${n <= skill.level ? 'bg-primary' : 'bg-primary-muted'}`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-text-muted">Milestones</h2>
        <form onSubmit={handleAddMilestone} className="flex flex-wrap gap-2">
          <Input
            value={milestoneTitle}
            onChange={(e) => setMilestoneTitle(e.target.value)}
            placeholder="Add a milestone..."
            className="flex-1"
          />
          <select
            value={milestoneGoalId}
            onChange={(e) => setMilestoneGoalId(e.target.value)}
            className={selectClass}
          >
            <option value="">No specific goal</option>
            {data?.careerGoals.map((g) => (
              <option key={g.id} value={g.id}>
                {g.title}
              </option>
            ))}
          </select>
          <Button type="submit" disabled={!milestoneTitle.trim()}>
            <Plus className="size-4" />
            Add
          </Button>
        </form>
        {data && data.milestones.length === 0 && (
          <p className="text-sm text-text-muted">No milestones yet.</p>
        )}
        {(data?.milestones.length ?? 0) > 0 && (
          <Card>
            <CardContent className="flex flex-col gap-2 p-4">
              {data?.milestones.map((m) => (
                <label key={m.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="size-4"
                    checked={m.done}
                    onChange={(e) =>
                      updateMilestone.mutate({ id: m.id, done: e.target.checked })
                    }
                  />
                  <span className={m.done ? 'text-text-muted line-through' : 'text-text'}>
                    {m.title}
                  </span>
                </label>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
