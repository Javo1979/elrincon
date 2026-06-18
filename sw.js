/* ═══════════════════════════════════════════════════════════════
   FRUTOS SECOS EL RINCÓN — SERVICE WORKER (PWA)
   Estrategia: Cache-first para assets, network-first para HTML
   ════════════════════════════════════════════════════════════════ */

const CACHE_NAME = 'elrincon-v1';
const ASSETS_TO_CACHE = [
  './index.html',
  './css/style.css',
  './js/main.js',
  './manifest.json',
  './img/Logo.png',
  './img/hero.png',
  './img/hero-video.mp4',
  './img/almendras.png',
  './img/nueces.png',
  './img/arandanos.png',
  './img/pasas.png',
  './img/ciruelas.png',
  './img/jamaica.png',
  './img/datiles.png',
  './img/mani.png',
  './img/clavo.png',
  './img/pimienta.png',
  './img/cebolla.png',
  './img/ajo.png'
];

// Instalación: cachear todos los assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activación: limpiar caches viejos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch: cache-first para assets, network-first para HTML
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // No interceptar peticiones externas (Google Fonts, WhatsApp, etc.)
  if (!url.origin.includes(location.hostname || 'localhost')) {
    return;
  }

  // Estrategia cache-first para assets estáticos (CSS, JS, imágenes)
  if (event.request.destination === 'style' ||
      event.request.destination === 'script' ||
      event.request.destination === 'image' ||
      event.request.destination === 'manifest') {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        return cached || fetch(event.request).then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      })
    );
    return;
  }

  // Estrategia network-first para HTML
  if (event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
    return;
  }

  // Default: cache-first
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
