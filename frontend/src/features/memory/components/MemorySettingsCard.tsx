import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useDeleteMemory, useMemories } from '../hooks/useMemories'

export function MemorySettingsCard() {
  const { data: memories, isLoading, isError, refetch } = useMemories()
  const deleteMemory = useDeleteMemory()

  return (
    <Card>
      <CardHeader>
        <CardTitle>What the AI remembers</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {isLoading && <div className="h-16 animate-pulse rounded-md bg-primary-muted" />}
        {isError && (
          <div className="flex flex-col items-start gap-2">
            <p className="text-sm text-danger">Couldn&apos;t load memory.</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        )}
        {!isLoading && !isError && memories?.length === 0 && (
          <p className="text-sm text-text-muted">
            Nothing yet — your coach will remember things as you use it.
          </p>
        )}
        {memories?.map((m) => (
          <div
            key={m.id}
            className="flex items-center justify-between gap-2 rounded-md border border-border px-3 py-2 text-sm"
          >
            <span className="text-text">{m.content}</span>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Forget this"
              onClick={() => deleteMemory.mutate(m.id)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
