/**
 * Registers the service worker in production so Life OS is installable and
 * boots offline. No-ops during dev (where the SW would fight Vite's HMR) and
 * where the browser lacks service-worker support.
 */
export function registerServiceWorker() {
  if (import.meta.env.DEV) return
  if (!('serviceWorker' in navigator)) return

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Registration failures are non-fatal — the app still runs online.
    })
  })
}
