# Editor de vídeo da viagem

Transforma as fotos e vídeos dos celulares em Reels, Stories e um resumo do dia para a
família. O Claude roda no PC de casa (Windows) durante a viagem: lê os metadados, descobre o
lugar pelo roteiro do app (`../src/data`), olha os quadros dos vídeos, escolhe os cortes,
escreve o plano de edição e renderiza com Remotion. Ninguém posta nada sozinho: tudo sai
como rascunho para o Leonardo e a Priscila aprovarem.

Pacote separado do app: tem o próprio `package.json` e está fora do `tsconfig` e do build
do Next.

## Fluxo

```
entrada/<aparelho>/   ← fotos e vídeos chegam aqui (leo-android, pri-iphone)
npm run importar      → trabalho/catalogo.json + trabalho/quadros/<arquivo>.jpg
npm run rascunho      → trabalho/plano-rascunho.json   (--dia 2026-11-23 para um dia só)
  (Claude revisa e salva trabalho/plano-<algo>.json)
npm run render -- trabalho/plano-x.json --previa   → saida/<titulo>-previa.jpg
npm run render -- trabalho/plano-x.json            → saida/<titulo>.mp4
```

`npm run roteiro` exporta `trabalho/lugares.json`: as paradas com data, horário,
coordenadas e o texto de história. É de lá que saem as notas.

### 1. Importar

O importador lê GPS e data de cada arquivo (exiftool), converte para o fuso do lugar e casa
com o roteiro: distância até a parada, pesada pelo horário marcado naquele dia. Arquivo sem
GPS cai na parada do mesmo dia com horário mais próximo (`metodo: 'roteiro'`).

**O palpite precisa ser confirmado.** Cada mídia traz `candidatos` (os 3 melhores). Abra a
folha de contato e confira: o Kaminarimon fica a 100 m de um café do roteiro e a 400 m do
ponto do Sensō-ji, e só a imagem resolve.

### 2. Olhar os vídeos

Abra cada `trabalho/quadros/*.jpg` (Read na imagem). Os quadros vão da esquerda para a
direita, de cima para baixo, a cada `quadros.passo` segundos, com o tempo no canto.
Descarte:
- câmera procurando enquadramento, apontada para o chão, tremida ou desfocada;
- alguém passando na frente da lente, dedo, tela preta;
- trechos repetidos (fica o melhor).

Procure o momento que conta a história: o portão aparecendo, o cervo entrando no quadro.

### 3. Escrever o plano

Tipos em `src/plano.ts`. Regras da casa:

- **Reel**: 30–60 s. Clipe de vídeo de 2 a 6 s; foto 2–3 s.
- **Mapa a cada mudança de lugar** (o rascunho já insere):
  - `globo` para voos, com as fotos dos aeroportos como `foto` (viram polaroid);
  - `regiao` para trem bala e mudança de cidade, com as próximas cidades em `contexto`;
  - `local` para o que se faz no mesmo dia; as paradas do roteiro no caminho entram como
    `passagem: true`.
  - Legenda com o transporte e o tempo, tirados do roteiro (`legs.ts`), nunca chutados.
- **Nota de história** só em lugar com relevância histórica (não em todo clipe):
  1 ou 2 frases, até ~110 caracteres, escritas a partir do texto de `historia` do lugar em
  `lugares.json`. Nada de fato que não esteja no roteiro. O clipe com nota precisa de pelo
  menos 5 s para dar tempo de ler.
- `lugar.nome` é o nome que as pessoas reconhecem ("Itsukushima", não "Santuário
  Itsukushima"); `jp` em japonês; `linha` = "bairro ou cidade · dia mês, hh:mm".
- Sem música no Reel: o áudio do Instagram entra pelo app. Sugira o clima da música na
  legenda do post.

### 4. Conferir e renderizar

Sempre rode `--previa` antes do render longo e olhe a imagem: texto cortado, rótulo
sobreposto, polaroid cobrindo a rota. Para olhar uma animação de perto:
`--quadros 30,60,90` (quadros absolutos). O render completo leva ~4 min por minuto de vídeo.

## Instalação no PC (Windows)

1. Node 22 LTS.
2. `cd editor && npm install`. O exiftool vem junto (exiftool-vendored), e o ffmpeg e o
   Chrome headless vêm com o Remotion. Para as folhas de contato com o tempo escrito,
   instale o ffmpeg completo: `winget install Gyan.FFmpeg` (sem ele elas saem sem o tempo).
3. `npm run importar` com algum vídeo em `entrada/teste/` para conferir.

`REMOTION_BROWSER` aponta para um Chrome já instalado, se o download automático falhar.

## Testar sem mídia de verdade

`npm run demo:midia` gera em `entrada/` fotos e vídeos falsos, desenhados em SVG
(`demo/cenas.tsx`), com os metadados que um iPhone e um Android gravariam. Cada vídeo tem um
trecho ruim de propósito. Depois é o fluxo normal: importar, rascunho, plano, render.

## Dados

- `dados/japao.geo.json`: províncias do Japão, de [dataofjapan/land](https://github.com/dataofjapan/land)
  (Kokudo Sūchi Jōhō, MLIT), com a precisão reduzida para 4 casas.
- Mundo: `world-atlas` (Natural Earth, domínio público).
- `dados/extras.json`: aeroportos das conexões, com o fuso de novembro.

`entrada/`, `trabalho/` e `saida/` ficam fora do git: são mídia pessoal e coisas geradas.
