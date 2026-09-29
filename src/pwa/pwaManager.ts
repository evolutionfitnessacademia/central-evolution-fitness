/**
 * EVOLUTION FITNESS — PWA Update Manager
 * Sistema de detecção de atualização e comunicação com o Service Worker.
 */

import { useState, useEffect, useCallback } from 'react';

// Obtém dinamicamente o caminho base da aplicação
export function getAppBaseUrl(): string {
  if (typeof window === 'undefined') return '/';

  const pathname = window.location.pathname;
  // Detecção automática para GitHub Pages (/central-evolution-fitness/)
  if (pathname.includes('/central-evolution-fitness/')) {
    return '/central-evolution-fitness/';
  }

  const base = import.meta.env.BASE_URL;
  if (base && base !== './' && base !== '') {
    return base.endsWith('/') ? base : base + '/';
  }

  return '/';
}

type UpdateCallback = (hasUpdate: boolean) => void;
const listeners = new Set<UpdateCallback>();

let waitingWorkerInstance: ServiceWorker | null = null;
let currentRegistration: ServiceWorkerRegistration | null = null;
let hasDispatchedUpdate = false;

function notifyListeners(val: boolean) {
  hasDispatchedUpdate = val;
  listeners.forEach((fn) => fn(val));
}

// Inicia o registro e a escuta contínua de novas versões
export function initPwaAutoUpdate() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  const basePath = getAppBaseUrl();
  const swUrl = `${basePath}sw.js`;

  window.addEventListener('load', async () => {
    try {
      // Registra o Service Worker com updateViaCache: 'none' para que
      // o navegador sempre verifique o arquivo sw.js na rede sem cache HTTP
      const reg = await navigator.serviceWorker.register(swUrl, {
        scope: basePath,
        updateViaCache: 'none',
      });
      currentRegistration = reg;

      // 1. Se já houver um worker esperando ativação (ex: baixado em segundo plano)
      if (reg.waiting) {
        waitingWorkerInstance = reg.waiting;
        notifyListeners(true);
      }

      // 2. Escuta quando um novo Service Worker for encontrado
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (!newWorker) return;

        newWorker.addEventListener('statechange', () => {
          // Quando terminar de instalar e já existir um controller ativo,
          // significa que uma nova versão está pronta para ativação
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            waitingWorkerInstance = newWorker;
            notifyListeners(true);
          }
        });
      });

      // 3. Verificação periódica e em eventos de retorno do usuário
      const checkUpdate = () => {
        reg.update().catch(() => {});
      };

      // Ao abrir o app ou voltar para a aba
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          checkUpdate();
          checkRemoteVersion(basePath);
        }
      });

      window.addEventListener('focus', () => {
        checkUpdate();
        checkRemoteVersion(basePath);
      });

      window.addEventListener('online', () => {
        checkUpdate();
      });

      // Intervalo de segurança: a cada 10 minutos
      setInterval(() => {
        checkUpdate();
        checkRemoteVersion(basePath);
      }, 10 * 60 * 1000);

      // Verificação inicial
      checkUpdate();
      checkRemoteVersion(basePath);
    } catch (err) {
      console.debug('[PWA] Falha no registro do Service Worker:', err);
    }
  });

  // Recarrega a aplicação imediatamente quando o novo Service Worker assumir o controle
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      refreshing = true;
      window.location.reload();
    }
  });
}

// Verifica se o arquivo version.json publicado remotamente é mais novo que a versão atual
async function checkRemoteVersion(basePath: string) {
  try {
    const res = await fetch(`${basePath}version.json?_t=${Date.now()}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
    if (!res.ok) return;
    const data = await res.json();

    const localBuildId =
      typeof __APP_BUILD_ID__ !== 'undefined' ? __APP_BUILD_ID__ : '';

    if (data.version && localBuildId && data.version !== localBuildId) {
      console.log('[PWA] Nova versão detectada via version.json:', data.version);
      if (currentRegistration) {
        currentRegistration.update().catch(() => {});
      }
    }
  } catch {
    // Ignora erros de rede se estiver offline
  }
}

// Ativa a nova versão e recarrega
export function applyPwaUpdate() {
  if (waitingWorkerInstance) {
    waitingWorkerInstance.postMessage({ type: 'SKIP_WAITING' });
  } else if (currentRegistration?.waiting) {
    currentRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
  } else {
    window.location.reload();
  }

  // Fallback caso controllerchange não dispare em 800ms
  setTimeout(() => {
    window.location.reload();
  }, 800);
}

// Hook React para uso no componente de notificação
export function usePwaUpdate() {
  const [updateAvailable, setUpdateAvailable] = useState<boolean>(hasDispatchedUpdate);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const handler = (val: boolean) => setUpdateAvailable(val);
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);

  const handleApplyUpdate = useCallback(() => {
    setIsUpdating(true);
    applyPwaUpdate();
  }, []);

  const dismissUpdate = useCallback(() => {
    setUpdateAvailable(false);
  }, []);

  return {
    updateAvailable,
    isUpdating,
    applyUpdate: handleApplyUpdate,
    dismissUpdate,
    buildId: typeof __APP_BUILD_ID__ !== 'undefined' ? __APP_BUILD_ID__ : 'dev',
  };
}
