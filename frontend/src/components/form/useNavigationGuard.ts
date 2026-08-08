import { useEffect } from 'react'
import { useBlocker } from 'react-router-dom'

export interface NavigationGuard {
  /** True when a navigation was intercepted and awaits the user's choice. */
  blocked: boolean
  /** Allow the pending navigation to proceed (discard). */
  proceed: () => void
  /** Stay on the page (keep editing). */
  cancel: () => void
}

/**
 * Page-level Done/Cancel exit guard (Global Requirement B) for flows that live
 * on a route rather than in a modal — e.g. a running Focus session or a
 * half-written note. Blocks in-app navigation while `dirty` and also warns on
 * browser tab close/reload. The caller renders a ConfirmDialog off `blocked`.
 */
export function useNavigationGuard(dirty: boolean): NavigationGuard {
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      dirty && currentLocation.pathname !== nextLocation.pathname,
  )

  // Native guard for full page unload (reload / close tab / external link).
  useEffect(() => {
    if (!dirty) return
    function onBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [dirty])

  return {
    blocked: blocker.state === 'blocked',
    proceed: () => {
      if (blocker.state === 'blocked') blocker.proceed()
    },
    cancel: () => {
      if (blocker.state === 'blocked') blocker.reset()
    },
  }
}
