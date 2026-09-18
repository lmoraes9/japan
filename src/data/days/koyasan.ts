import type { Day } from '../types';

/**
 * O dia que sobe a montanha. Meia manhã de Osaka, o trem da Nankai à tarde, e
 * a noite no Okunoin — que é a única hora em que o cemitério faz sentido.
 */
export const koyasanDays: Day[] = [
  {
    id: 'd2026-11-26',
    date: '2026-11-26',
    stageId: 'koyasan',
    title: 'Meia manhã de Osaka e a subida para Kōyasan',
    subtitle: 'O castelo, o mercado, e depois duas horas de trem montanha acima até dormir num templo.',
    chips: ['castelo', 'mercado', 'trem de montanha', 'shukubō'],
    notes: [
      {
        label: 'malas',
        tone: 'warn',
        text: 'Hoje vocês saem do hotel de Namba **com tudo**. As malas grandes já estão em Kyoto desde o dia 24; a mochila de dois dias sobe com vocês. Se ela estiver pesada, há armários com moeda na estação de Kōyasan e no ponto Senjuinbashi.',
      },
      {
        label: 'horário',
        tone: 'warn',
        text: 'O check-in no shukubō vai até as **17:00** e o jantar sai por volta das **17:30**. Chegar depois disso não é atraso: é perder a refeição. Saiam de Namba **até as 13:30**.',
      },
      {
        label: 'frio',
        tone: 'info',
        text: 'Kōyasan fica a **800 m de altitude**. Fim de novembro: máxima de 8–10 °C, **mínima entre 0 e −3 °C**, e o Okunoin à noite não tem iluminação pública. Casaco de verdade, luvas, gorro, meia grossa (o quarto é tatame, sem sapato) e a lanterna do celular carregada.',
      },
      {
        label: 'dinheiro',
        tone: 'warn',
        text: 'A montanha quase não tem caixa eletrônico — o dos Correios, no Senjuinbashi, fecha cedo e nos fins de semana funciona pouco. **Subam com dinheiro vivo** para omamori, incenso, o chá da tarde e o ônibus se não pegarem o passe.',
      },
    ],
    stops: [
      {
        id: 'd26-castelo-osaka',
        placeMapId: 'castelo-osaka',
        time: '08:30',
        timeLabel: 'castelo',
        kind: 'sight',
        name: 'Castelo de Osaka',
        jp: '大阪城',
        facts: 'Parque e fossos **24h, grátis** · torreão **09:00–17:00**, ¥600 · hoje vocês têm **2h**, não o dia inteiro',
        paragraphs: [
          'Chegando às 08:30 vocês pegam os fossos e as muralhas na melhor luz do dia e sem ninguém, e a bilheteria do torreão abre às 09:00. Subam, deem a volta no jardim Nishinomaru (¥200, com bordo em novembro) e **saiam às 10:30** — hoje o dia tem hora marcada mais adiante.',
          'Sejamos honestos: o torreão atual é de **1931**, de concreto, com elevador. Mas as muralhas e os fossos são originais do século XVII, e há pedras de **mais de 100 toneladas** na base do portão Sakuramon, arrastadas de ilhas do Mar Interior por corda e tronco.',
        ],
        history: {
          paragraphs: [
            'Toyotomi Hideyoshi — o camponês que virou o homem mais poderoso do Japão — mandou construir em **1583** o maior castelo que o país já tinha visto, deliberadamente maior que qualquer coisa que os Oda tivessem feito. Ele morreu em 1598 deixando um filho de cinco anos.',
            'Tokugawa Ieyasu esperou. Em 1614 e 1615, nos **cercos de inverno e de verão de Osaka**, ele destruiu os Toyotomi. A parte mais famosa: no cerco de inverno, Ieyasu negociou uma trégua cuja condição era aterrar o fosso externo — e então mandou aterrar o interno também, alegando má interpretação. No verão seguinte, o castelo sem fossos caiu em dias. O herdeiro e a mãe se suicidaram. Começaram 250 anos de paz Tokugawa.',
            'Os Tokugawa reconstruíram tudo nos anos 1620, **por cima** das ruínas de Hideyoshi, com muralhas ainda mais altas — o que existe hoje é literalmente o castelo Tokugawa em cima do castelo Toyotomi. O torreão deles foi atingido por um raio em 1665 e queimou. Ficou sem torre por 266 anos, até 1931, quando a população de Osaka doou o dinheiro da reconstrução em seis meses.',
          ],
        },
        mapQuery: 'Osaka Castle',
      },
      {
        id: 'd26-kuromon',
        time: '11:00',
        timeLabel: 'mercado',
        kind: 'food',
        name: 'Kuromon Ichiba — e o almoço é aqui',
        jp: '黒門市場',
        facts: 'Maioria **09:00–18:00** · 580 m de galeria coberta · Nippombashi Stn · 8 min a pé do hotel',
        paragraphs: [
          'Mercado de rua desde cerca de 1822, hoje bem turístico mas ainda excelente: atum cortado na hora, uni, vieira grelhada, espetinho de wagyu, caranguejo, fugu na temporada. **Hoje ele é o almoço** — o restaurante de sushi sentado não cabe mais no dia. Comam pouco em cada banca e sigam andando.',
          'Aproveitem para comer bem: o jantar de hoje é *shōjin ryōri*, a cozinha vegetariana dos monges. Sem carne, sem peixe, sem caldo de bonito, sem cebola nem alho. É delicioso e é pouco.',
        ],
        mapQuery: 'Kuromon Ichiba Market Osaka',
      },
      {
        id: 'd26-nankai',
        time: '13:20',
        timeLabel: 'trem',
        kind: 'transit',
        name: 'Namba → Kōyasan, pela Nankai',
        jp: '南海高野線',
        facts: '**1h32** de especial こうや / **1h42** de快速急行 até a estação de Kōyasan, funicular incluído · + ônibus 10–15 min até a cidade',
        paragraphs: [
          'Comprem no balcão da Nankai em Namba o **高野山・世界遺産きっぷ (Kōyasan World Heritage Ticket)**: ida e volta Namba–Kōyasan, o funicular e **dois dias de ônibus ilimitado na montanha**, tudo junto. Em 2026 sai por **¥3.980** na versão digital (¥4.210 em papel) ou **¥4.910** com o assento do especial こうや na ida. A versão digital só pode ser comprada até as 15:00 do dia.',
          'O 特急こうや tem poucas partidas por dia e exige assento reservado. Se perderem, o **快速急行 (rapid express)** faz o mesmo trajeto em dez minutos a mais, sem reserva e sem custo extra — só confiram no painel se o trem vai até Gokurakubashi ou se é preciso trocar em Hashimoto.',
          'A partir de Hashimoto o trem vira um brinquedo: duas carruagens numa linha de bitola estreita subindo uma garganta, com curvas tão fechadas que dá para ver a própria locomotiva pela janela. No fim, em Gokurakubashi, vocês trocam para o **funicular** — 5 minutos numa rampa de 30 graus — e depois um ônibus até a rua principal. Não se pode ir a pé do funicular à cidade: a estrada é proibida para pedestres.',
        ],
        mapQuery: 'Nankai Namba Station',
      },
      {
        id: 'd26-checkin-shukubo',
        time: '15:30',
        timeLabel: 'templo',
        kind: 'hotel',
        name: 'Check-in no shukubō',
        jp: '宿坊',
        facts: 'Check-in **14:00–17:00** · jantar **~17:30** · check-out **09:00** · banho comum · quarto de tatame',
        paragraphs: [
          'Um shukubō não é hotel: é a hospedaria de um templo em funcionamento, e vocês entram no horário da casa. Tirem os sapatos na entrada, recebam o chá, e perguntem logo **quatro coisas**: a que horas é o jantar, a que horas abre o banho, a que horas é a oração da manhã, e — a que importa — **se aqui tem o *goma*, o ritual do fogo**, e a que horas. Nem todo templo de Kōyasan faz; o Ekō-in faz, e é a coisa que a Priscila lembra. Se aqui não tiver, dá para assistir ao de outro templo pagando à parte.',
          'O quarto é de tatame, com futon e uma mesa baixa, e as paredes são de papel — o silêncio ali é uma cortesia, não uma regra escrita. Quase sempre há aquecedor, mas o corredor é frio: é para isso que servem as meias grossas.',
        ],
        mapQuery: 'Kumagaiji Koyasan',
      },
      {
        id: 'd26-okunoin',
        time: '16:00',
        timeLabel: 'cemitério',
        kind: 'temple',
        name: 'Okunoin, no fim da tarde',
        jp: '奥之院',
        facts: '**24h · grátis** · 2 km do Ichinohashi até o mausoléu · pôr do sol **~16:50** · o Tōrō-dō fecha às 17:00, o caminho não fecha nunca',
        paragraphs: [
          'Entrem pelo **Ichinohashi**, a primeira ponte — não pelo estacionamento do meio, que corta a metade mais bonita. A tradição manda fazer uma reverência antes de atravessar, porque a partir dali você é hóspede de Kūkai.',
          'São dois quilômetros sob cedros de quarenta metros e **mais de 200 mil túmulos**. Perto do fim está a **Ponte Gobyō-bashi**, onde acabam as fotos: dali em diante não se fotografa, não se come e não se bebe. Do outro lado ficam o **Tōrō-dō**, o Salão das Lanternas, com dez mil lanternas acesas — duas delas, dizem, desde o século XI — e, atrás, o mausoléu onde Kūkai continua em meditação.',
          'Vão até o fim agora, com a luz que ainda houver, e **voltem devagar**. Ou usem o ônibus até Okunoin-mae para ganhar tempo e caminhem só a parte final.',
        ],
        history: {
          paragraphs: [
            'Estão aqui, a cem metros uns dos outros, **Oda Nobunaga** e os monges do Monte Hiei que ele mandou queimar vivos; **Toyotomi Hideyoshi** e os Toyotomi que os Tokugawa exterminaram; **Date Masamune**, **Takeda Shingen** e **Uesugi Kenshin**, que passaram a vida se enfrentando. Perto de Kūkai, a disputa acaba.',
            'E há os túmulos que ninguém espera. Uma empresa de dedetização ergueu um memorial **aos cupins que matou**. A UCC pôs uma xícara de café gigante. Há um monumento aos mortos **dos dois lados** da guerra do Pacífico, inclusive os inimigos — uma ideia que, em 1945, era quase escandalosa. E há um foguete da Shinmeiwa.',
            'Duas vezes por dia, às 6h e às 10h30, monges levam refeição até a porta do mausoléu. Chama-se *shōjingu*. Isso não foi interrompido em **mais de mil anos**.',
          ],
        },
        mapQuery: 'Okunoin Ichinohashi Koyasan',
      },
      {
        id: 'd26-jantar-shojin',
        time: '17:30',
        timeLabel: 'jantar',
        kind: 'food',
        name: 'Shōjin ryōri — o jantar dos monges',
        jp: '精進料理',
        facts: 'Servido no horário do templo · **sem carne, peixe, caldo de bonito, cebola ou alho** · incluído na diária',
        paragraphs: [
          'Chega numa bandeja laqueada, em tigelinhas: sopa de missô, legumes da montanha, tempurá de folha, algo em conserva, arroz. O centro do prato é o **goma-dōfu** — "tofu de gergelim", que não leva soja nenhuma: é pasta de gergelim branco com kuzu, batida até virar um creme denso e sedoso. É a especialidade de Kōyasan e vale prestar atenção nele.',
          'E tem o **kōya-dōfu**, tofu que os monges descobriram, por acidente, que podia ser congelado na neve e seco — o primeiro liofilizado do Japão, do século XIII. Reidratado no caldo, fica esponjoso.',
          'Muitos templos vendem cerveja e saquê ao hóspede. No Kōyasan chamam o saquê de *hannyatō*, "água da sabedoria" — o apelido que os monges deram para contornar a regra. Pergunte; costuma haver.',
        ],
        mapQuery: 'Kumagaiji Koyasan',
      },
      {
        id: 'd26-okunoin-noite',
        time: '19:00',
        timeLabel: 'à noite',
        kind: 'temple',
        name: 'Okunoin no escuro — a parte que importa',
        jp: '奥之院ナイトツアー',
        facts: '**Grátis por conta própria** · o tour guiado em inglês do Ekō-in sai às **19:00**, dura ~90 min e **aceita quem não está hospedado lá** — reservar antes',
        paragraphs: [
          'Se vocês fizerem uma coisa só em Kōyasan, é esta. O caminho tem lanternas de pedra acesas de ponta a ponta, a neblina desce entre os cedros e não há mais ninguém. É completamente diferente do mesmo caminho de dia.',
          'O **Ekō-in** — onde a Priscila ficou da outra vez — opera o único tour noturno em inglês que existe o ano inteiro, guiado por um monge, saindo do lobby deles às 19:00. **Não é preciso estar hospedado lá**, mas é preciso reservar, e esgota. Vale muito: o monge conta quem está enterrado em cada canto, e isso é metade do lugar.',
          'Por conta própria também funciona. Levem lanterna, casaco pesado e paciência para o frio. E não saiam do caminho principal.',
        ],
        mapQuery: 'Ekoin Koyasan',
      },
    ],
  },
];
