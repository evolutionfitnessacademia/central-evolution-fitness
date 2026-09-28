import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Registro do Service Worker para suporte a PWA (executado exclusivamente no navegador)
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swPath = new URL('sw.js', import.meta.env.BASE_URL).pathname;
    navigator.serviceWorker
      .register(swPath)
      .then(() => {
        // Service worker registrado com sucesso
      })
      .catch((err) => {
        console.debug('PWA Service Worker registration status:', err);
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
