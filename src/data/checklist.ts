import type { ChecklistItem } from './types';

export const CHECKLIST: ChecklistItem[] = [
  // ── Compras dos primeiros dias ──
  {
    id: 'tenis',
    group: 'compras',
    title: 'Tênis',
    subtitle: 'Ameyoko (London Sports, Mita Sneakers) ou ABC-Mart · tamanho em cm',
  },
  {
    id: 'oculos',
    group: 'compras',
    title: 'Óculos de grau',
    subtitle: 'JINS / Zoff / OWNDAYS · exame grátis na loja, pronto em ~30–60 min, desde ~¥5.900',
  },
  {
    id: 'dock',
    group: 'compras',
    title: 'Dock station Dell (usada)',
    subtitle: 'Janpara Akihabara (2ª loja, periféricos) · dia 2/12 · conferir modelo e fonte',
  },
  {
    id: 'pikachu',
    group: 'compras',
    title: 'Pikachu momiji manjū (exclusivo de Hiroshima)',
    subtitle: 'Pokémon Center no ekie, 2º andar da estação · dia 23, na chegada · ~¥1.650',
  },
  {
    id: 'miso',
    group: 'compras',
    title: 'Missô artesanal (p/ Priscila)',
    subtitle: 'Kuradai Miso (perto do Nishiki, dia 29) · Honda Miso (Kyoto, fecha dom) · Sano Miso (Tóquio/Kameido, tem orgânico)',
  },
  {
    id: 'royce',
    group: 'compras',
    title: "Royce' Nama Chocolate (duty free da volta)",
    subtitle: 'Haneda T3, depois da imigração · dia 3/12 · pedir o saco térmico e levar na bagagem de mão',
  },
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
  // ── Caça ao tesouro de konbini ──
  {
    id: 'konbini-onigiri',
    group: 'konbini',
    title: 'Onigiri',
    subtitle: 'Atum com maionese é o clássico · abrir pelos números 1-2-3 da embalagem',
  },
  {
    id: 'konbini-tamago-sando',
    group: 'konbini',
    title: 'Sanduíche de ovo',
    subtitle: 'Shokupan sem casca + maionese Kewpie · o do Bourdain',
  },
  {
    id: 'konbini-pudding',
    group: 'konbini',
    title: 'Pudding',
    subtitle: 'Geladeira de sobremesas · 7 Premium nameraka purin',
  },
  {
    id: 'konbini-seven-cafe',
    group: 'konbini',
    title: 'Café — comprar o copo e fazer na máquina',
    subtitle: 'Copo no caixa (gelado vem lacrado com gelo) · botões R e L',
  },
  {
    id: 'konbini-ichigo-sando',
    group: 'konbini',
    title: 'Sanduíche de morango com creme',
    subtitle: 'Estação do morango começa em novembro — vocês pegam o auge',
  },
  {
    id: 'konbini-melon-pan',
    group: 'konbini',
    title: 'Melon bread',
    subtitle: 'Prateleira de pães · versão definitiva na Kagetsudō, Asakusa (dia 19)',
  },
  {
    id: 'konbini-mochi-ice',
    group: 'konbini',
    title: 'Sorvete de mochi',
    subtitle: 'Yukimi Daifuku, no freezer · foi criado como sorvete de inverno',
  },
  {
    id: 'konbini-smoothie',
    group: 'konbini',
    title: 'Smoothie de fruta congelada',
    subtitle: 'Copo no freezer + máquina ao lado do caixa · nem toda loja tem',
  },
  // ── Mala ──
  {
    id: 'mala-passaporte',
    group: 'mala',
    title: 'Passaporte (validade > 6 meses) + cópia no celular',
    subtitle: 'Foto das páginas em Mais → Emergência',
  },
  {
    id: 'mala-visto-eua',
    group: 'mala',
    title: 'Visto/ESTA dos EUA e cartão de crédito internacional',
    subtitle: 'As duas conexões (JFK e DFW) exigem entrar nos EUA',
  },
  {
    id: 'mala-seguro',
    group: 'mala',
    title: 'Seguro-viagem: apólice e telefone anotados',
    subtitle: 'Campo em Mais → Emergência',
  },
  {
    id: 'mala-cartoes',
    group: 'mala',
    title: '2 cartões de bandeiras diferentes + Wise/Nomad',
    subtitle: 'Japão aceita cartão bem, mas templos e barracas são em dinheiro',
  },
  {
    id: 'mala-dinheiro',
    group: 'mala',
    title: '¥30.000–50.000 em espécie para os primeiros dias',
    subtitle: 'Depois: caixa eletrônico do 7-Eleven aceita cartão brasileiro',
  },
  {
    id: 'mala-esim',
    group: 'mala',
    title: 'eSIM ativado ou chip pronto para ligar no pouso',
    subtitle: 'Ubigi, Airalo ou Mobal; testar antes de sair',
  },
  {
    id: 'mala-adaptador',
    group: 'mala',
    title: 'Adaptador tipo A (2 pinos chatos) + carregador USB-C forte',
    subtitle: '100V: o carregador do celular funciona; secador brasileiro, não',
  },
  {
    id: 'mala-powerbank',
    group: 'mala',
    title: 'Power bank (até 100 Wh, na bagagem de mão)',
    subtitle: 'Dia inteiro de mapa e foto acaba qualquer bateria',
  },
  {
    id: 'mala-casaco',
    group: 'mala',
    title: 'Casaco quente de verdade + camada leve por baixo',
    subtitle: 'Manhãs de 5–8 °C em Kyoto; tarde de 15 °C em Tóquio',
  },
  {
    id: 'mala-tenis',
    group: 'mala',
    title: 'Tênis já amaciado (vai comprar outro lá, mas chega calçado)',
    subtitle: 'Fushimi, Miyajima e Nara são 15–20 km de caminhada por dia',
  },
  {
    id: 'mala-meias',
    group: 'mala',
    title: 'Meias grossas e sem furo',
    subtitle: 'Templos são de meia: tira o sapato em todo lugar',
  },
  {
    id: 'mala-cachecol',
    group: 'mala',
    title: 'Cachecol, gorro e luvas finas',
    subtitle: 'Miyajima no teleférico e o anoitecer em Fushimi gelam',
  },
  {
    id: 'mala-guarda-chuva',
    group: 'mala',
    title: 'Guarda-chuva compacto',
    subtitle: 'Novembro é seco, mas um dia de chuva é provável',
  },
  {
    id: 'mala-roupa-min',
    group: 'mala',
    title: 'Roupa para 4–5 dias, não para 16',
    subtitle: 'Lavanderia no hotel + UNIQLO/GU no dia 19; a mala tem que voltar vazia',
  },
  {
    id: 'mala-remedios',
    group: 'mala',
    title: 'Farmacinha: analgésico, antialérgico, estômago, band-aid',
    subtitle: 'Remédio controlado precisa da receita traduzida',
  },
  {
    id: 'mala-oculos',
    group: 'mala',
    title: 'Óculos atual (para calibrar o novo na JINS) e lente de reserva',
    subtitle: 'Dia 19 em Akihabara',
  },
  {
    id: 'mala-medidas',
    group: 'mala',
    title: 'Medidas do colchão e do edredom, em cm, anotadas',
    subtitle: 'Para a roupa de cama da MUJI',
  },
  {
    id: 'mala-mala-vazia',
    group: 'mala',
    title: 'Uma mala grande vazia dentro da outra (ou comprar lá)',
    subtitle: 'MacBook, robô, roupa de cama e presentes não cabem na de ida',
  },
  {
    id: 'mala-sacola',
    group: 'mala',
    title: 'Sacola dobrável de compras',
    subtitle: 'Sacolinha é paga nas lojas; os depachika enchem a mão',
  },
  {
    id: 'mala-lenco',
    group: 'mala',
    title: 'Lencinho umedecido e toalhinha de mão',
    subtitle: 'Banheiros públicos não têm papel para secar a mão',
  },
  {
    id: 'mala-caneta',
    group: 'mala',
    title: 'Caneta para os formulários de imigração',
    subtitle: 'Ainda pedem em papel em alguns voos',
  },
  {
    id: 'mala-fotos-docs',
    group: 'mala',
    title: 'Fotos dos documentos e da reserva dos hotéis no celular',
    subtitle: 'Offline, em Mais → Reservas',
  },
];

export const COMPRAS_ITEMS = CHECKLIST.filter((c) => c.group === 'compras');
export const KONBINI_CHECKLIST = CHECKLIST.filter((c) => c.group === 'konbini');
export const MALA_ITEMS = CHECKLIST.filter((c) => c.group === 'mala');
export const PRETRIP_ITEMS = CHECKLIST.filter((c) => c.group === 'pretrip');
