import { defaultCache } from '@serwist/next/worker';
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';
import { Serwist, NetworkFirst } from 'serwist';

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

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
    ...defaultCache,
  ],
});

serwist.addEventListeners();
