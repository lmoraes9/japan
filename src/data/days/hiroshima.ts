import type { Day } from '../types';

export const hiroshimaDays: Day[] = [
  {
    id: 'd2026-11-23',
    date: '2026-11-23',
    stageId: 'hiroshima',
    title: 'Shinkansen para Hiroshima + Parque da Paz',
    subtitle: 'Feriado nacional — reservem o assento. Mandem as malas grandes direto para Kyoto.',
    chips: ['shinkansen', 'história', 'okonomiyaki'],
    notes: [
      {
        label: 'Antes de sair do hotel',
        tone: 'info',
        text: 'Deixem as malas grandes na recepção com etiqueta de **takuhaibin para o hotel de Kyoto** (chegada 27/11). Levem só mochila de dois dias. Vocês vão agradecer nas escadarias de Miyajima e no castelo de Himeji.',
      },
    ],
    stops: [
      {
        id: 'd23-konbini',
        time: '06:30',
        timeLabel: 'konbini',
        kind: 'food',
        name: '7-Eleven da estação — parada 2 de 4',
        facts: 'Dentro da Estação de Tóquio e em toda a área da plataforma · aberto desde cedo',
        paragraphs: [
          'Comida de trem antes do Nozomi. Hoje a missão é **melon bread** e **sanduíche de morango com creme** — o morango japonês entra na estação agora, em novembro, e este é o auge dele.',
          'O ekiben da plataforma continua valendo para o almoço de verdade; o konbini é o café da manhã e a sobremesa. Comprem também garrafa de chá gelado: dentro do Shinkansen tudo custa o dobro.',
        ],
        mapQuery: '7-Eleven Tokyo Station',
      },
      {
        id: 'd23-trem-hiroshima',
        time: '07:00',
        timeLabel: 'trem',
        kind: 'transit',
        name: 'Tóquio → Hiroshima',
        facts: 'Nozomi · **3h50–4h** · ¥19.800 reservado · saída da Estação de Tóquio ou Shinagawa',
        paragraphs: [
          'Comprem um **ekiben** na plataforma antes de embarcar — não é turismo, é o jeito certo de fazer. Do lado direito do trem, entre Odawara e Shizuoka (uns 40 min após a saída), o **Monte Fuji** aparece por cerca de 3 minutos. Em manhã seca de novembro, quase sempre limpo.',
        ],
      },
      {
        id: 'd23-pokemon-center',
        time: '11:05',
        timeLabel: 'pokémon',
        kind: 'shopping',
        name: 'Pokémon Center Hiroshima — na própria estação',
        jp: 'ポケモンセンターヒロシマ',
        facts: '**ekie 2º andar, saída norte da estação** · ~10:00–20:00 · mudou para cá em abril/2025 (não é mais no Sogo)',
        paragraphs: [
          'Vocês desembarcam do Shinkansen e a loja está no mesmo prédio — desçam antes de pegar o bonde. A entrada tem um **Gyarados vermelho shiny em tamanho real** (referência ao lago de Kaminari, para quem jogou Gold/Silver).',
          'A missão: o **Pikachu mascote com momiji manjū** (~¥1.650), exclusivo daqui — e a linha regional com okonomiyaki e limão de Setouchi. 20–30 min resolvem; guardem fome e pernas para o resto do dia.',
        ],
        mapQuery: 'Pokemon Center Hiroshima ekie',
      },
      {
        id: 'd23-chegada',
        time: '11:45',
        timeLabel: 'chegada',
        kind: 'hotel',
        name: 'Hiroshima · check-in e almoço',
        facts: 'Do Shinkansen ao Parque da Paz: **bonde nº 2 ou 6, ~15 min, ¥240**',
        paragraphs: [
          'Sugestão de base: entre a estação e Hondori/Kamiyachō. O bonde de Hiroshima é o maior sistema de bonde do Japão, e alguns vagões são sobreviventes de 1945 ainda em operação.',
        ],
      },
      {
        id: 'd23-museu-paz',
        time: '13:00',
        timeLabel: 'memorial',
        kind: 'sight',
        name: 'Museu Memorial da Paz',
        jp: '広島平和記念資料館',
        facts: '**08:30–18:00** em novembro (última entrada 17:30) · **¥200** · reservem 1h30–2h',
        paragraphs: [
          'Comecem pelo museu e não pelo Domo — a ordem importa. O prédio principal, reformado em 2019, é conduzido por objetos e por histórias individuais, não por números. É pesado, e é feito para ser. Vale pegar o audioguia (¥400).',
        ],
        history: {
          label: 'O que procurar',
          paragraphs: [
            'O triciclo de Shinichi Tanimoto, três anos. O relógio parado às 8h15. As sombras impressas na pedra da escada do banco Sumitomo. E, no fim, a parede com as cartas de protesto que cada prefeito de Hiroshima envia — até hoje, uma por uma — a cada país que realiza um teste nuclear. São mais de seiscentas.',
          ],
        },
        mapQuery: 'Peace Memorial Museum Hiroshima',
      },
      {
        id: 'd23-parque-domo',
        time: '15:30',
        timeLabel: 'memorial',
        kind: 'sight',
        name: 'Parque da Paz, Cenotáfio e Domo',
        jp: '原爆ドーム',
        facts: '**24h · grátis** · Patrimônio Mundial desde 1996',
        history: {
          paragraphs: [
            'O Domo era o **Salão de Promoção Industrial da Prefeitura de Hiroshima**, projetado em 1915 pelo arquiteto tcheco Jan Letzel — um prédio de exposições, com galeria de arte e loja de produtos locais. A bomba detonou quase exatamente acima dele, o que significa que a onda de choque desceu vertical em vez de lateral: as paredes resistiram e a cúpula de aço ficou de pé, esqueleto.',
            'Nos anos 1950 houve debate sério sobre demolir — muitos sobreviventes não suportavam vê-lo. O que virou o jogo foi o diário de **Hiroko Kajiyama**, uma menina que morreu de leucemia em 1960 aos 16 anos e escreveu que aquele domo era a única coisa que ainda gritava o horror ao mundo. A campanha para preservar nasceu do diário dela.',
            'Do Cenotáfio, alinhem o olhar: o arco enquadra a Chama da Paz e, atrás dela, o Domo. O alinhamento é intencional. A chama arde desde 1964 e só será apagada quando não houver mais armas nucleares no mundo.',
          ],
        },
        paragraphs: [
          'Não deixem de ver o **Monumento à Paz das Crianças**, com as vitrines de tsurus de papel. Sadako Sasaki tinha dois anos em 1945 e morreu de leucemia aos 12, tendo dobrado mais de mil grous. Escolas do mundo inteiro ainda mandam tsurus — chegam cerca de 10 milhões por ano.',
        ],
        mapQuery: 'Atomic Bomb Dome Hiroshima',
      },
      {
        id: 'd23-okonomiyaki',
        time: '18:30',
        timeLabel: 'jantar',
        kind: 'food',
        name: 'Okonomiyaki estilo Hiroshima',
        eat: [
          {
            label: 'A comida da cidade',
            items: [
              {
                name: 'Nagataya',
                specialty: true,
                note: '11:00–20:00, fecha qua · ao lado do Parque da Paz, qualidade acima da média turística. ~¥1.300.',
              },
              {
                name: 'Okonomimura',
                specialty: true,
                note: '11:00–23:00 · três andares e 24 bancas numa "vila" de okonomiyaki. Caótico e divertido; escolham a banca com mais gente local.',
              },
              {
                name: 'Hassei',
                specialty: true,
                note: '11:00–20:30, fecha ter · a que os moradores citam. Fila.',
              },
            ],
          },
        ],
        history: {
          label: 'Por que o de Hiroshima é diferente',
          paragraphs: [
            'O de Osaka mistura tudo na massa. O de Hiroshima é **montado em camadas**: uma panqueca finíssima, uma montanha de repolho, broto de feijão, barriga de porco, e — a assinatura — **yakisoba prensado**, tudo coroado por um ovo frito. A técnica nasceu da escassez do pós-guerra, quando havia farinha americana e pouco mais; empilhar repolho era o jeito de fazer render. Peçam com ostra (*kaki*) — é a temporada.',
          ],
        },
        mapQuery: 'Nagataya Okonomiyaki Hiroshima',
      },
    ],
  },
  {
    id: 'd2026-11-24',
    date: '2026-11-24',
    stageId: 'hiroshima',
    title: 'Miyajima o dia inteiro + Shukkei-en na volta',
    subtitle: 'O torii sobre a água, o vale de bordos no pico, e ostras grelhadas na rua.',
    chips: ['história', 'momiji', 'ostras', 'unesco'],
    notes: [
      {
        label: 'Chequem a tabela de marés na véspera',
        tone: 'info',
        text: 'Com **maré alta**, o torii e o santuário parecem flutuar — é a imagem clássica. Com **maré baixa**, dá para caminhar até a base do torii e tocar nele. As duas coisas são ótimas, mas são experiências diferentes; se puderem, planejem chegar perto da maré alta e ficar até a baixa (ou o contrário). O site oficial de Miyajima publica a tabela.',
      },
    ],
    stops: [
      {
        id: 'd24-ferry-miyajima',
        time: '08:00',
        timeLabel: 'trem+ferry',
        kind: 'transit',
        name: 'Hiroshima → Miyajima',
        facts: 'JR Sanyo Line até Miyajimaguchi **27 min ¥420** + **ferry JR 10 min ¥200** + taxa de visitante **¥100**',
        paragraphs: [
          'Peguem o **ferry da JR** (não o da Matsudai): ele faz um desvio proposital para passar perto do torii na ida.',
        ],
      },
      {
        id: 'd24-itsukushima',
        time: '08:45',
        timeLabel: 'santuário',
        kind: 'temple',
        name: 'Santuário Itsukushima',
        jp: '厳島神社',
        facts: '**06:30–18:00** em novembro · ¥300 · Patrimônio Mundial',
        history: {
          paragraphs: [
            'A ilha inteira era considerada divindade. Por isso ninguém podia pisar nela: nem nascer, nem morrer, nem sequer plantar arroz. A solução, quando quiseram construir um santuário, foi genial — **construir sobre a água**, na faixa de maré, para que nenhuma fundação profanasse o solo sagrado. Até hoje não existe cemitério na ilha, e mulheres grávidas e doentes terminais eram historicamente levados ao continente.',
            'O santuário existe desde 593, mas ganhou a forma atual em **1168**, financiado por **Taira no Kiyomori**, o primeiro guerreiro a governar o Japão de fato. Ele fez de Itsukushima o santuário particular do clã Taira — que dezessete anos depois seria exterminado pelos Minamoto na batalha naval de Dan-no-ura.',
            'O grande torii mede 16 m e **não é fixado no fundo**: fica em pé apenas pelo próprio peso, com pedras acumuladas nos pés como lastro. O atual é o oitavo, de 1875, feito de cânfora de 500–600 anos. Passou por restauro completo entre 2019 e 2022.',
          ],
        },
        mapQuery: 'Itsukushima Shrine Miyajima',
      },
      {
        id: 'd24-daishoin',
        time: '10:00',
        timeLabel: 'templo',
        kind: 'temple',
        name: 'Daishō-in',
        jp: '大聖院',
        facts: '**08:00–17:00** · **grátis** · 10 min a pé, subida',
        paragraphs: [
          'O templo mais subestimado de Miyajima e, para muita gente, o melhor. A escadaria tem **cilindros de sutra giratórios** no corrimão — girar todos equivale a ter lido o cânone budista inteiro. No caminho, 500 estátuas de *rakan*, cada uma com rosto diferente, várias de gorro de tricô colocado pelos monges. Tem também uma caverna com 88 lanternas representando a peregrinação de Shikoku.',
        ],
        mapQuery: 'Daisho-in Temple Miyajima',
      },
      {
        id: 'd24-momijidani',
        time: '11:15',
        timeLabel: 'momiji',
        kind: 'sight',
        name: 'Parque Momijidani',
        jp: '紅葉谷公園',
        facts: '**24h · grátis** · **pico: meados a fim de novembro**',
        paragraphs: [
          'Literalmente "o vale dos bordos": cerca de 700 árvores num desfiladeiro estreito com um riacho. Vocês estarão aqui no dia 24 — em ano normal, isso é praticamente o auge. É de onde vem o nome do doce local.',
        ],
        mapQuery: 'Momijidani Park Miyajima',
      },
      {
        id: 'd24-misen',
        time: '12:00',
        timeLabel: 'montanha',
        kind: 'view',
        name: 'Monte Misen · teleférico',
        jp: '弥山',
        facts: 'Teleférico **09:00–17:00** · ¥2.000 ida e volta · + **30 min de caminhada** do topo do teleférico ao cume real',
        paragraphs: [
          'Do cume, 535 m, a vista é do Mar Interior de Seto inteiro salpicado de ilhas. Vale a caminhada final — o ponto onde o teleférico deixa vocês **não é** o cume. No caminho fica o **Kiezu-no-hi**, um fogo que os monges dizem arder ininterruptamente desde que Kūkai o acendeu em 806; foi dele que se acendeu a Chama da Paz de Hiroshima.',
          'Se estiverem cansados, pulem sem culpa e fiquem mais tempo embaixo comendo.',
        ],
        mapQuery: 'Miyajima Ropeway',
      },
      {
        id: 'd24-comer-miyajima',
        time: '14:30',
        timeLabel: 'comer',
        kind: 'food',
        name: 'Comer em Miyajima',
        eat: [
          {
            label: 'Três coisas obrigatórias',
            items: [
              {
                name: 'Anago-meshi — enguia-do-mar sobre arroz',
                specialty: true,
                note: '**Ueno** (em Miyajimaguchi, ao lado da estação) 10:00–19:00, fecha qua · inventaram o prato em 1901 como bentô de trem. **Anagomeshi Wakana** na ilha também é ótimo.',
              },
              {
                name: 'Ostras grelhadas',
                specialty: true,
                note: '**Yakigaki no Hayashi** 10:30–17:00, fecha qua · Hiroshima produz ~60% das ostras do Japão e novembro é o começo da temporada. Duas na casca, na brasa, com limão.',
              },
              {
                name: 'Momiji manjū',
                specialty: true,
                note: 'bolinho em forma de folha de bordo, recheado de feijão doce, criado aqui por volta de 1906. **Yamada-ya** e **Kimura-ya** fazem os melhores; a versão frita (*age-momiji*) da **Momiji-dō** é outro nível.',
              },
            ],
          },
        ],
      },
      {
        id: 'd24-shukkeien',
        time: '16:30',
        timeLabel: 'jardim',
        kind: 'sight',
        name: 'Shukkei-en, de volta a Hiroshima',
        jp: '縮景園',
        facts: '**09:00–18:00** em novembro · ¥260 · 10 min a pé da estação',
        paragraphs: [
          'Jardim de 1620, desenhado como uma "paisagem em miniatura" — o lago imita o Lago Ocidental de Hangzhou, na China. Ficava a 1,3 km do hipocentro e foi arrasado; virou abrigo improvisado para feridos nos dias seguintes, e muita gente morreu ali. **Algumas árvores sobreviveram** e estão marcadas com placa: são *hibakujumoku*, árvores sobreviventes da bomba. Em novembro, o jardim está vermelho.',
        ],
        mapQuery: 'Shukkeien Garden Hiroshima',
      },
      {
        id: 'd24-jantar',
        time: '19:00',
        timeLabel: 'jantar',
        kind: 'food',
        name: 'Jantar',
        eat: [
          {
            label: 'A outra especialidade de Hiroshima',
            items: [
              {
                name: 'Bakudan-ya',
                specialty: true,
                note: '11:00–02:00 · *tsukemen* estilo Hiroshima: macarrão gelado, molho apimentado, repolho e pepino. Você escolhe de 0 a 20 no picante — 2 já arde. Nada a ver com o tsukemen de Tóquio.',
              },
              {
                name: 'Ramen Suzumeya',
                note: '11:30–15:00 · shoyu de Hiroshima, caldo limpo, casa pequena',
              },
            ],
          },
        ],
        paragraphs: [
          '**Castelo de Hiroshima:** reconstruído em concreto em 1958, com um museu de história local dentro. Confiram no site se o torreão está aberto — há um projeto em curso para fechá-lo e reconstruí-lo em madeira, e as datas mudam. Se estiver fechado, o parque e os fossos continuam abertos e valem a caminhada.',
        ],
      },
    ],
  },
];
