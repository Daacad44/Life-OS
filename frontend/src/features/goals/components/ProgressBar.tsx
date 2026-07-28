import { cn } from '@/lib/utils'

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  return (
    <div
      className={cn(
        'h-2 w-full overflow-hidden rounded-full bg-primary-muted',
        className,
      )}
    >
      <div
        className="h-full rounded-full bg-primary transition-all"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}
