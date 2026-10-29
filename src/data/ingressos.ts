/**
 * O que precisa de reserva ou ingresso antecipado, o que só convém comprar
 * antes, e o que é chegar e entrar. Conferido em setembro de 2026 nos sites
 * oficiais e em guias recentes; regras de pico de outono mudam de ano para
 * ano, então a coluna "quando" é a que importa.
 */
export type IngressoStatus = 'obrigatorio' | 'recomendado' | 'na-hora' | 'chegar-cedo' | 'livre';

export interface Ingresso {
  id: string;
  title: string;
  jp?: string;
  status: IngressoStatus;
  /** data do roteiro */
  date: string;
  /** o que fazer, em uma frase */
  action: string;
  /** quando abrir/comprar, em texto */
  when?: string;
  /** o instante exato em que a venda abre (ISO com fuso), para a contagem na tela Agora */
  opensAt?: string;
  /** item da checklist pré-viagem que marca isto como resolvido */
  checklistItemId?: string;
  /** onde comprar (nome do site/app) */
  where?: string;
  url?: string;
  cost?: string;
  note?: string;
  stopId?: string;
}

export const STATUS_LABEL: Record<IngressoStatus, string> = {
  obrigatorio: 'Reserva obrigatória',
  recomendado: 'Vale reservar',
  'na-hora': 'Compre na hora',
  'chegar-cedo': 'Sem reserva · chegar cedo',
  livre: 'Chegar e entrar',
};

export const INGRESSOS: Ingresso[] = [
  // ── transporte e logística ──
  {
    id: 'shinkansen-hiroshima',
    checklistItemId: 'reserva-shinkansen',
    title: 'Shinkansen Tóquio → Hiroshima',
    jp: 'のぞみ',
    status: 'recomendado',
    date: '2026-11-23',
    action: 'Vale reservar o Nozomi das ~07:00: 23/11 é feriado e, segundo guias de viagem, de 21 a 23/11 todos os Nozomi têm só assento reservado. **Pelo Smart EX dá para mudar o horário de graça até poucos minutos antes da partida** (cancelar custa ¥320), então reservar cedo quase não tira flexibilidade.',
    when: 'A venda já está aberta (abriu em 23/10). Até 17/11, ou no balcão JR entre 18 e 22/11, com o risco de o horário preferido já ter acabado',
    where: 'SmartEX (app, cartão internacional) ou guichê JR',
    url: 'https://smart-ex.jp/en/',
    cost: '¥19.800 por pessoa',
    note: 'Assentos do lado direito (fileiras D/E) para o Fuji. Malas grandes vão de takuhaibin; se levassem mala de 160 cm+ precisariam do assento especial.',
    stopId: 'd23-trem-hiroshima',
  },
  {
    id: 'shinkansen-tokyo',
    title: 'Shinkansen Kyoto → Tóquio',
    jp: 'のぞみ',
    status: 'na-hora',
    date: '2026-12-01',
    action: 'Não precisa reservar agora. 1/12 é terça comum: o Nozomi tem carros sem reserva e o balcão vende até minutos antes. Reservem só se fizerem questão do lado do Fuji (assentos A ou B), e aí o Nozomi das 13:20.',
    when: 'Na hora, no balcão ou no Smart EX. Se reservarem antes, a troca de horário é grátis até poucos minutos antes da partida',
    where: 'SmartEX',
    url: 'https://smart-ex.jp/en/',
    cost: '¥14.200 por pessoa',
    stopId: 'd01-shinkansen',
  },
  {
    id: 'shinkansen-kansai',
    title: 'Hiroshima → Okayama → Himeji (dia 25)',
    status: 'na-hora',
    date: '2026-11-25',
    action: 'Compre na hora, na máquina ou no balcão da estação (ou entrem num carro de assento livre). Reservar antes só amarra o horário num dia de três trens.',
    when: 'No dia, na estação',
    where: 'Máquina ou balcão da estação (SmartEX também serve)',
    cost: '~¥6.000 + ~¥3.500',
    stopId: 'd25-trem-kurashiki',
  },
  {
    id: 'koyasan-kippu',
    title: 'Kōyasan World Heritage Ticket',
    jp: '高野山・世界遺産きっぷ',
    status: 'na-hora',
    date: '2026-11-26',
    action: 'Comprar no balcão da Nankai em Namba: ida e volta Namba–Kōyasan, funicular e **2 dias de ônibus ilimitado** na montanha, tudo num bilhete.',
    when: 'No próprio dia, no balcão. A versão digital só é vendida **até as 15:00** — depois disso, só papel no guichê.',
    where: 'Nankai Namba (3º andar) ou o app da Nankai',
    url: 'https://www.nankai.co.jp/traffic/otoku/koyasan.html',
    cost: '¥3.980 digital · ¥4.210 papel · ¥4.910 com o assento do 特急こうや na ida',
    note: 'Sem ele vocês pagam ônibus avulso o tempo todo lá em cima, e o ônibus é obrigatório: é proibido ir a pé da estação do funicular até a cidade.',
    stopId: 'd26-nankai',
  },
  {
    id: 'koyasan-tour-noturno',
    checklistItemId: 'reserva-ekoin',
    title: 'Tour noturno do Okunoin — reservado (Awesome Tours)',
    jp: '奥之院ナイトツアー',
    status: 'obrigatorio',
    url: 'https://awesometours.rezio.shop/en-US/product/TFLKTO',
    date: '2026-11-26',
    action: 'Já reservado: voucher RZ260913CQ7084-1, 2 adultos. No dia, **retirar o passe na recepção "Taira" (734 Koyasan) até as 19:00** — sem ele não entra. Lanterna e flash proibidos.',
    when: 'Reservar com antecedência: lota de março a novembro.',
    where: 'Awesome Tours (voucher no app, em Reservas)',
    cost: '~¥2.000–3.000 por pessoa',
    note: 'É o único tour noturno em inglês que existe o ano inteiro em Kōyasan, guiado por um monge. Dura ~90 min. Se preferirem ir sozinhos, o caminho é grátis e aberto 24h — mas o monge conta quem está enterrado em cada canto, e isso é metade do lugar.',
    stopId: 'd26-okunoin-noite',
  },
  {
    id: 'kintetsu-nara',
    title: 'Kintetsu Limited Express Kyoto → Nara',
    jp: '近鉄特急',
    status: 'na-hora',
    date: '2026-11-30',
    action: 'Assento reservado ¥520 além da passagem; compra na máquina da estação na hora ou no site da Kintetsu. Sem reserva, o expresso comum leva 10 min a mais.',
    where: 'Máquina da Kintetsu Kyoto ou kintetsu.co.jp',
    cost: '¥1.280 por pessoa',
    stopId: 'd30-trem-nara',
  },
  {
    id: 'takuhaibin',
    title: 'Takuhaibin das malas (Tóquio → Kyoto, Kyoto → Ginza)',
    jp: '宅急便',
    status: 'obrigatorio',
    date: '2026-11-22',
    action: 'Tóquio → Kyoto: deixar na recepção do Amanek na noite do dia 22 ou ao sair no dia 23, com **entrega marcada para 27/11**, o dia do check-in. Kyoto → Ginza: deixar no Travelodge **na manhã do dia 30**, antes de Nara, para chegar no dia 1º; se ficar para a manhã do dia 1º, chega só no dia 2. Confirmar com os hotéis que aceitam receber.',
    where: 'Recepção do hotel (Yamato/Kuroneko)',
    cost: '~¥2.500 por mala por trecho',
  },
  {
    id: 'suica',
    title: 'Suica ou Welcome Suica',
    status: 'livre',
    date: '2026-11-18',
    action: 'No iPhone: adicionar Suica na Wallet antes de sair do Brasil e carregar com cartão. Android brasileiro não suporta; comprar o cartão físico na máquina de Haneda.',
    note: 'Serve para trens, metrôs, ônibus, bondes, balsa, konbini e máquinas.',
  },

  // ── Tóquio ──
  {
    id: 'skytree',
    title: 'Tokyo Skytree (se for a escolha do dia 2)',
    jp: '東京スカイツリー',
    status: 'recomendado',
    date: '2026-12-02',
    action: 'Comprar online com data e hora: mais barato e sem fila. Tokyo Tower e o Prédio do Governo não precisam de nada.',
    where: 'tokyo-skytree.jp',
    url: 'https://www.tokyo-skytree.jp/en/ticket/',
    cost: '¥2.100–3.100 online',
    stopId: 'd02-ultima-vista',
  },
  {
    id: 'museu-nacional',
    title: 'Museu Nacional de Tóquio',
    jp: '東京国立博物館',
    status: 'livre',
    date: '2026-11-19',
    action: 'Ingresso na porta, sem fila em dia de semana. Só exposições especiais têm horário marcado; a coleção permanente não.',
    cost: '¥1.000',
    stopId: 'd19-museu-nacional',
  },
  {
    id: 'hamarikyu',
    title: 'Jardins Hamarikyū',
    status: 'livre',
    date: '2026-11-21',
    action: 'Bilhete na portaria.',
    cost: '¥300',
    stopId: 'd21-hamarikyu',
  },
  {
    id: 'jins',
    title: 'Óculos na JINS',
    status: 'livre',
    date: '2026-11-19',
    action: 'Sem reserva: exame na hora, retirada em 30–60 min. Levar passaporte para o tax-free.',
    stopId: 'd19-oculos',
  },
  {
    id: 'gachapon',
    title: 'Gashapon Department Store (Ikebukuro)',
    status: 'livre',
    date: '2026-12-01',
    action: 'Entrada livre. Levar moedas de ¥100 ou trocar nas máquinas; muitas aceitam cartão IC.',
    stopId: 'd01-gachapon-ikebukuro',
  },
  {
    id: 'ochanomizu-opcional',
    title: 'A manhã do dia 2 — Kanda Myōjin e Yushima Seidō',
    status: 'livre',
    date: '2026-12-02',
    action: 'Nada a reservar e nada a pagar: os dois são de graça e o pátio do Kanda Myōjin não fecha nunca. É passeio opcional — se acordarem sem pique, o dia começa no curry às 11:00.',
    stopId: 'd02-kanda-myojin',
  },
  {
    id: 'rikugien',
    checklistItemId: 'reserva-rikugien',
    title: 'Rikugien — iluminação de outono',
    jp: '六義園 夜間特別観賞',
    status: 'recomendado',
    date: '2026-12-01',
    action: 'Vale o ingresso antecipado online (¥1.000) para a noite de 1º de dezembro, mas **comprem na véspera ou na manhã do dia, depois de ver a previsão**: ingresso de evento costuma não ser reembolsável. No dia custa ¥1.200, a fila da bilheteria passa de 30 min e o limite diário esgota.',
    when: 'A venda de 2026 ainda não tem data; em 2025 abriu em 1º de novembro às 9:00 (JST). Conferir a página oficial no fim de outubro.',
    where: 'Site dos parques de Tóquio (tokyo-park.or.jp)',
    url: 'https://www.tokyo-park.or.jp/park/rikugien/news/2026/rikugiengardens.html',
    cost: '¥1.000 antecipado · ¥1.200 no dia',
    note: 'Evento de 25/11 a 6/12, 18:00–20:30, última entrada 19:30, entrada pelo portão principal (正門). O ingresso de dia não vale à noite.',
    stopId: 'd01-rikugien',
  },
  {
    id: 'restaurantes-tokyo',
    title: 'Restaurantes de Tóquio no roteiro',
    status: 'chegar-cedo',
    date: '2026-11-19',
    action: 'Kikanbō (Kanda), Afuri, Sushi no Midori, Bondy: não aceitam reserva; a fila anda. Kagari (Ginza) chega a 40 min no almoço. Chegar na abertura ou fora do pico.',
  },

  // ── Kamakura ──
  {
    id: 'kamakura',
    title: 'Templos de Kamakura e o Grande Buda',
    status: 'livre',
    date: '2026-11-20',
    action: 'Todos com bilhete na porta (¥300–500). Enoden com Suica.',
  },

  // ── Hiroshima e Miyajima ──
  {
    id: 'museu-paz',
    checklistItemId: 'reserva-museu-paz',
    title: 'Museu Memorial da Paz',
    jp: '広島平和記念資料館',
    status: 'recomendado',
    date: '2026-11-23',
    action: 'Reservar a entrada das 13:00 online: o museu exige reserva na primeira hora e nos últimos 90 min do dia, e recomenda para o resto porque a fila do guichê passa de 30 min.',
    when: 'Abre 90 dias antes (desde 25 de agosto)',
    where: 'Klook (venda internacional) ou o site do museu',
    url: 'https://hpmmuseum.jp/?lang=eng',
    cost: '¥200',
    stopId: 'd23-museu-paz',
  },
  {
    id: 'miyajima-teleferico',
    title: 'Teleférico do Monte Misen',
    jp: '宮島ロープウエー',
    status: 'na-hora',
    date: '2026-11-24',
    action: 'O teleférico passou a ter reserva online, mas **decidam só depois da previsão da véspera**: vento forte fecha tudo. No pico do momiji a fila sem reserva come o tempo do cume.',
    when: 'Na noite de 23/11, com a previsão na mão',
    where: 'miyajima-rw.info',
    url: 'https://www.miyajima-rw.info/system/web_date_select/index',
    cost: '¥2.000 ida e volta',
    note: 'A manutenção anual de 2026 foi de 16 de janeiro a 6 de março — em novembro ele está operando, com carros novos. Do topo do teleférico ao cume real são mais 30 min de caminhada, e outros 30 de volta.',
    stopId: 'd24-misen',
  },
  {
    id: 'miyajima',
    title: 'Miyajima: balsa, santuário, Daishō-in, teleférico',
    status: 'livre',
    date: '2026-11-24',
    action: 'Balsa com Suica (+¥100 da taxa da ilha, paga na máquina do píer). Santuário ¥300 na porta. Teleférico: bilhete na base, sem reserva; fila de 20–30 min no pico de bordos, por isso o roteiro vai ao meio-dia.',
    note: 'Último teleférico de descida às 17:00 em novembro.',
    stopId: 'd24-misen',
  },
  {
    id: 'okonomiyaki',
    title: 'Nagataya (okonomiyaki)',
    status: 'chegar-cedo',
    date: '2026-11-23',
    action: 'Sem reserva; fila de 30–60 min no jantar. Às 18:00 é menor. Alternativa sem fila: qualquer balcão do Okonomimura.',
    stopId: 'd23-okonomiyaki',
  },

  // ── Kurashiki, Himeji, Osaka ──
  {
    id: 'ohara',
    title: 'Museu Ōhara',
    status: 'livre',
    date: '2026-11-25',
    action: 'Bilhete na porta.',
    cost: '¥2.000',
    stopId: 'd25-ohara',
  },
  {
    id: 'himeji',
    title: 'Castelo de Himeji',
    jp: '姫路城',
    status: 'na-hora',
    date: '2026-11-25',
    action: 'Não precisa antes: o guichê vende no dia. O ingresso digital com horário (entrada 14:00) só pula a fila, que em fins de semana de outono passa de 40 min; numa quarta poupa uns 15.',
    when: 'Abre 90 dias antes; em novembro escolham o horário certo (chegada ~13:55)',
    where: 'himejicastle-ticket.jp (oficial)',
    url: 'https://himejicastle-ticket.jp/',
    cost: '¥2.500 para estrangeiros desde 1º/3/2026 (¥2.600 com o Kōko-en)',
    note: 'Dia 25 é quarta: a fila é menor, mas o QR ainda poupa 15 min. Em dias de lotação o castelo distribui senhas com horário para o torreão.',
    stopId: 'd25-himeji',
  },
  {
    id: 'osaka',
    title: 'Castelo de Osaka',
    status: 'livre',
    date: '2026-11-26',
    action: 'Castelo ¥1.200 na porta (fila de 15 min às 9h, mais tarde 40).',
    stopId: 'd26-castelo-osaka',
  },

  // ── Kyoto e Nara ──
  {
    id: 'torokko',
    opensAt: '2026-10-29T00:00:00+09:00',
    checklistItemId: 'reserva-torokko',
    title: 'Trem Sagano (Torokko) — ida e volta',
    jp: '嵯峨野トロッコ列車',
    status: 'obrigatorio',
    date: '2026-11-29',
    action: 'Dois bilhetes por pessoa: **Sagano 5** (Torokko Arashiyama 11:05 → Kameoka) e **Sagano 6** (Kameoka 11:30 → Torokko Arashiyama). Novembro esgota rápido, e este é o último outono dos vagões atuais.',
    when: 'Abre 29/10 à 0:00 de Tóquio = **28/10 ao meio-dia em Brasília**',
    where: 'site oficial de reservas (ars-saganokanko.triplabo.jp, link na página oficial) · cadastro grátis + cartão',
    url: 'https://www.sagano-kanko.co.jp/en/',
    cost: '¥880 por trecho · ¥3.520 o casal, ida e volta',
    note: 'A venda é **só online**: os guias que falam em "guichê da JR a partir das 10h" estão desatualizados. Dá para escolher vagão e assento — o 5º ("Rich") é o aberto. Cancelamento grátis até a véspera. Se esgotar, sobra a venda do dia na estação (de pé, depois que os sentados acabam).',
    stopId: 'd29-sagano',
  },
  {
    id: 'tofukuji',
    title: 'Tōfuku-ji no pico de novembro',
    jp: '東福寺',
    status: 'chegar-cedo',
    date: '2026-12-01',
    action: 'A visita de dia não exige reserva: ingresso na porta (¥1.000 pela ponte + ¥500 pelos jardins, sem combinado no pico). Só a visita noturna especial (17:30–19:30) é por reserva via JR Tōkai. Cheguem às 8:00 para a abertura das 8:30.',
    note: 'No pico o templo proíbe fotos sobre as pontes e a fila para a Tsūten-kyō passa de 1h depois das 10h.',
    stopId: 'd01-tofukuji',
  },
  {
    id: 'kyoto-templos',
    title: 'Kiyomizu, Kōdai-ji, Ginkaku-ji, Nanzen-ji, Eikan-dō, Kinkaku-ji, Ryōan-ji, Tenryū-ji, Sanjūsangen-dō',
    status: 'livre',
    date: '2026-11-28',
    action: 'Todos com bilhete na porta, ¥400–700. Nenhum aceita reserva para a visita comum.',
  },
  {
    id: 'kitagawa-hanbee',
    checklistItemId: 'reserva-kitagawa',
    title: 'Chá no Gion Kitagawa Hanbee',
    jp: '祇園 北川半兵衛',
    status: 'recomendado',
    date: '2026-11-28',
    action: 'Reservar mesa para sábado 28/11 às 18:00 — a casa aceita reserva por telefone e pelo Hitosara. No fim de semana do momiji, Gion lota e sem reserva se espera por telefone.',
    when: 'Uma ou duas semanas antes; a política de reserva por telefone vale desde 2024',
    where: 'Telefone 075-205-0880 (em japonês; peça ajuda ao hotel de Tóquio) ou Hitosara',
    url: 'https://gion-kitagawahanbee.kyoto/',
    cost: '茶詠み ¥2.900 · parfait de hōjicha ¥2.300',
    note: 'Sábado e domingo ficam abertos até 20:00 (último pedido 19:30); em dia útil fecham às 18:00 — por isso o chá está no sábado.',
    stopId: 'd28-kitagawa',
  },
  {
    id: 'iluminacoes',
    title: 'Iluminações noturnas: Eikan-dō e Kōdai-ji',
    status: 'chegar-cedo',
    date: '2026-11-28',
    action: 'Ingresso separado pago na entrada (Eikan-dō ¥700, 17:30–21:00; Kōdai-ji ¥600, até 22:00). Sem reserva. A fila do Eikan-dō começa às 17:00; cheguem 17:15 ou depois das 19:30.',
    stopId: 'd28-eikando',
  },
  {
    id: 'okochi',
    title: 'Ōkōchi Sansō',
    status: 'livre',
    date: '2026-11-29',
    action: 'Bilhete na porta, com o matcha e o doce incluídos.',
    cost: '¥1.000',
    stopId: 'd29-okochi-sanso',
  },
  {
    id: 'nara',
    title: 'Nara: Tōdai-ji, Kasuga, Kōfuku-ji, Isui-en',
    status: 'livre',
    date: '2026-11-30',
    action: 'Bilhete na porta em todos. Biscoito dos cervos ¥200 nas barracas.',
  },
  {
    id: 'jantares-kyoto',
    title: 'Restaurantes de Kyoto',
    status: 'chegar-cedo',
    date: '2026-11-28',
    action: 'Omen (Ginkaku-ji) e Yoshimura (Arashiyama) não reservam; fila de 20–30 min no almoço. Gion e Pontochō à noite: os bons *kaiseki* pedem reserva por telefone ou pelo hotel; os izakaya não.',
  },

  // ── volta ──
  {
    id: 'voo',
    title: 'Check-in do voo JL7014 / American',
    status: 'obrigatorio',
    date: '2026-12-03',
    action: 'Check-in online abre 24 h antes; escolham assentos na frente para a conexão de 2h15 em Dallas. O reembolso do imposto (sistema novo, desde 1º/11/2026) é feito em Haneda, antes do check-in: as compras vão na mala de mão.',
    stopId: 'd03-voo',
  },
];
