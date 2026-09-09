import { defaultCache } from '@serwist/next/worker';
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';
import { Serwist, NetworkFirst, StaleWhileRevalidate, ExpirationPlugin } from 'serwist';

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
      // payload RSC das navegações internas do Next
      matcher: ({ request, url }) => request.method === 'GET' && ehPagina(url) && request.headers.has('RSC'),
      handler: new StaleWhileRevalidate({
        cacheName: 'paginas-rsc',
        plugins: [new ExpirationPlugin({ maxEntries: 220, maxAgeSeconds: QUARENTA_E_CINCO_DIAS })],
      }),
    },
    {
      // o HTML de todas as páginas: fica guardado por 45 dias, não 24 h,
      // e cabe o app inteiro (são ~106 rotas), não 32 entradas
      matcher: ({ request, url }) => request.method === 'GET' && ehPagina(url),
      handler: new StaleWhileRevalidate({
        cacheName: 'paginas',
        matchOptions: { ignoreVary: true },
        plugins: [new ExpirationPlugin({ maxEntries: 220, maxAgeSeconds: QUARENTA_E_CINCO_DIAS })],
      }),
    },
    ...defaultCache,
  ],
});

serwist.addEventListeners();
