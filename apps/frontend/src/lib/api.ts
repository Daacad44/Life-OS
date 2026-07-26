import type { ApiResponse } from '@life-os/shared'

const API_URL = import.meta.env.VITE_API_URL

export class ApiClientError extends Error {
  status: number
  code: string

  constructor(status: number, code: string, message: string) {
    super(message)
    this.status = status
    this.code = code
  }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  const body = (await res.json()) as ApiResponse<T>

  if (!body.success) {
    throw new ApiClientError(res.status, body.error.code, body.error.message)
  }

  return body.data
}
