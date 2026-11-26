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
        text: 'Cortados o **Castelo de Osaka** (depois do original de Himeji, a reconstrução de concreto não faz falta) e a **caminhada do Okunoin à tarde** (o tour noturno faz o mesmo caminho, com guia). Café às 9h, Kuromon às 10h, e **trem comum entre 11:30 e 12:00** — sem reserva, sai a cada ~30 min. Chegam ao templo ~13:45, com **2h45 de folga** até o fim do check-in. Deixam a mochila, dão uma volta, check-in às 15:00 e descanso até o jantar.',
      },
      {
        label: 'Okunoin à noite — o tour está reservado',
        tone: 'warn',
        text: 'O **tour noturno do Okunoin já está reservado** (Awesome Tours, pedido **RZ260913CQ7084**, 2 adultos, nome Moraes). **Check-in no balcão da Awesome Tours dentro do café 大楽 TAIRA** (734 Koyasan, ao lado do Ekō-in, 10–15 min a pé para o leste do Fumon-in): **das 13:00 às 17:00** (recomendado, com bebida quente grátis). **Das 17:00 às 18:30 o balcão fecha**; reabre só das **18:30 às 18:55**, lotado e sem brinde. No check-in vocês recebem o **参加証 (Tour Pass)** com **o horário e o ponto de encontro**: não percam. O tour sai **entre 19:00 e 19:15** e dura ~90 min. Mostrar o e-mail das instruções no TAIRA dá desconto nas lembranças. **Lanterna e flash são proibidos** — o caminho é iluminado só pelas lanternas de pedra, e é assim que ele deve ser visto. Casaco pesado, luvas, gorro (mínima entre 0 e −3 °C); capa de chuva se estiver ameaçando, porque com chuva fraca o tour sai mesmo. Voucher no celular, nome da reserva na ponta da língua: Leonardo Moraes.',
      },
      {
        label: 'Fumon-in: horários e regras',
        tone: 'warn',
        text: '**Jantar 17:30** (um funcionário chama no quarto) · **banho 16:30–21:30** · **portão principal fecha às 17:00**: depois, saiam e entrem pela **portinha dos fundos, ao lado do portão** · **fechamento total às 21:00** — depois disso não se entra · o **futon é arrumado durante o jantar** · **oração 6:30–7:10** no salão principal (cheguem 6:25) · **café 7:10** · **check-out 9:00**. Recepção: ramal **15 ou 10** (depois das 20:00, emergência **13**). Wi-Fi **koyafumon66_5** ou **koyafumon66_2.4**, senha **6480211608**.',
      },
      {
        label: 'roupa',
        tone: 'warn',
        text: 'O **yukata é só para dentro do templo** (quarto, banho, jantar). **Roupa normal** na oração da manhã, no salão principal, no Garan e no **Okunoin**: nada de ombros de fora, short ou minissaia — no Okunoin eles pedem para cobrir ou não entrar. **Sem fotos dentro do salão principal.** Para o tour: casaco pesado, gorro, luvas, sapato fechado.',
      },
      {
        label: 'malas',
        tone: 'warn',
        text: 'Hoje vocês saem do hotel de Namba **com tudo**. As malas grandes chegam ao hotel de Kyoto amanhã, dia 27 (entrega marcada); a mochila de dois dias sobe com vocês. Se ela estiver pesada, há armários com moeda na estação de Kōyasan e no ponto Senjuinbashi.',
      },
      {
        label: 'horário',
        tone: 'warn',
        text: 'O check-in no Fumon-in é das **15:00 às 16:30** e o jantar sai por volta das **17:30**. Chegar depois disso não é atraso: é perder a refeição. Saiam de Namba **entre 11:30 e 12:00**: errando um trem, ainda sobra muito tempo.',
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
        time: '10:00',
        timeLabel: 'mercado',
        kind: 'food',
        name: 'Kuromon Ichiba — e o almoço é aqui',
        jp: '黒門市場',
        facts: 'Maioria **09:00–18:00** · 580 m de galeria coberta · Nippombashi Stn · 4 min a pé do hotel',
        paragraphs: [
          'Mercado de rua desde cerca de 1822, hoje bem turístico mas ainda excelente: atum cortado na hora, uni, vieira grelhada, espetinho de wagyu, caranguejo, fugu na temporada. **Hoje ele é o almoço.** Comam pouco em cada banca e sigam andando; às **~11:00** voltem ao hotel para pegar a mochila.',
          'Aproveitem para comer bem: o jantar de hoje é *shōjin ryōri*, a cozinha vegetariana dos monges. Sem carne, sem peixe, sem caldo de bonito, sem cebola nem alho. É delicioso e é pouco.',
        ],
        mapQuery: 'Kuromon Ichiba Market Osaka',
      },
      {
        id: 'd26-konbini',
        time: '11:15',
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
        time: '11:30',
        timeLabel: 'trem',
        kind: 'transit',
        name: 'Namba → Kōyasan, pela Nankai',
        jp: '南海高野線',
        facts: '**Trem comum (快速急行 / 急行) entre 11:30 e 12:00**, sem reserva, um a cada ~30 min · ~1h40 até a estação de Kōyasan, funicular incluído · + ônibus 11 min até Senjuinbashi · chegada ao templo **~13:45**',
        paragraphs: [
          'Comprem no balcão da Nankai em Namba o **高野山・世界遺産きっぷ (Kōyasan World Heritage Ticket)**: ida e volta Namba–Kōyasan, o funicular e **dois dias de ônibus ilimitado na montanha**, tudo junto. Desde abril de 2026 só existe **em papel**, por **¥4.210** por pessoa (uns **¥5.200** com o assento do especial こうや na ida); a versão digital com QR deixou de ser vendida. **No Google Maps, o destino é 高野山駅** (e partida 南海なんば駅): "Koyasan" sozinho cai num bairro chamado Takayama, perto de Nara.',
          'O 特急こうや tem poucas partidas por dia e exige assento reservado. Se perderem, o **快速急行 (rapid express)** faz o mesmo trajeto em dez minutos a mais, sem reserva e sem custo extra — só confiram no painel se o trem vai até Gokurakubashi ou se é preciso trocar em Hashimoto.',
          'A partir de Hashimoto o trem vira um brinquedo: duas carruagens numa linha de bitola estreita subindo uma garganta, com curvas tão fechadas que dá para ver a própria locomotiva pela janela. No fim, em Gokurakubashi, vocês trocam para o **funicular** — 5 minutos numa rampa de 30 graus — e depois um ônibus até a rua principal. Não se pode ir a pé do funicular à cidade: a estrada é proibida para pedestres.',
        ],
        mapQuery: 'Nankai Namba Station',
      },
      {
        id: 'd26-checkin-shukubo',
        time: '13:45',
        timeLabel: 'templo',
        kind: 'hotel',
        name: 'Chegada ao Fumon-in: mochila na recepção, check-in às 15:00',
        jp: '宿坊',
        facts: 'Fumon-in (普門院) · check-in **15:00–16:30** · **antes, ou logo depois: check-in do tour no TAIRA (13:00–17:00)** · jantar **17:30** e café **incluídos** · check-out **9:00** · banho 16:30–21:30 · quarto de tatame',
        paragraphs: [
          '**Chegando antes das 15:00:** peçam para deixar a mochila — *チェックインまで荷物を預かってもらえますか？* (Chekku-in made nimotsu o azukatte moraemasu ka?). Até as 15:00, deem uma volta sem peso: a rua principal tem casas de chá e lojas de *goma-dōfu*, e o **Garan** (o pagode vermelho Konpon Daitō) fica a ~10 min a pé — se forem hoje, amanhã cedo sobra tempo. Às 15:00, check-in, e daí até o jantar das 17:30 é **descanso**: quarto, chá e o banho comunitário. Um shukubō não é hotel: é a hospedaria de um templo em funcionamento, e vocês entram no horário da casa. Tirem os sapatos na entrada, recebam o chá, e é isso. Os horários da casa estão no aviso **Fumon-in: horários e regras**, no topo do dia. Vale ver com luz o **jardim**, desenhado por **Kobori Enshū** (o mestre do chá do século XVII), dito o mais bonito de Kōyasan, e o **teto do salão principal**, com o brasão dos Tokugawa: o salão é um mausoléu dos Tokugawa reaproveitado depois do incêndio de 1888, por isso lembra o Tōshōgū de Nikkō.',
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
        facts: '**Reservado: Awesome Tours** · **check-in no TAIRA das 13:00 às 17:00** (fecha 17:00–18:30) · **saiam do Fumon-in às ~18:40 pela portinha dos fundos**, para o ponto escrito no Tour Pass · saída **19:00–19:15**, ~90 min, termina ~20:45 · **voltem direto: o templo fecha às 21:00** · lanterna e flash proibidos',
        paragraphs: [
          'Se vocês fizerem uma coisa só em Kōyasan, é esta. O caminho tem lanternas de pedra acesas de ponta a ponta, a neblina desce entre os cedros e não há mais ninguém. É completamente diferente do mesmo caminho de dia.',
          'O tour noturno é o do **Ekō-in** — onde a Priscila ficou da outra vez — mas quem opera é a AWESOME TOURS, e a reserva é à parte, no site deles (night.koyasan-okunoin.com), inclusive para hóspede do próprio Ekō-in. **Qualquer templo serve** (só Renge-in e Sainan-in não podem, pelo horário do jantar). O ponto de encontro é o balcão dentro do café **TAIRA**, colado ao Ekō-in; o jantar das 17:30 termina lá pelas 18:30, dá tempo. Vale muito: o guia conta quem está enterrado em cada canto, e isso é metade do lugar.',
          'Por conta própria também funciona. Levem lanterna, casaco pesado e paciência para o frio. E não saiam do caminho principal.',
        ],
        mapQuery: '大楽 TAIRA 高野山',
      },
    ],
  },
];
