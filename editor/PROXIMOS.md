# Onde paramos (passagem do chat na nuvem para o chat local)

Resumo da conversa que criou o editor, para quem continua no PC.

## O que existe

- Fluxo completo com mídia falsa: `npm run demo:midia` → `npm run importar` →
  plano (`demo/plano-demo.json` é o plano pronto) → `npm run render`.
- 7 estilos (`src/estilos/`): noite, outono, caderno, ukiyoe, linha, aovivo, globinho.
- Mídia falsa, vídeos renderizados e `trabalho/` **não** estão no git (ficam no
  `.gitignore`); tudo se refaz com os comandos acima.

## O que eles gostaram

- **outono** (o tom quente, a mincho, as folhas) e, principalmente, a ideia do
  **globinho**: foto/vídeo em tela cheia o tempo todo e um globo 3D sem fundo no canto
  de baixo à direita. O tamanho do globo (raio 172 px) está bom.

## Próximos passos pedidos

1. **Globinho mais para baixo.** Hoje o centro está em `CANTO = { cx: 792, cy: 1288 }`
   em `src/estilos/globinho.tsx` (o globo termina em y≈1460) e acham que ocupa espaço
   demais das fotos. Descer o globo e o texto que fica em cima dele.
   Atenção: no Reels, a faixa de baixo (≈430 px) tem o nome do perfil e a legenda, e a
   coluna da direita tem os botões; descer muito joga o globo para baixo disso. Nos
   Stories a faixa de baixo é menor (≈250 px, a caixa de resposta). Talvez valha uma
   posição por formato (`plano.formato`).
2. **Variante nova, sem mexer na atual** (deixar o `globinho` como está para teste;
   criar um estilo novo, por exemplo `globinho-viagem`): na hora de cada mudança de
   lugar (São Paulo → Nova York, Tóquio → Hiroshima…), o globo **vem para o meio da
   tela, maior**, o avião ou o trem faz o trajeto, e depois o globo **volta para o
   canto** enquanto as fotos e vídeos do lugar seguem rolando. A ideia é deixar o
   trajeto bem claro para quem assiste. Hoje o globo só vai para o meio no fecho
   (`CENTRO` e `tf` em `Globo`); dá para reaproveitar essa interpolação usando as
   janelas de cada `viagem` (`ini`, `a`, `b`, `fim` em `montar`).

## Depois disso (conversado, ainda não feito)

- Sincronizar as fotos dos celulares com o PC: Android do Leonardo com FolderSync ou
  Syncthing; iPhone da Priscila com o iCloud para Windows. Mandar pelo WhatsApp apaga o GPS.
- Entregar as versões no celular para aprovarem (eles querem aprovar antes de postar).
- Versão Stories e resumo do dia para a família no WhatsApp.
- Rodada automática toda noite (por volta das 23 h do Japão) com o Claude Code em modo
  headless, e Remote Control para pedir ajustes do celular.
- Transcrever o áudio dos vídeos (Whisper) para achar os melhores momentos.
- Mapa de ruas de verdade dentro das cidades (hoje só tem contorno de costa).
