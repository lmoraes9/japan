import type { Stage, TripEvent } from './types';

export const TRIP = {
  title: 'Japão 2026',
  subtitle: '18 nov – 3 dez · 15 noites · Priscila & Leonardo',
  /** primeiro dia em solo japonês */
  start: '2026-11-18',
  /** dia do voo de volta */
  end: '2026-12-03',
  departureFromBrazil: '2026-11-16T22:50:00-03:00',
  arrivalInBrazil: '2026-12-04T08:30:00-03:00',
} as const;

export const STAGES: Stage[] = [
  {
    id: 'tokyo1',
    name: 'Tóquio',
    jp: '東京',
    start: '2026-11-18',
    end: '2026-11-23',
    nights: 5,
    color: '#16324A',
    hotelHint:
      'Shinjuku. Melhor nó de transporte do país, comida a qualquer hora, e vocês têm o oeste da cidade na porta.',
    intro: [
      'Até 1590 isto aqui era Edo — um vilarejo de pescadores num pântano de estuário, com um castelo em ruínas. Naquele ano Tokugawa Ieyasu foi mandado para cá quase como exílio disfarçado. Ele drenou o pântano, cavou canais em espiral ao redor do castelo e, treze anos depois, ao virar xogum, transformou o vilarejo na capital de facto do Japão — enquanto o imperador continuava em Kyoto, decorativo, por mais 265 anos.',
      'Edo cresceu até ser, por volta de 1720, provavelmente **a maior cidade do mundo**: um milhão de habitantes numa cidade de madeira e papel que pegava fogo com tanta regularidade que os incêndios ganharam apelido — "as flores de Edo". Em 1868 o imperador mudou-se para cá e a cidade foi rebatizada Tō-kyō, "capital do leste". Depois ela foi destruída duas vezes em 22 anos: pelo terremoto de 1923 e pelos bombardeios incendiários de 1945.',
      'É por isso que Tóquio não tem centro histórico. O passado dela não está em fachadas — está em traçados de rua, nomes de bairro e em uns poucos lugares teimosos que foram reconstruídos exatamente onde estavam. O roteiro vai atrás desses lugares.',
    ],
  },
  {
    id: 'hiroshima',
    name: 'Hiroshima & Miyajima',
    jp: '広島',
    start: '2026-11-23',
    end: '2026-11-25',
    nights: 2,
    color: '#A3322A',
    hotelHint:
      'Entre a estação e Hondori/Kamiyachō. O bonde de Hiroshima é o maior sistema de bonde do Japão.',
    intro: [
      'A cidade nasceu em 1589, quando o senhor da guerra Mōri Terumoto escolheu o delta de seis braços do rio Ōta para construir um castelo. O nome quer dizer "ilha larga" — é isso que o lugar é, literalmente: um punhado de ilhas fluviais. Foi cidade-castelo, depois porto militar, depois quartel-general do exército imperial na guerra sino-japonesa.',
      'Foi exatamente essa concentração militar, somada ao relevo plano e ao fato de a cidade não ter sido bombardeada antes (o que permitiria medir o efeito com precisão), que a colocou no topo da lista de alvos. Em **6 de agosto de 1945, às 8h15**, a bomba explodiu a 600 metros de altitude, quase na vertical acima do que hoje é o Domo. Cerca de 80.000 pessoas morreram na hora; até o fim do ano, aproximadamente 140.000.',
      'Havia previsão de que nada cresceria ali por setenta anos. Na primavera seguinte, os oleandros floresceram — e viraram a flor oficial da cidade. Hiroshima hoje é uma cidade grande, alegre, com bonde, time de beisebol adorado e a melhor okonomiyaki do Japão. As duas coisas coexistem, e é isso que impressiona.',
    ],
  },
  {
    id: 'osaka',
    name: 'Kurashiki, Himeji & Osaka',
    jp: '大阪',
    start: '2026-11-25',
    end: '2026-11-27',
    nights: 2,
    color: '#B9861A',
    intro: [
      'Osaka foi, por séculos, **a cozinha do Japão** — *tenka no daidokoro*. No período Edo, cada domínio feudal do país mantinha aqui um armazém para converter o arroz dos impostos em dinheiro; a bolsa de arroz de Dōjima, fundada em 1697, é considerada **o primeiro mercado futuro organizado do mundo**, com contratos a termo padronizados um século antes de Chicago.',
      'Isso produziu uma cidade de comerciantes, não de samurais. Enquanto Kyoto tinha etiqueta e Edo tinha hierarquia, Osaka tinha preço. Até a saudação tradicional daqui é comercial: *mōkarimakka?* — "está lucrando?". A resposta certa é *bochi bochi denna*, "mais ou menos, vamos indo". O sotaque, o humor e a comida de rua vêm todos daí.',
    ],
  },
  {
    id: 'kyoto',
    name: 'Kyoto & Nara',
    jp: '京都',
    start: '2026-11-27',
    end: '2026-12-01',
    nights: 4,
    color: '#4F6349',
    hotelHint:
      'Perto da Estação de Kyoto (prático para o Shinkansen e ônibus) ou em Karasuma/Shijō (centro, a pé do Nishiki e de Gion). Em novembro, hotel em Kyoto lota e encarece muito.',
    intro: [
      'Em 794 o imperador Kanmu mudou a capital para cá e chamou o lugar de **Heian-kyō**, "capital da paz e tranquilidade". Ele estava fugindo de Nara, onde os mosteiros budistas tinham ficado tão poderosos que praticamente controlavam a corte. A cidade nova foi desenhada em grade retangular copiada de Chang\'an, a capital chinesa dos Tang — e essa grade ainda é a razão pela qual as ruas de Kyoto são retas e numeradas até hoje.',
      'Kyoto foi capital por **1.074 anos**, até 1868. Nesse tempo ela sobreviveu a incêndios recorrentes, à Guerra Ōnin (1467–77), que destruiu boa parte da cidade e desencadeou um século de guerra civil, e ao esvaziamento humilhante de 1868, quando o imperador foi para Tóquio e levou a corte junto.',
      'E sobreviveu a 1945. Kyoto estava na lista de alvos da bomba atômica — era, tecnicamente, o alvo **preferencial**, por ser intacta e grande o bastante para medir o efeito. Foi riscada da lista por decisão pessoal do secretário de Guerra americano Henry Stimson, que a conhecia. É por isso que existem 1.600 templos de pé aqui e nenhum em Hiroshima.',
    ],
  },
  {
    id: 'tokyo2',
    name: 'Tóquio, o fecho',
    jp: '東京',
    start: '2026-12-01',
    end: '2026-12-03',
    nights: 2,
    color: '#2E6F8E',
    hotelHint:
      'Ginza, Yaesu ou Nihonbashi. Fica a 30 minutos de Haneda, a pé das lojas que interessam, e permite sair tarde no dia 3.',
  },
];

export const FLIGHTS = [
  {
    leg: 'GRU → JFK',
    flight: 'JL5501',
    operator: 'op. Latam',
    detail: '16/11 22:50 → 17/11 06:40 · T3 → T4 · 9h50',
  },
  {
    leg: 'JFK → HND',
    flight: 'JL005',
    operator: 'op. JAL A350',
    detail: '17/11 12:40 → 18/11 17:15 · T8 → T3 · 14h35',
  },
  {
    leg: 'HND → DFW',
    flight: 'JL7014',
    operator: 'op. American',
    detail: '3/12 20:25 → 3/12 17:05 · 11h40',
  },
  {
    leg: 'DFW → GRU',
    flight: 'JL7204',
    operator: 'op. American',
    detail: '3/12 19:20 → 4/12 08:30 · 10h10',
  },
];

export const TRIP_EVENTS: TripEvent[] = [
  {
    id: 'gru-jfk',
    label: 'Voo GRU → JFK (JL5501)',
    at: '2026-11-16T22:50:00-03:00',
    kind: 'flight',
    detail: 'GRU T3 · conexão de 6h no JFK, com imigração dos EUA',
  },
  {
    id: 'jfk-hnd',
    label: 'Voo JFK → HND (JL005)',
    at: '2026-11-17T12:40:00-05:00',
    kind: 'flight',
    detail: 'JFK T8 · pouso em Haneda 18/11 às 17:15',
  },
  {
    id: 'landing-hnd',
    label: 'Pouso em Haneda',
    at: '2026-11-18T17:15:00+09:00',
    kind: 'flight',
    detail: 'Terminal 3 · imigração + bagagem: 45 a 70 min',
  },
  {
    id: 'takuhaibin-tokyo',
    label: 'Deixar malas p/ takuhaibin → Kyoto',
    at: '2026-11-23T06:30:00+09:00',
    kind: 'deadline',
    detail: 'Na recepção do hotel de Tóquio, antes de sair para a estação',
  },
  {
    id: 'shink-hiroshima',
    label: 'Shinkansen Tóquio → Hiroshima',
    at: '2026-11-23T07:00:00+09:00',
    kind: 'train',
    detail: 'Nozomi · 3h50 · feriado nacional, assento reservado',
  },
  {
    id: 'checkout-hiroshima',
    label: 'Saída de Hiroshima → Kurashiki',
    at: '2026-11-25T08:20:00+09:00',
    kind: 'train',
    detail: 'Sanyo Shinkansen até Okayama + local',
  },
  {
    id: 'osaka-kyoto',
    label: 'Osaka → Kyoto',
    at: '2026-11-27T11:30:00+09:00',
    kind: 'train',
    detail: 'JR Special Rapid, 29 min',
  },
  {
    id: 'takuhaibin-kyoto',
    label: 'Despachar malas Kyoto → Tóquio',
    at: '2026-12-01T07:30:00+09:00',
    kind: 'deadline',
    detail: 'Takuhaibin no hotel de Kyoto, logo cedo',
  },
  {
    id: 'shink-tokyo',
    label: 'Shinkansen Kyoto → Tóquio',
    at: '2026-12-01T13:20:00+09:00',
    kind: 'train',
    detail: 'Nozomi · 2h15 · Fuji do lado esquerdo',
  },
  {
    id: 'haneda-deadline',
    label: 'Chegar em Haneda T3 (tax refund!)',
    at: '2026-12-03T17:00:00+09:00',
    kind: 'deadline',
    detail: 'Reembolso do imposto ANTES do check-in · produtos acessíveis',
  },
  {
    id: 'hnd-dfw',
    label: 'Voo HND → DFW (JL7014)',
    at: '2026-12-03T20:25:00+09:00',
    kind: 'flight',
    detail: 'Conexão de 2h15 em Dallas — assentos na frente ajudam',
  },
];
