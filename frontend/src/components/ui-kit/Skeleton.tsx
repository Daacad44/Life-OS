import { cn } from '@/lib/utils'

export interface SkeletonProps {
  className?: string
}

/** A pulsing placeholder block used while real data loads. */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('animate-pulse rounded-md bg-app-raised', className)}
    />
  )
}
