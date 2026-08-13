import { useState, type FormEvent } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { ProjectStatus } from '@life-os/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import {
  useClients,
  useCreateClient,
  useCreateProject,
  useDeleteClient,
  useDeleteProject,
  useProjects,
  useUpdateProject,
} from '@/features/business/hooks/useBusiness'

const STATUS_LABEL: Record<ProjectStatus, string> = {
  ACTIVE: 'Active',
  ON_HOLD: 'On hold',
  COMPLETED: 'Completed',
}

export function BusinessPage() {
  const {
    data: projects,
    isLoading: projectsLoading,
    isError: projectsError,
    refetch: refetchProjects,
  } = useProjects()
  const {
    data: clients,
    isLoading: clientsLoading,
    isError: clientsError,
    refetch: refetchClients,
  } = useClients()
  const createProject = useCreateProject()
  const createClient = useCreateClient()
  const updateProject = useUpdateProject()
  const deleteProject = useDeleteProject()
  const deleteClient = useDeleteClient()

  const selectClass =
    'rounded-md border border-border bg-surface px-2 py-1 text-xs text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'

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
        {projectsError && (
          <div className="flex flex-col items-center gap-2 py-4 text-center">
            <p className="text-sm text-danger">Couldn&apos;t load projects.</p>
            <Button variant="outline" size="sm" onClick={() => refetchProjects()}>
              Retry
            </Button>
          </div>
        )}
        {!projectsLoading && !projectsError && projects?.length === 0 && (
          <p className="text-sm text-text-muted">No projects yet.</p>
        )}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {projects?.map((p) => (
            <Card key={p.id}>
              <CardContent className="flex items-center justify-between gap-2 p-4">
                <span className="text-sm font-medium text-text">{p.name}</span>
                <div className="flex items-center gap-2">
                  <select
                    aria-label="Project status"
                    value={p.status}
                    onChange={(e) =>
                      updateProject.mutate({
                        id: p.id,
                        input: { status: e.target.value as ProjectStatus },
                      })
                    }
                    className={selectClass}
                  >
                    {ProjectStatus.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABEL[s]}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    aria-label="Delete project"
                    disabled={deleteProject.isPending}
                    onClick={() => deleteProject.mutate(p.id)}
                    className="rounded p-1 text-text-muted hover:bg-primary-muted hover:text-danger"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
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
        {clientsError && (
          <div className="flex flex-col items-center gap-2 py-4 text-center">
            <p className="text-sm text-danger">Couldn&apos;t load clients.</p>
            <Button variant="outline" size="sm" onClick={() => refetchClients()}>
              Retry
            </Button>
          </div>
        )}
        {!clientsLoading && !clientsError && clients?.length === 0 && (
          <p className="text-sm text-text-muted">No clients yet.</p>
        )}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {clients?.map((c) => (
            <Card key={c.id}>
              <CardContent className="flex items-start justify-between gap-2 p-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-text">{c.name}</span>
                  {c.details && (
                    <span className="text-xs text-text-muted">{c.details}</span>
                  )}
                </div>
                <button
                  type="button"
                  aria-label="Delete client"
                  disabled={deleteClient.isPending}
                  onClick={() => deleteClient.mutate(c.id)}
                  className="rounded p-1 text-text-muted hover:bg-primary-muted hover:text-danger"
                >
                  <Trash2 className="size-4" />
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
