import type { Leg } from './types';

/**
 * Como ir de cada parada até a seguinte: a pé, de trem, metrô, ônibus,
 * bonde, balsa ou táxi, com onde embarcar, onde descer e o sentido.
 * A chave é o id da parada de ORIGEM. `START[dayId]` é do hotel até a
 * primeira parada do dia, e a última parada de cada dia leva de volta ao hotel.
 */
const walk = (minutes: number, note?: string): Leg => ({ mode: 'walk', minutes, note });

export const START: Record<string, Leg[]> = {
  'd2026-11-20': [
    walk(8, 'do hotel para o sul pela Meiji-dōri até o cruzamento com a Shinjuku-dōri, na esquina do Isetan: é ali a estação **Shinjuku-sanchōme**, bem menor e mais fácil que a de Shinjuku'),
    {
      mode: 'metro', line: 'Marunouchi Line (vermelha, M)', board: 'Shinjuku-sanchōme (新宿三丁目)', boardPoint: '新宿三丁目駅',
      direction: '池袋 Ikebukuro', alight: 'Akasaka-mitsuke (赤坂見附), 4ª parada', minutes: 10,
      steps: [
        'Desçam a escada com o círculo **vermelho M** (丸ノ内線). Na mesma estação passam a Fukutoshin (marrom, F) e a Toei Shinjuku (verde, S): não sigam essas.',
        'Passem a Suica e escolham a plataforma **池袋方面 (Ikebukuro)**.',
        'Contem: Shinjuku-gyoemmae, Yotsuya-sanchōme, Yotsuya e **Akasaka-mitsuke**, a 4ª. Desçam.',
      ],
    },
    {
      mode: 'metro', line: 'Ginza Line (laranja, G)', board: 'Akasaka-mitsuke, do outro lado da mesma plataforma', direction: '浅草 Asakusa',
      alight: 'Asakusa (浅草), fim da linha', alightPoint: '浅草駅 1番出口', minutes: 26, cost: '¥260 no total',
      steps: [
        'Não precisa subir nem descer escada: o trem **laranja** da Ginza Line para do **outro lado da mesma plataforma**. Confiram no painel **浅草 Asakusa**.',
        'Fiquem até o **fim da linha** (Asakusa, ~26 min).',
        'Na plataforma, sigam as placas amarelas de saída até **1番出口 (saída 1) · 雷門 Kaminarimon**.',
      ],
    },
    walk(3, 'saindo da saída 1, o Kaminarimon (a lanterna vermelha gigante) está a poucos passos; o café fica na galeria Shin-Nakamise'),
  ],
  'd2026-11-19': [walk(12, 'do Kabukichō até a entrada sul da JR Shinjuku (pela Shinjuku-dōri); plataformas 1 e 2 (Shōnan-Shinjuku Line)')],
  'd2026-11-21': [
    walk(8, 'do hotel para o sul pela Meiji-dōri até o cruzamento com a Shinjuku-dōri, na esquina do Isetan: a estação **Shinjuku-sanchōme**, a mesma de ontem'),
    {
      mode: 'metro', line: 'Marunouchi Line (vermelha, M)', board: 'Shinjuku-sanchōme (新宿三丁目)', boardPoint: '新宿三丁目駅',
      direction: '池袋 Ikebukuro', alight: 'Ginza (銀座), 7ª parada', minutes: 16,
      steps: [
        'Escada com o círculo **vermelho M** (丸ノ内線), como ontem. Plataforma **池袋方面 (Ikebukuro)**.',
        'Contem 7 paradas: Shinjuku-gyoemmae, Yotsuya-sanchōme, Yotsuya, Akasaka-mitsuke, Kokkai-gijidōmae, Kasumigaseki e **Ginza**. Desçam.',
        '**Não saiam da estação.** Em Ginza, sigam as placas **cinza com H** (日比谷線 Hibiya Line). É um corredor de uns 3 a 5 minutos, sem passar catraca.',
      ],
    },
    {
      mode: 'metro', line: 'Hibiya Line (cinza, H)', board: 'Ginza, pelo corredor', direction: '北千住 Kita-Senju',
      alight: 'Tsukiji (築地), 2ª parada, saída 1', alightPoint: '築地駅 1番出口', minutes: 3, cost: '¥210 no total (o metrô cobra uma tarifa só)',
      steps: [
        'Plataforma **北千住方面 (Kita-Senju)**. A do outro lado vai para Naka-Meguro: não peguem essa.',
        'Contem Higashi-Ginza e **Tsukiji**, a 2ª. Desçam.',
        'Sigam a placa amarela **1番出口 (saída 1) · 築地本願寺 Tsukiji Hongan-ji**.',
      ],
    },
    walk(3, 'a saída 1 dá no **Tsukiji Hongan-ji**, o templo de pedra com cara de templo indiano. O mercado externo fica do outro lado da avenida, na diagonal: atravessem na faixa e entrem pelas vielas'),
  ],
  'd2026-11-22': [
    walk(6, 'do hotel para o sul pela Meiji-dōri: a entrada **E1** da Shinjuku-sanchōme fica na própria Meiji-dōri, ainda do lado do Kabukichō. Hoje a linha é outra, a Fukutoshin, que corre embaixo da Meiji-dōri'),
    {
      mode: 'metro', line: 'Fukutoshin Line (marrom, F)', board: 'Shinjuku-sanchōme (新宿三丁目), entrada E1', boardPoint: '新宿三丁目駅 E1出口',
      direction: '渋谷 Shibuya', alight: 'Meiji-jingūmae〈Harajuku〉 (明治神宮前〈原宿〉), saída 2', alightPoint: '明治神宮前駅 2番出口', minutes: 4, cost: '¥180',
      note: 'é a mesma conta da JR Yamanote, mas sem atravessar a estação de Shinjuku',
      steps: [
        'Desçam pela E1 e sigam o círculo **marrom F** (副都心線). Não confundam com a Marunouchi (vermelha, M) dos outros dias nem com a Toei Shinjuku (verde, S).',
        'Plataforma **渋谷方面 (Shibuya)**. O painel pode mostrar 横浜 ou 元町・中華街: tudo bem, o trem passa por Shibuya.',
        'Desçam em **明治神宮前〈原宿〉 Meiji-jingūmae**: é a 2ª parada no trem local (a 1ª é Kita-sandō) e a 1ª no expresso (急行), que pula Kita-sandō. Leiam o nome na plataforma.',
        'Sigam a placa amarela **2番出口 (saída 2) · JR原宿駅**, pela catraca 代々木公園方面.',
      ],
    },
    walk(4, 'a saída 2 dá no cruzamento em frente à JR Harajuku. Andem com a estação à esquerda até a ponte **Jingūbashi**, sobre os trilhos: do outro lado está o torii de madeira, a entrada sul do santuário'),
  ],
  'd2026-11-23': [
    walk(10, 'do hotel até a JR Shinjuku pela saída **東口 (East Exit)**, o caminho da volta dos dias 20 e 21 ao contrário: atravessem a Yasukuni-dōri e a praça. Só com a mochila: as malas grandes já foram de takuhaibin. Saiam do hotel até **06:10**: o Nozomi 9 sai às **07:12** e não espera. **Entrem na JR com o bilhete do Shinkansen**, não com a Suica: ele vale desde Shinjuku'),
    {
      mode: 'train', line: 'JR Chūō rápido (laranja)', board: 'Shinjuku (新宿), plataformas 7–8', boardPoint: '新宿駅 東口',
      direction: '東京方面 (Tokyo)', alight: 'Tokyo (東京), fim da linha', minutes: 15, cost: '¥253',
      steps: [
        'Na catraca do **東口**, **ponham o bilhete do Shinkansen** na fenda e peguem de volta do outro lado: ele vale desde Shinjuku (東京都区内), então não usem a Suica hoje. Sigam a placa **中央線快速 Chūō Line (Rapid)**, laranja, plataformas **7・8 東京方面**. Qualquer trem laranja dali vai para Tokyo. A placa **中央・総武線各駅停車** (amarela) é outra linha: não sigam essa.',
        'São 4 paradas: Yotsuya, Ochanomizu, Kanda e **Tokyo**, o fim da linha. Todo mundo desce.',
        'Em Tokyo o trem chega no alto (3º andar), do lado **Marunouchi**, e o Shinkansen fica do outro lado da estação. Desçam até o **corredor central** e sigam as placas **東海道新幹線 Tōkaidō Shinkansen**. **Não passem nenhuma catraca de saída (出口)** no caminho.',
      ],
    },
  ],
  'd2026-11-24': [
    walk(5, 'o hotel fica na frente da estação: entrem pelo **南口 (South Exit)**, no prédio novo **minamoa**, subam ao **2º andar** e passem a Suica no **中央改札口 (catraca central)**. Lá dentro, sigam a placa **山陽線 Sanyō Line · 岩国方面**: plataforma **1** (confiram no painel)'),
  ],
  'd2026-11-25': [
    walk(5, 'check-out feito, só com a mochila (as malas grandes já foram para Kyoto). Entrem pela **saída sul (南口)** da estação, subam ao 2º andar e atravessem pela passagem livre norte–sul (南北自由通路) seguindo as placas **新幹線 Shinkansen**: as catracas do Shinkansen ficam do lado norte'),
  ],
  'd2026-11-26': [walk(4, 'do hotel ao Ibuki, para o lado da Nippombashi')],
  'd2026-11-27': [
    walk(1, 'a oração é no hondō do próprio templo — é só descer o corredor de meia'),
  ],
  'd2026-11-28': [
    { mode: 'taxi', board: 'na porta do hotel', alight: 'Kiyomizu-dera (清水寺)', minutes: 12, cost: '~¥1.500', note: 'às 5h45 é o jeito certo; ônibus 206 (parada D2 da estação) só começa perto das 6h' },
  ],
  'd2026-11-29': [walk(2, 'o 7-Eleven da esquina do hotel, na Kawaramachi')],
  'd2026-11-30': [
    walk(6, 'subindo a Kawaramachi para o norte até a Oike-dōri: a estação **Kyoto-Shiyakusho-mae** (metrô Tōzai) fica embaixo, na frente da prefeitura'),
    {
      mode: 'metro', line: 'Tōzai Line (vermelho-alaranjado, T)', board: 'Kyoto-Shiyakusho-mae (京都市役所前)', boardPoint: '京都市役所前駅',
      direction: '太秦天神川 Uzumasa-Tenjingawa', alight: 'Karasuma-Oike (烏丸御池), 1ª parada', minutes: 2,
      steps: [
        'Passem a Suica e escolham a plataforma **太秦天神川方面 (Uzumasa-Tenjingawa)**. A do outro lado vai para 六地蔵 Rokujizō: não peguem essa.',
        'É **1 parada**: desçam em **烏丸御池 Karasuma-Oike**.',
        '**Não saiam da estação.** Sigam as placas **烏丸線 Karasuma Line** (verde, K): a baldeação é no mesmo prédio, sem passar catraca.',
      ],
    },
    {
      mode: 'metro', line: 'Karasuma Line (verde, K)', board: 'Karasuma-Oike, pela baldeação', direction: '京都・竹田 Kyoto · Takeda',
      alight: 'Kyoto (京都), 3ª parada', minutes: 6, cost: '¥260 no total',
      steps: [
        'Plataforma **京都・竹田方面 (Kyoto/Takeda)**. A do outro lado vai para 国際会館 Kokusaikaikan.',
        'Contem Shijō, Gojō e **Kyoto**, a 3ª. Desçam.',
        'O metrô fica no subsolo do lado norte (Karasuma). Passada a catraca, sigam as placas **近鉄線 Kintetsu**: ela fica do outro lado, no sul.',
      ],
    },
    walk(6, 'a Kintetsu fica **no 2º andar**, do lado Hachijō (sul), logo abaixo do Shinkansen — subam e atravessem a estação pela passagem livre do 2º andar (南北自由通路), seguindo a placa 近鉄線. Plataformas 1 a 4, e as máquinas de assento reservado (特急券) ficam ao lado da catraca'),
  ],
  'd2026-12-01': [
    walk(6, 'check-out feito e as malas grandes já despachadas do hotel para Ginza; com as malas de mão, subam a Kawaramachi até a Oike-dōri: a estação **Kyoto-Shiyakusho-mae** (metrô Tōzai) fica na frente da prefeitura'),
    {
      mode: 'metro', line: 'Tōzai Line (vermelho-alaranjado, T)', board: 'Kyoto-Shiyakusho-mae (京都市役所前)', boardPoint: '京都市役所前駅',
      direction: '太秦天神川 Uzumasa-Tenjingawa', alight: 'Karasuma-Oike (烏丸御池), 1ª parada', minutes: 2,
      steps: [
        'Plataforma **太秦天神川方面 (Uzumasa-Tenjingawa)**, como no dia 30.',
        '**1 parada**: desçam em **烏丸御池 Karasuma-Oike** e sigam as placas **烏丸線 Karasuma Line**, sem sair da estação.',
      ],
    },
    {
      mode: 'metro', line: 'Karasuma Line (verde, K)', board: 'Karasuma-Oike, pela baldeação', direction: '京都・竹田 Kyoto · Takeda',
      alight: 'Kyoto (京都), 3ª parada', minutes: 6, cost: '¥260 no total',
      steps: [
        'Plataforma **京都・竹田方面**. Contem Shijō, Gojō e **Kyoto**, a 3ª.',
        'Passada a catraca do metrô, sigam as placas **JR線 / 中央口 (Central)**: os armários ficam junto das catracas centrais da JR.',
      ],
    },
    walk(4, 'armários ao lado das catracas centrais: deixem as malas de mão aqui (¥400–700, moeda ou Suica) e guardem a chave/recibo'),
    {
      mode: 'train', line: 'JR Nara Line', board: 'Estação de Kyoto, plataformas 8 a 10', boardPoint: '京都駅 中央口',
      direction: '奈良方面 Nara', alight: 'Tōfukuji (東福寺), 1ª parada', alightPoint: 'JR東福寺駅', minutes: 2, cost: '¥150',
      note: 'o local (普通) e a みやこ路快速 param os dois em Tōfukuji: é a 1ª parada de qualquer trem da Nara Line',
      steps: [
        'Pela catraca **中央口 (Central)**, sigam a placa **奈良線 Nara Line**, plataformas **8 a 10**. Ficam longe das catracas: contem uns 5 minutos andando dentro da estação.',
        'No painel, o trem é da **奈良線** (destino 奈良, 宇治 ou 城陽). Confiram que 東福寺 está na lista de paradas.',
        'É **1 parada, 2 minutos**: desçam em **東福寺 Tōfukuji**. A Keihan tem uma estação com o mesmo nome colada: é só sair pela catraca da JR.',
      ],
    },
    walk(10, 'saindo, siga o fluxo para o sul pela rua em frente (Hommachi-dōri) até a ponte Gaun-kyō'),
  ],
  'd2026-12-02': [
    walk(8, 'do hotel até a saída **A13** da estação Ginza. No subsolo, sigam as placas **laranja G** (銀座線 Ginza Line)'),
    {
      mode: 'metro', line: 'Ginza Line (laranja, G)', board: 'Ginza (銀座), entrada A13', boardPoint: '銀座駅 A13出口',
      direction: '渋谷 Shibuya', alight: 'Gaiemmae (外苑前), 6ª parada', alightPoint: '外苑前駅', minutes: 13, cost: '¥180',
      note: 'se pularem a manhã opcional, o dia começa direto no curry: de Ginza, a pé pelo subsolo até Hibiya, e a Toei Mita (azul, I) sentido 西高島平 até **Jimbōchō**, 2 paradas, sem baldeação',
      steps: [
        'Plataforma **渋谷方面 (Shibuya)**, o trem **laranja**.',
        'Contem: Shimbashi, Toranomon, Tameike-sannō, Akasaka-mitsuke, Aoyama-itchōme e **Gaiemmae**, a 6ª. Desçam.',
        'Sigam as placas amarelas para **いちょう並木 (alameda de ginkgos) / 神宮外苑**. Saindo na avenida Aoyama, a alameda começa a poucos passos, com as árvores dos dois lados.',
      ],
    },
    walk(3, 'pela avenida Aoyama até a entrada da alameda (青山通り口). Daí é andar reto entre os ginkgos, na direção do prédio redondo do museu'),
  ],
  'd2026-12-03': [
    walk(8, 'com o check-out já feito e as malas na recepção, até a saída **A13** da Ginza; no subsolo, as placas **vermelhas M** (丸ノ内線) levam ao lado oeste da estação, uns 5 min'),
    {
      mode: 'metro', line: 'Marunouchi Line (vermelha, M)', board: 'Ginza (銀座), entrada A13', boardPoint: '銀座駅 A13出口',
      direction: '池袋 Ikebukuro', alight: 'Shin-Ōtsuka (新大塚), 8ª parada', alightPoint: '新大塚駅', minutes: 17, cost: '¥210',
      steps: [
        'Plataforma **池袋方面 (Ikebukuro)**, a mesma de ontem.',
        'Contem 8 paradas: Tokyo, Ōtemachi, Awajichō, Ochanomizu, Hongō-sanchōme, Kōrakuen, Myōgadani e **Shin-Ōtsuka**. Desçam.',
        'Em Shin-Ōtsuka cada sentido tem a sua catraca e a sua saída. Chegando deste lado, vocês saem pela **2番出口 (saída 2)**, do lado de Bunkyō.',
      ],
    },
    walk(5, 'atravessem a avenida para o lado de **Minami-Ōtsuka (豊島区)**, onde fica a saída 1, e sigam o mapa: o Nakiryu fica uns 300 m adiante, numa rua residencial, térreo do prédio SKY南大塚. Cheguem às 7:30'),
  ],
};

export const LEGS: Record<string, Leg[]> = {
  // ── 18 nov · chegada ──────────────────────────────────────────────
  'd18-haneda': [walk(5, 'siga as placas Keikyu Line, no sub-solo do T3; antes, comprem a Suica na máquina (ou usem a do celular)')],
  'd18-trem-shinjuku': [
    { mode: 'train', line: 'Keikyu Airport Line', board: 'Haneda T3, Keikyu no **B2** — do saguão de chegadas (2º) a escada desce direto no lado certo, o **trilho 2**', direction: 'Shinagawa · Higashi-Ginza · Asakusa', alight: 'Shinagawa', minutes: 15, cost: '¥330', note: 'as duas plataformas não se comunicam por dentro: se errar o lado, é sair e entrar de novo' },
    { mode: 'train', line: 'JR Yamanote', board: 'Shinagawa, plataforma 3 (pela catraca de baldeação Keikyu ⇄ JR, sem sair para a rua)', direction: 'Shibuya · Shinjuku', alight: 'Shinjuku', minutes: 19, cost: '¥253' },
    walk(10, 'saída leste e pela Yasukuni-dōri até o hotel, no Kabukichō: check-in e as malas grandes ficam no quarto'),
    walk(10, 'do hotel ao jantar sem mala: o Omoide Yokochō fica do lado oeste da estação, pela passagem sob os trilhos na Yasukuni-dōri'),
  ],
  'd18-ramen': [walk(3)],
  'd18-konbini': [walk(8, 'pela Yasukuni-dōri para o leste até o Kabukichō; o hotel fica a 3 min da Seibu-Shinjuku')],

  // ── 20 nov · Asakusa, Ueno, Yanaka, Akihabara ─────────────────────
  'd19-kuramae': [walk(3, 'o café fica na galeria Shin-Nakamise; o Kaminarimon, com a lanterna vermelha gigante, está uns 150 m a sudeste')],
  'd19-sensoji': [walk(12, 'saindo pelo lado oeste do salão principal: o Kagetsudō (melonpan, ¥280, abre às 9h) fica logo atrás do templo. Daí para o oeste até a Kappabashi-dōri; o cozinheiro gigante do prédio Niimi marca a ponta sul da rua')],
  'd19-kappabashi': [
    walk(5, 'da ponta sul da Kappabashi-dōri (o chef gigante) até a avenida Asakusa-dōri: a estação Tawaramachi fica embaixo dela'),
    {
      mode: 'metro', line: 'Ginza Line (laranja, G)', board: 'Tawaramachi (田原町)', boardPoint: '田原町駅',
      direction: '渋谷 Shibuya · 上野 Ueno', alight: 'Ueno (上野), 2ª parada', alightPoint: '上野駅 不忍口', minutes: 4, cost: '¥180',
      note: 'ou 20 min a pé pela Asakusa-dōri, se as pernas estiverem boas',
      steps: [
        '**Atenção:** em Tawaramachi cada sentido tem a sua escada, em lados opostos da avenida. Antes de descer, leiam a placa da entrada: tem que dizer **渋谷・上野方面 (Shibuya/Ueno)**. Se disser 浅草方面, é a escada do outro lado.',
        'Desçam na **2ª parada, Ueno**.',
        'Sigam as placas de saída para **上野公園 (Ueno Park)** e saiam do lado do **不忍口 (Shinobazu)**, de frente para a escadaria do parque.',
      ],
    },
    walk(15, 'subam a escadaria do parque (a estátua de Saigō Takamori com o cachorro fica lá no alto) e sigam reto pelo meio do parque, passando pela fonte, até o portão do museu no fundo'),
  ],
  'd19-museu-nacional': [walk(8, 'dentro do parque, descendo na direção do lago Shinobazu')],
  'd19-almoco-ueno': [walk(6, 'saída sul do parque; a rua é debaixo dos trilhos')],
  'd19-ameyoko': [
    {
      mode: 'train', line: 'JR Yamanote (verde-claro)', board: 'Okachimachi (御徒町), saída norte', boardPoint: '御徒町駅 北口',
      direction: '上野・池袋方面 (Ueno/Ikebukuro)', alight: 'Nippori (日暮里), 3ª parada, saída oeste (西口)', alightPoint: '日暮里駅 西口', minutes: 6, cost: '¥155',
      steps: [
        'Na JR Okachimachi, sigam a placa **山手線 Yamanote** (verde-claro), plataforma **上野・池袋方面**. Peguem a **Yamanote**, não a Keihin-Tōhoku azul: à tarde ela corre como rápido e pode pular estações.',
        'Contem: Ueno, Uguisudani e **Nippori**, a 3ª. Desçam.',
        'Subam a escada e sigam a placa amarela **西口 West Exit**. Não usem a saída leste nem a área da Keisei (a linha do aeroporto).',
      ],
    },
    walk(5, 'saindo do 西口, sigam a rua em frente, subindo, com o cemitério de Yanaka à direita; no fim da subida a rua desce numa escadaria curta — é a Yūyake Dandan, com a Yanaka Ginza embaixo'),
  ],
  'd19-yanaka': [
    walk(5, 'subam de volta a escadaria e a rua pelo mesmo caminho até a estação Nippori, saída oeste'),
    {
      mode: 'train', line: 'JR Yamanote (verde-claro)', board: 'Nippori (日暮里), saída oeste', boardPoint: '日暮里駅 西口',
      direction: '上野・東京方面 (Ueno/Tokyo)', alight: 'Akihabara (秋葉原), 4ª parada, saída Electric Town (電気街口)', alightPoint: '秋葉原駅 電気街口', minutes: 8, cost: '¥170',
      steps: [
        'Passem a Suica na catraca do **西口** e sigam a placa **山手線 Yamanote** (verde-claro), plataforma **上野・東京方面**.',
        'Contem: Uguisudani, Ueno, Okachimachi e **Akihabara**, a 4ª. Desçam.',
        'Sigam a placa amarela **電気街口 Electric Town**. Saindo, o Radio Kaikan fica bem na frente.',
      ],
    },
  ],
  'd19-akihabara': [walk(1, 'o Radio Kaikan está na frente da saída Electric Town')],
  'd19-radio-kaikan': [walk(6, 'pela Chūō-dōri para o norte, atrás do quarteirão do Don Quijote')],
  'd19-hanabusa': [walk(5, 'de volta à estação; o JINS fica no Atre, colado à estação')],
  'd19-oculos': [walk(10, 'para o sul pela rua paralela aos trilhos até Kanda; o Kikanbō fica a 3 min da estação Kanda')],
  'd19-jantar': [
    {
      mode: 'train', line: 'JR Chūō rápido (laranja)', board: 'Kanda (神田)', boardPoint: '神田駅 西口',
      direction: '新宿・八王子方面 (Shinjuku)', alight: 'Shinjuku (新宿), saída leste (東口)', alightPoint: '新宿駅 東口', minutes: 13, cost: '¥209',
      steps: [
        'Na JR Kanda, sigam a placa **中央線 Chūō Line** (laranja), plataforma **新宿方面 (Shinjuku)**. O trem do outro lado da mesma plataforma vai para Tokyo: confiram o painel.',
        'São 3 paradas (Ochanomizu, Yotsuya, **Shinjuku**). Desçam em Shinjuku.',
        'Em Shinjuku, sigam **só** as placas amarelas **東口 East Exit**. A estação é enorme: não saiam por outra.',
      ],
    },
    walk(10, 'saindo do 東口, atravessem a praça e sigam pela rua em frente até a Yasukuni-dōri; do outro lado começa o Kabukichō. O hotel fica no lado leste do bairro, perto da Meiji-dōri'),
  ],

  // ── 19 nov · Kamakura ─────────────────────────────────────────────
  'd20-trem-kamakura': [
    { mode: 'train', line: 'JR Shōnan-Shinjuku Line', board: 'Shinjuku, plataformas 1 e 2 (confirmem no painel: 大崎・横浜・大船・逗子方面)', direction: 'Zushi (逗子)', alight: 'Kita-Kamakura', minutes: 55, cost: '~¥1.000', note: 'só o trem que vai a ZUSHI passa por Kamakura; o que vai a Odawara não. Desçam uma estação antes de Kamakura' },
    walk(1, 'o Engaku-ji fica colado à estação: há uma catraca extra na ponta da plataforma (6:30–21:30, **só cartão IC**) que sai quase no portão do templo'),
  ],
  'd20-engakuji': [walk(15, 'pela rua principal (Kenchō-ji fica no caminho para Kamakura), calçada à direita')],
  'd20-kenchoji': [walk(12, 'seguindo a mesma rua para o sul; o santuário aparece à esquerda')],
  'd20-hachimangu': [walk(3, 'a Komachi-dōri começa no torii vermelho grande, do lado direito da avenida')],
  'd20-komachi': [walk(8, 'descendo a Komachi-dōri até a Estação Kamakura; a Enoden fica no lado oeste, com bilheteria própria')],
  'd20-enoden': [
    { mode: 'train', line: 'Enoden', board: 'Kamakura (Enoden), lado oeste', direction: 'Fujisawa', alight: 'Hase (3ª parada)', minutes: 5, cost: '¥200', note: 'desde julho de 2026 a catraca interna de baldeação JR ⇄ Enoden aceita **só cartão IC**. Com Suica, passem por dentro; sem, saiam pela saída leste e entrem pela catraca oeste do Enoden' },
    walk(8, 'para o norte na saída; o Kōtoku-in está no fim da rua'),
  ],
  'd20-daibutsu': [walk(6, 'de volta pela mesma rua; Hase-dera à direita')],
  'd20-hasedera': [walk(5, 'até a estação Hase')],
  'd20-volta': [
    { mode: 'train', line: 'Enoden', board: 'Hase', direction: 'Kamakura', alight: 'Kamakura (final)', minutes: 5, cost: '¥200' },
    { mode: 'train', line: 'JR Shōnan-Shinjuku Line', board: 'Kamakura', direction: 'Shinjuku · Ōmiya', alight: 'Shinjuku', minutes: 60, cost: '~¥1.000', note: 'se o próximo for só até Ōfuna, troquem lá para o Shōnan-Shinjuku' },
    walk(12, 'saída leste e pela Yasukuni-dōri até o Kabukichō'),
  ],

  // ── 21 nov · Tsukiji, Ginza, Estação de Tóquio ─────────────────────
  'd21-tsukiji': [walk(10, 'para o sudoeste, atravessando a avenida Shin-Ōhashi-dōri. Vindo de Tsukiji, a entrada mais perto é a **中の御門 (Naka-no-gomon)**; a outra, o **大手門 (Ōtemon)**, fica do lado de Shiodome. As duas vendem o bilhete')],
  'd21-hamarikyu': [walk(15, 'pela saída Ōtemon, passando por Shiodome, até a Ginza 4-chōme: o Mitsukoshi é a esquina em frente ao relógio do Wakō, e o depachika é no subsolo')],
  'd21-almoco-ginza': [walk(5, 'do Mitsukoshi, subam a avenida Chūō para o norte até a Ginza 2-chōme; a JINS fica no 3º andar do prédio Belvia (銀座ベルビア館), perto da saída A5 da estação Ginza')],
  'd21-oculos': [walk(3, 'de volta à avenida Chūō: o quadrilátero é ela e as paralelas. Retirada dos óculos por volta das 15:00')],
  'd21-ginza': [
    {
      mode: 'metro', line: 'Marunouchi Line (vermelha, M)', board: 'Ginza (銀座)', boardPoint: '銀座駅',
      direction: '池袋 Ikebukuro', alight: 'Tokyo (東京), 1ª parada', alightPoint: 'KITTE丸の内', minutes: 2, cost: '¥180',
      note: 'ou 15 min a pé pela Yūrakuchō, passando debaixo dos trilhos',
      steps: [
        'Em Ginza, desçam por qualquer entrada com o **M vermelho** (丸ノ内線). Plataforma **池袋方面 (Ikebukuro)**.',
        'É só **1 parada**: desçam em **東京 Tokyo**.',
        'Pelo subsolo, sigam as placas **KITTE / JPタワー**. O KITTE é ligado à estação por baixo, sem precisar sair na rua.',
        'No KITTE: o **terraço é no 6º andar** (elevador no átrio central); o Nemuro Hanamaru fica no 5º.',
      ],
    },
  ],
  'd21-kitte': [walk(8, 'se forem à Ramen Street: atravessem a estação pela **passagem livre norte**, no nível da rua, do lado Marunouchi ao Yaesu — é grátis e não passa catraca. A Ramen Street fica no B1 do First Avenue, também fora das catracas')],
  'd21-jantar-estacao': [
    walk(3, 'do KITTE, a entrada da JR mais perto é a **丸の内南口 (Marunouchi Sul)**, a cúpula do prédio de tijolo vermelho, bem ao lado. Se jantaram na Ramen Street, entrem pela catraca **八重洲中央口 (Yaesu Central)**, que fica ali mesmo'),
    {
      mode: 'train', line: 'JR Yamanote (verde-claro)', board: 'Tokyo (東京), catraca Marunouchi Sul', boardPoint: '東京駅 丸の内南口',
      direction: '品川・渋谷方面 (Shinagawa/Shibuya)', alight: 'Ebisu (恵比寿), 10ª parada, saída oeste (西口)', alightPoint: '恵比寿駅 西口', minutes: 20, cost: '¥253',
      steps: [
        'Passada a catraca, sigam a placa **山手線 Yamanote** (verde-claro) e escolham a plataforma **品川・渋谷方面**. A Estação de Tóquio tem mais de 20 plataformas: só olhem a placa verde-clara.',
        'São 10 paradas, uns 20 minutos. A 6ª é Shinagawa. Desçam em **恵比寿 Ebisu**.',
        'Sigam a placa amarela **西口 West Exit**.',
      ],
    },
    walk(5, 'saindo do 西口, o Uchino Building fica na Ebisu-Nishi, a poucas quadras; o bar é no 4º andar'),
  ],
  'd21-bar-triad': [
    walk(5, 'de volta à estação Ebisu, entrada **西口 (oeste)**'),
    {
      mode: 'train', line: 'JR Yamanote (verde-claro)', board: 'Ebisu (恵比寿), saída oeste', boardPoint: '恵比寿駅 西口',
      direction: '渋谷・新宿方面 (Shibuya/Shinjuku)', alight: 'Shinjuku (新宿), 4ª parada, saída leste (東口)', alightPoint: '新宿駅 東口', minutes: 11, cost: '¥199',
      note: 'passa da meia-noite? O último trem da Yamanote sai por volta de 00:30; depois disso é táxi (~¥2.500 até o Kabukichō)',
      steps: [
        'Sigam a placa **山手線 Yamanote** (verde-claro), plataforma **渋谷・新宿方面**.',
        'Contem Shibuya, Harajuku, Yoyogi e **Shinjuku**, a 4ª. Desçam.',
        'Em Shinjuku, sigam **só** as placas amarelas **東口 East Exit**, como no dia 20.',
      ],
    },
    walk(10, 'saindo do 東口, atravessem a praça e sigam em frente até a Yasukuni-dōri; do outro lado é o Kabukichō, e o hotel fica no lado leste, perto da Meiji-dōri'),
  ],

  // ── 22 nov · Meiji, Omotesandō, Shibuya ────────────────────────────
  'd22-meiji-jingu': [walk(5, 'de volta pelo caminho de saibro até o torii sul e a ponte Jingūbashi: do outro lado, em frente à JR Harajuku, começa a **Omotesandō**, a avenida larga de zelkovas que desce para o sudeste')],
  'd22-omotesando': [walk(8, 'o Afuri fica numa transversal, perto da estação Harajuku — sigam o mapa')],
  'd22-almoco': [
    walk(8, 'descendo a Omotesandō até o cruzamento com a Aoyama-dōri: a estação **Omote-sandō** fica embaixo. Desçam por uma entrada com o **G laranja** (銀座線)'),
    {
      mode: 'metro', line: 'Ginza Line (laranja, G)', board: 'Omote-sandō (表参道)', boardPoint: '表参道駅',
      direction: '浅草 Asakusa', alight: 'Gaienmae (外苑前), 1ª parada, saída 4a', alightPoint: '外苑前駅 4a出口', minutes: 2, cost: '¥180',
      note: 'ou 20 min a pé pela Aoyama-dōri',
      steps: [
        'Plataforma **浅草方面 (Asakusa)**. Atenção: nela param **dois** trens, um de cada lado — o **laranja** da Ginza Line e o **roxo** da Hanzōmon (押上方面). Peguem o **laranja**.',
        'É só **1 parada**: desçam em **外苑前 Gaienmae**.',
        'Sigam a catraca **外苑いちょう並木方面** e a placa amarela **4a出口 (saída 4a)**.',
      ],
    },
    walk(3, 'saindo da 4a, na Aoyama-dōri, a alameda de ginkgos sai da própria Aoyama-dōri, a poucos passos — é impossível errar: é a rua amarela'),
  ],
  'd22-gaien': [
    walk(5, 'de volta pela alameda até a Aoyama-dōri e a entrada **4a** da Gaienmae'),
    {
      mode: 'metro', line: 'Ginza Line (laranja, G)', board: 'Gaienmae (外苑前), entrada 4a', boardPoint: '外苑前駅 4a出口',
      direction: '渋谷 Shibuya', alight: 'Shibuya (渋谷), fim da linha, saída Hachikō (ハチ公口)', alightPoint: '渋谷駅 ハチ公口', minutes: 6, cost: '¥180',
      steps: [
        'Plataforma **渋谷方面 (Shibuya)**. Fiquem até o **fim da linha**: Omote-sandō e **Shibuya**, a 2ª.',
        'Em Shibuya a Ginza Line chega no alto, no 3º andar, por cima da Meiji-dōri. Saiam pela catraca **渋谷スクランブルスクエア方面** (o lado da JR), **não** pela 明治通り方面, que leva à Hikarie.',
        'Depois, sigam as placas amarelas **ハチ公口 Hachikō**, descendo até a rua. Saindo, a estátua do cachorro e o cruzamento estão na frente.',
      ],
    },
    walk(7, 'atravessem o cruzamento na diagonal até a Center-gai (a rua que sai ao lado do prédio do Starbucks/Tsutaya) e subam por ela; no fim, virem à direita: o PARCO fica ali'),
  ],
  'd22-parco': [walk(5, 'descendo a Center-gai de volta; o cruzamento está no fim dela')],
  'd22-cruzamento': [walk(5, 'o **Mark City** é o prédio colado à estação, do lado oeste, onde chega a linha Inokashira. O sushi fica no **4º andar da East Mall** (マークシティ イースト 4F)')],
  'd22-jantar': [
    walk(3, 'de dentro do Mark City, pelo **西口連絡通路** (a passagem do lado oeste), até a catraca **中央改札** da JR, no 3º andar'),
    {
      mode: 'train', line: 'JR Yamanote (verde-claro)', board: 'Shibuya (渋谷), catraca central', boardPoint: '渋谷駅',
      direction: '新宿・池袋方面 (Shinjuku/Ikebukuro)', alight: 'Shinjuku (新宿), 3ª parada, saída leste (東口)', alightPoint: '新宿駅 東口', minutes: 7, cost: '¥199',
      steps: [
        'Sigam a placa **山手線 Yamanote** (verde-claro). Em Shibuya os **dois sentidos usam a mesma plataforma**, um de cada lado: leiam o painel e peguem o lado **新宿・池袋方面**. O outro vai para Ebisu e Shinagawa.',
        'Contem Harajuku, Yoyogi e **Shinjuku**, a 3ª. Desçam.',
        'Em Shinjuku, sigam **só** as placas amarelas **東口 East Exit**, como nos outros dias.',
      ],
    },
    walk(10, 'saindo do 東口, atravessem a praça e sigam em frente até a Yasukuni-dōri; do outro lado é o Kabukichō, e o hotel fica no lado leste, perto da Meiji-dōri'),
  ],

  // ── 23 nov · Shinkansen e Hiroshima ────────────────────────────────
  'd23-konbini': [walk(8, 'ainda dentro das catracas da JR, pelo **corredor central** (中央通路), sigam as placas **東海道新幹線** até a catraca de baldeação **新幹線中央のりかえ口**, no lado **Yaesu**. Ali **ponham o bilhete de papel** na fenda e peguem de volta. As plataformas 14 a 19 ficam altas e longe — contem os 8 minutos. O **Ekibenya Matsuri** (5:30–22:00, 150 tipos de ekiben) fica **antes** dessa catraca, na passagem central, entre as escadas das plataformas 5–6 e 7–8: comprem o ekiben antes de passar')],
  'd23-trem-hiroshima': [
    {
      mode: 'shinkansen', line: 'Nozomi 9 (のぞみ9号) · 07:12', board: 'Tokyo (東京), plataforma do painel (14–19), carro 3',
      direction: '博多 Hakata ou 広島 Hiroshima', alight: 'Hiroshima (広島), catraca do Shinkansen no 2º andar', alightPoint: '広島駅 新幹線口',
      minutes: 230, cost: '¥19.960 cada, já pago',
      steps: [
        'No painel, procurem **のぞみ 9号**, **7:12**, destino **博多 Hakata**. Subam à plataforma que o painel indicar (14 a 19).',
        'Na plataforma, andem até a marca do chão **3号車 (carro 3)**. O carro 3 fica perto da **ponta da frente do trem** (a do lado de Shinagawa, para onde o trem vai): sigam os números pintados no chão e as placas penduradas, e contem uns 3 minutos de caminhada pela plataforma. Fileira **9**, assentos **A–C**.',
        'O Fuji fica do **lado direito**, o dos assentos D–E, que estavam esgotados: uns 40 min depois de sair, vão até a **porta do lado direito no corredor entre os carros (デッキ)** e olhem pela janela da porta.',
        'A parada antes de Hiroshima é Okayama ou Fukuyama: o anúncio em inglês avisa. Desçam, sigam as placas amarelas **出口 Exit**, desçam ao **2º andar** e passem a **catraca do Shinkansen** (o mesmo IC ou o bilhete).',
      ],
    },
    walk(1, 'a **Pokémon Center** fica **ao lado da catraca do Shinkansen**, no 2º andar do **ekie** (lado norte da estação): saindo da catraca, é logo ali'),
  ],
  'd23-pokemon-center': [
    walk(5, 'do ekie, atravessem a estação pelo **corredor livre do 2º andar (南北自由通路)** até o lado sul, o prédio novo **minamoa**, e desçam à rua pelo **南口 (South Exit)**. O APA fica na frente da estação, para o lado da ponte **Ekimae-Ōhashi (駅前大橋)**'),
  ],
  'd23-chegada': [
    walk(4, 'de volta à estação pelo **南口**: o bonde fica no **2º andar do minamoa**, no mesmo nível das catracas da JR. Subam e sigam as placas **路面電車 · 広電 Hiroden**'),
    {
      mode: 'tram', line: 'bonde 2 ou 6 (Hiroden)', board: 'Hiroshima Station (広島駅), 2º andar do minamoa', boardPoint: '広島駅 南口',
      direction: '宮島口 Miyajimaguchi (2) · 江波 Eba (6)', alight: 'Genbaku-Dōmu-mae (原爆ドーム前)', minutes: 15,
      cost: '¥240 · IC: encostem ao embarcar e ao descer',
      note: 'a linha 1 NÃO passa no Domo: ela vira para o sul em Kamiyachō',
      steps: [
        'O terminal tem várias plataformas, cada uma com placa do número e destino. Procurem a do **2 宮島口** ou a do **6 江波**: os dois passam no Domo. **Não peguem o 1 (広島港 Hiroshima-kō) nem o 5**: eles viram para o sul antes.',
        'Pagamento: desde julho de 2026 a Suica é encostada no leitor **ao embarcar e ao descer**, e dá para usar **qualquer porta**. Sem IC, paguem **¥240 em dinheiro ao descer**, na porta do motorista.',
        'Desçam em **原爆ドーム前 Genbaku-Dōmu-mae**, uns 15 min: o painel dentro do bonde mostra o nome, e o Domo fica ao lado da parada.',
      ],
    },
    walk(8, 'da parada, desçam ao longo do rio (元安川) para o sul, com o Domo atrás de vocês, e atravessem a ponte **元安橋 Motoyasu-bashi** para dentro do parque. Sigam o eixo do parque até o fundo: a entrada do museu é pelo **Prédio Leste (東館)**'),
  ],
  'd23-museu-paz': [walk(5, 'pelo eixo do parque: cenotáfio, chama, e a ponte até o Domo')],
  'd23-parque-domo': [walk(3, 'o Nagataya fica na rua ao lado do Domo')],
  'd23-okonomiyaki': [
    walk(3, 'até a parada **Genbaku-Dōmu-mae**, ao lado do Domo: para voltar, é a plataforma com a placa **広島駅方面 (Hiroshima Station)**'),
    {
      mode: 'tram', line: 'bonde 2 ou 6 (Hiroden)', board: 'Genbaku-Dōmu-mae (原爆ドーム前), plataforma 広島駅方面',
      direction: '広島駅 Hiroshima Station', alight: 'Hiroshima Station (広島駅), fim da linha', alightPoint: '広島駅 南口',
      minutes: 18, cost: '¥240', note: 'táxi ~¥1.500 se estiverem mortos',
      steps: [
        'Peguem qualquer bonde com letreiro **広島駅 Hiroshima Station**. Encostem a Suica ao entrar.',
        'É o **fim da linha**: o bonde entra no 2º andar do **minamoa**. Encostem a Suica ao descer.',
        'Desçam ao térreo e saiam pelo **南口 (South Exit)**: o hotel fica na frente, para o lado da ponte Ekimae-Ōhashi.',
      ],
    },
    walk(5, 'do 南口 até o hotel, para o lado da ponte Ekimae-Ōhashi'),
  ],

  // ── 24 nov · Miyajima ──────────────────────────────────────────────
  'd24-ferry-miyajima': [
    {
      mode: 'train', line: 'JR Sanyō Line (山陽本線)', board: 'Hiroshima (広島), plataforma 1, pelo 中央改札口 (2º andar)', boardPoint: '広島駅 南口',
      direction: '岩国方面 (Iwakuni) · 宮島口 Miyajimaguchi', alight: 'Miyajimaguchi (宮島口)', alightPoint: '宮島口駅', minutes: 27, cost: '¥420',
      steps: [
        'Plataforma **1**, sentido **岩国方面**. Os trens para **岩国 Iwakuni**, **大竹 Ōtake** ou **徳山 Tokuyama** e o rápido **City Liner** param em Miyajimaguchi. Só não peguem um que termine em **五日市 Itsukaichi** ou **廿日市 Hatsukaichi**: esses param antes.',
        'No trem local, Miyajimaguchi é a **9ª parada** (Shin-Hakushima, Yokogawa, Nishi-Hiroshima, Shin-Inokuchi, Itsukaichi, Hatsukaichi, Miyauchi-Kushido, Ajina e **Miyajimaguchi**); o City Liner pula algumas. Ouçam **宮島口** no anúncio.',
        'Em Miyajimaguchi há uma catraca só: passem a Suica e saiam.',
      ],
    },
    walk(6, 'saindo da estação, sigam as placas **Ferry**: a passagem subterrânea passa por baixo da avenida e leva direto ao terminal das balsas (宮島口旅客ターミナル). Lá, as duas companhias ficam lado a lado: placa vermelha = balsa **JR** (a azul é a Matsudai)'),
    {
      mode: 'ferry', line: 'balsa JR', board: 'Miyajimaguchi (宮島口), terminal das balsas, catraca da JR', boardPoint: '宮島口旅客ターミナル',
      alight: 'Miyajima (宮島桟橋)', minutes: 10,
      cost: '¥200 + ¥100 de taxa de visitante, os dois descontados do IC na catraca',
      steps: [
        'Na catraca da **JR** (não a da Matsudai), encostem a Suica: ela desconta **¥200 da balsa + ¥100 da taxa de visitante (宮島訪問税)** de uma vez. Não precisa comprar bilhete.',
        'Até as 16:10 a balsa faz a rota do torii (**大鳥居便**): fiquem do **lado direito** do convés, de preferência do lado de fora.',
        'Desembarcam pela mesma rampa por onde todos saem; o terminal de Miyajima tem uma saída só, para a orla.',
      ],
    },
    walk(14, 'saindo do terminal de Miyajima, virem à **direita** e sigam pela orla, com os cervos, até o portão do santuário'),
  ],
  'd24-itsukushima': [walk(10, 'saindo pelo lado oposto da entrada, subida pelas escadas ao lado do pagode')],
  'd24-daishoin': [walk(12, 'descendo e seguindo o riacho para o vale dos bordos')],
  'd24-momijidani': [
    walk(10, 'subida a pé pelo parque até a estação Momijidani do teleférico — o micro-ônibus gratuito da entrada do parque não roda entre 12:10 e 13:10, e é justamente a hora de vocês'),
    { mode: 'cable', line: 'Miyajima Ropeway (2 trechos)', board: 'Momijidani', alight: 'Shishiiwa', minutes: 15, cost: '¥2.000 ida e volta', note: 'troca de cabine em Kayatani; do topo do teleférico ao cume real são mais 30 min a pé. Terça não exige reserva de horário (só fins de semana e o feriado 23)' },
  ],
  'd24-misen': [
    walk(30, 'de volta do cume ao teleférico'),
    { mode: 'cable', line: 'Miyajima Ropeway', board: 'Shishiiwa', alight: 'Momijidani', minutes: 15, note: 'o site hoje diz última descida 16:30 (subida até 16:00): confirmem na cabine ao subir' },
    walk(15, 'até a rua de comércio (Omotesandō)'),
  ],
  'd24-comer-miyajima': [
    walk(10, 'de volta pela rua de comércio e pela orla até o terminal das balsas (宮島桟橋), o mesmo onde chegaram'),
    {
      mode: 'ferry', line: 'balsa JR', board: 'Miyajima (宮島桟橋), catraca da JR', alight: 'Miyajimaguchi (宮島口)', minutes: 10, cost: '¥200',
      steps: [
        'No terminal, a catraca da **JR** é a da placa vermelha. Encostem a Suica: na volta é só a tarifa, a taxa de visitante já foi cobrada na ida.',
        'Para caber o Shukkei-en, a balsa é a das **15:00**.',
        'Em Miyajimaguchi, a passagem subterrânea leva de volta à estação JR, do outro lado da avenida.',
      ],
    },
    {
      mode: 'train', line: 'JR Sanyō Line (山陽本線)', board: 'Miyajimaguchi (宮島口)', boardPoint: '宮島口駅',
      direction: '広島方面 (Hiroshima)', alight: 'Hiroshima (広島), saída norte (新幹線口)', alightPoint: '広島駅 新幹線口', minutes: 27, cost: '¥420',
      steps: [
        'Passem a Suica e sigam a placa **広島方面 (Hiroshima)**. Todo trem desse sentido para em Hiroshima.',
        'No trem local, Hiroshima é a **9ª parada**, uns 27 min. Ali desce quase todo mundo.',
        'Subam ao corredor do 2º andar, passem o **中央改札口** e virem para o lado **北口 · 新幹線口 (norte)**, o lado do ekie. **Não saiam pelo 南口**, que é o lado do hotel.',
      ],
    },
    walk(15, 'saindo pelo 新幹線口, para o oeste ao longo da avenida; o jardim fica colado ao museu de arte da província (広島県立美術館)'),
  ],
  'd24-shukkeien': [
    {
      mode: 'tram', line: 'bonde 9 (Hiroden)', board: 'Shukkeien-mae (縮景園前)', direction: '八丁堀 Hatchōbori',
      alight: 'Hatchōbori (八丁堀), fim da linha 9', minutes: 4, cost: '¥240',
      note: 'desde março de 2026 a linha 9 passa só a cada ~18 min; se não vier, são 15 min a pé',
      steps: [
        'A parada fica na avenida perto da entrada do jardim. O 9 é um bonde pequeno que só faz **白島 Hakushima ↔ 八丁堀 Hatchōbori**: peguem o do sentido **八丁堀**.',
        'Encostem a Suica ao subir e ao descer.',
        'Desçam no **fim da linha, 八丁堀 Hatchōbori**.',
      ],
    },
    walk(5, 'o Bakudan-ya fica nas ruas atrás da Hondōri'),
  ],
  'd24-jantar': [
    walk(5, 'até a parada **Hatchōbori**, na avenida dos bondes (相生通り Aioi-dōri): é a plataforma com a placa **広島駅方面**'),
    {
      mode: 'tram', line: 'bonde 1, 2 ou 6 (Hiroden)', board: 'Hatchōbori (八丁堀), plataforma 広島駅方面', direction: '広島駅 Hiroshima Station',
      alight: 'Hiroshima Station (広島駅), fim da linha', alightPoint: '広島駅 南口', minutes: 12, cost: '¥240', note: 'ou 20 min a pé pela avenida',
      steps: [
        'Peguem qualquer bonde com letreiro **広島駅 Hiroshima Station**. Encostem a Suica ao subir e ao descer.',
        'É o **fim da linha**, no 2º andar do **minamoa**.',
        'Desçam ao térreo e saiam pelo **南口 (South Exit)**: o hotel fica na frente.',
      ],
    },
    walk(5, 'do 南口 até o hotel, para o lado da ponte Ekimae-Ōhashi'),
  ],

  // ── 25 nov · Kurashiki, Himeji, Osaka ──────────────────────────────
  'd25-trem-kurashiki': [
    {
      mode: 'shinkansen', line: 'Sanyō Shinkansen (Nozomi, Sakura ou Hikari)', board: 'Hiroshima (広島), plataformas 13–14', boardPoint: '広島駅 新幹線改札',
      direction: '新大阪・東京方面 (Shin-Osaka/Tokyo)', alight: 'Okayama (岡山)', minutes: 38, cost: '~¥6.000',
      steps: [
        'Passem o bilhete na catraca do **新幹線** e sigam a placa **13・14番線 新大阪・東京方面**. As plataformas 11 e 12 vão para Hakata: não subam nelas.',
        'O painel mostra o horário e o número do carro; com assento reservado, esperem na marca do carro no chão.',
        'Desçam em **岡山 Okayama** (~38 min). Fiquem atentos: o trem segue para Shin-Osaka.',
      ],
    },
    {
      mode: 'train', line: 'JR Sanyō Line (山陽線) ou Hakubi Line (伯備線), local', board: 'Okayama, plataformas 1–2', boardPoint: '岡山駅',
      direction: '倉敷・福山方面 (Kurashiki/Fukuyama)', alight: 'Kurashiki (倉敷), 4ª parada', alightPoint: '倉敷駅 南口', minutes: 17, cost: '¥330',
      steps: [
        'Na plataforma, sigam a placa **在来線のりかえ (baldeação para as linhas comuns)** e desçam até a catraca de baldeação **新幹線乗換口**: o bilhete do Shinkansen fica nela, e daí vocês pagam com a Suica.',
        'Sigam para as **plataformas 1–2 (山陽線 倉敷・福山方面 / 伯備線)**. Servem os dois: o local do Sanyō e o do Hakubi param em Kurashiki. **Não** peguem o 特急やくも (Yakumo), que cobra taxa extra.',
        'Contem: Kitanagase, Niwase, Nakashō e **倉敷 Kurashiki**, a 4ª. Desçam.',
        'Saiam pela placa amarela **南口 (saída sul)**, do lado do bairro Bikan.',
      ],
    },
    walk(12, 'a catraca é no 2º andar; os armários ficam no corredor, do lado da saída norte (ao lado da padaria Little Mermaid). Depois **南口 (saída sul)**, e reto pela Kurashiki Chūō-dōri até o canal'),
  ],
  'd25-bikan': [walk(5, 'do canal, subam pela escadaria de pedra do **morro Tsurugata**, atrás da Honmachi: o torii do santuário aparece no topo')],
  'd25-achi': [walk(10, 'desçam a escada e sigam a margem do canal para o sul, passando a ponte **Nakabashi**: a Denim Street fica na margem, e a Ivy Square (tijolo vermelho) logo depois, do outro lado da rua')],
  'd25-ivy': [walk(15, 'às 11:00, de volta à estação pela rua coberta **Ebisu-dōri** (えびす通り商店街), para o norte; pegar a mochila no armário e entrar pela catraca do 2º andar')],
  'd25-trem-himeji': [
    {
      mode: 'train', line: 'JR Sanyō Line (山陽線) ou Hakubi Line (伯備線), local', board: 'Kurashiki (倉敷)', boardPoint: '倉敷駅',
      direction: '岡山方面 (Okayama)', alight: 'Okayama (岡山), 4ª parada', minutes: 17, cost: '¥330',
      steps: [
        'Passem a Suica e sigam a placa **岡山方面 (Okayama)**. Os trens do Sanyō e do Hakubi vão os dois para Okayama; o painel mostra 岡山.',
        'Contem: Nakashō, Niwase, Kitanagase e **岡山 Okayama**, a 4ª (é o fim de quase todos). Desçam.',
      ],
    },
    {
      mode: 'shinkansen', line: 'Hikari ou Sakura (o Nozomi em regra não para em Himeji)', board: 'Okayama, plataformas 23–24', boardPoint: '岡山駅 新幹線乗換口',
      direction: '新大阪・東京方面 (Shin-Osaka/Tokyo)', alight: 'Himeji (姫路), plataforma 11', alightPoint: '姫路駅 北口', minutes: 20, cost: '~¥3.500',
      steps: [
        'Em Okayama, sigam a placa **新幹線のりかえ** até a catraca de baldeação **新幹線乗換口**: passem a Suica e o bilhete do Shinkansen juntos (ou o QR do Smart EX).',
        'Subam para as **plataformas 23–24, 新大阪・東京方面**. As 21–22 vão para Hiroshima.',
        'Confiram no painel que o trem **para em 姫路 Himeji** (Hikari ou Sakura); são ~20 min.',
        'Em Himeji, desçam ao **中央改札 (catraca central)** e sigam a placa amarela **北口 (saída norte) · 姫路城 Himeji-jō**.',
      ],
    },
    walk(3, 'saindo pelo 北口, os armários 24h ficam na própria saída norte: guardem a mochila. O almoço é aqui em volta, e o castelo já aparece no fim da avenida'),
  ],
  'd25-almoco-himeji': [walk(15, 'reto pela avenida **Ōtemae** (大手前通り) para o norte; o castelo está no fim, à vista o tempo todo (ou ônibus circular ¥100 até Ōtemon)')],
  'd25-himeji': [walk(5, 'saindo do castelo, voltem ao portão **Ōtemon** e virem à esquerda (oeste) pela margem do fosso: a entrada do Kōko-en fica a uns 300 m')],
  'd25-kokoen': [walk(20, 'de volta pelo fosso até a avenida Ōtemae e reto até o 北口 da estação; pegar a mochila no armário')],
  'd25-trem-osaka': [
    {
      mode: 'train', line: 'JR Kobe Line · Special Rapid (新快速)', board: 'Himeji (姫路), catraca central', boardPoint: '姫路駅 中央改札',
      direction: '大阪・京都方面 (Osaka/Kyoto)', alight: 'Osaka (大阪), 8ª parada', alightPoint: '大阪駅 御堂筋南口', minutes: 60, cost: '¥1.520',
      note: 'sem reserva; entrem pela ponta do trem para achar lugar',
      steps: [
        'Passem a Suica no **中央改札** e sigam a placa **JR神戸線 大阪・京都方面**. O painel tem de dizer **新快速 (Special Rapid)**, em letras vermelhas ou laranja.',
        'Evitem o carro com a placa **Aシート**: é assento pago à parte.',
        'Paradas: Kakogawa, Nishi-Akashi, Akashi, Kobe, Sannomiya, Ashiya, Amagasaki e **大阪 Osaka**, a 8ª. Desçam.',
        'Em Osaka, sigam as placas **御堂筋線 Midōsuji Line (vermelho, M)** e saiam pela catraca **御堂筋南口 (Midōsuji Sul)**: a entrada do metrô é logo ali, 2 min.',
      ],
    },
    {
      mode: 'metro', line: 'Midōsuji Line (vermelha, M)', board: 'Umeda (梅田), plataforma 1', boardPoint: '梅田駅 南改札',
      direction: 'なんば・天王寺方面 (Namba/Tennōji)', alight: 'Namba (なんば), 4ª parada', minutes: 8,
      steps: [
        'Desçam pela entrada com o círculo **vermelho M** (御堂筋線) e passem a Suica. Plataforma **1, なんば・天王寺方面**.',
        'Contem: Yodoyabashi, Hommachi, Shinsaibashi e **なんば Namba**, a 4ª. Desçam.',
        '**Não saiam da estação**: sigam as placas **rosa com S** (千日前線 Sennichimae Line), uma troca curta, sem passar catraca.',
      ],
    },
    {
      mode: 'metro', line: 'Sennichimae Line (rosa, S)', board: 'Namba, pela baldeação', direction: '南巽 Minami-Tatsumi',
      alight: 'Nippombashi (日本橋), 1ª parada, saída 2', alightPoint: '日本橋駅 2番出口', minutes: 3, cost: '¥240 no total (o metrô cobra uma tarifa só)',
      note: 'ou de Namba a pé, uns 10 min para o leste, se a mochila deixar',
      steps: [
        'Plataforma **南巽方面 (Minami-Tatsumi)**. A do outro lado vai para Nodahanshin: não peguem essa.',
        'É **1 parada**: desçam em **日本橋 Nippombashi**.',
        'Sigam a placa amarela **2番出口 (saída 2)**. O hotel fica a 1 minuto dela.',
      ],
    },
    walk(1, 'saindo da saída 2, o KOKO HOTEL fica logo ali (Sennichimae 1-3-7). Check-in, banho rápido, e de volta à mesma estação'),
    {
      mode: 'metro', line: 'Sakaisuji Line (marrom, K)', board: 'Nippombashi (日本橋)', boardPoint: '日本橋駅',
      direction: '天下茶屋方面 (Tengachaya)', alight: 'Ebisuchō (恵美須町), 1ª parada, saída 3', alightPoint: '恵美須町駅 3番出口', minutes: 2, cost: '¥190',
      note: 'ou a pé, uns 20 min para o sul pela Sakaisuji, passando pela Den Den Town',
      steps: [
        'Desçam pela entrada com o **K marrom** (堺筋線). A Sennichimae (rosa, S) passa na mesma estação: não é essa.',
        'Plataforma **天下茶屋方面 (Tengachaya)**. É **1 parada**: desçam em **恵美須町 Ebisuchō**.',
        'Sigam a placa amarela **3番出口 (saída 3) · 通天閣**. A torre aparece assim que vocês sobem.',
      ],
    },
    walk(5, 'da saída 3, reto para o sul pela rua de letreiros até o pé do **Tsūtenkaku**; a Jan-Jan Yokochō e o Daruma original ficam do outro lado da torre, perto da estação Dōbutsuen-mae'),
  ],
  'd25-shinsekai': [
    walk(6, 'de volta até a estação **Ebisuchō**, ao norte da torre'),
    {
      mode: 'metro', line: 'Sakaisuji Line (marrom, K)', board: 'Ebisuchō (恵美須町)', boardPoint: '恵美須町駅',
      direction: '天神橋筋六丁目方面 (Tenjimbashisuji 6-chōme)', alight: 'Nippombashi (日本橋), 1ª parada', alightPoint: '日本橋駅 2番出口', minutes: 2, cost: '¥190',
      steps: [
        'Plataforma **天神橋筋六丁目方面**. Trens com destinos da Hankyu (北千里, 高槻市…) também servem.',
        '**1 parada**: desçam em **日本橋 Nippombashi** e saiam pela **2番出口**, a do hotel.',
      ],
    },
    walk(7, 'da saída 2, para o oeste pelo Dōtonbori até a ponte **Ebisu-bashi** e o letreiro da Glico'),
  ],
  'd25-dotonbori': [walk(5, 'até o hotel, para o leste pelo Dōtonbori, no lado da Nippombashi')],

  // ── 26 nov · meia manhã de Osaka e a subida para Kōyasan ───────────
  'd26-cafe': [walk(5, 'do Ibuki até a galeria coberta do **Kuromon Ichiba**, perto da Nippombashi')],
  'd26-kuromon': [
    walk(4, 'pela galeria até o hotel, em Sennichimae — ele fica entre o Kuromon e a Namba'),
    walk(8, 'do hotel para o oeste até a **Nankai Namba**, cujas plataformas ficam **no 3º andar do prédio da Takashimaya** — não confundir com a estação do metrô. Sigam as placas **南海電車**; o 7-Eleven fica no 2º andar, junto à **catraca central (中央改札)**'),
  ],
  'd26-konbini': [walk(2, 'suba um andar: as plataformas da linha Kōya ficam no 3º')],
  'd26-nankai': [
    {
      mode: 'train', line: 'Nankai Kōya Line (南海高野線) · 特急こうや ou 快速急行', board: 'Nankai Namba, 3º andar — 特急 nas plataformas 3 e 4', boardPoint: '難波駅 南海',
      direction: '極楽橋 Gokurakubashi', alight: 'Gokurakubashi (極楽橋), fim da linha', minutes: 85, cost: 'no passe',
      note: 'no 快速急行 pode ser preciso trocar em Hashimoto — o painel avisa',
      steps: [
        'Enfiem o bilhete de papel na fenda da catraca (ele volta do outro lado: guardem) e procurem no painel **高野線 · 極楽橋**. As plataformas da linha Kōya são as de número baixo (1 a 4); as altas são da linha principal, para Wakayama e o aeroporto: não peguem essas.',
        'Com o **特急こうや** (Kōya, todo reservado): o bilhete diz o **carro (号車) e o assento**. Esperem na marca do carro no chão da plataforma.',
        'Sem o especial: peguem o **快速急行** que diga **極楽橋** no painel. Se ele disser **橋本 Hashimoto**, desçam em Hashimoto e passem para o trem **極楽橋行き** que espera na estação.',
        'Fiquem até o **fim da linha, 極楽橋 Gokurakubashi**. Os últimos 20 min são de curvas e túneis na montanha.',
      ],
    },
    {
      mode: 'cable', line: 'funicular de Kōyasan (高野山ケーブル)', board: 'Gokurakubashi, na própria estação', boardPoint: '極楽橋駅',
      direction: '高野山 Kōyasan', alight: 'Estação de Kōyasan (高野山駅)', alightPoint: '高野山駅', minutes: 5, cost: 'no passe',
      note: 'rampa de 30 graus; fiquem em pé segurando ou sentem nos degraus',
      steps: [
        'Sem sair da estação, sigam a placa **ケーブルカー Cable Car** e a multidão: o funicular sai combinado com o trem.',
        'O bilhete passa de novo na catraca do funicular. Subida de 5 min até **高野山駅**.',
      ],
    },
    {
      mode: 'bus', line: 'Nankai Rinkan (南海りんかんバス)', board: 'Kōyasan Station, ponto 2 (2番のりば)', boardPoint: '高野山駅前 バス停',
      direction: '奥の院前 Okunoin-mae ou 奥の院口 Okunoin-guchi', alight: 'Senjuinbashi (千手院橋)', alightPoint: '千手院橋 バス停', minutes: 11, cost: 'no passe',
      note: 'a estrada entre a estação e a cidade é **exclusiva de ônibus**: não dá para ir a pé. Senjuinbashi é o cruzamento do centro, com semáforo',
      steps: [
        'Saindo do funicular, os ônibus esperam na praça em frente. Procurem o **2番のりば**, com os ônibus para **奥の院前 / 奥の院口**: todos passam pelo centro.',
        'Entrem pela porta do meio e mostrem o passe ao motorista **ao descer**.',
        'O painel e a voz anunciam as paradas; desçam em **千手院橋 Senjuinbashi**, o cruzamento com semáforo.',
      ],
    },
    walk(2, 'o Fumon-in fica a dois minutos da parada: no semáforo de Senjuinbashi, virem e procurem o portão do templo, o segundo à esquerda'),
  ],
  'd26-jantar-shojin': [
    walk(10, 'para o leste pela rua principal até a recepção Taira, ao lado do Ekō-in, perto do Ichinohashi — saiam às 18:30, o passe tem de ser retirado até as 19:00. À noite o ônibus é raro; táxi só chamando pelo templo'),
  ],
  'd26-okunoin-noite': [
    walk(15, 'o tour termina no Gobyō e o ônibus grátis devolve o grupo perto do Ekō-in; dali, 15 min para o oeste pela rua principal até o Fumon-in'),
  ],

  // ── 27 nov · Kōyasan de manhã, Sumiyoshi no caminho, Kyoto à noite ──
  'd27-gongyo': [
    walk(12, 'café da manhã no próprio templo; depois a pé para o oeste, passando pelo Kongōbu-ji, até o Danjō Garan'),
  ],
  'd27-garan': [walk(5, 'para o leste pela rua principal: o portão do Kongōbu-ji fica logo ali')],
  'd27-kongobuji': [
    walk(5, 'de volta ao Fumon-in pela mochila, e até a parada Senjuinbashi'),
    {
      mode: 'bus', line: 'Nankai Rinkan (qualquer um sentido 高野山駅)', board: 'Senjuinbashi (千手院橋)', boardPoint: '千手院橋 バス停',
      direction: '高野山駅前 Kōyasan Station', alight: 'Estação de Kōyasan (final)', alightPoint: '高野山駅', minutes: 11, cost: 'no passe',
      steps: [
        'Fiquem no ponto do lado da rua cujo letreiro diz **高野山駅前方面**; o do outro lado vai para o Okunoin.',
        'Vão até o **fim da linha, 高野山駅**, e mostrem o passe ao descer.',
      ],
    },
  ],
  'd27-descida': [
    {
      mode: 'cable', line: 'funicular de Kōyasan (高野山ケーブル)', board: 'Estação de Kōyasan (高野山駅)', boardPoint: '高野山駅',
      direction: '極楽橋 Gokurakubashi', alight: 'Gokurakubashi (極楽橋)', minutes: 5, cost: 'no passe',
      steps: [
        'Passem o passe na catraca: é a volta do bilhete. O funicular desce combinado com o trem.',
      ],
    },
    {
      mode: 'train', line: 'Nankai Kōya Line (南海高野線)', board: 'Gokurakubashi, sem sair da estação', boardPoint: '極楽橋駅',
      direction: 'なんば Namba', alight: 'Sumiyoshi-Higashi (住吉東)', alightPoint: '住吉東駅', minutes: 80, cost: 'no passe',
      note: '**o passe termina em Sumiyoshi-Higashi**: pela regra da Nankai, descer numa estação do meio encerra o bilhete, e o trecho seguinte até Namba se paga à parte, com a Suica',
      steps: [
        'Em Gokurakubashi, peguem o trem que estiver esperando: quase todos vão só até **橋本 Hashimoto**. O especial こうや cobra taxa à parte: não peguem.',
        'Em **橋本 Hashimoto**, troquem para o **急行 ou 快速急行 なんば行き (para Namba)**; o painel da plataforma diz qual sai primeiro.',
        'O expresso não para em Sumiyoshi-Higashi: desçam em **堺東 Sakai-Higashi** e troquem para o **各停 (local)** なんば行き.',
        'Contem: Asakayama, Abikomae, Sawanochō e **住吉東 Sumiyoshi-Higashi**, a 4ª. Desçam e passem o passe na catraca de saída.',
      ],
    },
    walk(10, 'para o oeste até o santuário — por este lado se entra pelos fundos; a ponte curva vermelha, a Sorihashi, fica na entrada oeste'),
  ],
  'd27-sumiyoshi': [
    walk(10, 'de volta à estação Sumiyoshi-Higashi'),
    {
      mode: 'train', line: 'Nankai Kōya Line (南海高野線) · 各停 (local)', board: 'Sumiyoshi-Higashi (住吉東)', boardPoint: '住吉東駅',
      direction: 'なんば Namba', alight: 'Nankai Namba (final)', alightPoint: '難波駅 南海', minutes: 15, cost: 'Suica (o passe acabou na ida)',
      steps: [
        'Passem a **Suica** na catraca (o passe já foi encerrado na chegada) e sigam a placa **なんば方面**.',
        'Todo trem que para aqui vai até **なんば Namba**, o fim da linha.',
        'Saiam pela catraca do 3º andar: a Takashimaya e o 551 ficam no mesmo prédio.',
      ],
    },
    walk(3, 'o balcão do 551 Hōrai fica na própria estação; a depachika da Takashimaya é no mesmo prédio'),
  ],
  'd27-almoco': [
    walk(4, 'da Nankai, saiam pela **catraca norte (北改札)** do 3º andar e desçam ao subsolo seguindo as placas **地下鉄 御堂筋線 (vermelho, M)**'),
    {
      mode: 'metro', line: 'Midōsuji Line (vermelha, M)', board: 'Namba (なんば), plataforma 2', boardPoint: 'なんば駅 御堂筋線',
      direction: '梅田・新大阪方面 (Umeda/Shin-Osaka)', alight: 'Umeda (梅田), 4ª parada, catraca norte', alightPoint: '梅田駅 北改札', minutes: 8, cost: '¥240',
      steps: [
        'Passem a Suica e escolham a plataforma **2, 梅田・新大阪方面**. A 1 vai para Tennōji.',
        'Contem: Shinsaibashi, Hommachi, Yodoyabashi e **梅田 Umeda**, a 4ª. Desçam.',
        'Sigam a placa **北改札 (catraca norte) · 阪急線 Hankyu**.',
      ],
    },
    walk(6, 'saiam pela catraca **norte** e sigam a placa 阪急電車: o Hankyu é outro prédio, e as plataformas da linha Kyoto ficam no 3º andar'),
  ],
  'd27-trem-kyoto': [
    {
      mode: 'train', line: 'Hankyu Kyoto Line · limited express (特急)', board: 'Osaka-Umeda (Hankyu), 3º andar — linha Kyoto nas **plataformas 1, 2 e 3**', boardPoint: '大阪梅田駅 阪急',
      direction: '京都河原町 Kyoto-Kawaramachi', alight: 'Kyoto-Kawaramachi (final), saída 6', alightPoint: '京都河原町駅 6番出口', minutes: 45, cost: '¥410',
      note: 'sem reserva e sem taxa extra; o limited express é o mais rápido e passa a cada 10 min',
      steps: [
        'Passem a Suica na catraca e sigam a placa **京都線 Kyoto Line**, plataformas **1 a 3**. As 4–9 vão para Takarazuka e Kobe: não peguem.',
        'Peguem o **特急 (vermelho no painel)** para **京都河原町**. Só o carro **PRiVACE** tem assento pago à parte: entrem em qualquer outro.',
        'Fiquem até o **fim da linha, 京都河原町**.',
        'Sigam a placa amarela **6番出口 (saída 6)**, no canto noroeste do cruzamento Shijō-Kawaramachi.',
      ],
    },
    walk(7, 'apesar do nome, o hotel não é na esquina de Shijō: ele fica na **Kawaramachi, abaixo de Sanjō** (Yamazaki-chō 240). Da saída 6, subam a Kawaramachi para o norte pela calçada oeste. As malas do takuhaibin devem estar na recepção'),
    walk(5, 'descendo a Kawaramachi de volta para o sul; a entrada leste do Nishiki é pela arcada Teramachi'),
  ],
  'd27-nishiki-rapido': [
    walk(6, 'do Nishiki, pela Shijō-dōri para o leste e atravessando a ponte sobre o rio Kamo: a entrada da **Keihan Gion-Shijō** é logo depois da ponte'),
    {
      mode: 'train', line: 'Keihan Main Line — **普通 (local)**', board: 'Gion-Shijō (祇園四条), plataforma 2', boardPoint: '祇園四条駅',
      direction: '淀屋橋・中之島方面 (Yodoyabashi/Nakanoshima)', alight: 'Fushimi-Inari (伏見稲荷), 5ª parada', alightPoint: '伏見稲荷駅', minutes: 10, cost: '¥220',
      note: 'peguem o **local**: nem o 特急 nem o 快速急行 param em Fushimi-Inari',
      steps: [
        'Passem a Suica e desçam para a plataforma **2, 淀屋橋方面**. A 1 vai para Sanjō e Demachiyanagi.',
        'Confiram no painel que é **普通 (local)**; o 特急 e o 快速急行 passam direto.',
        'Contem: Kiyomizu-Gojō, Shichijō, Tōfukuji, Toba-kaidō e **伏見稲荷 Fushimi-Inari**, a 5ª. Desçam.',
      ],
    },
    walk(5, 'saindo da estação, para o leste pela rua das barracas até o grande torii e o portão'),
  ],
  'd27-fushimi-inari': [
    walk(5, 'até a estação Fushimi-Inari da Keihan'),
    {
      mode: 'train', line: 'Keihan Main Line — **普通 (local)**', board: 'Fushimi-Inari (伏見稲荷)', boardPoint: '伏見稲荷駅',
      direction: '淀屋橋・中之島方面 (Yodoyabashi/Nakanoshima)', alight: 'Fushimi-Momoyama (伏見桃山), 5ª parada', alightPoint: '伏見桃山駅', minutes: 12, cost: '¥220',
      note: 'em Fushimi-Momoyama só param local, 準急 e 通勤準急 — nenhum expresso',
      steps: [
        'Plataforma **淀屋橋方面** (para o sul). A do outro lado volta para Kyoto.',
        'Peguem o **普通 (local)**.',
        'Contem: Fukakusa, Fujinomori, Sumizome, Tambabashi e **伏見桃山 Fushimi-Momoyama**, a 5ª. Desçam.',
      ],
    },
    walk(7, 'saindo da estação, a galeria Ōtesuji começa em frente: sigam por ela para o oeste e depois para o sul; o Torisei fica na rua das kuras, atrás da Yamamoto Honke'),
  ],
  'd27-jantar': [
    walk(7, 'de volta à Keihan Fushimi-Momoyama'),
    {
      mode: 'train', line: 'Keihan Main Line (準急 ou local)', board: 'Fushimi-Momoyama (伏見桃山)', boardPoint: '伏見桃山駅',
      direction: '三条・出町柳方面 (Sanjō/Demachiyanagi)', alight: 'Sanjō (三条), 11ª parada', alightPoint: '三条駅 京阪', minutes: 22, cost: '¥280',
      note: 'desçam em **Sanjō**, não em Gion-Shijō: o Musashi e o hotel ficam na Kawaramachi logo abaixo da ponte Sanjō. Últimos trens 23:26 e 00:08; confirmar na placa, a Keihan mudou o horário em agosto',
      steps: [
        'Plataforma **三条・出町柳方面** (para o norte).',
        'Peguem o primeiro que vier e diga 三条 ou 出町柳: todo trem que para aqui passa por Sanjō.',
        'São 11 paradas; a 10ª é Gion-Shijō. Desçam na seguinte, **三条 Sanjō**.',
        'Sigam a placa amarela de saída para **三条大橋 (ponte Sanjō)**.',
      ],
    },
    walk(5, 'saindo da Keihan Sanjō, atravessem a ponte Sanjō para o oeste: o Musashi é a esquina da Kawaramachi com a Sanjō, com a placa de sushi girando'),
  ],
  'd27-sushi-musashi': [walk(3, 'descendo a Kawaramachi uma quadra e meia para o sul, até o hotel')],

  // ── 28 nov · Higashiyama ───────────────────────────────────────────
  'd28-kiyomizu': [walk(5, 'descendo a ladeira das lojas (Matsubara-dōri); a Sannenzaka é a escada à direita')],
  'd28-sannenzaka': [walk(8, 'pela Ninenzaka e depois pelo Nene-no-michi; o Kōdai-ji fica no alto, à direita')],
  'd28-kodaiji': [
    walk(10, 'descendo até a Higashiōji-dōri, a avenida larga: táxi livre tem a luz vermelha 空車 no para-brisa'),
    { mode: 'taxi', board: 'na Higashiōji-dōri, perto do Yasaka', alight: 'Ginkaku-ji (銀閣寺)', minutes: 15, cost: '~¥1.800', note: 'num sábado de pico o ônibus 203 leva 40–50 min e passa lotado; o táxi deixa vocês no pé da rua do templo' },
    walk(5, 'subindo a rua das lojas até o portão'),
  ],
  'd28-ginkakuji': [walk(5, 'descendo a rua do templo: o Omen fica na entrada norte do caminho, a poucos passos do canal')],
  'd28-almoco': [walk(2, 'o caminho começa ali, ao longo do canal')],
  'd28-filosofo': [walk(30, 'o caminho inteiro para o sul, 2 km ao longo do canal; termina nas costas do Nanzen-ji')],
  'd28-nanzenji': [walk(8, 'para o norte pela rua atrás do aqueduto')],
  'd28-eikando': [
    walk(4, 'até a avenida em frente ao Eikan-dō, onde passam os táxis'),
    { mode: 'taxi', board: 'na saída do Eikan-dō', alight: 'Hanamikōji, Gion (花見小路)', minutes: 15, cost: '~¥1.500', note: 'às 17h de sábado o ônibus 5 vem lotado e desce até a Kawaramachi, do outro lado do rio — seriam mais 10 min voltando a pé' },
  ],
  'd28-kitagawa': [walk(5, 'pela Hanamikōji de volta à Shijō-dōri: o Izuu fica em Gion Shinchi, ao norte da Shijō; Pontochō é do outro lado da ponte')],
  'd28-gion': [walk(15, 'a pé mesmo: pela Shijō-dōri para o oeste, atravessando a ponte, e na Kawaramachi virem à direita (norte) até o hotel, entre a Shijō e a Sanjō. Não depende de ônibus nenhum')],

  // ── 29 nov · Arashiyama, Kinkaku-ji ────────────────────────────────
  'd29-konbini': [
    walk(7, 'descendo a Kawaramachi para o sul até a Shijō; a Hankyu Kyoto-Kawaramachi é a estação subterrânea da esquina (entrem pela saída 3 ou 10)'),
    {
      mode: 'train', line: 'Hankyu Kyoto Line (marrom)', board: 'Kyoto-Kawaramachi (京都河原町)', boardPoint: '京都河原町駅',
      direction: '大阪梅田 Osaka-Umeda', alight: 'Ōmiya (大宮), 2ª parada', alightPoint: '阪急大宮駅', minutes: 4, cost: '¥170',
      steps: [
        'Kyoto-Kawaramachi é ponta de linha: **todos os trens** vão para 大阪梅田 e todos param em Ōmiya. Peguem o primeiro que sair.',
        'Contem Karasuma e **大宮 Ōmiya**, a 2ª. Desçam.',
        'Na catraca, sigam a placa **嵐電 Randen (四条大宮)**: a estação do bondinho fica na superfície, na própria esquina da Shijō com a Ōmiya.',
      ],
    },
    {
      mode: 'tram', line: 'Randen (Keifuku) Arashiyama Line', board: 'Shijō-Ōmiya (四条大宮)', boardPoint: '嵐電 四条大宮駅',
      direction: '嵐山 Arashiyama', alight: 'Arashiyama (嵐山), fim da linha', alightPoint: '嵐電嵐山駅', minutes: 22, cost: '¥250',
      note: 'o bondinho de Kyoto; passa a cada ~10 min desde as 6h. A estação fica a 3 min do portão do Tenryū-ji',
      steps: [
        'Shijō-Ōmiya também é ponta de linha: o bondinho roxo sai daqui e **todos vão a 嵐山 Arashiyama**.',
        'Fiquem até o **fim da linha**. Na metade do caminho, em Katabiranotsuji, sai um ramal para Kitano: não desçam, o de vocês segue reto.',
        'Em Arashiyama, saiam pela frente da estação para a rua principal: o portão do Tenryū-ji fica do outro lado, um pouco à direita.',
      ],
    },
    walk(8, 'pela lateral do Tenryū-ji até o portão norte; o bambuzal começa ali'),
  ],
  'd29-bambu': [walk(5, 'o portão norte do Tenryū-ji abre para dentro do bambuzal')],
  'd29-tenryuji': [walk(10, 'de volta ao bambuzal e subindo até o fim da trilha; a villa é o portão à direita')],
  'd29-okochi-sanso': [walk(5, 'de volta ao bambuzal: a estação **Torokko Arashiyama** (トロッコ嵐山) é a plataforma de madeira na beira da trilha. Estejam lá 10 min antes do trem das 11:05')],
  'd29-sagano': [
    {
      mode: 'train', line: 'Sagano 5 · Sagano 6 (ida e volta)', board: 'Torokko Arashiyama', boardPoint: 'トロッコ嵐山駅',
      direction: 'Torokko Kameoka (トロッコ亀岡)', alight: 'Torokko Arashiyama', alightPoint: 'トロッコ嵐山駅', minutes: 45, cost: '¥880 por trecho',
      note: 'ida 11:05 → 11:25, volta 11:30 → 11:50: em Kameoka são 5 min para embarcar no segundo trem',
      steps: [
        'Cada bilhete tem o **carro (号車)** e o **assento**: o da ida é o Sagano 5, o da volta o Sagano 6. Esperem na plataforma em frente ao número do carro.',
        'Fiquem até **トロッコ亀岡 Torokko Kameoka**, o fim da linha (20 min).',
        'Em Kameoka, **não saiam da estação**: procurem o carro do segundo bilhete no Sagano 6, que sai 5 min depois e volta até Torokko Arashiyama.',
      ],
    },
    walk(15, 'descendo pelo bambuzal e pela rua do Tenryū-ji até o rio; o Yoshimura fica na cabeceira norte da ponte Togetsukyō, com a varanda para o rio'),
  ],
  'd29-almoco': [
    { mode: 'taxi', board: 'ponto de táxi na frente da estação Randen Arashiyama', alight: 'Kinkaku-ji (金閣寺)', minutes: 20, cost: '~¥2.500', note: 'o jeito que poupa uma hora. Alternativa: bonde Randen até Kitano-Hakubaichō (troca em Katabiranotsuji, 25 min ¥250) e ônibus 205 até Kinkakuji-michi' },
  ],
  'd29-kinkakuji': [walk(15, 'pela Kinukake-no-michi, a estrada em descida à esquerda da saída; ou ônibus 59, duas paradas')],
  'd29-ryoanji': [
    walk(3, 'até a parada Ryōanji-mae, na frente do templo — a do lado com a placa 四条河原町・三条京阪 方面'),
    {
      mode: 'bus', line: 'ônibus 59 (市バス, verde)', board: 'Ryōanji-mae (竜安寺前)', boardPoint: '竜安寺前 バス停',
      direction: '四条河原町・三条京阪 Shijō-Kawaramachi · Sanjō-Keihan', alight: 'Shijō-Kawaramachi (四条河原町)', alightPoint: '四条河原町 バス停', minutes: 40, cost: '¥230',
      steps: [
        'O painel da frente do ônibus diz **59 四条河原町・三条京阪**. Confiram o número antes de subir.',
        '**Subam pela porta de trás ou do meio**, sem pagar. Nos ônibus comuns de Kyoto ainda é assim: entra atrás, paga e sai pela frente. (A cidade só planeja inverter para o fim de 2028; hoje, só os expressos turísticos EX são de entrar pela frente.)',
        'Na descida, encostem a Suica no leitor ao lado do motorista: **¥230**, tarifa única. O painel e a voz anunciam a parada; um antes é 河原町三条 (Kawaramachi-Sanjō), a do hotel — desçam na seguinte, **四条河原町 Shijō-Kawaramachi**.',
      ],
    },
    walk(6, 'o Nishiki é a galeria coberta uma quadra ao norte da Shijō: subam pela galeria Teramachi, a coberta, e virem à esquerda'),
  ],
  'd29-nishiki': [walk(6, 'saindo pelo lado leste do Nishiki, pela galeria Shinkyōgoku; a Urateramachi é a rua paralela')],
  'd29-jantar': [walk(4, 'subindo a Kawaramachi para o norte até o hotel, logo abaixo da Sanjō')],

  // ── 30 nov · Nara ──────────────────────────────────────────────────
  'd30-trem-nara': [
    {
      mode: 'train', line: 'Kintetsu Limited Express (特急)', board: 'Kintetsu Kyoto, plataformas 1–4', boardPoint: '近鉄京都駅',
      direction: '近鉄奈良 Kintetsu-Nara', alight: 'Kintetsu-Nara (final)', alightPoint: '近鉄奈良駅', minutes: 35, cost: '¥1.280 (¥760 + ¥520 do assento reservado)',
      note: 'comprem o assento na máquina ou no guichê; o expresso comum (急行) leva 45 min e não precisa de reserva',
      steps: [
        'Na máquina ao lado da catraca, comprem o **特急券** (bilhete do assento) para **近鉄奈良**. A Suica paga a tarifa base na catraca; o 特急券 é o papel do assento, com carro e número.',
        'No painel, o trem tem de dizer **奈良** (Nara). O 特急 que diz **橿原神宮前** (Kashihara-Jingū-mae) não vai a Nara: não peguem. No 急行, também só o que diz 奈良.',
        'Fiquem até o **fim da linha**, **近鉄奈良 Kintetsu-Nara** (subterrânea).',
        'Na saída, sigam as placas **東大寺・奈良公園 (Tōdai-ji / Parque)** e **登大路 Noborioji**: em cima fica a praça com o chafariz da estátua de Gyōki.',
      ],
    },
    walk(8, 'da praça do Gyōki, para o leste pela Noborioji-dōri, a avenida larga em subida; os cervos aparecem na altura do Kōfuku-ji, à direita'),
  ],
  'd30-parque-nara': [walk(12, 'continuem pela Noborioji e virem à esquerda na rua das barracas: o portão Nandaimon aparece no fim dela')],
  'd30-todaiji': [walk(10, 'saindo pelo lado leste do salão, subida pela escada de pedra')],
  'd30-nigatsudo': [walk(22, 'para o sul, plano: Hokke-dō, Tamukeyama Hachiman-gū, o pé do monte Wakakusa, a casa de chá Mizuya e a entrada norte do Kasuga (北参道)')],
  'd30-kasuga-taisha': [
    walk(3, 'o ponto final do ônibus fica a poucos minutos do portão — sigam a placa バスのりば'),
    { mode: 'bus', line: 'Nara Kōtsū 77 ou 97', board: 'Kasuga Taisha Honden (春日大社本殿)', direction: 'Kintetsu Nara · JR Nara', alight: 'Himuro-jinja · Kokuritsu-hakubutsukan (氷室神社・国立博物館)', minutes: 6, cost: '¥250 · Suica/ICOCA', note: 'passa ~3 vezes por hora e o horário da volta está afixado no ponto. Em vez dos 2 km de volta a pé, são 6 min sentados' },
    walk(3, 'para o norte, atravessando a avenida: o portão do Isui-en fica atrás do santuário Himuro'),
  ],
  'd30-isuien': [walk(10, 'para o oeste pela Noborioji até a galeria Higashimuki, ao lado da estação: o Nakatanidō fica na esquina da Sanjō-dōri')],
  'd30-almoco': [walk(5, 'subindo a rua para o leste: o Kōfuku-ji é o pátio aberto à direita, antes do parque')],
  'd30-kofukuji': [walk(8, 'descendo até o lago Sarusawa e continuando para o sul: Naramachi são as ruas de casas antigas atrás do lago')],
  'd30-naramachi': [
    walk(10, 'para o norte, de volta pelo lago Sarusawa e pela galeria Higashimuki até a estação Kintetsu-Nara, na praça do Gyōki'),
    {
      mode: 'train', line: 'Kintetsu (特急 ou 急行)', board: 'Kintetsu-Nara', boardPoint: '近鉄奈良駅',
      direction: '京都 Kyoto', alight: 'Kyoto (final)', alightPoint: '近鉄京都駅', minutes: 40, cost: '¥1.280 reservado · ¥760 no expresso comum',
      note: 'confiram que o trem vai a KYOTO: metade vai para Osaka-Namba',
      steps: [
        'Para o 特急, comprem o **特急券** na máquina antes da catraca, para **京都**.',
        'No painel, só o trem que diz **京都** (Kyoto). Os que dizem 大阪難波 ou 神戸三宮 vão para Osaka: é a outra metade.',
        'Fiquem até o **fim da linha**, **京都 Kyoto**. Na saída, sigam as placas **地下鉄 Subway** (烏丸線): o metrô fica no subsolo do lado norte, atravessando a estação.',
      ],
    },
    {
      mode: 'metro', line: 'Karasuma Line (verde, K)', board: 'Kyoto (metrô, lado norte da estação)', boardPoint: '京都駅 烏丸口',
      direction: '国際会館 Kokusaikaikan', alight: 'Karasuma-Oike (烏丸御池), 3ª parada', minutes: 6,
      steps: [
        'Plataforma **国際会館方面 (Kokusaikaikan)**.',
        'Contem Gojō, Shijō e **烏丸御池 Karasuma-Oike**, a 3ª. Desçam e sigam a placa **東西線 Tōzai Line**, sem sair da estação.',
      ],
    },
    {
      mode: 'metro', line: 'Tōzai Line (vermelho-alaranjado, T)', board: 'Karasuma-Oike, pela baldeação', direction: '六地蔵 Rokujizō',
      alight: 'Kyoto-Shiyakusho-mae (京都市役所前), 1ª parada', alightPoint: '京都市役所前駅', minutes: 2, cost: '¥260 no total',
      steps: [
        'Plataforma **六地蔵方面 (Rokujizō)**. A do outro lado vai para Uzumasa-Tenjingawa.',
        '**1 parada**: desçam em **京都市役所前 Kyoto-Shiyakusho-mae** e saiam para o lado da Kawaramachi-dōri.',
      ],
    },
    walk(6, 'descendo a Kawaramachi para o sul até o hotel, logo abaixo da Sanjō'),
  ],

  // ── 1 dez · Tōfuku-ji e o Shinkansen ───────────────────────────────
  'd01-tofukuji': [walk(20, 'para o norte pela Higashiōji-dōri; o Sanjūsangen-dō fica atrás do Museu Nacional. Táxi ~¥1.000 se estiverem cansados')],
  'd01-sanjusangendo': [
    { mode: 'taxi', board: 'na porta do Sanjūsangen-dō', alight: 'Tō-ji, portão leste Keigamon (東寺 慶賀門)', minutes: 12, cost: '~¥1.500', note: 'de ônibus seria baldeação na Estação de Kyoto; o táxi leva direto' },
  ],
  'd01-toji': [
    walk(15, 'saindo pelo portão norte (Kitadaimon), para o nordeste até a saída **Hachijō** da Estação de Kyoto, a do Shinkansen'),
    walk(5, 'atravessem a estação pela passagem livre até os armários das catracas centrais: peguem as malas de mão — e então o Isetan (ekiben) ou o Ramen Kōji no 10º'),
  ],
  'd01-almoco': [walk(6, 'catracas do Shinkansen, lado Hachijō (sul); para Tóquio são as plataformas 11 e 12. Cheguem 15 min antes')],
  'd01-shinkansen': [
    {
      mode: 'shinkansen', line: 'Nozomi', board: 'Kyoto, plataformas 11–12 (東京方面)', boardPoint: '京都駅 新幹線八条口',
      direction: '東京 Tokyo', alight: 'Tokyo (final)', minutes: 135, cost: '¥14.200 reservado',
      note: 'Fuji do lado ESQUERDO nesse sentido, que é a janela **E** (A–C ficam sempre do lado do mar). Aparece uns 40 min antes de chegar',
      steps: [
        'Pela catraca do Shinkansen, sigam a placa **東京方面 (Tokyo)**: são as plataformas **11 e 12**, no 3º andar. As 13 e 14 vão para Shin-Osaka/Hakata.',
        'No painel, achem **のぞみ** com o número do bilhete e a hora **13:20**. Esperem na marca do chão com o número do **carro (号車)** do bilhete.',
        'Para o Fuji, o assento é **D ou E** (o E é a janela). As fileiras A–C ficam do lado do mar.',
        'Em Tóquio, fim da linha: sigam as placas **丸ノ内線 Marunouchi Line** (círculo **vermelho M**). O metrô fica do outro lado, no lado Marunouchi — uns 10 minutos andando com as malas.',
      ],
    },
    {
      mode: 'metro', line: 'Marunouchi Line (vermelha, M)', board: 'Tokyo (東京)', boardPoint: '東京駅 丸ノ内線',
      direction: '荻窪 Ogikubo · Ginza · Shinjuku', alight: 'Ginza (銀座), 1ª parada, saída A13', alightPoint: '銀座駅 A13出口', minutes: 2, cost: '¥180',
      note: 'ou táxi ~¥1.200 com as malas de mão',
      steps: [
        'Plataforma **銀座・新宿・荻窪方面 (Ginza/Ogikubo)**. A do outro lado vai para Ikebukuro.',
        'É **1 parada**: desçam em **銀座 Ginza**.',
        'Sigam a placa amarela **A13**: a saída do hotel, a 3 minutos.',
      ],
    },
    walk(5, 'check-in; as malas do takuhaibin chegam hoje ou amanhã'),
  ],
  'd01-checkin-compras': [
    walk(3, 'de volta à saída A13 da Ginza'),
    {
      mode: 'metro', line: 'Marunouchi Line (vermelha, M)', board: 'Ginza (銀座), saída A13', boardPoint: '銀座駅 A13出口',
      direction: '池袋 Ikebukuro', alight: 'Tokyo (東京), 1ª parada', minutes: 2, cost: '¥180',
      steps: [
        'Desçam pela A13 e sigam o **M vermelho** (丸ノ内線). Plataforma **池袋方面 (Ikebukuro)**.',
        '**1 parada**: desçam em **東京 Tokyo**.',
        'Saindo do metrô, sigam as placas **JR線**: a entrada da JR mais perto é a catraca **丸の内地下中央口**, no subsolo.',
      ],
    },
    {
      mode: 'train', line: 'JR Yamanote (verde-claro)', board: 'Tokyo, plataforma 4 (上野・池袋方面)', boardPoint: '東京駅 丸の内地下中央口',
      direction: '上野・池袋方面 (Ueno/Ikebukuro)', alight: 'Komagome (駒込), 9ª parada, saída sul (南口)', alightPoint: '駒込駅 南口', minutes: 18, cost: '¥209',
      steps: [
        'Passada a catraca, sigam a placa **山手線 Yamanote** (verde-claro), **plataforma 4, 上野・池袋方面**. A 5 é a do sentido contrário (Shinagawa).',
        'São 9 paradas: Kanda, Akihabara, Okachimachi, Ueno, Uguisudani, Nippori, Nishi-Nippori, Tabata e **駒込 Komagome**.',
        'Sigam a placa amarela **南口 South Exit**.',
      ],
    },
    walk(7, 'da saída sul até o **portão principal (正門)**, na Hongō-dōri — é o que abre à noite. O portão Somei, mais perto da estação, só abre em algumas temporadas'),
  ],
  'd01-rikugien': [
    walk(7, 'de volta pela Hongō-dōri à estação Komagome, saída sul'),
    {
      mode: 'train', line: 'JR Yamanote (verde-claro)', board: 'Komagome (駒込), saída sul', boardPoint: '駒込駅 南口',
      direction: '池袋・新宿方面 (Ikebukuro/Shinjuku)', alight: 'Ikebukuro (池袋), 3ª parada', alightPoint: '池袋駅 35番出口', minutes: 8, cost: '¥199',
      steps: [
        'Sigam a placa **山手線 Yamanote**, plataforma **池袋・新宿方面**. A do outro lado vai para Tabata/Ueno.',
        'Contem Sugamo, Ōtsuka e **池袋 Ikebukuro**, a 3ª. Desçam.',
        'Saiam pelo lado **東口 (East)** e, no subsolo, sigam as placas **サンシャインシティ Sunshine City · 35番出口**. A saída 35 (com escada rolante e elevador) fica a uns 3 min da catraca.',
      ],
    },
    walk(8, 'da saída 35, a Sunshine 60-dōri reto; o Sunshine City é o complexo no fim. World Import Mart, 3º andar'),
  ],
  'd01-gachapon-ikebukuro': [
    walk(6, 'pela passagem subterrânea do Sunshine City até a estação Higashi-Ikebukuro'),
    {
      mode: 'metro', line: 'Yūrakuchō Line (dourada, Y)', board: 'Higashi-Ikebukuro (東池袋)', boardPoint: '東池袋駅',
      direction: '新木場 Shin-Kiba', alight: 'Ginza-itchōme (銀座一丁目), 9ª parada', minutes: 20, cost: '¥260',
      note: 'sem baldeação e sem voltar até a estação de Ikebukuro',
      steps: [
        'Sigam o **Y dourado** (有楽町線). Plataforma **新木場方面 (Shin-Kiba)**. A do outro lado vai para Ikebukuro/Wakōshi.',
        'São 9 paradas; a 8ª é Yūrakuchō. Desçam na seguinte, **銀座一丁目 Ginza-itchōme**.',
        'Sigam as placas de saída para a **中央通り Chūō-dōri**.',
      ],
    },
    walk(5, 'pela Chūō-dōri para o sul até a Ginza 3-chōme e o hotel'),
  ],

  // ── 2 dez · Tóquio, último dia inteiro ─────────────────────────────
  'd02-gaien': [
    walk(8, 'voltem pela alameda até a avenida Aoyama e entrem de novo na estação **Gaiemmae**'),
    {
      mode: 'metro', line: 'Ginza Line (laranja, G)', board: 'Gaiemmae (外苑前)', boardPoint: '外苑前駅',
      direction: '浅草 Asakusa', alight: 'Suehirochō (末広町), 11ª parada', alightPoint: '末広町駅', minutes: 22, cost: '¥210',
      steps: [
        'Plataforma **浅草方面 (Asakusa)**, o trem laranja.',
        'São 11 paradas, uns 22 minutos, passando por Ginza, Nihombashi e Kanda. Desçam em **末広町 Suehirochō**, a parada depois de Kanda.',
        'Saiam pelo lado de **秋葉原・外神田** e, na rua, usem o Maps até o Kanda Myōjin: uns 7 minutos subindo a ladeira para o oeste.',
      ],
    },
  ],
  'd02-kanda-myojin': [walk(4, 'atravessando a rua para o sul: o muro preto do Yushima Seidō começa ali')],
  'd02-yushima-seido': [walk(14, 'pela ponte Hijiribashi, passando pela Nikolai-dō, e ladeira abaixo pela Yasukuni-dōri até Jimbōchō; o Bondy fica dentro de um pátio, entrada pela livraria')],
  'd02-jimbocho': [
    walk(3, 'de volta à Yasukuni-dōri: desçam por uma entrada da estação **Jimbōchō** com o **Z roxo** (半蔵門線)'),
    {
      mode: 'metro', line: 'Hanzōmon Line (roxa, Z)', board: 'Jimbōchō (神保町)', boardPoint: '神保町駅',
      direction: '押上 Oshiage', alight: 'Mitsukoshimae (三越前), 2ª parada, saída B6', alightPoint: '三越前駅 B6出口', minutes: 6, cost: '¥180',
      steps: [
        'Em Jimbōchō a Hanzōmon divide a plataforma com a Toei Shinjuku (verde-claro, S). Confiram que o trem é o **roxo** e que o painel diz **押上方面 (Oshiage)**.',
        'Contem Ōtemachi e **Mitsukoshimae**, a 2ª. Desçam.',
        'Sigam a placa amarela **B6出口 (saída B6)**: ela sai na ponta norte da própria ponte Nihonbashi.',
      ],
    },
    walk(1, 'a saída B6 dá no cruzamento 日本橋北詰, colado à ponte; o Mitsukoshi fica uma quadra para trás, na mesma avenida'),
  ],
  'd02-nihonbashi': [
    walk(3, 'do Mitsukoshi, desçam por uma entrada com o **G laranja** (銀座線) da estação Mitsukoshimae; o Mitsukoshi também tem acesso pelo subsolo'),
    {
      mode: 'metro', line: 'Ginza Line (laranja, G)', board: 'Mitsukoshimae (三越前)', boardPoint: '三越前駅',
      direction: '浅草 Asakusa', alight: 'Kanda (神田), 1ª parada', minutes: 2, cost: '¥180',
      steps: [
        'Plataforma **浅草方面 (Asakusa)**. É só **1 parada**: desçam em **神田 Kanda**.',
        'Em Kanda, sigam a placa **JR線 のりかえ** pela catraca **内神田方面**. Saindo do metrô, a catraca **北改札** da JR fica a uns 2 minutos.',
      ],
    },
    {
      mode: 'train', line: 'JR Yamanote (verde-claro)', board: 'Kanda (神田), catraca norte', boardPoint: '神田駅 北改札',
      direction: '上野・池袋方面 (Ueno/Ikebukuro)', alight: 'Akihabara (秋葉原), 1ª parada, saída Shōwa-dōri (昭和通り口)', alightPoint: '秋葉原駅 昭和通り口', minutes: 2, cost: '¥155',
      note: 'ou 18 min a pé reto pela Chūō-dōri, que é a mesma rua',
      steps: [
        'Sigam a placa **山手線 Yamanote** (verde-claro), plataforma **上野・池袋方面**. Durante o dia a Keihin-Tōhoku (azul) corre como rápido e **não para em Kanda**: peguem a verde-clara.',
        'É só **1 parada**: desçam em **秋葉原 Akihabara**.',
        'Sigam a placa amarela **昭和通り口 Shōwa-dōri**, e não a Electric Town: a primeira missão, a **Yodobashi**, é o prédio enorme bem na frente dessa saída.',
      ],
    },
  ],
  'd02-akihabara-missoes': [
    walk(5, 'da Mandarake, de volta à estação pela entrada **電気街口 (Electric Town)**'),
    {
      mode: 'train', line: 'JR Sōbu local (amarelo)', board: 'Akihabara (秋葉原), entrada Electric Town', boardPoint: '秋葉原駅 電気街口',
      direction: '千葉方面 (Chiba)', alight: 'Kinshichō (錦糸町), 3ª parada', minutes: 5, cost: '¥199',
      steps: [
        'Passada a catraca, sigam a placa **amarela 総武線** (Sōbu, local). As plataformas dela ficam no **3º andar**, por cima das outras.',
        'Plataforma **6番線 · 千葉方面 (Chiba)**. A 5 vai para Ochanomizu e Shinjuku: não é essa.',
        'Contem Asakusabashi, Ryōgoku e **Kinshichō**, a 3ª. Desçam.',
        'Sigam as placas **半蔵門線 (Hanzōmon, roxo Z)**: é preciso sair da JR e entrar no metrô; ele fica do outro lado da rua, a uns 5 minutos.',
      ],
    },
    {
      mode: 'metro', line: 'Hanzōmon Line (roxa, Z)', board: 'Kinshichō (錦糸町)', boardPoint: '錦糸町駅',
      direction: '押上 Oshiage', alight: 'Oshiage〈Skytree-mae〉 (押上〈スカイツリー前〉), 1ª parada', alightPoint: '押上駅', minutes: 3, cost: '¥180',
      note: 'isto é para a Skytree. Tokyo Tower: Hibiya Line até Kamiyachō. Prédio do Governo: Chūō até Shinjuku',
      steps: [
        'Plataforma **押上方面 (Oshiage)**. Muitos trens seguem depois pela Tōbu: tudo bem, todos param em Oshiage.',
        'É só **1 parada**. Desçam em **押上 Oshiage** e sigam as placas **東京スカイツリー Tokyo Skytree**: a estação é ligada por baixo ao complexo da torre.',
      ],
    },
    walk(3, 'a torre é a saída da estação; a bilheteria do Tembo Deck fica no 4º andar'),
  ],
  'd02-ultima-vista': [
    walk(3, 'da torre, de volta à estação Oshiage pelo mesmo caminho; desta vez sigam as placas do **都営浅草線 (Toei Asakusa, rosa A)**'),
    {
      mode: 'metro', line: 'Toei Asakusa Line (rosa, A)', board: 'Oshiage (押上)', boardPoint: '押上駅',
      direction: '西馬込・羽田空港方面 (Nishi-Magome/Haneda)', alight: 'Higashi-Ginza (東銀座), 9ª parada, saída 6', alightPoint: '東銀座駅 6番出口', minutes: 20, cost: '¥280',
      note: 'da Skytree, direto. Da Tokyo Tower: Hibiya Line de Kamiyachō até Higashi-Ginza, 9 min',
      steps: [
        'Plataforma **西馬込・羽田空港方面**. Muitos trens vêm da Keisei e seguem até Haneda: servem, **menos o エアポート快特** (Airport Kaitoku), que passa direto por Higashi-Ginza. Confiram no painel.',
        'São 9 paradas, uns 20 minutos: Honjo-azumabashi, Asakusa, Kuramae, Asakusabashi, Higashi-nihombashi, Ningyōchō, Nihombashi, Takarachō e **東銀座 Higashi-Ginza**. Desçam.',
        'Passem a catraca do Toei e sigam a placa amarela **6番出口 (saída 6)**. O subsolo depois da catraca é comum às duas linhas da estação.',
      ],
    },
    walk(1, 'a saída 6 dá praticamente na porta: a Iwate Ginga Plaza fica no térreo do Nankai Tokyo Building, em frente ao Kabuki-za'),
  ],
  'd02-tekki': [walk(11, 'pela Harumi-dōri até a Ginza 4-chōme e além, passando pelo Kumamotokan (Ginza 5-3-16, perto da saída B9); o Bic Camera é o prédio grande de Yūrakuchō, do outro lado dos trilhos')],
  'd02-compras-finais': [walk(8, 'do Bic Camera Yūrakuchō, sigam os trilhos da JR no sentido de Shinbashi: o **OKUROJI** é a galeria debaixo dos arcos, e o Manten fica na loja **G24**. Cheguem às 20:20 — 15 min de atraso cancelam a mesa')],
  'd02-jantar-despedida': [walk(17, 'pela Harumi-dōri para o leste, cruzando a Chūō-dōri no cruzamento de Ginza 4-chōme (Wakō) e depois a Shōwa-dōri; a loja fica na **Ginza 3-15-10**, logo ao norte da Harumi-dōri, a 2 min da estação Higashi-Ginza (o caminho passa perto do hotel: a loja fica uns 5 min depois dele). De táxi são 5 min — mostrem o endereço 中央区銀座3-15-10')],
  'd02-konbini': [walk(5, 'de volta para o oeste, atravessando a Shōwa-dōri: o hotel fica na **Ginza 3-8-4** (Sotetsu Fresa Inn Ginza Sanchome). Arrumar as malas hoje, amanhã não vai dar tempo')],

  // ── 3 dez · volta ──────────────────────────────────────────────────
  'd03-nakiryu-senha': [
    walk(5, 'senha na mão, café da manhã por perto e de volta à estação Shin-Ōtsuka por volta das 9:15. Entrem pela **saída 1**, a do lado do Nakiryu (Minami-Ōtsuka): é a catraca do sentido Ginza'),
    {
      mode: 'metro', line: 'Marunouchi Line (vermelha, M)', board: 'Shin-Ōtsuka (新大塚), entrada 1', boardPoint: '新大塚駅 1番出口',
      direction: '銀座・荻窪方面 (Ginza/Ogikubo)', alight: 'Ochanomizu (御茶ノ水), 4ª parada', minutes: 9, cost: '¥180',
      steps: [
        'Em Shin-Ōtsuka cada sentido tem a sua entrada. Antes de passar a catraca, a placa tem que dizer **銀座・荻窪方面**. Se disser 池袋方面, é a entrada do outro lado da avenida.',
        'Contem Myōgadani, Kōrakuen, Hongō-sanchōme e **Ochanomizu**, a 4ª. Desçam.',
        'Saiam pela catraca da plataforma e subam até a rua. A JR fica **do outro lado do rio**: atravessem a ponte **お茶の水橋 (Ochanomizu-bashi)** e, do outro lado da rua, entrem na JR pela catraca **お茶の水橋口**.',
      ],
    },
    {
      mode: 'train', line: 'JR Sōbu local (amarelo)', board: 'Ochanomizu (御茶ノ水), catraca Ochanomizu-bashi', boardPoint: '御茶ノ水駅 御茶ノ水橋口',
      direction: '千葉方面 (Chiba)', alight: 'Kameido (亀戸), 5ª parada, saída norte (北口)', alightPoint: '亀戸駅 北口', minutes: 12, cost: '¥199',
      steps: [
        'Sigam a placa **amarela 総武線 各駅停車**, plataforma **千葉方面 (Chiba)**. Na mesma estação passa o Chūō rápido (laranja): não é esse.',
        'Contem Akihabara, Asakusabashi, Ryōgoku, Kinshichō e **Kameido**, a 5ª. Desçam.',
        'Sigam a placa amarela **北口 North Exit**.',
      ],
    },
    walk(4, 'do 北口, uns 300 m até a Kameido 1-35-8, atravessando a Keiyō-dōri, a avenida larga — sigam o mapa'),
  ],
  'd03-sano-miso': [
    walk(4, 'de volta à JR Kameido, pelo **北口**'),
    {
      mode: 'train', line: 'JR Sōbu local (amarelo)', board: 'Kameido (亀戸), saída norte', boardPoint: '亀戸駅 北口',
      direction: '三鷹方面 (Mitaka · Nakano)', alight: 'Ochanomizu (御茶ノ水), 5ª parada, catraca Ochanomizu-bashi', alightPoint: '御茶ノ水駅 御茶ノ水橋口', minutes: 12, cost: '¥199',
      note: 'saiam de Kameido até as 10:50 para chegar ao turno das 11:30',
      steps: [
        'Plataforma **三鷹方面 (Mitaka)**, trem **amarelo**.',
        'Contem Kinshichō, Ryōgoku, Asakusabashi, Akihabara e **Ochanomizu**, a 5ª. Desçam.',
        'Saiam pela catraca **お茶の水橋口** e atravessem a ponte de volta para o lado do metrô.',
      ],
    },
    {
      mode: 'metro', line: 'Marunouchi Line (vermelha, M)', board: 'Ochanomizu (御茶ノ水), entrada do lado da JR', boardPoint: '御茶ノ水駅 2番出口',
      direction: '池袋 Ikebukuro', alight: 'Shin-Ōtsuka (新大塚), 4ª parada', alightPoint: '新大塚駅', minutes: 9, cost: '¥180',
      steps: [
        'Aqui também cada sentido tem a sua catraca. Entrem pela **2番出口 (saída 2)**, a catraca **JR御茶ノ水駅方面**, que é a do sentido **池袋方面 (Ikebukuro)**. Confiram a placa antes de passar.',
        'Contem Hongō-sanchōme, Kōrakuen, Myōgadani e **Shin-Ōtsuka**, a 4ª. Desçam.',
        'Como de manhã, vocês saem do lado de Bunkyō (saída 2) e atravessam a avenida para Minami-Ōtsuka.',
      ],
    },
    walk(5, 'mesmo caminho da manhã'),
  ],
  'd03-nakiryu': [
    walk(5, 'de volta à estação Shin-Ōtsuka, pela **saída 1**, a do lado do Nakiryu: é a do sentido Ginza'),
    {
      mode: 'metro', line: 'Marunouchi Line (vermelha, M)', board: 'Shin-Ōtsuka (新大塚), entrada 1', boardPoint: '新大塚駅 1番出口',
      direction: '銀座・荻窪方面 (Ginza/Ogikubo)', alight: 'Ginza (銀座), 8ª parada, saída A13', alightPoint: '銀座駅 A13出口', minutes: 17, cost: '¥210',
      steps: [
        'Placa **銀座・荻窪方面**, como de manhã.',
        'São 8 paradas: Myōgadani, Kōrakuen, Hongō-sanchōme, Ochanomizu, Awajichō, Ōtemachi, Tokyo e **Ginza**. Desçam.',
        'Pelo subsolo, sigam a placa amarela **A13**, a mesma de manhã: uns 5 minutos de corredor.',
      ],
    },
    walk(3, 'da A13 ao hotel; as malas esperam na recepção até as 15:30'),
  ],
  'd03-sair-hotel': [
    walk(4, 'com as malas até a estação Higashi-Ginza pela **saída A8**, que é a do hotel, ou táxi na porta (~¥7.000, 30 min)'),
    {
      mode: 'train', line: 'Toei Asakusa Line (rosa, A) → Keikyu (trem direto)', board: 'Higashi-Ginza (東銀座), entrada A8, **plataforma 1**', boardPoint: '東銀座駅 A8出口',
      direction: '羽田空港 Haneda Airport', alight: 'Haneda Airport Terminal 3 (羽田空港第3ターミナル)', alightPoint: '羽田空港第3ターミナル駅', minutes: 40, cost: '¥620',
      note: 'a maioria dos trens da plataforma 1 só vai até Nishi-Magome. Esperem um **快特** ou **エアポート急行** com 羽田空港 no painel — o エアポート快特, que é o mais rápido, NÃO para em Higashi-Ginza',
      steps: [
        'Pela A8, sigam o **A rosa** (都営浅草線) até a **plataforma 1 · 西馬込・羽田空港方面**. A plataforma 2 vai para Oshiage: não é essa.',
        'Só entrem num trem que diga **羽田空港** no painel. Se disser 西馬込, esperem o próximo.',
        'Não precisa contar paradas: desçam em **羽田空港第3ターミナル (Terminal 3)**, a primeira estação do aeroporto. A seguinte é a dos terminais 1 e 2, doméstica: não desçam lá.',
      ],
    },
    walk(5, 'a catraca da Keikyu dá no **saguão de chegadas, 2º andar**: escada rolante para o **3º, partidas**. O voo é operado pela **American** — procurem o balcão dela no painel, não o da JAL'),
  ],
  'd03-haneda': [walk(10, 'check-in, despacho das malas, tax-free na alfândega se pedirem, imigração; a Royce\' é depois da imigração')],
  'd03-duty-free': [walk(10, 'até o portão indicado no cartão de embarque; os portões 140+ ficam longe, contem 15 min')],
  'd03-voo': [{ mode: 'plane', line: 'JL7014 · American', board: 'Haneda T3', alight: 'Dallas, depois Guarulhos', minutes: 720, note: 'conexão de 2h15 em Dallas: imigração americana, pegar e redespachar as malas, segurança de novo' }],

};

export const legsFrom = (stopId: string): Leg[] | undefined => LEGS[stopId];
export const legsToFirst = (dayId: string): Leg[] | undefined => START[dayId];

/** minutos somados de um deslocamento */
export const legsMinutes = (legs: Leg[]) => legs.reduce((n, l) => n + l.minutes, 0);
