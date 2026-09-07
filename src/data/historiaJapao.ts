/**
 * O Japão em onze capítulos, na versão longa: cada um com seções, para ler
 * no trem antes do lugar. O que interessa aqui é o que explica o roteiro.
 */
export interface Section {
  title: string;
  paragraphs: string[];
}

export interface LongChapter {
  id: string;
  years: string;
  title: string;
  jp: string;
  lead: string;
  sections: Section[];
  noRoteiro: { label: string; href: string }[];
}

export const JAPAN_CHAPTERS: LongChapter[] = [
  // ───────────────────────────────────────────────────────────────────
  {
    id: 'origens',
    years: 'até 710',
    title: 'Antes de haver Japão',
    jp: '縄文 · 弥生 · 古墳',
    lead: 'Um arquipélago isolado, o arroz que chegou tarde, os deuses que estavam nas coisas, e um clã que virou a dinastia mais antiga do mundo.',
    sections: [
      {
        title: 'A ilha que se fechou',
        paragraphs: [
          'O arquipélago japonês foi povoado há uns 35.000 anos, quando o nível do mar era 100 metros mais baixo e havia pontes de terra ligando as ilhas ao continente pela Coreia e por Sacalina. Quando o gelo derreteu e o mar subiu, por volta de 12.000 a.C., as pontes sumiram e o Japão virou o que é: quatro ilhas grandes e 6.000 pequenas, a 200 km da Coreia e 800 da China, longe o bastante para ficar sozinho e perto o bastante para receber tudo que o continente inventasse, sempre com atraso e sempre à sua maneira. Essa distância explica boa parte da história: nunca foi conquistado até 1945, adotou a escrita chinesa 700 anos depois de ela existir, e recebeu o budismo, a pólvora e o capitalismo como pacotes prontos, para desmontar e remontar.',
          'O território também explica muita coisa. Três quartos do país são montanha, e a população sempre se espremeu nas planícies costeiras e nos vales: a planície de Kantō (Tóquio), a de Kansai (Osaka, Kyoto, Nara), a costa do Mar Interior (Hiroshima, Himeji, Kurashiki). São essas três regiões que o roteiro percorre, e a ligação entre elas, a estrada Tōkaidō, é o corredor por onde passou tudo, hoje ocupado pelo Shinkansen. Os vulcões (o Fuji é um), os terremotos (a placa do Pacífico mergulha debaixo do país a 8 cm por ano) e os tufões de verão fizeram um povo que constrói de madeira, reconstrói sem drama e não espera que nada dure.',
        ],
      },
      {
        title: 'Jōmon: cerâmica antes da agricultura',
        paragraphs: [
          'A cultura que ocupou as ilhas de 14.000 a 300 a.C. se chama Jōmon, "marca de corda", pela decoração da cerâmica: cordas prensadas no barro fresco, em espirais e relevos que chegam a ser barrocos. É a cerâmica mais antiga do mundo, milhares de anos antes da do Oriente Médio, e isso é estranho porque a cerâmica costuma vir com a agricultura, e os Jōmon não plantavam. Eram caçadores, pescadores e coletores de castanha e bolota, sedentários, em aldeias de casas semienterradas em volta de uma praça, com lixeiras de conchas que chegam a ter centenas de metros. O mar e as florestas de carvalho e castanheira davam comida o suficiente para ficar parado, coisa que só o noroeste do Pacífico americano conseguiu de forma parecida.',
          'As figuras de barro dessa gente, as *dogū*, com olhos de óculos de neve e corpos inchados, estão no Museu Nacional de Tóquio, e são o começo de uma sensibilidade que se reconhece depois: o gosto pelo material bruto, pela assimetria, pelo objeto de uso feito com mais cuidado do que precisaria. Uma parte do que hoje é o Japão, na língua, no DNA e possivelmente na religião, vem dos Jōmon; os ainu de Hokkaidō são os descendentes mais diretos.',
        ],
      },
      {
        title: 'Yayoi: o arroz muda tudo',
        paragraphs: [
          'Por volta de 300 a.C. (talvez antes) chegou da Coreia, por Kyūshū, um pacote novo: o arroz irrigado, o bronze, o ferro, o tear, e gente. Era o período Yayoi, nome de um bairro de Tóquio onde a cerâmica lisa dessa época foi encontrada em 1884. O arroz de várzea exige diques, canais e calendário, e portanto organização, chefes, estoque, e alguém para defender o estoque: em duzentos anos as aldeias ganharam fossos e paliçadas, apareceram os primeiros túmulos de chefes, e as armas de bronze viraram objetos de ritual, enormes e inúteis, enterradas às centenas em colinas. A população saltou de algumas centenas de milhares para uns dois milhões.',
          'Os chineses da dinastia Han conheciam esses povos e os chamavam de *Wa*, "os anões", com o desprezo habitual: uma crônica de 297 d.C. descreve "o país de Wa" como cem pequenos reinos, gente que se tatuava, mergulhava atrás de peixe, bebia, era honesta e batia palmas para rezar (ainda batem). E fala de uma rainha, **Himiko**, xamã, solteira, servida por mil mulheres, que governava por magia um reino chamado Yamatai e mandou embaixadores à China em 239 com escravos e tecido, recebendo em troca um selo de ouro e cem espelhos de bronze. Onde ficava Yamatai é a maior briga da arqueologia japonesa: Kyūshū ou a planície de Nara. O sítio de Makimuku, perto de Nara, com um palácio do século III, é o candidato atual.',
        ],
      },
      {
        title: 'Kofun: os túmulos em forma de fechadura',
        paragraphs: [
          'De 250 a 600, os chefes se enterraram em montes de terra colossais, os *kofun*, muitos em forma de fechadura (um círculo com um trapézio), cercados de fossos e cobertos de estatuetas de barro, os *haniwa*: guerreiros, cavalos, casas, dançarinos, postos em fila na encosta como um cortejo. O maior, atribuído ao imperador Nintoku, perto de Osaka, tem 486 m de comprimento e ocupa mais área que a Grande Pirâmide; é Patrimônio Mundial e ninguém pode escavar, porque a Agência da Casa Imperial o considera túmulo de um ancestral do imperador atual. Há 160.000 kofun no país. O cavalo, o estribo e a armadura de ferro chegaram nessa época, com cavaleiros da Coreia, e há uma teoria de que a própria dinastia veio a cavalo.',
          'Os túmulos maiores se concentram na planície de Nara e em Osaka, e é ali que um clã, o de **Yamato**, submeteu os outros ao longo do século V e seus chefes passaram a se chamar *ōkimi*, "grandes reis". Esses reis mandavam embaixadas à China pedindo títulos, guerreavam na Coreia, importavam escribas, ceramistas e tecelões coreanos aos milhares (uma parte importante da aristocracia japonesa antiga era de imigrantes) e casavam entre si. A tradição diz que o primeiro deles, Jinmu, descendente da deusa do Sol, subiu ao trono em 660 a.C.; o número foi escolhido no século VIII para bater com um ciclo astrológico chinês. Os historiadores põem a dinastia começando no século IV, com um rei chamado Ōjin ou o filho dele. De qualquer maneira, é a mesma família que ocupa o trono hoje, 126 imperadores depois: **a dinastia mais antiga do mundo em atividade**, por larga margem.',
        ],
      },
      {
        title: 'Os kami: a religião sem nome',
        paragraphs: [
          'A religião dessa gente não tinha nome, nem fundador, nem livro, nem doutrina. Tinha *kami*: presenças, forças, "aquilo que é superior", em tudo que impressiona: uma montanha, uma cachoeira, uma árvore muito velha, uma rocha estranha, a raposa, o trovão, o ancestral do clã, a deusa do Sol de quem o rei descende. Os kami não são bons nem maus; são poderosos, e ficam ofendidos com a impureza (sangue, morte, sujeira) e satisfeitos com a limpeza, o respeito, a oferenda e a festa. Daí os rituais que vocês vão ver: lavar as mãos antes de entrar, bater palmas para chamar, a corda de palha (*shimenawa*) marcando o que é sagrado, o saquê e o arroz oferecidos, o festival com o andor carregando o deus pelo bairro.',
          'Os primeiros santuários não eram prédios: eram a própria montanha (o Miwa, perto de Nara, ainda é assim) ou uma clareira cercada. Os prédios vieram depois, copiando os celeiros de arroz elevados: madeira crua, telhado de palha ou casca, sem pintura, refeitos a cada vinte anos para continuarem novos. É o estilo que vocês vão ver em Sumiyoshi, em Osaka, e no Meiji Jingū, que o imitou de propósito. Quando o budismo chegou, no século VI, foi preciso dar um nome ao que já existia para distingui-lo: **Shintō**, "o caminho dos kami", uma palavra chinesa. Mas a divisão nunca foi real: por 1.300 anos as duas religiões conviveram nos mesmos recintos, e os kami foram entendidos como manifestações locais dos budas. Só em 1868 o governo as separou à força, e é por isso que hoje templo e santuário parecem coisas diferentes.',
          'Um detalhe que importa para o roteiro: **Inari**, o kami do arroz e da prosperidade, é o mais popular do Japão, com 30.000 santuários; a raposa é a mensageira. **Hachiman**, o deus da guerra, é o segundo; Kamakura é dele. Os kami do mar (Sumiyoshi, Itsukushima) protegiam quem atravessava para a Coreia e a China. E a deusa do Sol, **Amaterasu**, ancestral do imperador, mora em Ise, que não está no roteiro, e é o único santuário onde o imperador reza em pessoa.',
        ],
      },
    ],
    noRoteiro: [
      { label: 'Sumiyoshi Taisha, o estilo de antes do budismo', href: '/lugar/sumiyoshi' },
      { label: 'Kasuga Taisha e os cervos, em Nara', href: '/lugar/nara' },
      { label: 'As dogū e os haniwa, no Museu Nacional de Tóquio', href: '/roteiro/d2026-11-19#d19-museu-nacional' },
      { label: 'Itsukushima, o santuário dos deuses do mar', href: '/lugar/miyajima' },
    ],
  },
  // ───────────────────────────────────────────────────────────────────
  {
    id: 'nara',
    years: '538–794',
    title: 'O budismo chega e Nara vira capital',
    jp: '飛鳥 · 奈良時代',
    lead: 'O Japão copia a China de propósito, inventa o Estado, funde o maior Buda do mundo e foge dos monges que criou.',
    sections: [
      {
        title: 'Uma estátua e uma carta',
        paragraphs: [
          'Em 538, ou 552 (as crônicas discordam), o rei de Baekje, um dos três reinos da Coreia, mandou ao rei de Yamato um presente: uma estátua de Buda em bronze dourado, alguns sutras e uma carta dizendo que aquela era a doutrina mais excelente que existia, difícil de entender, mas que trazia toda a felicidade que se pudesse desejar. Era uma jogada diplomática: Baekje queria ajuda militar contra os vizinhos. Na corte de Yamato a estátua dividiu os clãs. Os **Soga**, uma família de administradores com sangue coreano, quiseram adotá-la; os **Mononobe** e os **Nakatomi**, que cuidavam dos rituais dos kami, disseram que os deuses nacionais se ofenderiam. Houve uma epidemia; a estátua foi jogada num canal e o templo queimado; a epidemia continuou; a estátua foi repescada. Em 587 os Soga venceram os Mononobe na guerra e o budismo virou religião oficial.',
          'O que veio junto era mais do que uma religião. O budismo chegava embrulhado na civilização chinesa inteira: a escrita (o Japão não tinha), o calendário, a arquitetura de pilares e telhados curvos, a escultura, a pintura, a medicina, a astronomia, a ideia de um imperador que governa por mandato do céu com uma burocracia de funcionários letrados, e leis escritas. Durante os 250 anos seguintes o Japão fez o que a Coreia fizera antes e o Vietnã fazia ao mesmo tempo: importou a China de propósito, embaixada após embaixada, com centenas de estudantes e monges que passavam vinte anos em Chang\'an e voltavam com bibliotecas.',
        ],
      },
      {
        title: 'Shōtoku, o príncipe-santo',
        paragraphs: [
          'A figura que a tradição põe no centro disso é o **príncipe Shōtoku** (574–622), regente da tia, a imperatriz Suiko. A ele se atribui a "Constituição de Dezessete Artigos" de 604, que não é uma constituição mas um sermão: "a harmonia é o que se deve prezar", "reverenciem os três tesouros do budismo", "os ministros obedeçam às ordens imperiais", "decidam as coisas importantes em conselho". Atribui-se a ele também o primeiro sistema de patentes de corte, a primeira embaixada direta à China (com uma carta que começava "do imperador do país onde o sol nasce ao imperador do país onde o sol se põe", que enfureceu o imperador Sui), e a fundação dos primeiros grandes templos: o Hōryū-ji, perto de Nara, que tem os prédios de madeira mais antigos do mundo (c. 700), e o **Shitennō-ji**, em Osaka, de 593, o templo mais antigo do país, que vocês visitam no dia 26. Boa parte disso é lenda construída depois; o príncipe virou santo, e aparecia nas notas de 10.000 ienes até 1984.',
          'Os Soga governaram meio século e foram derrubados em 645 num golpe no palácio (o chefe deles foi morto diante da imperatriz, numa audiência), por um príncipe e por Nakatomi no Kamatari, que como recompensa recebeu o nome de família **Fujiwara**. Guardem o nome: os Fujiwara vão mandar no Japão por 500 anos. O golpe inaugurou a Reforma Taika, que copiou o modelo chinês por inteiro: toda a terra pertence ao imperador e é distribuída aos camponeses por censo, que pagam imposto em arroz, tecido e trabalho; as províncias são governadas por funcionários nomeados; a capital é uma cidade planejada.',
        ],
      },
      {
        title: 'Heijō-kyō, a capital em grade',
        paragraphs: [
          'Em 710 a corte se mudou para uma capital nova, **Heijō-kyō**, a atual Nara, e o período leva o nome dela. Era uma cópia de Chang\'an em escala reduzida: um retângulo de 4,3 por 4,8 km, com uma avenida central de 74 m de largura indo do portão sul ao palácio, ruas em grade, mercados a leste e oeste, e os templos nos cantos. Tinha 100.000 habitantes, quando não havia outra cidade no país. Os prédios do palácio foram reconstruídos em concreto e madeira nos últimos anos, num terreno vazio a oeste da cidade atual, e o que sobrou de verdade são os templos da borda leste, que hoje são o Parque de Nara: o Kōfuku-ji, o Tōdai-ji, o Kasuga.',
          'Foi o auge da imitação: a corte se vestia à chinesa, comia à chinesa, tocava música chinesa (o *gagaku*, que ainda se toca no palácio, é a música dos Tang preservada como num freezer), escrevia em chinês e media a cultura pelo que chegava nos navios. O Shōsō-in, o depósito de tesouros do Tōdai-ji, guarda até hoje, intactos, os objetos do imperador Shōmu: vidro da Pérsia, instrumentos da Índia, tecidos de Samarcanda, espelhos da China, tudo chegado pela Rota da Seda até o fim dela, que era aqui. As crônicas oficiais (Kojiki, 712, e Nihon Shoki, 720) foram escritas nessa época para dar à dinastia uma genealogia divina e um passado tão antigo quanto o da China; a coletânea de poemas *Man\'yōshū*, com 4.500 poemas de imperadores e de soldados de fronteira, é o primeiro grande livro em japonês, escrito com caracteres chineses usados pelo som.',
        ],
      },
      {
        title: 'O Grande Buda e o preço dele',
        paragraphs: [
          'O reinado de Shōmu (724–749) foi uma sequência de desastres. Uma epidemia de varíola em 735–737 matou entre um quarto e um terço da população, incluindo os quatro irmãos Fujiwara que governavam; houve terremotos, fome, uma revolta armada em Kyūshū. Shōmu, budista devoto, respondeu com fé em escala industrial: mandou construir um templo e um pagode de sete andares em cada província, e em 743 ordenou uma estátua de **Vairocana**, o Buda cósmico de quem todos os budas emanam, tão grande quanto a fé do Estado: 15 metros sentado, 500 toneladas de bronze, coberto de ouro. O edito dizia que ele próprio, o imperador, era um servo dos três tesouros, e que quem quisesse ajudar com "um galho ou um punhado de terra" seria bem-vindo.',
          'A fundição levou três anos e oito tentativas, usou quase todo o cobre disponível no país e 440 kg de ouro, que tinha acabado de ser descoberto no norte e foi recebido como milagre. Um monge itinerante, Gyōki, que a corte antes perseguia por pregar ao povo, foi convocado para arrecadar dinheiro e mão de obra: 2,6 milhões de pessoas contribuíram, diz a crônica, quase metade da população. A inauguração, em 752, teve 10.000 monges, dançarinos de toda a Ásia e um monge indiano, Bodhisena, pintando os olhos da estátua com um pincel de cabo tão longo que a corte inteira pôde segurá-lo. O pincel está no Shōsō-in. O projeto arruinou as finanças do Estado por uma geração.',
          'O Daibutsuden, o salão que abriga a estátua, era o maior prédio de madeira do mundo, com 86 m de largura; queimou em 1180 e em 1567, e o atual, de 1709, tem 57 m e continua entre os maiores. O Buda que vocês vão ver é uma colagem de séculos, com as pernas do VIII e a cabeça de 1692; mas é a mesma estátua, no mesmo lugar, e o pilar com o buraco do tamanho da narina dele é o que as crianças de excursão mais gostam.',
        ],
      },
      {
        title: 'Os monges tomam o poder, e a corte foge',
        paragraphs: [
          'O problema de Nara foi o sucesso do budismo. Os grandes templos receberam terras isentas de imposto, camponeses, e o direito de manter tropas; os abades opinavam na sucessão; o Estado pagava por rituais e cópias de sutras. Em 764 a imperatriz Kōken, filha de Shōmu, que tinha abdicado e voltado ao trono como Shōtoku, ficou fascinada pelo monge **Dōkyō**, que a curara de uma doença, e o fez ministro, depois "rei do Dharma", com um cortejo igual ao dela. Em 769 um oráculo do santuário de Hachiman em Kyūshū declarou que Dōkyō devia ser imperador. A corte mandou um enviado conferir; o oráculo, reconsultado, disse o contrário. A imperatriz morreu no ano seguinte e Dōkyō foi exilado. O susto ficou: um monge quase virou imperador, e a dinastia quase acabou. Nenhuma mulher voltou a reinar por 860 anos.',
          'O imperador **Kanmu**, que subiu em 781, decidiu que a única solução era mudar de cidade e deixar os templos para trás. Tentou primeiro Nagaoka, em 784; a construção foi cercada de mortes e maus presságios, e em 794 ele mudou de novo, para um vale a 40 km ao norte, num lugar chamado Uda, que rebatizou Heian-kyō. Proibiu os templos de Nara de se mudarem junto. Nara nunca mais foi capital, e o Kōfuku-ji e o Tōdai-ji, ricos e armados, governaram a província de fato por séculos, com monges-soldados que desciam a Kyoto para intimidar a corte carregando o andor sagrado de Kasuga, que ninguém ousava atacar. Mas a cidade parou de crescer, e é por isso que sobrou: ninguém a destruiu para reconstruir. Quando vocês forem, no dia 30, vão ver o Japão de 750 com cervos.',
        ],
      },
    ],
    noRoteiro: [
      { label: 'Tōdai-ji e o Grande Buda', href: '/mais/historia/d30-todaiji' },
      { label: 'Kasuga Taisha, o santuário dos Fujiwara', href: '/mais/historia/d30-kasuga-taisha' },
      { label: 'Shitennō-ji, em Osaka, o templo mais antigo do país', href: '/roteiro/d2026-11-26#d26-shitennoji' },
      { label: 'Kōfuku-ji e o pagode de Nara', href: '/roteiro/d2026-11-30#d30-kofukuji' },
      { label: 'O mapa de Nara em 3D', href: '/3d/nara' },
    ],
  },
  // ───────────────────────────────────────────────────────────────────
  {
    id: 'heian',
    years: '794–1185',
    title: 'Heian: quatro séculos de corte em Kyoto',
    jp: '平安時代',
    lead: 'A capital da paz, onde se inventou o japonês escrito, o primeiro romance do mundo e o gosto pela impermanência, enquanto os guerreiros das províncias esperavam a vez.',
    sections: [
      {
        title: 'A capital da paz e tranquilidade',
        paragraphs: [
          '**Heian-kyō** foi desenhada como Nara, mas maior: um retângulo de 4,5 por 5,2 km, com o palácio ao norte, a avenida Suzaku de 85 m de largura descendo até o portão Rashōmon (o do filme de Kurosawa, que na era Heian já estava em ruínas e servia de depósito de cadáveres), e uma grade de avenidas numeradas de norte a sul: Ichijō, a primeira; Shijō, a quarta, hoje a rua das lojas; Gojō, a quinta, onde fica a ladeira para Kiyomizu; Shichijō, a sétima, onde está a Estação de Kyoto. O sistema de endereços ainda usa isso: um lugar fica "acima" (*agaru*, para o norte, na direção do palácio) ou "abaixo" (*sagaru*) de um cruzamento. A metade oeste da cidade planejada era pantanosa e foi abandonada em cem anos; a cidade cresceu para o leste, atravessou o rio Kamo e subiu os morros de Higashiyama, onde os aristocratas construíram villas que viraram templos, que é a Kyoto que vocês vão ver.',
          'O palácio ocupava o norte da cidade, e a corte, alguns milhares de aristocratas de uns vinte clãs, vivia num mundo fechado de etiqueta, cerimônia e poesia. As roupas das mulheres tinham doze camadas de seda em combinações de cor que mudavam com a estação e com o gosto; os homens passavam o dia em rituais, e a noite em poemas; um erro de caligrafia ou uma combinação de cores fora de época podia acabar com uma reputação. Fora do palácio, a cidade tinha 100.000 habitantes, ruas de terra, e incêndios e epidemias regulares.',
        ],
      },
      {
        title: 'As mulheres inventam o japonês escrito',
        paragraphs: [
          'Os homens da corte escreviam em chinês clássico, a língua da administração, da religião e do prestígio. As mulheres eram desencorajadas de aprender chinês, e escreviam em japonês, com um silabário simplificado a partir de caracteres chinesos escritos em cursiva: o *hiragana*, que ficou conhecido como "a mão das mulheres". O resultado é que a melhor literatura da época, e uma das melhores de qualquer época, foi escrita por mulheres em japonês, enquanto os homens produziam poesia chinesa que ninguém lê.',
          '**Murasaki Shikibu**, dama de companhia de uma imperatriz, escreveu por volta de 1008 o *Genji Monogatari*, "A História de Genji": 54 capítulos, 400 personagens, três gerações, sobre um príncipe bonito demais e suas mulheres, e sobre o tempo passando por todos eles. É considerado o primeiro romance do mundo, no sentido moderno: personagens que mudam, psicologia, uma voz que observa. **Sei Shōnagon**, dama de uma imperatriz rival, escreveu o *Makura no Sōshi*, "O Livro do Travesseiro": listas de coisas elegantes, coisas irritantes, coisas que fazem o coração bater mais rápido, retratos maldosos de cortesãos, e anotações do tipo "no inverno, a madrugada; é bonito quando neva, mas também quando a geada está branca". Lê-se hoje como um blog de mil anos atrás. As duas se detestavam; Murasaki escreveu no diário que Sei era presunçosa e escrevia caracteres chineses errados.',
        ],
      },
      {
        title: 'Mono no aware: a estética que vocês vão encontrar',
        paragraphs: [
          'A corte de Heian deixou uma sensibilidade que ainda organiza o Japão, e que o roteiro explora sem dizer. **Mono no aware** é "a comoção diante das coisas": a beleza está no que passa, e é bonito porque passa. A cerejeira é a flor nacional porque cai em uma semana; o bordo vermelho de novembro, porque em dezembro está no chão; a lua de outono, porque a de outubro é a mais clara; a neblina, porque some. O calendário da corte era todo de festivais de estação, e o poema certo para cada um. O *Genji* é inteiramente feito disso: ninguém ganha nada, todos envelhecem, e o livro é sobre como isso é belo.',
          'Daí vem o hábito japonês de viajar para ver uma estação (os hanami de abril, os koyō de novembro que vocês vão ver), o gosto pela assimetria e pelo inacabado, e o budismo da época, que dizia que o mundo estava entrando na era da decadência (*mappō*, a partir de 1052) e que só restava confiar em Amida e ser levado para a Terra Pura. O Byōdō-in, em Uji, e as mil estátuas de Kannon do **Sanjūsangen-dō**, que vocês veem no dia 1º, são a arte dessa fé: um paraíso reproduzido em ouro para quem já não esperava nada do mundo.',
        ],
      },
      {
        title: 'Os Fujiwara mandam, os guerreiros esperam',
        paragraphs: [
          'Politicamente, o imperador virou uma figura cerimonial cedo. O clã **Fujiwara** aperfeiçoou uma técnica: casar as filhas com o imperador, criar o neto no palácio do avô, fazer o neto imperador ainda criança e governar como regente, e depois, quando ele crescesse, como "chanceler". Fujiwara no Michinaga (966–1027), o auge do sistema, foi avô de três imperadores, sogro de quatro, e escreveu um poema dizendo que o mundo era dele como a lua cheia sem falha. Os imperadores reagiram no século XI abdicando cedo e governando como "imperadores aposentados", de um mosteiro, com a própria corte; por um século houve dois governos. Os Fujiwara fundaram o Kōfuku-ji e o Kasuga de Nara, e o Byōdō-in; o nome deles está em todos os cantos que vocês vão visitar.',
          'Enquanto a corte compunha, o sistema de terras estatais desabava: os aristocratas e os templos acumulavam propriedades isentas de imposto, os *shōen*, e para protegê-las contratavam homens armados das províncias. Esses homens, cavaleiros com arco e espada, organizados em clãs com um chefe hereditário, eram os **samurais**, "os que servem". Dois clãs de sangue imperial (ramos excluídos da sucessão e mandados para as províncias) cresceram acima dos outros: os **Taira**, no oeste e no Mar Interior, ricos do comércio com a China, e os **Minamoto**, no leste, na planície de Kantō. A corte os usava para resolver suas brigas, e em 1156 e 1160 os usou uma vez demais: duas disputas de sucessão foram decididas a espada, dentro de Kyoto, e quem venceu foi Taira no Kiyomori.',
        ],
      },
      {
        title: 'Kiyomori e a Guerra Genpei',
        paragraphs: [
          '**Taira no Kiyomori** foi o primeiro samurai a governar o Japão. Virou chanceler, casou a filha com o imperador, fez o neto imperador, e governou a corte com métodos de corte, o que foi o erro dele: os Taira se afeminaram, dizia-se, e os Minamoto, exilados e ressentidos no leste, esperaram. Kiyomori construiu o santuário de **Itsukushima**, em Miyajima, como está, com os corredores sobre o mar, e doou os sutras que são a joia da arte de Heian; vocês vão ver isso no dia 24. Em 1180 um príncipe descontente convocou os Minamoto às armas, e o chefe deles, **Minamoto no Yoritomo**, que vivia exilado perto de Kamakura desde os treze anos, levantou o leste. Kiyomori mandou queimar Nara, onde os monges tinham apoiado a revolta; o Tōdai-ji e o Kōfuku-ji queimaram com a cidade. Morreu no ano seguinte, de febre, pedindo que a cabeça de Yoritomo fosse posta sobre seu túmulo.',
          'A **Guerra Genpei** (1180–1185) é a Ilíada do Japão, contada no *Heike Monogatari*, o épico que os monges cegos cantavam com alaúde por séculos. Termina em Dan-no-ura, uma batalha naval no estreito de Shimonoseki, em 1185: os Taira derrotados, a avó do imperador-criança de seis anos pulando no mar com o menino nos braços e a espada sagrada da dinastia, que nunca foi recuperada. A abertura do épico é a frase mais conhecida da literatura japonesa: "O som do sino do Gion ecoa a impermanência de todas as coisas; a cor das flores da árvore de sala mostra que os prósperos hão de cair. Os orgulhosos não duram, como um sonho de uma noite de primavera." Yoritomo não quis morar em Kyoto.',
        ],
      },
    ],
    noRoteiro: [
      { label: 'Fushimi Inari, fundado em 711', href: '/mais/historia/d27-fushimi-inari' },
      { label: 'Kiyomizu-dera, de 778', href: '/mais/historia/d28-kiyomizu' },
      { label: 'Sanjūsangen-dō, as mil estátuas de 1164', href: '/roteiro/d2026-12-01#d01-sanjusangendo' },
      { label: 'Itsukushima, o santuário de Kiyomori', href: '/mais/historia/d24-itsukushima' },
      { label: 'Arashiyama, as villas de fim de semana da corte', href: '/mais/historia/d29-bambu' },
    ],
  },
  // ───────────────────────────────────────────────────────────────────
  {
    id: 'kamakura',
    years: '1185–1333',
    title: 'Kamakura: os samurais tomam o poder',
    jp: '鎌倉時代',
    lead: 'O primeiro xogunato, o zen, o Grande Buda, o budismo do povo, e os mongóis que o vento afundou.',
    sections: [
      {
        title: 'O governo da tenda',
        paragraphs: [
          'Yoritomo fez algo que ninguém tinha feito: venceu, e não foi a Kyoto tomar o lugar do imperador. Ficou em **Kamakura**, uma vila de pescadores a 400 km da corte, protegida por morros em três lados e pelo mar no quarto, acessível por sete passagens cortadas na rocha. Ali montou um governo de guerreiros, o *bakufu* ("governo da tenda", o quartel-general de campanha), com um tribunal, um escritório de administração e um de assuntos militares, e nomeou em cada província um governador militar e em cada propriedade um administrador, todos seus vassalos. Em 1192 o imperador lhe deu o título de *sei-i tai-shōgun*, "grande general que subjuga os bárbaros", criado séculos antes para os comandantes das campanhas contra os emishi do norte. Daí vem a palavra **xogum**.',
          'O arranjo era de dois governos: o imperador reina em Kyoto, com a corte, os títulos e a religião; o xogum governa de onde estiver o exército, com a terra, os impostos e a polícia. Durou, com interrupções, até 1868, quase 700 anos, e é a razão de o Japão ter um imperador que nunca é responsável por nada. Yoritomo foi um governante frio: matou o irmão Yoshitsune, o general que ganhara a guerra e virara o herói popular do Japão (o Robin Hood, o Aquiles, o que morreu jovem e cercado), e a maioria dos parentes que pudessem competir. Morreu em 1199, de uma queda de cavalo, e os filhos não duraram: a viúva, **Hōjō Masako**, "a xogum monja", e o clã dela governaram como regentes dos xoguns pelo século seguinte. Os Hōjō, descendentes dos Taira derrotados, mandaram no Japão em nome de um xogum que mandava em nome de um imperador.',
        ],
      },
      {
        title: 'O zen, a religião dos guerreiros',
        paragraphs: [
          'O budismo de Kyoto era o das cerimônias, dos sutras, das doações e dos mosteiros ricos. Os guerreiros de Kamakura adotaram outra coisa, trazida da China Song pelos monges Eisai (que voltou em 1191 trazendo também o chá) e Dōgen (1227): o **zen**, *chan* em chinês, *dhyāna* em sânscrito, "meditação". Nada de estudo, nada de ritual: sentar em silêncio (*zazen*), esvaziar a mente, aceitar o que é, e a iluminação vem, ou não, de repente. Combinava com gente que tinha de estar pronta para morrer de manhã. Os regentes Hōjō trouxeram mestres da China, que fugiam da conquista mongol, e construíram para eles mosteiros nos vales de Kamakura, copiando os da China: o **Kenchō-ji** (1253), que vocês visitam, foi o primeiro mosteiro zen do Japão fundado como tal, com um abade chinês, Lanxi Daolong, e um plano em linha reta de portão, salão de Buda, salão de prédica e residência do abade, que ainda está lá. O **Engaku-ji** (1282) foi fundado depois da segunda invasão mongol, para rezar pelos mortos dos dois lados, o que era uma ideia nova.',
          'Do zen de Kamakura saiu, em dois séculos, a estética que o mundo chama de japonesa: a pintura a nanquim, o jardim seco, a cerimônia do chá, a arquitetura de madeira nua, o gosto pelo vazio. Mas em Kamakura o zen ainda era coisa de guerreiro e de chinês, austero, quase estrangeiro. Os templos que vocês vão ver no dia 20 guardam isso nas encostas: cedros, escadas de pedra, cavernas de meditação nas rochas e salões em fila num vale estreito.',
        ],
      },
      {
        title: 'O budismo do povo e o Grande Buda',
        paragraphs: [
          'Ao mesmo tempo, o budismo saiu da corte e chegou ao povo, por outro caminho. Monges como Hōnen e Shinran pregaram que ninguém conseguia se salvar por esforço próprio na era da decadência, e que bastava confiar em Amida e repetir o nome dele (*namu Amida butsu*) para renascer na Terra Pura; Nichiren pregou que bastava o Sutra do Lótus, e que o Japão era o país escolhido. Eram religiões de camponeses, pescadores e mulheres, que os mosteiros antigos perseguiram, e que hoje são a maioria do budismo japonês. O **Grande Buda de Kamakura**, fundido por volta de 1252, é um Amida, e foi pago com doações de porta em porta recolhidas por um monge chamado Jōkō e uma dama chamada Inada, sem um tostão do governo: é o monumento dessa fé popular. Ficava dentro de um salão; o salão foi destruído por tempestades e pelo tsunami de 1498, e a estátua ficou ao ar livre, como está, o que a fez mais bonita e mais amada.',
          'A escultura de Kamakura foi a mais realista da história japonesa: os Niō do Nandaimon de Nara, de 8 m, esculpidos em 1203 por Unkei e Kaikei em 69 dias, com músculos, veias e olhos de cristal, são o exemplo, e vocês passam por baixo deles no dia 30. É uma arte de guerreiros: corpos, força, expressão, nada de graça cortesã.',
        ],
      },
      {
        title: 'O vento divino',
        paragraphs: [
          'Em 1268 chegaram cartas de **Kublai Khan**, neto de Gengis, imperador da China e da Coreia, exigindo submissão. Kamakura não respondeu. Em novembro de 1274 uma frota de 900 navios com 30.000 homens (mongóis, chineses e coreanos) desembarcou na baía de Hakata, em Kyūshū, com catapultas, flechas envenenadas e bombas de pólvora, que os samurais nunca tinham visto. Os japoneses, que lutavam anunciando o nome e a linhagem antes de cada duelo, foram massacrados no primeiro dia. À noite, uma tempestade destruiu boa parte da frota e o resto voltou. Kamakura construiu um muro de 20 km ao longo da baía. Em 1281 Kublai mandou 4.400 navios e 140.000 homens, a maior invasão anfíbia da história até 1944; o muro os manteve nos navios por dois meses, e em agosto um tufão afundou a frota. Dezenas de milhares se afogaram; os que chegaram à praia foram mortos.',
          'Os japoneses chamaram os tufões de **kamikaze**, "vento dos deuses", e concluíram que o país era protegido pelos kami: os santuários, que tinham rezado, reivindicaram a vitória. A ideia durou 660 anos, até dar nome aos pilotos suicidas de 1944–45, e ainda está por trás de certa confiança nacional. Mas a vitória arruinou o bakufu: não havia terras conquistadas para dar de recompensa aos vassalos, que ficaram endividados e revoltados, e a defesa custou vinte anos de mobilização. Em 1333 o imperador Go-Daigo tentou retomar o poder de verdade; um general dos Hōjō, **Ashikaga Takauji**, mudou de lado e tomou Kyoto, e outro, Nitta Yoshisada, entrou em Kamakura pela praia (conta-se que jogou a espada no mar e a maré recuou). Os Hōjō, 870 pessoas, se mataram num templo. Kamakura voltou a ser uma vila. Três anos depois, Takauji traiu o imperador também, pôs outro no trono e se fez xogum, em Kyoto. Começava Muromachi.',
        ],
      },
    ],
    noRoteiro: [
      { label: 'Kamakura, o dia inteiro, em 3D', href: '/3d/kamakura' },
      { label: 'Kenchō-ji, o primeiro mosteiro zen', href: '/roteiro/d2026-11-20#d20-kenchoji' },
      { label: 'O Grande Buda', href: '/mais/historia/d20-daibutsu' },
      { label: 'Hachimangū, o santuário de Yoritomo', href: '/mais/historia/d20-hachimangu' },
      { label: 'Os Niō de Nara, a escultura de Kamakura', href: '/mais/historia/d30-todaiji' },
    ],
  },
  // ───────────────────────────────────────────────────────────────────
  {
    id: 'muromachi',
    years: '1336–1573',
    title: 'Muromachi: o ouro, a prata e a guerra de todos contra todos',
    jp: '室町時代',
    lead: 'Os Ashikaga inventaram a cultura japonesa que vocês conhecem, perderam o país num século de guerra civil, e nesse caos chegaram os portugueses com o arcabuz.',
    sections: [
      {
        title: 'Dois imperadores e um xogum esteta',
        paragraphs: [
          'Ashikaga Takauji virou xogum em 1338, mas o imperador que ele traíra, Go-Daigo, fugiu para as montanhas de Yoshino, ao sul de Nara, e por 56 anos o Japão teve duas cortes, a do norte em Kyoto e a do sul, cada uma com um imperador, insígnias e exército. Os Ashikaga governaram de Kyoto, de um palácio no bairro de Muromachi (daí o nome do período), e ao contrário dos Hōjō gostaram da corte: os xoguns se tornaram patronos de arte, colecionadores de pintura chinesa e construtores de villas. Nunca tiveram o controle do país que Kamakura tivera; os governadores provinciais, os *shugo*, viraram senhores hereditários e o xogum era o primeiro entre iguais.',
          'O terceiro xogum, **Ashikaga Yoshimitsu** (1358–1408), foi o auge. Reunificou as duas cortes em 1392 (com a promessa, não cumprida, de alternância), aceitou do imperador da China o título de "Rei do Japão" para poder comerciar (o que os nacionalistas nunca perdoaram), e construiu em 1397 o **Kinkaku-ji**, o Pavilhão Dourado, como villa de aposentadoria, com um andar de palácio de Heian, um de casa de samurai e um de templo zen, os dois de cima cobertos de ouro: a declaração de que ele reunia as três culturas do país. Patrocinou Zeami, o ator que criou o teatro **Nō** a partir de danças populares e o transformou na arte mais lenta e mais refinada do mundo, com máscaras, coro e fantasmas. Morreu em 1408 e a villa virou templo.',
        ],
      },
      {
        title: 'Higashiyama: a cultura japonesa é inventada em meio à guerra',
        paragraphs: [
          'O oitavo xogum, **Yoshimasa** (1436–1490), era o oposto do bisavô: um governante inútil e um esteta genial. Não conseguia controlar os senhores, nem a mulher, nem a sucessão; em 1467 a disputa entre o irmão e o filho dele virou a **Guerra Ōnin**, onze anos de combate dentro de Kyoto entre exércitos de 100.000 homens que destruíram a cidade quase inteira, os templos, os palácios, os arquivos. Yoshimasa, enquanto isso, construía uma villa ao pé das montanhas do leste, o **Ginkaku-ji**, e reunia ali pintores, monges, mestres de chá, jardineiros, atores e poetas, muitos deles de casta baixa, e criou a cultura chamada Higashiyama.',
          'Praticamente tudo que hoje se chama "cultura japonesa tradicional" ganhou forma nesse círculo, no fim do século XV: a **cerimônia do chá** (Murata Jukō, que trocou os utensílios chineses caros por cerâmica simples e a sala grande por quatro tatames e meio), o **ikebana** (o arranjo de flores na alcova), a **pintura a nanquim** (Sesshū, que estudou na China e voltou melhor que os chineses), o **jardim seco**, a **arquitetura shoin**: a sala de tatame inteiro, com a alcova de exposição (*tokonoma*), as prateleiras escalonadas, as portas de correr de papel, a mesa de estudo junto à janela. A casa japonesa tradicional foi inventada num templo, durante uma guerra, por um xogum que se recusava a governar. O Ryōan-ji, com as quinze pedras, foi fundado em 1450 por um dos generais da Guerra Ōnin e queimou nela; o jardim é da reconstrução.',
        ],
      },
      {
        title: 'Sengoku: os Estados em guerra',
        paragraphs: [
          'A Guerra Ōnin não acabou; se espalhou. Os cem anos seguintes são o **Sengoku**, "os Estados em guerra", quando o xogum virou um figurante em Kyoto e cada província teve um senhor de fato, o **daimyō**, "grande nome", com um castelo, um exército, leis próprias e a ambição de engolir o vizinho. Eram ex-governadores, ex-vassalos, ex-bandidos: a palavra da época é *gekokujō*, "os de baixo derrubam os de cima", e um carregador de sandálias podia acabar como senhor do Japão, o que aconteceu. Os camponeses se armaram em ligas (*ikki*), as seitas budistas populares formaram exércitos e repúblicas (a província de Kaga foi governada por uma seita por cem anos), os monges-guerreiros do monte Hiei desciam sobre Kyoto, os piratas dominavam o Mar Interior, e a cidade de Sakai, perto de Osaka, se governava como Veneza, com mercadores e canhões.',
          'Foi também uma época de crescimento: os daimyō construíam estradas, minas, cidades-castelo, mercados livres, e competiam por artesãos e comerciantes. A ideia do castelo japonês, com o torreão de madeira e reboco branco sobre uma base de pedra inclinada, nasce aqui, e vai ganhar sua forma perfeita nos 30 anos seguintes, com Himeji. O Japão de 1550 era um dos países mais militarizados e mais violentos da Terra, e um dos mais dinâmicos.',
        ],
      },
      {
        title: 'Os bárbaros do sul',
        paragraphs: [
          'Em 1543 um junco chinês com três portugueses a bordo foi jogado pela tempestade em Tanegashima, uma ilha ao sul de Kyūshū. O senhor da ilha comprou dois arcabuzes por uma fortuna e mandou o ferreiro copiar; em dez anos o Japão fabricava arcabuzes melhores que os europeus, aos milhares, e a guerra mudou: em Nagashino, em 1575, 3.000 arcabuzeiros de Nobunaga disparando em fileiras alternadas destruíram a melhor cavalaria do país. Em 1549 chegou **Francisco Xavier**, jesuíta, que ficou dois anos, achou os japoneses "o melhor povo até agora descoberto" e converteu alguns milhares; por volta de 1600 havia 300.000 cristãos, vários daimyō entre eles (alguns convertidos pelo comércio com Macau, que só vinha com os padres), e Nagasaki era uma cidade jesuíta.',
          'Os portugueses eram os *nanban*, "bárbaros do sul", porque chegavam pelo sul, e deixaram um rastro: a palavra *pan* para pão, *tempura* (de "têmporas", os dias de jejum de carne em que se fritava peixe), *botan* para botão, *kappa* para capa de chuva, *karuta* para cartas de baralho, o tabaco, a abóbora (*kabocha*, de Camboja), os biombos que retratam os padres e os navios negros, e a primeira notícia de que existia um mundo além da China. Também trouxeram a ideia de que o Japão podia ser conquistado por dentro, pela religião, que era o que os espanhóis faziam nas Filipinas; e foi isso que os unificadores, uma geração depois, decidiram cortar pela raiz.',
        ],
      },
    ],
    noRoteiro: [
      { label: 'Kinkaku-ji, o Pavilhão Dourado', href: '/mais/historia/d29-kinkakuji' },
      { label: 'Ginkaku-ji, onde a cultura Higashiyama nasceu', href: '/mais/historia/d28-ginkakuji' },
      { label: 'Ryōan-ji, as quinze pedras', href: '/mais/historia/d29-ryoanji' },
      { label: 'Kinkaku-ji e Ryōan-ji em 3D', href: '/3d/kinkakuji' },
    ],
  },
  // ───────────────────────────────────────────────────────────────────
  {
    id: 'unificacao',
    years: '1573–1615',
    title: 'Os três unificadores',
    jp: '安土桃山時代',
    lead: 'Nobunaga destruiu, Hideyoshi construiu, Ieyasu esperou e ficou com tudo. Os castelos, os portões e metade dos templos que vocês vão ver são desta geração de trinta anos.',
    sections: [
      {
        title: 'O cuco que não canta',
        paragraphs: [
          'Um poema popular resume os três homens que unificaram o Japão. Diante de um cuco que não quer cantar, **Oda Nobunaga** diz: "mate-o". **Toyotomi Hideyoshi** diz: "faça-o querer cantar". **Tokugawa Ieyasu** diz: "espere". Os três eram da mesma região, em torno de Nagoya, e trabalharam juntos, um a serviço do outro; a unificação levou quarenta anos e os três personagens, e o Japão que saiu dela durou 250.',
        ],
      },
      {
        title: 'Nobunaga: mate-o',
        paragraphs: [
          'Oda Nobunaga (1534–1582) era um daimyō pequeno de Owari, considerado um idiota na juventude (andava vestido de qualquer jeito, comia na rua, brincava com camponeses). Em 1560, com 3.000 homens, atacou num temporal o acampamento de um exército de 25.000 que passava pela sua província a caminho de Kyoto, e cortou a cabeça do comandante. A partir daí não parou. Adotou o arcabuz em massa, pagou soldados profissionais em vez de convocar camponeses, aboliu as guildas e os pedágios nas suas terras, cunhou moeda, e tratou a religião como inimigo político: em 1571 cercou o monte Hiei, o mosteiro-fortaleza acima de Kyoto que tinha 800 anos e 3.000 prédios, e mandou queimar tudo e matar todos, monges, mulheres e crianças. Levou onze anos para vencer a seita Ikkō, que tinha exércitos de camponeses e a fortaleza de Ishiyama Hongan-ji, na foz do rio Yodo, onde hoje é o Castelo de Osaka. Gostava dos jesuítas porque irritavam os budistas, e usava um globo terrestre.',
          'Em 1573 expulsou o último xogum Ashikaga de Kyoto e governou sem título, de um castelo novo em Azuchi, à beira do lago Biwa, com um torreão de sete andares coberto de ouro e pinturas, o primeiro castelo feito para impressionar e não só para defender; queimou dois anos depois da morte dele e só se conhece pelas descrições. Em junho de 1582, a caminho de uma campanha no oeste, pernoitou com cem homens num templo em Kyoto, o Honnō-ji; um dos seus generais, Akechi Mitsuhide, cercou o templo com 13.000 e ninguém sabe bem por quê. Nobunaga lutou com uma lança, se retirou para dentro, pôs fogo e cometeu suicídio. Tinha 48 anos e controlava um terço do país.',
        ],
      },
      {
        title: 'Hideyoshi: faça-o cantar',
        paragraphs: [
          '**Toyotomi Hideyoshi** (1537–1598) era filho de um camponês-soldado, tinha começado a vida como carregador de sandálias de Nobunaga, e subiu por ser mais inteligente e mais rápido do que todos, e por ter um talento para fazer as pessoas quererem o que ele queria. Quando soube da morte de Nobunaga, estava cercando um castelo a 200 km; fez a paz em um dia, marchou de volta em uma semana e derrotou Mitsuhide, que reinou treze dias. Em treze anos submeteu todos os daimyō do país, o último em 1590, mais por negociação, casamento e generosidade do que por batalha: quem se rendia ganhava terras. Unificou o Japão pela primeira vez em 120 anos.',
          'E o reorganizou. Fez o primeiro censo de terras do país, medindo cada campo e fixando o imposto pela produção esperada de arroz (o *koku*, uns 180 litros, o que um homem come num ano, virou a medida de tudo, inclusive do tamanho de um domínio); proibiu os camponeses de mudar de aldeia ou de virar soldado; e em 1588 confiscou as armas de todos que não fossem samurais, na "caçada às espadas", dizendo que o ferro seria fundido para os pregos de um Buda gigante em Kyoto. Nasceram ali as castas rígidas do período Edo. Construiu o **Castelo de Osaka** (1583) para ser o maior do país, maior do que qualquer coisa que Nobunaga tivesse feito; o Jurakudai em Kyoto, um palácio dourado onde recebeu o imperador; o Castelo de Fushimi; o muro de terra em volta de Kyoto; o **Rōmon do Fushimi Inari** (1589), doado em agradecimento pela cura da mãe; e fez a maior cerimônia do chá da história, em Kitano, aberta a todos, com 800 salas de chá num só dia.',
          'O lado escuro: mandou crucificar 26 cristãos em Nagasaki em 1597, quando concluiu que os padres eram a vanguarda da Espanha; obrigou o maior mestre de chá do país, Sen no Rikyū, a cometer seppuku em 1591, ninguém sabe por quê; mandou matar o sobrinho e herdeiro, com a família inteira, quando finalmente teve um filho próprio; e invadiu a Coreia duas vezes, em 1592 e 1597, com 160.000 homens, para conquistar a China. A guerra devastou a Coreia, matou dezenas de milhares e não conquistou nada; os ceramistas coreanos trazidos como prisioneiros fundaram as olarias de Kyūshū. Hideyoshi morreu em 1598, em Fushimi, com o exército ainda na Coreia e um filho de cinco anos, **Hideyori**, cuidado por cinco regentes que juraram lealdade. O mais poderoso deles era Ieyasu.',
        ],
      },
      {
        title: 'Ieyasu: espere',
        paragraphs: [
          '**Tokugawa Ieyasu** (1543–1616) passou a infância como refém de dois clãs, foi aliado de Nobunaga por vinte anos (a pedido dele, mandou a própria mulher ser executada e o filho mais velho cometer seppuku, por suspeita de traição), e vassalo de Hideyoshi por dezesseis, que o mandou para o leste, para a planície de Kantō, longe do centro, com um castelo em ruínas num pântano chamado Edo. Ele aceitou, drenou o pântano e esperou. Em 1600, dois anos depois da morte de Hideyoshi, os regentes se dividiram e os exércitos do leste e do oeste, 160.000 homens, se enfrentaram em **Sekigahara**, num vale ao norte de Nagoya, numa manhã de neblina. Ieyasu venceu em seis horas, porque um daimyō do outro lado mudou de lado no meio da batalha, como combinado. Em 1603 o imperador o fez xogum. Em 1605 ele passou o título ao filho, para deixar claro que era hereditário, e governou dos bastidores.',
          'Faltava Osaka. Hideyori, aos 21 anos, vivia no castelo com a mãe, Yodo-dono, sobrinha de Nobunaga, e com a lealdade de milhares de samurais sem senhor. Em 1614 Ieyasu achou um pretexto (uma inscrição num sino de templo que, lida de certo modo, amaldiçoava o nome dele) e cercou o castelo com 200.000 homens, no **cerco de inverno**. Não conseguiu: as muralhas de Hideyoshi eram boas demais. Negociou uma trégua com a condição de aterrar o fosso externo, e mandou aterrar o interno também, alegando mal-entendido. No **cerco de verão** de 1615, o castelo sem fossos caiu em dois dias; Hideyori e a mãe se mataram numa torre em chamas, o filho de oito anos dele foi decapitado, e a filha foi mandada para um convento. Ieyasu morreu no ano seguinte e foi deificado num santuário em Nikkō. A guerra tinha acabado por 250 anos.',
        ],
      },
      {
        title: 'O que sobrou dessa geração',
        paragraphs: [
          'Os trinta anos entre 1580 e 1615 são o período Azuchi-Momoyama (os nomes dos castelos de Nobunaga e Hideyoshi), e produziram mais do que qualquer outra geração japonesa no que se vê hoje: os castelos (Himeji, 1609, construído por um genro de Ieyasu para vigiar o oeste; Osaka, refeito pelos Tokugawa por cima do de Hideyoshi), os portões monumentais (o Rōmon de Fushimi Inari, o Sanmon de Nanzen-ji em 1628), os biombos dourados da escola Kanō, a cerâmica de chá, os templos reconstruídos (Kiyomizu, Tōfuku-ji, Kōdai-ji, construído pela viúva de Hideyoshi, Nene, em 1606, com casas de chá de Rikyū), o Senjōkaku de Miyajima, que Hideyoshi não terminou, e os primeiros bairros de prazer e teatro de Kyoto. A cidade de Edo foi fundada, Osaka virou a cidade do comércio, e as castas foram fechadas. É a geração cujos nomes vocês vão ouvir em cada lugar do roteiro.',
        ],
      },
    ],
    noRoteiro: [
      { label: 'Castelo de Osaka, e os dois cercos', href: '/mais/historia/d26-castelo-osaka' },
      { label: 'Castelo de Himeji, por dentro', href: '/mais/historia/d25-himeji' },
      { label: 'Kōdai-ji, construído pela viúva de Hideyoshi', href: '/roteiro/d2026-11-28#d28-kodaiji' },
      { label: 'O Rōmon de Fushimi Inari, doado por Hideyoshi', href: '/lugar/fushimi-inari' },
      { label: 'Nanzen-ji, o Sanmon em memória do cerco de Osaka', href: '/mais/historia/d28-nanzenji' },
    ],
  },
  // ───────────────────────────────────────────────────────────────────
  {
    id: 'edo',
    years: '1603–1868',
    title: 'Edo: o país fechado e a cidade de um milhão',
    jp: '江戸時代',
    lead: 'Dois séculos e meio sem guerra, sem estrangeiros e sem mudança, e a cultura popular (sushi, kabuki, ukiyo-e, gueixas, sumô) que nasceu do tédio e do dinheiro.',
    sections: [
      {
        title: 'Um sistema para que nada mudasse',
        paragraphs: [
          'Os Tokugawa organizaram o Japão para que nada mudasse, e conseguiram por 250 anos. Os 260 daimyō foram classificados em três tipos: os parentes, os aliados de antes de Sekigahara e os "de fora", que tinham lutado contra Ieyasu e ficaram nas províncias mais distantes, vigiados. Cada um governava seu domínio, mas com regras: não podia construir castelos novos, não podia casar sem permissão, não podia ter navios grandes, e tinha de passar um ano sim, um ano não, em **Edo**, com centenas de servos, deixando a mulher e o herdeiro na capital como reféns. O sistema, o *sankin-kōtai*, esvaziava os cofres dos senhores (metade da renda de um domínio ia na viagem e na residência de Edo), enchia as estradas de cortejos e estalagens, e fez de Edo uma cidade de meio milhão de samurais solteiros. A estrada Tōkaidō, de Kyoto a Edo, com 53 paradas (as das estampas de Hiroshige), era o corredor do país; hoje é o Shinkansen.',
          'A sociedade foi congelada em quatro castas, em ordem de prestígio: samurais (7% da população, com espada, sobrenome e o direito de matar um plebeu por desrespeito), camponeses (80%, os que produzem a riqueza), artesãos e mercadores (os últimos porque não produzem nada, só lucram). Abaixo de todos, os *eta* e *hinin*, que lidavam com couro, carne e execuções, cujos descendentes (os *burakumin*) ainda sofrem discriminação. Não se mudava de casta, de aldeia, nem de ofício; cada um tinha as roupas, a casa e o telhado que a lei permitia. A ordem inversa era a do dinheiro: os mercadores ficaram ricos, os samurais, pagos em arroz por senhores falidos, pobres e endividados com os mercadores.',
        ],
      },
      {
        title: 'Sakoku: o país fechado',
        paragraphs: [
          'O cristianismo foi o alvo. Ieyasu o tolerou; o filho o proibiu em 1614; o neto, Iemitsu, o erradicou. Em 1637 uma revolta de camponeses cristãos em Shimabara, perto de Nagasaki, tomou um castelo e resistiu por meses a 125.000 soldados, com ajuda de canhões holandeses (protestantes, que odiavam os portugueses); quando o castelo caiu, os 37.000 rebeldes foram executados. Em 1639 os portugueses foram expulsos para sempre, e uma embaixada de Macau que veio negociar em 1640 teve 61 dos seus membros decapitados. Os japoneses foram proibidos de sair do país e de voltar, sob pena de morte; navios grandes foram proibidos; e os únicos estrangeiros admitidos foram os chineses, num bairro de Nagasaki, e os holandeses, numa ilhota artificial em forma de leque no porto de Nagasaki, **Dejima**, de 120 por 75 metros, com uns vinte homens, uma ponte vigiada e a obrigação de ir uma vez por ano a Edo se curvar diante do xogum e fazer graça (dançar, cantar, mostrar como os europeus se beijavam).',
          'Todo japonês teve de se registrar num templo budista, e uma vez por ano pisar numa imagem de Cristo, o *fumie*, para provar que não era cristão. Os cristãos escondidos de Nagasaki sobreviveram assim por sete gerações, rezando o Pai Nosso em latim deformado diante de imagens de Kannon disfarçadas de Maria, até que um padre francês os encontrou em 1865. O *sakoku*, "país fechado", durou 215 anos. Não foi total: pelos holandeses de Dejima entravam livros, e um pequeno grupo de estudiosos, os *rangaku* ("estudos holandeses"), aprendeu anatomia, astronomia e balística com dicionários caseiros. Mas o Japão perdeu a revolução científica, a industrial e a francesa, e quando Perry chegou, em 1853, o exército tinha arcabuzes de 1600.',
        ],
      },
      {
        title: 'Edo, a maior cidade do mundo',
        paragraphs: [
          'Sem guerra e sem fronteira, o país cresceu: a população dobrou para 30 milhões no século XVII e depois parou, controlada por infanticídio e fome. Edo passou de um pântano a uma cidade de um milhão de habitantes por volta de 1720, **a maior do mundo** (Londres tinha 600.000, Paris 500.000, Pequim talvez o mesmo que Edo), sem que nenhum europeu soubesse. Osaka tinha 400.000 e Kyoto outros tantos; o Japão era o país mais urbanizado da Terra. Edo era dividida em dois: a **Yamanote**, "o lado da montanha", a oeste do castelo, com as mansões dos daimyō e dos samurais em jardins murados; e a **Shitamachi**, "a cidade de baixo", a leste, no aterro junto ao rio, onde 600.000 plebeus viviam em cortiços de madeira com um quarto por família, num beco, com privada e poço comuns. Asakusa, Ueno, Kuramae e Nihonbashi, que vocês vão ver, são Shitamachi; Ginza, Marunouchi e Shinjuku, Yamanote.',
          'Era uma cidade de madeira e papel que pegava fogo tanto que os incêndios ganharam o apelido de "as flores de Edo": 49 grandes incêndios em 267 anos, o de 1657 matando 100.000 pessoas e destruindo o torreão do castelo, que nunca foi refeito. Os bombeiros eram brigadas de bairro que apagavam o fogo demolindo casas; um bom bombeiro era o herói da Shitamachi. A cidade tinha aqueduto, coleta de lixo, esgoto vendido como adubo (o excremento humano era mercadoria, e o de bairro rico valia mais), livrarias de aluguel, banhos públicos, uma polícia de samurais, e uma taxa de alfabetização que se estima em 40% dos homens, maior que a de qualquer país europeu.',
        ],
      },
      {
        title: 'A cultura do mundo flutuante',
        paragraphs: [
          'Os mercadores tinham dinheiro e não podiam comprar status; compraram prazer. O *ukiyo*, "o mundo flutuante", era o nome budista do mundo ilusório, e virou o nome da cultura dos bairros de prazer e teatro: Yoshiwara em Edo, Shimabara em Kyoto, Shinmachi em Osaka, cidades muradas dentro da cidade, com cortesãs de vários níveis, a mais alta, a *oiran*, uma celebridade que escolhia os clientes e lia poesia chinesa. As **gueixas** ("pessoa de arte") surgiram no século XVIII como as entertainers de festa, que cantavam, tocavam shamisen e conversavam, e por lei não podiam competir sexualmente com as cortesãs; Gion, em Kyoto, onde vocês jantam no dia 28, é o bairro delas, e as duzentas que restam ainda seguem essa regra.',
          'O **kabuki** nasceu em 1603 com uma dançarina de Kyoto, Okuni, e um grupo de mulheres que dançavam vestidas de homem; foi proibido às mulheres em 1629 por indecência, depois aos rapazes, e virou teatro de homens que fazem mulheres, com maquiagem, poses congeladas e uma passarela pelo meio da plateia. O **sumô** foi profissionalizado como espetáculo em Edo. As **estampas ukiyo-e**, xilogravuras coloridas em tiragem de milhares, vendidas pelo preço de uma tigela de soba, retratavam atores, cortesãs, lutadores e paisagens: o Fuji de Hokusai (as "Trinta e Seis Vistas", de 1831, quando ele tinha 70 anos), as 53 paradas da Tōkaidō de Hiroshige, os retratos de Utamaro; quando chegaram à Europa nos anos 1860, como papel de embrulho, mudaram Monet, Van Gogh e Degas. A literatura de Osaka (Ihara Saikaku, sobre dinheiro e sexo) e o teatro de bonecos *bunraku*, com as tragédias de amantes suicidas de Chikamatsu, são da mesma safra. E o haicai: Bashō, que atravessou o norte do Japão a pé em 1689 escrevendo dezessete sílabas de cada vez.',
        ],
      },
      {
        title: 'O que se come vem de Edo',
        paragraphs: [
          'A comida que vocês vão comer é em grande parte invenção de Edo, uma cidade de homens solteiros com pressa. O **sushi** era conserva de peixe fermentado; por volta de 1820 Hanaya Yohei, numa barraca em Ryōgoku, serviu o peixe cru sobre arroz avinagrado, do tamanho de duas dentadas, na hora: o *nigiri*, "fast-food de Edo", e as barracas viraram o padrão. O **soba** de trigo-sarraceno era o que se comia de pé, à noite, das carrocinhas com lanterna. A **tempura**, dos portugueses, virou comida de barraca de rua. A **enguia grelhada** (*unagi*), o *tonkatsu* ainda não (é Meiji), o *sukiyaki* não (carne era proibida). Osaka tinha sua própria cozinha, de udon e de peixe do Mar Interior, e Kyoto a comida da corte e dos templos, o *kaiseki* e a cozinha vegetariana. O saquê de Fushimi e de Nada (Kobe) abastecia Edo por navio.',
        ],
      },
      {
        title: 'O sistema range',
        paragraphs: [
          'No século XIX o sistema rangia. Os domínios estavam falidos, os samurais empenhavam as espadas, as fomes de 1780 e 1830 mataram centenas de milhares e provocaram revoltas de camponeses e saques de arroz nas cidades (Osaka teve uma rebelião de um funcionário samurai, Ōshio Heihachirō, em 1837, que incendiou um quarto da cidade). O xogunato respondia com "reformas" que eram leis suntuárias: proibir cores, teatros, penteados. E navios estrangeiros apareciam cada vez mais: russos no norte, baleeiros americanos, ingleses que tinham acabado de humilhar a China na Guerra do Ópio, em 1842, o que os japoneses acompanharam pelos holandeses com pavor. Era essa a situação quando, em julho de 1853, quatro navios de guerra americanos entraram na baía de Edo soltando fumaça preta.',
        ],
      },
    ],
    noRoteiro: [
      { label: 'O Castelo de Edo, hoje Jardim Leste do Palácio', href: '/mais/historia/d02-jardim-imperial' },
      { label: 'Nihonbashi, o quilômetro zero das cinco estradas', href: '/mais/historia/d02-nihonbashi' },
      { label: 'Sensō-ji e Asakusa, a Shitamachi', href: '/mais/historia/d19-sensoji' },
      { label: 'Kurashiki, os armazéns do xogum', href: '/lugar/kurashiki' },
      { label: 'Gion, o bairro das gueixas', href: '/roteiro/d2026-11-28#d28-gion' },
      { label: 'Tsukiji e o sushi de Edo', href: '/mais/historia/d21-tsukiji' },
      { label: 'Os Hokusai e Hiroshige, no Museu Nacional', href: '/mais/historia/d19-museu-nacional' },
    ],
  },
  // ───────────────────────────────────────────────────────────────────
  {
    id: 'meiji',
    years: '1853–1912',
    title: 'Os navios negros e a Restauração Meiji',
    jp: '幕末 · 明治時代',
    lead: 'Em quarenta anos o Japão saiu da Idade Média, copiou o Ocidente por inteiro e derrotou a Rússia. O preço foi um Estado que se achava divino.',
    sections: [
      {
        title: 'Perry e os navios negros',
        paragraphs: [
          'Em 8 de julho de 1853 o comodoro **Matthew Perry** entrou na baía de Edo com quatro navios, dois deles a vapor, pintados de preto, soltando fumaça e avançando contra o vento, coisa que os japoneses nunca tinham visto, e disparou canhões de saudação. Trazia uma carta do presidente Fillmore pedindo portos abertos para carvão e água, tratamento decente aos náufragos e comércio. Recusou-se a ir a Nagasaki como mandava a regra, entregou a carta com uma cerimônia estudada, deu de presente um telégrafo e um trem a vapor em miniatura, e disse que voltaria no ano seguinte com uma frota maior. Voltou em fevereiro de 1854 com nove navios, e o xogunato, que não tinha como resistir (um canhão do Susquehanna alcançava mais do que todos os de Edo juntos), assinou. Em 1858 vieram os tratados comerciais, com portos abertos, tarifas fixadas pelos estrangeiros e extraterritorialidade: um americano que matasse um japonês seria julgado por um cônsul americano. Eram os mesmos "tratados desiguais" impostos à China, e o Japão passou os quarenta anos seguintes tentando revogá-los.',
          'A abertura destruiu o xogunato pela base. Se o xogum não sabia "subjugar os bárbaros", para que servia? Os samurais dos domínios "de fora", sobretudo **Satsuma** (Kagoshima) e **Chōshū** (Yamaguchi), que esperavam desde Sekigahara, levantaram a bandeira "reverenciar o imperador, expulsar os bárbaros" (*sonnō jōi*), assassinaram ministros e estrangeiros, bombardearam navios ocidentais e foram bombardeados de volta, o que os convenceu de que o problema não era expulsar os bárbaros, mas ficar tão forte quanto eles. Em Kyoto, os quinze anos de *bakumatsu*, "o fim do bakufu", foram de conspiração e espada: os *rōnin* imperialistas e a polícia do xogum, o Shinsengumi, matavam-se pelas ruas de Gion e Pontochō; o Ikedaya, onde o Shinsengumi matou os conspiradores em 1864, é hoje um izakaya na rua Sanjō. A guerra civil de 1868–69 foi curta: o último xogum, Tokugawa Yoshinobu, devolveu o poder ao imperador em novembro de 1867 e se retirou; os últimos leais lutaram em Ueno (o templo dos Tokugawa, onde é o museu, queimou na batalha) e em Hokkaidō, onde fundaram uma república de seis meses.',
        ],
      },
      {
        title: 'Meiji: a restauração que era uma revolução',
        paragraphs: [
          'O imperador tinha 16 anos, chamava-se Mutsuhito e nunca tinha saído de Kyoto. Em 1868 foi levado numa procissão de 3.000 pessoas para Edo, rebatizada **Tōkyō**, "capital do leste", e instalado no Castelo dos Tokugawa. O nome da era, **Meiji**, "governo esclarecido", virou o nome dele depois da morte. O poder real estava com um grupo de jovens samurais de Satsuma e Chōshū, de trinta anos, que nos quatro anos seguintes desmontaram o Japão de Edo: aboliram os domínios feudais (os daimyō foram transformados em nobres de Tóquio com pensão), as castas (todos ganharam sobrenome, o direito de casar com quem quisessem e de ter qualquer ofício), o estipêndio dos samurais (trocado por títulos que não valiam nada), o direito de portar espada (1876), e criaram o exército de recrutamento universal (1873), o ensino primário obrigatório (1872), o calendário gregoriano, o correio, o banco central, os jornais.',
          'A "missão Iwakura" (1871–73) mandou metade do governo por dois anos aos Estados Unidos e à Europa, para estudar tudo; voltaram com uma conclusão: copiar o melhor de cada país. A marinha da Inglaterra, o exército e a constituição da Prússia, o código civil da França, a escola dos Estados Unidos, a medicina da Alemanha, a arquitetura de qualquer um. Centenas de especialistas estrangeiros foram contratados a preço de ouro (*oyatoi gaikokujin*, "estrangeiros contratados"), e milhares de japoneses mandados estudar fora. A primeira ferrovia, de Tóquio a Yokohama, é de 1872, com locomotivas inglesas; a Ginza foi reconstruída em tijolo à europeia no mesmo ano; a corte adotou o terno, a valsa, a carne bovina (o imperador comeu carne em público em 1872 para dar exemplo) e a fotografia. O lema era *bunmei kaika*, "civilização e esclarecimento", e *fukoku kyōhei*, "país rico, exército forte".',
        ],
      },
      {
        title: 'Os últimos samurais e a destruição dos templos',
        paragraphs: [
          'Nem todos gostaram. Os samurais, que tinham feito a Restauração, perderam tudo com ela, e se revoltaram: a última e maior rebelião foi a de **Satsuma**, em 1877, liderada por Saigō Takamori, o herói da própria Restauração, com 30.000 samurais, esmagada em seis meses por um exército de camponeses recrutados com fuzis e telégrafo. Saigō cometeu seppuku numa colina em Kagoshima e virou um herói trágico (a estátua dele passeando o cachorro está no Parque Ueno; o filme *O Último Samurai* é uma versão dele). A mensagem era clara: a espada tinha acabado. Os castelos, símbolo feudal, foram demolidos às dezenas, vendidos como lenha ou usados como quartéis; dos 170 de 1868 sobraram doze originais, e Himeji foi salvo porque um coronel do exército gostou dele e porque o comprador em leilão desistiu de desmontar.',
          'A outra vítima foi o budismo. Em 1868 o governo decretou a **separação de kami e budas** (*shinbutsu bunri*): os santuários deveriam ser puramente Shintō, sem estátuas, monges ou sutras, para que o Shintō pudesse virar a religião do Estado com o imperador no centro. Seguiu-se uma onda de destruição, o *haibutsu kishaku*, "abolir Buda, destruir Shakyamuni": milhares de templos fechados, estátuas queimadas ou vendidas como sucata (os museus europeus compraram muitas), pagodes derrubados. O Hachimangū de Kamakura perdeu um templo inteiro em semanas; o Kōfuku-ji de Nara quase foi demolido e o pagode foi posto à venda por 250 ienes, para as ferragens. É por causa disso que hoje templo e santuário parecem coisas separadas: antes de 1868 eram o mesmo recinto. E é dessa separação que veio o **Shintō de Estado**: o imperador como deus vivo, descendente em linha direta da deusa do Sol, a quem todo japonês devia obediência religiosa, ensinada nas escolas. A ideologia que sustentou o Japão até 1945 foi criada nesses anos, com a Constituição de 1889 (outorgada pelo imperador, com um parlamento de poderes limitados e o exército respondendo só a ele) e o Rescrito sobre a Educação de 1890, decorado por todas as crianças.',
        ],
      },
      {
        title: 'De país semi-colonial a potência',
        paragraphs: [
          'O resultado não tem paralelo na história. Em 1895 o Japão derrotou a China numa guerra pela Coreia, ganhou Taiwan e uma indenização que financiou a indústria pesada. Em 1902 fez aliança com a Inglaterra, de igual para igual. Em **1905** derrotou a Rússia, afundando a frota do Báltico inteira no estreito de Tsushima em um dia: a primeira vitória de um país não-europeu sobre uma grande potência nos tempos modernos, celebrada de Istambul a Calcutá como o fim da invencibilidade branca. Os tratados desiguais foram revogados em 1911. A Coreia foi anexada em 1910 e governada com uma dureza que os coreanos não esqueceram. O Japão de 1912, quando Meiji morreu, tinha ferrovias, universidades, uma marinha entre as maiores do mundo, fábricas de seda e algodão que abasteciam a Ásia, um parlamento, e um império. Hiroshima tinha sido a base de tudo isso: a guerra de 1894 foi comandada dali, com o imperador na cidade.',
          'O imperador morreu em julho de 1912, e o general Nogi, herói da guerra russa, cometeu seppuku com a mulher na noite do funeral, para segui-lo, como um samurai de Edo. O país inteiro discutiu se aquilo era o passado ou o futuro. O **Meiji Jingū**, que vocês visitam no dia 22, foi construído entre 1915 e 1920 para o imperador deificado, com uma floresta plantada por 100.000 voluntários; o Museu Nacional de Tóquio, o Museu Ōhara em Kurashiki (o primeiro de arte ocidental do Japão, 1930) e o Museu Meiji (1926, o prédio de Kengo Kuma no Meiji Jingū é de 2019) são os museus dessa era que se via como o futuro.',
        ],
      },
    ],
    noRoteiro: [
      { label: 'Meiji Jingū, a floresta plantada', href: '/mais/historia/d22-meiji-jingu' },
      { label: 'Museu Nacional de Tóquio, de 1872', href: '/mais/historia/d19-museu-nacional' },
      { label: 'Ginza, o bairro que aprendeu a ser ocidental', href: '/mais/historia/d21-ginza' },
      { label: 'O aqueduto de Nanzen-ji, a modernidade em Kyoto', href: '/mais/historia/d28-nanzenji' },
      { label: 'Museu Ōhara, em Kurashiki', href: '/roteiro/d2026-11-25#d25-ohara' },
    ],
  },
  // ───────────────────────────────────────────────────────────────────
  {
    id: 'guerra',
    years: '1912–1945',
    title: 'Taishō, Shōwa e a catástrofe',
    jp: '大正 · 昭和前期',
    lead: 'Uma democracia curta, o terremoto que apagou Tóquio, os militares que ninguém controlava, a guerra de quinze anos e as duas bombas.',
    sections: [
      {
        title: 'Taishō: jazz, moga e o terremoto',
        paragraphs: [
          'O imperador Taishō (1912–1926) era doente e apagado, e por isso os anos 1910 e 1920 foram a era dos partidos, dos sindicatos, do sufrágio masculino universal (1925), das greves, da imprensa livre, do cinema, do jazz e das *moga*, as "modern girls" de cabelo curto e vestido reto que passeavam na Ginza fumando. A Primeira Guerra tinha enriquecido o Japão, que ficou do lado dos Aliados e vendeu para todos; Osaka era a "Manchester do Oriente", e Tóquio tinha bondes, lojas de departamento, cafés e uma classe média de escritório, o *salaryman*, que nasce aqui. Foi uma democracia real, e curta.',
          'Em 1º de setembro de 1923, ao meio-dia, quando as cozinhas de Tóquio estavam acesas para o almoço, veio o **grande terremoto de Kantō**, de magnitude 7,9. A cidade de madeira pegou fogo com o vento de um tufão que passava; em Honjo, 38.000 pessoas que se refugiaram num terreno de um antigo depósito militar morreram num tornado de fogo em minutos. Morreram 140.000 em Tóquio e Yokohama, quase todas queimadas; a Shitamachi, Asakusa, Nihonbashi e a Ginza foram apagadas. Boatos de que os coreanos estavam envenenando poços levaram milícias de bairro a matar uns 6.000 coreanos em uma semana. A cidade foi reconstruída em sete anos, com avenidas largas, parques, pontes de aço e prédios de concreto, e boa parte dos "monumentos antigos" de Tóquio são dessa reconstrução: o santuário de Kanda, o mercado de Tsukiji (1935), a estação de Ueno, o Sensō-ji parcialmente.',
        ],
      },
      {
        title: 'Shōwa: os militares tomam o governo',
        paragraphs: [
          'Hirohito subiu ao trono em 1926 com o nome de era **Shōwa**, "paz iluminada". Três anos depois a crise de 1929 quebrou o Japão rural: o preço da seda caiu pela metade, os camponeses do norte vendiam as filhas para os bordéis, e os jovens oficiais do exército, filhos desses camponeses, concluíram que a culpa era dos políticos corruptos, dos conglomerados e do Ocidente, e que a solução era a expansão no continente e o governo direto pelo imperador. Como a Constituição fazia o exército responder só ao imperador, e o imperador não intervinha, ninguém os controlava. Em 1931 oficiais do exército da Manchúria explodiram um trecho de ferrovia, culparam os chineses e ocuparam a Manchúria inteira em cinco meses, sem ordem de Tóquio; o governo aceitou o fato consumado e criou um Estado fantoche. Em 1932 o primeiro-ministro foi assassinado por oficiais da marinha; em 1936, 1.400 soldados tomaram o centro de Tóquio e mataram vários ministros. Os golpistas foram punidos; o exército ganhou o governo.',
          'Em julho de 1937 um incidente numa ponte perto de Pequim virou a guerra total contra a China, que o Japão nunca declarou nem conseguiu vencer: em dezembro o exército tomou Nanquim e matou, em seis semanas, entre 100.000 e 300.000 civis e prisioneiros, no massacre que ainda envenena as relações entre os dois países. A China resistiu, a guerra empacou, os Estados Unidos impuseram um embargo de petróleo em 1941, e o governo do general Tōjō decidiu que a única saída era tomar o petróleo da Indonésia e destruir a frota americana antes que ela reagisse. Em **7 de dezembro de 1941**, 353 aviões de seis porta-aviões atacaram Pearl Harbor. Em seis meses o Japão tomou Hong Kong, Cingapura, as Filipinas, a Indonésia e a Birmânia; em junho de 1942, em Midway, perdeu quatro porta-aviões em um dia, e daí em diante só recuou.',
        ],
      },
      {
        title: 'A guerra chega em casa',
        paragraphs: [
          'A partir de novembro de 1944 os B-29 decolando das Marianas alcançavam o Japão. Em março de 1945 o general LeMay trocou as bombas de precisão pelas incendiárias, à noite, a baixa altura: na noite de **9 para 10 de março**, 300 aviões despejaram 1.700 toneladas de napalm sobre a Shitamachi de Tóquio e queimaram 41 km², matando cerca de 100.000 pessoas em seis horas, mais do que Hiroshima mataria no dia, no ataque aéreo mais mortal da história. Asakusa foi apagada de novo; o Sensō-ji queimou. Sessenta e seis cidades foram bombardeadas assim até agosto; Osaka, Kobe, Nagoya, Himeji (o castelo escapou de uma bomba que caiu no torreão e não explodiu). Kyoto, Nara e Kamakura não foram bombardeadas, e Kyoto foi poupada de propósito: estava no topo da lista de alvos da bomba atômica, como cidade intacta, grande e industrial onde o efeito pudesse ser medido, e o secretário de Guerra Henry Stimson, que a conhecera em lua de mel nos anos 1920, a riscou pessoalmente, duas vezes, contra os militares. É por isso que ela existe.',
          'Okinawa, entre abril e junho de 1945, foi a batalha que decidiu o que viria: 100.000 soldados japoneses e 100.000 civis de Okinawa mortos, muitos por suicídio forçado, e 12.000 americanos, para uma ilha. Os planejadores americanos projetaram uma invasão do Japão com um milhão de baixas; o governo japonês preparava "cem milhões de mortes gloriosas", com mulheres treinando com lanças de bambu. A bomba, testada em 16 de julho, foi decidida sem debate.',
        ],
      },
      {
        title: 'Hiroshima, Nagasaki, a rendição',
        paragraphs: [
          'Hiroshima foi escolhida por ser um quartel-general, um porto de embarque de tropas, uma cidade plana de 350.000 habitantes e, sobretudo, intacta, de modo que se pudesse medir o efeito. Em **6 de agosto de 1945, às 8h15**, o B-29 Enola Gay soltou a bomba de urânio, "Little Boy", que explodiu 600 metros acima de um hospital, a 160 m do Salão de Promoção Industrial, hoje o Domo. Cerca de 70.000 pessoas morreram no instante, 140.000 até o fim do ano, numa cidade de 350.000; o museu que vocês visitam no dia 23 conta isso com os objetos que sobraram. Três dias depois, em 9 de agosto, a bomba de plutônio, "Fat Man", destinada a Kokura, encoberta por nuvens, foi jogada em Nagasaki, matando 40.000 no dia e 70.000 até dezembro. No mesmo dia a União Soviética invadiu a Manchúria. O conselho de guerra ficou empatado; Hirohito desempatou.',
          'Em **15 de agosto**, ao meio-dia, os japoneses ouviram pela primeira vez a voz do imperador, gravada, pelo rádio, numa língua de corte tão arcaica que muitos não entenderam que era a rendição: "a situação da guerra não se desenvolveu necessariamente em vantagem do Japão", e o país devia "suportar o insuportável". Um grupo de oficiais tentou roubar a gravação na noite anterior; falhou. A guerra tinha matado uns 3 milhões de japoneses e uns 20 milhões de asiáticos. A ocupação americana (1945–1952), sob MacArthur, escreveu uma Constituição em uma semana (com o artigo 9, que renuncia à guerra, e o voto feminino), fez a reforma agrária, desmontou os conglomerados, julgou os líderes (Tōjō foi enforcado; o imperador, poupado por decisão política, renunciou à divindade num discurso de Ano Novo de 1946) e, com a Guerra Fria, reverteu o curso e reconstruiu o Japão como aliado. Hiroshima recebeu em 1949 uma lei especial que a fez "cidade da paz", e o parque de Kenzō Tange foi construído no eixo do Domo.',
        ],
      },
    ],
    noRoteiro: [
      { label: 'Parque da Paz e o Domo, em 3D', href: '/3d/parque-da-paz' },
      { label: 'Museu Memorial da Paz', href: '/mais/historia/d23-museu-paz' },
      { label: 'O Domo', href: '/mais/historia/d23-parque-domo' },
      { label: 'Hiroshima, a cidade', href: '/mais/historia/hiroshima' },
      { label: 'Kyoto, a cidade que foi riscada da lista', href: '/mais/historia/kyoto' },
    ],
  },
  // ───────────────────────────────────────────────────────────────────
  {
    id: 'milagre',
    years: '1945–1989',
    title: 'O milagre econômico',
    jp: '戦後 · 高度経済成長',
    lead: 'De país arrasado a segunda economia do mundo em 25 anos, com trem-bala, Godzilla, Sony e a bolha em que o palácio valia mais que a Califórnia.',
    sections: [
      {
        title: 'Da fome ao Shinkansen',
        paragraphs: [
          'Em 1946 o Japão passava fome: as cidades eram campos de escombros, um quarto da riqueza nacional tinha sido destruído, 6 milhões de soldados e colonos voltavam do império, e a comida vinha da ajuda americana e do mercado negro (o de Akihabara, debaixo dos trilhos, é o que virou a Electric Town). O que mudou foi a **Guerra da Coreia**, em 1950: os Estados Unidos precisavam de caminhões, uniformes, munição e reparos, e encomendaram tudo no Japão, que ainda tinha engenheiros e operários. Daí em diante a economia cresceu 10% ao ano por duas décadas, a "alta velocidade de crescimento", sob o Partido Liberal Democrata, que governa quase sem interrupção desde 1955, e com um pacto tácito: o Estado planeja e protege, as empresas empregam para a vida inteira, os trabalhadores não fazem greve, todo mundo poupa, e a defesa fica por conta dos americanos.',
          'Os **Jogos Olímpicos de Tóquio de 1964** foram a festa de reapresentação ao mundo, e a cidade foi refeita para eles: as vias expressas construídas por cima dos canais e dos rios (por cima do Nihonbashi, que vocês vão ver), o monotrilho de Haneda, os hotéis, o ginásio de Kenzō Tange. Nove dias antes da abertura foi inaugurado o **Shinkansen**, de Tóquio a Osaka em quatro horas a 210 km/h, quando o trem mais rápido da Europa fazia 160; o mundo achou que era loucura de um país que não tinha dinheiro para isso, e foi o projeto de maior sucesso da história das ferrovias. A Tokyo Tower é de 1958, mais alta que a Eiffel de propósito; o Castelo de Osaka de concreto, de 1931, sobreviveu à guerra; o de Hiroshima foi refeito em 1958, o Sensō-ji também.',
        ],
      },
      {
        title: 'Marcas, salaryman e a cultura pop',
        paragraphs: [
          'Foi a época das marcas que o mundo conhece. A Sony começou em 1946 numa loja de departamentos bombardeada, fazendo panelas de arroz; em 1955 lançou o rádio transistor, em 1979 o Walkman. A Honda começou com motores acoplados a bicicletas; a Toyota, que fazia teares, inventou o sistema de produção que o mundo inteiro copiou; a Nintendo fazia baralhos desde 1889 e virou videogame em 1983. O trabalhador dessa era era o **salaryman**: terno cinza, emprego vitalício, dez horas por dia, bebida com o chefe à noite, trem lotado de manhã, e um apartamento minúsculo no subúrbio comprado com 30 anos de financiamento. O Japão tinha a menor desigualdade do mundo capitalista, 90% da população se declarava classe média, e o país achava que tinha resolvido o capitalismo.',
          'A cultura pop nasceu junto. **Godzilla** (1954) é um dinossauro acordado por testes nucleares no Pacífico, e o filme original é sombrio: uma alegoria da bomba, feita nove anos depois dela, por um estúdio cujos técnicos tinham feito filmes de propaganda. O mangá moderno é de **Osamu Tezuka**, um médico de Osaka que em 1947 adaptou a linguagem do cinema para os quadrinhos e criou Astro Boy (1952), o Rei Leão de Kimba (1950), e a indústria: revistas semanais de 400 páginas vendidas aos milhões. O anime começa com a série de TV do Astro Boy em 1963. O karaokê foi inventado em Kobe em 1971, o gachapon em 1965, o Hello Kitty em 1974, o Pac-Man em 1980, o Nintendo Entertainment System em 1983, e o Pokémon em 1996, ideia de um menino que colecionava insetos nos subúrbios de Tóquio e viu os subúrbios virarem asfalto.',
        ],
      },
      {
        title: 'A bolha: quando o Japão se achava o futuro',
        paragraphs: [
          'Nos anos 1980 o Japão era o futuro. Tinha as dez maiores empresas do mundo em valor de mercado, e oito dos dez maiores bancos; comprava o Rockefeller Center, a Columbia Pictures e o campo de golfe de Pebble Beach; os livros americanos se chamavam *Japan as Number One* e os executivos estudavam o zen para entender o segredo da Toyota. O acordo do Plaza de 1985 valorizou o iene, o Banco do Japão baixou os juros para compensar, e o dinheiro barato foi para imóveis e ações: entre 1985 e 1989 o índice Nikkei triplicou e o preço da terra em Tóquio também. No papel, o terreno do Palácio Imperial, 1,15 km² que vocês vão ver no dia 2, valia mais do que todos os imóveis da Califórnia; o Japão, com 3% da área dos Estados Unidos, valia quatro vezes mais. Os cafés da Ginza serviam café com flocos de ouro; as empresas compravam Van Gogh; os *salarymen* pegavam táxi para casa a 300 dólares porque o último trem já tinha partido.',
          'O imperador Shōwa morreu em janeiro de 1989, depois de 62 anos de reinado, o mais longo da história do país, tendo atravessado a guerra, a ocupação e o milagre como a mesma pessoa. O Nikkei bateu o recorde de 38.915 pontos em 29 de dezembro de 1989, e no dia 4 de janeiro de 1990 começou a cair. Levaria 34 anos para voltar àquele nível.',
        ],
      },
    ],
    noRoteiro: [
      { label: 'Akihabara, do mercado negro à Electric Town', href: '/mais/historia/d19-akihabara' },
      { label: 'Nihonbashi sob a via expressa de 1964', href: '/mais/historia/d02-nihonbashi' },
      { label: 'Shinsekai e a Tsūtenkaku, em Osaka', href: '/roteiro/d2026-11-26#d26-shinsekai' },
      { label: 'Tokyo Tower e a Skytree, a última vista', href: '/roteiro/d2026-12-02#d02-ultima-vista' },
      { label: 'Gachapon, Ikebukuro', href: '/roteiro/d2026-12-01#d01-gachapon-ikebukuro' },
    ],
  },
  // ───────────────────────────────────────────────────────────────────
  {
    id: 'hoje',
    years: '1989–hoje',
    title: 'Heisei e Reiwa: o Japão que vocês vão ver',
    jp: '平成 · 令和',
    lead: 'A bolha estourou e nunca voltou. O que ficou é um país estável, envelhecido, limpo, seguro, e de repente cheio de turistas; um lugar de 1.300 anos ao lado de um konbini aberto 24 horas.',
    sections: [
      {
        title: 'As décadas perdidas',
        paragraphs: [
          'A bolha estourou em 1990–91 e o Japão entrou no que se chamou "a década perdida", depois "as décadas perdidas": os bancos ficaram com créditos podres que fingiram não ver por dez anos, os preços dos imóveis caíram 70% em Tóquio, o emprego vitalício acabou para os jovens (que viraram *freeters*, temporários, e *hikikomori*, reclusos), e o país entrou numa deflação suave que durou 25 anos: os salários de 2019 eram os mesmos de 1995. Não houve colapso; houve estagnação com conforto. O Japão continuou rico, seguro e limpo, mas parou de crescer, e o mundo parou de olhar. A China o ultrapassou como segunda economia em 2010.',
          'A era Heisei (1989–2019) foi marcada por três desastres. O terremoto de **Kobe**, em janeiro de 1995, matou 6.400 pessoas e mostrou que o governo era lento; dois meses depois a seita Aum Shinrikyō soltou gás sarin no metrô de Tóquio na hora do rush, matando 13 e ferindo 6.000, e o país descobriu que seus jovens mais educados podiam virar terroristas religiosos. E em **11 de março de 2011** o maior terremoto da história do Japão, de magnitude 9, no mar diante de Sendai, gerou um tsunami de 15 metros que matou 18.000 pessoas em uma tarde e inundou a usina de Fukushima, provocando o pior acidente nuclear desde Chernobyl, a evacuação de 150.000 pessoas e o fechamento de todas as usinas do país. A imagem que o mundo guardou foi a dos japoneses em fila, sem saque e sem pânico. O Japão vive em cima de placas tectônicas, e o próximo grande terremoto de Tóquio ou de Nankai é uma certeza estatística; o app do celular de vocês vai gritar se acontecer, e é para se afastar do que pode cair.',
        ],
      },
      {
        title: 'O país que envelheceu',
        paragraphs: [
          'A população japonesa começou a cair em 2008, e cai um Sendai por ano: 124 milhões hoje, 87 milhões previstos para 2070. Quase 30% tem mais de 65 anos; nascem 700.000 crianças por ano, metade de 1990; vendem-se mais fraldas geriátricas do que infantis desde 2011. Isso explica muito do que vocês vão ver: as aldeias vazias e as escolas fechadas no interior, os robôs e os tablets nos restaurantes, os taxistas de 75 anos de luvas brancas, os "acompanhantes de estação" que ajudam idosos a subir escadas, o cuidado obsessivo com quem anda devagar, e a discussão eterna sobre imigração, que o país aceita a conta-gotas (os 2 milhões de estrangeiros são 2% da população, e boa parte são vietnamitas e brasileiros de fábrica).',
          'Politicamente, o PLD continua governando, com o intervalo de três anos (2009–12) de um partido de oposição que naufragou em Fukushima. Shinzō Abe, o primeiro-ministro mais longevo (2012–2020), tentou reanimar a economia imprimindo dinheiro e o nacionalismo revendo a história; foi assassinado em 2022, num comício em Nara, perto da estação onde vocês descem, por um homem cuja mãe tinha sido arruinada pela Igreja da Unificação, que tinha laços com o partido. O iene, que valia 80 por dólar em 2011, chegou a 160 em 2024, e é por isso que a viagem de vocês está barata: o Japão está em promoção para o mundo, pela primeira vez desde os anos 1970.',
        ],
      },
      {
        title: 'Reiwa e o turismo',
        paragraphs: [
          'Em 30 de abril de 2019 o imperador Akihito abdicou, o que não acontecia havia 202 anos, alegando a idade; o filho, Naruhito, inaugurou a era **Reiwa**, "bela harmonia", o primeiro nome de era tirado de um poema japonês (o Man\'yōshū) em vez de um clássico chinês. Akihito passou o reinado inteiro pedindo desculpas discretas pela guerra na Ásia e ajoelhando diante de vítimas de desastres, e é respeitado por isso. Naruhito estudou em Oxford a história dos transportes no rio Tâmisa e é casado com uma diplomata de Harvard que sofreu vinte anos de depressão com a pressão de produzir um herdeiro homem; a filha deles não pode herdar o trono, e a dinastia mais antiga do mundo tem um herdeiro de 19 anos e nenhum plano B.',
          'A pandemia fechou o país por dois anos e meio, o mais longo fechamento de qualquer país rico; as Olimpíadas de 2021 foram realizadas sem público. Quando reabriu, em outubro de 2022, com o iene mais fraco em 30 anos, o turismo explodiu: 25 milhões de visitantes em 2023, 37 milhões em 2024, mais que o dobro de 2019, e a palavra do ano virou *overtourism*. Kyoto em novembro é o pico disso: os ônibus lotados, a Sannenzaka intransitável às 11h, as gueixas de Gion perseguidas por fotógrafos até a cidade fechar as vielas privadas, as placas em quatro línguas pedindo para não comer andando. É contra isso que o roteiro é montado: Kiyomizu às 6h, Tōfuku-ji na abertura, Fushimi Inari às 15h30 quando as excursões descem, Nara antes das 9h. Quem chega cedo tem o Japão de sempre; quem chega às 11h tem a fila.',
        ],
      },
      {
        title: 'O que não mudou',
        paragraphs: [
          'O trem sai na hora, e se atrasar cinco minutos a companhia distribui atestados para o chefe. Ninguém fala ao telefone no vagão. O troco vem certo, contado em voz alta, e a nota de 10.000 ienes é aceita em qualquer barraca. A carteira perdida volta com o dinheiro dentro; em Tóquio, 3 bilhões de ienes em dinheiro perdido são entregues à polícia por ano, e três quartos voltam ao dono. O crime é tão raro que o noticiário cobre furto de bicicleta. As ruas não têm lixeiras e não têm lixo. A privada aquece, lava e toca música. A pessoa do balcão se curva quando você sai, e a do trem se curva ao entrar no vagão. Um lugar de 1.300 anos fica ao lado de uma loja de conveniência aberta 24 horas que vende ovo cozido, camisa branca e ingressos para o museu, e ninguém acha estranho. O Japão é um país que passou por tudo isto que está nos onze capítulos e decidiu, a cada vez, guardar o que servia e reconstruir o resto. As duas coisas, a loja e o templo, são o mesmo país, e é isso que vocês vão ver.',
        ],
      },
    ],
    noRoteiro: [
      { label: 'Shibuya à noite, o Japão de agora', href: '/lugar/shibuya' },
      { label: 'Os quatro 7-Elevens do roteiro', href: '/mais/konbini' },
      { label: 'Os horários cedo, e por quê', href: '/roteiro/d2026-11-28' },
    ],
  },
];
