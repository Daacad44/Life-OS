import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardTitle, toneChip, type Tone } from '@/components/ui-kit'
import { cn } from '@/lib/utils'
import { workspaceGroups } from '@/lib/navigation'

const GROUP_TONE: Record<string, Tone> = {
  Core: 'amber',
  AI: 'violet',
  Life: 'emerald',
  Growth: 'navy',
}

/**
 * Dashboard "Explore" hub: the four workspaces (Core / AI / Life / Growth) as
 * expandable cards. Clicking a group reveals every feature inside it as a grid
 * of links, so the whole app is reachable from the dashboard, not only the
 * sidebar. Reads {@link workspaceGroups} — the same source the sidebar uses.
 */
export function GroupHub() {
  // Core open by default so the section never reads as empty on first load.
  const [open, setOpen] = useState<Record<string, boolean>>({ Core: true })

  return (
    <Card padding="md">
      <CardTitle className="mb-3.5">Explore your workspaces</CardTitle>
      <div className="flex flex-col gap-2.5">
        {workspaceGroups.map((group) => {
          const isOpen = open[group.label] ?? false
          const panelId = `hub-panel-${group.label}`
          return (
            <div
              key={group.label}
              className="overflow-hidden rounded-xl border border-app-hairline"
            >
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen((o) => ({ ...o, [group.label]: !isOpen }))}
                className="flex w-full items-center gap-3 bg-app-surface px-4 py-3 text-left hover:bg-app-raised focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 pointer-coarse:min-h-11"
              >
                <span
                  className={cn(
                    'grid size-8 shrink-0 place-items-center rounded-lg text-xs font-black',
                    toneChip[GROUP_TONE[group.label] ?? 'navy'],
                  )}
                >
                  {group.label[0]}
                </span>
                <span className="flex-1 text-sm font-extrabold">{group.label}</span>
                <span className="text-xs font-semibold text-app-ink-faint">
                  {group.items.length} features
                </span>
                <ChevronDown
                  size={18}
                  aria-hidden="true"
                  className={cn(
                    'text-app-ink-muted transition-transform',
                    isOpen && 'rotate-180',
                  )}
                />
              </button>

              {isOpen && (
                <div
                  id={panelId}
                  className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3 lg:grid-cols-4"
                >
                  {group.items.map(({ to, label, icon: Icon, blurb }) => (
                    <Link
                      key={to}
                      to={to}
                      className="flex flex-col gap-1 rounded-lg border border-app-hairline bg-app-surface p-3 hover:bg-app-raised focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
                    >
                      <span className="flex items-center gap-2">
                        <Icon
                          size={16}
                          aria-hidden="true"
                          className="text-app-ink-muted"
                        />
                        <span className="truncate text-[13.5px] font-bold">{label}</span>
                      </span>
                      {blurb ? (
                        <span className="text-[11.5px] font-medium leading-snug text-app-ink-faint">
                          {blurb}
                        </span>
                      ) : null}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}
