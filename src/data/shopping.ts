import type { InfoBlock, TableBlock } from './logistics';

export interface ShoppingGuide {
  id: string;
  title: string;
  checklistItemId?: string;
  blocks: (
    | { type: 'p'; text: string }
    | { type: 'note'; note: InfoBlock }
    | { type: 'table'; table: TableBlock }
    | { type: 'bullets'; items: string[] }
  )[];
}

export const TAXFREE_TABLE: TableBlock = {
  title: 'Como funciona o novo tax-free, na prática',
  headers: ['Etapa', 'Onde', 'O que fazer'],
  rows: [
    ['1. Compra', 'Loja credenciada', 'Pagar o preço **com** os 10%. Mostrar passaporte. Guardar o recibo com QR.'],
    ['2. Registro', 'Celular, uma vez só', 'Escanear o QR, registrar passaporte e forma de reembolso no J-TaxRefund.'],
    ['3. Compras seguintes', 'Qualquer loja', 'Só guardar os recibos. O registro já está feito.'],
    ['4. Aeroporto', 'Haneda, **antes** do check-in', 'Quiosque eletrônico + inspeção da alfândega. Produtos acessíveis.'],
    ['5. Reembolso', 'Conforme escolhido', 'Até 90 dias da compra. Cartão ou meio indicado no registro.'],
  ],
};

export const TAXFREE_FOOTNOTE =
  '**Regras que ficam:** mínimo de ¥5.000 (sem imposto) por loja por dia. **Regras que caem:** o teto de ¥500.000 para consumíveis, o lacre plástico, e a separação entre "bens gerais" e "consumíveis". **Regra que já caiu:** nada de enviar pelos Correios — tem que sair com o produto na mão.';

export const SHOPPING_GUIDES: ShoppingGuide[] = [
  {
    id: 'tshirt',
    title: '1 · Camisetas de algodão',
    checklistItemId: 'tshirt',
    blocks: [
      {
        type: 'note',
        note: {
          label: 'MUJI é a escolha certa',
          tone: 'ok',
          paragraphs: [
            '**MUJI** usa algodão orgânico certificado em toda a linha básica, e a camiseta de gola careca sai por volta de **¥1.490–1.990** — um terço do preço do Brasil, com um algodão melhor.',
            '**Onde:** MUJI Ginza (Namiki-dōri, B1 ao 6º, 11:00–21:00) é a loja-mãe e tem a linha completa, incluindo peças que não chegam às lojas menores. MUJI Shinjuku e MUJI Kyoto BAL também são grandes.',
            '**UNIQLO:** o básico de ¥990 é bom mas comum. O que vale de verdade são as linhas **Supima Cotton** (algodão de fibra extralonga, caimento muito superior) e **Uniqlo U**, desenhada pelo Christophe Lemaire — modelagem melhor e cores que não existem no básico. A Uniqlo Ginza tem 12 andares e a maior variedade do mundo.',
          ],
        },
      },
      {
        type: 'p',
        text: '**Cuidado com tamanho:** o corte japonês é bem menor. Um M brasileiro costuma ser um L ou XL japonês. Provem, não comprem de olho — e comprem várias de uma vez, é para isso que vocês vão.',
      },
    ],
  },
  {
    id: 'iphone',
    title: '2 · iPhone',
    checklistItemId: 'iphone',
    blocks: [
      {
        type: 'note',
        note: {
          label: 'O modelo que vocês querem talvez não exista',
          tone: 'warn',
          paragraphs: [
            'A Apple dividiu o lançamento de 2026: em setembro saíram **iPhone 18 Pro, 18 Pro Max e o dobrável**. O **iPhone 18 comum e o 18e ficaram para março de 2027**. Em novembro, na prateleira: Pro, Pro Max, dobrável, ou o iPhone 17 do ano anterior.',
            '**E o obturador não desliga.** Todo iPhone vendido no Japão emite o som da câmera obrigatoriamente — no silencioso, com fone, sempre. Não é configuração, é o modelo do aparelho, e vale também para o SIM-free comprado direto na Apple Store. Vem de um acordo da indústria japonesa dos anos 2000 contra fotografia clandestina. Se vocês tiram muita foto discreta, isso pode sozinho matar a ideia.',
          ],
        },
      },
      {
        type: 'p',
        text: '**Onde:** Apple Ginza (10:00–21:00, a primeira Apple Store fora dos EUA), Apple Marunouchi (a maior do Japão), Apple Shinjuku, Apple Shibuya. Bic Camera e Yodobashi também vendem SIM-free e às vezes têm estoque quando a Apple não tem.',
      },
      {
        type: 'p',
        text: '**Garantia:** o reparo de iPhone é, na prática, atrelado ao país de compra em muitos casos. Um iPhone japonês com defeito no Brasil pode virar dor de cabeça. O MacBook não tem esse problema — a garantia de Mac é internacional.',
      },
    ],
  },
  {
    id: 'macbook',
    title: '3 · MacBook — Neo ou M5',
    checklistItemId: 'macbook',
    blocks: [
      {
        type: 'table',
        table: {
          headers: ['', 'MacBook Neo', 'MacBook Air M5'],
          rows: [
            ['Chip', 'A18 Pro (de iPhone)', 'M5, 10 núcleos'],
            ['Tela', '13" Liquid Retina, 500 nits', '13,6" ou 15,3"'],
            ['Memória', 'pouca — o gargalo', '16 GB de série'],
            ['Armazenamento', 'base pequena', '512 GB de série'],
            ['Preço base (EUA)', 'US$599', 'US$1.099'],
            ['Serve para você?', '**Não.** É máquina de navegador e documento.', '**Sim.** Godot, containers, CLI, planilha pesada.'],
          ],
        },
      },
      {
        type: 'p',
        text: '**O M5 compensa muito mais.** O Neo é uma boa máquina para quem usa navegador e Pages; ele não foi feito para compilar projeto de jogo nem rodar ambiente de desenvolvimento. Se o orçamento permitir, considerem subir a RAM para 24 GB — é a única coisa que não dá para mudar depois.',
      },
      {
        type: 'note',
        note: {
          label: 'O problema do teclado',
          tone: 'warn',
          paragraphs: [
            'As Apple Stores japonesas estocam **teclado JIS japonês**. Ele tem teclas a mais perto da barra de espaço, o Enter tem outro formato e vários símbolos estão em posições diferentes. Teclado **US é configuração sob encomenda**, feita só na loja online — e **compra online não entra no reembolso de imposto**, que exige transação em loja credenciada.',
            '**Decidam isso no dia 1º de dezembro**, não no dia 2. Se der problema de estoque, ainda sobra um dia.',
          ],
          bullets: [
            '**Checar Bic Camera e Yodobashi.** As duas às vezes têm MacBook com teclado US (USキーボード) em estoque, coisa que a Apple Store física não costuma ter. Vale ligar ou passar antes. É a melhor combinação: teclado certo + reembolso do imposto.',
            '**Comprar com JIS e remapear.** O layout físico continua japonês, mas o macOS permite trocar o mapeamento. Muita gente se adapta em uma semana. Vocês pagam menos e levam o reembolso.',
            '**Encomendar online na Apple Japan** com entrega no hotel (avisem a recepção com antecedência). Vocês ficam com o teclado que querem, mas **abrem mão dos 10%**.',
          ],
        },
      },
      {
        type: 'p',
        text: '**Alfândega brasileira:** a cota de isenção é de **US$1.000 por pessoa** em viagem aérea, e ela é individual e não somável para um mesmo item. Um MacBook Air sozinho já passa da cota. O que exceder é tributado em **50%**. Vale entrar na conta antes de decidir — mesmo com o imposto, o Japão costuma sair na frente do preço brasileiro, mas a diferença é menor do que parece.',
      },
    ],
  },
  {
    id: 'robo',
    title: '4 · Robô aspirador — não peça pela Amazon',
    checklistItemId: 'robo',
    blocks: [
      {
        type: 'note',
        note: {
          label: 'A questão que decide tudo: voltagem',
          tone: 'warn',
          paragraphs: [
            'O Japão é **100V**. O Brasil é 127V ou 220V. Robôs de marca **japonesa** (Panasonic Rulo, Hitachi, Toshiba) vêm com base de carga **100V pura** — no Brasil, ou queima, ou exige transformador. **Evitem.**',
            'Marcas globais — **Roborock, Dreame, SwitchBot, Ecovacs, Anker Eufy** — costumam usar fonte **100–240V**. **Peçam para ver a etiqueta da base de carga antes de pagar** e procurem `INPUT 100–240V ~ 50/60Hz`. Se estiver escrito só `100V`, não comprem.',
          ],
        },
      },
      {
        type: 'bullets',
        items: [
          'A **Amazon.co.jp não dá tax-free**. Numa compra de ¥150.000, são ¥15.000 jogados fora.',
          'Na loja vocês **veem a etiqueta de voltagem** e conferem se o manual tem inglês.',
          '**Bic Camera** tem andares de *duty free* com **modelos de exportação**: voltagem universal e manual multilíngue de fábrica. É exatamente o que vocês precisam.',
          'As lojas **entregam no hotel de graça** dentro da mesma cidade, ou guardam para retirada num dia combinado.',
        ],
      },
      {
        type: 'p',
        text: '**Se ainda assim quiserem Amazon:** esqueçam o locker — abrir conta japonesa e validar cartão estrangeiro dá mais trabalho do que parece. **Hotel japonês recebe encomenda em nome do hóspede** sem problema; basta avisar a recepção na chegada e usar o nome exato da reserva. Simples, mas sem os 10% de volta.',
      },
      {
        type: 'note',
        note: {
          label: 'Bateria de lítio no voo',
          tone: 'info',
          paragraphs: [
            'Robô aspirador tem bateria grande. A regra internacional: bateria **instalada no aparelho** pode ir na bagagem despachada se for **até 100 Wh**. A maioria dos robôs fica entre 40 e 80 Wh (14,4V × 5.200mAh ≈ 75 Wh), então passa. **Confiram o número na etiqueta.** Acima de 100 Wh precisa de autorização da companhia; acima de 160 Wh é proibido. Bateria sobressalente **nunca** vai despachada.',
          ],
        },
      },
      {
        type: 'p',
        text: '**Onde:** Bic Camera Yūrakuchō (10:00–22:00, ao lado de Ginza), Yodobashi Akiba (09:30–22:00), Yodobashi Umeda em Osaka (09:30–22:00). Preço de topo de linha no Japão: ¥120.000–180.000, bem abaixo do Brasil.',
      },
    ],
  },
  {
    id: 'cama',
    title: '5 · Roupa de cama de algodão orgânico',
    checklistItemId: 'cama',
    blocks: [
      {
        type: 'note',
        note: {
          label: 'Meçam a cama antes de sair do Brasil',
          tone: 'warn',
          paragraphs: [
            'Este é o erro clássico e ele é caro. **As medidas japonesas não batem com as brasileiras.**',
            '**O que comprar sem medo:** fronhas, capas de edredom (se o edredom de vocês couber nas medidas) e **lençóis planos**, que servem em qualquer cama. **O que evitar:** lençol com elástico — a altura e o comprimento japoneses não vão encaixar. Anotem as medidas do colchão de vocês **em centímetros** no celular antes de viajar.',
          ],
        },
      },
      {
        type: 'table',
        table: {
          headers: ['Peça', 'Japão', 'Brasil'],
          rows: [
            ['Colchão casal', 'Double 140 × 195', '138 × 188'],
            ['Colchão queen', 'Queen 160 × 195', '158 × 198'],
            ['Capa de edredom', '190 × 210 · 190 × 230', 'medidas diferentes'],
          ],
        },
      },
      {
        type: 'p',
        text: '**MUJI** é a resposta óbvia e é uma boa resposta: a linha de cama inteira é de algodão orgânico certificado, e a qualidade é bem acima do preço. Procurem a **gaze de camadas duplas** e o **percal lavado** — são as duas texturas que fazem a fama da casa. Capa de edredom double sai por volta de ¥6.000–10.000. **MUJI Ginza, 4º andar.**',
      },
      {
        type: 'bullets',
        items: [
          '**Nishikawa** (Nihonbashi, 10:00–19:00) — fabricante de futon **desde 1566**. Sim, quatrocentos e sessenta anos. Enxoval de alto padrão.',
          '**Toalhas de Imabari** — a cidade de Imabari produz as melhores toalhas do mundo e tem selo próprio de certificação, com teste de absorção obrigatório. Encontram-se em qualquer loja de departamentos e no Tokyo Solamachi. Se sobrar espaço na mala, é a compra que mais surpreende.',
        ],
      },
    ],
  },
  {
    id: 'extras-lista',
    title: '6 · O que acrescentar à lista',
    blocks: [
      {
        type: 'bullets',
        items: [
          '**Faca de cozinha japonesa** — Kappabashi em Tóquio (dia 19) ou **Aritsugu** no Mercado Nishiki, em Kyoto (dia 29) — fundada em **1560**, fazia espadas antes de fazer facas. Gravam seu nome em japonês na lâmina. Vai na mala despachada.',
          '**Singles de Magic em japonês** — Hareruya, BIG MAGIC e Card Kingdom, todas em Akihabara; BIG MAGIC Nipponbashi em Osaka costuma ter preço melhor. Várias artes alternativas só existem em japonês.',
          '**Retrogame e material de referência** — Super Potato e Mandarake, em Akihabara. Cartucho, caixa, manual e guia de sprite art de GBA — literalmente material de pesquisa para o STREETMON.',
          '**Papelaria da Itōya** — Ginza, 12 andares, desde 1904. Papel washi por folha, cadernos, canetas.',
          '**Chá** — matcha de Uji e sencha de boa procedência custam uma fração do preço brasileiro. **Ippodo** (Kyoto, desde 1717) e **Jugetsudo** (Ginza).',
          '**Cerâmica** — tigela de arroz e xícara de chá boas saem por ¥1.500–4.000. Kappabashi, Nishiki, e as feiras de templo (a de Tōji, em Kyoto, acontece dia 21 de cada mês).',
        ],
      },
    ],
  },
];
