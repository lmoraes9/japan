/**
 * Como fazer cada reserva, passo a passo, com o link de onde reservar.
 *
 * Chaveado pelo id da reserva em reservas.ts. O que vem de fonte oficial ou da
 * confirmação que o Leonardo recebeu está dito com certeza; onde as fontes
 * divergem (QR ou cartão IC no Smart EX, canal do Kyūbey) o passo diz para
 * conferir a tela — é melhor um passo honesto do que um passo errado.
 *
 * `abreEm` e `ate` alimentam a contagem e a ordenação por urgência na tela de
 * Reservas. `checklistItemId` faz o "feito" da reserva marcar o item da
 * checklist junto.
 */

export interface LinkReserva {
  label: string;
  url: string;
  nota?: string;
}

/** uma frase para dizer ao telefone, com a leitura em letras latinas */
export interface FraseTelefone {
  jp: string;
  leitura: string;
}

export interface GuiaReserva {
  /** o que se reserva, numa frase */
  oQue: string;
  /** quando abre e até quando vale a pena, em texto */
  quando: string;
  /** início da venda, ISO com fuso — some a contagem quando passa */
  abreEm?: string;
  /** prazo recomendado, ISO com fuso */
  ate?: string;
  custo?: string;
  passos: string[];
  /** o primeiro é o botão "Reservar agora" */
  links: LinkReserva[];
  /** quando a reserva é por telefone em japonês */
  telefone?: { numero: string; frases: FraseTelefone[]; contato?: string };
  /** se o plano A falhar */
  planoB?: string;
  /** o que guardar (e anexar aqui) depois de reservar */
  depois: string;
  cuidado?: string;
  /** item da checklist que este "feito" também marca */
  checklistItemId?: string;
}

/** Quais reservas fecham cada item da checklist: o item só marca quando todas estão feitas */
export const CHECKLIST_DAS_RESERVAS: Record<string, string[]> = {
  'reserva-shinkansen': ['trem-nozomi-hiroshima', 'trem-nozomi-tokyo'],
  'reserva-torokko': ['ingresso-torokko'],
  'reserva-omakase': ['mesa-omakase'],
  'reserva-museu-paz': ['ingresso-museu-paz'],
  'reserva-himeji': ['ingresso-himeji'],
  'reserva-rikugien': ['ingresso-rikugien'],
  'reserva-kitagawa': ['mesa-kitagawa'],
  'reserva-torisei': ['mesa-torisei'],
};

/** o inverso: dado o item da checklist, qual reserva abre o guia */
export const RESERVA_DO_CHECKLIST: Record<string, string> = Object.fromEntries(
  Object.entries(CHECKLIST_DAS_RESERVAS).map(([item, ids]) => [item, ids[0]]),
);

const SMART_EX_PASSOS_BASE = [
  'Baixem o app **Smart EX** (iPhone e Android) ou abram o site, e **criem a conta** — e-mail e senha bastam. Cada um dos dois pode ter a sua, ou uma só reserva os dois lugares.',
  'Cadastrem o **cartão de crédito**: Visa, Mastercard, JCB, Amex e Diners funcionam. O cadastro pode pedir a verificação 3D Secure do banco, então deixem o app do banco à mão. Se um cartão for recusado no cadastro, tentem o outro: acontece com cartões estrangeiros mesmo quando o banco diz que está tudo certo.',
];

export const GUIAS: Record<string, GuiaReserva> = {
  // ── trens ──────────────────────────────────────────────────────────
  'trem-nozomi-hiroshima': {
    oQue: 'Dois assentos reservados no Nozomi das ~07:00, Tóquio → Hiroshima, dia 23/11.',
    quando: 'A venda abriu em **23/10 às 10:00 (Tóquio)**. É feriado nacional (Labor Thanksgiving): no fim de semana prolongado **todos os Nozomi são só de assento reservado** — sem reserva não há "vagão livre" para entrar.',
    abreEm: '2026-10-23T10:00:00+09:00',
    ate: '2026-11-10T23:59:00-03:00',
    custo: 'cerca de ¥19.800 por pessoa',
    passos: [
      ...SMART_EX_PASSOS_BASE,
      'Em **Reservar**, escolham **Tóquio → Hiroshima**, **23/11**, 2 adultos, e o **Nozomi que sai por volta das 07:00**. Sem Japan Rail Pass, a passagem é a tarifa comum com assento reservado.',
      'No mapa de assentos, peçam as fileiras **D e E** do lado direito: é o lado do **Monte Fuji**, uns 40 minutos depois da saída.',
      'Confirmem o pagamento. A tela de confirmação mostra **como entrar na catraca**: com o cartão IC cadastrado (Suica) ou com um **QR**, e as fontes divergem sobre qual vale para estrangeiro — vale o que o app mostrar. **Tirem um print.**',
    ],
    links: [
      { label: 'Smart EX (site oficial)', url: 'https://smart-ex.jp/en/' },
      { label: 'Guia passo a passo do Smart EX', url: 'https://jr-shinkansen.net/en/articles/smex/', nota: 'com cartão estrangeiro' },
    ],
    planoB: 'Se o cartão não passar no Smart EX: balcão **Midori no Madoguchi** da estação de Shinjuku ou de Tóquio, com os **passaportes**, qualquer dia entre 18 e 22/11. Mesmo trem, mesmo preço, e aceita cartão estrangeiro.',
    depois: 'Anexem o print da confirmação aqui e marquem como feita. Se a entrada for por QR, deixem o print salvo também nas fotos do celular: é o que se mostra na catraca.',
    cuidado: 'O Nozomi sai às 07:00 e o 7-Eleven da estação está marcado para as 06:30: o trem não espera, e sem assento reservado no feriado não há plano B no mesmo horário.',
    checklistItemId: 'reserva-shinkansen',
  },
  'trem-hiroshima-okayama': {
    oQue: 'Os dois trechos curtos de Shinkansen do dia 25: Hiroshima → Okayama (08:20) e depois Okayama → Himeji.',
    quando: 'A venda abre 1 mês antes, às 10:00 (Tóquio): **25/10**. Não é obrigatório — há carros de assento livre (o app indica os carros 1–3) —, mas reservar tira a dúvida num dia de três trens.',
    abreEm: '2026-10-25T10:00:00+09:00',
    custo: 'cerca de ¥6.000 + ¥3.500 por pessoa',
    passos: [
      'No mesmo **Smart EX** da reserva de Tóquio → Hiroshima (ele cobre o Sanyō Shinkansen), escolham **Hiroshima → Okayama**, **25/11**, o trem das **08:20**.',
      'Repitam para **Okayama → Himeji**, no horário que encaixa com o almoço em Kurashiki (o app indica a saída por volta das 12:50).',
      'Ou deixem para comprar no balcão ou na máquina da estação de Hiroshima nos dias 23 ou 24: sai o mesmo preço e dá para escolher o horário vendo a tela.',
    ],
    links: [{ label: 'Smart EX', url: 'https://smart-ex.jp/en/' }],
    depois: 'Print das duas reservas, anexado aqui. Se optarem por assento livre, marquem como feita e escrevam em Observações "assento livre, carros 1–3".',
  },
  'trem-nozomi-tokyo': {
    oQue: 'Dois assentos reservados no Nozomi das 13:20, Kyoto → Tóquio, dia 1/12.',
    quando: 'A venda abre em **1/11 às 10:00 (Tóquio)** = **sábado 31/10 às 22:00 em Brasília**. É um dia útil, mas é o dia da volta a Tóquio: o horário das 13:20 amarra o resto do dia.',
    abreEm: '2026-11-01T10:00:00+09:00',
    ate: '2026-11-20T23:59:00-03:00',
    custo: 'cerca de ¥14.200 por pessoa',
    passos: [
      ...SMART_EX_PASSOS_BASE,
      'Em **Reservar**, escolham **Kyoto → Tóquio**, **1/12**, 2 adultos, o **Nozomi das 13:20**.',
      'Peçam os assentos **A ou B**, do lado **esquerdo**: nesse sentido é o lado do Monte Fuji.',
      'Confirmem e **tirem um print** da tela que mostra como entrar na catraca.',
    ],
    links: [
      { label: 'Smart EX (site oficial)', url: 'https://smart-ex.jp/en/' },
      { label: 'Guia passo a passo do Smart EX', url: 'https://jr-shinkansen.net/en/articles/smex/' },
    ],
    planoB: 'Qualquer balcão JR em Kyoto (Estação de Kyoto, lado Hachijō), com passaporte, até a véspera. Trem de 13:20 ou o seguinte.',
    depois: 'Print anexado aqui, e marquem como feita.',
    cuidado: 'O 13:20 fecha com o Tō-ji (11:15) e o almoço na estação: não troquem por um horário mais cedo.',
    checklistItemId: 'reserva-shinkansen',
  },
  'trem-koyasan': {
    oQue: 'O bilhete da Nankai para Kōyasan: ida e volta Namba–Kōyasan, funicular e 2 dias de ônibus ilimitado na montanha.',
    quando: 'Não esgota. Compra-se **no dia 26/11, antes do trem das 13:20**; a versão digital só é vendida **até as 15:00** do próprio dia, e depois disso só papel no guichê.',
    ate: '2026-11-26T13:00:00+09:00',
    custo: '¥3.980 digital · ¥4.210 papel · ¥4.910 com assento reservado no expresso 特急こうや na ida',
    passos: [
      'Pelo site da Nankai, abram a página do **Koyasan World Heritage Ticket** e escolham **digital** se forem comprar no celular, ou **papel**, no balcão.',
      'Para **sentar** no expresso Kōya na ida (recomendado: são ~1h45 de viagem), escolham a opção com assento, a de ¥4.910, e o horário que sai de Namba **até as 13:30**.',
      'No balcão: a bilheteria da Nankai em **Namba** fica no 3º andar da estação; levem os passaportes.',
      'Guardem o bilhete, que também vale o **ônibus de Kōyasan** nos dois dias — é ele que paga o ônibus até o Fumon-in e o do dia 27 de volta.',
    ],
    links: [{ label: 'Nankai — Koyasan World Heritage Ticket', url: 'https://www.nankai.co.jp/traffic/otoku/koyasan.html' }],
    depois: 'O bilhete digital: print da confirmação, anexada aqui. O de papel: foto dos dois lados, que é o que mostram ao ônibus.',
    cuidado: 'O ônibus em Kōyasan é obrigatório: a estação do funicular fica longe da vila, e ir a pé não é permitido. Sem o bilhete, vocês pagam avulso a cada viagem.',
  },

  // ── ingressos ──────────────────────────────────────────────────────
  'ingresso-torokko': {
    oQue: 'Dois trechos do trem panorâmico de Sagano, por pessoa: **Sagano 5** (Torokko Arashiyama 11:05 → Kameoka) e **Sagano 6** (Kameoka 11:30 → Torokko Arashiyama), dia 29/11.',
    quando: 'A venda abre **29/10 à 0:00 de Tóquio, ou seja, hoje, 28/10, ao meio-dia em Brasília**. É um mês antes, na mesma data. Novembro esgota rápido, e este é o último outono dos vagões atuais.',
    abreEm: '2026-10-29T00:00:00+09:00',
    ate: '2026-11-15T23:59:00-03:00',
    custo: '¥880 por trecho por pessoa — ¥3.520 o casal, ida e volta',
    passos: [
      'Abram o **site oficial da Sagano Scenic Railway** e, na página de bilhetes, sigam o link para o **sistema de reservas online** (ele fica em outro endereço). A venda é **só online**: os guias que falam em guichê da JR desde as 10h estão desatualizados.',
      '**Criem a conta** (grátis) antes das 12:00 de Brasília, com o cartão já cadastrado: na hora da abertura quem perde 5 minutos perde o vagão.',
      'Escolham **29/11**, o trem **Sagano 5** das **11:05**, 2 adultos, e depois o **Sagano 6** de volta, saindo de Kameoka às 11:30. Se a ida estiver lotada, a volta de Kameoka costuma ter lugar: peguem o que der e ajustem.',
      'No mapa de vagões, o **5º ("Rich") é o aberto**: a vista é melhor, mas molha com chuva e é frio em fim de novembro. Os vagões 1 a 4 são fechados. Reservem o 5 e decidam na noite do dia 28 — o **cancelamento é grátis até a véspera**.',
      'Paguem. O ingresso é um **QR no celular**: tirem print.',
    ],
    links: [
      { label: 'Sagano Scenic Railway — site oficial (reserva)', url: 'https://www.sagano-kanko.co.jp/en/' },
      { label: 'Perguntas frequentes da venda', url: 'https://www.sagano-kanko.co.jp/en/faq/', nota: 'abertura à meia-noite, 1 mês antes' },
    ],
    planoB: 'Se esgotar: a venda do dia nos guichês das estações **Saga, Arashiyama e Kameoka** (não em Hozukyō), em pé, depois que os sentados acabam. Ou pular: o resto do dia 29 não depende dele.',
    depois: 'Os dois QR (ida e volta) anexados aqui, e marquem como feita.',
    cuidado: 'A abertura é às 0:00 do Japão, que é **meio-dia de Brasília em 28/10**. Se já passou, tentem agora mesmo: a primeira hora leva os melhores vagões, mas raramente tudo.',
    checklistItemId: 'reserva-torokko',
  },
  'ingresso-museu-paz': {
    oQue: 'A entrada do Museu Memorial da Paz de Hiroshima, às 13:00 do dia 23/11.',
    quando: 'A venda abre 90 dias antes e já está aberta desde 25/8. O museu exige reserva **na primeira hora** e **nos últimos 90 minutos** do dia, e recomenda para o resto: a fila do guichê passa de 30 min.',
    abreEm: '2026-08-25T00:00:00+09:00',
    ate: '2026-11-15T23:59:00-03:00',
    custo: '¥200 por pessoa',
    passos: [
      'Abram o **site do museu** (inglês) ou o **Klook**, que vende o ingresso para estrangeiros.',
      'Escolham **23/11**, a entrada das **13:00**, 2 adultos.',
      'Paguem. O ingresso vem por e-mail com um **QR**: tirem print.',
    ],
    links: [
      { label: 'Museu Memorial da Paz — site oficial', url: 'https://hpmmuseum.jp/?lang=eng' },
    ],
    depois: 'Print do QR anexado aqui.',
    cuidado: 'Às 13:00 em ponto: o Shinkansen chega às 11:05 e o check-in no hotel da estação cabe no meio.',
    checklistItemId: 'reserva-museu-paz',
  },
  'ingresso-himeji': {
    oQue: 'O ingresso digital do Castelo de Himeji, com horário de entrada às 14:00, dia 25/11.',
    quando: 'A venda abre 90 dias antes e já está aberta desde 27/8. Não há reserva obrigatória; o QR online evita a fila do guichê, que em fins de semana de outono passa de 40 min. O dia 25 é quarta: a fila é menor, mas o QR ainda poupa uns 15 min.',
    abreEm: '2026-08-27T00:00:00+09:00',
    ate: '2026-11-15T23:59:00-03:00',
    custo: '¥2.500 por pessoa para estrangeiros desde 1/3/2026 · ¥2.600 com o Kōko-en',
    passos: [
      'Abram o **site oficial de venda** do castelo (inglês).',
      'Escolham **25/11**, o horário de entrada **~14:00** (a chegada é às 13:55) e 2 ingressos.',
      'Paguem. O ingresso é um **QR** que entra direto: tirem print.',
    ],
    links: [{ label: 'Himeji Castle — ingressos oficiais', url: 'https://himejicastle-ticket.jp/' }],
    depois: 'Print do QR anexado aqui.',
    cuidado: 'Em dias de lotação o castelo distribui senhas com horário para o torreão. O horário do ingresso é de entrada no recinto, não no torreão.',
    checklistItemId: 'reserva-himeji',
  },
  'ingresso-rikugien': {
    oQue: 'O ingresso antecipado do Rikugien iluminado, noite de 1/12 (evento de 25/11 a 6/12, 18:00–20:30, última entrada 19:30).',
    quando: 'A venda de 2026 **ainda não tinha data** na última conferência; em 2025 abriu em **1º de novembro às 9:00 (Tóquio)**. Conferir a página oficial **agora, no fim de outubro**. No dia custa ¥1.200, a fila passa de 30 min e o limite diário esgota.',
    abreEm: '2026-11-01T09:00:00+09:00',
    ate: '2026-11-25T23:59:00-03:00',
    custo: '¥1.000 antecipado · ¥1.200 no dia',
    passos: [
      'Abram a **página oficial dos parques de Tóquio** do Rikugien e procurem o aviso da iluminação de 2026: o link de compra aparece ali quando a venda abre.',
      'Escolham **1/12** e o horário de entrada em torno de **18:30**, 2 ingressos.',
      'Paguem, e tirem print do QR. A entrada é pelo **portão principal (正門)**, e o ingresso de dia **não vale à noite**.',
    ],
    links: [
      { label: 'Rikugien — iluminação de 2026 (parques de Tóquio)', url: 'https://www.tokyo-park.or.jp/park/rikugien/news/2026/rikugiengardens.html' },
      { label: 'Rikugien — página do parque', url: 'https://www.tokyo-park.or.jp/park/rikugien/new' },
    ],
    planoB: 'Sem ingresso antecipado, a bilheteria vende no dia (¥1.200), com fila. Chuva forte é razão para trocar a noite pelo Gashapon de Ikebukuro, que é a parada seguinte.',
    depois: 'Print do QR anexado aqui.',
    cuidado: 'Ingresso de evento costuma não ser reembolsável: comprem só quando a previsão da véspera não for de chuva forte.',
    checklistItemId: 'reserva-rikugien',
  },
  'ingresso-miyajima-teleferico': {
    oQue: 'O horário de subida do teleférico do Monte Misen, em Miyajima, dia 24/11 (por volta das 12:00).',
    quando: 'O teleférico passou a ter reserva online. No pico do momiji a fila sem reserva come o tempo do cume. **Decidam depois da previsão da véspera**: vento forte fecha o teleférico.',
    ate: '2026-11-23T20:00:00+09:00',
    custo: '¥2.000 ida e volta por pessoa',
    passos: [
      'Abram o **site do teleférico** e a página de **reserva de data e horário**.',
      'Escolham **24/11**, a subida das **~12:00** (o app planeja o cume depois do Parque Momijidani), e 2 pessoas.',
      'Tirem print do código. O Misen também depende do tempo: se a previsão for de chuva ou vento forte, não reservem e usem o plano de chuva do dia.',
    ],
    links: [{ label: 'Miyajima Ropeway — reserva online', url: 'https://www.miyajima-rw.info/system/web_date_select/index' }],
    depois: 'Print anexado aqui, se reservarem.',
    cuidado: 'Do topo do teleférico ao cume real são mais 30 min de caminhada, e outros 30 de volta. Planejem 1h30 só para o cume.',
  },

  // ── mesas ──────────────────────────────────────────────────────────
  'mesa-omakase': {
    oQue: 'Uma mesa para dois no jantar de despedida, quarta 2/12, ~19:30: omakase de balcão em Ginza ou arredores.',
    quando: 'O prazo recomendado de 18/10 **já passou**, mas ainda dá para o **Sushi Azabu** (que reserva online) e quase nunca para o Kyūbey de última hora. Quanto antes, melhor.',
    ate: '2026-10-18T23:59:00-03:00',
    custo: 'Azabu ~¥9.800 · Kyūbey ~¥20.000 por pessoa',
    passos: [
      '**Opção mais fácil — Sushi Azabu**, Azabudai Hills, 3º andar: omakase de ~17 peças por ~¥9.800 no jantar, com peixe de Toyosu. A reserva é pelo **TableCheck** (o site da casa tem o link). Procurem "Sushi Azabu TableCheck", escolham **2/12**, **2 pessoas**, jantar, e confirmem.',
      '**Opção clássica — Kyūbey Ginza**, omakase de balcão desde 1935: o telefone da casa é **+81 3-3571-6523**, atendido em japonês. A casa orienta a reservar pelo **concierge do hotel** ou por um site de reservas, e há serviços em inglês que reservam por vocês (guia abaixo).',
      '**O hotel de Ginza não ajuda:** a confirmação do Sotetsu Fresa Inn diz que ele **não organiza reservas externas** de restaurante. Até 23/11 vocês estão no Amanek, em Shinjuku: perguntem lá na recepção se ligam para vocês.',
      'Para dar contato ao restaurante, usem o telefone do hotel: **+81 3 3538 3397** (Sotetsu Fresa Inn Ginza Sanchome).',
    ],
    links: [
      { label: 'Sushi Azabu — reserva (procurar TableCheck)', url: 'https://www.google.com/search?q=Sushi+Azabu+Azabudai+Hills+TableCheck', nota: 'o site da casa leva ao TableCheck' },
      { label: 'Como reservar o Kyūbey (guia em inglês)', url: 'https://omakaseje.com/articles/ie345056' },
      { label: 'Kyūbey Ginza — página oficial', url: 'https://www.kyubey.jp/en/shoplist/ginza/' },
      { label: 'Sushi Ginza Onodera — site', url: 'https://www.sushionodera.com/' },
    ],
    telefone: {
      numero: '+81 3-3571-6523',
      contato: 'Kyūbey Ginza. O horário comercial do Japão (10h–18h) cai entre 22h e 6h em Brasília: liguem de madrugada, ou peçam a alguém de confiança no Japão.',
      frases: [
        { jp: '予約をお願いします。十二月二日、水曜日の十九時半、二名です。', leitura: 'Yoyaku o onegaishimasu. Jūnigatsu futsuka, suiyōbi no jūkyū-ji han, ni-mei desu.' },
        { jp: 'お名前はウェルネックです。', leitura: 'Onamae wa Werunekku desu.' },
        { jp: 'ホテルの電話番号は 03-3538-3397 です。', leitura: 'Hoteru no denwa bangō wa zero-san, san-go-san-hachi, san-san-kyū-nana desu.' },
      ],
    },
    planoB: 'Se não conseguirem nenhuma das duas, o **Sushi no Midori Umegaoka** de Ginza não pede reserva (só senha eletrônica) e o jantar sai por ~¥3.000. É o plano que sempre funciona.',
    depois: 'Print do e-mail do TableCheck, ou escrevam em Observações "Kyūbey, 2/12 19:30, em nome de Werneck". Marquem como feita.',
    checklistItemId: 'reserva-omakase',
  },
  'mesa-kitagawa': {
    oQue: 'Uma mesa para o chá no Gion Kitagawa Hanbee, sábado 28/11, às 18:00.',
    quando: 'Uma ou duas semanas antes. Em fim de semana de momiji Gion lota e sem reserva espera-se por telefone. Sábado e domingo ficam abertos até 20:00 (último pedido 19:30); em dia útil fecham às 18:00 — por isso o chá está no sábado.',
    ate: '2026-11-20T23:59:00-03:00',
    custo: '茶詠み ¥2.900 · parfait de hōjicha ¥2.300',
    passos: [
      'Ligar para **075-205-0880**, em japonês, ou reservar pelo **Hitosara**, que tem a casa listada. O telefone atende em horário comercial do Japão.',
      'Quem não fala japonês: o prazo (20/11) vence antes de vocês chegarem a Kyoto, então peçam à recepção do **Amanek**, em Shinjuku, para ligar. Se passar do prazo, a recepção do Travelodge (que atende em inglês) ainda pode tentar uma mesa de última hora.',
      'Peçam a mesa para **2 pessoas, sábado 28/11, às 18:00**, e o curso do chá (茶詠み).',
    ],
    links: [
      { label: 'Gion Kitagawa Hanbee — site', url: 'https://gion-kitagawahanbee.kyoto/' },
    ],
    telefone: {
      numero: '075-205-0880',
      frases: [
        { jp: '十一月二十八日、土曜日の十八時、二名で予約をお願いします。', leitura: 'Jūichigatsu nijūhachi-nichi, doyōbi no jūhachi-ji, ni-mei de yoyaku o onegaishimasu.' },
        { jp: '茶詠みのコースを希望します。名前はウェルネックです。', leitura: 'Chayomi no kōsu o kibō shimasu. Namae wa Werunekku desu.' },
      ],
    },
    depois: 'Escrevam em Observações o nome da pessoa que atendeu e o horário confirmado.',
    checklistItemId: 'reserva-kitagawa',
  },
  'mesa-torisei': {
    oQue: 'Uma mesa para o jantar no Torisei, em Fushimi, sexta 27/11, por volta das 18:30.',
    quando: 'Até 13/11. **Sem reserva, a fila é de 1 a 2 horas** — e vocês chegam de Fushimi Inari ao entardecer.',
    ate: '2026-11-13T23:59:00-03:00',
    passos: [
      'Ligar para **075-622-5533**, em japonês, no horário comercial do Japão.',
      'Quem não fala japonês: peçam ajuda à recepção do hotel de Tóquio (o Amanek, antes de 23/11), ou usem a frase abaixo — o atendente repete o horário se não entender.',
      'Peçam **2 pessoas, sexta 27/11, ~18:30**.',
    ],
    links: [{ label: 'Torisei — procurar no mapa', url: 'https://www.google.com/maps/search/?api=1&query=Torisei+Honten+Fushimi+Kyoto' }],
    telefone: {
      numero: '075-622-5533',
      frases: [
        { jp: '十一月二十七日、金曜日の十八時半、二名で予約をお願いします。', leitura: 'Jūichigatsu nijūshichi-nichi, kin\'yōbi no jūhachi-ji han, ni-mei de yoyaku o onegaishimasu.' },
        { jp: '名前はウェルネックです。', leitura: 'Namae wa Werunekku desu.' },
      ],
    },
    planoB: 'Chegar quando a casa abre, com a fila ainda curta, ou trocar por outro izakaya de Fushimi do catálogo (Kizakura Kappa Country ou a galeria Ōtesuji), que lotam menos.',
    depois: 'Escrevam o horário confirmado em Observações.',
    checklistItemId: 'reserva-torisei',
  },
};
