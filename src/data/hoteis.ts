/**
 * Sugestões de hotel por etapa, pensando em mobilidade (a pé da estação e
 * dos programas do roteiro) e custo-benefício. Preços são a faixa típica de
 * um quarto duplo em fim de novembro (pico de outono): conferir na reserva.
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

export interface EtapaHoteis {
  stageId: 'tokyo1' | 'hiroshima' | 'osaka' | 'kyoto' | 'tokyo2';
  city: string;
  nights: string;
  /** o critério para esta etapa, em uma frase */
  criteria: string;
  hotels: HotelSugestao[];
}

export const HOTEIS: EtapaHoteis[] = [
  {
    stageId: 'tokyo1',
    city: 'Tóquio · Shinjuku',
    nights: '18 a 23 de novembro · 5 noites',
    criteria: 'Ficar a menos de 10 minutos a pé da Estação Shinjuku, do lado da saída que vocês vão usar (sul ou oeste), porque saem cedo todos os dias e o dia 20 e o 23 começam com trem.',
    hotels: [
      {
        name: 'JR Kyushu Hotel Blossom Shinjuku',
        jp: 'JR九州ホテル ブラッサム新宿',
        area: 'Saída sul, Yoyogi',
        price: '¥22.000–30.000',
        why: 'O mais bem localizado para o roteiro: 3 minutos da saída sul (Shōnan-Shinjuku para Kamakura, Chūō para a Estação de Tóquio) e do terminal de ônibus Busta. Quartos de 25 m², bons para duas malas.',
        mobility: '3 min da saída sul · 8 min da Ōedo (Tsukiji) · Yoyogi a 2 min',
        mapQuery: 'JR Kyushu Hotel Blossom Shinjuku',
        pick: true,
      },
      {
        name: 'Hotel Gracery Shinjuku',
        jp: 'ホテルグレイスリー新宿',
        area: 'Kabukichō, o do Godzilla',
        price: '¥18.000–26.000',
        why: 'Em cima do cinema com a cabeça do Godzilla, no meio de Kabukichō: restaurantes até tarde, o Omoide Yokochō a 5 minutos. Quartos pequenos, mas a localização compensa para quem chega às 20h e sai às 7h.',
        mobility: '7 min da saída leste · 5 min do Omoide Yokochō · Seibu-Shinjuku a 3 min',
        caveat: 'Kabukichō é barulhento à noite e a saída leste é a mais longe das plataformas JR de Kamakura.',
        mapQuery: 'Hotel Gracery Shinjuku',
      },
      {
        name: 'Tokyu Stay Shinjuku',
        jp: '東急ステイ新宿',
        area: 'Shinjuku 3-chōme',
        price: '¥17.000–24.000',
        why: 'Máquina de lavar e secar dentro do quarto, o que em 5 noites resolve a mala. Cadeia confiável, quartos limpos, café da manhã razoável.',
        mobility: '5 min da estação Shinjuku-sanchōme (Marunouchi, para Asakusa e Ginza) · 10 min da JR',
        mapQuery: 'Tokyu Stay Shinjuku',
      },
      {
        name: 'Sotetsu Fresa Inn Shinjuku (ou Hotel Sunroute Plaza Shinjuku)',
        area: 'Saída sul / Yoyogi',
        price: '¥13.000–19.000',
        why: 'A opção de custo: quartos compactos e funcionais, a 5 minutos da saída sul. Se o orçamento apertar, é aqui que se economiza sem perder a localização.',
        mobility: '5 min da saída sul da JR',
        caveat: 'Quartos de 13–15 m²: com duas malas grandes abertas não sobra chão.',
        mapQuery: 'Sotetsu Fresa Inn Tokyo-Shinjuku',
      },
    ],
  },
  {
    stageId: 'hiroshima',
    city: 'Hiroshima',
    nights: '23 a 25 de novembro · 2 noites',
    criteria: 'Duas noites, três chegadas e saídas de trem: o melhor é a própria estação ou a Hondōri, a 15 minutos de bonde; o parque fica a pé da Hondōri.',
    hotels: [
      {
        name: 'Hotel Granvia Hiroshima',
        jp: 'ホテルグランヴィア広島',
        area: 'Dentro da estação, saída Shinkansen',
        price: '¥20.000–28.000',
        why: 'Sai do Shinkansen e entra no hotel. Para Miyajima e para o dia 25 (três trens) é imbatível: zero deslocamento com mochila. O ekie e o Pokémon Center ficam no mesmo prédio.',
        mobility: '0 min da estação · bonde para o parque a 15 min',
        caveat: 'Longe da Hondōri e do parque; o jantar de okonomiyaki pede o bonde de volta.',
        mapQuery: 'Hotel Granvia Hiroshima',
        pick: true,
      },
      {
        name: 'Hotel Intergate Hiroshima',
        jp: 'ホテルインターゲート広島',
        area: 'Hondōri / Hatchōbori',
        price: '¥14.000–20.000',
        why: 'No meio da galeria Hondōri: o parque a 10 minutos a pé, o Nagataya a 8, o bonde na porta. Lounge com bebida grátis à noite e café da manhã bom. Melhor custo-benefício da etapa.',
        mobility: '10 min a pé do parque · bonde Hatchōbori a 2 min · estação a 15 min de bonde',
        mapQuery: 'Hotel Intergate Hiroshima',
      },
      {
        name: 'Candeo Hotels Hiroshima Hatchobori',
        jp: 'カンデオホテルズ広島八丁堀',
        area: 'Hatchōbori',
        price: '¥15.000–22.000',
        why: 'Banho termal no terraço, com vista da cidade, para o fim do dia de Miyajima. Quartos maiores que a média.',
        mobility: '3 min do bonde Hatchōbori · 12 min a pé do parque',
        mapQuery: 'Candeo Hotels Hiroshima Hatchobori',
      },
      {
        name: 'RIHGA Royal Hotel Hiroshima',
        jp: 'リーガロイヤルホテル広島',
        area: 'Motomachi, ao lado do castelo',
        price: '¥18.000–26.000',
        why: 'O hotel alto da cidade, com vista do parque e do castelo dos andares de cima. A 5 minutos a pé do Domo.',
        mobility: '5 min do Domo · bonde Kamiyachō a 4 min',
        mapQuery: 'RIHGA Royal Hotel Hiroshima',
      },
    ],
  },
  {
    stageId: 'osaka',
    city: 'Osaka · Namba',
    nights: '25 a 27 de novembro · 2 noites',
    criteria: 'Namba resolve tudo: chega-se de Himeji pela Midōsuji, o Dōtonbori é a pé, o Nankai para Sumiyoshi sai daqui, e a saída para Kyoto é pela mesma Midōsuji. Umeda é a alternativa para quem prefere o lado norte.',
    hotels: [
      {
        name: 'Cross Hotel Osaka',
        jp: 'クロスホテル大阪',
        area: 'Dōtonbori / Shinsaibashi',
        price: '¥20.000–28.000',
        why: 'A 1 minuto do canal do Dōtonbori e a 4 da estação Namba, num prédio moderno com quartos de 30 m². É o lugar para chegar às 19h do dia 25 e sair andando para jantar.',
        mobility: '4 min de Namba (Midōsuji) · 6 min do Nankai Namba · Kuromon a 10 min',
        mapQuery: 'Cross Hotel Osaka',
        pick: true,
      },
      {
        name: 'Swissôtel Nankai Osaka',
        jp: 'スイスホテル南海大阪',
        area: 'Em cima da estação Nankai Namba',
        price: '¥30.000–42.000',
        why: 'O hotel é a própria estação Nankai: para Sumiyoshi no dia 27 e para o aeroporto, é o mais prático que existe. Quartos grandes, vista da cidade.',
        mobility: '0 min do Nankai · 3 min da Midōsuji · Dōtonbori a 6 min',
        caveat: 'O mais caro da lista; o preço se justifica só se pesar o conforto.',
        mapQuery: 'Swissotel Nankai Osaka',
      },
      {
        name: 'Dormy Inn Premium Namba',
        jp: 'ドーミーインPREMIUMなんば',
        area: 'Namba, lado sul',
        price: '¥14.000–20.000',
        why: 'Banho termal no último andar e a "tigela de ramen da noite" grátis às 21h30, a marca da rede. Custo-benefício alto, quartos pequenos mas bem pensados.',
        mobility: '5 min do Nankai Namba · 8 min da Midōsuji · Dōtonbori a 8 min',
        mapQuery: 'Dormy Inn Premium Namba',
      },
      {
        name: 'Hotel Vischio Osaka by Granvia',
        jp: 'ホテルヴィスキオ大阪',
        area: 'Umeda, ao lado da JR Osaka',
        price: '¥16.000–22.000',
        why: 'Para quem prefere Umeda: a 3 minutos da JR Osaka (Special Rapid para Kyoto sem troca), quartos novos e bons, café da manhã forte. O Dōtonbori fica a 8 minutos de metrô.',
        mobility: '3 min da JR Osaka · Midōsuji Umeda a 5 min',
        caveat: 'Sumiyoshi e Dōtonbori ficam do outro lado da cidade.',
        mapQuery: 'Hotel Vischio Osaka by Granvia',
      },
    ],
  },
  {
    stageId: 'kyoto',
    city: 'Kyoto',
    nights: '27 de novembro a 1º de dezembro · 4 noites',
    criteria: 'Em novembro Kyoto lota e encarece; reservem cedo. A Estação de Kyoto é o nó de tudo que vocês fazem (Fushimi, Arashiyama, Nara, Tōfuku-ji, o Shinkansen), então o hotel a pé dela poupa uma hora por dia. Karasuma/Shijō é o centro bonito, 10 minutos de metrô da estação.',
    hotels: [
      {
        name: 'Hotel Granvia Kyoto',
        jp: 'ホテルグランヴィア京都',
        area: 'Dentro da Estação de Kyoto',
        price: '¥32.000–48.000',
        why: 'Dentro da estação: as plataformas do Nara Line, do Sagano, da Kintetsu e do Shinkansen a 5 minutos de elevador. Para quatro dias de bate-volta cedo é o hotel certo, e o takuhaibin chega direto.',
        mobility: '0 min da estação · ônibus para Gion e Kiyomizu na porta',
        caveat: 'Caro em novembro. O bairro da estação é feio; Gion e o centro ficam a 15 min de ônibus.',
        mapQuery: 'Hotel Granvia Kyoto',
        pick: true,
      },
      {
        name: 'Dormy Inn Premium Kyoto Ekimae',
        jp: 'ドーミーインPREMIUM京都駅前',
        area: 'Em frente à estação, saída norte',
        price: '¥18.000–26.000',
        why: 'A 3 minutos da estação, com banho termal, ramen de graça à noite e café da manhã japonês bom. O melhor custo-benefício da cidade para este roteiro.',
        mobility: '3 min da estação · terminal de ônibus a 2 min · Kyoto Tower ao lado',
        mapQuery: 'Dormy Inn Premium Kyoto Ekimae Natural Hot Spring',
      },
      {
        name: 'Daiwa Roynet Hotel Kyoto Ekimae',
        jp: 'ダイワロイネットホテル京都駅前',
        area: 'Saída norte da estação',
        price: '¥15.000–22.000',
        why: 'Novo, quartos grandes para o padrão japonês, a 5 minutos da estação. Sem frescura e sem surpresa.',
        mobility: '5 min da estação',
        mapQuery: 'Daiwa Roynet Hotel Kyoto Ekimae',
      },
      {
        name: 'Mitsui Garden Hotel Kyoto Shijō',
        jp: '三井ガーデンホテル京都四条',
        area: 'Karasuma / Shijō, o centro',
        price: '¥20.000–30.000',
        why: 'Para quem prefere dormir no centro: Nishiki a 5 minutos, Gion a 15 a pé, jantares sem táxi. Banho comum de pedra, jardim interno. A estação fica a 4 minutos de metrô pela Karasuma Line.',
        mobility: '3 min de Shijō (Karasuma) · 5 min de Karasuma (Hankyu) · estação em 4 min de metrô',
        caveat: 'Manhãs cedo pedem metrô até a estação (4 min, mas é um passo a mais).',
        mapQuery: 'Mitsui Garden Hotel Kyoto Shijo',
      },
    ],
  },
  {
    stageId: 'tokyo2',
    city: 'Tóquio · Ginza',
    nights: '1º a 3 de dezembro · 2 noites',
    criteria: 'Ginza porque as compras finais são a pé, Tsukiji fica a 10 minutos, e o trem direto para Haneda sai de Higashi-Ginza. Yaesu, do outro lado da Estação de Tóquio, é a alternativa para quem chega de Shinkansen com mala de mão.',
    hotels: [
      {
        name: 'Mitsui Garden Hotel Ginza Premier',
        jp: '三井ガーデンホテル銀座プレミア',
        area: 'Ginza 8-chōme',
        price: '¥26.000–36.000',
        why: 'Lobby no 16º andar com vista da Tokyo Tower, quartos de bom tamanho, a 3 minutos de Shimbashi e 6 da Ginza. Para as duas últimas noites, a escolha com mais conforto por iene.',
        mobility: '3 min de Shimbashi · 6 min de Ginza · Higashi-Ginza (Haneda) a 8 min',
        mapQuery: 'Mitsui Garden Hotel Ginza Premier',
        pick: true,
      },
      {
        name: 'Hotel Gracery Ginza',
        jp: 'ホテルグレイスリー銀座',
        area: 'Ginza 7-chōme, na Chūō-dōri',
        price: '¥16.000–24.000',
        why: 'Na avenida principal, entre a Uniqlo e a Ginza Six. Quartos compactos e funcionais; o que se paga é a localização, e aqui ela é o ponto.',
        mobility: '3 min de Ginza · 5 min de Higashi-Ginza · Yūrakuchō a 8 min',
        mapQuery: 'Hotel Gracery Ginza',
      },
      {
        name: 'Daiwa Roynet Hotel Ginza',
        jp: 'ダイワロイネットホテル銀座',
        area: 'Ginza 1-chōme, perto de Kyōbashi',
        price: '¥18.000–26.000',
        why: 'Quartos maiores e mais novos que a média da Ginza, a 5 minutos da Ginza-Itchōme e 12 da Estação de Tóquio a pé (útil chegando do Shinkansen).',
        mobility: '5 min de Ginza-Itchōme · 12 min da Estação de Tóquio · Tsukiji a 12 min',
        mapQuery: 'Daiwa Roynet Hotel Ginza',
      },
      {
        name: 'Sotetsu Fresa Inn Ginza-Nanachome (ou Super Hotel Premier Ginza)',
        area: 'Ginza 7-chōme / 8-chōme',
        price: '¥12.000–18.000',
        why: 'A opção econômica: duas noites de fim de viagem, com o dinheiro indo para as compras. Quartos pequenos, localização idêntica à dos caros.',
        mobility: '4 min de Ginza · 6 min de Higashi-Ginza',
        caveat: 'Quartos de 12–14 m²; com as malas cheias da volta fica apertado.',
        mapQuery: 'Sotetsu Fresa Inn Ginza-Nanachome',
      },
    ],
  },
];
