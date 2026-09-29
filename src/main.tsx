import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initPwaAutoUpdate } from './pwa/pwaManager';

// Inicializa o sistema de PWA com detecção de versão e atualização automática
initPwaAutoUpdate();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
