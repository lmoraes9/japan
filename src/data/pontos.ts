import type { PontoDetalhe } from './types';

/**
 * Os pontos de detalhe de cada parada, na ordem em que se anda, para o
 * "Seguir o dia no Google Maps". Saem do próprio texto de cada parada.
 * Paradas com mapa ilustrado não estão aqui: usam os marcadores do mapa.
 */
export const PONTOS: Record<string, PontoDetalhe[]> = {
  "d23-pokemon-center": [
    { name: "Pokémon Center Hiroshima", jp: "ポケモンセンターヒロシマ", query: "ポケモンセンターヒロシマ ekie", note: "ekie 2º andar, saída norte: o Pikachu com momiji manjū e a linha regional" },
    { name: "Terraço do minamoa: Gyarados", jp: "ギャラドスひろば", query: "ギャラドスひろば minamoa 広島駅", note: "a Gyarados gigante no terraço do prédio novo da estação" },
  ],
  "d23-chegada": [
    { name: "APA Hotel: deixar a mochila", jp: "アパホテル広島駅前大橋", query: "アパホテル広島駅前大橋", note: "saída sul, 5 min a pé; a recepção guarda a mochila" },
    { name: "Musubi Musashi no ekie", jp: "むさし 広島駅", query: "むさし ekie 広島駅", note: "o onigiri de Hiroshima desde 1958, resolve em 15 min" },
    { name: "Rua de okonomiyaki do ekie", jp: "ekie DINING", query: "ekie DINING 広島駅", note: "se a fome for maior; o okonomiyaki de verdade fica para o jantar" },
    { name: "Bonde 2 ou 6 (2º andar da estação)", jp: "広島駅電停", query: "広電 広島駅電停", note: "terminal dentro do prédio novo, 2º andar; 16 min até Genbaku-Dōmu-mae" },
  ],
  "d23-okonomiyaki": [
    { name: "Nagataya", jp: "長田屋", query: "お好み焼 長田屋 広島", note: "ao lado do Parque da Paz; peçam com ostra (kaki)" },
    { name: "Okonomimura", jp: "お好み村", query: "お好み村 広島", note: "três andares, 24 bancas: escolham a com mais gente local" },
    { name: "Hassei", jp: "八昌", query: "お好み焼 八昌 広島", note: "a que os moradores citam; tem fila" },
  ],
  "d24-daishoin": [
    { name: "Portão Niōmon", jp: "仁王門", query: "大聖院 仁王門", note: "a entrada, com os dois guardiões" },
    { name: "500 rakan", jp: "五百羅漢", query: "大聖院 五百羅漢", note: "cada um com um rosto diferente, vários de gorro de tricô" },
    { name: "Escadaria dos cilindros de sutra", jp: "マニ車", query: "大聖院 マニ車", note: "girem todos: equivale a ler o cânone budista inteiro" },
    { name: "Caverna das 88 lanternas", jp: "遍照窟", query: "大聖院 遍照窟", note: "a peregrinação de Shikoku inteira debaixo do Daishidō" },
  ],
  "d24-misen": [
    { name: "Teleférico: estação Momijidani", jp: "紅葉谷駅", query: "宮島ロープウエー 紅葉谷駅", note: "subida até 16:00, última descida 16:30" },
    { name: "Estação Shishiiwa (topo do teleférico)", jp: "獅子岩駅", query: "宮島ロープウエー 獅子岩駅", note: "não é o cume: daqui são uns 30 min a pé" },
    { name: "Kiezu-no-hi, o fogo de Kūkai", jp: "霊火堂", query: "弥山 霊火堂", note: "arde desde 806; dele se acendeu a Chama da Paz" },
    { name: "Cume do Misen", jp: "弥山山頂", query: "弥山展望台", note: "535 m: o Mar Interior de Seto inteiro salpicado de ilhas" },
  ],
  "d24-comer-miyajima": [
    { name: "Momiji-dō: age-momiji", jp: "紅葉堂", query: "紅葉堂 本店 宮島", note: "o momiji manjū frito" },
    { name: "Yakigaki no Hayashi: ostras", jp: "焼がきのはやし", query: "焼がきのはやし 宮島", note: "duas na casca, na brasa, com limão; fecha qua" },
    { name: "Anagomeshi Wakana", query: "Anagomeshi Wakana Miyajima", note: "anago-meshi na ilha" },
    { name: "Kimura-ya: momiji manjū", jp: "木村家本店", query: "木村家本店 宮島", note: "um dos dois melhores manjū da ilha" },
    { name: "Yamada-ya: momiji manjū", jp: "やまだ屋 宮島本店", query: "やまだ屋 宮島本店", note: "o outro dos dois melhores" },
    { name: "Ueno, em Miyajimaguchi", jp: "あなごめし うえの", query: "あなごめし うえの 宮島口本店", note: "ao lado da estação, depois da balsa; inventaram o anago-meshi em 1901; fecha qua" },
  ],
  "d24-shukkeien": [
    { name: "Entrada do jardim", jp: "縮景園", query: "縮景園", note: "última entrada 16:30, fecha 17:00" },
    { name: "O lago do Lago Ocidental", jp: "濯纓池", query: "縮景園 濯纓池", note: "a paisagem em miniatura que imita Hangzhou; em novembro, vermelho" },
    { name: "Ponte de pedra Kokō-kyō", jp: "跨虹橋", query: "縮景園 跨虹橋", note: "a ponte em arco que corta o lago ao meio" },
    { name: "Ginkgo sobrevivente da bomba", jp: "被爆イチョウ", query: "縮景園 被爆イチョウ", note: "hibakujumoku, marcada com placa" },
    { name: "Memorial às vítimas", jp: "原爆被災者慰霊碑", query: "縮景園 原爆被災者慰霊碑", note: "o jardim foi abrigo de feridos; muitos morreram ali" },
  ],
  "d24-jantar": [
    { name: "Fossos do Castelo de Hiroshima", jp: "広島城", query: "広島城", note: "torreão fechado desde mar/2026; parque e fossos valem a caminhada" },
    { name: "Bakudan-ya", jp: "ばくだん屋 本店", query: "ばくだん屋 本店 広島", note: "tsukemen de Hiroshima: picante de 0 a 20, 2 já arde" },
  ],
  "d25-dotonbori": [
    { name: "Ponte Ebisu-bashi e o letreiro da Glico", jp: "戎橋・グリコサイン", query: "戎橋 グリコサイン 道頓堀", note: "Comecem aqui: a foto com a pose do homem correndo, braços para cima." },
    { name: "Kushikatsu Daruma", jp: "串かつだるま 道頓堀店", query: "串かつだるま 道頓堀店", note: "Espetinho empanado. Não molhar duas vezes no molho." },
    { name: "Okonomiyaki Mizuno", jp: "お好み焼 美津の", query: "美津の 道頓堀", note: "Bib Gourmand, versão de Osaka. Fecha quinta; tem fila." },
    { name: "Hōzenji Yokochō e o Buda de musgo", jp: "法善寺横丁・水掛不動", query: "法善寺 水掛不動", note: "Viela de pedra a um quarteirão do neon; joguem água no Buda." },
    { name: "Takoyaki Wanaka", jp: "たこ焼道楽 わなか 千日前本店", query: "たこ焼道楽 わなか 千日前本店", note: "Bolinho de polvo ao lado do Namba Grand Kagetsu. Esperem esfriar." },
  ],
  "d26-okunoin": [
    { name: "Ponte Ichinohashi", jp: "一の橋", query: "奥之院 一の橋", note: "A entrada certa: reverência antes de atravessar." },
    { name: "Uesugi Kenshin", jp: "上杉謙信霊屋", query: "奥之院 上杉謙信霊屋", note: "O mausoléu do rival de Takeda, logo ao lado dele." },
    { name: "Takeda Shingen", jp: "武田信玄・勝頼墓所", query: "奥之院 武田信玄 勝頼 墓所", note: "Os dois inimigos de uma vida, vizinhos aqui." },
    { name: "Date Masamune", jp: "伊達政宗墓所", query: "奥之院 伊達政宗 墓所" },
    { name: "Toyotomi Hideyoshi e família", jp: "豊臣家墓所", query: "奥之院 豊臣家墓所", note: "Os Toyotomi que os Tokugawa exterminaram." },
    { name: "Oda Nobunaga", jp: "織田信長墓所", query: "奥之院 織田信長墓所", note: "Um túmulo surpreendentemente pequeno." },
    { name: "Ponte Gobyō-bashi", jp: "御廟橋", query: "奥之院 御廟橋", note: "Daqui em diante: sem fotos, sem comer, sem beber." },
    { name: "Tōrō-dō e o mausoléu de Kūkai", jp: "燈籠堂・弘法大師御廟", query: "奥之院 燈籠堂", note: "Dez mil lanternas; fecha às 17:00. Kūkai em meditação atrás." },
    { name: "Túmulos de empresa, na volta", jp: "企業墓", query: "奥之院 新明和工業 ロケット", note: "Pelo caminho do Nakanohashi: o foguete, a xícara da UCC, os cupins." },
  ],
  "d26-okunoin-noite": [
    { name: "Recepção Taira — retirar o passe", jp: "大楽", query: "高野山 大楽 オーサムツアーズ", note: "Até as 19:00, ao lado do Ekō-in. Sem o passe não entra." },
    { name: "Ponte Ichinohashi — saída do tour", jp: "一の橋", query: "奥之院 一の橋", note: "Ponto de encontro do guia, em frente ao mapa." },
    { name: "Ponte Gobyō-bashi e o Tōrō-dō", jp: "御廟橋・燈籠堂", query: "奥之院 御廟橋", note: "O fim do caminho iluminado só pelas lanternas de pedra." },
  ],
  "d27-garan": [
    { name: "Konpon Daitō", jp: "根本大塔", query: "壇上伽藍 根本大塔", note: "A torre vermelha de 48 m; por dentro, o mandala em 3D (¥500)." },
    { name: "Pinheiro Sanko-no-matsu", jp: "三鈷の松", query: "壇上伽藍 三鈷の松", note: "Procurem as agulhas em trios." },
    { name: "Miedō", jp: "御影堂", query: "壇上伽藍 御影堂", note: "Guarda o retrato de Kūkai; abre uma vez por ano." },
  ],
  "d27-kongobuji": [
    { name: "Salão principal", jp: "金剛峯寺 主殿", query: "金剛峯寺 主殿", note: "A sede do Shingon, painéis dourados." },
    { name: "Yanagi-no-ma", jp: "柳の間", query: "金剛峯寺 柳の間", note: "A sala do seppuku de Hidetsugu, em 1595." },
    { name: "Jardim Banryūtei", jp: "蟠龍庭", query: "金剛峯寺 蟠龍庭", note: "140 granitos: dois dragões num mar de areia." },
    { name: "Chá no Shin-betsuden", jp: "新別殿", query: "金剛峯寺 新別殿", note: "Fim do corredor: chá e biscoito inclusos, sentados no tatame." },
  ],
  "d22-omotesando": [
    { name: "Takeshita-dōri, antes do meio-dia", jp: "竹下通り", query: "竹下通り 原宿", note: "Passem cedo: no domingo depois das 12:00 fica insuportável" },
    { name: "UNIQLO Harajuku e o UTme!", jp: "ユニクロ 原宿店", query: "ユニクロ 原宿店 WITH HARAJUKU", note: "Estampem a própria arte numa camiseta em 30 min" },
    { name: "Kiddy Land", jp: "キデイランド原宿店", query: "キデイランド原宿店", note: "5 andares de personagem japonês" },
    { name: "Oriental Bazaar", jp: "オリエンタルバザー", query: "オリエンタルバザー 表参道", note: "Souvenir de qualidade: cerâmica, yukata, gravura (fecha qui)" },
    { name: "Dior de SANAA", jp: "ディオール表参道", query: "ディオール表参道", note: "Olhem para cima: a fachada branca de SANAA" },
    { name: "Tod's de Toyo Ito", jp: "TOD'S表参道ビル", query: "TOD'S 表参道ビル", note: "A fachada de concreto em galhos de árvore" },
    { name: "Prada de Herzog & de Meuron", jp: "プラダ 青山店", query: "プラダ 青山店", note: "O prédio de vidro em losangos, fim do corredor de arquitetura" },
  ],
  "d22-gaien": [
    { name: "A entrada pela avenida Aoyama — a foto", jp: "いちょう並木 青山口", query: "神宮外苑いちょう並木 青山通り", note: "De costas para a avenida, olhando para o museu: é aí que o truque de perspectiva funciona" },
    { name: "As barracas do Icho Matsuri", jp: "神宮外苑いちょう祭り", query: "神宮外苑いちょう祭り", note: "Yakisoba, jaga-batā, karaage, amazake quente — confirmem as datas de 2026" },
    { name: "Seitoku Kinen Kaigakan, no fim da rua", jp: "聖徳記念絵画館", query: "聖徳記念絵画館", note: "O museu que a alameda empurra para longe; daqui se vê a ilusão ao contrário" },
  ],
  "d22-cruzamento": [
    { name: "A estátua de Hachikō", jp: "忠犬ハチ公像", query: "忠犬ハチ公像 渋谷駅", note: "A atual é de 1948, do filho do escultor original" },
    { name: "O cruzamento", jp: "渋谷スクランブル交差点", query: "渋谷スクランブル交差点", note: "Atravessem com os letreiros já acesos" },
  ],
  "d02-kanda-myojin": [
    { name: "O amuleto de segurança da informação", jp: "授与所 · IT情報安全守護", query: "神田明神 授与所", note: "¥1.000: cartão e dois adesivos para o computador" },
    { name: "O mural de ema com desenhos de anime", jp: "絵馬掛所", query: "神田明神 絵馬掛所", note: "As tabuinhas de pedido cobertas de anime" },
  ],
  "d02-yushima-seido": [
    { name: "O portal Nyūtoku-mon", jp: "入徳門", query: "湯島聖堂 入徳門", note: "De 1704, escapou do terremoto de 1923" },
    { name: "O portão Kyōdan-mon e o pátio", jp: "杏壇門", query: "湯島聖堂 杏壇門", note: "O maior portão do templo, laca preta" },
    { name: "Os telhados pretos do Taisei-den", jp: "大成殿", query: "湯島聖堂 大成殿", note: "Salão fechado na quarta — o pátio e os telhados estão abertos" },
    { name: "A ponte Hijiribashi", jp: "聖橋", query: "聖橋 御茶ノ水", note: "A ponte que liga os dois templos" },
    { name: "A cúpula da Nikolai-dō", jp: "ニコライ堂", query: "ニコライ堂", note: "Só por fora hoje (visitas 13:00–15:30); a olhada é da ponte" },
  ],
  "d02-nihonbashi": [
    { name: "Nishikawa, roupa de cama desde 1566", jp: "日本橋 西川", query: "日本橋西川 コレド日本橋", note: "Futon e roupa de cama de alto padrão (COREDO Nihonbashi, subsolo)" },
    { name: "A ponte Nihonbashi", jp: "日本橋", query: "日本橋 (橋) 中央区", note: "Ponte de pedra de 1911, debaixo da via expressa que vão enterrar" },
    { name: "O marco zero do Japão", jp: "日本国道路元標", query: "日本国道路元標", note: "A placa de bronze no meio da ponte; a réplica fica no canto noroeste" },
    { name: "Mitsukoshi Nihonbashi e o depachika", jp: "日本橋三越本店", query: "日本橋三越本店", note: "A loja de departamentos mais antiga do Japão; desçam ao subsolo" },
  ],
  "d02-akihabara-missoes": [
    { name: "Yodobashi-Akiba", jp: "ヨドバシAkiba", query: "ヨドバシAkiba", note: "Robô aspirador e o que faltou de eletrônico, balcão tax-free" },
    { name: "Janpara, a 2ª loja", jp: "じゃんぱら 秋葉原2号店", query: "じゃんぱら 秋葉原2号店", note: "Dock station Dell usada — confiram modelo e fonte" },
    { name: "Mandarake Complex", jp: "まんだらけコンプレックス", query: "まんだらけコンプレックス 秋葉原", note: "Direto ao andar de figures" },
  ],
  "d02-compras-finais": [
    { name: "Ginza Kumamotokan — a Maboroshi no Miso", jp: "銀座熊本館", query: "銀座熊本館", note: "Procurem o missô do Yamauchi Honten (liguem antes, 03-3572-1147)" },
    { name: "Bic Camera Yūrakuchō — o Oura Ring", jp: "ビックカメラ 有楽町店", query: "ビックカメラ 有楽町店", note: "Oura Ring tax-free e o que escapou em Akihabara" },
  ],
};
