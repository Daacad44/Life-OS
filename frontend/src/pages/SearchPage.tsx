import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Search, Sparkles } from 'lucide-react'
import type { SearchResultItem } from '@life-os/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { useAiSearch, useSearch } from '@/features/search/hooks/useSearch'

const TYPE_LABEL: Record<SearchResultItem['type'], string> = {
  note: 'Note',
  task: 'Task',
  goal: 'Goal',
  reflection: 'Reflection',
  memory: 'Memory',
}

function linkFor(item: SearchResultItem): string | null {
  switch (item.type) {
    case 'note':
      return '/notes'
    case 'task':
      return '/tasks'
    case 'goal':
      return `/goals/${item.id}`
    case 'reflection':
      return '/reflection'
    default:
      return null
  }
}

export function SearchPage() {
  const [query, setQuery] = useState('')
  const [askAi, setAskAi] = useState(false)
  const search = useSearch()
  const aiSearch = useAiSearch()

  const active = askAi ? aiSearch : search

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    active.mutate(query.trim())
  }

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">Search</h1>
        <p className="text-text-muted">
          Find anything across your tasks, goals, notes, and reflections.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What did I plan for my fitness goal?"
            autoFocus
          />
          <Button type="submit" disabled={!query.trim() || active.isPending}>
            <Search className="size-4" />
            {active.isPending ? 'Searching...' : 'Search'}
          </Button>
        </div>
        <label className="flex w-fit items-center gap-2 text-sm text-text-muted">
          <input
            type="checkbox"
            checked={askAi}
            onChange={(e) => setAskAi(e.target.checked)}
            className="size-4"
          />
          Ask AI to answer using the results
        </label>
      </form>

      {active.isSuccess && (
        <div className="flex flex-col gap-4">
          {askAi && (
            <div className="rounded-md border border-border bg-primary-muted p-4">
              <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-primary">
                <Sparkles className="size-3.5" />
                AI answer
              </div>
              <p className="text-sm text-text">
                {active.data.answer ??
                  "I couldn't generate an answer, but here are the raw matches below."}
              </p>
            </div>
          )}

          {active.data.results.length === 0 && (
            <p className="text-sm text-text-muted">
              No matches — try a different phrase.
            </p>
          )}

          <div className="flex flex-col gap-2">
            {active.data.results.map((item) => {
              const to = linkFor(item)
              const key = `${item.type}-${item.id}`
              const card = (
                <Card>
                  <CardContent className="flex flex-col gap-1 p-4">
                    <div className="flex items-center gap-2 text-xs text-text-muted">
                      <span className="rounded-full bg-primary-muted px-2 py-0.5 font-medium text-primary">
                        {TYPE_LABEL[item.type]}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-text">{item.title}</p>
                    {item.snippet && (
                      <p className="line-clamp-2 text-sm text-text-muted">
                        {item.snippet}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )
              return to ? (
                <Link key={key} to={to}>
                  {card}
                </Link>
              ) : (
                <div key={key}>{card}</div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
