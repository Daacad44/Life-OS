import { useState } from 'react'
import { DateSwitcher } from '@/features/planner/components/DateSwitcher'
import { PlannerQuickAdd } from '@/features/planner/components/PlannerQuickAdd'
import { PlannerList } from '@/features/planner/components/PlannerList'

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

export function PlannerPage() {
  const [date, setDate] = useState(todayStr())

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text">Planner</h1>
        <DateSwitcher date={date} onChange={setDate} />
      </div>
      <PlannerQuickAdd date={date} />
      <PlannerList date={date} />
    </div>
  )
}
