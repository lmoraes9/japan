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
    title: 'Manhã leve em Osaka e a subida para Kōyasan',
    subtitle: 'Dormir mais, o mercado, e depois duas horas de trem montanha acima até dormir num templo.',
    chips: ['mercado', 'trem de montanha', 'shukubō'],
    notes: [
      {
        label: 'Dia mais leve',
        tone: 'ok',
        text: 'Cortados o **Castelo de Osaka** (depois do original de Himeji, a reconstrução de concreto não faz falta) e a **caminhada do Okunoin à tarde** (o tour noturno faz o mesmo caminho, com guia). Durmam mais: café às 9h, Kuromon às 10:30, trem às 13:20. Em Kōyasan, check-in e descanso até o jantar.',
      },
      {
        label: 'Okunoin à noite — o tour está reservado',
        tone: 'warn',
        text: 'O **tour noturno do Okunoin já está reservado** (Awesome Tours, voucher RZ260913CQ7084-1, 2 adultos): **retirar o passe na recepção "Taira", 734 Koyasan, ATÉ as 19:00** — sem o passe não entra. O Taira fica perto da ponte Ichinohashi, a entrada do cemitério, a poucos minutos a pé do Fumon-in. Jantar às 17:30 é para dar tempo: **saiam do shukubō às 18:30**, porque táxi na montanha para às 17:00 e ninguém vem buscar. **Lanterna e flash são proibidos** — o caminho é iluminado só pelas lanternas de pedra, e é assim que ele deve ser visto. Casaco pesado, luvas, gorro (mínima entre 0 e −3 °C); capa de chuva se estiver ameaçando, porque com chuva fraca o tour sai mesmo. Voucher no celular, nome da reserva na ponta da língua: Leonardo Moraes.',
      },
      {
        label: 'malas',
        tone: 'warn',
        text: 'Hoje vocês saem do hotel de Namba **com tudo**. As malas grandes chegam ao hotel de Kyoto amanhã, dia 27 (entrega marcada); a mochila de dois dias sobe com vocês. Se ela estiver pesada, há armários com moeda na estação de Kōyasan e no ponto Senjuinbashi.',
      },
      {
        label: 'horário',
        tone: 'warn',
        text: 'O check-in no Fumon-in é das **15:00 às 16:30** e o jantar sai por volta das **17:30**. Chegar depois disso não é atraso: é perder a refeição. Saiam de Namba **até as 13:30**.',
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
        id: 'd26-cafe',
        time: '09:00',
        timeLabel: 'café',
        kind: 'food',
        name: 'Café da manhã no Ibuki, um kissaten de Osaka',
        jp: '伊吹珈琲店',
        facts: 'A ~4 min a pé do hotel, perto da Nippombashi · torrada grossa e café de coador · sem pressa: o Kuromon fica a 5 min a pé',
        paragraphs: [
          'É o café da família do **Marufuku**, o kissaten clássico mais famoso de Osaka. A casa do Kuromon abriu em 1982 como Marufuku e virou Ibuki com o filho do fundador. É o café da manhã de Osaka de verdade: café forte de coador, torrada grossa com manteiga, ovo, balcão antigo.',
          'Peçam pouco: **o almoço é o Kuromon, logo depois**, e é lá que se come de verdade hoje.',
          'Se estiver fechado ou com fila, o plano B é o konbini do caminho: onigiri e café em 10 minutos.',
        ],
        eat: [
          {
            label: 'Onde',
            items: [
              { name: 'Ibuki Coffee (伊吹珈琲店)', note: 'Kissaten clássico, perto da Nippombashi. Torrada, ovo e café de coador. Tel. 06-6632-0141.', specialty: true },
              { name: 'Plano B: konbini', note: 'Qualquer 7-Eleven, Lawson ou FamilyMart do caminho até a estação: onigiri, pão e café gelado.' },
            ],
          },
        ],
        mapQuery: '伊吹珈琲店 大阪 日本橋',
      },
      {
        id: 'd26-kuromon',
        time: '10:30',
        timeLabel: 'mercado',
        kind: 'food',
        name: 'Kuromon Ichiba — e o almoço é aqui',
        jp: '黒門市場',
        facts: 'Maioria **09:00–18:00** · 580 m de galeria coberta · Nippombashi Stn · 4 min a pé do hotel',
        paragraphs: [
          'Mercado de rua desde cerca de 1822, hoje bem turístico mas ainda excelente: atum cortado na hora, uni, vieira grelhada, espetinho de wagyu, caranguejo, fugu na temporada. **Hoje ele é o almoço.** Comam pouco em cada banca e sigam andando; às ~12:30 voltem ao hotel para pegar a mochila.',
          'Aproveitem para comer bem: o jantar de hoje é *shōjin ryōri*, a cozinha vegetariana dos monges. Sem carne, sem peixe, sem caldo de bonito, sem cebola nem alho. É delicioso e é pouco.',
        ],
        mapQuery: 'Kuromon Ichiba Market Osaka',
      },
      {
        id: 'd26-konbini',
        time: '12:50',
        timeLabel: 'konbini',
        kind: 'food',
        name: '7-Eleven da Nankai Namba — o lanche do trem e a fome da noite',
        facts: 'No 2º andar da Nankai Namba, ao lado da catraca central · 06:00–23:00 · há outro no 3º, já dentro das catracas',
        paragraphs: [
          'O jantar dos monges às 17:30 é bonito e é pouco, e a montanha fecha cedo. Comprem aqui o lanche das duas horas de trem **e** a reserva da noite: onigiri, pão, algo doce, chá. Nada perecível demais — o quarto tem chá quente, mas não geladeira.',
          'Em Kōyasan existem dois konbini e nenhum supermercado: o **Daily Yamazaki** (08:00–22:30), na rua principal a 1 min da parada Odawara-dōri, fica a caminho do Okunoin; o **FamilyMart** (07:00–23:00) fica no Kondō-mae, do lado do Garan. Dá para passar num deles depois do tour noturno, mas o toque de recolher do templo (~21h) manda — confirmem na chegada.',
        ],
        mapQuery: '7-Eleven Nankai Namba Station',
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
          'Comprem no balcão da Nankai em Namba o **高野山・世界遺産きっぷ (Kōyasan World Heritage Ticket)**: ida e volta Namba–Kōyasan, o funicular e **dois dias de ônibus ilimitado na montanha**, tudo junto. Desde abril de 2026 só existe **em papel**, por **¥4.210** por pessoa (uns **¥5.200** com o assento do especial こうや na ida); a versão digital com QR deixou de ser vendida. **No Google Maps, o destino é 高野山駅** (e partida 南海なんば駅): "Koyasan" sozinho cai num bairro chamado Takayama, perto de Nara.',
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
        facts: 'Fumon-in (普門院) · check-in **15:00–16:30** · jantar **~17:30** e café **incluídos** · check-out **08:00–09:00** · banho comum · quarto de tatame',
        paragraphs: [
          'Daqui até o jantar das 17:30 é **descanso**: quarto, chá, e o banho comunitário se já estiver aberto. Um shukubō não é hotel: é a hospedaria de um templo em funcionamento, e vocês entram no horário da casa. Tirem os sapatos na entrada, recebam o chá, e perguntem logo **quatro coisas**: a que horas é o jantar, a que horas abre o banho, a que horas é a oração da manhã, e — a que importa — **se aqui tem o *goma*, o ritual do fogo**, e a que horas. Nem todo templo de Kōyasan faz; o Ekō-in faz, e é a coisa que a Priscila lembra. Se aqui não tiver, dá para assistir ao de outro templo pagando à parte.',
          'O quarto é de tatame, com futon e uma mesa baixa, e as paredes são de papel — o silêncio ali é uma cortesia, não uma regra escrita. Quase sempre há aquecedor, mas o corredor é frio: é para isso que servem as meias grossas.',
        ],
        mapQuery: 'Fumonin Koyasan',
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
        mapQuery: 'Fumonin Koyasan',
      },
      {
        id: 'd26-okunoin-noite',
        time: '19:00',
        timeLabel: 'à noite',
        kind: 'temple',
        name: 'Okunoin no escuro — a parte que importa',
        jp: '奥之院ナイトツアー',
        facts: '**Reservado: Awesome Tours**, passe na recepção Taira até 19:00, saída 19:00, ~90 min · lanterna e flash proibidos · por conta própria também é grátis e aberto · o ponto é o café **Taira**, colado ao Ekō-in, e o tour **aceita quem não está hospedado lá**',
        paragraphs: [
          'Se vocês fizerem uma coisa só em Kōyasan, é esta. O caminho tem lanternas de pedra acesas de ponta a ponta, a neblina desce entre os cedros e não há mais ninguém. É completamente diferente do mesmo caminho de dia.',
          'O tour noturno é o do **Ekō-in** — onde a Priscila ficou da outra vez — mas quem opera é a AWESOME TOURS, e a reserva é à parte, no site deles (night.koyasan-okunoin.com), inclusive para hóspede do próprio Ekō-in. **Qualquer templo serve** (só Renge-in e Sainan-in não podem, pelo horário do jantar). O ponto de encontro é o balcão dentro do café **TAIRA**, colado ao Ekō-in; o jantar das 17:30 termina lá pelas 18:30, dá tempo. Vale muito: o guia conta quem está enterrado em cada canto, e isso é metade do lugar.',
          'Por conta própria também funciona. Levem lanterna, casaco pesado e paciência para o frio. E não saiam do caminho principal.',
        ],
        mapQuery: 'Ekoin Koyasan',
      },
    ],
  },
];
