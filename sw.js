/**
 * ATDC Service Worker — PWA Cache
 * Dominio: outplacement.atdc.app
 *
 * Fix SW-CACHE-01 (2026-10-31): antes TODO era cache-first sin revalidar, así
 * que una página guardada (agente-chat.html, el panel admin) se servía para
 * siempre aunque se publicara una versión nueva — los arreglos no llegaban.
 * Estrategia actual:
 *   - Páginas HTML / navegación → red primero; la copia guardada solo se usa
 *     sin conexión.
 *   - Panel de administración (/admin, /dashboard.html) → solo red, nunca se
 *     guarda (datos sensibles y siempre debe ser la versión vigente).
 *   - Otros archivos estáticos → copia guardada al instante y se actualiza en
 *     segundo plano (stale-while-revalidate).
 *   - API → no se intercepta.
 * Cambiar CACHE_NAME borra las copias viejas al activarse.
 */

const CACHE_NAME = 'atdc-v12';
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
function _esAdmin(url) {
  return url.pathname === '/admin' || url.pathname.startsWith('/admin/') ||
         url.pathname === '/dashboard.html';
}
function _esPagina(request, url) {
  return request.mode === 'navigate' ||
         (request.headers.get('accept') || '').includes('text/html') ||
         url.pathname.endsWith('.html') || url.pathname === '/';
}
function _guardar(request, response) {
  if (response && response.ok && response.type === 'basic') {
    const copia = response.clone();
    caches.open(CACHE_NAME).then(cache => cache.put(request, copia)).catch(() => {});
  }
  return response;
}

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // API: siempre red, sin interceptar
  if (url.hostname.includes('onrender.com') || url.pathname.startsWith('/api/')) return;
  // Solo GET
  if (event.request.method !== 'GET') return;
  // Otros orígenes (fuentes, CDN): dejar al navegador
  if (url.origin !== self.location.origin) return;
  // Administración: nunca desde caché
  if (_esAdmin(url)) return;

  // Páginas: red primero, caché solo sin conexión
  if (_esPagina(event.request, url)) {
    event.respondWith(
      fetch(event.request)
        .then(resp => _guardar(event.request, resp))
        .catch(() => caches.match(event.request)
          .then(c => c || caches.match('/agente-chat.html')))
    );
    return;
  }

  // Resto de archivos estáticos: stale-while-revalidate
  event.respondWith(
    caches.match(event.request).then(cached => {
      const red = fetch(event.request).then(resp => _guardar(event.request, resp)).catch(() => cached);
      return cached || red;
    })
  );
});
