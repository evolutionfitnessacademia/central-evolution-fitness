import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { defineConfig, Plugin } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Identificador único gerado para cada build de produção
const buildTimestamp = Date.now();
const buildId = `ef_${buildTimestamp.toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
const buildTime = new Date().toISOString();

function pwaAutoUpdatePlugin(): Plugin {
  return {
    name: 'pwa-auto-update',
    config(config) {
      return {
        define: {
          ...config.define,
          __APP_BUILD_ID__: JSON.stringify(buildId),
          __APP_BUILD_TIME__: JSON.stringify(buildTime),
        },
      };
    },
    buildStart() {
      // Atualiza public/version.json durante o build
      const publicVersionPath = path.resolve(__dirname, 'public', 'version.json');
      try {
        fs.writeFileSync(
          publicVersionPath,
          JSON.stringify(
            {
              version: buildId,
              buildTime,
            },
            null,
            2
          ) + '\n',
          'utf-8'
        );
      } catch (err) {
        console.warn('[PWA Plugin] Erro ao gravar public/version.json:', err);
      }
    },
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      if (!fs.existsSync(distDir)) return;

      // Injeta o ID da versão no Service Worker gerado no dist/
      const swDistPath = path.join(distDir, 'sw.js');
      if (fs.existsSync(swDistPath)) {
        let swContent = fs.readFileSync(swDistPath, 'utf-8');
        swContent = swContent.replace(/__SW_BUILD_ID__/g, buildId);
        fs.writeFileSync(swDistPath, swContent, 'utf-8');
        console.log(`[PWA Plugin] Build ID injetado com sucesso no dist/sw.js: ${buildId}`);
      }

      // Gera o arquivo version.json também no dist/ para o deploy
      const versionJsonPath = path.join(distDir, 'version.json');
      fs.writeFileSync(
        versionJsonPath,
        JSON.stringify(
          {
            version: buildId,
            buildTime,
          },
          null,
          2
        ) + '\n',
        'utf-8'
      );
      console.log(`[PWA Plugin] dist/version.json gerado.`);
    },
  };
}

export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/central-evolution-fitness/' : './',
  plugins: [react(), tailwindcss(), pwaAutoUpdatePlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modify—file watching is disabled to prevent flickering during agent edits.
    hmr: process.env.DISABLE_HMR !== 'true',
    // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
  },
});
