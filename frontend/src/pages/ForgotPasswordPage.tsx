import { useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Button, Card, Input, Logo } from '@/components/ui-kit'
import { useCurrentUser } from '@/features/auth/hooks/useAuth'

/**
 * Forgot password — the third auth mode from the prototype, following the same
 * glass-card pattern. The reset endpoint isn't wired yet, so submitting shows a
 * confirmation locally; swap in the real request when the API lands.
 */
export function ForgotPasswordPage() {
  const { data: user } = useCurrentUser()
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (user) return <Navigate to="/" replace />

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (email.trim()) setSubmitted(true)
  }

  return (
    <div className="grid min-h-dvh place-items-center bg-[radial-gradient(circle_at_50%_0%,#13315c,#0b1f3a_60%)] px-5 py-8 font-display text-white">
      <div className="w-full max-w-[420px]">
        <Link
          to="/"
          className="mb-[26px] flex items-center justify-center gap-2.5 text-white hover:text-white"
        >
          <Logo size="lg" />
        </Link>

        <Card variant="glass" padding="none" className="p-[30px]">
          <h1 className="text-center text-2xl font-extrabold">Reset Your Password</h1>
          <p className="mt-2 mb-6 text-center text-sm font-medium text-slate-400">
            Enter your email and we'll send a reset link
          </p>

          {submitted ? (
            <p className="rounded-[11px] border border-white/12 bg-white/5 px-4 py-3 text-center text-sm font-medium text-slate-200">
              If an account exists for {email}, a reset link is on its way.
            </p>
          ) : (
            <form className="flex flex-col gap-3.5" onSubmit={handleSubmit}>
              <Input
                label="Email address"
                tone="dark"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" size="md" block className="mt-1">
                Send Reset Link
              </Button>
            </form>
          )}

          <p className="mt-[22px] text-center text-sm font-medium text-slate-400">
            Remembered it?{' '}
            <Link to="/login" className="text-amber-500 hover:text-amber-600">
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
