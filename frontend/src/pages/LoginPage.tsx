import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { loginSchema } from '@life-os/shared'
import { Button, Card, Input, Logo } from '@/components/ui-kit'
import { useCurrentUser, useLogin } from '@/features/auth/hooks/useAuth'

/**
 * Login — the prototype's auth surface (radial navy background, glass card,
 * amber CTA). Markup follows Life_OS_dc.html; the form still runs the real
 * loginSchema + useLogin flow underneath.
 */
export function LoginPage() {
  const { data: user } = useCurrentUser()
  const navigate = useNavigate()
  const login = useLogin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  if (user) return <Navigate to="/" replace />

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const result = loginSchema.safeParse({ email, password })
    if (!result.success) {
      setFormError(result.error.issues[0]?.message ?? 'Invalid input')
      return
    }
    setFormError(null)
    login.mutate(result.data, { onSuccess: () => navigate('/') })
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
          <h1 className="text-center text-2xl font-extrabold">Welcome Back!</h1>
          <p className="mt-2 mb-6 text-center text-sm font-medium text-slate-400">
            Sign in to continue to Life OS
          </p>

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
            <Input
              label="Password"
              tone="dark"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
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

            <div className="flex items-center justify-between text-[13px] font-semibold text-slate-400">
              <label className="flex cursor-pointer items-center gap-2">
                <input type="checkbox" className="size-4 accent-amber-500" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-amber-500 hover:text-amber-600">
                Forgot password?
              </Link>
            </div>

            {(formError || login.isError) && (
              <p className="text-sm font-medium text-accent-red">
                {formError ?? (login.error as Error).message}
              </p>
            )}

            <Button
              type="submit"
              size="md"
              block
              disabled={login.isPending}
              className="mt-1"
            >
              {login.isPending ? 'Signing in…' : 'Sign In'}
            </Button>
          </form>

          <p className="mt-[22px] text-center text-sm font-medium text-slate-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-amber-500 hover:text-amber-600">
              Sign up
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
