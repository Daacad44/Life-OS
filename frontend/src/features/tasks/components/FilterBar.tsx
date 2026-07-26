import type { ListTasksQuery, Priority, TaskStatus } from '@life-os/shared'
import { Button } from '@/components/ui/button'

type Filters = Partial<ListTasksQuery>

const STATUS_OPTIONS: { value: TaskStatus | undefined; label: string }[] = [
  { value: undefined, label: 'All' },
  { value: 'TODO', label: 'To do' },
  { value: 'IN_PROGRESS', label: 'In progress' },
  { value: 'DONE', label: 'Done' },
]

const PRIORITY_OPTIONS: { value: Priority | undefined; label: string }[] = [
  { value: undefined, label: 'All' },
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
]

const SORT_OPTIONS: { value: ListTasksQuery['sort']; label: string }[] = [
  { value: 'createdAt', label: 'Created' },
  { value: 'dueDate', label: 'Due date' },
  { value: 'priority', label: 'Priority' },
]

export function FilterBar({
  filters,
  onChange,
}: {
  filters: Filters
  onChange: (filters: Filters) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <FilterGroup
        label="Status"
        options={STATUS_OPTIONS}
        value={filters.status}
        onSelect={(status) => onChange({ ...filters, status })}
      />
      <FilterGroup
        label="Priority"
        options={PRIORITY_OPTIONS}
        value={filters.priority}
        onSelect={(priority) => onChange({ ...filters, priority })}
      />
      <FilterGroup
        label="Sort"
        options={SORT_OPTIONS}
        value={filters.sort}
        onSelect={(sort) => onChange({ ...filters, sort })}
      />
    </div>
  )
}

function FilterGroup<T extends string | undefined>({
  label,
  options,
  value,
  onSelect,
}: {
  label: string
  options: { value: T; label: string }[]
  value: T | undefined
  onSelect: (value: T) => void
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs font-medium text-text-muted">{label}</span>
      <div className="flex gap-1">
        {options.map((opt) => (
          <Button
            key={opt.label}
            type="button"
            size="sm"
            variant={value === opt.value ? 'default' : 'outline'}
            onClick={() => onSelect(opt.value)}
          >
            {opt.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
