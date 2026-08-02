import { useState, type FormEvent } from 'react'
import { Check, Flag, Share2, UserPlus, X } from 'lucide-react'
import type { ShareVisibility } from '@life-os/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { useGoals } from '@/features/goals/hooks/useGoals'
import {
  useCommunityOptIn,
  useConnect,
  useConnections,
  useFeed,
  useReportPost,
  useRespondToConnection,
  useSetOptIn,
  useShareGoal,
} from '@/features/community/hooks/useCommunity'

const selectClass =
  'flex h-10 rounded-md border border-border bg-surface px-3 py-2 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'

export function CommunityPage() {
  const { data: optInData, isLoading: optInLoading } = useCommunityOptIn()
  const setOptIn = useSetOptIn()

  if (optInLoading) {
    return <div className="h-40 max-w-2xl animate-pulse rounded-md bg-primary-muted" />
  }

  if (!optInData?.optIn) {
    return (
      <div className="flex max-w-2xl flex-col gap-4">
        <h1 className="text-2xl font-semibold text-text">Community</h1>
        <p className="text-text-muted">
          Optional accountability partners and shared goals. Everything stays private
          until you explicitly opt in — nothing is shared by default.
        </p>
        <Button
          className="w-fit"
          onClick={() => setOptIn.mutate(true)}
          disabled={setOptIn.isPending}
        >
          Enable Community
        </Button>
      </div>
    )
  }

  return <CommunityContent />
}

function CommunityContent() {
  const setOptIn = useSetOptIn()
  const { data: connections } = useConnections()
  const connect = useConnect()
  const respond = useRespondToConnection()
  const { data: goals } = useGoals()
  const shareGoal = useShareGoal()
  const { data: feed, isLoading: feedLoading } = useFeed()
  const reportPost = useReportPost()

  const [partnerEmail, setPartnerEmail] = useState('')
  const [goalId, setGoalId] = useState('')
  const [visibility, setVisibility] = useState<ShareVisibility>('PARTNERS')
  const [message, setMessage] = useState('')

  function handleConnect(e: FormEvent) {
    e.preventDefault()
    if (!partnerEmail.trim()) return
    connect.mutate(partnerEmail.trim(), { onSuccess: () => setPartnerEmail('') })
  }

  function handleShare(e: FormEvent) {
    e.preventDefault()
    if (!goalId) return
    shareGoal.mutate(
      { goalId, visibility, message: message.trim() || undefined },
      { onSuccess: () => setMessage('') },
    )
  }

  const pendingReceived = connections?.filter(
    (c) => c.direction === 'received' && c.status === 'PENDING',
  )
  const others = connections?.filter(
    (c) => !(c.direction === 'received' && c.status === 'PENDING'),
  )

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text">Community</h1>
        <Button variant="outline" size="sm" onClick={() => setOptIn.mutate(false)}>
          Disable
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-text-muted">Connections</h2>
        <form onSubmit={handleConnect} className="flex gap-2">
          <Input
            type="email"
            value={partnerEmail}
            onChange={(e) => setPartnerEmail(e.target.value)}
            placeholder="Partner's email"
            className="flex-1"
          />
          <Button type="submit" disabled={!partnerEmail.trim() || connect.isPending}>
            <UserPlus className="size-4" />
            Connect
          </Button>
        </form>
        {connect.isError && (
          <p className="text-xs text-danger">
            Couldn&apos;t send that request — check the email or try again.
          </p>
        )}

        {pendingReceived && pendingReceived.length > 0 && (
          <div className="flex flex-col gap-2">
            {pendingReceived.map((c) => (
              <Card key={c.id}>
                <CardContent className="flex items-center justify-between gap-2 p-3">
                  <span className="text-sm text-text">
                    {c.partnerName ?? c.partnerEmail} wants to connect
                  </span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Accept"
                      onClick={() => respond.mutate({ id: c.id, status: 'ACCEPTED' })}
                    >
                      <Check className="size-4 text-success" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Decline"
                      onClick={() => respond.mutate({ id: c.id, status: 'DECLINED' })}
                    >
                      <X className="size-4 text-danger" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {others && others.length > 0 && (
          <div className="flex flex-col gap-1">
            {others.map((c) => (
              <div key={c.id} className="flex items-center justify-between text-sm">
                <span className="text-text">{c.partnerName ?? c.partnerEmail}</span>
                <span className="text-xs text-text-muted">{c.status.toLowerCase()}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-text-muted">Share a goal</h2>
        <form onSubmit={handleShare} className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <select
              value={goalId}
              onChange={(e) => setGoalId(e.target.value)}
              className={selectClass}
            >
              <option value="">Select a goal...</option>
              {goals?.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.title}
                </option>
              ))}
            </select>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as ShareVisibility)}
              className={selectClass}
            >
              <option value="PARTNERS">Partners only</option>
              <option value="PUBLIC">Public</option>
              <option value="PRIVATE">Private (unshare)</option>
            </select>
          </div>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add a note (optional)"
          />
          <Button
            type="submit"
            className="w-fit"
            disabled={!goalId || shareGoal.isPending}
          >
            <Share2 className="size-4" />
            Share
          </Button>
        </form>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-text-muted">Feed</h2>
        {feedLoading && (
          <div className="h-20 animate-pulse rounded-md bg-primary-muted" />
        )}
        {!feedLoading && feed?.length === 0 && (
          <p className="text-sm text-text-muted">
            Nothing here yet — connect with a partner or share a goal.
          </p>
        )}
        <div className="flex flex-col gap-2">
          {feed?.map((post) => (
            <Card key={post.id}>
              <CardContent className="flex items-start justify-between gap-2 p-4">
                <div>
                  <p className="text-xs text-text-muted">
                    {post.authorName ?? 'Someone'}
                  </p>
                  <p className="text-sm text-text">{post.content}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Report post"
                  onClick={() => reportPost.mutate(post.id)}
                >
                  <Flag className="size-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
