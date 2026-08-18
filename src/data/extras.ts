export interface ExtraPlace {
  id: string;
  title: string;
  subtitle: string;
  paragraphs: string[];
  mapQuery?: string;
}

export const EXTRAS_IN_ITINERARY = [
  '**Miyajima** (dia 24) — inegociável. Ir a Hiroshima e não atravessar para a ilha do torii flutuante seria um erro. Patrimônio Mundial, vale dos bordos no pico exato da folhagem, ostras e o templo Daishō-in.',
  '**Kamakura** (dia 20) — a peça que faltava na linha do tempo de vocês: onde os guerreiros tomaram o poder em 1185. Templos zen, o Grande Buda ao ar livre desde 1498, e folhagem no auge. 1h de Tóquio.',
  '**Kurashiki** (dia 25) — o bairro de canais e armazéns brancos, no caminho entre Hiroshima e Himeji. Custa 40 minutos de desvio e é uma das cidades mais bonitas do Japão.',
];

export const EXTRAS: ExtraPlace[] = [
  {
    id: 'nikko',
    title: 'Nikkō',
    subtitle: 'No lugar de Kamakura, dia 20 · 1h50 de Asakusa pelo Tobu Limited Express, ~¥3.050',
    paragraphs: [
      'Se vocês preferem esplendor barroco a sobriedade zen, Nikkō ganha de longe.',
      'O **Tōshō-gū** (08:00–17:00, ¥1.600) é o mausoléu de **Tokugawa Ieyasu**, construído em 1636 pelo neto Iemitsu num nível de ostentação que era, ele próprio, uma mensagem política: o portão **Yōmeimon** tem 508 esculturas e é apelidado de "o portão do crepúsculo" porque as pessoas ficavam até anoitecer olhando. Ali estão os três macacos originais ("não vejo, não ouço, não falo") e o *nemuri-neko*, o gato dorminhoco. Da porta atrás dele, 207 degraus de pedra sobem até o túmulo simples de Ieyasu — o contraste é o ponto inteiro.',
      'Comam **yuba**, a pele de tofu, que é a especialidade de Nikkō. **Contra:** 4 horas de trem no total, e a folhagem em Nikkō costuma passar do pico antes de 20 de novembro.',
    ],
    mapQuery: 'Toshogu Shrine Nikko',
  },
  {
    id: 'koyasan',
    title: 'Kōyasan',
    subtitle: 'Se quiserem uma noite fora do padrão · 2h de Osaka pela linha Nankai + funicular',
    paragraphs: [
      'A montanha sagrada do budismo Shingon, fundada por **Kūkai em 816**. O programa é dormir num **shukubō** (alojamento de templo), jantar comida vegetariana de monastério e assistir à cerimônia matinal às 6h.',
      'A parte inesquecível é o **Okunoin**: dois quilômetros de cemitério dentro de uma floresta de cedros de 600 anos, com **mais de 200.000 túmulos** — senhores da guerra, poetas, e um mausoléu ao fundo onde, segundo a doutrina, Kūkai não está morto, apenas em meditação eterna. Monges levam refeição até a porta dele duas vezes por dia, todos os dias, **desde 835**. Percorrer o Okunoin à noite, com as lanternas acesas, é uma das experiências mais fortes que o Japão oferece. **Custo:** uma noite de Osaka ou Kyoto. Em novembro faz frio de verdade lá em cima.',
    ],
    mapQuery: 'Okunoin Cemetery Koyasan',
  },
  {
    id: 'uji',
    title: 'Uji',
    subtitle: 'Meia diária de Kyoto · 20 min de trem da Estação de Kyoto',
    paragraphs: [
      'Encaixa numa manhã, se quiserem trocar alguma coisa do dia 30.',
      'O **Byōdō-in** (08:30–17:30, ¥700) é o Salão da Fênix de **1053** — e vocês já o conhecem sem saber: ele está estampado na **moeda de ¥10**, e as fênix do telhado estão na nota de ¥10.000. É praticamente o único edifício da era Heian que sobreviveu inteiro, construído por um nobre Fujiwara convencido de que o mundo estava entrando na era do declínio do budismo e que só restava construir o paraíso em terra. Uji é também a capital histórica do **matcha** e o cenário dos capítulos finais do *Genji Monogatari*, do século XI.',
    ],
    mapQuery: 'Byodo-in Temple Uji',
  },
  {
    id: 'kobe',
    title: 'Kobe',
    subtitle: 'Meia diária de Osaka · 20 min de Osaka',
    paragraphs: [
      'Encaixaria na manhã do dia 27 no lugar de Sumiyoshi Taisha. O bairro **Kitano** tem as casas de comerciantes estrangeiros do fim do século XIX (Kobe foi um dos primeiros portos abertos ao Ocidente, em 1868), e há o memorial do terremoto de 1995. E, claro, a carne — **Steakland** e **Mouriya** servem wagyu de Kobe certificado em almoço a preço bem mais civilizado que o jantar.',
    ],
    mapQuery: 'Kitano district Kobe',
  },
  {
    id: 'shimanami',
    title: 'Onomichi e o Shimanami Kaidō',
    subtitle: 'Se gostarem de bicicleta · entre Hiroshima e Kurashiki',
    paragraphs: [
      'Uma ciclovia de **70 km** que atravessa seis ilhas do Mar Interior de Seto por pontes suspensas, considerada uma das melhores rotas de bicicleta do mundo. Dá para fazer só um trecho, alugando em Onomichi e devolvendo numa ilha. Custaria um dia inteiro — teria que sair Kurashiki e Himeji, então provavelmente não desta vez.',
    ],
    mapQuery: 'Shimanami Kaido Onomichi',
  },
];
