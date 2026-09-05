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
    { mode: 'metro', line: 'Marunouchi Line', board: 'Shinjuku (saída oeste, sub-solo)', direction: 'Ikebukuro', alight: 'Akasaka-mitsuke', minutes: 10 },
    { mode: 'metro', line: 'Ginza Line', board: 'Akasaka-mitsuke (mesma plataforma, do outro lado)', direction: 'Asakusa', alight: 'Asakusa (final)', minutes: 17, cost: '¥260 no total' },
    walk(3, 'saída 1 e o Kaminarimon está na frente'),
  ],
  'd2026-11-20': [walk(5, 'até a Estação Shinjuku, entrada sul; plataformas 1 e 2 da JR (Shōnan-Shinjuku Line)')],
  'd2026-11-21': [
    { mode: 'metro', line: 'Toei Ōedo Line', board: 'Shinjuku (Ōedo, ou Tochōmae se o hotel for a oeste)', direction: 'Roppongi · Daimon', alight: 'Tsukijishijō, saída A1', minutes: 20, cost: '¥280' },
    walk(3, 'o mercado externo começa na saída'),
  ],
  'd2026-11-22': [
    { mode: 'train', line: 'JR Yamanote', board: 'Shinjuku', direction: 'Shibuya · Shinagawa (sentido anti-horário)', alight: 'Harajuku, saída oeste (Meiji-jingū)', minutes: 4, cost: '¥150' },
    walk(2, 'o grande torii fica na saída'),
  ],
  'd2026-11-23': [
    { mode: 'train', line: 'JR Chūō (rápido)', board: 'Shinjuku, plataformas 7 e 8', direction: 'Tokyo', alight: 'Tokyo (final)', minutes: 15, cost: '¥210', note: 'só a mochila: as malas grandes já foram de takuhaibin' },
  ],
  'd2026-11-24': [
    { mode: 'tram', line: 'bonde 1, 2 ou 6', board: 'Kamiyachō / Hatchōbori (a parada mais perto do hotel)', direction: 'Hiroshima Station (広島駅)', alight: 'Hiroshima Station, terminal do bonde', minutes: 15, cost: '¥240' },
  ],
  'd2026-11-25': [
    { mode: 'tram', line: 'bonde 1, 2 ou 6', board: 'Kamiyachō / Hatchōbori', direction: 'Hiroshima Station (広島駅)', alight: 'Hiroshima Station', minutes: 15, cost: '¥240', note: 'com a mochila; check-out feito' },
  ],
  'd2026-11-26': [
    { mode: 'metro', line: 'Midōsuji Line (vermelha)', board: 'Namba', direction: 'Shin-Osaka · Senri-Chūō', alight: 'Honmachi', minutes: 4 },
    { mode: 'metro', line: 'Chūō Line (verde)', board: 'Honmachi', direction: 'Nagata · Gakken-Nara-Tomigaoka', alight: 'Tanimachi 4-chōme, saída 1-B', minutes: 4, cost: '¥240 no total' },
    walk(12, 'reto até o portão Ōtemon, sobre o fosso'),
  ],
  'd2026-11-27': [
    { mode: 'train', line: 'Nankai Main Line (trem local, 普通)', board: 'Nankai Namba, 3º andar', direction: 'Wakayama-shi · Kansai Airport', alight: 'Sumiyoshitaisha', minutes: 10, cost: '¥210', note: 'os expressos não param; peguem o local ou o semi-expresso. Malas: deixem na recepção do hotel depois do check-out' },
    walk(3, 'saída leste, atravessa a rua do bonde e o torii está ali'),
  ],
  'd2026-11-28': [
    { mode: 'taxi', board: 'na porta do hotel', alight: 'Kiyomizu-dera (清水寺)', minutes: 12, cost: '~¥1.500', note: 'às 5h45 é o jeito certo; ônibus 206 (parada D2 da estação) só começa perto das 6h' },
  ],
  'd2026-11-29': [walk(3, 'até a Estação de Kyoto; o 7-Eleven fica na entrada')],
  'd2026-11-30': [walk(6, 'até a Estação Kintetsu Kyoto, no lado oeste da Estação de Kyoto (térreo, ao lado do Shinkansen)')],
  'd2026-12-01': [
    { mode: 'train', line: 'JR Nara Line (local, 普通)', board: 'Estação de Kyoto, plataformas 8 a 10', direction: 'Nara', alight: 'Tōfukuji (1ª parada)', minutes: 2, cost: '¥150', note: 'check-out antes; as malas ficam na recepção do hotel, que despacha o takuhaibin para Ginza' },
    walk(10, 'saindo, siga o fluxo para o sul até a ponte Gaun-kyō'),
  ],
  'd2026-12-02': [
    { mode: 'metro', line: 'Marunouchi Line', board: 'Ginza', direction: 'Ikebukuro', alight: 'Tokyo', minutes: 2, cost: '¥180' },
    walk(10, 'saída Marunouchi, atravessa a praça e o fosso até o portão Ōte-mon'),
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
    walk(5, 'saída oeste; o Omoide Yokochō fica colado à estação, e o hotel logo ali'),
  ],
  'd18-ramen': [walk(3)],
  'd18-konbini': [walk(3, 'de volta ao hotel')],

  // ── 19 nov · Asakusa, Ueno, Akihabara ─────────────────────────────
  'd19-sensoji': [walk(15, 'para o sul pela Edo-dōri, ou pela beira do rio Sumida')],
  'd19-kuramae': [walk(20, 'pela Asakusa-dōri para o oeste; a rua das panelas começa no cozinheiro gigante do prédio Niimi')],
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
    walk(5, 'até o hotel'),
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
    walk(5, 'até o hotel'),
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
    { mode: 'train', line: 'JR Chūō (rápido)', board: 'Tokyo, plataformas 1 e 2 (as de cima)', direction: 'Shinjuku · Takao', alight: 'Shinjuku', minutes: 14, cost: '¥210' },
    walk(5, 'até o hotel'),
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
    walk(5, 'o Scramble Square é o prédio da própria estação; a bilheteria do Sky fica no 14º andar, elevador dedicado'),
  ],
  'd22-shibuya-sky': [walk(3, 'desce ao térreo, saída Hachikō, e o cruzamento está na frente')],
  'd22-cruzamento': [walk(5, 'o Mark City é o prédio colado à saída oeste da estação (o sushi fica no 4º)')],
  'd22-jantar': [
    { mode: 'train', line: 'JR Yamanote', board: 'Shibuya', direction: 'Shinjuku · Ikebukuro', alight: 'Shinjuku', minutes: 7, cost: '¥170' },
    walk(5, 'até o hotel'),
  ],

  // ── 23 nov · Shinkansen e Hiroshima ────────────────────────────────
  'd23-konbini': [walk(5, 'catracas do Tōkaidō Shinkansen no lado Yaesu; plataformas 14 a 19. Ekiben na loja antes de passar')],
  'd23-trem-hiroshima': [
    { mode: 'shinkansen', line: 'Nozomi', board: 'Tokyo, plataforma indicada no bilhete (14–19)', direction: 'Hakata (博多)', alight: 'Hiroshima', minutes: 235, cost: '¥19.800 reservado', note: 'número do carro está no bilhete; a fila é na marca do chão. Fuji do lado direito, uns 40 min depois de sair' },
    walk(3, 'saída norte da estação; o ekie é o shopping dentro da própria estação, 2º andar'),
  ],
  'd23-pokemon-center': [
    walk(3, 'saída sul; o terminal do bonde fica na praça em frente'),
    { mode: 'tram', line: 'bonde 1, 2 ou 6', board: 'Hiroshima Station, terminal do bonde', direction: 'Hiroshima-kō (1) · Miyajimaguchi (2) · Eba (6)', alight: 'Kamiyachō-higashi ou Hatchōbori (a mais perto do hotel)', minutes: 15, cost: '¥240, paga ao descer' },
    walk(5, 'até o hotel; check-in, almoço na Hondōri'),
  ],
  'd23-chegada': [walk(10, 'pela Hondōri (a galeria coberta) até o fim, e o parque começa do outro lado do rio; ou bonde 2/6 até Genbaku-Dōmu-mae')],
  'd23-museu-paz': [walk(5, 'pelo eixo do parque: cenotáfio, chama, e a ponte até o Domo')],
  'd23-parque-domo': [walk(3, 'o Nagataya fica na rua ao lado do Domo')],
  'd23-okonomiyaki': [walk(10, 'de volta pela Hondōri até o hotel')],

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
  'd24-jantar': [walk(5, 'até o hotel')],

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

  // ── 26 nov · Osaka ─────────────────────────────────────────────────
  'd26-castelo-osaka': [
    walk(12, 'saída pelo portão Aoyamon ou de volta ao Ōtemon, até a estação Tanimachi 4-chōme'),
    { mode: 'metro', line: 'Chūō Line (verde)', board: 'Tanimachi 4-chōme', direction: 'Cosmosquare', alight: 'Sakaisuji-Hommachi', minutes: 3 },
    { mode: 'metro', line: 'Sakaisuji Line (marrom)', board: 'Sakaisuji-Hommachi', direction: 'Tengachaya', alight: 'Nippombashi, saída 10', minutes: 5, cost: '¥240 no total' },
    walk(2, 'a galeria do Kuromon começa na saída'),
  ],
  'd26-kuromon': [
    walk(3, 'até a estação Nippombashi'),
    { mode: 'metro', line: 'Sakaisuji Line (marrom)', board: 'Nippombashi', direction: 'Tenjimbashisuji 6-chōme', alight: 'Tenjimbashisuji 6-chōme (final), saída 8', minutes: 10, cost: '¥240' },
    walk(4, 'o Harukoma fica na galeria coberta, a mais longa do Japão; a fila é a pista'),
  ],
  'd26-sushi': [
    walk(4, 'de volta à estação Tenjimbashisuji 6-chōme'),
    { mode: 'metro', line: 'Tanimachi Line (roxa)', board: 'Tenjimbashisuji 6-chōme', direction: 'Yaominami', alight: 'Shitennōji-mae Yūhigaoka, saída 4', minutes: 15, cost: '¥290' },
    walk(5, 'para o leste até o portão oeste do templo'),
  ],
  'd26-shitennoji': [walk(12, 'para o sudoeste; a torre Tsūtenkaku aparece e é só ir na direção dela')],
  'd26-shinsekai': [
    walk(5, 'até a estação Dōbutsuen-mae'),
    { mode: 'metro', line: 'Midōsuji Line (vermelha)', board: 'Dōbutsuen-mae', direction: 'Shin-Osaka · Senri-Chūō', alight: 'Umeda', minutes: 15, cost: '¥290' },
    walk(10, 'saída norte; o Umeda Sky Building fica do outro lado dos trilhos, pela passagem subterrânea'),
  ],
  'd26-umeda': [walk(12, 'para o oeste, seguindo a avenida até Fukushima; o Jinsei JET fica perto da estação JR Fukushima')],
  'd26-jantar': [
    { mode: 'train', line: 'Hanshin Namba Line', board: 'Fukushima (Hanshin, não a JR)', direction: 'Ōsaka-Namba · Nara', alight: 'Ōsaka-Namba', minutes: 8, cost: '¥240' },
    walk(5, 'até o hotel'),
  ],

  // ── 27 nov · Sumiyoshi, Kyoto, Fushimi Inari ───────────────────────
  'd27-sumiyoshi': [
    walk(8, 'de volta à estação Sumiyoshitaisha'),
    { mode: 'train', line: 'Nankai Main Line', board: 'Sumiyoshitaisha', direction: 'Namba', alight: 'Nankai Namba', minutes: 10, cost: '¥210' },
    walk(5, 'pegar as malas no hotel'),
    { mode: 'metro', line: 'Midōsuji Line (vermelha)', board: 'Namba', direction: 'Shin-Osaka · Senri-Chūō', alight: 'Umeda', minutes: 8, cost: '¥240' },
    walk(5, 'siga a placa JR (JR大阪駅); o Special Rapid sai das plataformas 8 e 9'),
  ],
  'd27-trem-kyoto': [
    { mode: 'train', line: 'JR Special Rapid (新快速)', board: 'Osaka, plataformas 8–9', direction: 'Kyoto · Yasu · Nagahama', alight: 'Kyoto', minutes: 29, cost: '¥580' },
    walk(8, 'até o hotel: deixar as malas (check-in às 15h, mas guardam antes) e conferir se as malas do takuhaibin chegaram'),
  ],
  'd27-almoco': [
    walk(5, 'até a Estação de Kyoto, plataformas 8 a 10 (JR Nara Line)'),
    { mode: 'train', line: 'JR Nara Line (local, 普通)', board: 'Kyoto, plataformas 8–10', direction: 'Nara', alight: 'Inari (2ª parada)', minutes: 5, cost: '¥150', note: 'só o LOCAL para em Inari; o rápido Miyakoji passa direto' },
    walk(2, 'a estação fica na frente do torii'),
  ],
  'd27-fushimi-inari': [
    walk(5, 'até a estação Fushimi-Inari da Keihan (não a JR), na rua das barracas'),
    { mode: 'train', line: 'Keihan Main Line', board: 'Fushimi-Inari', direction: 'Yodoyabashi · Osaka', alight: 'Fushimi-Momoyama', minutes: 8, cost: '¥220' },
    walk(8, 'as cervejarias de saquê ficam pela galeria Ōtesuji e o canal'),
  ],
  'd27-jantar': [
    walk(5, 'até a estação Momoyama-Goryō-mae da Kintetsu'),
    { mode: 'train', line: 'Kintetsu Kyoto Line', board: 'Momoyama-Goryō-mae', direction: 'Kyoto', alight: 'Kyoto (final)', minutes: 10, cost: '¥300' },
    walk(8, 'até o hotel'),
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
    { mode: 'bus', line: 'ônibus 5', board: 'Nanzenji-Eikandō-michi', direction: 'Kyoto Station (京都駅)', alight: 'Shijō-Kawaramachi', minutes: 20, cost: '¥230' },
    walk(10, 'atravessa o rio pela ponte Shijō: Pontochō é a viela à esquerda antes do rio, Gion é do outro lado'),
  ],
  'd28-gion': [
    { mode: 'bus', line: 'ônibus 206 ou 100', board: 'parada Gion (祇園), lado sul da Shijō', direction: 'Kyoto Station (京都駅)', alight: 'Kyoto Station', minutes: 20, cost: '¥230', note: 'táxi ~¥1.500; depois das 21h é mais fácil' },
    walk(5, 'até o hotel'),
  ],

  // ── 29 nov · Arashiyama, Kinkaku-ji ────────────────────────────────
  'd29-konbini': [
    { mode: 'train', line: 'JR Sagano (San-in) Line', board: 'Kyoto, plataformas 32–33 (ponta oeste da estação)', direction: 'Kameoka · Sonobe', alight: 'Saga-Arashiyama', minutes: 15, cost: '¥240' },
    walk(12, 'saída sul, reto até a rua principal, e o bambuzal começa atrás do Tenryū-ji (portão norte)'),
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
  'd29-nishiki': [
    walk(5, 'até a estação Shijō (Karasuma Line), no fim da galeria'),
    { mode: 'metro', line: 'Karasuma Line', board: 'Shijō', direction: 'Takeda', alight: 'Kyoto', minutes: 4, cost: '¥220' },
    walk(5, 'até o hotel'),
  ],

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
    walk(6, 'até o hotel'),
  ],

  // ── 1 dez · Tōfuku-ji e o Shinkansen ───────────────────────────────
  'd01-tofukuji': [walk(20, 'para o norte pela Higashiōji-dōri; o Sanjūsangen-dō fica atrás do Museu Nacional. Táxi ~¥1.000 se estiverem cansados')],
  'd01-sanjusangendo': [
    walk(3, 'até a parada Hakubutsukan-Sanjūsangendō-mae'),
    { mode: 'bus', line: 'ônibus 206 ou 208', board: 'Hakubutsukan-Sanjūsangendō-mae', direction: 'Kyoto Station (京都駅)', alight: 'Kyoto Station', minutes: 8, cost: '¥230', note: 'ou 20 min a pé pela Shichijō-dōri' },
    walk(5, 'a estação tem restaurantes no 10º (Ramen Kōji) e no Porta, no sub-solo'),
  ],
  'd01-almoco': [walk(10, 'pegar as malas de mão no hotel e voltar às catracas do Shinkansen, lado Hachijō (sul); plataformas 11 a 14')],
  'd01-shinkansen': [
    { mode: 'shinkansen', line: 'Nozomi', board: 'Kyoto, plataformas 11–12', direction: 'Tokyo (東京)', alight: 'Tokyo (final)', minutes: 135, cost: '¥14.200 reservado', note: 'Fuji do lado ESQUERDO nesse sentido: assentos A ou B, uns 40 min antes de chegar' },
    { mode: 'metro', line: 'Marunouchi Line', board: 'Tokyo', direction: 'Ginza · Shinjuku', alight: 'Ginza', minutes: 2, cost: '¥180', note: 'ou táxi ~¥1.200 com as malas de mão' },
    walk(5, 'check-in; as malas do takuhaibin chegam hoje ou amanhã'),
  ],
  'd01-checkin-compras': [
    { mode: 'metro', line: 'Marunouchi Line', board: 'Ginza', direction: 'Ikebukuro (池袋)', alight: 'Ikebukuro (final), saída 35', minutes: 16, cost: '¥210' },
    walk(8, 'saída leste, reto pela avenida Sunshine 60-dōri; o Sunshine City é o complexo no fim. World Import Mart, 3º andar'),
  ],
  'd01-gachapon-ikebukuro': [
    { mode: 'metro', line: 'Marunouchi Line', board: 'Ikebukuro', direction: 'Ginza · Ogikubo', alight: 'Ginza', minutes: 16, cost: '¥210' },
    walk(5, 'até o hotel'),
  ],

  // ── 2 dez · Tóquio, último dia inteiro ─────────────────────────────
  'd02-jardim-imperial': [walk(15, 'saída pelo portão Hirakawamon (noroeste) e reto pela avenida até Jimbōchō; o Bondy fica dentro de um pátio, entrada pela livraria')],
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
    { mode: 'metro', line: 'Hanzōmon + Ginza (troca em Mitsukoshimae) ou Asakusa Line', board: 'Oshiage', direction: 'Shibuya', alight: 'Ginza', minutes: 25, cost: '¥260', note: 'da Skytree; da Tokyo Tower é a Hibiya Line direto até Ginza (8 min)' },
    walk(5, 'Bic Camera fica em Yūrakuchō, uma quadra da Ginza'),
  ],
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
