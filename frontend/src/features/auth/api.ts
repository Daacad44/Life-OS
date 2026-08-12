import type {
  ApiResponse,
  LoginInput,
  PublicUser,
  SignupInput,
  UpdateProfileInput,
} from '@life-os/shared'
import { apiFetch, ApiClientError } from '@/lib/api'

const API_URL = import.meta.env.VITE_API_URL

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

export function completeOnboarding() {
  return apiFetch<PublicUser>('/v1/users/me/complete-onboarding', { method: 'POST' })
}

export function exportData() {
  return apiFetch<unknown>('/v1/users/me/export')
}

export async function deleteAccount() {
  await apiFetch<null>('/v1/users/me', { method: 'DELETE' })
}

/**
 * Upload a custom MP3 ringtone (multipart). We use raw fetch here — not
 * apiFetch — so the browser sets the multipart boundary itself instead of the
 * default JSON content-type.
 */
export async function uploadRingtone(file: File): Promise<PublicUser> {
  const form = new FormData()
  form.append('ringtone', file)
  const res = await fetch(`${API_URL}/v1/users/me/ringtone`, {
    method: 'POST',
    credentials: 'include',
    body: form,
  })
  const body = (await res.json()) as ApiResponse<PublicUser>
  if (!body.success) {
    throw new ApiClientError(res.status, body.error.code, body.error.message)
  }
  return body.data
}

export function deleteRingtone() {
  return apiFetch<PublicUser>('/v1/users/me/ringtone', { method: 'DELETE' })
}
