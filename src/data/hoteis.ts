/**
 * Sugestões de hotel por etapa, com orçamento apertado: rede econômica
 * japonesa (business hotel), sempre a pé da estação que vocês usam de manhã.
 * Preços são a faixa típica de um quarto duplo em fim de novembro, que é
 * alta estação: conferir na reserva, e reservar cedo.
 */
export interface HotelSugestao {
  name: string;
  jp?: string;
  area: string;
  /** faixa de preço da diária, quarto duplo, em ienes */
  price: string;
  /** por que faz sentido para este roteiro */
  why: string;
  /** distância a pé de estação e pontos-chave */
  mobility: string;
  /** o que pesa contra */
  caveat?: string;
  /** para o Google Maps */
  mapQuery: string;
  /** a escolha recomendada na etapa */
  pick?: boolean;
}

/**
 * O que está de fato reservado. Esta lista manda: a de sugestões, abaixo,
 * virou histórico de como se chegou até aqui.
 */
export interface ReservaHotel {
  name: string;
  jp?: string;
  city: string;
  datas: string;
  noites: number;
  preco: string;
  status: 'confirmada' | 'decidir' | 'refazer';
  /** o que precisa acontecer com esta reserva */
  acao?: string;
  codigo?: string;
  mapQuery: string;
}

export const RESERVAS_HOTEL: ReservaHotel[] = [
  {
    name: 'HOTEL AMANEK Shinjuku Kabukicho',
    city: 'Tóquio',
    datas: '18 → 23 de novembro',
    noites: 5,
    preco: 'R$ 5.987',
    status: 'confirmada',
    mapQuery: 'HOTEL AMANEK Shinjuku Kabukicho',
  },
  {
    name: 'APA Hotel Hiroshima Ekimae Ohashi',
    city: 'Hiroshima',
    datas: '23 → 25 de novembro',
    noites: 2,
    preco: 'R$ 953',
    status: 'confirmada',
    acao: 'É daqui que as malas grandes já saíram para Kyoto, no dia 23.',
    mapQuery: 'APA Hotel Hiroshima Ekimae Ohashi',
  },
  {
    name: 'KOKO HOTEL Osaka Namba Sennichimae',
    city: 'Osaka · Namba',
    datas: '25 → 27 de novembro',
    noites: 2,
    preco: 'R$ 1.084',
    status: 'refazer',
    acao:
      'Precisa virar **25 → 26, uma noite só**, para abrir espaço para Kōyasan. Reservem a noite nova **antes** de cancelar esta: diária avulsa em novembro costuma subir.',
    mapQuery: 'KOKO HOTEL Osaka Namba Sennichimae',
  },
  {
    name: '高野山 宿坊 熊谷寺 · Koyasan Shukubo Kumagaiji',
    jp: '熊谷寺',
    city: 'Kōyasan',
    datas: '26 → 27 de novembro',
    noites: 1,
    preco: 'R$ 1.861',
    status: 'decidir',
    codigo: '5897947836',
    acao:
      'Quarto de luxo em estilo japonês, com jantar e café. Fica na ponta **leste** da montanha, a 5 min do Ichinohashi (a boca do Okunoin) e 10 min do Kongōbu-ji — bem colocado para as duas metades do programa. O site deles anuncia **oração matinal com ritual do fogo**, que é justamente o que a Priscila lembra do Ekō-in. Check-in 14:00–17:00, check-out **09:00**.',
    mapQuery: 'Kumagaiji Koyasan',
  },
  {
    name: '高野山 宿坊 普門院 · Koyasan Shukubo Fumonin',
    jp: '普門院',
    city: 'Kōyasan',
    datas: '26 → 27 de novembro',
    noites: 1,
    preco: '—',
    status: 'decidir',
    acao:
      'A outra opção, reservada pela Priscila. Fica no **Senjuinbashi**, o centro exato da montanha: 3 min do Kongōbu-ji, ao lado do correio e do mercadinho, e todos os ônibus param ali. Templo de 824, com **jardim atribuído a Kobori Enshū** e hondō do começo do período Edo. Check-in **15:00–16:30**, jantar **17:30** servido em mesa e cadeira, oração **06:30** (35–40 min). Um dos dois tem que ser cancelado.',
    mapQuery: 'Fumonin Koyasan',
  },
  {
    name: 'Travelodge Kyoto Shijo Kawaramachi',
    city: 'Kyoto · Shijō-Kawaramachi',
    datas: '27 de novembro → 1º de dezembro',
    noites: 4,
    preco: 'R$ 3.920',
    status: 'confirmada',
    acao:
      'A escolha certa entre as duas de Kyoto: R$ 461 mais barata e na melhor posição — Nishiki na esquina, Gion a 15 min a pé pela ponte, Keihan direto para Fushimi e Hankyu direto para Arashiyama. **É aqui que as malas do dia 23 estão esperando** — confirmem por escrito que o hotel guarda bagagem antes do check-in.',
    mapQuery: 'Travelodge Kyoto Shijo Kawaramachi',
  },
  {
    name: 'Carta Hotel Kyoto Gion',
    city: 'Kyoto · Gion',
    datas: '27 de novembro → 1º de dezembro',
    noites: 4,
    preco: 'R$ 4.381',
    status: 'decidir',
    acao: 'Duplicata exata do Travelodge, dia por dia. Cancelar libera **R$ 4.381**.',
    mapQuery: 'Carta Hotel Kyoto Gion',
  },
  {
    name: 'Sotetsu Fresa Inn Ginza Sanchome',
    city: 'Tóquio · Ginza',
    datas: '1º → 3 de dezembro',
    noites: 2,
    preco: 'R$ 1.596',
    status: 'confirmada',
    acao: 'Endereço de Ginza pelas duas últimas noites, com as compras finais a pé e o trem direto para Haneda em Higashi-Ginza.',
    mapQuery: 'Sotetsu Fresa Inn Ginza Sanchome',
  },
];

export interface EtapaHoteis {
  stageId: 'tokyo1' | 'hiroshima' | 'osaka' | 'koyasan' | 'kyoto' | 'tokyo2';
  city: string;
  nights: string;
  /** o critério para esta etapa, em uma frase */
  criteria: string;
  hotels: HotelSugestao[];
}

/** O que as redes econômicas japonesas entregam, para saber o que esperar. */
export const REDES: { name: string; text: string }[] = [
  {
    name: 'Toyoko Inn',
    text: 'A mais barata das confiáveis. Quarto de 13–15 m², café da manhã japonês simples **incluído** (onigiri, sopa, salada), lavanderia com moeda. Sempre coladas em estação. Cadastro gratuito dá 5% de desconto e, a cada 10 diárias, uma grátis.',
  },
  {
    name: 'Super Hotel',
    text: 'Café da manhã **incluído** e, em muitas unidades, **banho termal** (natural ou artificial) no térreo, o que vale muito depois de 20 mil passos. Check-in por máquina, sem chave: a porta abre com senha. Colchão à escolha no lobby.',
  },
  {
    name: 'APA Hotel',
    text: 'A mais espalhada e quase sempre a mais barata da rua. Quartos **muito** pequenos (11–13 m²) com cama grande e banheiro-cápsula. Serve para dormir e sair. Algumas unidades têm banho grande no último andar.',
  },
  {
    name: 'Sotetsu Fresa Inn / Via Inn',
    text: 'Um degrau acima em quarto e silêncio, ainda dentro do orçamento. Via Inn é a rede da JR Oeste, sempre grudada na estação. Café da manhã costuma ser pago à parte (¥800–1.200).',
  },
];

/** Táticas que mudam o total da viagem, não o conforto. */
export const ECONOMIA: { title: string; text: string }[] = [
  {
    title: 'Reservar agora, com cancelamento grátis',
    text: 'Fim de novembro é **pico de folhagem**: Kyoto esgota e o preço dobra entre setembro e outubro. Reservem já no site da própria rede (quase sempre mais barato que Booking) com tarifa cancelável, e reservem de novo se o preço cair.',
  },
  {
    title: 'Quarto duplo, não twin',
    text: 'No Japão o quarto de **cama de casal (double/semi-double)** custa menos que o de duas camas. É a mesma diária cobrada por quarto, não por pessoa, então os dois dormem pelo preço de um.',
  },
  {
    title: 'Café da manhã incluído vale ¥2.000 por dia',
    text: 'Toyoko Inn e Super Hotel dão café da manhã sem custo. São uns ¥2.000 por dia a dois que não saem do bolso, e o dia começa mais cedo.',
  },
  {
    title: 'Lavar roupa no meio da viagem',
    text: 'Todo business hotel tem lavadora-secadora com moeda (~¥500 a carga). Uma lavagem em Hiroshima e outra em Kyoto significa mala menor, mais espaço para as compras e nenhuma bagagem despachada extra.',
  },
  {
    title: 'Em Kyoto, o lado sul da estação',
    text: 'Hachijō-guchi, a saída sul, é o mesmo prédio de estação com preço 20 a 30% menor que o lado norte, porque o bairro é sem graça. Para quem sai às 7h todo dia, não faz diferença nenhuma.',
  },
  {
    title: 'O corte grande: dormir em Osaka',
    text: 'Se o orçamento apertar mesmo, as 4 noites de Kyoto custam quase o dobro das de Osaka. Osaka–Kyoto são 30 minutos de trem direto. Vale a conta se a economia passar de ¥8.000 por noite, mas custa uma hora por dia e cansa mais.',
  },
];

export const HOTEIS: EtapaHoteis[] = [
  {
    stageId: 'tokyo1',
    city: 'Tóquio · Shinjuku',
    nights: '18 a 23 de novembro · 5 noites',
    criteria: 'É a etapa mais longa, então cada ¥3.000 por noite valem ¥15.000. Ficar a menos de 10 minutos a pé da Estação Shinjuku, do lado sul ou leste, porque saem cedo todos os dias e o dia 20 e o 23 começam com trem.',
    hotels: [
      {
        name: 'Super Hotel Shinjuku Kabukichō',
        jp: 'スーパーホテル新宿歌舞伎町',
        area: 'Kabukichō, perto da Seibu-Shinjuku',
        price: '¥11.000–15.000',
        why: 'A melhor combinação de preço e o que se ganha: **café da manhã e banho grande incluídos**, num raio de 8 minutos da JR. Depois de um dia de Asakusa a pé, o banho no térreo é o que faz diferença. Cinco noites aqui custam menos que três no hotel de antes.',
        mobility: '8 min da saída leste da JR · 3 min da Seibu-Shinjuku · Omoide Yokochō a 6 min',
        caveat: 'Kabukichō é barulhento e a saída leste é a mais distante das plataformas de Kamakura: contem 12 minutos até a plataforma no dia 20.',
        mapQuery: 'Super Hotel Shinjuku Kabukicho',
        pick: true,
      },
      {
        name: 'Toyoko Inn Tokyo Shinjuku Kabukichō',
        jp: '東横イン東京新宿歌舞伎町',
        area: 'Kabukichō',
        price: '¥9.000–13.000',
        why: 'O piso do orçamento em Shinjuku. Quarto de 14 m², café da manhã japonês incluído, lavanderia no prédio. Sem nenhum charme e sem nenhuma surpresa: cama limpa, chuveiro quente, porta que fecha.',
        mobility: '9 min da saída leste da JR · 4 min da Seibu-Shinjuku',
        caveat: 'Quartos apertados com duas malas abertas. Reservem o "double" e não o "single com cama de casal".',
        mapQuery: 'Toyoko Inn Tokyo Shinjuku Kabukicho',
      },
      {
        name: 'Sotetsu Fresa Inn Tokyo-Shinjuku',
        jp: '相鉄フレッサイン東京新宿',
        area: 'Saída sul / Yoyogi',
        price: '¥13.000–17.000',
        why: 'Uns ¥3.000 a mais por noite pelo melhor endereço da lista: 5 minutos da saída sul, que é de onde saem o Shōnan-Shinjuku para Kamakura e o Chūō para a Estação de Tóquio. Quarto e colchão melhores que os das duas opções acima.',
        mobility: '5 min da saída sul da JR · Busta (ônibus) a 4 min · Yoyogi a 6 min',
        caveat: 'Café da manhã à parte, uns ¥1.000 por pessoa.',
        mapQuery: 'Sotetsu Fresa Inn Tokyo-Shinjuku',
      },
      {
        name: 'APA Hotel Higashi-Shinjuku-Ekimae',
        jp: 'アパホテル東新宿駅前',
        area: 'Higashi-Shinjuku, uma estação adiante',
        price: '¥8.000–12.000',
        why: 'A opção de cortar mais fundo: sair do miolo de Shinjuku derruba a diária. Fica em cima da estação Higashi-Shinjuku, que é da **linha Ōedo** — a mesma que leva direto a Tsukiji no dia 21, sem baldeação.',
        mobility: '1 min da Higashi-Shinjuku (Ōedo, Fukutoshin) · 12 min a pé da JR Shinjuku',
        caveat: 'Quarto de 11–13 m²: cabe a cama e pouco mais. Chegar na JR Shinjuku pede 12 minutos a pé ou uma parada de metrô.',
        mapQuery: 'APA Hotel Higashi-Shinjuku Ekimae',
      },
    ],
  },
  {
    stageId: 'hiroshima',
    city: 'Hiroshima',
    nights: '23 a 25 de novembro · 2 noites',
    criteria: 'A cidade mais barata do roteiro: dá para ficar bem por ¥10.000. Duas noites com três chegadas e saídas de trem, então ou a própria estação ou a Hondōri, que é a 15 minutos de bonde e a pé do parque.',
    hotels: [
      {
        name: 'Super Hotel Hiroshima',
        jp: 'スーパーホテル広島',
        area: 'Hondōri / Nagarekawa',
        price: '¥9.000–13.000',
        why: 'Banho termal e café da manhã incluídos, no meio da região dos restaurantes e a 10 minutos a pé do Parque da Paz. Chegando de Miyajima às 18h, dá para tomar banho e sair andando para o okonomiyaki.',
        mobility: '10 min a pé do parque · bonde Hatchōbori a 3 min · estação a 15 min de bonde',
        mapQuery: 'Super Hotel Hiroshima',
        pick: true,
      },
      {
        name: 'Toyoko Inn Hiroshima Heiwa-Ōdōri',
        jp: '東横イン広島平和大通',
        area: 'Avenida da Paz',
        price: '¥8.000–11.000',
        why: 'O mais barato da etapa, na avenida que leva ao parque. Café incluído, quarto simples e limpo. Duas noites aqui custam menos que uma no hotel da estação.',
        mobility: '8 min a pé do Parque da Paz · bonde a 4 min',
        caveat: 'Longe da estação: no dia 25, com mala, são 15 minutos de bonde ou um táxi de ¥1.500.',
        mapQuery: 'Toyoko Inn Hiroshima Heiwa Odori',
      },
      {
        name: 'Via Inn Hiroshima',
        jp: 'ヴィアイン広島',
        area: 'Colada na estação, lado sul',
        price: '¥11.000–15.000',
        why: 'A rede econômica da JR Oeste, a poucos passos da estação. Vale os ¥2.000 a mais se pesar a manhã do dia 25, que tem três trens seguidos: acordar e embarcar sem carregar mala pela cidade.',
        mobility: '3 min da estação · ekie e Pokémon Center no mesmo complexo',
        caveat: 'O bairro da estação é sem vida à noite; o jantar bom pede o bonde até a Hondōri.',
        mapQuery: 'Via Inn Hiroshima',
      },
      {
        name: 'Hotel Active! Hiroshima',
        jp: 'ホテルアクティブ！広島',
        area: 'Hatchōbori',
        price: '¥9.000–13.000',
        why: 'Independente, com café da manhã bufê grande incluído (o ponto forte da casa) e quartos maiores que os da Toyoko Inn pelo mesmo preço.',
        mobility: '4 min do bonde Hatchōbori · 12 min a pé do parque',
        mapQuery: 'Hotel Active Hiroshima',
      },
    ],
  },
  {
    stageId: 'osaka',
    city: 'Osaka · Namba',
    nights: '25 a 26 de novembro · 1 noite',
    criteria: 'Uma noite só, agora que o dia 26 sobe para Kōyasan. Namba continua sendo o lugar certo: chega-se de Himeji pela Midōsuji, o Dōtonbori é logo ali e **o trem da Nankai que sobe a montanha parte daqui mesmo**.',
    hotels: [
      {
        name: 'Super Hotel Osaka Namba-Nihonbashi',
        jp: 'スーパーホテル大阪・なんば日本橋',
        area: 'Nipponbashi, entre Namba e Kuromon',
        price: '¥10.000–14.000',
        why: 'Banho termal e café incluídos, a 5 minutos do Dōtonbori e a 4 do Mercado Kuromon. Chegando cansados de Himeji no dia 25, é entrar, largar mala e comer.',
        mobility: '4 min de Nipponbashi · 8 min de Namba (Midōsuji) · Dōtonbori a 6 min',
        mapQuery: 'Super Hotel Osaka Namba Nihonbashi',
        pick: true,
      },
      {
        name: 'Toyoko Inn Osaka Namba Nipponbashi',
        jp: '東横イン大阪なんば日本橋',
        area: 'Nipponbashi / Den Den Town',
        price: '¥8.000–12.000',
        why: 'O chão de preço em Osaka, ainda a pé do Dōtonbori. Café incluído, lavanderia no prédio: é aqui que se lava a roupa da metade da viagem.',
        mobility: '5 min de Nipponbashi · 10 min de Namba · Den Den Town na porta',
        mapQuery: 'Toyoko Inn Osaka Namba Nippombashi',
      },
      {
        name: 'APA Hotel Namba-Eki Higashi',
        jp: 'アパホテル難波駅東',
        area: 'Namba, lado leste',
        price: '¥9.000–13.000',
        why: 'A 6 minutos da estação Namba e a 5 do canal. Quarto minúsculo, cama boa, preço baixo. Para duas noites em que vocês só voltam para dormir, cumpre o papel.',
        mobility: '6 min de Namba (Midōsuji e Nankai) · Dōtonbori a 5 min',
        caveat: 'Quartos de 11 m². Com duas malas grandes, um dorme e o outro espera para abrir a mala.',
        mapQuery: 'APA Hotel Namba Eki Higashi',
      },
      {
        name: 'Hotel Wing International Select Osaka Shinsaibashi',
        jp: 'ホテルウィングインターナショナルセレクト大阪心斎橋',
        area: 'Shinsaibashi',
        price: '¥10.000–14.000',
        why: 'Um degrau acima em quarto, entre Shinsaibashi e Namba, na parte calma. Café da manhã simples incluído e boa insonorização, coisa rara nessa faixa e nesse bairro.',
        mobility: '7 min de Shinsaibashi · 10 min de Namba · Dōtonbori a 7 min',
        mapQuery: 'Hotel Wing International Select Osaka Shinsaibashi',
      },
    ],
  },
  {
    stageId: 'kyoto',
    city: 'Kyoto',
    nights: '27 de novembro a 1º de dezembro · 4 noites',
    criteria: 'A etapa cara e a que precisa ser reservada primeiro: novembro é a folhagem, a cidade lota e o preço dobra. O truque é o lado sul da estação (Hachijō-guchi), 20 a 30% mais barato que o norte e do mesmo jeito colado nas plataformas de Fushimi, Arashiyama, Nara e Tōfuku-ji.',
    hotels: [
      {
        name: 'Toyoko Inn Kyoto Gojō-Karasuma',
        jp: '東横イン京都五条烏丸',
        area: 'Gojō, entre a estação e o centro',
        price: '¥13.000–19.000',
        why: 'Mesmo no pico da folhagem, a rede segura o preço melhor que qualquer outra da cidade. Café incluído, a 3 minutos do metrô Gojō: uma parada da estação, três do Nishiki. Quatro noites aqui custam menos que uma no hotel da estação.',
        mobility: '3 min do metrô Gojō (Karasuma) · 1 parada até a Estação de Kyoto · 12 min a pé da estação',
        caveat: 'Sair para Nara ou Arashiyama passa pela estação: contem 10 minutos a mais nas manhãs.',
        mapQuery: 'Toyoko Inn Kyoto Gojo Karasuma',
        pick: true,
      },
      {
        name: 'Super Hotel Kyoto Karasuma-Gojō',
        jp: 'スーパーホテル京都・烏丸五条',
        area: 'Gojō / Karasuma',
        price: '¥14.000–20.000',
        why: 'Banho termal natural e café incluídos, na mesma região da anterior. Depois de Fushimi Inari e dos 4 quilômetros de Higashiyama, esse banho é a diferença entre acordar bem e acordar duro.',
        mobility: '4 min do metrô Gojō · 14 min a pé da Estação de Kyoto',
        mapQuery: 'Super Hotel Kyoto Karasuma Gojo',
      },
      {
        name: 'Via Inn Kyoto Ekimae Hachijōguchi',
        jp: 'ヴィアイン京都駅前八条口',
        area: 'Estação de Kyoto, saída sul',
        price: '¥15.000–21.000',
        why: 'Do lado barato da estação, a 5 minutos das plataformas do Shinkansen, da Kintetsu (Nara) e do Nara Line (Fushimi, Tōfuku-ji). Para quatro dias que começam às 7h, é a economia de uma hora por dia sem pagar o preço do lado norte.',
        mobility: '5 min de todas as plataformas · saída sul, sem atravessar a estação',
        caveat: 'O bairro é de estacionamento e escritório: o jantar é na estação ou uma parada de metrô adiante.',
        mapQuery: 'Via Inn Kyoto Ekimae Hachijoguchi',
      },
      {
        name: 'Sakura Terrace The Gallery',
        jp: 'サクラテラス ザ ギャラリー',
        area: 'Hachijōguchi, atrás da estação',
        price: '¥16.000–22.000',
        why: 'Meio hotel meio albergue bom, com **bebida grátis à noite e ramen de cortesia**, banho comum e um pátio interno. Quartos pequenos, mas é o mais agradável de ficar entre os baratos, e a diferença de preço volta em jantar.',
        mobility: '7 min da saída sul da estação',
        caveat: 'Reservar com meses de antecedência: é conhecido e esgota primeiro.',
        mapQuery: 'Sakura Terrace The Gallery Kyoto',
      },
    ],
  },
  {
    stageId: 'tokyo2',
    city: 'Tóquio · Ginza',
    nights: '1º a 3 de dezembro · 2 noites',
    criteria: 'As duas últimas noites, com as compras finais a pé e o trem direto para Haneda saindo de Higashi-Ginza. Ginza tem hotel barato escondido nas ruas de trás; Higashi-Nihonbashi, quatro paradas adiante, é ainda mais barato.',
    hotels: [
      {
        name: 'Sotetsu Fresa Inn Ginza-Nanachōme',
        jp: '相鉄フレッサイン銀座七丁目',
        area: 'Ginza 7-chōme',
        price: '¥12.000–16.000',
        why: 'Endereço de Ginza por preço de business hotel, escondido uma rua atrás da Chūō-dōri. Nas duas últimas noites, com mala cheia e compras para fechar, sair do hotel e já estar nas lojas vale mais que qualquer metro quadrado.',
        mobility: '4 min de Ginza · 6 min de Higashi-Ginza (direto para Haneda) · Uniqlo e MUJI a 5 min',
        caveat: 'Quartos de 13–15 m²: com as malas da volta abertas, fica apertado.',
        mapQuery: 'Sotetsu Fresa Inn Ginza-Nanachome',
        pick: true,
      },
      {
        name: 'Hotel Villa Fontaine Tokyo-Tsukiji',
        jp: 'ヴィラフォンテーヌ東京築地',
        area: 'Tsukiji, a 10 minutos de Ginza',
        price: '¥11.000–15.000',
        why: 'Café da manhã incluído e quartos maiores que a média por menos que qualquer coisa em Ginza. Fica a 8 minutos de Higashi-Ginza, que é o trem direto para Haneda no dia 3.',
        mobility: '5 min de Tsukiji (Hibiya) · 8 min de Higashi-Ginza · Ginza a 12 min a pé',
        mapQuery: 'Hotel Villa Fontaine Tokyo Tsukiji',
      },
      {
        name: 'Toyoko Inn Tokyo Nihonbashi',
        jp: '東横イン東京日本橋',
        area: 'Nihonbashi / Kayabachō',
        price: '¥9.000–13.000',
        why: 'O mais barato com endereço central. Nihonbashi está no roteiro do dia 2, a Estação de Tóquio fica a 12 minutos a pé (útil chegando de Kyoto com mala) e Ginza a 15 a pé.',
        mobility: '3 min de Kayabachō · 12 min a pé da Estação de Tóquio · Ginza a 5 min de metrô',
        caveat: 'Bairro de escritório: à noite fecha tudo, o jantar é em Ginza ou Tsukiji.',
        mapQuery: 'Toyoko Inn Tokyo Nihombashi',
      },
      {
        name: 'APA Hotel Higashi-Nihombashi-Ekimae',
        jp: 'アパホテル東日本橋駅前',
        area: 'Higashi-Nihonbashi',
        price: '¥8.000–12.000',
        why: 'O corte mais fundo das duas últimas noites: mesma cidade, metade do preço de Ginza, quatro paradas de metrô da Chūō-dōri. Se o dinheiro tiver que ir para as compras, é daqui que ele sai.',
        mobility: '2 min de Higashi-Nihonbashi (Asakusa Line) · Ginza a 10 min de metrô · Haneda direto pela Asakusa Line',
        caveat: 'Quarto de 11–13 m² e bairro sem graça. Em compensação, a Asakusa Line vai a Haneda sem baldeação.',
        mapQuery: 'APA Hotel Higashi Nihombashi Ekimae',
      },
    ],
  },
];
