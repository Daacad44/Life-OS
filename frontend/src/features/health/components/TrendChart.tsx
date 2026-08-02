export function TrendChart({
  label,
  points,
}: {
  label: string
  points: { date: string; value: number }[]
}) {
  if (points.length === 0) {
    return (
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-text-muted">{label}</span>
        <p className="text-xs text-text-muted">No data yet.</p>
      </div>
    )
  }

  const max = Math.max(...points.map((p) => p.value), 1)

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-text-muted">{label}</span>
      <div className="flex h-16 items-end gap-1">
        {points.map((p) => (
          <div
            key={p.date}
            title={`${p.date}: ${p.value}`}
            className="w-3 rounded-t bg-primary"
            style={{ height: `${Math.max((p.value / max) * 100, 4)}%` }}
          />
        ))}
      </div>
    </div>
  )
}
