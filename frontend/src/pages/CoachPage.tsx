import { AIChatPanel } from '@/features/coach/components/AIChatPanel'

export function CoachPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-text">AI Coach</h1>
        <p className="text-text-muted">
          Grounded in your real tasks, goals, and habits — ask for guidance, planning
          help, or accountability.
        </p>
      </div>
      <AIChatPanel />
    </div>
  )
}
