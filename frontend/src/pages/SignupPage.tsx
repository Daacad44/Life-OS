import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { signupSchema } from '@life-os/shared'
import { Button, Card, Input, Logo } from '@/components/ui-kit'
import { useCurrentUser, useSignup } from '@/features/auth/hooks/useAuth'

/**
 * Sign up — the prototype's auth surface with the extra Full name field.
 * Markup follows Life_OS_dc.html; the real signupSchema + useSignup flow is
 * kept underneath, still routing to onboarding on success.
 */
export function SignupPage() {
  const { data: user } = useCurrentUser()
  const navigate = useNavigate()
  const signup = useSignup()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  if (user) return <Navigate to="/" replace />

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const result = signupSchema.safeParse({ email, password, name: name || undefined })
    if (!result.success) {
      setFormError(result.error.issues[0]?.message ?? 'Invalid input')
      return
    }
    setFormError(null)
    signup.mutate(result.data, { onSuccess: () => navigate('/onboarding') })
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
          <h1 className="text-center text-2xl font-extrabold">Create Your Account</h1>
          <p className="mt-2 mb-6 text-center text-sm font-medium text-slate-400">
            Start your journey with Life OS
          </p>

          <form className="flex flex-col gap-3.5" onSubmit={handleSubmit}>
            <Input
              label="Full name"
              tone="dark"
              autoComplete="name"
              placeholder="Alex Morgan"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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
            <Input
              label="Password"
              tone="dark"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="••••••••"
              hint="At least 8 characters."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              endAdornment={
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((v) => !v)}
                  className="grid place-items-center p-2 text-slate-400 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff size={18} aria-hidden="true" />
                  ) : (
                    <Eye size={18} aria-hidden="true" />
                  )}
                </button>
              }
            />

            {(formError || signup.isError) && (
              <p className="text-sm font-medium text-accent-red">
                {formError ?? (signup.error as Error).message}
              </p>
            )}

            <Button
              type="submit"
              size="md"
              block
              disabled={signup.isPending}
              className="mt-1"
            >
              {signup.isPending ? 'Creating account…' : 'Create Account'}
            </Button>
          </form>

          <p className="mt-[22px] text-center text-sm font-medium text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-amber-500 hover:text-amber-600">
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
