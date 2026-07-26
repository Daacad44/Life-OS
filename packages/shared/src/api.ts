// Response envelope shape — see docs/.../03-Architecture/API.md
export interface ApiSuccess<T> {
  success: true
  data: T
  meta?: { page: number; pageSize: number; total: number }
}

export interface ApiFailure {
  success: false
  error: { code: string; message: string; details: unknown[] }
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure
