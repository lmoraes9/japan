import type { Day } from '../types';

export const tokyo1Days: Day[] = [
  {
    id: 'd2026-11-18',
    date: '2026-11-18',
    stageId: 'tokyo1',
    title: 'Chegada · pouso 17:15 em Haneda',
    subtitle: 'Sem programa. Suica, hotel, uma tigela de ramen e dormir.',
    chips: ['chegada', 'ramen'],
    notes: [
      {
        label: 'Chegando sem roupa',
        tone: 'info',
        text: 'Se precisarem de qualquer coisa ainda hoje (camiseta, meia, escova), o **Don Quijote de Shinjuku é 24h** e tem de tudo. UNIQLO e GU fecham às 21:00 — as compras de roupa de verdade estão programadas para amanhã, no caminho do roteiro.',
      },
    ],
    stops: [
      {
        id: 'd18-haneda',
        time: '17:15',
        timeLabel: 'HND T3',
        kind: 'flight',
        name: 'Haneda, Terminal 3',
        jp: '羽田空港',
        facts: 'Imigração + bagagem: **45 a 70 min** · Haneda fica dentro da cidade, não em Narita',
        paragraphs: [
          'Passem no balcão de eSIM/wi-fi se não ativaram no avião, e confirmem que a Suica do celular está carregada. Se preferirem cartão físico, as máquinas do saguão vendem.',
        ],
        mapQuery: 'Haneda Airport Terminal 3',
      },
      {
        id: 'd18-trem-shinjuku',
        time: '18:30',
        timeLabel: 'trem',
        kind: 'transit',
        name: 'Haneda → Shinjuku',
        facts: '**¥600 · ~45 min** · Keikyu até Shinagawa, JR Yamanote até Shinjuku · alternativa: Airport Limousine Bus, ¥1.400, direto ao hotel',
        paragraphs: [
          'Com mala grande e no fim do dia, o ônibus é mais humano — para na porta dos hotéis grandes e não tem escada.',
        ],
      },
      {
        id: 'd18-ramen',
        time: '20:30',
        timeLabel: 'jantar',
        kind: 'food',
        name: 'Primeira tigela',
        eat: [
          {
            label: 'Ramen perto do hotel',
            items: [
              {
                name: 'Menya Musashi Shinjuku',
                note: '11:00–22:30 · tonkotsu-gyokai, tigela enorme, atendimento gritado',
              },
              {
                name: 'Ichiran Shinjuku',
                note: '24h · cabines individuais, zero interação, perfeito para quem chegou destruído',
              },
              {
                name: 'Fuunji',
                note: '11:00–15:00 / 17:00–21:00, fecha dom · o melhor tsukemen de Shinjuku, mas fila e horário curto — deixem para outro dia',
              },
            ],
          },
        ],
        paragraphs: [
          'Depois: 10 minutos no **Omoide Yokocho**, o beco de yakitori de dois metros de largura ao lado da estação, só para entender onde vocês acabaram de chegar.',
        ],
        mapQuery: 'Omoide Yokocho Shinjuku',
      },
      {
        id: 'd18-konbini',
        time: '22:00',
        timeLabel: 'konbini',
        kind: 'food',
        name: '7-Eleven antes de dormir — parada 1 de 4',
        facts: 'Tem um a cada duas quadras em Shinjuku · **24h** · caixa eletrônico aceita cartão brasileiro',
        paragraphs: [
          'Primeira das quatro paradas de konbini da viagem — a lista completa, com checklist, está em **Mais → Konbini**. Hoje é o trio básico: **onigiri** (atum com maionese), **sanduíche de ovo** e **pudding**.',
          'Levem também água e um café gelado para amanhã cedo. E reparem no balcão quente ao lado do caixa: em novembro já tem **oden** e *nikuman* no vapor — comida de inverno japonesa por ¥150.',
        ],
        mapQuery: '7-Eleven Shinjuku',
      },
    ],
  },
  {
    id: 'd2026-11-19',
    date: '2026-11-19',
    stageId: 'tokyo1',
    title: 'Edo antigo: Asakusa → Kappabashi → Ueno → Akihabara',
    subtitle: 'O jet lag joga a favor. Acordar às 5h30 e chegar no templo mais antigo da cidade vazio.',
    chips: ['história', 'facas', 'ramen', 'museu', 'compras do dia 1'],
    notes: [
      {
        label: 'Compras dos primeiros dias — resolve tudo hoje',
        tone: 'ok',
        text: 'O trajeto de hoje passa exatamente onde se resolve o kit de chegada, cada coisa no seu horário:\n\n**15:30 · Camisetas e tênis** — na parada da Ameyoko: London Sports, Mita Sneakers e ABC-Mart para tênis; UNIQLO Okachimachi / GU a um quarteirão para as camisetas da semana.\n\n**17:45 · Óculos de grau** — parada própria em Akihabara: exame grátis na hora, óculos pronto enquanto vocês fecham as lojas de Magic, retirada antes do jantar. Detalhes lá embaixo e na seção Compras.',
      },
    ],
    stops: [
      {
        id: 'd19-sensoji',
        placeMapId: 'sensoji',
        time: '06:30',
        timeLabel: 'templo',
        kind: 'temple',
        name: 'Sensō-ji',
        jp: '浅草寺',
        facts: 'Pátio **24h** · salão principal **06:00–17:00** · **grátis** · Asakusa Stn',
        paragraphs: [
          'Às 6h30 a rua Nakamise está com as portas de aço fechadas e pintadas — e a pintura é linda. Vocês vão ter o Kaminarimon e o pagode de cinco andares praticamente só para vocês. Às 9h isso aqui é uma multidão.',
        ],
        history: {
          paragraphs: [
            'A lenda diz que em 628 dois irmãos pescadores puxaram do rio Sumida uma estatueta dourada de Kannon presa na rede. Jogaram de volta; ela reapareceu. O chefe da aldeia converteu a própria casa em templo. Em 645 um monge construiu o santuário definitivo — **fazendo do Sensō-ji o templo mais antigo de Tóquio, mais velho que a própria cidade em quase mil anos**.',
            'O complexo foi incinerado na noite de 10 de março de 1945, no bombardeio que matou mais gente numa noite do que qualquer outro ataque aéreo da história. Foi reconstruído em 1958 — em concreto, deliberadamente — com doações de gente comum, e virou símbolo de renascimento. A grande lanterna vermelha do Kaminarimon é doação da Panasonic; olhem embaixo dela, tem um dragão esculpido na madeira.',
          ],
        },
        links: [
          {
            label: 'fotos',
            url: 'https://www.google.com/search?tbm=isch&q=Sensoji+Asakusa+temple',
          },
        ],
        mapQuery: 'Sensoji Temple Asakusa',
      },
      {
        id: 'd19-kuramae',
        time: '08:15',
        timeLabel: 'café',
        kind: 'food',
        name: 'Café da manhã em Kuramae',
        eat: [
          {
            label: 'Duas opções a 10 min a pé',
            items: [
              {
                name: 'Pelican Café',
                note: '09:00–17:00, fecha dom · a padaria Pelican existe desde 1942 e faz só dois produtos: pão de forma e pão doce. O café ao lado torra esse pão na brasa. É simples e é memorável.',
              },
              {
                name: 'Kagetsudō',
                specialty: true,
                note: '09:00–16:00 · o melonpan gigante de Asakusa, ¥250, para comer na hora',
              },
            ],
          },
        ],
        mapQuery: 'Pelican Cafe Kuramae Tokyo',
      },
      {
        id: 'd19-kappabashi',
        time: '09:30',
        timeLabel: 'compras',
        kind: 'shopping',
        name: 'Kappabashi',
        jp: 'かっぱ橋道具街',
        facts: 'Maioria **09:00–17:00** · muitas lojas fecham domingo · 800 m de rua',
        paragraphs: [
          'A rua de utensílios que abastece todo restaurante de Tóquio. É aqui que vocês compram **facas japonesas** — e onde a loja afia e grava o nome de vocês em japonês na lâmina, geralmente de graça.',
          '**Qual comprar:** um *gyuto* de 210 mm resolve 90% da cozinha; um *petty* de 150 mm resolve o resto. Aço carbono corta melhor e enferruja se você deixar molhado — inox (VG-10, SG2) é mais realista para o dia a dia. **Faca vai despachada, nunca na bagagem de mão.**',
        ],
        eat: [
          {
            label: 'As lojas de faca que valem',
            items: [
              {
                name: 'Kama-Asa',
                note: '10:00–17:30 · atendimento em inglês, explicam aço branco vs. azul vs. inox, gravam o nome',
              },
              {
                name: 'Kamata Hakensha',
                note: '10:00–17:45 · mais tradicional, preço melhor, menos inglês',
              },
              {
                name: 'Tsubaya Hōchō',
                note: '10:00–17:45 · a de mais alto padrão das três',
              },
            ],
          },
        ],
        mapQuery: 'Kappabashi Street Tokyo',
      },
      {
        id: 'd19-museu-nacional',
        time: '11:30',
        timeLabel: 'museu',
        kind: 'sight',
        name: 'Museu Nacional de Tóquio',
        jp: '東京国立博物館',
        facts: '**09:30–17:00 · fecha segunda** · ¥1.000 · Ueno Park · reservem 2h30',
        paragraphs: [
          'Se vocês gostam de história, este é **o** lugar da viagem em Tóquio. Comecem pelo Honkan (prédio principal): a galeria 5–6 do segundo andar tem armaduras de samurai e espadas, e a sala de espadas é escura de propósito para vocês verem o *hamon* — a linha ondulada de têmpera na lâmina. No primeiro andar tem cerâmica Jōmon de 10.000 anos atrás e escultura budista dos séculos VII a XIII.',
        ],
        history: {
          paragraphs: [
            'Fundado em 1872, é o museu mais antigo do Japão — criado quatro anos depois da Restauração Meiji, quando o país decidiu que precisava provar ao Ocidente que tinha civilização documentada. Ironicamente foi montado no meio de uma onda de destruição de templos budistas, e boa parte do acervo é literalmente material salvo daquele momento.',
          ],
        },
        links: [{ label: 'site oficial', url: 'https://www.tnm.jp/?lang=en' }],
        mapQuery: 'Tokyo National Museum',
      },
      {
        id: 'd19-almoco-ueno',
        time: '14:15',
        timeLabel: 'almoço',
        kind: 'food',
        name: 'Almoço em Ueno',
        eat: [
          {
            label: 'Escolham uma',
            items: [
              {
                name: 'Innsyōtei',
                note: '11:00–15:00 / 17:00–22:00 · casa de chá de 1875 dentro do parque, hoje serve bentô kaiseki no almoço a partir de ~¥3.000. Reserva ajuda.',
              },
              {
                name: 'Ueno Yabu Soba',
                note: '11:30–20:30, fecha qua · soba de trigo sarraceno, tradição de mais de 100 anos, ¥1.000',
              },
              {
                name: 'Ameyoko',
                note: 'comida de rua: espetinho, kebab, ostra, frutas. Barato e caótico.',
              },
            ],
          },
        ],
        mapQuery: 'Innsyotei Ueno Park',
      },
      {
        id: 'd19-ameyoko',
        time: '15:30',
        timeLabel: 'rua',
        kind: 'sight',
        name: 'Ameya-Yokochō',
        jp: 'アメヤ横丁',
        facts: 'Lojas **10:00–20:00** · grátis · sob os trilhos da Yamanote',
        history: {
          paragraphs: [
            'Nasceu como **mercado negro** nos escombros de 1945, embaixo da linha de trem. O nome tem duas explicações concorrentes e ninguém decidiu qual é a verdadeira: "Ameya" de *ame*, o doce que se vendia quando açúcar era racionado, ou de "América", pelos produtos desviados das bases militares. Continua sendo o lugar mais barulhento e menos japonês de Tóquio.',
          ],
        },
        eat: [
          {
            label: 'Tênis e roupa — o kit de chegada sai daqui',
            items: [
              {
                name: 'London Sports',
                note: 'no meio da Ameyoko · pilhas de tênis de marca com desconto de verdade — o lugar de achado. Tamanho japonês é em cm.',
              },
              {
                name: 'Mita Sneakers',
                note: 'prédio Ameyoko Center · a loja de sneaker mais respeitada de Tóquio, colabs e edições que não existem no Brasil. Vale entrar mesmo só para ver.',
              },
              {
                name: 'ABC-Mart',
                note: 'rede, várias na região · o arroz-com-feijão bem-feito: Onitsuka Tiger, New Balance, Asics por preço justo. Acima de 28,5 cm o estoque encolhe.',
              },
              {
                name: 'UNIQLO Okachimachi / GU',
                note: 'a um quarteirão · camisetas para os primeiros dias (GU a ¥590–990). A compra grande de Muji/Uniqlo continua sendo sábado em Ginza.',
              },
            ],
          },
        ],
        paragraphs: [
          'Se sobrar pernas: a 15 min a pé (ou 1 estação até Nippori), **Yanaka Ginza** é a rua de comércio antiga que sobreviveu — croquete de menchi-katsu na mão, quase nenhum turista, o "shitamachi" de verdade. Fecha cedo (~18h).',
        ],
        mapQuery: 'Ameya Yokocho Ueno',
      },
      {
        id: 'd19-akihabara',
        time: '16:30',
        timeLabel: 'compras',
        kind: 'shopping',
        name: 'Akihabara',
        jp: '秋葉原',
        facts: 'Yodobashi Akiba **09:30–22:00** · Super Potato **11:00–20:00** · Mandarake **12:00–20:00**',
        paragraphs: [
          'Hoje é reconhecimento, não compra — o preço de eletrônico é praticamente igual em toda cidade, e vocês vão querer decidir o robô aspirador com calma. Mas vale entrar no **Yodobashi Akiba** para ver o andar de aspiradores ao vivo e anotar modelos.',
        ],
        eat: [
          {
            label: 'O resto de Akihabara que interessa a vocês',
            items: [
              {
                name: 'Hareruya / BIG MAGIC / Card Kingdom',
                note: 'as três maiores lojas de Magic do Japão ficam num raio de 400 m. Singles em japonês são mais baratos e, em várias cartas, a arte alternativa só existe em japonês.',
              },
              {
                name: 'Super Potato',
                note: '3 andares de retrogame. O andar do GBA/Famicom é literalmente pesquisa de campo para o STREETMON — dá para ver cartucho, caixa, manual e sprite art original.',
              },
              {
                name: 'Mandarake Complex',
                note: '8 andares, cada um um universo. Mais organizado que parece.',
              },
            ],
          },
        ],
        mapQuery: 'Akihabara Electric Town',
      },
      {
        id: 'd19-radio-kaikan',
        time: '17:05',
        timeLabel: 'steins;gate',
        kind: 'sight',
        name: 'Radio Kaikan — o prédio do Steins;Gate',
        jp: 'ラジオ会館',
        facts: '**10:00–20:00** · Sotokanda 1-15-16, na saída Electric Town · 10 andares de lojas de hobby',
        paragraphs: [
          'É aqui que tudo começa: no primeiro episódio de Steins;Gate, a "máquina do tempo" aparece **cravada no topo deste prédio** — e o Radio Kaikan virou o ponto de peregrinação da série. O prédio original era de 1962, o berço da cultura eletrônica/otaku de Akihabara; foi reconstruído e reaberto em 2014, mas continua sendo O marco do bairro. Tirem a foto da fachada olhando para o topo. El Psy Kongroo.',
          'Por dentro são 10 andares de lojas de figure e hobby — **AmiAmi** (preço de loja online para figures novas), Kaiyodo, K-Books, Yellow Submarine (cartas). Vale uma volta rápida de reconhecimento; a missão de figures usadas continua sendo o Mandarake no dia 2/12.',
        ],
        mapQuery: 'Akihabara Radio Kaikan',
      },
      {
        id: 'd19-hanabusa',
        time: '17:25',
        timeLabel: 'santuário',
        kind: 'temple',
        name: 'Hanabusa Inari — o santuário escondido',
        jp: '花房稲荷神社',
        facts: '**Grátis · sempre aberto** · Sotokanda 4-4, atrás do quarteirão do Don Quijote · 10 min bastam',
        paragraphs: [
          'Um santuário Inari completo — torii vermelho, raposas de pedra — **espremido entre prédios, invisível de qualquer rua**. O acesso é por um beco onde só passa uma pessoa de cada vez. Existe desde o período Edo (reconstruído no pós-guerra), e a crença popular era de que curava tosse: os devotos curados deixavam panos vermelhos e brancos de agradecimento.',
          'É a coisa mais escondida que vocês vão ver em Tóquio, no meio do bairro mais barulhento. Entrem, respirem, saiam — o óculos é logo ali.',
        ],
        mapQuery: 'Hanabusa Inari Shrine Akihabara',
      },
      {
        id: 'd19-oculos',
        time: '17:45',
        timeLabel: 'óculos',
        kind: 'shopping',
        name: 'Óculos de grau — exame agora, retirada antes do jantar',
        facts: 'Exame **grátis, ~10 min, sem receita** · armação + lentes desde **¥5.900–8.000** (≈ R$210–290) · pronto em **30–60 min** · tax-free',
        paragraphs: [
          'O "lugar que mede o grau e faz na hora" é isto: as redes **JINS, Zoff e OWNDAYS** fazem exatamente esse serviço, e há loja aqui em Akihabara — a **JINS fica no Atré, colado na saída da estação**, e a **OWNDAYS na Chūō-dōri**. Levem o óculos atual para calibrar.',
          'A jogada: façam o exame **agora**, escolham a armação, e deixem fazendo enquanto vocês terminam Super Potato e as lojas de Magic. Retirem ~18:45 e sigam para o jantar de óculos novo.',
          'Grau muito alto pode pedir lente fina (custo extra) ou uns dias de espera — por isso este stop está no dia 19: sobra viagem inteira para retirar. **Plano B:** as três redes têm lojas em Shinjuku, perto do hotel, abertas até ~21h — o botão Navegar acha a mais próxima de onde estiverem.',
        ],
        mapQuery: 'JINS Atre Akihabara',
      },
      {
        id: 'd19-jantar',
        time: '19:00',
        timeLabel: 'jantar',
        kind: 'food',
        name: 'Jantar',
        eat: [
          {
            label: 'Perto de Akihabara — do tonkatsu lendário ao ramen',
            items: [
              {
                name: 'Tonkatsu Marugo',
                specialty: true,
                note: '17:00–20:00 (última entrada; pode esgotar antes), **fecha seg** · Sotokanda 1-8-14, a 5 min da estação. Top-100 do Tabelog em tonkatsu: fritura lenta em baixa temperatura, corte rosado, ~¥2.000–3.000. Fila de 20–30 min — se o horário do óculos apertar, fica para o plano ramen.',
              },
              {
                name: 'Kikanbō (Kanda)',
                note: '11:00–21:30 · miso *karashibi*: você escolhe o nível de picante (kara) e o de dormência da pimenta sichuan (shibi). Comecem em "futsū/futsū". Um dos ramens mais marcantes de Tóquio. 12 min a pé.',
              },
              {
                name: 'Sushi Zanmai Akihabara',
                note: '24h · rede, mas honesta, e resolve quando tudo mais está fechado',
              },
            ],
          },
        ],
        mapQuery: 'Kikanbo Ramen Kanda',
      },
    ],
  },
  {
    id: 'd2026-11-20',
    lastReturn: [
      { label: 'Enoden Hase → Kamakura', time: '23:07', from: 'Estação Hase', note: 'aprox. · a cada 12 min até ~22h, depois rareia' },
      { label: 'JR Yokosuka Line Kamakura → Tóquio', time: '23:11', from: 'Estação Kamakura', note: 'aprox. · último direto; até 22:30 tem a cada 15 min' },
    ],
    date: '2026-11-20',
    stageId: 'tokyo1',
    title: 'Kamakura — a primeira capital dos samurais',
    subtitle: '1h de Tóquio. Bate-volta em dia de semana, com o momiji de Kamakura no pico exato.',
    chips: ['história', 'bate-volta', 'momiji'],
    notes: [
      {
        label: 'Por que Kamakura está aqui',
        tone: 'ok',
        text: 'Vocês vão ver Nara (capital imperial, século VIII), Kyoto (corte aristocrática, séculos IX–XVI) e Tóquio (poder dos Tokugawa, século XVII em diante). Falta a peça do meio: **Kamakura, onde os guerreiros tomaram o poder do imperador em 1185 e inventaram o xogunato**. É o elo que fecha a linha do tempo. E fica a 1h de trem, com folhagem no auge exatamente nesta semana. **Alternativa:** se preferirem grandiosidade barroca a Zen sóbrio, troquem por **Nikkō** — está descrita na seção de extras.',
      },
    ],
    stops: [
      {
        id: 'd20-trem-kamakura',
        time: '07:30',
        timeLabel: 'trem',
        kind: 'transit',
        name: 'Shinjuku → Kita-Kamakura',
        facts: '**~1h · ¥950** · JR Shōnan-Shinjuku Line direto · desçam **uma estação antes** de Kamakura',
        paragraphs: [
          'A jogada é entrar por Kita-Kamakura, visitar os templos Zen de cima para baixo e chegar a pé na cidade — em vez de fazer o caminho inverso junto com todo mundo.',
        ],
      },
      {
        id: 'd20-engakuji',
        placeMapId: 'kamakura',
        time: '08:45',
        timeLabel: 'templo',
        kind: 'temple',
        name: 'Engaku-ji',
        jp: '円覚寺',
        facts: '**08:00–16:30** · ¥500 · saída da estação Kita-Kamakura',
        paragraphs: [
          'Templo de montanha, escadaria de pedra entre cedros, e um dos poucos lugares onde dá para entender o que "Zen" queria dizer antes de virar palavra de decoração. O sino de bronze de 1301 é Tesouro Nacional.',
        ],
        history: {
          paragraphs: [
            'Fundado em 1282 pelo regente Hōjō Tokimune — e este é o detalhe que muda tudo: ele mandou construir para rezar pelos mortos **dos dois lados** das invasões mongóis de 1274 e 1281, inclusive os invasores. Foi o primeiro grande gesto público desse tipo no Japão.',
          ],
        },
        mapQuery: 'Engakuji Temple Kamakura',
      },
      {
        id: 'd20-kenchoji',
        time: '10:00',
        timeLabel: 'templo',
        kind: 'temple',
        name: 'Kenchō-ji',
        jp: '建長寺',
        facts: '**08:30–16:30** · ¥500 · 15 min a pé de Engaku-ji',
        paragraphs: [
          'O templo Zen nº 1 dos "Cinco Grandes" de Kamakura, fundado em 1253 — o mais antigo mosteiro de treinamento Zen do Japão, e ainda funciona como tal. Os zimbros do pátio foram plantados por volta de 1250, das sementes trazidas da China pelo monge fundador. São as mesmas árvores.',
          'Se tiverem fôlego: a trilha atrás do templo sobe até o santuário Hansōbō e a um mirante com vista para o mar — 25 min de subida, vale.',
        ],
        mapQuery: 'Kenchoji Temple Kamakura',
      },
      {
        id: 'd20-hachimangu',
        time: '11:45',
        timeLabel: 'santuário',
        kind: 'temple',
        name: 'Tsurugaoka Hachimangū',
        jp: '鶴岡八幡宮',
        facts: '**06:00–20:30** · grátis · fim da avenida Wakamiya-ōji',
        history: {
          paragraphs: [
            'O santuário do clã Minamoto e o centro cerimonial do xogunato. A avenida reta que leva até ele foi mandada construir por Minamoto no Yoritomo em 1182 como oferenda pelo parto da esposa — é praticamente a primeira obra de urbanismo planejado do Japão feudal.',
            'Na escadaria de pedra, em 1219, o terceiro xogum Sanetomo foi assassinado pelo próprio sobrinho durante uma cerimônia. Com ele acabou a linhagem Minamoto, e o poder real passou aos regentes Hōjō — que nunca mais devolveram. O ginkgo gigante ao lado da escada, sob o qual o assassino teria se escondido, caiu numa tempestade em 2010; o toco rebrotou e está ali.',
          ],
        },
        mapQuery: 'Tsurugaoka Hachimangu Kamakura',
      },
      {
        id: 'd20-komachi',
        time: '12:30',
        timeLabel: 'almoço',
        kind: 'food',
        name: 'Komachi-dōri',
        eat: [
          {
            label: 'Comer em Kamakura',
            items: [
              {
                name: 'Kamakura Matsubara-an',
                note: '11:30–14:30 / 17:30–20:00 · soba artesanal numa casa antiga com jardim. O melhor almoço da cidade. Reservem.',
              },
              {
                name: 'Shirasu-don',
                note: 'a especialidade local é *shirasu*, sardinha-branquinha bebê, servida crua ou cozida sobre arroz. Várias casas na Komachi-dōri fazem.',
              },
              { name: 'Kamakura Kōhī', note: 'para o café antes de seguir' },
            ],
          },
        ],
        mapQuery: 'Komachi-dori Kamakura',
      },
      {
        id: 'd20-enoden',
        time: '14:00',
        timeLabel: 'trem local',
        kind: 'transit',
        name: 'Enoden até Hase',
        jp: '江ノ電',
        facts: '**¥200 · 5 min** · trenzinho de 1902 que passa entre quintais e depois beira o mar',
      },
      {
        id: 'd20-daibutsu',
        time: '14:20',
        timeLabel: 'templo',
        kind: 'temple',
        name: 'Kōtoku-in — o Grande Buda',
        jp: '鎌倉大仏',
        facts: '**08:00–17:00** · ¥300 (+¥50 para entrar **dentro** da estátua)',
        history: {
          paragraphs: [
            '13,35 m e 121 toneladas de bronze, fundido em 1252. Ele ficou dentro de um salão de madeira por 250 anos — até que um tsunami em 1498 levou o prédio inteiro embora e deixou o Buda sentado ao relento. Ele está assim desde então, e é justamente por isso que a imagem é tão forte: nenhuma arquitetura entre vocês e ele.',
            'Por ¥50 dá para entrar na estátua e ver as marcas de solda das 30 camadas de bronze fundidas separadamente e unidas no lugar. Rudyard Kipling escreveu um poema sobre ele em 1892.',
          ],
        },
        mapQuery: 'Kotokuin Great Buddha Kamakura',
      },
      {
        id: 'd20-hasedera',
        time: '15:15',
        timeLabel: 'templo',
        kind: 'temple',
        name: 'Hase-dera',
        jp: '長谷寺',
        facts: '**08:00–16:30** · ¥400 · 5 min a pé do Grande Buda',
        paragraphs: [
          'Jardim em terraços na encosta, com vista para a baía de Sagami, e uma Kannon de onze cabeças de 9 metros esculpida em um único tronco de cânfora. No fim de novembro o jardim está vermelho. Tem também a caverna Benten, baixa, escavada na rocha, cheia de velas.',
        ],
        mapQuery: 'Hasedera Temple Kamakura',
      },
      {
        id: 'd20-volta',
        time: '17:30',
        timeLabel: 'volta',
        kind: 'transit',
        name: 'Volta para Tóquio',
        facts: 'Kamakura → Shinjuku, **~1h**',
        eat: [
          {
            label: 'Jantar em Shinjuku',
            items: [
              {
                name: 'Fuunji',
                specialty: true,
                note: '17:00–21:00, fecha dom · agora dá: tsukemen (invenção de Tóquio) de caldo grosso de peixe e frango. Fila de 20–40 min. Vale.',
              },
              {
                name: 'Omoide Yokochō',
                note: '17:00–00:00 · yakitori em banquinho, fumaça, cerveja. Os becos de 1946.',
              },
              {
                name: 'Sushi no Midori Shinjuku',
                note: '11:00–22:00 · relação qualidade-preço absurda, fila longa; peguem senha e voltem depois',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'd2026-11-21',
    date: '2026-11-21',
    stageId: 'tokyo1',
    title: 'Tsukiji → Hamarikyū → Ginza (o dia grande de compras)',
    subtitle: 'Sushi de café da manhã, jardim de xogum, e depois Apple, Muji e Uniqlo em quatro quarteirões.',
    chips: ['sushi', 'compras', 'história', 'jardim'],
    stops: [
      {
        id: 'd21-tsukiji',
        time: '07:30',
        timeLabel: 'mercado',
        kind: 'food',
        name: 'Mercado externo de Tsukiji',
        jp: '築地場外市場',
        facts: 'Lojas **05:00–14:00** (maioria abre 08:00) · **fecha domingo e algumas quartas** · grátis',
        paragraphs: [
          'Café da manhã aqui é uma refeição de verdade: *tamagoyaki* quente no palito, ostra grelhada, uni na casca, atum gordo. Vão com fome e comam andando de banca em banca — é o único lugar do Japão onde comer na rua é normal.',
        ],
        history: {
          paragraphs: [
            '"Tsukiji" significa **terra construída**. O bairro é literalmente aterro, feito depois do Grande Incêndio de Meireki de 1657, que queimou dois terços de Edo e matou mais de 100.000 pessoas. O mercado de peixe mudou para cá em 1935, depois que o terremoto de 1923 destruiu o anterior, em Nihonbashi.',
            'Em outubro de 2018 o mercado **interno** — os leilões de atum, as caixas de isopor, os carrinhos *turret* — mudou para Toyosu. O que continua aqui é o mercado **externo**: as 400 lojas de varejo que sempre serviram o público, e que sobreviveram muito bem à mudança.',
          ],
        },
        eat: [
          {
            label: 'O que procurar',
            items: [
              {
                name: 'Marutake',
                specialty: true,
                note: 'tamagoyaki no espeto, ¥150 — o doce, quente, feito na hora',
              },
              {
                name: 'Tsukiji Sushisei',
                note: '07:00–14:00 · se quiserem sentar e fazer um sushi de balcão de manhã',
              },
              {
                name: 'Sushizanmai Honten',
                note: '24h · a matriz. O dono é o que paga milhões pelo primeiro atum do ano no leilão de Ano Novo.',
              },
              {
                name: 'Yamachō / Tsukiji Iwasa',
                note: 'ostras grelhadas e uni',
              },
            ],
          },
        ],
        mapQuery: 'Tsukiji Outer Market',
      },
      {
        id: 'd21-hamarikyu',
        time: '10:00',
        timeLabel: 'jardim',
        kind: 'sight',
        name: 'Jardins Hamarikyū',
        jp: '浜離宮恩賜庭園',
        facts: '**09:00–17:00** (última entrada 16:30) · ¥300 · 10 min a pé de Tsukiji',
        paragraphs: [
          'Um jardim de 25 hectares cercado de arranha-céus, com um lago de água salgada que sobe e desce com a maré da baía — o único do tipo em Tóquio. No pavilhão de chá sobre o lago (**Nakajima-no-ochaya**) vocês tomam matcha com um doce por ¥1.000, sentados sobre a água.',
        ],
        history: {
          paragraphs: [
            'Começou em 1654 como campo de caça de falcões de um irmão do xogum. Virou jardim de recepção dos Tokugawa, e depois de 1868 passou a ser palácio de veraneio imperial — foi aqui que o Japão Meiji recebeu Ulysses S. Grant em 1879, no primeiro banquete de estado a um ex-presidente americano.',
            'Procurem o **pinheiro de trezentos anos** perto da entrada, plantado por volta de 1709, e o campo de peônias. Em novembro o bordo e o ginkgo estão no auge, e o contraste com as torres de Shiodome atrás é a fotografia mais "Tóquio" que existe.',
          ],
        },
        mapQuery: 'Hamarikyu Gardens Tokyo',
      },
      {
        id: 'd21-almoco-ginza',
        time: '11:45',
        timeLabel: 'almoço',
        kind: 'food',
        name: 'Almoço em Ginza',
        eat: [
          {
            label: 'De acessível a especial',
            items: [
              {
                name: 'Ginza Kagari',
                note: '11:00–21:30 · *tori-paitan* soba: caldo de frango batido até virar creme. Um dos ramens mais famosos do Japão. Fila de 30–60 min, ~¥1.200.',
              },
              {
                name: 'Ginza Satō Yōsuke',
                note: '11:00–21:00 · udon *inaniwa* de Akita, finíssimo, estirado à mão. Calmo, elegante, ~¥1.800.',
              },
              {
                name: 'Kyūbey',
                specialty: true,
                note: '11:30–14:00 / 17:00–22:00, fecha dom · sushi de balcão clássico desde 1935 — o nigiri Edomae nasceu em Tóquio. Almoço a partir de ~¥8.000, jantar bem mais. Reserva obrigatória.',
              },
            ],
          },
        ],
        mapQuery: 'Ginza Kagari ramen',
      },
      {
        id: 'd21-ginza',
        time: '13:00',
        timeLabel: 'compras',
        kind: 'shopping',
        name: 'Ginza — o quadrilátero das compras',
        jp: '銀座',
        facts: 'Quase tudo **11:00–21:00** · sábado das 12:00 às 18:00 a avenida Chūō vira **calçadão**',
        paragraphs: [
          'Tudo que está na lista de vocês, exceto o robô aspirador, cabe num raio de 500 metros. A ordem sugerida abaixo é por quanto tempo cada coisa toma.',
        ],
        eat: [
          {
            label: 'Roteiro de loja em loja',
            items: [
              {
                name: 'MUJI Ginza — Namiki-dōri, B1 ao 6º andar',
                note: '11:00–21:00 · a loja-mãe. Camisetas de algodão orgânico no 2º; **roupa de cama de algodão orgânico** no 4º; MUJI Diner no B1. Leiam o alerta de medidas de cama na seção de compras antes de escolher lençol.',
              },
              {
                name: 'UNIQLO Ginza — 12 andares',
                note: '11:00–21:00 · a maior do mundo. Procurem as linhas **Supima Cotton** e **Uniqlo U**; o algodão é bem melhor que o básico. Barra grátis.',
              },
              {
                name: 'Apple Ginza',
                note: '10:00–21:00 · a primeira Apple Store fora dos EUA (2003). Confiram estoque de teclado antes de decidir — veja a seção de compras.',
              },
              {
                name: 'Itōya — 12 andares de papelaria',
                note: '10:00–20:00 · desde 1904. Papel washi, canetas, cadernos. Perigoso.',
              },
              {
                name: 'Ginza Six / Mitsukoshi',
                note: 'o *depachika* (subsolo de comida) do Mitsukoshi é um museu gratuito de comida japonesa. Vão nem que seja só olhar.',
              },
            ],
          },
        ],
        history: {
          paragraphs: [
            'Ginza quer dizer literalmente "casa da prata": aqui ficava a casa da moeda de prata dos Tokugawa, transferida para cá em 1612. Depois de um incêndio arrasar o bairro em 1872, o governo Meiji contratou o arquiteto inglês Thomas Waters para reconstruir tudo **em tijolo**, à moda de Londres — foi a primeira rua "ocidental" do Japão, com calçada, poste de gás e árvore plantada.',
            'Os japoneses acharam os prédios de tijolo úmidos e detestaram morar neles, mas adoraram passear ali. Nasceu o verbo *ginbura*, "vaguear por Ginza", que existe até hoje.',
          ],
        },
        mapQuery: 'Ginza Tokyo',
      },
      {
        id: 'd21-kitte',
        time: '17:00',
        timeLabel: 'vista',
        kind: 'view',
        name: 'Estação de Tóquio + terraço do KITTE',
        jp: '東京駅',
        facts: 'Terraço do KITTE **11:00–23:00** · **grátis** · pôr do sol ~16:30',
        paragraphs: [
          'A fachada de tijolo de 1914 do lado Marunouchi foi restaurada em 2012 de volta às três cúpulas originais (perdidas no bombardeio de 1945). O melhor lugar para vê-la de graça é o terraço do KITTE, do outro lado da praça — vale mais que qualquer observatório pago da cidade nesse horário.',
        ],
        mapQuery: 'KITTE Marunouchi rooftop garden',
      },
      {
        id: 'd21-jantar-estacao',
        time: '18:30',
        timeLabel: 'jantar',
        kind: 'food',
        name: 'Jantar na estação',
        eat: [
          {
            label: 'Duas ideias, ambas no subsolo/andares da estação',
            items: [
              {
                name: 'Tokyo Ramen Street — B1',
                specialty: true,
                note: '11:00–23:00 · oito casas selecionadas. **Rokurinsha** é o tsukemen mais famoso do Japão (fila de 40 min); **Soranoiro** faz uma versão vegetal excelente.',
              },
              {
                name: 'Nemuro Hanamaru — KITTE 5º andar',
                note: '11:00–22:00 · kaiten-zushi de Hokkaidō. Peixe muito acima da média para um esteira, ¥150–500 o par. Peguem senha na entrada.',
              },
            ],
          },
        ],
        mapQuery: 'Tokyo Ramen Street Tokyo Station',
      },
    ],
  },
  {
    id: 'd2026-11-22',
    date: '2026-11-22',
    stageId: 'tokyo1',
    title: 'Meiji Jingū → Gaien dourado → Shibuya no pôr do sol',
    subtitle: 'Domingo é o melhor dia para o santuário. E os ginkgos da avenida Gaien estarão no ouro exato.',
    chips: ['história', 'momiji', 'compras', 'ramen'],
    stops: [
      {
        id: 'd22-meiji-jingu',
        placeMapId: 'meiji-jingu',
        time: '08:00',
        timeLabel: 'santuário',
        kind: 'temple',
        name: 'Meiji Jingū',
        jp: '明治神宮',
        facts: 'Do nascer ao pôr do sol (**~06:30–16:20** em novembro) · **grátis** · Harajuku Stn',
        paragraphs: [
          'Entrem pelo portal sul e caminhem os 700 m de saibro sob os torii de cipreste. Aos domingos de manhã é comum ver **casamento xintoísta** atravessando o pátio — procissão com guarda-chuva vermelho, noiva de *shiromuku* branco. Não é encenação turística, é casamento mesmo.',
        ],
        history: {
          paragraphs: [
            'Aqui é o lugar mais enganador de Tóquio: **essa floresta é artificial e tem só cem anos**. Quando o Imperador Meiji morreu em 1912, decidiu-se erguer um santuário num terreno que era um campo de treinamento militar quase pelado. Entre 1915 e 1920, **100.000 árvores de 365 espécies** foram doadas por pessoas de todo o Japão e das colônias, e plantadas por 110.000 voluntários.',
            'O botânico Honda Seiroku desenhou o plantio como um sistema que se autossucede: espécies de crescimento rápido primeiro, sombreando as lentas, que em 150 anos assumiriam sozinhas. O plano era não precisar de jardineiro nenhum a partir de 2070. Está funcionando — a floresta hoje se regenera sozinha e abriga espécies que ninguém plantou.',
            'Os prédios foram queimados em 1945 e reconstruídos em 1958 com doação pública. A floresta sobreviveu.',
          ],
        },
        mapQuery: 'Meiji Jingu Shrine Tokyo',
      },
      {
        id: 'd22-omotesando',
        time: '10:00',
        timeLabel: 'compras',
        kind: 'shopping',
        name: 'Omotesandō & Harajuku',
        facts: 'Lojas **11:00–20:00** · Takeshita-dōri fica insuportável depois das 12:00 no domingo',
        paragraphs: [
          'A Omotesandō foi projetada como a alameda de acesso ao Meiji Jingū e virou o corredor de arquitetura contemporânea de Tóquio — Prada de Herzog & de Meuron, Dior de SANAA, Tod\'s de Toyo Ito, tudo num quilômetro. Vale andar só olhando para cima.',
        ],
        eat: [
          {
            label: 'Compras aqui',
            items: [
              {
                name: 'UNIQLO Harajuku',
                note: '11:00–21:00 · tem o **UTme!**, onde vocês estampam a própria arte numa camiseta em 30 min. Sim, dá para imprimir sprite do STREETMON.',
              },
              {
                name: 'Kiddy Land',
                note: '11:00–21:00 · 5 andares de personagem japonês',
              },
              {
                name: 'Oriental Bazaar',
                note: '10:00–19:00, fecha qui · souvenir de qualidade: cerâmica, yukata, gravura',
              },
            ],
          },
        ],
        mapQuery: 'Omotesando Tokyo',
      },
      {
        id: 'd22-almoco',
        time: '13:00',
        timeLabel: 'almoço',
        kind: 'food',
        name: 'Almoço',
        eat: [
          {
            label: 'Perto de Omotesandō',
            items: [
              {
                name: 'Afuri Harajuku',
                note: '11:00–23:00 · ramen de *yuzu shio* — caldo limpo e cítrico, o oposto do tonkotsu. Leve e ótimo no meio do dia.',
              },
              {
                name: 'Maisen Aoyama',
                note: '11:00–22:00 · tonkatsu numa antiga casa de banho pública convertida. Institucional, no bom sentido.',
              },
              {
                name: 'Harajuku Gyōza Rō',
                note: '11:30–22:30 · gyoza e cerveja, ¥350 o prato, fila rápida',
              },
            ],
          },
        ],
        mapQuery: 'Afuri Harajuku',
      },
      {
        id: 'd22-gaien',
        time: '14:30',
        timeLabel: 'momiji',
        kind: 'sight',
        name: 'Alameda de ginkgos de Meiji Jingū Gaien',
        jp: '神宮外苑いちょう並木',
        facts: '**24h · grátis** · Aoyama-itchōme Stn · **pico: fim de novembro**',
        paragraphs: [
          '146 ginkgos em quatro fileiras, plantados em 1923, podados há um século no formato de cone para que a perspectiva pareça mais longa do que é. No fim de novembro a rua inteira fica dourada e o chão vira um tapete amarelo.',
          'É o cartão-postal de outono de Tóquio, e vocês estão exatamente na semana certa.',
        ],
        eat: [
          {
            label: 'Icho Matsuri — o festival do ginkgo',
            items: [
              {
                name: 'Barracas do festival',
                specialty: true,
                note: 'de meados de nov a início de dez, a alameda ganha um festival de comida de rua: yakisoba, jaga-batā (batata na manteiga), karaage, frango grelhado, amazake quente. É feira japonesa de verdade, no meio do cartão-postal — almocem leve e comam aqui. Confirmem as datas de 2026 na chegada.',
              },
            ],
          },
        ],
        mapQuery: 'Meiji Jingu Gaien Ginkgo Avenue',
      },
      {
        id: 'd22-shibuya-sky',
        time: '16:00',
        timeLabel: 'vista',
        kind: 'view',
        name: 'Shibuya Sky',
        jp: '渋谷スカイ',
        facts: '**10:00–22:30** (última entrada 21:20) · ¥2.500 · **reservem online com antecedência** · pôr do sol ~16:28',
        paragraphs: [
          'Rooftop aberto no 46º andar, sem vidro. Reservem a faixa das **15:30–16:00** para pegar o dia, o pôr do sol e a cidade acendendo — é a mesma entrada. Com tempo seco de novembro, o Fuji aparece no horizonte oeste com frequência.',
        ],
        links: [
          { label: 'reservas', url: 'https://www.shibuya-scramble-square.com/sky/' },
        ],
        mapQuery: 'Shibuya Sky',
      },
      {
        id: 'd22-cruzamento',
        time: '17:30',
        timeLabel: 'rua',
        kind: 'sight',
        name: 'Cruzamento de Shibuya + Hachikō',
        facts: '**24h · grátis**',
        history: {
          paragraphs: [
            'A estátua do cachorro na saída da estação é de 1934 — e Hachikō estava presente na inauguração da própria estátua. Ele esperou o dono, um professor da Universidade de Tóquio morto de hemorragia cerebral em 1925, na mesma saída, todo dia, por nove anos e nove meses, até morrer em 1935. A estátua original foi derretida para munição em 1944; a atual é de 1948, feita pelo filho do escultor original.',
          ],
        },
        mapQuery: 'Shibuya Crossing Hachiko',
      },
      {
        id: 'd22-jantar',
        time: '19:00',
        timeLabel: 'jantar',
        kind: 'food',
        name: 'Jantar em Shibuya ou Shinjuku',
        eat: [
          {
            label: 'Escolham',
            items: [
              {
                name: 'Sushi no Midori Umegaoka (Shibuya Mark City)',
                specialty: true,
                note: '11:00–21:00 · o melhor custo-benefício de sushi de balcão de Tóquio. Peguem senha eletrônica e voltem depois — a espera pode passar de 1h.',
              },
              {
                name: 'Uobei Shibuya',
                note: '11:00–23:00 · sushi que chega em trenzinho de esteira alta, ¥130 o par. Divertido e rápido.',
              },
              {
                name: 'Golden Gai (Shinjuku)',
                note: 'a partir das 20:00 · 200 bares de 5 lugares em seis vielas. Alguns cobram couvert de ¥500–1.000 e alguns não aceitam estrangeiro — respeitem a placa. Sobreviveu porque os donos se recusaram a vender nos anos 1980.',
              },
            ],
          },
        ],
        mapQuery: 'Shibuya Mark City',
      },
    ],
  },
];
