import type { Day } from '../types';

export const kyotoDays: Day[] = [
  {
    id: 'd2026-11-27',
    date: '2026-11-27',
    stageId: 'kyoto',
    title: 'Sumiyoshi Taisha, mudança para Kyoto, e Fushimi Inari ao anoitecer',
    subtitle: 'Chegar no portal de dez mil torii às 15h30, quando todo mundo está indo embora.',
    chips: ['história', 'santuário', 'ramen'],
    stops: [
      {
        id: 'd27-sumiyoshi',
        time: '08:30',
        timeLabel: 'santuário',
        kind: 'temple',
        name: 'Sumiyoshi Taisha',
        jp: '住吉大社',
        facts: '**06:00–17:00** · **grátis** · 20 min de Namba pela linha Nankai',
        paragraphs: [
          'A última manhã de Osaka bem gasta. Um dos santuários mais antigos do Japão, e o mais estranho arquitetonicamente — de um jeito que só faz sentido quando alguém explica.',
        ],
        history: {
          paragraphs: [
            'O estilo daqui, o *sumiyoshi-zukuri*, é **anterior à chegada do budismo ao Japão**. Repare: telhado reto (não curvo), sem pintura vermelha, sem influência chinesa nenhuma. É o mais perto que existe de saber como era um santuário xintoísta antes de o continente influenciar qualquer coisa. Os prédios são reconstruídos periodicamente, sempre idênticos — o último de 1810.',
            'As divindades daqui protegem os marinheiros, e o santuário era parada obrigatória das embaixadas japonesas que partiam para a China. A ponte arqueada de laca vermelha na entrada, a **Sorihashi**, é tão íngreme que atravessá-la é considerado um rito de purificação — a subida força você a se curvar.',
          ],
        },
        mapQuery: 'Sumiyoshi Taisha Osaka',
      },
      {
        id: 'd27-trem-kyoto',
        time: '11:30',
        timeLabel: 'trem',
        kind: 'transit',
        name: 'Osaka → Kyoto e check-in',
        facts: 'JR Special Rapid **29 min ¥580** · as malas de Tóquio devem estar esperando no hotel',
      },
      {
        id: 'd27-almoco',
        time: '13:30',
        timeLabel: 'almoço',
        kind: 'food',
        name: 'Almoço perto da estação',
        eat: [
          {
            label: 'Ramen em Kyoto',
            items: [
              {
                name: 'Honke Daiichi-Asahi',
                specialty: true,
                note: '06:00–02:00, fecha qui · ao lado da estação, desde 1947. Shoyu escuro com gordura de porco por cima — o estilo Kyoto, muito mais pesado do que as pessoas esperam de Kyoto. Fila permanente.',
              },
              {
                name: 'Menya Inoichi',
                note: '11:00–15:00, fecha qua · Bib Gourmand, caldo claro de *hamaguri*. O oposto refinado do anterior.',
              },
            ],
          },
        ],
      },
      {
        id: 'd27-fushimi-inari',
        time: '15:30',
        timeLabel: 'santuário',
        kind: 'temple',
        name: 'Fushimi Inari Taisha',
        jp: '伏見稲荷大社',
        facts: '**24h · grátis** · JR Nara Line, 5 min da Estação de Kyoto · subida completa ~2h',
        paragraphs: [
          'Este é o segredo do dia: chegar às 15h30 e **subir enquanto todo mundo desce**. Por volta das 16h45 escurece, as lanternas acendem, e a partir dali vocês vão ter os corredores de torii praticamente sozinhos. É o santuário mais fotografado do Japão e o único que fica melhor de noite.',
          'Não precisam ir até o topo (233 m, 2h ida e volta). O **Yotsutsuji**, a meia altura, tem a vista da cidade e é ótimo ponto de retorno — cerca de 45 min de subida.',
        ],
        history: {
          paragraphs: [
            'Fundado em **711** na montanha Inari, é o santuário-mãe de mais de 30.000 santuários Inari espalhados pelo Japão. Inari era originalmente o deus do arroz — e como arroz era dinheiro, virou o deus dos negócios e da prosperidade quando o Japão se comercializou.',
            'Os torii **não são decoração: são recibos**. Cada um foi doado por uma empresa ou pessoa em agradecimento por um pedido atendido, e o nome do doador e a data estão escritos na coluna de trás (por isso vocês só veem a escrita ao **descer**). O costume começou no período Edo. Um torii pequeno sai hoje por volta de ¥400.000; um grande passa de um milhão. São cerca de 10.000 no total.',
            'As raposas de pedra são *kitsune*, mensageiras de Inari — repare que cada uma segura algo na boca: uma chave de celeiro de arroz, um feixe de espigas, uma joia, um pergaminho.',
          ],
        },
        mapQuery: 'Fushimi Inari Taisha',
        placeMapId: 'fushimi-inari',
      },
      {
        id: 'd27-jantar',
        time: '18:30',
        timeLabel: 'jantar',
        kind: 'food',
        name: 'Jantar',
        eat: [
          {
            label: 'Opção temática, já que vocês estão em Fushimi',
            items: [
              {
                name: 'Distrito do saquê de Fushimi',
                note: 'Fushimi é uma das duas capitais do saquê do Japão, graças à água subterrânea daqui. O **Museu Gekkeikan Ōkura** (09:30–16:30, ¥600 com degustação) fica a 15 min de trem. Se for, é programa de fim de tarde, antes do jantar.',
              },
              {
                name: 'Torikizoku ou izakaya perto do hotel',
                note: 'para uma noite curta — vocês acordam às 5h30 amanhã',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'd2026-11-28',
    date: '2026-11-28',
    stageId: 'kyoto',
    title: 'Higashiyama de ponta a ponta, terminando na iluminação noturna',
    subtitle: 'Kiyomizu-dera às 6h da manhã. É a coisa mais importante deste roteiro inteiro.',
    chips: ['história', 'momiji', 'unesco', 'iluminação'],
    stops: [
      {
        id: 'd28-kiyomizu',
        time: '06:00',
        timeLabel: 'templo',
        kind: 'temple',
        name: 'Kiyomizu-dera',
        jp: '清水寺',
        facts: '**06:00–18:00** · ¥500 · abre às 6h **todos os dias do ano**',
        paragraphs: [
          'Chegar na abertura é a diferença entre uma experiência e uma fila. Às 6h da manhã em novembro ainda está escuro, o vale está com neblina, e o palco de madeira sobre o bordo vermelho é só de vocês. Às 10h haverá milhares de pessoas.',
        ],
        history: {
          paragraphs: [
            'Fundado em **778** — dezesseis anos antes de Kyoto existir como capital. O nome significa "templo da água pura", pela cascata Otowa, cujas três correntes vocês podem beber com uma concha de cabo longo: uma dá longevidade, outra sucesso, outra amor. Beber das três é considerado ganância e anula o pedido.',
            'O **butai**, o palco suspenso, é de **1633** e se apoia em 168 pilares de *zelkova* encaixados sem um único prego, 13 metros acima da encosta. No período Edo nasceu a expressão "*pular do palco de Kiyomizu*", equivalente a "dar um salto no escuro" — porque acreditava-se que quem pulasse e sobrevivesse teria o desejo realizado. Os registros do templo contam **234 saltos** entre 1694 e 1864, com 85% de sobrevivência (a vegetação embaixo amortecia). A prática foi proibida em 1872.',
            'O telhado de casca de cipreste passou por uma restauração completa entre 2017 e 2020 — vocês vão pegar o templo recém-restaurado.',
          ],
        },
        mapQuery: 'Kiyomizu-dera Kyoto',
      },
      {
        id: 'd28-sannenzaka',
        time: '07:45',
        timeLabel: 'ladeiras',
        kind: 'sight',
        name: 'Sannenzaka & Ninenzaka',
        jp: '三年坂・二年坂',
        facts: '**24h · grátis** · lojas abrem 09:00–10:00',
        paragraphs: [
          'Ladeiras de pedra com casas de madeira, preservadas por lei como distrito histórico. Às 8h da manhã, vazias, com as lanternas ainda acesas, é a melhor caminhada de Kyoto. A superstição local diz que tropeçar aqui dá dois (ou três) anos de azar — daí os nomes. Vão devagar, é escorregadio mesmo.',
        ],
        mapQuery: 'Sannenzaka Kyoto',
      },
      {
        id: 'd28-kodaiji',
        time: '08:30',
        timeLabel: 'templo',
        kind: 'temple',
        name: 'Kōdai-ji',
        jp: '高台寺',
        facts: '**09:00–17:00** · ¥600 · **iluminação de outono até ~21:30** (ingresso à parte)',
        paragraphs: [
          'Fundado em 1606 por **Nene**, viúva de Toyotomi Hideyoshi, que virou freira depois que os Tokugawa destruíram a família do marido — e que, curiosamente, foi financiada por Tokugawa Ieyasu, num gesto político. O jardim é de Kobori Enshū, e o bosque de bambu no fundo é menor e muito mais calmo que o de Arashiyama.',
        ],
        mapQuery: 'Kodaiji Temple Kyoto',
      },
      {
        id: 'd28-ginkakuji',
        time: '10:00',
        timeLabel: 'templo',
        kind: 'temple',
        name: 'Ginkaku-ji, o Pavilhão de Prata',
        jp: '銀閣寺',
        facts: '**08:30–17:00** · ¥500 · ônibus 15 min desde Gion',
        paragraphs: [
          'Ele nunca foi prateado. Ashikaga Yoshimasa começou a construir em 1482 como retiro, imitando o Pavilhão Dourado do avô, mas o país estava em guerra civil e o dinheiro nunca apareceu — a folha de prata jamais foi aplicada.',
        ],
        history: {
          label: 'Por que este templo importa mais que o dourado',
          paragraphs: [
            'Yoshimasa foi um xogum péssimo: enquanto a Guerra Ōnin destruía Kyoto, ele se recusava a governar e se dedicava à estética. Só que essa fuga produziu a **cultura Higashiyama** — e é dali que saem, praticamente inteiras, a cerimônia do chá, o arranjo floral *ikebana*, o teatro nō, o jardim seco, a pintura a tinta e a arquitetura de tatame e *shōji* que até hoje é "casa japonesa".',
            'O **Tōgu-dō**, no terreno, contém o Dōjinsai, uma salinha de quatro tatames e meio que é considerada **a primeira sala de chá do Japão** e o modelo de todas as outras. E o cone de areia branca no jardim, o "Kōgetsudai", tem quase cinco séculos de gente reconstruindo a mesma forma.',
          ],
        },
        mapQuery: 'Ginkaku-ji Kyoto',
      },
      {
        id: 'd28-filosofo',
        time: '11:30',
        timeLabel: 'caminhada',
        kind: 'sight',
        name: 'Caminho do Filósofo',
        jp: '哲学の道',
        facts: '**24h · grátis** · 2 km, ~40 min sem paradas',
        paragraphs: [
          'Canal ladeado de cerejeiras — que em novembro estão sem folha, mas os bordos ao redor compensam. O nome vem de **Nishida Kitarō**, fundador da Escola de Kyoto e o filósofo mais importante do Japão moderno, que fazia este trajeto diariamente meditando a caminho da universidade.',
        ],
        mapQuery: 'Philosopher\'s Path Kyoto',
      },
      {
        id: 'd28-almoco',
        time: '12:30',
        timeLabel: 'almoço',
        kind: 'food',
        name: 'Almoço',
        eat: [
          {
            label: 'No caminho',
            items: [
              {
                name: 'Omen Ginkaku-ji',
                note: '11:00–21:00, fecha qui · udon servido com uma bandeja de legumes e gergelim para você montar. Instituição local desde 1967.',
              },
              {
                name: 'Hisago (Higashiyama)',
                note: '11:30–19:30, fecha seg · *oyakodon* lendário, ¥1.200. Fila.',
              },
              {
                name: 'Yudōfu',
                specialty: true,
                note: 'tofu fervido em caldo de kombu, a especialidade dos templos de Nanzen-ji. **Okutan** (11:00–16:00, fecha qui) faz desde 1635.',
              },
            ],
          },
        ],
      },
      {
        id: 'd28-nanzenji',
        time: '14:00',
        timeLabel: 'templo',
        kind: 'temple',
        name: 'Nanzen-ji & o aqueduto',
        jp: '南禅寺',
        facts: 'Pátio **grátis** · jardim Hōjō **08:40–17:00** ¥600 · portão Sanmon ¥600',
        paragraphs: [
          'O templo Zen de mais alto posto de todo o Japão, fundado em 1291 num antigo palácio imperial. Subam no **Sanmon** de 1628 — a varanda superior dá vista sobre as copas vermelhas, e é o cenário de uma cena famosa de kabuki em que um ladrão contempla a cidade e diz que a paisagem vale mil peças de ouro.',
        ],
        history: {
          label: 'O aqueduto de tijolos',
          paragraphs: [
            'Atrás do templo passa o **Suirokaku**, um aqueduto romano de tijolo vermelho construído em **1890** — dentro de um templo zen do século XIII. Ele faz parte do Canal do Lago Biwa, uma obra que Kyoto encomendou em desespero: a cidade tinha acabado de perder a capital para Tóquio, estava esvaziando, e apostou tudo em trazer água e energia hidrelétrica do lago vizinho para se reindustrializar. O engenheiro-chefe, **Tanabe Sakurō**, tinha 21 anos.',
            'Deu certo: o canal gerou a primeira usina hidrelétrica comercial do Japão, que alimentou o primeiro bonde elétrico do país, em 1895. O contraste do tijolo com o musgo é a imagem mais fotografada de Nanzen-ji, e continua sendo um aqueduto em funcionamento.',
          ],
        },
        mapQuery: 'Nanzenji Temple Kyoto',
      },
      {
        id: 'd28-eikando',
        time: '15:45',
        timeLabel: 'momiji',
        kind: 'temple',
        name: 'Eikan-dō Zenrin-ji',
        jp: '永観堂禅林寺',
        facts: 'Dia **09:00–17:00** ¥600 · **iluminação noturna 17:30–21:00** (entrada até 20:30), ingresso separado ~¥600',
        paragraphs: [
          'Há um ditado em Kyoto: **"momiji no Eikandō"** — para bordo, é Eikandō. São cerca de 3.000 árvores num terreno em encosta, com lago, pagode no alto e um corredor coberto que sobe a montanha. Se vocês forem a um único templo de momiji em Kyoto, é este.',
          'Estratégia: entrem por volta das 15h45 com o ingresso de dia, saiam às 17h, comam alguma coisa por perto, e voltem com o ingresso noturno. A iluminação refletida no lago é outro programa.',
        ],
        history: {
          label: 'A estátua que olha para trás',
          paragraphs: [
            'A imagem principal do templo é um **Amida Buda que vira a cabeça por cima do ombro** — único no Japão. A história: em 1082, o monge Eikan caminhava em oração quando a estátua desceu do altar e passou a caminhar à frente dele. Eikan parou, atônito. O Buda virou o rosto para trás e disse "Eikan, você está lento". E ficou assim.',
          ],
        },
        mapQuery: 'Eikando Zenrinji Kyoto',
      },
      {
        id: 'd28-gion',
        time: '19:30',
        timeLabel: 'jantar',
        kind: 'food',
        name: 'Gion & Pontochō',
        eat: [
          {
            label: 'Jantar em Kyoto',
            items: [
              {
                name: 'Izuju (em frente ao santuário Yasaka)',
                specialty: true,
                note: '10:30–19:00, fecha qua · sushi **de Kyoto**, que é outra coisa: *saba-zushi* (cavala curada, prensada) e *hako-zushi*. Cidade sem mar, então o peixe é curado — foi assim por mil anos. Desde 1912.',
              },
              {
                name: 'Pontochō',
                note: 'viela de 500 m entre o rio Kamo e Kiyamachi, larga o suficiente para duas pessoas. Dezenas de casas; várias com menu em inglês na porta.',
              },
              {
                name: 'Gion Tanto',
                note: '17:00–23:00, fecha qua · okonomiyaki e izakaya, informal e ótimo',
              },
            ],
          },
        ],
        paragraphs: [
          '**Aviso:** as vielas privadas de Gion (Hanamikōji sul) proibiram fotografia, com multa de ¥10.000. Fotografar gueixas na rua é proibido e mal visto. A rua principal continua livre.',
        ],
        mapQuery: 'Gion Kyoto',
      },
    ],
  },
  {
    id: 'd2026-11-29',
    date: '2026-11-29',
    stageId: 'kyoto',
    title: 'Arashiyama de manhã cedo → Kinkaku-ji → Ryōan-ji → Nishiki',
    subtitle: 'Bambuzal às 7h, o Pavilhão Dourado, o jardim de pedras, e o mercado de 400 anos.',
    chips: ['história', 'unesco', 'mercado', 'jardim'],
    stops: [
      {
        id: 'd29-konbini',
        time: '06:30',
        timeLabel: 'konbini',
        kind: 'food',
        name: '7-Eleven a caminho de Arashiyama — parada 3 de 4',
        facts: 'Estação de Kyoto e Saga-Arashiyama têm lojas 24h',
        paragraphs: [
          'Saindo às 6h30 nada está aberto, e é exatamente para isso que o konbini existe. Hoje: **café da máquina** — pega-se o copo vazio no caixa (o gelado já vem lacrado com gelo na geladeira), paga, e só então põe na máquina, botão R ou L.',
          'E, se a loja tiver a máquina branca de **smoothie** ao lado do caixa, é a hora: copo de fruta congelada do freezer, tira o lacre, encaixa, 40 segundos. Nem toda loja tem — se não achar, fica para a repescagem do dia 2.',
        ],
        mapQuery: '7-Eleven Kyoto Station',
      },
      {
        id: 'd29-bambu',
        time: '07:00',
        timeLabel: 'bambu',
        kind: 'sight',
        name: 'Bosque de bambu de Arashiyama',
        jp: '嵯峨野竹林',
        facts: '**24h · grátis** · JR Saga-Arashiyama, 15 min da Estação de Kyoto',
        paragraphs: [
          'Às 7h vocês têm o caminho quase vazio; às 9h30 é um corredor de gente. O bambu *moso* daqui cresce até 1 metro por dia na primavera e o bosque é gerenciado há séculos — cada haste é colhida depois de 3 a 5 anos. O som do vento nas hastes está na lista oficial dos **100 sons a preservar do Japão**.',
        ],
        mapQuery: 'Arashiyama Bamboo Grove',
      },
      {
        id: 'd29-tenryuji',
        time: '08:30',
        timeLabel: 'templo',
        kind: 'temple',
        name: 'Tenryū-ji',
        jp: '天龍寺',
        facts: 'Jardim **08:30–17:00** ¥500 · Patrimônio Mundial',
        history: {
          paragraphs: [
            'Fundado em **1339** pelo xogum Ashikaga Takauji — para apaziguar o espírito do imperador Go-Daigo, que ele havia traído e derrubado, e que acabara de morrer no exílio. Culpa transformada em arquitetura.',
            'O jardim **Sōgenchi**, projetado pelo monge **Musō Soseki**, é o mais antigo de Kyoto **que sobrevive na forma original** — os prédios queimaram oito vezes, o jardim nunca mudou em quase 700 anos. Ele usa *shakkei*, "paisagem emprestada": as montanhas Arashiyama ao fundo foram deliberadamente compostas como parte do jardim, sem cerca visível. Em novembro, essa moldura inteira está vermelha.',
          ],
        },
        mapQuery: 'Tenryuji Temple Kyoto',
      },
      {
        id: 'd29-okochi-sanso',
        time: '09:45',
        timeLabel: 'villa',
        kind: 'sight',
        name: 'Ōkōchi Sansō',
        jp: '大河内山荘',
        facts: '**09:00–17:00** · ¥1.000 **com matcha e doce inclusos** · saída norte do bambuzal',
        paragraphs: [
          'A vila e os jardins que o ator de cinema mudo **Ōkōchi Denjirō** construiu ao longo de 30 anos, dos anos 1930 aos 60, financiando tudo com o próprio salário. Trilha em encosta com vistas do rio Hozu e da cidade. A maioria dos turistas passa reto pelo portão e é justamente por isso que aqui é calmo.',
        ],
        mapQuery: 'Okochi Sanso Villa Arashiyama',
      },
      {
        id: 'd29-togetsukyo',
        time: '11:00',
        timeLabel: 'rio',
        kind: 'sight',
        name: 'Ponte Togetsukyō & Hōgon-in',
        facts: 'Ponte **24h** · Hōgon-in abre especialmente no outono, **09:00–17:00**, ¥700',
        paragraphs: [
          'A "ponte que cruza a lua" tem esse nome desde o século XIV, de um comentário de um imperador sobre a lua atravessando o céu por cima dela. O jardim do **Hōgon-in** só abre no outono e na primavera, e é um dos mais bonitos de Arashiyama.',
        ],
        eat: [
          {
            label: 'Duas experiências opcionais, ambas precisam de reserva',
            items: [
              {
                name: 'Trem panorâmico Sagano (Torokko)',
                note: '09:00–16:00, ~¥880 · 25 min de vagão aberto pelo desfiladeiro do rio Hozu. Em novembro é **a** atração da região e os assentos esgotam com semanas de antecedência. Reservem agora se quiserem.',
              },
              {
                name: 'Barco do rio Hozu',
                note: '~2h, ¥6.000 · descida de Kameoka até Arashiyama em barco de fundo chato conduzido a vara. Espetacular no outono.',
              },
            ],
          },
        ],
        mapQuery: 'Togetsukyo Bridge Arashiyama',
      },
      {
        id: 'd29-almoco',
        time: '12:15',
        timeLabel: 'almoço',
        kind: 'food',
        name: 'Almoço em Arashiyama',
        eat: [
          {
            label: 'Perto da ponte',
            items: [
              {
                name: 'Arashiyama Yoshimura',
                note: '11:00–17:00 · soba com vista frontal da ponte e do rio. Peguem senha, a espera é grande e vale.',
              },
              {
                name: 'Shigetsu (dentro do Tenryū-ji)',
                specialty: true,
                note: '11:00–14:00 · *shōjin ryōri*, a cozinha vegetariana budista de monastério, servida por monges. A partir de ¥3.800. Reserva recomendada.',
              },
            ],
          },
        ],
      },
      {
        id: 'd29-kinkakuji',
        time: '13:45',
        timeLabel: 'templo',
        kind: 'temple',
        name: 'Kinkaku-ji, o Pavilhão Dourado',
        jp: '金閣寺',
        facts: '**09:00–17:00** · ¥500 · ônibus 205/12, ~35 min de Arashiyama · Patrimônio Mundial',
        paragraphs: [
          'É pequeno, a visita é um circuito de mão única de 30 minutos, e ainda assim é impossível não parar. Os dois andares superiores são cobertos de folha de ouro puro e o reflexo no lago é o ponto inteiro do projeto.',
        ],
        history: {
          paragraphs: [
            'Era uma villa aristocrática que o xogum **Ashikaga Yoshimitsu** comprou em 1397 para se aposentar — e o fato de um militar poder comprar a casa de um nobre já dizia tudo sobre quem mandava. Os três andares são, deliberadamente, três estilos arquitetônicos diferentes empilhados: palácio aristocrático embaixo, casa de samurai no meio, templo zen chinês em cima. É uma declaração política em forma de prédio.',
            'Em **2 de julho de 1950**, um noviço de 21 anos chamado Hayashi Yōken ateou fogo ao pavilhão e tentou se matar na colina atrás. O prédio original, de 1398, virou cinzas. O julgamento revelou um jovem gago, doente e obcecado pela beleza do templo — e o caso virou **"O Templo do Pavilhão Dourado"**, de Yukio Mishima, um dos maiores romances japoneses do século XX.',
            'O que está lá hoje é de 1955. Em 1987 refizeram a cobertura com folha de ouro **cinco vezes mais espessa** que a original.',
          ],
        },
        mapQuery: 'Kinkaku-ji',
      },
      {
        id: 'd29-ryoanji',
        time: '15:00',
        timeLabel: 'jardim',
        kind: 'temple',
        name: 'Ryōan-ji',
        jp: '龍安寺',
        facts: '**08:00–17:00** · ¥600 · 15 min a pé do Kinkaku-ji · Patrimônio Mundial',
        paragraphs: [
          'O jardim seco mais famoso do mundo: 15 pedras sobre cascalho branco raspado, num retângulo de 25 × 10 m, cercado por um muro de barro fervido em óleo que envelheceu em manchas. Ninguém sabe quem o fez, nem quando exatamente (século XV ou XVI), nem o que significa — e não existe interpretação oficial.',
          'A propriedade mais citada: **de qualquer ponto da varanda, sempre há exatamente uma pedra invisível**. Só se vê as 15 do alto. Sentem-se, fiquem quinze minutos em silêncio e testem. Depois desçam ao lago, que é do século XII e quase ninguém visita.',
        ],
        mapQuery: 'Ryoanji Temple Kyoto',
      },
      {
        id: 'd29-nishiki',
        time: '16:45',
        timeLabel: 'mercado',
        kind: 'sight',
        name: 'Mercado Nishiki',
        jp: '錦市場',
        facts: '**09:00–18:00** (lojas fecham escalonado) · 400 m cobertos · Karasuma/Shijō',
        paragraphs: [
          '"A cozinha de Kyoto": 130 bancas numa galeria estreita, muitas na mesma família há gerações. O que procurar é o que é específico de Kyoto — *tsukemono* (conservas), *yuba* (pele de tofu), *dashimaki tamago*, *fu* (glúten de trigo), amendoim de matcha, faca da **Aritsugu** (que existe desde **1560** e originalmente fazia espadas — se ainda quiserem uma faca, esta é a loja mais histórica do Japão).',
          'Emendem com as galerias **Teramachi** e **Shinkyōgoku**, que saem do Nishiki: papelaria, roupa, artesanato, lojas de segunda mão de quimono.',
        ],
        mapQuery: 'Nishiki Market Kyoto',
      },
    ],
  },
  {
    id: 'd2026-11-30',
    date: '2026-11-30',
    stageId: 'kyoto',
    title: 'Nara — a capital antes da capital',
    subtitle: 'O maior buda de bronze do mundo, mil cervos soltos e o Japão do século VIII.',
    chips: ['história', 'unesco', 'bate-volta', 'kakinoha'],
    notes: [
      {
        label: 'Por que Nara existe',
        tone: 'info',
        text: 'Antes de 710, cada vez que um imperador morria a capital mudava de lugar — por causa da impureza ritual associada à morte. Em 710 a imperatriz Genmei quebrou o ciclo e fundou **Heijō-kyō**, a primeira capital permanente do Japão, copiada em grade da chinesa Chang\'an.\n\nDurou só **74 anos**. Os mosteiros budistas cresceram tanto em poder que um monge quase conseguiu ser feito imperador; a corte fugiu em 784 e acabou em Kyoto. Mas os 74 anos foram intensos: foi aqui que o Japão ganhou escrita própria, sua primeira poesia compilada, sua primeira história oficial e sua primeira grande arte budista. **E como a capital foi embora, ninguém teve motivo para reconstruir Nara por cima de si mesma.** É por isso que sobrou tanta coisa do século VIII aqui e quase nada em Kyoto.',
      },
    ],
    stops: [
      {
        id: 'd30-trem-nara',
        time: '08:00',
        timeLabel: 'trem',
        kind: 'transit',
        name: 'Kyoto → Nara',
        facts: 'Kintetsu Limited Express **35 min ¥1.280** (chega mais perto do parque) ou JR Nara Line **45 min ¥720**',
      },
      {
        id: 'd30-parque-nara',
        placeMapId: 'nara',
        time: '09:00',
        timeLabel: 'parque',
        kind: 'sight',
        name: 'Parque de Nara & os cervos',
        jp: '奈良公園',
        facts: '**24h · grátis** · biscoito *shika senbei* ¥200',
        paragraphs: [
          'Cerca de 1.200 cervos sika soltos. Eles **fazem reverência** quando você levanta o biscoito — comportamento aprendido, passado de geração para geração há séculos. Segurem o biscoito escondido até estar pronta para dar, ou vocês vão ser cercadas. Eles mordiscam bolsa, mapa e casaco.',
          'A razão de estarem ali: a lenda diz que a divindade Takemikazuchi chegou a Nara montado num cervo branco para proteger a nova capital. Até 1637, matar um cervo em Nara era crime capital. Hoje são Monumento Natural Nacional.',
        ],
        mapQuery: 'Nara Park',
      },
      {
        id: 'd30-todaiji',
        time: '09:30',
        timeLabel: 'templo',
        kind: 'temple',
        name: 'Tōdai-ji & o Grande Buda',
        jp: '東大寺',
        facts: '**07:30–17:30** em novembro · ¥800 · Patrimônio Mundial',
        paragraphs: [
          'Atrás do Buda há um **pilar com um buraco** do mesmo tamanho da narina da estátua. Diz a tradição que quem passar por ele alcança a iluminação. Crianças passam fácil; adultos, com esforço e público.',
        ],
        history: {
          paragraphs: [
            'Em 735–737, uma epidemia de varíola matou **entre um quarto e um terço da população do Japão**, incluindo os quatro irmãos que controlavam a corte. Houve revolta, seca e fome. O imperador Shōmu concluiu que o país estava sendo punido e, em 743, decretou a construção de um Buda de bronze do tamanho de um prédio, pedindo que "todos, até quem só puder doar um punhado de terra", participassem.',
            'A obra quase faliu o Estado: consumiu praticamente todo o bronze disponível no país e envolveu, segundo os registros, mais de dois milhões de pessoas. Ficou pronta em **752**, e a cerimônia de "abertura dos olhos" foi conduzida por um monge indiano, **Bodhisena**, diante de embaixadas de toda a Ásia — um pincel gigante pintou as pupilas, com fios amarrados nele para que a plateia inteira participasse simbolicamente.',
            'O Buda tem **15 metros** e cerca de 500 toneladas. O **Daibutsuden** que o abriga é de 1709 e tem **dois terços** da largura original — e mesmo assim é uma das maiores estruturas de madeira do mundo. Imaginem o de 752.',
          ],
        },
        mapQuery: 'Todai-ji Nara',
      },
      {
        id: 'd30-nigatsudo',
        time: '11:00',
        timeLabel: 'templo',
        kind: 'temple',
        name: 'Nigatsu-dō',
        jp: '二月堂',
        facts: '**24h · grátis** · 10 min de subida atrás do Tōdai-ji',
        paragraphs: [
          'Quase todo mundo vai embora depois do Grande Buda e perde isto. É um salão sobre palafitas na encosta, com uma varanda de onde se vê Nara inteira e as montanhas. Sempre calmo.',
          'O ritual do fogo **Omizutori** acontece aqui todo mês de março **desde 752 — sem uma única interrupção em mais de 1.270 anos**, atravessando guerras civis, incêndios e a Segunda Guerra. É possivelmente a cerimônia contínua mais antiga do mundo.',
        ],
        mapQuery: 'Nigatsudo Nara',
      },
      {
        id: 'd30-kasuga-taisha',
        time: '11:45',
        timeLabel: 'santuário',
        kind: 'temple',
        name: 'Kasuga Taisha',
        jp: '春日大社',
        facts: '**06:30–17:30** · pátio grátis · área interna ¥700 · Patrimônio Mundial',
        paragraphs: [
          'Fundado em **768** pelo clã Fujiwara. Cerca de **3.000 lanternas**: 2.000 de pedra ao longo do caminho na floresta, cobertas de musgo, e 1.000 de bronze penduradas nos beirais, todas doadas por fiéis ao longo de mil anos. Dentro há um corredor escuro onde algumas ficam acesas o ano inteiro com espelhos — dá uma noção do que é o festival de lanternas.',
          'Por mais de mil anos o santuário foi **totalmente reconstruído a cada vinte anos**, sempre idêntico, para manter viva a técnica de construção. A floresta ao redor, o Kasugayama, é proibida de corte desde **841** — é uma floresta primária de 1.200 anos dentro de uma cidade.',
        ],
        mapQuery: 'Kasuga Taisha Nara',
      },
      {
        id: 'd30-almoco',
        time: '13:00',
        timeLabel: 'almoço',
        kind: 'food',
        name: 'Almoço em Nara',
        eat: [
          {
            label: 'A especialidade local',
            items: [
              {
                name: 'Kakinoha-zushi',
                specialty: true,
                note: 'sushi de cavala ou salmão curado, embrulhado em **folha de caqui**. Nasceu porque Nara não tem mar: o peixe vinha salgado das montanhas e a folha de caqui é antibacteriana. É comida de conservação virada em iguaria.',
              },
              {
                name: 'Nakatanidō (Sanjō-dōri)',
                specialty: true,
                note: '10:00–19:00 · fazem *mochi* na rua com dois homens batendo em ritmo absurdo, várias vezes por hora. É um espetáculo e o mochi de artemísia sai quente por ¥150.',
              },
              {
                name: 'Kamameshi Shizuka',
                note: '11:00–20:00, fecha seg · arroz cozido em panela de ferro individual',
              },
            ],
          },
        ],
      },
      {
        id: 'd30-kofukuji',
        time: '14:30',
        timeLabel: 'templo',
        kind: 'temple',
        name: 'Kōfuku-ji',
        jp: '興福寺',
        facts: 'Pátio **24h grátis** · Salão dos Tesouros Nacionais **09:00–17:00** ¥700',
        paragraphs: [
          'O templo do clã Fujiwara, que governou o Japão nos bastidores por quatro séculos casando filhas com imperadores. O pagode de cinco andares de **1426** é o segundo mais alto do Japão.',
          'No Salão dos Tesouros está o **Ashura** — uma estátua de 734, em laca seca, de um jovem de três rostos e seis braços, com uma expressão que não se parece com nenhuma outra escultura budista: em vez de serenidade, angústia adolescente. É provavelmente a escultura mais amada do Japão, e vê-la de perto vale sozinha o ingresso.',
        ],
        mapQuery: 'Kofukuji Nara',
      },
      {
        id: 'd30-naramachi',
        time: '15:45',
        timeLabel: 'bairro',
        kind: 'sight',
        name: 'Naramachi & Isui-en',
        jp: 'ならまち・依水園',
        facts: 'Naramachi **grátis** · Isui-en **09:30–16:30 · fecha terça** · ¥1.200',
        paragraphs: [
          'Naramachi é o antigo bairro de mercadores, com casas *machiya* estreitas e fundas (o imposto era cobrado pela largura da fachada, então todo mundo construía para trás). Vejam os *migawari-zaru*, macaquinhos de tecido vermelho pendurados nas portas para absorver o azar da casa.',
          'O **Isui-en** é um jardim que usa o portão do Tōdai-ji e as montanhas como paisagem emprestada, e tem casa de chá. Segunda-feira ele está aberto (fecha às terças) — aproveitem.',
        ],
        mapQuery: 'Naramachi Nara',
      },
    ],
  },
  {
    id: 'd2026-12-01',
    date: '2026-12-01',
    stageId: 'kyoto',
    title: 'Tōfuku-ji na abertura, 1.001 Kannons, e Shinkansen para Tóquio',
    subtitle: 'Duas últimas paradas de Kyoto, ambas perto da estação. Depois, oeste para leste.',
    chips: ['momiji', 'história', 'shinkansen'],
    notes: [
      {
        label: 'Antes de sair',
        tone: 'warn',
        text: 'Despachem as malas pelo takuhaibin do hotel de Kyoto para o hotel de Tóquio logo cedo — chegam no fim da tarde ou no dia seguinte. Fica muito mais confortável.',
      },
    ],
    stops: [
      {
        id: 'd01-tofukuji',
        time: '08:00',
        timeLabel: 'momiji',
        kind: 'temple',
        name: 'Tōfuku-ji',
        jp: '東福寺',
        facts: 'Na alta do outono abre **08:00–16:00** (última entrada 15:30) · ¥600 para a ponte Tsūtenkyō + ¥500 para os jardins Hōjō · 2 estações da Estação de Kyoto',
        paragraphs: [
          'Cheguem na abertura. A ponte coberta **Tsūtenkyō** atravessa um vale com cerca de 2.000 bordos plantados abaixo — quando você olha por cima do parapeito, é uma superfície contínua de vermelho e laranja. Em novembro forma-se fila para entrar na ponte e é proibido parar para fotografar em cima dela justamente por isso.',
        ],
        history: {
          paragraphs: [
            'Fundado em **1236** por um regente Fujiwara que queria um templo tão grande quanto os de Nara — e batizou-o juntando as sílabas de **Tō**dai-ji e Kō**fuku**-ji. O portão **Sanmon**, de 1425, é **o portão zen mais antigo do Japão** ainda de pé.',
            'Os jardins do Hōjō são de **1939**, obra de **Mirei Shigemori**, e valem tanto quanto a folhagem: ele reinventou o jardim seco em linguagem modernista, e o mais famoso é um **tabuleiro xadrez de blocos de musgo e pedra** que vai se desfazendo até virar musgo puro num canto. Feito com materiais reaproveitados da reforma, por princípio zen de não desperdiçar.',
          ],
        },
        mapQuery: 'Tofuku-ji Kyoto',
      },
      {
        id: 'd01-sanjusangendo',
        time: '10:00',
        timeLabel: 'templo',
        kind: 'temple',
        name: 'Sanjūsangen-dō',
        jp: '三十三間堂',
        facts: '**08:30–17:00** · ¥600 · 10 min da Estação de Kyoto · sem fotos dentro',
        paragraphs: [
          'Um salão de madeira de **120 metros** de comprimento com **1.001 estátuas de Kannon** de mil braços, cobertas de folha de ouro, em fileiras. Cada rosto é diferente — a tradição diz que qualquer pessoa encontra ali o rosto de alguém que perdeu. Na frente delas, 28 divindades guardiãs esculpidas com um realismo de tirar o fôlego, incluindo uma com olhos de cristal incrustado.',
          '124 das estátuas são originais de **1164**; as outras 876 foram refeitas no século XIII depois de um incêndio, por uma escola inteira de escultores trabalhando em série. O nome significa "salão de 33 vãos", pelos espaços entre as colunas. Sem fotografia lá dentro — o que, honestamente, melhora a visita.',
        ],
        mapQuery: 'Sanjusangendo Kyoto',
      },
      {
        id: 'd01-almoco',
        time: '11:45',
        timeLabel: 'almoço',
        kind: 'food',
        name: 'Almoço na Estação de Kyoto',
        eat: [
          {
            label: 'No prédio da estação',
            items: [
              {
                name: 'Kyoto Ramen Kōji — 10º andar',
                note: '11:00–22:00 · nove casas de nove regiões do Japão num corredor só. Bom jeito de comparar estilos.',
              },
              {
                name: 'Isetan depachika — B1/B2',
                note: '10:00–20:00 · comprem um **ekiben** aqui para o trem, se preferirem comer a bordo',
              },
            ],
          },
        ],
      },
      {
        id: 'd01-shinkansen',
        time: '13:20',
        timeLabel: 'shinkansen',
        kind: 'transit',
        name: 'Kyoto → Tóquio',
        facts: 'Nozomi **2h15** · ¥14.200 reservado · **Fuji do lado esquerdo** nesse sentido, uns 40 min antes de chegar',
      },
      {
        id: 'd01-checkin-compras',
        time: '16:00',
        timeLabel: 'compras',
        kind: 'shopping',
        name: 'Check-in em Ginza/Nihonbashi + primeira rodada de compras',
        facts: 'Lojas **10:00–21:00**',
        paragraphs: [
          'Base sugerida para as duas últimas noites: **Ginza, Yaesu ou Nihonbashi**. Fica a 30 minutos de Haneda, a pé das lojas que interessam, e permite sair tarde no dia 3.',
          'Hoje é o dia de **fechar as compras grandes** — MacBook, iPhone, robô aspirador — e não amanhã. Se der algum problema de estoque ou de configuração, vocês ainda têm um dia inteiro de margem.',
        ],
      },
      {
        id: 'd01-gachapon-ikebukuro',
        time: '18:45',
        timeLabel: 'gachapon',
        kind: 'sight',
        name: 'Gashapon Department Store — Ikebukuro',
        jp: 'ガシャポンのデパート',
        facts: '**~3.000 máquinas — a maior loja de gachapon do mundo** · Sunshine City, World Import Mart 3F · normalmente até 21h/22h — confirmem no site do Sunshine City · de Ginza: linha Marunouchi direto, ~25 min',
        paragraphs: [
          'A noite de hoje está livre, e as compras grandes fecham lá pelas 18h — então este é o momento do gachapon: um andar inteiro com cerca de **3.000 máquinas de cápsula**, de franquia de anime a miniaturas absurdas de utensílio de cozinha. Levem moedas de ¥100 (tem trocador na loja).',
          'A volta para Ginza é direta pela mesma linha. Se estiverem mortos das compras, pulem sem culpa — é diversão, não obrigação.',
        ],
        mapQuery: 'Gashapon Department Store Ikebukuro Sunshine City',
      },
    ],
  },
];
