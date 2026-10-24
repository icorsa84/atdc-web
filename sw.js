/**
 * ATDC Service Worker — PWA Cache
 * Dominio: outplacement.atdc.app
 * Estrategia: Cache-first para assets estáticos, Network-first para API.
 */

const CACHE_NAME = 'atdc-v11';
const STATIC_ASSETS = [
  '/',
  '/agente-chat.html',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
];

// Instalar SW y cachear assets estáticos
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Cachear con tolerancia a fallos individuales
      return Promise.allSettled(
        STATIC_ASSETS.map(url => cache.add(url).catch(() => {}))
      );
    })
  );
});

// Activar y limpiar cachés antiguos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Estrategia de fetch
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // API calls: siempre network (no cachear respuestas de chat)
  if (url.hostname.includes('onrender.com') || url.pathname.startsWith('/api/')) {
    return; // dejar pasar sin interceptar
  }

  // POST requests: no cachear
  if (event.request.method !== 'GET') return;

  // Assets estáticos: cache-first
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // Cachear solo respuestas válidas del mismo origen
        if (response.ok && url.origin === self.location.origin) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // Offline fallback para navegación
        if (event.request.mode === 'navigate') {
          return caches.match('/agente-chat.html');
        }
      });
    })
  );
});
