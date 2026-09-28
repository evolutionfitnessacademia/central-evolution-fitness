const CACHE_NAME = 'evolution-fitness-pwa-v1';

// Recursos essenciais para inicialização offline
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/apple-touch-icon.png',
  '/favicon.png',
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_ASSETS).catch((err) => {
          console.warn('[SW] Aviso no precache inicial:', err);
        });
      })
      .then(() => self.skipWaiting())
  );
});

// Ativação e limpeza de caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => {
            if (name !== CACHE_NAME) {
              return caches.delete(name);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Interceptação segura de requisições
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Apenas intercepta requisições HTTP/HTTPS do método GET
  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  // REGRA DE SEGURANÇA: NÃO armazenar requisições para origens externas / APIs de terceiros
  // (preserva envio de formulários, WhatsApp, GitHub Pages, ViaCEP, etc.)
  if (url.origin !== self.location.origin) {
    return;
  }

  // Requisições de navegação de páginas (HTML) -> Network First com fallback para cache
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          return caches.match('/index.html');
        })
    );
    return;
  }

  // Recursos estáticos locais (CSS, JS, imagens, ícones) -> Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Erro silencioso em caso de offline
        });

      return cachedResponse || fetchPromise;
    })
  );
});
