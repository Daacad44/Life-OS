import { useState, type FormEvent } from 'react'
import { Plus } from 'lucide-react'
import { ProjectStatus } from '@life-os/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import {
  useClients,
  useCreateClient,
  useCreateProject,
  useProjects,
} from '@/features/business/hooks/useBusiness'

const STATUS_LABEL: Record<ProjectStatus, string> = {
  ACTIVE: 'Active',
  ON_HOLD: 'On hold',
  COMPLETED: 'Completed',
}

export function BusinessPage() {
  const { data: projects, isLoading: projectsLoading } = useProjects()
  const { data: clients, isLoading: clientsLoading } = useClients()
  const createProject = useCreateProject()
  const createClient = useCreateClient()

  const [projectName, setProjectName] = useState('')
  const [clientName, setClientName] = useState('')

  function handleAddProject(e: FormEvent) {
    e.preventDefault()
    if (!projectName.trim()) return
    createProject.mutate(
      { name: projectName.trim(), status: 'ACTIVE' },
      { onSuccess: () => setProjectName('') },
    )
  }

  function handleAddClient(e: FormEvent) {
    e.preventDefault()
    if (!clientName.trim()) return
    createClient.mutate(
      { name: clientName.trim() },
      { onSuccess: () => setClientName('') },
    )
  }

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">Business</h1>
        <p className="text-text-muted">
          Projects and clients, kept separate from personal life.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-text-muted">Projects</h2>
        <form onSubmit={handleAddProject} className="flex gap-2">
          <Input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Add a project..."
            className="flex-1"
          />
          <Button type="submit" disabled={!projectName.trim()}>
            <Plus className="size-4" />
            Add
          </Button>
        </form>
        {projectsLoading && (
          <div className="h-16 animate-pulse rounded-md bg-primary-muted" />
        )}
        {!projectsLoading && projects?.length === 0 && (
          <p className="text-sm text-text-muted">No projects yet.</p>
        )}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {projects?.map((p) => (
            <Card key={p.id}>
              <CardContent className="flex items-center justify-between gap-2 p-4">
                <span className="text-sm font-medium text-text">{p.name}</span>
                <span className="rounded-full bg-primary-muted px-2 py-0.5 text-xs text-primary">
                  {STATUS_LABEL[p.status]}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-text-muted">Clients</h2>
        <form onSubmit={handleAddClient} className="flex gap-2">
          <Input
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Add a client..."
            className="flex-1"
          />
          <Button type="submit" disabled={!clientName.trim()}>
            <Plus className="size-4" />
            Add
          </Button>
        </form>
        {clientsLoading && (
          <div className="h-16 animate-pulse rounded-md bg-primary-muted" />
        )}
        {!clientsLoading && clients?.length === 0 && (
          <p className="text-sm text-text-muted">No clients yet.</p>
        )}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {clients?.map((c) => (
            <Card key={c.id}>
              <CardContent className="flex flex-col gap-1 p-4">
                <span className="text-sm font-medium text-text">{c.name}</span>
                {c.details && (
                  <span className="text-xs text-text-muted">{c.details}</span>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
