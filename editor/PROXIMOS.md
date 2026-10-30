# Onde paramos

Resumo do que foi decidido, para quem continua (na nuvem ou no PC).

## O que existe

- Fluxo completo com mídia falsa: `npm run demo:midia` → `npm run importar` →
  plano (`demo/plano-demo.json` é o plano pronto) → `npm run render`.
- 8 estilos (`src/estilos/`): noite, outono, caderno, ukiyoe, linha, aovivo, globinho,
  globinho-viagem.
- Mídia falsa, vídeos renderizados e `trabalho/` **não** estão no git (ficam no
  `.gitignore`); tudo se refaz com os comandos acima.
- O PC de casa (Windows) já tem tudo instalado e roda o fluxo: Node 22, ffmpeg (Gyan),
  Syncthing e iCloud para Windows.

## O que eles gostaram

- **outono** (o tom quente, a mincho, as folhas) e, principalmente, a ideia do
  **globinho**: foto/vídeo em tela cheia o tempo todo e um globo 3D sem fundo no canto
  de baixo à direita. O tamanho do globo (raio 172 px) está bom.

## Feito no PC (29/10/2026)

- Globinho mais para baixo, com posição por formato (`CANTOS` em `globinho.tsx`):
  Reels `cy` 1288 → 1380, Stories 1490, família 1648. Esperando eles verem no celular.
- Variante **globinho-viagem**: a cada viagem o globo vem para o meio (raio 330),
  as fotos escurecem um pouco, o trajeto aparece centrado em cima do globo, e ele volta
  para o canto. O trajeto ganha o tempo inteiro do mapa (a foto de chegada espera).
- Importador: lugares fora do roteiro (cidade pelo GPS, offline), fuso pela mídia
  vizinha / roteiro / PC, HEIC → JPG, Live Photo e lixeira do Android de fora, tempo
  escrito nas folhas de contato no Windows. HEIC conferido com uma foto de verdade do
  Samsung do Leonardo (sai em pé, com data, fuso e GPS) e aberto no render.
- Sincronização do Android do Leonardo pelo Syncthing funcionando (a foto chega em ~2 s
  no Wi-Fi de casa), ver
  "Fotos chegando sozinhas no PC" no CLAUDE.md.

## Próximos passos

- Teste de verdade em casa com as fotos que chegarem pelo Syncthing/iCloud: importar,
  folhas de contato, rascunho, plano, render no globinho e no globinho-viagem.
- iPhone da Priscila: entrar no iCloud para Windows com o Apple ID dela, ligar
  `entrada/pri-iphone` à pasta do iCloud Fotos (ver CLAUDE.md), ver se o iCloud tem espaço
  (5 GB não dá) e conferir uma foto HEIC do iPhone (a do Samsung já foi conferida).
- Entregar as versões no celular para aprovarem (eles querem aprovar antes de postar).
- Versão Stories e resumo do dia para a família no WhatsApp.
- Rodada automática toda noite (por volta das 23 h do Japão) com o Claude Code em modo
  headless, e Remote Control para pedir ajustes do celular.
- Transcrever o áudio dos vídeos (Whisper) para achar os melhores momentos.
- Mapa de ruas de verdade dentro das cidades (hoje só tem contorno de costa).
