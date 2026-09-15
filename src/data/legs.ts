import type { Leg } from './types';

/**
 * Como ir de cada parada até a seguinte: a pé, de trem, metrô, ônibus,
 * bonde, balsa ou táxi, com onde embarcar, onde descer e o sentido.
 * A chave é o id da parada de ORIGEM. `START[dayId]` é do hotel até a
 * primeira parada do dia, e a última parada de cada dia leva de volta ao hotel.
 */
const walk = (minutes: number, note?: string): Leg => ({ mode: 'walk', minutes, note });

export const START: Record<string, Leg[]> = {
  'd2026-11-19': [
    walk(7, 'do Kabukichō pela Yasukuni-dōri até a entrada leste do metrô (Subnade, embaixo da avenida)'),
    { mode: 'metro', line: 'Marunouchi Line', board: 'Shinjuku, entrada leste', direction: 'Ikebukuro', alight: 'Akasaka-mitsuke', minutes: 10 },
    { mode: 'metro', line: 'Ginza Line', board: 'Akasaka-mitsuke (mesma plataforma, do outro lado)', direction: 'Asakusa', alight: 'Asakusa (final)', minutes: 17, cost: '¥260 no total' },
    walk(3, 'saída 1 e o Kaminarimon está na frente'),
  ],
  'd2026-11-20': [walk(12, 'do Kabukichō até a entrada sul da JR Shinjuku (pela Shinjuku-dōri); plataformas 1 e 2 (Shōnan-Shinjuku Line)')],
  'd2026-11-21': [
    walk(8, 'do Kabukichō até a estação Shinjuku-sanchōme (entrada ao lado do Isetan)'),
    { mode: 'metro', line: 'Marunouchi Line', board: 'Shinjuku-sanchōme', direction: 'Ikebukuro', alight: 'Ginza', minutes: 16, cost: '¥210' },
    { mode: 'metro', line: 'Hibiya Line', board: 'Ginza (troca pelo corredor, siga a placa 日比谷線)', direction: 'Kita-Senju', alight: 'Tsukiji, saída 1', minutes: 3, cost: '¥180' },
    walk(3, 'o mercado externo fica atrás do templo Hongan-ji, do outro lado da avenida'),
  ],
  'd2026-11-22': [
    walk(10, 'do Kabukichō até a saída leste da JR Shinjuku'),
    { mode: 'train', line: 'JR Yamanote', board: 'Shinjuku', direction: 'Shibuya · Shinagawa (sentido anti-horário)', alight: 'Harajuku, saída oeste (Meiji-jingū)', minutes: 4, cost: '¥150' },
    walk(2, 'o grande torii fica na saída'),
  ],
  'd2026-11-23': [
    walk(10, 'do Kabukichō até a saída leste da JR Shinjuku, só com a mochila: as malas grandes já foram de takuhaibin'),
    { mode: 'train', line: 'JR Chūō (rápido)', board: 'Shinjuku', direction: 'Tokyo', alight: 'Tokyo (final)', minutes: 15, cost: '¥210' },
  ],
  'd2026-11-24': [
    walk(5, 'o hotel fica na frente da estação: entrem pela saída sul e sigam a placa JR 山陽線; plataforma 1'),
  ],
  'd2026-11-25': [
    walk(5, 'do hotel às catracas do Shinkansen (lado norte da estação), com a mochila; check-out feito'),
  ],
  'd2026-11-26': [
    { mode: 'metro', line: 'Midōsuji Line (vermelha)', board: 'Namba', direction: 'Shin-Osaka · Senri-Chūō', alight: 'Honmachi', minutes: 4 },
    { mode: 'metro', line: 'Chūō Line (verde)', board: 'Honmachi', direction: 'Nagata · Gakken-Nara-Tomigaoka', alight: 'Tanimachi 4-chōme, saída 1-B', minutes: 4, cost: '¥240 no total' },
    walk(12, 'reto até o portão Ōtemon, sobre o fosso'),
  ],
  'd2026-11-27': [
    walk(1, 'a oração é no hondō do próprio templo — é só descer o corredor de meia'),
  ],
  'd2026-11-28': [
    { mode: 'taxi', board: 'na porta do hotel', alight: 'Kiyomizu-dera (清水寺)', minutes: 12, cost: '~¥1.500', note: 'às 5h45 é o jeito certo; ônibus 206 (parada D2 da estação) só começa perto das 6h' },
  ],
  'd2026-11-29': [
    walk(3, 'o 7-Eleven é na própria Kawaramachi; a Hankyu Kyoto-Kawaramachi fica embaixo do hotel'),
    { mode: 'train', line: 'Hankyu Kyoto Line (特急 ou 準急)', board: 'Kyoto-Kawaramachi', direction: 'Osaka-Umeda', alight: 'Katsura (桂)', minutes: 7, note: 'qualquer trem serve: todos param em Katsura' },
    { mode: 'train', line: 'Hankyu Arashiyama Line', board: 'Katsura (mesma estação, plataforma da linha Arashiyama)', direction: 'Arashiyama', alight: 'Arashiyama (final)', minutes: 7, cost: '¥240 no total' },
    walk(18, 'saindo, reto até o rio; atravessa a ponte Togetsukyō e segue pela rua principal — o bambuzal começa atrás do Tenryū-ji, pelo portão norte'),
  ],
  'd2026-11-30': [
    walk(8, 'pela Shijō-dōri para o oeste até a estação Shijō do metrô (linha Karasuma)'),
    { mode: 'metro', line: 'Karasuma Line', board: 'Shijō', direction: 'Takeda', alight: 'Kyoto', minutes: 4, cost: '¥220' },
    walk(4, 'a Kintetsu fica no térreo, lado oeste da estação, ao lado do Shinkansen; plataformas 1 a 4'),
  ],
  'd2026-12-01': [
    walk(8, 'check-out feito e as malas na recepção (o hotel despacha o takuhaibin para Ginza); atravessa a ponte Shijō até a Keihan Gion-Shijō'),
    { mode: 'train', line: 'Keihan Main Line (local 普通 ou 準急)', board: 'Gion-Shijō', direction: 'Yodoyabashi · Nakanoshima', alight: 'Tōfukuji (3ª parada)', minutes: 5, cost: '¥220', note: 'o limited express não para em Tōfukuji' },
    walk(10, 'saindo, siga o fluxo para o sul até a ponte Gaun-kyō'),
  ],
  'd2026-12-02': [
    walk(5, 'do hotel até a estação Ginza'),
    { mode: 'metro', line: 'Ginza Line', board: 'Ginza', direction: 'Shibuya', alight: 'Gaienmae, saída 4a', minutes: 12, cost: '¥210' },
    walk(3, 'a alameda começa na esquina do Itchome, é impossível errar'),
  ],
  'd2026-12-03': [
    { mode: 'metro', line: 'Hibiya Line', board: 'Ginza', direction: 'Naka-Meguro', alight: 'Tsukiji, saída 1', minutes: 3, cost: '¥180' },
    walk(3, 'o mercado externo fica atrás do templo Hongan-ji'),
  ],
};

export const LEGS: Record<string, Leg[]> = {
  // ── 18 nov · chegada ──────────────────────────────────────────────
  'd18-haneda': [walk(5, 'siga as placas Keikyu Line, no sub-solo do T3; antes, comprem a Suica na máquina (ou usem a do celular)')],
  'd18-trem-shinjuku': [
    { mode: 'train', line: 'Keikyu Airport Line', board: 'Haneda Airport T3 (Keikyu)', direction: 'Shinagawa · Sengakuji', alight: 'Shinagawa', minutes: 15, cost: '¥330' },
    { mode: 'train', line: 'JR Yamanote', board: 'Shinagawa, plataforma 2', direction: 'Shibuya · Shinjuku', alight: 'Shinjuku', minutes: 19, cost: '¥210' },
    walk(3, 'saída oeste: o Omoide Yokochō fica colado à estação. O hotel é do outro lado, no Kabukichō — 8 min pela passagem sob os trilhos, na Yasukuni-dōri'),
  ],
  'd18-ramen': [walk(3)],
  'd18-konbini': [walk(8, 'pela Yasukuni-dōri para o leste até o Kabukichō; o hotel fica a 3 min da Seibu-Shinjuku')],

  // ── 19 nov · Asakusa, Ueno, Akihabara ─────────────────────────────
  'd19-kuramae': [walk(6, 'para o norte até o Kaminarimon — a lanterna vermelha gigante é impossível de errar')],
  'd19-sensoji': [walk(10, 'saindo pela Nakamise, passa no Kagetsudō pelo melonpan e segue pela Asakusa-dōri para o oeste; a rua das panelas começa no cozinheiro gigante do prédio Niimi')],
  'd19-kappabashi': [
    walk(5, 'até a estação Tawaramachi'),
    { mode: 'metro', line: 'Ginza Line', board: 'Tawaramachi', direction: 'Shibuya', alight: 'Ueno', minutes: 4, cost: '¥180', note: 'ou 20 min a pé pela Asakusa-dōri, se as pernas estiverem boas' },
    walk(10, 'saída do parque; o museu fica no fundo do Parque Ueno'),
  ],
  'd19-museu-nacional': [walk(8, 'dentro do parque, descendo na direção do lago Shinobazu')],
  'd19-almoco-ueno': [walk(6, 'saída sul do parque; a rua é debaixo dos trilhos')],
  'd19-ameyoko': [
    { mode: 'train', line: 'JR Yamanote ou Keihin-Tōhoku', board: 'Okachimachi', direction: 'Tokyo · Shinagawa', alight: 'Akihabara, saída Electric Town', minutes: 3, cost: '¥150', note: 'ou 15 min a pé seguindo os trilhos para o sul' },
  ],
  'd19-akihabara': [walk(1, 'o Radio Kaikan está na frente da saída Electric Town')],
  'd19-radio-kaikan': [walk(6, 'pela Chūō-dōri para o norte, atrás do quarteirão do Don Quijote')],
  'd19-hanabusa': [walk(5, 'de volta à estação; o JINS fica no Atre, colado à estação')],
  'd19-oculos': [walk(10, 'para o sul pela rua paralela aos trilhos até Kanda; o Kikanbō fica a 3 min da estação Kanda')],
  'd19-jantar': [
    { mode: 'train', line: 'JR Chūō (rápido)', board: 'Kanda, plataforma do Chūō', direction: 'Shinjuku · Takao', alight: 'Shinjuku', minutes: 13, cost: '¥210' },
    walk(10, 'saída leste e pela Yasukuni-dōri até o Kabukichō'),
  ],

  // ── 20 nov · Kamakura ─────────────────────────────────────────────
  'd20-trem-kamakura': [
    { mode: 'train', line: 'JR Shōnan-Shinjuku Line', board: 'Shinjuku, plataformas 1 e 2', direction: 'Zushi (逗子)', alight: 'Kita-Kamakura', minutes: 55, cost: '¥950', note: 'só o trem que vai a ZUSHI passa por Kamakura; o que vai a Odawara não. Desçam uma estação antes de Kamakura' },
    walk(1, 'o Engaku-ji fica na saída'),
  ],
  'd20-engakuji': [walk(15, 'pela rua principal (Kenchō-ji fica no caminho para Kamakura), calçada à direita')],
  'd20-kenchoji': [walk(12, 'seguindo a mesma rua para o sul; o santuário aparece à esquerda')],
  'd20-hachimangu': [walk(3, 'a Komachi-dōri começa no torii vermelho grande, do lado direito da avenida')],
  'd20-komachi': [walk(8, 'descendo a Komachi-dōri até a Estação Kamakura; a Enoden fica no lado oeste, com bilheteria própria')],
  'd20-enoden': [
    { mode: 'train', line: 'Enoden', board: 'Kamakura (Enoden)', direction: 'Fujisawa', alight: 'Hase (3ª parada)', minutes: 5, cost: '¥200' },
    walk(8, 'para o norte na saída; o Kōtoku-in está no fim da rua'),
  ],
  'd20-daibutsu': [walk(6, 'de volta pela mesma rua; Hase-dera à direita')],
  'd20-hasedera': [walk(5, 'até a estação Hase')],
  'd20-volta': [
    { mode: 'train', line: 'Enoden', board: 'Hase', direction: 'Kamakura', alight: 'Kamakura (final)', minutes: 5, cost: '¥200' },
    { mode: 'train', line: 'JR Shōnan-Shinjuku Line', board: 'Kamakura', direction: 'Shinjuku · Ōmiya', alight: 'Shinjuku', minutes: 60, cost: '¥950', note: 'se o próximo for só até Ōfuna, troquem lá para o Shōnan-Shinjuku' },
    walk(12, 'saída leste e pela Yasukuni-dōri até o Kabukichō'),
  ],

  // ── 21 nov · Tsukiji, Ginza, Estação de Tóquio ─────────────────────
  'd21-tsukiji': [walk(10, 'para o sul, atravessando a avenida; a entrada do jardim é o portão Ōtemon')],
  'd21-hamarikyu': [walk(15, 'pela saída Ōtemon, passando por Shiodome, até a Ginza; o Kagari fica numa galeria perto da Ginza-Itchōme')],
  'd21-almoco-ginza': [walk(3, 'o quadrilátero é a avenida Chūō e as paralelas')],
  'd21-ginza': [
    { mode: 'metro', line: 'Marunouchi Line', board: 'Ginza', direction: 'Ikebukuro', alight: 'Tokyo', minutes: 2, cost: '¥180', note: 'ou 15 min a pé pela Yūrakuchō, passando debaixo dos trilhos' },
    walk(3, 'saída Marunouchi sul; o KITTE é o prédio branco em frente, terraço no 6º'),
  ],
  'd21-kitte': [walk(8, 'atravessa a estação pelo corredor livre até o lado Yaesu; a Ramen Street fica no sub-solo (First Avenue)')],
  'd21-jantar-estacao': [
    { mode: 'train', line: 'JR Yamanote', board: 'Tokyo', direction: 'Shinagawa · Shibuya', alight: 'Ebisu', minutes: 20, cost: '¥210' },
    walk(5, 'saída oeste; o Uchino Building fica na Ebisu-Nishi, e o bar é no 4º andar'),
  ],
  'd21-bar-triad': [
    { mode: 'train', line: 'JR Yamanote', board: 'Ebisu', direction: 'Shibuya · Shinjuku', alight: 'Shinjuku', minutes: 11, cost: '¥180', note: 'passa da meia-noite? O último trem da Yamanote sai por volta de 00:30; depois disso é táxi (~¥2.500 até o Kabukichō)' },
    walk(10, 'saída leste e pela Yasukuni-dōri até o Kabukichō'),
  ],

  // ── 22 nov · Meiji, Omotesandō, Shibuya ────────────────────────────
  'd22-meiji-jingu': [walk(5, 'de volta pelo torii, atravessa a rua da estação e a Omotesandō começa ali')],
  'd22-omotesando': [walk(8, 'o Afuri fica numa transversal, perto da estação Harajuku')],
  'd22-almoco': [
    walk(8, 'até a estação Omote-sandō'),
    { mode: 'metro', line: 'Ginza Line', board: 'Omote-sandō', direction: 'Asakusa', alight: 'Gaienmae, saída 4a', minutes: 2, cost: '¥180', note: 'ou 20 min a pé pela Aoyama-dōri' },
    walk(5, 'a alameda começa na esquina do Itchome, é impossível errar'),
  ],
  'd22-gaien': [
    walk(5, 'de volta à estação Gaienmae'),
    { mode: 'metro', line: 'Ginza Line', board: 'Gaienmae', direction: 'Shibuya', alight: 'Shibuya (final)', minutes: 6, cost: '¥180' },
    walk(7, 'saída Hachikō, atravessa o cruzamento e sobe a Center-gai; o PARCO fica no fim dela, à direita'),
  ],
  'd22-parco': [walk(5, 'desce a Center-gai de volta; o cruzamento está no fim dela')],
  'd22-cruzamento': [walk(5, 'o Mark City é o prédio colado à saída oeste da estação (o sushi fica no 4º)')],
  'd22-jantar': [
    { mode: 'train', line: 'JR Yamanote', board: 'Shibuya', direction: 'Shinjuku · Ikebukuro', alight: 'Shinjuku', minutes: 7, cost: '¥170' },
    walk(10, 'saída leste e pela Yasukuni-dōri até o Kabukichō'),
  ],

  // ── 23 nov · Shinkansen e Hiroshima ────────────────────────────────
  'd23-konbini': [walk(5, 'catracas do Tōkaidō Shinkansen no lado Yaesu; plataformas 14 a 19. Ekiben na loja antes de passar')],
  'd23-trem-hiroshima': [
    { mode: 'shinkansen', line: 'Nozomi', board: 'Tokyo, plataforma indicada no bilhete (14–19)', direction: 'Hakata (博多)', alight: 'Hiroshima', minutes: 235, cost: '¥19.800 reservado', note: 'número do carro está no bilhete; a fila é na marca do chão. Fuji do lado direito, uns 40 min depois de sair' },
    walk(3, 'saída norte da estação; o ekie é o shopping dentro da própria estação, 2º andar'),
  ],
  'd23-pokemon-center': [
    walk(5, 'do ekie, desça para a saída sul: o APA fica na frente da estação, do lado da ponte Ekimae-Ōhashi'),
  ],
  'd23-chegada': [
    walk(4, 'de volta à estação: o terminal do bonde fica no 2º andar do prédio novo, do lado sul'),
    { mode: 'tram', line: 'bonde 2 ou 6', board: 'Hiroshima Station (terminal no 2º andar)', direction: 'Miyajimaguchi (2) · Eba (6)', alight: 'Genbaku-Dōmu-mae', minutes: 16, cost: '¥240, paga ao descer' },
    walk(4, 'o museu fica no fundo do parque, atravessando a ponte'),
  ],
  'd23-museu-paz': [walk(5, 'pelo eixo do parque: cenotáfio, chama, e a ponte até o Domo')],
  'd23-parque-domo': [walk(3, 'o Nagataya fica na rua ao lado do Domo')],
  'd23-okonomiyaki': [
    walk(3, 'até a parada Genbaku-Dōmu-mae'),
    { mode: 'tram', line: 'bonde 2 ou 6', board: 'Genbaku-Dōmu-mae', direction: 'Hiroshima Station (広島駅)', alight: 'Hiroshima Station (final)', minutes: 18, cost: '¥240', note: 'táxi ~¥1.500 se estiverem mortos' },
    walk(5, 'até o hotel, saída sul'),
  ],

  // ── 24 nov · Miyajima ──────────────────────────────────────────────
  'd24-ferry-miyajima': [
    { mode: 'train', line: 'JR Sanyō Line', board: 'Hiroshima, plataforma 1', direction: 'Iwakuni (岩国)', alight: 'Miyajimaguchi', minutes: 27, cost: '¥420' },
    walk(4, 'saída da estação, reto até o píer; a balsa da JR é a da direita'),
    { mode: 'ferry', line: 'balsa JR', board: 'Miyajimaguchi', alight: 'Miyajima', minutes: 10, cost: '¥200 + ¥100 de taxa de visitante', note: 'fiquem no lado direito do convés: a balsa passa perto do torii' },
    walk(12, 'pela orla, seguindo os cervos, até o santuário'),
  ],
  'd24-itsukushima': [walk(10, 'saindo pelo lado oposto da entrada, subida pelas escadas ao lado do pagode')],
  'd24-daishoin': [walk(12, 'descendo e seguindo o riacho para o vale dos bordos')],
  'd24-momijidani': [
    walk(3, 'até a parada do micro-ônibus gratuito do teleférico, na entrada do parque (ou 10 min de subida a pé)'),
    { mode: 'cable', line: 'Miyajima Ropeway (2 trechos)', board: 'Momijidani', alight: 'Shishiiwa', minutes: 15, cost: '¥2.000 ida e volta', note: 'troca de cabine em Kayatani; do topo do teleférico ao cume real são mais 30 min a pé' },
  ],
  'd24-misen': [
    walk(30, 'de volta do cume ao teleférico'),
    { mode: 'cable', line: 'Miyajima Ropeway', board: 'Shishiiwa', alight: 'Momijidani', minutes: 15, note: 'último teleférico de descida às 17:00' },
    walk(15, 'até a rua de comércio (Omotesandō)'),
  ],
  'd24-comer-miyajima': [
    walk(10, 'até o píer'),
    { mode: 'ferry', line: 'balsa JR', board: 'Miyajima', alight: 'Miyajimaguchi', minutes: 10, cost: '¥200' },
    { mode: 'train', line: 'JR Sanyō Line', board: 'Miyajimaguchi', direction: 'Hiroshima (広島)', alight: 'Hiroshima', minutes: 27, cost: '¥420' },
    walk(15, 'saída norte (Shinkansen), para o oeste ao longo da avenida; o jardim fica atrás do museu de arte'),
  ],
  'd24-shukkeien': [
    { mode: 'tram', line: 'bonde 9', board: 'Shukkeien-mae', direction: 'Hatchōbori', alight: 'Hatchōbori (final)', minutes: 5, cost: '¥240', note: 'ou 15 min a pé' },
    walk(5, 'o Bakudan-ya fica nas ruas atrás da Hondōri'),
  ],
  'd24-jantar': [
    walk(5, 'até a parada Hatchōbori'),
    { mode: 'tram', line: 'bonde 1, 2 ou 6', board: 'Hatchōbori', direction: 'Hiroshima Station (広島駅)', alight: 'Hiroshima Station (final)', minutes: 12, cost: '¥240', note: 'ou 20 min a pé pela avenida' },
    walk(5, 'até o hotel, saída sul'),
  ],

  // ── 25 nov · Kurashiki, Himeji, Osaka ──────────────────────────────
  'd25-trem-kurashiki': [
    { mode: 'shinkansen', line: 'Sanyō Shinkansen (Nozomi, Sakura ou Hikari)', board: 'Hiroshima, plataformas 11–14', direction: 'Shin-Osaka · Tokyo', alight: 'Okayama', minutes: 38, cost: '~¥6.000' },
    { mode: 'train', line: 'JR Sanyō Line', board: 'Okayama, plataformas 3–4 (siga a placa 山陽線)', direction: 'Fukuyama · Mihara', alight: 'Kurashiki (3ª parada)', minutes: 17, cost: '¥330' },
    walk(12, 'armários na saída sul; depois reto pela Kurashiki Chūō-dōri até o canal'),
  ],
  'd25-bikan': [walk(3, 'o museu é o prédio de colunas gregas na margem do canal')],
  'd25-ohara': [walk(5, 'o Kamoi fica na margem oposta, perto da ponte Nakabashi')],
  'd25-almoco-kurashiki': [walk(12, 'de volta pela mesma rua até a estação; pegar a mochila no armário')],
  'd25-trem-himeji': [
    { mode: 'train', line: 'JR Sanyō Line', board: 'Kurashiki', direction: 'Okayama', alight: 'Okayama', minutes: 17, cost: '¥330' },
    { mode: 'shinkansen', line: 'Hikari ou Sakura (o Nozomi nem sempre para em Himeji)', board: 'Okayama, plataformas 21–24', direction: 'Shin-Osaka · Tokyo', alight: 'Himeji', minutes: 20, cost: '~¥3.500' },
    walk(15, 'saída norte, reto pela avenida Ōtemae; o castelo está no fim, à vista o tempo todo. Armários na estação (ou ônibus circular ¥100 até Ōtemon)'),
  ],
  'd25-himeji': [walk(15, 'de volta pela avenida até a estação; pegar a mochila')],
  'd25-trem-osaka': [
    { mode: 'train', line: 'JR Special Rapid (新快速)', board: 'Himeji, plataformas 5–6', direction: 'Osaka · Kyoto · Yasu', alight: 'Osaka', minutes: 60, cost: '¥1.520', note: 'sem reserva; entrem pela ponta do trem para achar lugar' },
    { mode: 'metro', line: 'Midōsuji Line (vermelha)', board: 'Umeda (siga 御堂筋線 pelo sub-solo)', direction: 'Tennōji · Nakamozu', alight: 'Namba', minutes: 8, cost: '¥240' },
    walk(5, 'check-in no hotel, e o Dōtonbori fica a poucos minutos'),
  ],
  'd25-dotonbori': [walk(5, 'até o hotel')],

  // ── 26 nov · meia manhã de Osaka e a subida para Kōyasan ───────────
  'd26-castelo-osaka': [
    walk(12, 'saída pelo portão Ōtemon, até a estação Tanimachi 4-chōme'),
    { mode: 'metro', line: 'Chūō Line (verde)', board: 'Tanimachi 4-chōme', direction: 'Cosmosquare', alight: 'Sakaisuji-Hommachi', minutes: 3 },
    { mode: 'metro', line: 'Sakaisuji Line (marrom)', board: 'Sakaisuji-Hommachi', direction: 'Tengachaya', alight: 'Nippombashi, saída 10', minutes: 5, cost: '¥240 no total' },
    walk(2, 'a galeria do Kuromon começa na saída'),
  ],
  'd26-kuromon': [
    walk(8, 'pela galeria até o hotel, em Sennichimae, para pegar a mochila'),
    walk(6, 'do hotel até a **Nankai Namba**, que fica no 3º andar do prédio da Takashimaya — não confundir com a estação do metrô; o 7-Eleven é no 2º andar, ao lado da catraca central'),
  ],
  'd26-konbini': [walk(2, 'suba um andar: as plataformas da linha Kōya ficam no 3º')],
  'd26-nankai': [
    { mode: 'train', line: 'Nankai Kōya Line · 特急こうや ou 快速急行', board: 'Nankai Namba, plataformas 3–4 (3º andar)', direction: 'Gokurakubashi (極楽橋)', alight: 'Gokurakubashi (final)', minutes: 85, cost: 'no passe', note: 'no 快速急行 pode ser preciso trocar em Hashimoto — o painel avisa' },
    { mode: 'cable', line: 'funicular de Kōyasan (高野山ケーブル)', board: 'Gokurakubashi (mesma plataforma, siga a multidão)', direction: 'Kōyasan', alight: 'Estação de Kōyasan', minutes: 5, cost: 'no passe', note: 'rampa de 30 graus; fiquem em pé segurando ou sentem nos degraus' },
    { mode: 'bus', line: 'Nankai Rinkan · linha do Okunoin', board: 'terminal em frente à estação de Kōyasan', direction: 'Okunoin-mae (奥の院前)', alight: 'Ichinohashi-guchi (一の橋口)', minutes: 13, cost: 'no passe', note: 'é proibido ir a pé da estação à cidade: a estrada não tem calçada' },
    walk(3, 'o templo fica na rua principal, perto da boca do Ichinohashi'),
  ],
  'd26-checkin-shukubo': [
    walk(5, 'para o leste pela rua principal até a ponte do Ichinohashi, onde começa o Okunoin'),
  ],
  'd26-okunoin': [
    walk(35, 'os 2 km de volta pelo cemitério até o Ichinohashi — ou o ônibus de Okunoin-mae, se o frio apertar'),
    walk(3, 'até o templo'),
  ],
  'd26-jantar-shojin': [
    walk(5, 'até o lobby do Ekō-in, se forem no tour guiado; senão, direto para o Ichinohashi'),
  ],
  'd26-okunoin-noite': [
    walk(8, 'de volta ao templo, pela rua principal'),
  ],

  // ── 27 nov · Kōyasan de manhã, Sumiyoshi no caminho, Kyoto à noite ──
  'd27-gongyo': [
    walk(4, 'café da manhã no próprio templo, e depois a pé para o oeste pela rua principal'),
    { mode: 'bus', line: 'Nankai Rinkan', board: 'Ichinohashi-guchi (一の橋口)', direction: 'Daimon (大門)', alight: 'Kondō-mae (金堂前)', minutes: 8, cost: 'no passe', note: 'dá para ir a pé em 20 min pela rua principal, que é bonita de manhã' },
  ],
  'd27-garan': [walk(5, 'para o leste, atravessando a rua: o portão do Kongōbu-ji fica logo ali')],
  'd27-kongobuji': [
    walk(10, 'de volta ao templo pela mochila'),
    { mode: 'bus', line: 'Nankai Rinkan', board: 'Ichinohashi-guchi (一の橋口)', direction: 'Kōyasan Station (高野山駅)', alight: 'Estação de Kōyasan (final)', minutes: 15, cost: 'no passe' },
  ],
  'd27-descida': [
    { mode: 'cable', line: 'funicular de Kōyasan', board: 'Estação de Kōyasan', direction: 'Gokurakubashi', alight: 'Gokurakubashi', minutes: 5, cost: 'no passe' },
    { mode: 'train', line: 'Nankai Kōya Line', board: 'Gokurakubashi (mesma plataforma)', direction: 'Namba (なんば)', alight: 'Sumiyoshi-Higashi (住吉東)', minutes: 80, cost: 'no passe', note: 'quase sempre é preciso trocar em Hashimoto; Sumiyoshi-Higashi é parada de local, então pode haver mais uma troca em Kishinosato-Tamade' },
    walk(10, 'para o oeste até o santuário; a ponte curva vermelha aparece antes do portão'),
  ],
  'd27-sumiyoshi': [
    walk(10, 'de volta à estação Sumiyoshi-Higashi'),
    { mode: 'train', line: 'Nankai Kōya Line', board: 'Sumiyoshi-Higashi', direction: 'Namba', alight: 'Nankai Namba (final)', minutes: 15, cost: 'no passe' },
    walk(3, 'o balcão do 551 Hōrai fica na própria estação; a depachika da Takashimaya é no mesmo prédio'),
  ],
  'd27-almoco': [
    walk(4, 'até a estação Namba do metrô, linha Midōsuji'),
    { mode: 'metro', line: 'Midōsuji Line (vermelha)', board: 'Namba', direction: 'Shin-Osaka · Senri-Chūō', alight: 'Umeda', minutes: 8, cost: '¥240' },
    walk(6, 'siga a placa 阪急 (Hankyu), que é um prédio diferente da JR: as plataformas do Kyoto Line ficam no alto'),
  ],
  'd27-trem-kyoto': [
    { mode: 'train', line: 'Hankyu Kyoto Line · limited express (特急)', board: 'Osaka-Umeda (Hankyu), plataformas 2–3', direction: 'Kyoto-Kawaramachi (京都河原町)', alight: 'Kyoto-Kawaramachi (final)', minutes: 45, cost: '¥410', note: 'sem reserva e sem taxa extra; o limited express é o mais rápido e passa a cada 10 min' },
    walk(4, 'o hotel fica na saída do Shijō-Kawaramachi — as malas do takuhaibin devem estar na recepção'),
    walk(3, 'do hotel, a entrada leste do Nishiki fica na Teramachi, a uma quadra'),
  ],
  'd27-nishiki-rapido': [
    walk(8, 'até a estação Gion-Shijō da Keihan, atravessando a ponte Shijō sobre o rio Kamo'),
    { mode: 'train', line: 'Keihan Main Line', board: 'Gion-Shijō', direction: 'Yodoyabashi · Nakanoshima', alight: 'Fushimi-Inari', minutes: 10, cost: '¥220', note: 'não pegue o limited express: ele passa direto por Fushimi-Inari' },
    walk(5, 'pela rua das barracas até o portão'),
  ],
  'd27-fushimi-inari': [
    walk(5, 'até a estação Fushimi-Inari da Keihan'),
    { mode: 'train', line: 'Keihan Main Line (local ou 準急)', board: 'Fushimi-Inari', direction: 'Yodoyabashi · Nakanoshima', alight: 'Fushimi-Momoyama (5ª parada)', minutes: 12, cost: '¥220', note: 'o limited express não para em Fushimi-Momoyama' },
    walk(7, 'pela galeria Ōtesuji para o oeste e depois para o sul; o Torisei fica na rua das kuras, atrás da Yamamoto Honke'),
  ],
  'd27-jantar': [
    walk(7, 'de volta à Keihan Fushimi-Momoyama'),
    { mode: 'train', line: 'Keihan Main Line (準急 ou local)', board: 'Fushimi-Momoyama', direction: 'Demachiyanagi · Sanjō', alight: 'Gion-Shijō', minutes: 20, cost: '¥280', note: 'últimos: 23:26 e 00:08 (準急); confirmar na placa, a Keihan mudou o horário em agosto' },
    walk(8, 'atravessando a ponte Shijō de volta ao hotel'),
  ],

  // ── 28 nov · Higashiyama ───────────────────────────────────────────
  'd28-kiyomizu': [walk(5, 'descendo pela ladeira das lojas (Matsubara-dōri); a Sannenzaka é a escada à direita')],
  'd28-sannenzaka': [walk(8, 'pela Ninenzaka e depois pelo Nene-no-michi; o Kōdai-ji fica no alto, à direita')],
  'd28-kodaiji': [
    walk(10, 'descendo até a parada de ônibus Gion, na avenida Shijō'),
    { mode: 'bus', line: 'ônibus 203', board: 'parada Gion (祇園), lado norte da Shijō', direction: 'Ginkakuji-michi · Kinrin-shako', alight: 'Ginkakuji-michi', minutes: 20, cost: '¥230, paga ao descer', note: 'táxi ~¥1.800 e 12 min, se a fila do ônibus estiver grande' },
    walk(8, 'subindo a rua das lojas até o templo'),
  ],
  'd28-ginkakuji': [walk(2, 'o caminho começa no fim da rua do templo, ao longo do canal')],
  'd28-filosofo': [walk(5, 'o Omen fica na entrada norte do caminho, perto do Ginkaku-ji')],
  'd28-almoco': [walk(30, 'o caminho inteiro para o sul, 2 km ao longo do canal; termina nas costas do Nanzen-ji')],
  'd28-nanzenji': [walk(8, 'para o norte pela rua atrás do aqueduto')],
  'd28-eikando': [
    walk(4, 'até a parada Nanzenji-Eikandō-michi'),
    { mode: 'bus', line: 'ônibus 5', board: 'Nanzenji-Eikandō-michi', direction: 'Kyoto Station (京都駅)', alight: 'Shijō-Kawaramachi', minutes: 20, cost: '¥230', note: 'sábado de pico: se a fila do ônibus estiver feia, táxi direto até Gion, ~¥1.500 e 12 min' },
    walk(8, 'atravessa a ponte Shijō; a Hanamikōji é a segunda rua à direita depois da ponte, e a casa de chá fica descendo ela'),
  ],
  'd28-kitagawa': [walk(5, 'pela Hanamikōji de volta à Shijō-dōri: Izuju fica na frente do santuário Yasaka, Pontochō do outro lado da ponte')],
  'd28-gion': [walk(12, 'a pé mesmo: pela Shijō-dōri, atravessando a ponte, até o hotel na esquina da Kawaramachi. Não depende de ônibus nenhum')],

  // ── 29 nov · Arashiyama, Kinkaku-ji ────────────────────────────────
  'd29-konbini': [
    walk(2, 'a Hankyu Kyoto-Kawaramachi fica embaixo do hotel'),
    { mode: 'train', line: 'Hankyu Kyoto Line (特急 ou 準急)', board: 'Kyoto-Kawaramachi', direction: 'Osaka-Umeda', alight: 'Katsura (桂)', minutes: 7, note: 'qualquer trem serve: todos param em Katsura' },
    { mode: 'train', line: 'Hankyu Arashiyama Line', board: 'Katsura (mesma estação, plataforma da linha Arashiyama)', direction: 'Arashiyama', alight: 'Arashiyama (final)', minutes: 7, cost: '¥240 no total' },
    walk(18, 'saindo, reto até o rio; atravessa a ponte Togetsukyō e segue pela rua principal — o bambuzal começa atrás do Tenryū-ji, pelo portão norte'),
  ],
  'd29-bambu': [walk(5, 'o portão norte do Tenryū-ji abre para dentro do bambuzal')],
  'd29-tenryuji': [walk(10, 'de volta ao bambuzal e subindo até o fim da trilha; a villa é o portão à direita')],
  'd29-okochi-sanso': [walk(15, 'descendo até o rio; a ponte é o marco')],
  'd29-togetsukyo': [walk(5, 'o Yoshimura fica na cabeceira norte da ponte, com a varanda para o rio')],
  'd29-almoco': [
    { mode: 'taxi', board: 'ponto de táxi na frente da estação Randen Arashiyama', alight: 'Kinkaku-ji (金閣寺)', minutes: 20, cost: '~¥2.500', note: 'o jeito que poupa uma hora. Alternativa: bonde Randen até Kitano-Hakubaichō (troca em Katabiranotsuji, 25 min ¥250) e ônibus 205 até Kinkakuji-michi' },
  ],
  'd29-kinkakuji': [walk(15, 'pela Kinukake-no-michi, a estrada em descida à esquerda da saída; ou ônibus 59, duas paradas')],
  'd29-ryoanji': [
    walk(3, 'até a parada Ryōanji-mae, na frente do templo'),
    { mode: 'bus', line: 'ônibus 59', board: 'Ryōanji-mae', direction: 'Sanjō-Keihan · Shijō-Kawaramachi', alight: 'Shijō-Kawaramachi', minutes: 40, cost: '¥230' },
    walk(6, 'o Nishiki é a galeria coberta uma quadra ao norte da Shijō'),
  ],
  'd29-nishiki': [walk(8, 'saindo do Nishiki pela ponta leste (Teramachi) e subindo a Kawaramachi para o norte, três quadras; o Umezono fica na Kawaramachi, antes de chegar na Sanjō')],
  'd29-umezono': [walk(2, 'a esquina da Kawaramachi com a Sanjō é logo ali: a placa do Musashi é um sushi girando')],
  'd29-jantar-musashi': [walk(6, 'pela Kawaramachi de volta ao hotel, para o sul')],

  // ── 30 nov · Nara ──────────────────────────────────────────────────
  'd30-trem-nara': [
    { mode: 'train', line: 'Kintetsu Limited Express (特急)', board: 'Kintetsu Kyoto, plataformas 1–4', direction: 'Kintetsu-Nara (近鉄奈良)', alight: 'Kintetsu-Nara (final), saída 2', minutes: 35, cost: '¥1.280 (¥760 + ¥520 do assento reservado)', note: 'comprem o assento na máquina ou no guichê; o expresso comum (急行) leva 45 min e não precisa de reserva' },
    walk(5, 'saída 2, reto pela Sanjō-dōri para o leste; os cervos aparecem antes do parque'),
  ],
  'd30-parque-nara': [walk(10, 'para o norte pelo parque até o portão Nandaimon')],
  'd30-todaiji': [walk(10, 'saindo pelo lado leste do salão, subida pela escada de pedra')],
  'd30-nigatsudo': [walk(20, 'para o sul pela trilha na borda da floresta (Kasuga-yama), passando o Tamukeyama Hachiman-gū')],
  'd30-kasuga-taisha': [walk(15, 'de volta pela alameda de lanternas até a rua Sanjō; a loja de kakinoha-zushi fica perto da galeria Higashimuki')],
  'd30-almoco': [walk(5, 'o pagode está à vista, subindo a rua')],
  'd30-kofukuji': [walk(8, 'descendo até o lago Sarusawa e continuando para o sul: Naramachi são as ruas de casas antigas atrás do lago')],
  'd30-naramachi': [
    walk(10, 'até a estação Kintetsu-Nara'),
    { mode: 'train', line: 'Kintetsu (特急 ou 急行)', board: 'Kintetsu-Nara', direction: 'Kyoto (京都)', alight: 'Kyoto (final)', minutes: 40, cost: '¥1.280 reservado · ¥760 no expresso comum', note: 'confiram que o trem vai a KYOTO: metade vai para Osaka-Namba' },
    { mode: 'metro', line: 'Karasuma Line', board: 'Kyoto (metrô, lado norte da estação)', direction: 'Kokusaikaikan', alight: 'Shijō', minutes: 4, cost: '¥220' },
    walk(8, 'pela Shijō-dōri para o leste até a esquina da Kawaramachi'),
  ],
  'd30-jantar': [walk(6, 'subindo a Kawaramachi até a Sanjō; o Karafuneya é o café grande do lado do Onimaru')],
  'd30-karafuneya': [walk(6, 'pela Kawaramachi de volta ao hotel')],

  // ── 1 dez · Tōfuku-ji e o Shinkansen ───────────────────────────────
  'd01-tofukuji': [walk(20, 'para o norte pela Higashiōji-dōri; o Sanjūsangen-dō fica atrás do Museu Nacional. Táxi ~¥1.000 se estiverem cansados')],
  'd01-sanjusangendo': [
    walk(8, 'pela Shichijō-dōri para o leste até a Keihan Shichijō'),
    { mode: 'train', line: 'Keihan Main Line', board: 'Shichijō', direction: 'Demachiyanagi', alight: 'Gion-Shijō (2ª parada)', minutes: 4, cost: '¥220', note: 'qualquer trem serve' },
    walk(8, 'atravessa a ponte Shijō até o hotel'),
  ],
  'd01-malas': [
    { mode: 'taxi', board: 'na porta do hotel', alight: 'Kyoto Station, lado Karasuma (京都駅 烏丸口)', minutes: 12, cost: '~¥1.200', note: 'com as malas de mão é o jeito. Sem pressa: Hankyu 1 parada até Karasuma + metrô Karasuma Shijō → Kyoto, 15 min' },
  ],
  'd01-almoco': [walk(8, 'às catracas do Shinkansen, lado Hachijō (sul), atravessando a estação pela passagem livre; plataformas 11 a 14')],
  'd01-shinkansen': [
    { mode: 'shinkansen', line: 'Nozomi', board: 'Kyoto, plataformas 11–12', direction: 'Tokyo (東京)', alight: 'Tokyo (final)', minutes: 135, cost: '¥14.200 reservado', note: 'Fuji do lado ESQUERDO nesse sentido: assentos A ou B, uns 40 min antes de chegar' },
    { mode: 'metro', line: 'Marunouchi Line', board: 'Tokyo', direction: 'Ginza · Shinjuku', alight: 'Ginza', minutes: 2, cost: '¥180', note: 'ou táxi ~¥1.200 com as malas de mão' },
    walk(5, 'check-in; as malas do takuhaibin chegam hoje ou amanhã'),
  ],
  'd01-checkin-compras': [
    { mode: 'metro', line: 'Marunouchi Line', board: 'Ginza', direction: 'Ikebukuro (池袋)', alight: 'Tokyo', minutes: 2, cost: '¥180' },
    { mode: 'train', line: 'JR Yamanote', board: 'Tokyo', direction: 'Ueno · Ikebukuro (sentido horário, 外回り)', alight: 'Komagome (駒込), saída sul', minutes: 18, cost: '¥210' },
    walk(7, 'da saída sul, pela avenida à esquerda, até o portão principal (正門) do jardim — é o único que abre à noite'),
  ],
  'd01-rikugien': [
    walk(7, 'de volta à estação Komagome'),
    { mode: 'train', line: 'JR Yamanote', board: 'Komagome', direction: 'Ikebukuro · Shinjuku', alight: 'Ikebukuro (3ª parada)', minutes: 8, cost: '¥170' },
    walk(8, 'saída leste, reto pela avenida Sunshine 60-dōri; o Sunshine City é o complexo no fim. World Import Mart, 3º andar'),
  ],
  'd01-gachapon-ikebukuro': [
    { mode: 'metro', line: 'Marunouchi Line', board: 'Ikebukuro', direction: 'Ginza · Ogikubo', alight: 'Ginza', minutes: 16, cost: '¥210' },
    walk(5, 'até o hotel'),
  ],

  // ── 2 dez · Tóquio, último dia inteiro ─────────────────────────────
  'd02-gaien-peak': [
    walk(4, 'de volta à estação Gaienmae'),
    { mode: 'metro', line: 'Ginza Line', board: 'Gaienmae', direction: 'Asakusa', alight: 'Akasaka-mitsuke', minutes: 4, cost: '¥180' },
    { mode: 'metro', line: 'Marunouchi Line', board: 'Akasaka-mitsuke (mesma plataforma, do outro lado)', direction: 'Ikebukuro', alight: 'Kōrakuen, saída 2', minutes: 16, cost: '¥210 no total' },
    walk(6, 'contornando o Tokyo Dome até o portão leste (東門) do jardim'),
  ],
  'd02-korakuen': [walk(15, 'pelo portão leste, passando a Suidōbashi e descendo a Hakusan-dōri até Jimbōchō; o Bondy fica dentro de um pátio, entrada pela livraria')],
  'd02-jimbocho': [
    { mode: 'metro', line: 'Hanzōmon Line', board: 'Jimbōchō', direction: 'Oshiage', alight: 'Mitsukoshimae, saída B6', minutes: 6, cost: '¥180' },
    walk(2, 'a ponte é logo ao lado do Mitsukoshi'),
  ],
  'd02-nihonbashi': [
    { mode: 'metro', line: 'Ginza Line', board: 'Mitsukoshimae', direction: 'Asakusa', alight: 'Kanda', minutes: 2, cost: '¥180' },
    { mode: 'train', line: 'JR Yamanote ou Keihin-Tōhoku', board: 'Kanda', direction: 'Ueno', alight: 'Akihabara, saída Electric Town', minutes: 2, cost: '¥150', note: 'ou 18 min a pé reto pela Chūō-dōri, que é a mesma rua' },
  ],
  'd02-akihabara-missoes': [
    { mode: 'train', line: 'JR Sōbu (local, amarelo)', board: 'Akihabara, plataforma 6 (a de cima)', direction: 'Chiba', alight: 'Kinshichō', minutes: 5, cost: '¥150' },
    { mode: 'metro', line: 'Hanzōmon Line', board: 'Kinshichō', direction: 'Oshiage', alight: 'Oshiage (Skytree-mae)', minutes: 3, cost: '¥180', note: 'isto é para a Skytree. Tokyo Tower: Hibiya Line até Kamiyachō. Prédio do Governo: Chūō até Shinjuku' },
    walk(3, 'a torre é a saída da estação; bilheteria no 4º andar'),
  ],
  'd02-ultima-vista': [
    { mode: 'metro', line: 'Toei Asakusa Line', board: 'Oshiage', direction: 'Nishi-Magome · Haneda', alight: 'Higashi-Ginza', minutes: 20, cost: '¥280', note: 'da Skytree, direto. Da Tokyo Tower: Hibiya Line de Kamiyachō até Higashi-Ginza, 9 min' },
    walk(1, 'a Iwate Ginga Plaza fica na saída da Higashi-Ginza, no térreo do Nankai Tokyo Building'),
  ],
  'd02-tekki': [walk(6, 'pela Harumi-dōri até a Ginza 4-chōme e uma quadra além; o Bic Camera é o prédio grande de Yūrakuchō')],
  'd02-compras-finais': [walk(8, 'o Sushi no Midori fica na Ginza Corridor, debaixo dos trilhos')],
  'd02-jantar-despedida': [walk(5, 'qualquer 7-Eleven da Ginza; tem um a cada quarteirão')],
  'd02-konbini': [walk(5, 'até o hotel: arrumar as malas hoje, amanhã não vai dar tempo')],

  // ── 3 dez · volta ──────────────────────────────────────────────────
  'd03-ultima-manha': [
    { mode: 'metro', line: 'Hibiya Line', board: 'Tsukiji', direction: 'Kita-Senju', alight: 'Ginza', minutes: 3, cost: '¥180' },
    walk(5, 'de volta ao hotel; check-out até as 11h, as malas ficam na recepção até a hora de sair'),
  ],
  'd03-sair-hotel': [
    walk(6, 'com as malas até a estação Higashi-Ginza (Asakusa Line), ou táxi na porta do hotel (~¥7.000, 30 min)'),
    { mode: 'train', line: 'Toei Asakusa Line → Keikyu (trem direto)', board: 'Higashi-Ginza', direction: 'Haneda Airport (羽田空港)', alight: 'Haneda Airport Terminal 3', minutes: 35, cost: '¥620', note: 'só entrem no trem cujo destino no painel diz 羽田空港 / Haneda Airport; os outros vão para Yokohama' },
    walk(5, 'do trem ao saguão de partidas do T3, 3º andar; JAL é a ilha do meio'),
  ],
  'd03-haneda': [walk(10, 'check-in, despacho das malas, tax-free na alfândega se pedirem, imigração; a Royce\' é depois da imigração')],
  'd03-duty-free': [walk(10, 'até o portão indicado no cartão de embarque; os portões 140+ ficam longe, contem 15 min')],
  'd03-voo': [{ mode: 'plane', line: 'JL7014 · American', board: 'Haneda T3', alight: 'Dallas, depois Guarulhos', minutes: 720, note: 'conexão de 2h15 em Dallas: imigração americana, pegar e redespachar as malas, segurança de novo' }],
};

export const legsFrom = (stopId: string): Leg[] | undefined => LEGS[stopId];
export const legsToFirst = (dayId: string): Leg[] | undefined => START[dayId];

/** minutos somados de um deslocamento */
export const legsMinutes = (legs: Leg[]) => legs.reduce((n, l) => n + l.minutes, 0);
