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

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<{ status: number; body: ApiResponse<T> }> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (res.status === 204) {
    return { status: res.status, body: { success: true, data: null as T } }
  }

  const body = (await res.json()) as ApiResponse<T>
  return { status: res.status, body }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const { status, body } = await request<T>(path, options)
  if (!body.success) {
    throw new ApiClientError(status, body.error.code, body.error.message)
  }
  return body.data
}

// Like apiFetch, but also returns `meta` (pagination) from the response envelope.
export async function apiFetchList<T>(
  path: string,
  options: RequestInit = {},
): Promise<{ data: T; meta?: { page: number; pageSize: number; total: number } }> {
  const { status, body } = await request<T>(path, options)
  if (!body.success) {
    throw new ApiClientError(status, body.error.code, body.error.message)
  }
  return { data: body.data, meta: body.meta }
}
