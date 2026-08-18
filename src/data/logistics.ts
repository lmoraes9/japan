export interface InfoBlock {
  label: string;
  tone?: 'info' | 'ok' | 'warn';
  paragraphs?: string[];
  bullets?: string[];
}

export interface TableBlock {
  title?: string;
  headers: string[];
  rows: string[][];
}

/** ── 3 alertas — "Leia isto primeiro" ── */
export const ALERTS: InfoBlock[] = [
  {
    label: '1 · Tax-free virou reembolso no aeroporto',
    tone: 'warn',
    paragraphs: [
      'A partir de **1º de novembro de 2026** o Japão acabou com o desconto no caixa. Vocês viajam dia 18 — pegam o sistema novo, sem período de transição.',
      '**Consequência prática:** guardem todos os recibos juntos, num envelope só, e cheguem em Haneda no dia 3 às **17:00** (voo 20:25). E deixem MacBook, iPhone e o robô acessíveis — não no fundo da mala despachada antes da inspeção.',
    ],
    bullets: [
      'Você paga o preço cheio, **com os 10% de imposto**, na loja.',
      'Escaneia o QR code do recibo e registra passaporte e forma de reembolso no site **J-TaxRefund** (só na primeira compra da viagem).',
      '**Em Haneda**, antes do voo: quiosque eletrônico + inspeção da alfândega, que pode pedir para ver as mercadorias.',
      'Mínimo continua ¥5.000 (sem imposto) por loja por dia. Acabou o teto de ¥500.000 para consumíveis e acabou o lacre plástico.',
      'Enviar pelos Correios não dá mais direito a isenção (mudou em abril/2025). **Tem que sair do Japão com o produto na mão.**',
    ],
  },
  {
    label: '2 · O iPhone 18 "normal" não vai existir em novembro',
    tone: 'warn',
    paragraphs: [
      'A Apple dividiu o lançamento: em setembro/2026 saem só **iPhone 18 Pro, 18 Pro Max e o dobrável**. O **iPhone 18 comum e o 18e ficaram para março/2027**. Em novembro, na loja, vai ter Pro ou o 17 do ano passado.',
      'E o alerta maior, que quase ninguém conta: **todo iPhone vendido no Japão tem o som do obturador da câmera travado** — toca mesmo no silencioso, mesmo no modelo SIM-free comprado na Apple Store. É norma da indústria japonesa, ligada ao modelo do aparelho, e não tem como desativar. Para muita gente isso sozinho já decide a compra.',
    ],
  },
  {
    label: '3 · MacBook: o M5 compensa, mas o teclado é o problema',
    tone: 'warn',
    paragraphs: [
      'O **MacBook Neo** existe mesmo (lançou em março/2026, chip A18 Pro de iPhone, a partir de US$599). Ele é uma máquina de navegador. Para Godot, Docker, CLI do Salesforce e planilha pesada, **o M5 compensa muito mais**. O Air M5 já vem com 16 GB e 512 GB de série.',
      'O nó é outro: **as Apple Stores japonesas estocam teclado JIS japonês.** Teclado US é configuração sob encomenda, feita só na loja online — e compra online não entra no reembolso de imposto. Detalhes e as saídas possíveis estão na seção de compras.',
    ],
  },
];

/** ── Voos ── */
export const FLIGHTS_TABLE: TableBlock = {
  headers: ['Trecho', 'Voo', 'Detalhe'],
  rows: [
    ['GRU → JFK', 'JL5501 (op. Latam)', '16/11 22:50 → 17/11 06:40 · T3 → T4 · 9h50'],
    ['JFK → HND', 'JL005 (op. JAL A350)', '17/11 12:40 → 18/11 17:15 · T8 → T3 · 14h35'],
    ['HND → DFW', 'JL7014 (op. American)', '3/12 20:25 → 3/12 17:05 · 11h40'],
    ['DFW → GRU', 'JL7204 (op. American)', '3/12 19:20 → 4/12 08:30 · 10h10'],
  ],
};

export const FLIGHT_NOTES: InfoBlock[] = [
  {
    label: 'A conexão de Dallas é o ponto frágil',
    tone: 'warn',
    paragraphs: [
      '**2h15 em DFW**, chegando às 17:05 no pico. Vocês vão ter que passar imigração dos EUA como estrangeiros, pegar a mala, passar alfândega, redespachar e refazer o raio-X — tudo isso antes de embarcar às 19:20. É legal (fica acima do tempo mínimo de conexão), mas é apertado de verdade.',
    ],
    bullets: [
      'Peçam assentos na **frente da cabine** no voo de Tóquio. Sair 10 minutos antes vale muito na fila da imigração.',
      'Confirmem se as malas vão **etiquetadas até GRU** — mesmo assim vocês precisam retirá-las em DFW e recolocar na esteira de reconexão.',
      'Chegada e saída são as duas no terminal internacional da American. Confirmem o terminal no app na véspera; o "Terminal 0" do print é só um placeholder do sistema.',
      'Se o voo de Haneda atrasar mais de 40 minutos, procurem o balcão de conexões ainda no avião/na chegada.',
    ],
  },
  {
    label: 'Na ida, JFK exige entrada nos EUA',
    tone: 'info',
    paragraphs: [
      'Brasileiro não tem trânsito internacional isento nos Estados Unidos: mesmo só conectando, vocês passam imigração e alfândega americanas com o **visto B1/B2 válido**. Depois é AirTrain do Terminal 4 ao Terminal 8. Com 6 horas, dá folga confortável — inclusive para comer bem e dormir um pouco no lounge.',
    ],
  },
];

/** ── Trens ── */
export const TRAINS_INTRO = [
  'Fizemos a conta. Somando todos os trechos de trem do roteiro, vocês gastam por volta de **¥48.000** espalhados em 15 dias. O JR Pass nacional custa ¥50.000 por 7 dias ou ¥80.000 por 14 — e as duas pontas longas (Tóquio→Hiroshima e Kyoto→Tóquio) estão a 8 dias de distância uma da outra, então nenhuma janela de 7 dias pega as duas. **Não comprem o JR Pass nacional.**',
];

export const TRAINS_TABLE: TableBlock = {
  headers: ['Trecho', 'Custo aprox.', 'Como'],
  rows: [
    ['Haneda → hotel Tóquio', '¥600', 'Keikyu + JR, ~45 min'],
    ['Tóquio → Hiroshima', '¥19.800', 'Nozomi reservado, 3h50'],
    ['Hiroshima → Kurashiki → Himeji → Osaka', '¥11.500', 'Sanyo Shinkansen + local'],
    ['Miyajima ida e volta (trem + ferry)', '¥1.000', '+ ¥100 de taxa de visitante'],
    ['Osaka → Kyoto', '¥580', 'JR Special Rapid, 29 min'],
    ['Nara ida e volta', '¥1.500', 'Kintetsu ou JR'],
    ['Kyoto → Tóquio', '¥14.200', 'Nozomi reservado, 2h15'],
    ['Metrô e ônibus urbanos (15 dias)', '~¥12.000', 'Suica'],
  ],
};

export const TRAINS_NOTES: InfoBlock[] = [
  {
    label: 'A alternativa que talvez feche',
    tone: 'ok',
    paragraphs: [
      'O **JR Kansai-Hiroshima Area Pass** (5 dias consecutivos, ~¥17.000 — confiram o preço atual no site da JR West) cobre o Sanyo Shinkansen entre Shin-Osaka e Hiroshima, incluindo Nozomi, mais Himeji, Okayama, Kurashiki, Nara, Kobe e o **ferry para Miyajima**.',
      'Ativado em **24/11**, ele pega: Miyajima, o dia Hiroshima→Kurashiki→Himeji→Osaka, Osaka→Kyoto e a ida a Nara. Dá cerca de ¥16.000 de trechos — ou seja, empata. Vale mais pela conveniência (reservas de assento grátis, sem fila de máquina) do que pela economia. Se preferirem simplicidade, comprem avulso pelo app **Smart EX**, que aceita cartão estrangeiro.',
    ],
  },
];

/** ── Takuhaibin ── */
export const TAKUHAIBIN: InfoBlock = {
  label: 'Malas: usem o takuhaibin',
  tone: 'ok',
  paragraphs: [
    'Serviço de entrega porta-a-porta (Yamato / "Ta-Q-Bin"), ~¥2.500 por mala, 1 a 2 dias. O balcão fica em qualquer conveniência e em todo hotel.',
  ],
  bullets: [
    'Dia 23, saindo de Tóquio: mandem as malas grandes direto para o hotel de **Kyoto** e viajem leves para Hiroshima com uma mochila de 2 dias. Vocês reencontram as malas no dia 27.',
    'Dia 1º de dezembro, saindo de Kyoto: mandem tudo para o hotel de Tóquio pela manhã e passem o dia sem peso.',
  ],
};

/** ── Clima ── */
export const CLIMATE: InfoBlock = {
  label: 'Clima e luz',
  tone: 'info',
  paragraphs: [
    'Entre 5°C e 17°C, seco e ensolarado — a melhor época do ano no Japão. Mas **o sol se põe às 16:30**. Isso muda o roteiro de verdade: templo fecha às 16:00/17:00, então as manhãs carregam o dia, e a partir das 17:00 o programa vira comida, luz artificial e iluminações noturnas de outono. Levem camadas, um casaco leve, guarda-chuva pequeno e **meias boas** — vocês vão descalçar o sapato várias vezes por dia.',
  ],
};

/** ── Datas de atenção ── */
export const KEY_DATES: InfoBlock = {
  label: 'Datas para prestar atenção',
  tone: 'warn',
  bullets: [
    '**23/11 (seg)** — Kinrō Kansha no Hi, feriado nacional. É justo o dia do Shinkansen para Hiroshima. Reservem assento com antecedência.',
    '**Segundas-feiras** — Museu Nacional de Tóquio e Museu Ohara (Kurashiki) fecham.',
    '**Terças** — Isui-en, em Nara, fecha.',
    '**Domingos** — o mercado externo de Tsukiji fecha quase todo. Está encaixado no sábado por isso.',
  ],
};
