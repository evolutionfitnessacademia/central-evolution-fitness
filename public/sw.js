/**
 * EVOLUTION FITNESS — Service Worker Oficial
 * Sistema de Atualização Automática de PWA com suporte a GitHub Pages
 */

const RAW_BUILD_ID = '__SW_BUILD_ID__';
const BUILD_ID =
  typeof RAW_BUILD_ID !== 'undefined' && !RAW_BUILD_ID.startsWith('__')
    ? RAW_BUILD_ID
    : 'dev-preview';

const CACHE_NAME = 'evolution-fitness-pwa-v-' + BUILD_ID;

// Determina dinamicamente o caminho base com base no escopo de registro
// (funciona tanto na raiz '/' quanto no subdiretório do GitHub Pages '/central-evolution-fitness/')
const getBasePath = () => {
  try {
    const scopeUrl = new URL(self.registration.scope);
    const p = scopeUrl.pathname;
    return p.endsWith('/') ? p : p + '/';
  } catch {
    return '/';
  }
};

const BASE = getBasePath();

// Recursos essenciais para inicialização offline e funcionamento do PWA
const PRECACHE_ASSETS = [
  BASE,
  BASE + 'index.html',
  BASE + 'manifest.json',
  BASE + 'manifest.webmanifest',
  BASE + 'icons/icon-192.png',
  BASE + 'icons/icon-512.png',
  BASE + 'icons/icon-maskable-512.png',
  BASE + 'apple-touch-icon.png',
  BASE + 'favicon.png',
  BASE + 'favicon.ico',
];

// Instalação: cria cache separado para a nova versão
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(async (cache) => {
        // Pré-carrega os recursos usando { cache: 'reload' } para garantir
        // que arquivos novos sejam baixados sem interferência de caches HTTP do navegador
        const fetchPromises = PRECACHE_ASSETS.map((asset) => {
          return fetch(asset, { cache: 'reload' })
            .then((response) => {
              if (response && response.status === 200) {
                return cache.put(asset, response);
              }
            })
            .catch((err) => {
              console.warn('[SW] Aviso no precache de:', asset, err);
            });
        });
        await Promise.all(fetchPromises);
      })
  );
});

// Ativação: remove caches de versões antigas e assume o controle dos clientes
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => {
            if (name !== CACHE_NAME && name.startsWith('evolution-fitness-pwa-')) {
              console.log('[SW] Limpando versão antiga do cache:', name);
              return caches.delete(name);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Comunicação: atende solicitação para ativar imediatamente a nova versão
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] Comando SKIP_WAITING recebido. Ativando nova versão...');
    self.skipWaiting();
  }
});

// Interceptação inteligente de requisições
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Apenas métodos GET são armazenados em cache
  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  // REGRA DE SEGURANÇA: Não interceptar origens externas (Supabase, Google APIs, WhatsApp, ViaCEP)
  if (url.origin !== self.location.origin) {
    return;
  }

  // version.json e sw.js SEMPRE direto da rede sem cache
  if (url.pathname.endsWith('/version.json') || url.pathname.endsWith('/sw.js')) {
    event.respondWith(fetch(request, { cache: 'no-store' }));
    return;
  }

  // 1. Navegação de Páginas HTML -> NETWORK FIRST com fallback para cache
  // Garante que o index.html atualizado seja sempre baixado quando houver conexão
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request, { cache: 'no-cache' })
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          const basePath = getBasePath();
          return (
            (await caches.match(basePath + 'index.html')) ||
            (await caches.match(basePath)) ||
            (await caches.match('/index.html'))
          );
        })
    );
    return;
  }

  // 2. Chunks versionados pelo Vite (/assets/*) -> Cache First (nomes com hash são imutáveis)
  if (url.pathname.includes('/assets/')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // 3. Demais recursos estáticos (ícones, manifest, imagens) -> Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cached) => {
      const networkPromise = fetch(request, { cache: 'no-cache' })
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => {
          // Erro de rede ignorado quando offline
        });

      return cached || networkPromise;
    })
  );
});
