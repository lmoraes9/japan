/**
 * Plano de chuva, dia a dia. A pergunta que cada dia responde é a de quem acorda
 * com o céu fechado: o que continua igual, o que troca, e o que corta.
 *
 * `impacto` diz de relance o quanto a chuva atrapalha aquele dia — um dia de
 * museus e galerias cobertas é "pouco", um dia de escadaria e jardim é "muito".
 * Os trechos já usam as paradas do roteiro, então a troca nunca manda para um
 * lugar que o resto do app não conhece, com as exceções marcadas como
 * "confirmem": são lugares que não estão no roteiro e cujo horário não é meu.
 */

export type ImpactoChuva = 'pouco' | 'medio' | 'muito';

export interface PlanoChuva {
  impacto: ImpactoChuva;
  /** uma frase: como a chuva muda este dia */
  resumo: string;
  /** o que funciona do mesmo jeito, chovendo ou não */
  mantem?: string;
  /** cada troca: o que sai e o que entra no lugar */
  trocas?: { sai: string; entra: string }[];
  /** o único conselho que vale para este dia */
  dica?: string;
}

export const IMPACTO_CHUVA: Record<ImpactoChuva, { rotulo: string; cor: string }> = {
  pouco: { rotulo: 'chuva atrapalha pouco', cor: 'text-matcha' },
  medio: { rotulo: 'chuva pede ajuste', cor: 'text-gold' },
  muito: { rotulo: 'chuva muda o dia', cor: 'text-accent' },
};

/** o que vale para qualquer dia de chuva no Japão */
export const CHUVA_GERAL = [
  '**Guarda-chuva:** o transparente de vinil do konbini (¥500–800) é o que o japonês usa e o que ninguém leva embora por engano. Lojas e templos têm **saquinho para guarda-chuva molhado** na entrada: usem, o chão de madeira agradece.',
  '**Meias secas na mochila.** Templo, shukubō, Himeji e castelo pedem sapato fora, e meia molhada num piso de madeira frio é o que estraga o dia.',
  '**Previsão confiável só na véspera.** O app puxa a probabilidade do dia (Open-Meteo) e abre este bloco sozinho quando passa de 50%. Decidam à noite, não de manhã.',
  '**Chuva forte ou vento:** Shinkansen e trens locais quase sempre rodam; o que para é o teleférico (Miyajima), o ferry de Miyajima em mar muito agitado e, em tufão, tudo. Cheque o aviso da JR no dia.',
];

export const PLANO_CHUVA: Record<string, PlanoChuva> = {
  'd2026-11-18': {
    impacto: 'pouco',
    resumo: 'Chegada e hotel: a chuva só aparece entre o terminal e a porta do ônibus.',
    mantem: 'Tudo: ônibus até o hotel, ramen perto, 7-Eleven.',
    dica: 'Se chover forte, o 7-Eleven da esquina vende o guarda-chuva de vinil — é o primeiro item da lista de compras sem querer.',
  },
  'd2026-11-19': {
    impacto: 'pouco',
    resumo: 'O dia mais à prova de chuva da viagem: a Nakamise, o museu, a Ameya-Yokochō e Akihabara têm cobertura ou são fechados.',
    mantem: 'Tudo. O Sensō-ji molhado fica mais bonito e menos cheio; o Museu Nacional de Tóquio vira o centro do dia.',
    trocas: [
      { sai: 'Almoço no Parque de Ueno, se for para comer ao ar livre', entra: 'o Innsyōtei ou o Yabu Soba, as duas casas fechadas, sem sair da chuva para comer' },
    ],
  },
  'd2026-11-20': {
    impacto: 'muito',
    resumo: 'Kamakura é trilha, escada e templo ao ar livre; com chuva o chão vira lama e o Hase-dera perde o motivo, que é a vista do mar.',
    mantem: 'Engaku-ji e Kenchō-ji, que têm salões onde se fica por dentro; Komachi-dōri tem lojas e as casas de comer.',
    trocas: [
      { sai: 'Hase-dera (escada molhada, sem vista)', entra: 'mais tempo em Komachi-dōri e voltar a Tóquio duas horas mais cedo' },
      { sai: 'Caminhar entre os templos', entra: 'ônibus ou táxi entre Kenchō-ji e Hachimangū (poucos minutos)' },
    ],
    dica: 'É o único dia em que cortar a segunda metade é a decisão certa e não uma derrota. Kamakura molhada às 8h é ótima; molhada às 15h, cansa.',
  },
  'd2026-11-21': {
    impacto: 'medio',
    resumo: 'Tsukiji tem trechos cobertos; o Hamarikyū é jardim aberto e perde com céu fechado.',
    mantem: 'Almoço no depachika, Ginza inteira (Mitsukoshi, Ginza Six) e a Estação de Tóquio — tudo fechado.',
    trocas: [
      { sai: 'Jardins Hamarikyū (10:00)', entra: 'ficar em Tsukiji até mais tarde e entrar em Ginza mais cedo, pelas lojas' },
      { sai: 'Terraço do KITTE para ver a estação', entra: 'o interior do KITTE e o Tokyo Ramen Street, na própria estação; a vista do terraço, com chuva, não paga a subida' },
    ],
  },
  'd2026-11-22': {
    impacto: 'medio',
    resumo: 'A alameda de ginkgos dourados perde com chão molhado e luz cinza — mas as folhas no chão molhado também fazem uma foto boa.',
    mantem: 'Meiji Jingū (o bosque na chuva é melhor), Omotesandō, o 6º andar do Shibuya PARCO, o cruzamento visto de cima.',
    trocas: [
      { sai: 'Alameda de ginkgos de Meiji Jingū Gaien (14:30)', entra: 'Museu Nezu, em Aoyama, a 10 min a pé da Omotesandō — fecha às segundas, mas o dia 22 é domingo; confirmem a exposição em cartaz' },
    ],
  },
  'd2026-11-23': {
    impacto: 'pouco',
    resumo: 'Dia de Shinkansen e museu: o Museu da Paz é fechado e é onde se passa a tarde.',
    mantem: 'O trem, o Pokémon Center na estação e o museu, na entrada das 13:00.',
    trocas: [
      { sai: 'Parque da Paz, Cenotáfio e Domo (15:30) a pé, com calma', entra: 'o essencial em 40 min: Cenotáfio, Domo, chama da paz — com guarda-chuva, é um percurso reto e curto' },
    ],
    dica: 'O Domo molhado, com o rio ao lado, é uma das imagens mais fortes da cidade. Vale ir mesmo com chuva fraca.',
  },
  'd2026-11-24': {
    impacto: 'muito',
    resumo: 'É o dia em que a chuva pesa mais: o teleférico do Misen fecha com vento forte, o cume some na névoa e a trilha escorrega.',
    mantem: 'Santuário Itsukushima (os corredores são cobertos), Daishō-in, almoço de anago.',
    trocas: [
      { sai: 'Monte Misen e o teleférico (12:00)', entra: 'Senjōkaku, o salão dos mil tatames, e a rua Omotesandō de Miyajima, com lojas — o teleférico tem de ser conferido no site naquela manhã' },
      { sai: 'Shukkei-en na volta (16:00)', entra: 'voltar direto a Hiroshima e descansar: o jardim fecha às 17:00, a última entrada é às 16:30 e, molhado, as pedras escorregam' },
    ],
    dica: 'A maré também conta: com chuva, a torii dentro d\'água continua sendo a foto — só planejem pela tábua de marés, não pelo céu.',
  },
  'd2026-11-25': {
    impacto: 'medio',
    resumo: 'Kurashiki é canal e rua de pedra, bonita molhada; Himeji tem escada de madeira que escorrega e é ao ar livre até o torreão.',
    mantem: 'Museu de Arte Ōhara (fechado), almoço, o trem, o jantar em Dōtonbori (as galerias são cobertas).',
    trocas: [
      { sai: 'Passeio pelas margens do canal em Kurashiki', entra: 'o Ōhara por mais tempo e as lojas cobertas do Bikan' },
    ],
    dica: 'Em Himeji, o torreão pede sapato na mão e a escada é íngreme: um par de meias secas na mochila resolve o dia.',
  },
  'd2026-11-26': {
    impacto: 'muito',
    resumo: 'Osaka de manhã perde o castelo ao ar livre; Kōyasan fica a 800 m, com máxima de 8–10 °C mesmo sem chuva, e o Okunoin à noite é o ponto delicado.',
    mantem: 'Kuromon (galeria coberta, almoço), o trem, o shukubō, o jantar dos monges.',
    trocas: [
      { sai: 'Castelo de Osaka às 8:30 (parque aberto)', entra: 'só o museu dentro do torreão, ou nada: começar o dia pelo Kuromon e chegar a Kōyasan mais descansados' },
      { sai: 'Okunoin com chuva forte', entra: 'o tour noturno **sai com chuva fraca**, e só é cancelado com aviso severo, por e-mail, até 18:40 — com reembolso. Chuva forte sem aviso: o banho do shukubō e dormir cedo' },
    ],
    dica: 'Capa de chuva (não só guarda-chuva) para o Okunoin: o tour anda uns 90 min em fila indiana, e guarda-chuva na trilha atrapalha o vizinho.',
  },
  'd2026-11-27': {
    impacto: 'medio',
    resumo: 'Kongōbu-ji é todo coberto e a descida da montanha é de trem; o que sofre é o Garan e o Fushimi Inari ao entardecer.',
    mantem: 'Kongōbu-ji e o jardim de pedras (visto da varanda), Namba, o saquê, o sushi no balcão.',
    trocas: [
      { sai: 'Sumiyoshi Taisha (já era opcional)', entra: 'cortar sem culpa: é o primeiro item a cair' },
      { sai: 'Nishiki rápido às 15:45', entra: 'cortar também — o dia 29 termina nele' },
    ],
    dica: 'O Fushimi Inari com chuva fina tem menos gente, e os torii cobrem boa parte do caminho. Só não subam o monte inteiro: o Yotsutsuji já é o que importa.',
  },
  'd2026-11-28': {
    impacto: 'medio',
    resumo: 'Higashiyama a pé é longo e ao ar livre; mas Eikan-dō é todo de corredores cobertos e o chá de Gion é o fim do dia.',
    mantem: 'Kiyomizu às 6h (a chuva espanta a fila), Eikan-dō, o chá no Kitagawa Hanbee, Gion à noite.',
    trocas: [
      { sai: 'Caminho do Filósofo (12:30)', entra: 'táxi do Ginkaku-ji ao Nanzen-ji; o caminho, com chuva, é 2 km de poça' },
      { sai: 'Sannenzaka e Ninenzaka a passo normal', entra: 'ir devagar: a pedra molhada escorrega, e a lenda do azar de quem tropeça ali passa a ser literal' },
    ],
    dica: 'É o dia mais cheio do roteiro de Kyoto. Com chuva, é o que mais ganha com a regra de cortar um templo sem remorso.',
  },
  'd2026-11-29': {
    impacto: 'medio',
    resumo: 'O bosque de bambu molhado é bonito, mas o vagão aberto do Torokko (o 5º, "Rich") molha; Nishiki é todo coberto e fecha o dia.',
    mantem: 'Tenryū-ji (salões por dentro), Ryōan-ji (a varanda é coberta), Nishiki e o jantar de rede.',
    trocas: [
      { sai: 'Vagão 5 aberto do Torokko, se a previsão for de chuva', entra: 'trocar por um vagão fechado, se ainda houver lugar: o cancelamento é grátis até a véspera, então reservem o 5 agora e decidam na noite do dia 28' },
      { sai: 'Kinkaku-ji (13:45), que perde o brilho com céu cinza', entra: 'manter mas ficar pouco: 30 min bastam, e o Ryōan-ji logo depois tem varanda coberta' },
    ],
  },
  'd2026-11-30': {
    impacto: 'medio',
    resumo: 'O dia está em aberto, e Nara é dos melhores para chover: Daibutsuden, Kōfuku-ji e Naramachi são cobertos; o parque dos cervos é que vira lama.',
    mantem: 'Tōdai-ji (o salão do Grande Buda é fechado e grande), Kōfuku-ji, Naramachi e o almoço.',
    trocas: [
      { sai: 'Caminhada entre Nigatsu-dō e Kasuga Taisha (trilha de lanternas, lama)', entra: 'ônibus de Nara entre os templos, ou pular Kasuga e ficar mais em Naramachi' },
    ],
    dica: 'Como o dia é de vocês: chuva é um bom motivo para não ir a Nara e ficar em Kyoto. O Museu Nacional de Nara fecha às segundas, e 30/11 é segunda.',
  },
  'd2026-12-01': {
    impacto: 'medio',
    resumo: 'Sanjūsangen-dō e a estação são fechados; Tōfuku-ji e o Rikugien noturno são ao ar livre, e o Rikugien é o que mais custa decidir.',
    mantem: 'Sanjūsangen-dō (todo por dentro), Tō-ji (o salão principal), almoço e Shinkansen.',
    trocas: [
      { sai: 'Rikugien iluminado à noite (18:30)', entra: 'o ingresso antecipado costuma não ser reembolsável (confirmem a regra no site): por isso só se compra na véspera, se a previsão for boa. Com chuva, o Gashapon de Ikebukuro, que já é a parada seguinte, vira o plano da noite' },
    ],
  },
  'd2026-12-02': {
    impacto: 'pouco',
    resumo: 'O último dia inteiro é de curry, loja e balcão: quase tudo fechado.',
    mantem: 'Jimbōchō, Nihonbashi, Akihabara, Ginza, o jantar, o 7-Eleven.',
    trocas: [
      { sai: 'Manhã opcional (Kanda Myōjin e Yushima Seidō)', entra: 'chuva é motivo de sobra para pular: o dia só começa de verdade no curry' },
      { sai: 'Última vista da cidade (16:30)', entra: 'com chuva ou nuvem baixa, não vale a entrada; Ginza e o depachika do Mitsukoshi já cobrem o fim da tarde' },
    ],
  },
  'd2026-12-03': {
    impacto: 'pouco',
    resumo: 'Ramen na fila, loja de missô e aeroporto: o único trecho molhado é o da rua até o ramen.',
    mantem: 'Tudo. O Nakiryu tem fila na rua: levem o guarda-chuva e a senha vale a pena mesmo assim.',
  },
};
