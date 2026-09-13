<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# App da viagem (japan)

Roteiro pessoal de viagem ao Japão. Next.js 16 + Tailwind 4 + Zustand, PWA via Serwist.
Deploy na Vercel a partir de `main`; branches geram preview URL.

- `npm run build` — usa `--webpack` (obrigatório, não remover a flag).
- `src/app/api/sync/route.ts` — sync entre celulares via Upstash Redis (`UPSTASH_REDIS_REST_*`
  ou `KV_REST_API_*`). Sem as variáveis a rota responde sem sync, o build não quebra.
- `src/components/MapView.tsx` — mapa precisa de `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.
  Sem a chave o app cai nos deep links do Google Maps.
- Nenhuma variável de ambiente é necessária para buildar: todas têm fallback.
  Elas vivem só no painel da Vercel — mapa e sync só funcionam de verdade no deploy.
- `.env.example` documenta as variáveis.

## Sessões na nuvem (claude.ai/code)

O PC não precisa estar ligado. Nesse fluxo trabalhe sempre em branch e abra PR
(`main` é a produção) — o preview da Vercel é onde se confere o resultado no celular.
Não há como rodar o app com mapa/sync no sandbox: valide com `npm run build` e
`npx tsc --noEmit`, e deixe a verificação visual para o preview.
