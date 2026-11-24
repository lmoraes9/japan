import type { Day } from '../types';

export const osakaDays: Day[] = [
  {
    id: 'd2026-11-25',
    lastReturn: [
      { label: 'Shinkansen Himeji → Shin-Osaka', time: '23:05', from: 'Estação Himeji', note: 'aprox. · Kodama/Sakura; JR Special Rapid comum até ~23h também' },
    ],
    date: '2026-11-25',
    stageId: 'osaka',
    title: 'Kurashiki + Castelo de Himeji, a caminho de Osaka',
    subtitle: 'Saindo cedo: o canal vazio, o melhor castelo do Japão com o jardim no auge, e a noite na Osaka retrô.',
    chips: ['história', 'unesco', 'castelo', 'jardim', 'kushikatsu'],
    notes: [
      {
        label: '🎒 A mochila: 2 lockers, 4 momentos',
        tone: 'warn',
        text: '**1. GUARDAR (~09:25, Kurashiki):** desceram do trem em Kurashiki → subam ao 2º andar, saiam pela catraca e, **antes de descer para a rua**, vão ao corredor do lado da **saída norte**, ao lado da padaria Little Mermaid: locker **grande (大型)**. Só depois saiam pela **saída sul (南口)** para o canal.\n\n**2. BUSCAR (11:00, Kurashiki):** saiam da Ivy Square às 11:00, voltem à estação e **peguem a mochila no mesmo locker** antes de passar a catraca para o trem das ~11:15.\n\n**3. GUARDAR (~12:15, Himeji):** desceram do Shinkansen em Himeji → saiam pela **catraca central (中央改札)** e sigam para o **北口 (saída norte)**: os lockers ficam ali. Guardem **antes do almoço**.\n\n**4. BUSCAR (~15:45, Himeji):** saindo do Kōko-en, voltem a pé até o **北口** e **peguem a mochila** antes de entrar para o trem das ~16:00 para Osaka. Ela vai com vocês até o hotel.\n\nFotografem o número do locker e o recibo. Locker grande ~¥500–800: Suica na maioria, mas levem moedas de ¥100.',
      },
      {
        label: 'Plano novo: sem museu · saíram no Nozomi das 8:22',
        tone: 'ok',
        text: 'Os horários foram empurrados ~1h porque o trem foi o das 8:22. Se o tempo apertar, cortem primeiro o santuário Achi; o Kōko-en vale manter (bordos no auge, última entrada 16:30). Saiu o Museu Ōhara (e não tem passeio de barco). Em Kurashiki fica só o que é ao ar livre: o canal vazio, o mirante do santuário Achi, a fiação de tijolo e a rua do jeans. O almoço passou para Himeji, entrou o jardim Kōko-en e a chegada a Osaka adiantou quase 2 horas, o que abre espaço para Shinsekai. Se cansarem, pulem Shinsekai e jantem direto em Dōtonbori.',
      },
    ],
    stops: [
      {
        id: 'd25-trem-kurashiki',
        time: '08:22',
        timeLabel: 'trem',
        kind: 'transit',
        name: 'Hiroshima → Okayama → Kurashiki',
        facts: '**Nozomi 6, 08:22, plataforma 14**, carros 1–3 (assento livre) · ~¥5.500 por pessoa até Okayama + JR local **17 min** (¥330, Suica) · chegada ~09:25 · 🎒 **AO DESCER EM KURASHIKI: GUARDAR A MOCHILA** no locker grande, corredor da saída norte, 2º andar, ao lado da padaria Little Mermaid. Só depois saiam pelo 南口',
        mapQuery: '広島駅 新幹線改札',
      },
      {
        id: 'd25-bikan',
        placeMapId: 'kurashiki',
        time: '09:35',
        timeLabel: 'canal',
        kind: 'sight',
        name: 'Bairro histórico Bikan',
        jp: '倉敷美観地区',
        facts: '**24h · grátis** · 12 min a pé da estação',
        paragraphs: [
          'Um canal com salgueiros, ladeado de armazéns de parede branca e telha preta em xadrez. Parece cenário e não é: é a coisa real, preservada porque a cidade escapou dos bombardeios.',
          'Andem a margem inteira até a ponte de pedra **Nakabashi** e voltem pela rua de trás, a Honmachi.',
        ],
        history: {
          paragraphs: [
            '*Kura-shiki* significa "onde ficam os armazéns". No período Edo, Kurashiki era **território direto do xogunato** (*tenryō*), não de um daimyō — o que dava aos mercadores daqui uma autonomia rara. Os canais existiam para levar arroz e algodão do interior até o Mar Interior, e cada armazém branco desses guardava a riqueza de alguém.',
            'Quando o Japão industrializou, o algodão daqui virou a fiação Kurabō (1888) — e mais tarde, na cidade vizinha de Kojima, nasceu **o primeiro jeans fabricado no Japão**, em 1965. A região é hoje a capital mundial do denim artesanal.',
          ],
        },
        mapQuery: 'Kurashiki Bikan Historical Quarter',
      },
      {
        id: 'd25-achi',
        time: '10:00',
        timeLabel: 'vista',
        kind: 'sight',
        name: 'Santuário Achi, no morro (opcional)',
        jp: '阿智神社',
        facts: '**grátis · sempre aberto** · 5 min de escada a partir do canal · 20 min bastam · **se o tempo apertar, é o primeiro a cortar**',
        paragraphs: [
          'O santuário fica no alto do **morro Tsurugata**, bem atrás do bairro. A escadaria de pedra sobe em 5 minutos e lá de cima se veem **os telhados pretos de Kurashiki** todos juntos, que de baixo não dá para perceber.',
          'É o santuário protetor da cidade desde antes dos armazéns, quando o morro ainda era uma ilha no mar raso. Tem uma glicínia velhíssima, a *Achi no fuji*, que só floresce em maio, mas o mirante vale em qualquer mês.',
        ],
        mapQuery: '阿智神社 倉敷',
      },
      {
        id: 'd25-ivy',
        time: '10:25',
        timeLabel: 'passeio',
        kind: 'sight',
        name: 'Ivy Square e a Denim Street',
        jp: 'アイビースクエア・倉敷デニムストリート',
        facts: 'Ivy Square: **pátio grátis**, sempre aberto · Denim Street: lojas **~10:00–17:00** · 5 min a pé do canal, na ponta sul',
        paragraphs: [
          'A **Ivy Square** é a antiga fiação de algodão Kurabō, de **1889**, em tijolo vermelho e coberta de hera. Fechou em 1973 e virou hotel e ateliês; o pátio interno é aberto e é o lugar mais bonito do bairro depois do canal.',
          'A **Kurashiki Denim Street (倉敷デニムストリート)**, na beira do canal, é a vitrine da região que é **a capital do jeans japonês**: lojas de denim artesanal de Kojima, chaveiros e bolsas de jeans e o **sorvete azul "de jeans"** (デニムソフト), que tem gosto de baunilha com soda. O **Kurashiki Coffee-kan (倉敷珈琲館)**, café coado num armazém na beira do canal, fica pertinho.',
          '🎒 **ÀS 11:00: BUSCAR A MOCHILA.** Voltem para a estação pela rua coberta Ebisu-dōri (12 min), peguem a mochila no mesmo locker da saída norte e só então passem a catraca para o trem das ~11:15.',
        ],
        mapQuery: '倉敷デニムストリート',
      },
      {
        id: 'd25-trem-himeji',
        time: '11:15',
        timeLabel: 'trem',
        kind: 'transit',
        name: 'Kurashiki → Okayama → Himeji',
        facts: 'Local **17 min** + Shinkansen **20 min** · ~¥3.900 · chegada ~12:15 · 🎒 **AO DESCER EM HIMEJI: GUARDAR A MOCHILA** no locker do 北口 (saída norte), antes do almoço',
        mapQuery: '倉敷駅',
      },
      {
        id: 'd25-almoco-himeji',
        time: '12:20',
        timeLabel: 'almoço',
        kind: 'food',
        name: 'Almoço em Himeji, perto da estação',
        facts: 'com o atraso, **o ekisoba da estação (15 min) é o plano**; o oden só se sobrar tempo · na saída norte (北口) e nas galerias Miyuki-dōri e Ōtemae',
        eat: [
          {
            label: 'O que é de Himeji',
            items: [
              {
                name: 'Himeji oden (姫路おでん)',
                specialty: true,
                note: 'o ensopado de nabo, ovo, konnyaku e bolinho de peixe, mas servido com **molho de shoyu e gengibre ralado** por cima. É a marca da cidade. Procurem a placa **姫路おでん** nos izakayas e restaurantes das galerias e no shopping **piole** da estação.',
              },
              {
                name: 'Ekisoba Maneki (まねきのえきそば)',
                specialty: true,
                note: 'o plano rápido: **macarrão chinês amarelo num caldo de dashi japonês**, invenção de Himeji de 1949. As bancas ficam dentro da estação e nas plataformas; ~¥500, de pé, em 5 minutos.',
              },
            ],
          },
        ],
        mapQuery: '姫路駅 北口',
      },
      {
        id: 'd25-himeji',
        placeMapId: 'himeji',
        time: '13:00',
        timeLabel: 'castelo',
        kind: 'sight',
        name: 'Castelo de Himeji',
        jp: '姫路城',
        facts: '**09:00–17:00 · última entrada 16:00** · **¥2.500** para estrangeiros desde março de 2026 (¥2.600 com o jardim Kōko-en) · 15 min a pé em linha reta da estação · reservem **2h**',
        paragraphs: [
          'Vocês vão ver a avenida da estação e o castelo lá no fundo, exatamente no eixo. A subida até o torreão tem escadas de madeira muito íngremes e vocês vão descalçar o sapato — meias de novo.',
          'Comprem o bilhete **combinado com o Kōko-en (¥2.600)** no guichê: o jardim é a parada seguinte.',
        ],
        history: {
          paragraphs: [
            'Começou como um forte em 1333 e virou castelo em 1346, mas a forma que vocês vão ver é de **1601–1609**, obra de Ikeda Terumasa, genro de Tokugawa Ieyasu, recompensado com este domínio depois da batalha de Sekigahara. São **83 edifícios**, quase todos de madeira, e um sistema de defesa em espiral: os caminhos entre os portões viram, sobem, voltam e se estreitam de propósito, para desorientar quem invade e expor o invasor a fogo cruzado por muito mais tempo.',
            'O apelido é **Shirasagi-jō**, "castelo da garça branca" — pelo reboco branco de cal, aplicado inclusive nas telhas, que além de bonito era à prova de fogo.',
            'E aqui está o fato que faz de Himeji o que ela é: **nunca foi destruída**. Não caiu em guerra, não caiu no terremoto de Kobe de 1995 (que fica a 40 km), e não caiu nos bombardeios de 1945 — ainda que a cidade ao redor tenha sido arrasada e uma bomba incendiária tenha atingido o torreão **sem explodir**. É o castelo japonês mais completo e mais original que existe. Patrimônio Mundial desde 1993, um dos dois primeiros do Japão.',
          ],
        },
        links: [
          {
            label: 'fotos',
            url: 'https://www.google.com/search?tbm=isch&q=Himeji+Castle+autumn',
          },
        ],
        mapQuery: 'Himeji Castle',
      },
      {
        id: 'd25-kokoen',
        time: '15:00',
        timeLabel: 'jardim',
        kind: 'sight',
        name: 'Jardim Kōko-en',
        jp: '好古園',
        facts: '**09:00–17:00** · ¥400 sozinho, ou incluído no combinado de ¥2.600 com o castelo · colado no fosso oeste do castelo · 40 min',
        paragraphs: [
          'São **nove jardins murados**, reconstruídos sobre as fundações das antigas residências dos samurais do castelo. Em fim de novembro os **bordos estão no auge**, e de vários pontos se vê o torreão branco por cima dos muros.',
          'Tem uma **casa de chá (Sōjuan)** com matcha e doce por uns ¥500, e um restaurante, o Kassui-ken, com vista para o lago das carpas.',
          '🎒 **ÀS ~15:45: BUSCAR A MOCHILA.** Saindo do jardim, voltem pela avenida Ōtemae até o **北口** da estação (15–20 min), peguem a mochila no locker e só então entrem para o trem das ~16:00.',
        ],
        mapQuery: '好古園 姫路',
      },
      {
        id: 'd25-trem-osaka',
        time: '16:00',
        timeLabel: 'trem',
        kind: 'transit',
        name: 'Himeji → Osaka → hotel',
        facts: 'JR Special Rapid **60 min ¥1.520** (sem taxa de shinkansen) + metrô até Nippombashi · **check-in no KOKO HOTEL ~17:15** · 🎒 **a mochila tem de estar com vocês** (pegaram no locker de Himeji?)',
        mapQuery: '姫路駅 中央改札',
      },
      {
        id: 'd25-shinsekai',
        time: '18:00',
        timeLabel: 'jantar',
        kind: 'food',
        name: 'Shinsekai, a Osaka retrô',
        jp: '新世界・通天閣',
        facts: '**grátis para andar** · do hotel, metrô Sakaisuji **1 parada** até Ebisuchō (恵美須町), saída 3 · ou 20 min a pé',
        paragraphs: [
          'O bairro "Novo Mundo" parou no tempo nos anos 1950–60: letreiros gigantes de baiacu e de mão segurando espetinho, fliperamas antigos, jogos de shōgi na calçada e a torre **Tsūtenkaku** no meio.',
          '**Para o izakaya do seu amigo:** é aqui que se acham as **placas de lata, posters e cartazes estilo Shōwa** (昭和レトロ), de cerveja, refrigerante e comida. Andem pelas lojinhas de lembrança da rua **Jan-Jan Yokochō (ジャンジャン横丁)** e das ruas em volta da torre; perguntem por **昭和レトロ ポスター** ou **ブリキ看板 (placa de lata)**.',
        ],
        eat: [
          {
            label: 'Jantar',
            items: [
              {
                name: 'Kushikatsu Daruma — a loja original (串かつだるま 新世界総本店)',
                specialty: true,
                note: '11:00–22:30 · a primeira casa da rede, de **1929**, balcão pequeno. Espetinho empanado de carne, camarão, cebola, queijo. **Regra sagrada: não molhar duas vezes no molho comunitário** — a placa está em toda parede. Se a fila estiver grande, há outras dez casas de kushikatsu na mesma rua.',
              },
            ],
          },
        ],
        mapQuery: '串かつだるま 新世界総本店',
      },
      {
        id: 'd25-dotonbori',
        time: '20:00',
        timeLabel: 'jantar',
        kind: 'food',
        name: 'Dōtonbori e o letreiro da Glico',
        jp: '道頓堀・グリコサイン',
        facts: '**24h · grátis** · Namba Stn · o letreiro fica de frente para a **ponte Ebisu-bashi**, e acende do pôr do sol até a meia-noite',
        paragraphs: [
          'Comecem pela ponte, não pela comida. O **Ebisu-bashi** é o ponto de onde todo mundo fotografa o homem correndo da Glico — e é de praxe fazer a pose dele, os dois braços para cima. A ponte fica lotada e ninguém se importa: é o cartão-postal de Osaka desde antes dos seus avós.',
          'Depois disso, jantem andando. A regra de Dōtonbori é o *kuidaore* — 食い倒れ, "comer até falir" —, que é como os próprios habitantes de Osaka descrevem a cidade deles. Comam pouco em três lugares em vez de sentar num só.',
        ],
        eat: [
          {
            label: 'Comam de pé, em três lugares diferentes',
            items: [
              {
                name: 'Takoyaki Wanaka (Sennichimae)',
                specialty: true,
                note: '10:00–23:00 · bolinho de polvo, na loja ao lado do Namba Grand Kagetsu (o Hanadako, que também é famoso, fica em Umeda, não aqui). Deixem esfriar 30 segundos ou vocês queimam o céu da boca — todo mundo queima.',
              },
              {
                name: 'Okonomiyaki Mizuno',
                specialty: true,
                note: '11:00–22:00, fecha qui · Bib Gourmand do Michelin. Versão de Osaka, tudo misturado na massa. Fila.',
              },
              {
                name: 'Hōzenji Yokochō',
                note: 'viela de pedra a um quarteirão do neon, com um Buda coberto de musgo que os fiéis molham desde 1945. Silêncio total, a 40 m do caos.',
              },
            ],
          },
        ],
        history: {
          paragraphs: [
            'O canal foi escavado por conta própria por um mercador chamado Yasui Dōton, a partir de 1612, para ligar dois rios e valorizar as terras. Ele morreu em 1615 lutando no cerco de Osaka, antes de ver a obra pronta — os primos terminaram e deram o nome dele ao canal. Nos séculos seguintes as margens viraram o distrito de teatro kabuki e bunraku de Osaka; os letreiros gigantes de hoje são descendentes diretos dos painéis de teatro.',
            '**O homem correndo é um anúncio de bala de caramelo, e o nome da empresa é uma molécula.** Em 1919, num porto de Saga, um comerciante chamado **Ezaki Riichi** viu pescadores cozinhando ostras e jogando fora o caldo. Ele sabia que aquele caldo era rico em **glicogênio** — o açúcar que o corpo queima como combustível — e passou anos extraindo aquilo para dentro de um caramelo, vendido como produto de saúde para crianças. A empresa, fundada em 1922, ganhou o nome da molécula: **Glico**.',
            'Daí sai tudo o que está no letreiro. Uma bala tem **16,75 kcal**, que é quanto se gasta correndo **300 metros** — e o slogan virou *hitotsubu sanbyaku mētoru*, "uma bala, trezentos metros". Ezaki testou 500 metros (exagerado) e 100 (fraco) antes de fechar em 300, que soava melhor e ainda por cima era verdade. E o desenho do homem cruzando a linha de chegada, de braços erguidos, veio de ele ter visto **uma criança correndo e chegando ao fim de uma corrida**. Não é um atleta famoso: é o cliente.',
            'O primeiro letreiro subiu aqui em **1935**: uma torre de neon de **33 metros**, absurda para a época. Foi desmontado na guerra, quando o metal foi requisitado, e voltou depois. O que vocês vão ver é a **sexta geração**, de outubro de 2014, já em LED, com o fundo trocando entre paisagens de Osaka. São noventa anos do mesmo sujeito correndo sem sair do lugar.',
            '**E tem a maldição.** Em 16 de outubro de 1985 o Hanshin Tigers ganhou a liga, e a torcida se juntou nesta ponte para comemorar do jeito de Osaka: a cada nome do time chamado em voz alta, um torcedor parecido com aquele jogador pulava no canal. Chegou a vez de **Randy Bass**, o rebatedor americano — e não havia nenhum estrangeiro barbudo por perto. Alguém correu até o KFC da esquina, arrancou a **estátua do Coronel Sanders** e jogou no canal no lugar dele.',
            'O Hanshin passou os **17 anos seguintes sem ganhar a liga**, com dez últimos lugares no caminho. A torcida batizou aquilo de **maldição do Coronel**. A estátua foi achada no fundo do canal em **10 de março de 2009**, 24 anos depois, sem as mãos e sem os óculos. Quando os Tigers enfim voltaram a ser campeões do Japão, 38 anos depois de 1985, o Coronel foi levado para ser purificado num santuário — **o Sumiyoshi Taisha, que vocês visitam no dia 27** — e depois descartado: 24 anos submerso não deixaram nada aproveitável.',
          ],
        },
        mapQuery: 'Ebisubashi Bridge Dotonbori Osaka',
      },
    ],
  },
];
