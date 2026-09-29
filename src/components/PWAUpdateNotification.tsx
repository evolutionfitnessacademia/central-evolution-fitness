import React from 'react';
import { usePwaUpdate } from '../pwa/pwaManager';

export default function PWAUpdateNotification() {
  const { updateAvailable, isUpdating, applyUpdate, dismissUpdate } = usePwaUpdate();

  if (!updateAvailable) {
    return null;
  }

  return (
    <aside
      role="region"
      aria-label="Atualização do sistema"
      className="fixed bottom-4 left-4 right-4 max-w-md mx-auto z-50 animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-auto"
    >
      <div className="bg-black/95 backdrop-blur-md border-2 border-red-600 rounded-xl p-4 shadow-2xl shadow-red-950/50 text-white">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600" />
            </span>
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-white">
              NOVA ATUALIZAÇÃO DISPONÍVEL
            </h4>
          </div>

          <button
            type="button"
            onClick={dismissUpdate}
            aria-label="Fechar aviso"
            className="text-zinc-400 hover:text-white text-base leading-none p-1 -mr-1 -mt-1 cursor-pointer transition-colors"
          >
            ×
          </button>
        </div>

        <p className="text-xs text-zinc-300 mb-3 leading-relaxed">
          Uma nova versão da Evolution Fitness está pronta.
        </p>

        <button
          type="button"
          onClick={applyUpdate}
          disabled={isUpdating}
          className="w-full bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white py-2.5 px-4 rounded-lg font-bold text-xs uppercase tracking-tight shadow-md hover:shadow-red-900/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
        >
          {isUpdating ? (
            <>
              <svg
                className="animate-spin h-3.5 w-3.5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>ATUALIZANDO...</span>
            </>
          ) : (
            <span>ATUALIZAR AGORA</span>
          )}
        </button>
      </div>
    </aside>
  );
}
