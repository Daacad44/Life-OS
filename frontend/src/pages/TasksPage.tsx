import { useState } from 'react'
import type { ListTasksQuery } from '@life-os/shared'
import { QuickAdd } from '@/features/tasks/components/QuickAdd'
import { FilterBar } from '@/features/tasks/components/FilterBar'
import { TaskList } from '@/features/tasks/components/TaskList'

export function TasksPage() {
  const [filters, setFilters] = useState<Partial<ListTasksQuery>>({
    sort: 'createdAt',
    order: 'desc',
  })

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <h1 className="text-2xl font-semibold text-text">Tasks</h1>
      <QuickAdd filters={filters} />
      <FilterBar filters={filters} onChange={setFilters} />
      <TaskList filters={filters} />
    </div>
  )
}
