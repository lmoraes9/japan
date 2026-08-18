import type { ChecklistItem } from './types';

export const CHECKLIST: ChecklistItem[] = [
  // ── Compras (keys originais do roteiro) ──
  {
    id: 'tshirt',
    group: 'compras',
    title: 'Camisetas de algodão — Muji e Uniqlo',
    subtitle: 'Muji Ginza 2º andar · Uniqlo Ginza · linhas Supima e Uniqlo U',
  },
  {
    id: 'iphone',
    group: 'compras',
    title: 'iPhone',
    subtitle: 'Só o 18 Pro/Pro Max existe em novembro · som do obturador travado',
  },
  {
    id: 'macbook',
    group: 'compras',
    title: 'MacBook Air M5',
    subtitle: 'Checar teclado JIS vs. US antes · Apple Ginza ou Bic Camera',
  },
  {
    id: 'robo',
    group: 'compras',
    title: 'Robô aspirador',
    subtitle: 'Exigir fonte 100–240V · Bic Camera/Yodobashi, não Amazon',
  },
  {
    id: 'cama',
    group: 'compras',
    title: 'Roupa de cama de algodão orgânico',
    subtitle: 'Muji Ginza 4º andar · medir a cama antes de sair do Brasil',
  },
  {
    id: 'faca',
    group: 'compras',
    title: 'Facas',
    subtitle: 'Kappabashi (Tóquio) ou Aritsugu (Nishiki, Kyoto)',
  },
  {
    id: 'mtg',
    group: 'compras',
    title: 'Magic — singles em japonês',
    subtitle: 'Hareruya e BIG MAGIC, Akihabara ou Den-Den Town',
  },
  {
    id: 'tax',
    group: 'compras',
    title: 'Registro no J-TaxRefund feito',
    subtitle: 'Na primeira compra da viagem · guardar todos os recibos juntos',
  },
  // ── Antes de embarcar ──
  {
    id: 'suica',
    group: 'pretrip',
    title: 'Suica no Apple Wallet',
    subtitle:
      'Adicionar antes de viajar e recarregar com cartão. Funciona em metrô, ônibus, conveniência e táxi no país inteiro.',
  },
  {
    id: 'esim',
    group: 'pretrip',
    title: 'eSIM contratado',
    subtitle: 'Ubigi, Airalo ou Sakura Mobile · 20 GB por ¥2.000–4.000 · ativar no avião',
  },
  {
    id: 'dinheiro',
    group: 'pretrip',
    title: 'Levar ¥30–50.000 em espécie',
    subtitle: 'ATMs da 7-Eleven e Correios aceitam cartão internacional; espécie para templos, mercados e izakaya',
  },
  {
    id: 'reserva-shibuya-sky',
    group: 'pretrip',
    title: 'Reservar Shibuya Sky',
    subtitle: 'Faixa 15:30–16:00 do dia 22/11 · esgota com antecedência',
  },
  {
    id: 'reserva-torokko',
    group: 'pretrip',
    title: 'Reservar trem panorâmico Sagano (Torokko)',
    subtitle: 'Arashiyama, dia 29/11 · assentos esgotam com semanas de antecedência em novembro',
  },
  {
    id: 'reserva-shinkansen',
    group: 'pretrip',
    title: 'Reservar assentos dos Shinkansen longos',
    subtitle: '23/11 Tóquio→Hiroshima (feriado nacional!) e 1/12 Kyoto→Tóquio · app Smart EX aceita cartão estrangeiro',
  },
  {
    id: 'reserva-omakase',
    group: 'pretrip',
    title: 'Reservar sushi omakase de balcão',
    subtitle: 'Kyūbey ou similar — reserva obrigatória com antecedência',
  },
  {
    id: 'adaptador',
    group: 'pretrip',
    title: 'Adaptador de tomada',
    subtitle: 'Japão é tipo A, 100V · levar adaptador também para usar os aparelhos novos na volta',
  },
  {
    id: 'medidas-cama',
    group: 'pretrip',
    title: 'Anotar as medidas do colchão em cm',
    subtitle: 'Antes de sair do Brasil — as medidas japonesas não batem com as brasileiras',
  },
  {
    id: 'visto-eua',
    group: 'pretrip',
    title: 'Conferir visto B1/B2 válido',
    subtitle: 'A conexão em JFK e DFW exige entrada nos EUA mesmo só em trânsito',
  },
];

export const COMPRAS_ITEMS = CHECKLIST.filter((c) => c.group === 'compras');
export const PRETRIP_ITEMS = CHECKLIST.filter((c) => c.group === 'pretrip');
