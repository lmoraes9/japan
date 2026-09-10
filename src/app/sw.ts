import { defaultCache } from '@serwist/next/worker';
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';
import { Serwist, NetworkFirst, ExpirationPlugin } from 'serwist';

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

/** 45 dias cobre a viagem inteira com folga dos dois lados. */
const QUARENTA_E_CINCO_DIAS = 60 * 60 * 24 * 45;

/** É uma página do app (e não asset, API ou arquivo)? */
function ehPagina(url: URL): boolean {
  if (url.origin !== self.location.origin) return false;
  if (url.pathname.startsWith('/_next/')) return false;
  if (url.pathname.startsWith('/api/')) return false;
  if (url.pathname.startsWith('/lugares/')) return false;
  if (url.pathname.startsWith('/icons/')) return false;
  return !/\.[a-z0-9]+$/i.test(url.pathname);
}

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    {
      // sync e cotação: rede primeiro, cache como fallback offline
      matcher: /\/api\/(sync|rate)/,
      handler: new NetworkFirst({
        cacheName: 'api-cache',
        networkTimeoutSeconds: 8,
      }),
    },
    {
      // payload RSC das navegações internas do Next: rede primeiro, para o
      // app nunca mostrar a versão de ontem quando há sinal
      matcher: ({ request, url }) => request.method === 'GET' && ehPagina(url) && request.headers.has('RSC'),
      handler: new NetworkFirst({
        cacheName: 'paginas-rsc',
        networkTimeoutSeconds: 4,
        plugins: [new ExpirationPlugin({ maxEntries: 220, maxAgeSeconds: QUARENTA_E_CINCO_DIAS })],
      }),
    },
    {
      // O HTML de todas as páginas. Rede primeiro, com 4 s de paciência:
      // com sinal, sempre a versão nova; sem sinal, o cache de 45 dias, que
      // cabe o app inteiro (~130 rotas) em vez das 32 entradas do padrão.
      matcher: ({ request, url }) => request.method === 'GET' && ehPagina(url),
      handler: new NetworkFirst({
        cacheName: 'paginas',
        networkTimeoutSeconds: 4,
        matchOptions: { ignoreVary: true },
        plugins: [new ExpirationPlugin({ maxEntries: 220, maxAgeSeconds: QUARENTA_E_CINCO_DIAS })],
      }),
    },
    ...defaultCache,
  ],
});

serwist.addEventListeners();
