/*
 * Life OS service worker — makes the app installable and resilient offline.
 *
 * Strategy:
 *  - Precache the app shell on install.
 *  - Navigations: network-first, falling back to the cached shell so the SPA
 *    still boots offline (React Router then resolves the route client-side).
 *  - Same-origin static assets (Vite's hashed /assets/*): cache-first.
 *  - Everything else (e.g. the API) is left to the network untouched.
 */
const CACHE = 'life-os-v1'
const APP_SHELL = ['/', '/index.html', '/manifest.webmanifest', '/favicon.svg']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  // SPA navigations: network-first with a cached-shell fallback.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match('/index.html').then((r) => r ?? Response.error()),
      ),
    )
    return
  }

  // Hashed build assets: cache-first (they're immutable).
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ??
          fetch(request).then((resp) => {
            const copy = resp.clone()
            caches.open(CACHE).then((cache) => cache.put(request, copy))
            return resp
          }),
      ),
    )
  }
})
