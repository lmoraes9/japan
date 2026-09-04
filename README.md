# Japão 2026 · App de viagem

App companheiro da viagem de 18 nov a 3 dez de 2026 (Priscila & Leonardo), gerado a partir do roteiro completo. Mobile-first, instalável como PWA, funciona offline.

## O que tem

- **Agora** — detecta o dia da viagem e a hora do Japão e mostra onde vocês estão no roteiro, a próxima parada com botão *Navegar*, e contagens regressivas para voos, Shinkansen e o prazo do tax-free em Haneda. Antes da viagem, mostra countdown do embarque + checklist pré-viagem + os 3 alertas.
- **Roteiro** — os 16 dias completos, com horários, história, onde comer, favoritos e notas por parada.
- **Mapa** — Google Maps com pins numerados por dia; offline degrada para lista com deep links.
- **Gastos** — registro em ienes com conversão automática para reais (cotação cacheada para offline), categorias, orçamento de compras e divisão por dia.
- **Mais** — checklist de compras sincronizada, guias de compra (tax-free, iPhone, MacBook, robô, cama), frases em japonês com tela grande para mostrar ao atendente, logística, extras e ajustes.
- **Sincronização** — checklist, favoritos, notas e gastos sincronizam entre os dois celulares via um código de viagem (padrão: `japao2026`). Local-first: tudo funciona offline e sincroniza quando a conexão volta.

## Rodar localmente

```bash
npm install
npm run dev        # desenvolvimento (PWA desativado em dev)
npm run build      # build de produção (usa webpack por causa do Serwist)
npm start          # servir o build
```

Teste a tela "Agora" com datas simuladas: `http://localhost:3000/?fakeNow=2026-11-19T07:00` (hora do Japão).

## Deploy na Vercel (passo a passo)

### 1. Subir para o GitHub e importar na Vercel

```bash
git remote add origin https://github.com/SEU_USUARIO/japan.git
git push -u origin main
```

Depois em [vercel.com/new](https://vercel.com/new): importe o repositório. O build já está configurado (`next build --webpack`).

### 2. Upstash Redis (sincronização)

No painel do projeto na Vercel: **Storage → Marketplace → Upstash Redis → Create** (plano free basta). As variáveis `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN` são injetadas automaticamente. Faça um **Redeploy** depois de criar.

### 3. Chave do Google Maps

1. Acesse [console.cloud.google.com](https://console.cloud.google.com) e crie um projeto (precisa de cartão cadastrado; a cota gratuita de ~10 mil carregamentos/mês é mais que suficiente).
2. **APIs & Services → Library → Maps JavaScript API → Enable** (só essa).
3. **Credentials → Create credentials → API key.** Restrinja a chave:
   - Application restrictions: *Websites* → adicione `https://SEU-APP.vercel.app/*` e `http://localhost:3000/*`
   - API restrictions: *Maps JavaScript API*
4. (Opcional, recomendado) **Google Maps Platform → Map management → Create map ID** (tipo JavaScript / Vector) para os pins.
5. Na Vercel: **Settings → Environment Variables**:
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` = sua chave
   - `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` = seu map ID (ou deixe sem — usa `DEMO_MAP_ID`)
6. Redeploy.

Sem a chave o app inteiro funciona — só o mapa embutido é substituído pela lista com botões que abrem o app do Google Maps.

### 4. Nos celulares

1. Abram a URL do app no Safari/Chrome.
2. **Compartilhar → Adicionar à Tela de Início** (nos dois iPhones).
3. Em **Mais → Ajustes**, confiram que o código da viagem é o mesmo nos dois aparelhos e marquem quem é quem (P/L).

## Fotos dos mapas de lugares

Os mapas ilustrados (`/lugar/fushimi-inari`) mostram uma foto em cada ponto. As fotos **não estão no repositório**: elas são baixadas do Wikimedia Commons (licença livre, crédito exibido no app) por um script:

```bash
npm run fotos                 # baixa o que falta
npm run fotos -- --force      # rebaixa tudo
npm run fotos -- --only fushimi-inari
```

Sem computador à mão, o mesmo script roda no GitHub: **aba Actions → "Baixar fotos dos mapas" → Run workflow**. Ele baixa, commita as fotos na branch e a Vercel redeploya sozinha. `force` rebaixa tudo; `only` limita a um mapa.

O script salva as imagens em `public/lugares/<mapa>/<ponto>.jpg` e escreve os créditos em `src/data/placePhotos.generated.ts`. **Commitem os dois** — é isso que vai para a Vercel.

Para trocar **uma** foto que não agradou sem mexer nas outras: edite a busca daquele ponto em `scripts/photo-queries.json` e rode o workflow com `force` marcado e `only` igual à chave, por exemplo `stops/d02-jimbocho` ou `nara/kasuga`.

O script recusa foto cujo nome de arquivo não cite o lugar — é o que evita "um Buda dourado qualquer" no ponto do Grande Buda. Por isso algumas paradas (restaurantes, konbini, ótica) ficam sem foto: não existe foto delas no Commons, e ponto sem foto é melhor que foto errada. `node scripts/fetch-place-photos.mjs --validar` revê o que já está baixado com essa régua.

As frases de busca ficam em `scripts/photo-queries.json`: se a foto escolhida para um ponto não agradar, edite a busca daquele ponto e rode de novo com `--force`. Para usar foto própria, basta salvar por cima do arquivo em `public/lugares/...` (aí o crédito continua sendo o da foto anterior — apague a entrada no arquivo gerado se quiser sem crédito).

Sem rodar o script o app funciona igual, só não mostra foto nenhuma. As fotos entram no cache offline depois que a página é aberta uma vez com internet.

## Estrutura

- `src/data/` — todo o conteúdo do roteiro em TypeScript (dias, paradas, coordenadas, compras, logística, frases). Para ajustar o roteiro, edite esses arquivos.
- `src/lib/now.ts` — resolve a posição no roteiro pela hora do Japão (o "dia" vira às 04:00 JST).
- `src/lib/store.ts` + `src/lib/sync.ts` — estado local-first com fila de mutações e merge last-write-wins.
- `src/app/api/sync/route.ts` — endpoint de sincronização (Upstash Redis, chave `trip:<código>`).
- `src/app/sw.ts` — service worker (Serwist): conteúdo precacheado, APIs com fallback de cache.
