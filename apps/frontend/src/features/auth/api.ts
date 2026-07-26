import type {
  LoginInput,
  PublicUser,
  SignupInput,
  UpdateProfileInput,
} from '@life-os/shared'
import { apiFetch } from '@/lib/api'

export function fetchMe() {
  return apiFetch<PublicUser>('/v1/auth/me')
}

export function signup(input: SignupInput) {
  return apiFetch<PublicUser>('/v1/auth/signup', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function login(input: LoginInput) {
  return apiFetch<PublicUser>('/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function logout() {
  return apiFetch<null>('/v1/auth/logout', { method: 'POST' })
}

export function updateProfile(input: UpdateProfileInput) {
  return apiFetch<PublicUser>('/v1/users/me', {
    method: 'PATCH',
    body: JSON.stringify(input),
  })
}
