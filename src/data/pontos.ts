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
  "d25-ivy": [
    { name: "Ivy Square", jp: "倉敷アイビースクエア", query: "倉敷アイビースクエア", note: "A fiação de tijolo de 1889; o pátio é aberto." },
    { name: "Kurashiki Denim Street", jp: "倉敷デニムストリート", query: "倉敷デニムストリート", note: "Jeans de Kojima e o sorvete azul; abre ~10h." },
  ],
  "d25-shinsekai": [
    { name: "Torre Tsūtenkaku", jp: "通天閣", query: "通天閣", note: "O centro do bairro; os letreiros gigantes ficam em volta." },
    { name: "Jan-Jan Yokochō", jp: "ジャンジャン横丁", query: "ジャンジャン横丁", note: "Galeria estreita de kushikatsu, shōgi e lojinhas: posters e placas Shōwa." },
    { name: "Kushikatsu Daruma, a loja original", jp: "串かつだるま 新世界総本店", query: "串かつだるま 新世界総本店", note: "De 1929. Não molhar duas vezes no molho." },
  ],
  "d25-dotonbori": [
    { name: "Ponte Ebisu-bashi e o letreiro da Glico", jp: "戎橋・グリコサイン", query: "戎橋 グリコサイン 道頓堀", note: "Comecem aqui: a foto com a pose do homem correndo, braços para cima." },
    { name: "Okonomiyaki Mizuno", jp: "お好み焼 美津の", query: "美津の 道頓堀", note: "Bib Gourmand, versão de Osaka. Fecha quinta; tem fila." },
    { name: "Hōzenji Yokochō e o Buda de musgo", jp: "法善寺横丁・水掛不動", query: "法善寺 水掛不動", note: "Viela de pedra a um quarteirão do neon; joguem água no Buda." },
    { name: "Takoyaki Wanaka", jp: "たこ焼道楽 わなか 千日前本店", query: "たこ焼道楽 わなか 千日前本店", note: "Bolinho de polvo ao lado do Namba Grand Kagetsu. Esperem esfriar." },
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
  "d28-sannenzaka": [
    { name: "Sannenzaka", jp: "三年坂", query: "三年坂 京都 産寧坂", note: "A ladeira de pedra que desce do Kiyomizu. Devagar: escorrega e, diz a lenda, tropeçar dá azar." },
    { name: "Ninenzaka", jp: "二年坂", query: "二年坂 京都", note: "A continuação, mais curta, com casas de madeira e lanternas ainda acesas cedo." },
    { name: "% Arabica Higashiyama", jp: "% Arabica 京都東山", query: "% Arabica 京都東山", note: "Na Yasaka-dōri, debaixo do pagode. Abre às 09:00." },
    { name: "Pagode de Yasaka", jp: "八坂の塔", query: "法観寺 八坂の塔", note: "O pagode visto da ladeira, o enquadramento clássico de Higashiyama." },
  ],
  "d28-kodaiji": [
    { name: "Nene-no-Michi", jp: "ねねの道", query: "ねねの道 京都", note: "A alameda de pedra na frente do templo. Os 30 minutos antes do portão abrir." },
    { name: "Lago Engetsu-chi", jp: "偃月池", query: "高台寺 偃月池", note: "O jardim atribuído a Kobori Enshū, com as ilhas da tartaruga e do grou." },
    { name: "Kaisan-dō e o lago Garyū-chi", jp: "開山堂 · 臥龍池", query: "高台寺 開山堂", note: "O salão entre os dois lagos, ligado pelo corredor coberto." },
    { name: "Otamaya, o mausoléu de Nene", jp: "霊屋", query: "高台寺 霊屋", note: "No alto do corredor Garyū-rō, com as imagens de Hideyoshi e Nene." },
    { name: "Bosque de bambu", jp: "竹林", query: "高台寺 竹林", note: "Menor e muito mais calmo que o de Arashiyama, no fundo do templo." },
  ],
  "d28-ginkakuji": [
    { name: "Ginshadan e Kōgetsudai", jp: "銀沙灘 · 向月台", query: "銀閣寺 向月台", note: "O mar de areia branca e o cone, refeito na mesma forma há quase cinco séculos." },
    { name: "Tōgu-dō", jp: "東求堂", query: "銀閣寺 東求堂", note: "Onde fica o Dōjinsai, a primeira sala de chá do Japão." },
    { name: "O Pavilhão de Prata", jp: "観音殿（銀閣）", query: "銀閣寺 観音殿", note: "O pavilhão que nunca recebeu a prata." },
  ],
  "d28-almoco": [
    { name: "Omen Ginkaku-ji", jp: "おめん 銀閣寺本店", query: "おめん 銀閣寺本店", note: "Udon com bandeja de legumes, no começo do Caminho do Filósofo." },
    { name: "Okutan Nanzen-ji", jp: "奥丹 南禅寺", query: "奥丹 南禅寺", note: "A outra opção: yudōfu desde 1635, na ponta sul, junto ao Nanzen-ji." },
  ],
  "d28-filosofo": [
    { name: "Início do caminho, ponte do Ginkaku-ji", jp: "銀閣寺橋", query: "哲学の道 銀閣寺橋", note: "A ponta norte do canal, ao pé do Ginkaku-ji." },
    { name: "Fim do caminho, Nyakuōji-bashi", jp: "若王子橋", query: "哲学の道 若王子橋", note: "A ponta sul, 2 km depois, já perto do Eikan-dō e do Nanzen-ji." },
  ],
  "d28-nanzenji": [
    { name: "Portão Sanmon", jp: "三門", query: "南禅寺 三門", note: "Subam: a varanda de cima é a vista \"que vale mil peças de ouro\"." },
    { name: "Jardim do Hōjō", jp: "方丈庭園", query: "南禅寺 方丈庭園", note: "O jardim seco do Hōjō, ingresso à parte." },
    { name: "Aqueduto Suirokaku", jp: "水路閣", query: "南禅寺 水路閣", note: "Tijolo vermelho de 1890 atrás do templo, ainda levando a água do lago Biwa." },
  ],
  "d28-eikando": [
    { name: "Mikaeri Amida, no Amida-dō", jp: "阿弥陀堂 · みかえり阿弥陀", query: "永観堂 阿弥陀堂", note: "O Buda que olha para trás. O rosto só aparece pela direita." },
    { name: "Corredor Garyū-rō", jp: "臥龍廊", query: "永観堂 臥龍廊", note: "O corredor coberto que sobe a encosta como um dragão." },
    { name: "Pagode Tahōtō", jp: "多宝塔", query: "永観堂 多宝塔", note: "No alto do morro, com Kyoto inteira embaixo." },
    { name: "Lago Hōjō-ike", jp: "放生池", query: "永観堂 放生池", note: "O bordo refletido na água, com o pagode lá em cima." },
  ],
  "d28-gion": [
    { name: "Hanamikōji", jp: "花見小路", query: "花見小路通 祇園", note: "Saindo do chá. Nas vielas privadas ao sul, nada de fotos (multa de ¥10.000)." },
    { name: "Izuu", jp: "いづう", query: "いづう 祇園", note: "Saba-sugata-zushi na casa de 1781. Fecha às terças." },
    { name: "Gion Tanto", jp: "祇園 たんと", query: "祇園たんと", note: "Okonomiyaki e izakaya, informal. Fecha às quartas." },
    { name: "Pontochō", jp: "先斗町", query: "先斗町 京都", note: "Do outro lado do rio Kamo: 500 m de viela, várias casas com menu em inglês." },
  ],
  "d29-tenryuji": [
    { name: "Jardim Sōgenchi", jp: "曹源池庭園", query: "天龍寺 曹源池庭園", note: "O jardim de Musō Soseki, intacto há quase 700 anos." },
    { name: "Varanda do Grande Hōjō", jp: "大方丈", query: "天龍寺 大方丈", note: "Daqui se vê a paisagem emprestada: as montanhas de Arashiyama em vermelho." },
    { name: "Shigetsu", jp: "篩月", query: "天龍寺 篩月", note: "O shōjin ryōri dos monges, dentro do templo (11:00–14:00)." },
    { name: "Portão norte, para o bambuzal", jp: "北門", query: "天龍寺 北門", note: "A saída que dá no bambuzal, a caminho do Ōkōchi Sansō." },
  ],
  "d29-okochi-sanso": [
    { name: "Jibutsu-dō", jp: "持仏堂", query: "大河内山荘 持仏堂", note: "O primeiro prédio, onde o ator meditava e lia roteiros entre as filmagens." },
    { name: "Daijō-kaku", jp: "大乗閣", query: "大河内山荘 大乗閣", note: "A casa principal, misturando vários estilos de arquitetura japonesa." },
    { name: "Mirante no alto da trilha", jp: "大河内山荘庭園", query: "大河内山荘庭園", note: "Vista do desfiladeiro do Hozu e da cidade." },
    { name: "Matcha e doce", jp: "お茶席", query: "大河内山荘 お茶席", note: "Incluídos no ingresso, no fim da trilha." },
  ],
  "d29-almoco": [
    { name: "Arashiyama Yoshimura", jp: "嵐山よしむら", query: "嵐山よしむら", note: "Soba com vista da ponte. Peguem senha." },
    { name: "Hatoya, a loja da ponte", jp: "八十八良葉舎 嵐山", query: "八十八良葉舎 嵐山 渡月橋", note: "O latte de matcha em camadas, a 1 min da Togetsukyō." },
  ],
  "d29-ryoanji": [
    { name: "O jardim de pedras", jp: "石庭", query: "龍安寺 石庭", note: "Quinze pedras e sempre uma escondida. Sentem-se na varanda por 15 minutos." },
    { name: "A bacia Tsukubai", jp: "知足の蹲踞", query: "龍安寺 知足の蹲踞", note: "Nos fundos: 吾唯足知, \"eu apenas sei o que basta\"." },
    { name: "Lago Kyōyōchi", jp: "鏡容池", query: "龍安寺 鏡容池", note: "O lago do século XII que quase ninguém visita." },
  ],
  "d29-nishiki": [
    { name: "Entrada oeste do Nishiki", jp: "錦市場", query: "錦市場 高倉通", note: "O começo da galeria: tsukemono, yuba, dashimaki, fu." },
    { name: "Aritsugu", jp: "有次", query: "錦市場 有次", note: "As facas desde 1560, perto da ponta leste." },
    { name: "Galeria Teramachi", jp: "寺町京極商店街", query: "寺町京極商店街", note: "Papelaria, artesanato, quimono de segunda mão." },
    { name: "Galeria Shinkyōgoku", jp: "新京極商店街", query: "新京極商店街", note: "A paralela, de volta para a Shijō." },
  ],
  "d29-jantar": [
    { name: "Onimaru, o onigiri grelhado", jp: "焼むすび 鬼○", query: "Onimaru 焼きむすび 京都 河原町", note: "A entrada: onigiri grelhado no carvão." },
    { name: "Sushiro Kawaramachi Takoyakushi", jp: "スシロー 河原町蛸薬師店", query: "スシロー 河原町蛸薬師店", note: "No subsolo, pedido por tablet." },
    { name: "Ichiran Kyoto Kawaramachi", jp: "一蘭 京都河原町店", query: "一蘭 京都河原町店", note: "A porta ao lado, caso o Sushiro esteja cheio." },
    { name: "Karafuneya Coffee Sanjō", jp: "からふね屋珈琲 三条本店", query: "からふね屋珈琲 三条本店", note: "A sobremesa. Último pedido de parfait às 21:00." },
  ],
  "d30-todaiji": [
    { name: "Portão Nandaimon", jp: "南大門", query: "東大寺 南大門", note: "A entrada, com os dois guardiões." },
    { name: "Daibutsuden", jp: "大仏殿", query: "東大寺 大仏殿", note: "O salão de 1709, ainda uma das maiores construções de madeira do mundo." },
    { name: "O Grande Buda", jp: "盧舎那仏", query: "東大寺 盧舎那仏像", note: "15 metros e 500 toneladas, de 752." },
    { name: "O pilar com buraco", jp: "柱の穴", query: "東大寺 大仏殿 柱の穴", note: "Atrás do Buda: do tamanho da narina dele. Quem passa alcança a iluminação." },
  ],
  "d30-nigatsudo": [
    { name: "A subida pelos fundos", jp: "二月堂裏参道", query: "二月堂 裏参道", note: "A ladeira de pedra atrás do Tōdai-ji, 10 minutos." },
    { name: "Varanda do Nigatsu-dō", jp: "二月堂", query: "東大寺 二月堂", note: "Nara inteira e as montanhas lá de cima. É aqui o Omizutori, desde 752." },
  ],
  "d30-kasuga-taisha": [
    { name: "Caminho das lanternas de pedra", jp: "参道 石燈籠", query: "春日大社 参道 石燈籠", note: "2.000 lanternas cobertas de musgo na floresta." },
    { name: "Portão Nanmon", jp: "南門", query: "春日大社 南門", note: "A entrada principal do recinto." },
    { name: "Lanternas de bronze no corredor", jp: "釣燈籠", query: "春日大社 回廊 釣燈籠", note: "As 1.000 de bronze penduradas nos beirais." },
    { name: "Fujinami-no-ya", jp: "藤浪之屋", query: "春日大社 藤浪之屋", note: "O corredor escuro com as lanternas acesas e espelhos." },
    { name: "O santuário principal", jp: "本殿", query: "春日大社 本殿", note: "Reconstruído idêntico a cada vinte anos, há mais de mil anos." },
  ],
  "d30-isuien": [
    { name: "Jardim da frente", jp: "前園", query: "依水園 前園", note: "A parte mais antiga, do período Edo." },
    { name: "Jardim dos fundos e a vista do Nandaimon", jp: "後園", query: "依水園 後園", note: "O jardim Meiji que usa o portão do Tōdai-ji e o Wakakusa como fundo." },
    { name: "Casa de chá Hyōshin-tei", jp: "氷心亭", query: "依水園 氷心亭", note: "Matcha com vista do jardim." },
  ],
  "d30-almoco": [
    { name: "Azekuraya", jp: "あぜくらや", query: "あぜくらや 東大寺", note: "Dentro do parque, entre o Nigatsu-dō e o Daibutsuden." },
    { name: "Tengyokudō", jp: "吉野本葛 天極堂 奈良本店", query: "天極堂 奈良本店", note: "Kuzu-udon e kuzu-kiri. Fecha às terças." },
    { name: "Nakatanidō", jp: "中谷堂", query: "中谷堂 奈良 三条通", note: "O mochi batido na rua, várias vezes por hora." },
  ],
  "d30-kofukuji": [
    { name: "Pagode de cinco andares", jp: "五重塔", query: "興福寺 五重塔", note: "De 1426, hoje coberto pelos andaimes da restauração." },
    { name: "Salão dos Tesouros e o Ashura", jp: "国宝館 · 阿修羅像", query: "興福寺 国宝館", note: "A estátua de 734 com os três rostos. Vale o ingresso." },
  ],
  "d30-naramachi": [
    { name: "Lago Sarusawa", jp: "猿沢池", query: "猿沢池", note: "A porta de entrada, ao sul do Kōfuku-ji." },
    { name: "Kōshin-dō", jp: "庚申堂", query: "ならまち 庚申堂", note: "Os macaquinhos vermelhos migawari-zaru pendurados aos montes." },
    { name: "Naramachi Kōshi-no-Ie", jp: "ならまち格子の家", query: "ならまち格子の家", note: "Uma machiya estreita e funda aberta por dentro, grátis." },
  ],
  "d01-sanjusangendo": [
    { name: "As 1.001 Kannon", jp: "千体千手観音立像", query: "三十三間堂 千体千手観音立像", note: "Os 120 m de fileiras douradas. Procurem um rosto conhecido." },
    { name: "A Kannon central", jp: "中尊 千手観音坐像", query: "三十三間堂 中尊 千手観音坐像", note: "A grande Kannon sentada no meio do salão." },
    { name: "As 28 divindades guardiãs", jp: "二十八部衆", query: "三十三間堂 二十八部衆", note: "Na frente das Kannon, com o realismo de tirar o fôlego." },
    { name: "A varanda oeste do tōshiya", jp: "通し矢 西縁", query: "三十三間堂 通し矢", note: "Do lado de fora: os 120 m sob o beiral onde se atirava por 24 horas." },
  ],
  "d01-toji": [
    { name: "Kōdō, o mandala em 3D", jp: "講堂", query: "東寺 講堂", note: "Primeiro: as 21 estátuas do Shingon postas de pé." },
    { name: "Kondō", jp: "金堂", query: "東寺 金堂", note: "O salão do Buda da Medicina." },
    { name: "Pagode de cinco andares", jp: "五重塔", query: "東寺 五重塔", note: "55 m, de 1644, a torre de madeira mais alta do Japão. Visto de fora." },
    { name: "Lago Hyōtan-ike", jp: "瓢箪池", query: "東寺 瓢箪池", note: "O lago com os bordos na frente do pagode: a foto." },
  ],
  "d01-almoco": [
    { name: "Isetan, o depachika", jp: "ジェイアール京都伊勢丹 地下", query: "ジェイアール京都伊勢丹", note: "B1/B2: um ekiben para o trem, se preferirem comer a bordo." },
    { name: "Kyoto Ramen Kōji", jp: "京都拉麺小路", query: "京都拉麺小路", note: "10º andar: nove casas de nove regiões." },
    { name: "Sushi no Musashi Hachijō", jp: "寿しのむさし 京都駅八条口店", query: "寿しのむさし 京都駅八条口店", note: "Na Asty Road, a 2 min das catracas do Shinkansen." },
    { name: "Omiyage na Asty Road", jp: "アスティロード", query: "アスティロード 京都駅", note: "O Black Thunder de matcha (e o Okoicha)." },
    { name: "Catracas do Shinkansen", jp: "新幹線中央口", query: "京都駅 新幹線中央口", note: "No lado Hachijō, com as malas de mão já tiradas do armário." },
  ],
  "d01-checkin-compras": [
    { name: "Sotetsu Fresa Inn Ginza 3-chōme", jp: "相鉄フレッサイン 銀座三丁目", query: "相鉄フレッサイン 銀座三丁目", note: "Check-in e conferir as malas do takuhaibin." },
    { name: "Bic Camera Yūrakuchō", jp: "ビックカメラ有楽町店", query: "ビックカメラ 有楽町店", note: "iPhone, RedMagic: as compras grandes, hoje." },
  ],
  "d01-rikugien": [
    { name: "Portão principal", jp: "正門", query: "六義園 正門", note: "Entrada da iluminação. A validação é na tela do celular." },
    { name: "O lago Daisensui", jp: "大泉水", query: "六義園 大泉水", note: "Os bordos iluminados refletidos na água." },
    { name: "Ponte Togetsukyō", jp: "渡月橋", query: "六義園 渡月橋", note: "A ponte de pedra sobre o lago." },
    { name: "Fukiage-chaya", jp: "吹上茶屋", query: "六義園 吹上茶屋", note: "Matcha e doce à beira do lago." },
    { name: "Bambuzal com projeção", jp: "竹林", query: "六義園 竹林", note: "A projeção que estreia nesta iluminação de 2026." },
    { name: "O armazém com projeção", jp: "土蔵", query: "六義園 土蔵", note: "O depósito da época dos Iwasaki, com imagens na parede." },
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
  "d02-gaien": [
    { name: "A entrada pela avenida Aoyama — a foto", jp: "いちょう並木 青山口", query: "神宮外苑いちょう並木 青山通り", note: "De costas para a avenida, olhando para o museu: é aí que o truque de perspectiva funciona" },
    { name: "As barracas do Icho Matsuri", jp: "神宮外苑いちょう祭り", query: "神宮外苑いちょう祭り", note: "Yakisoba, jaga-batā, karaage, amazake quente — confirmem as datas de 2026" },
    { name: "Seitoku Kinen Kaigakan, no fim da rua", jp: "聖徳記念絵画館", query: "聖徳記念絵画館", note: "O museu que a alameda empurra para longe; daqui se vê a ilusão ao contrário" },
  ],
};
