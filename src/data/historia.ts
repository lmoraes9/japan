/**
 * História para ler antes e durante a viagem: o Japão em capítulos, cada
 * cidade do roteiro, os lugares principais e alguns temas transversais.
 * Tudo escrito para contextualizar o que vocês vão ver, não para ser completo.
 */

export interface Chapter {
  id: string;
  /** '710–794' */
  years?: string;
  title: string;
  jp?: string;
  /** frase de abertura */
  lead: string;
  paragraphs: string[];
  /** onde isto aparece no roteiro */
  noRoteiro?: { label: string; href: string }[];
}

export interface CityHistory {
  id: string;
  name: string;
  jp: string;
  lead: string;
  paragraphs: string[];
  dayIds: string[];
}

export interface PlaceHistory {
  title: string;
  jp?: string;
  paragraphs: string[];
}

// ─────────────────────────────────────────────────────────────────────────
// O Japão em capítulos
// ─────────────────────────────────────────────────────────────────────────

export const JAPAN_CHAPTERS: Chapter[] = [
  {
    id: 'origens',
    years: 'até 710',
    title: 'Antes de haver Japão',
    jp: '縄文 · 弥生 · 古墳',
    lead: 'Um arquipélago isolado, o arroz que chegou tarde, os deuses que estavam nas coisas.',
    paragraphs: [
      'O Japão foi povoado há uns 35.000 anos, quando ainda estava ligado ao continente por pontes de terra. Quando o mar subiu e o isolou, ficou uma cultura de caçadores e pescadores que fez **a cerâmica mais antiga do mundo**, a do período Jōmon (10.000–300 a.C.), decorada com cordas prensadas no barro. Eram sedentários sem agricultura, coisa rara: o mar e as florestas davam comida suficiente.',
      'O arroz irrigado chegou da Coreia por volta de 300 a.C., com o bronze e o ferro, e mudou tudo: a agricultura exige organização, e organização produz chefes, aldeias muradas, guerra e desigualdade. É o período Yayoi. Os chineses da dinastia Han já registram "o país de Wa", governado, no século III, por uma rainha-xamã chamada **Himiko**, que ninguém sabe onde viveu (Nara ou Kyūshū, a briga continua).',
      'Entre 250 e 600, os chefes da planície de Nara se enterraram em montes de terra em forma de fechadura, os *kofun*, alguns maiores que as pirâmides em área. Um desses clãs, o de Yamato, venceu os outros e seus chefes viraram "grandes reis"; os descendentes deles são a família imperial de hoje, **a dinastia mais antiga do mundo em atividade**. O mito diz que o primeiro imperador, Jinmu, subiu ao trono em 660 a.C.; a arqueologia diz século IV.',
      'A religião dessa gente não tinha nome: eram os *kami*, presenças nas montanhas, nas árvores enormes, nas cachoeiras, nos antepassados. Quando o budismo chegou, no século VI, foi preciso dar um nome ao que já existia: **Shintō**, "o caminho dos deuses". Os santuários mais antigos que vocês vão ver (Sumiyoshi, Kasuga, Itsukushima) descendem dessa camada, de antes de qualquer influência chinesa.',
    ],
    noRoteiro: [
      { label: 'Sumiyoshi Taisha, o estilo de antes do budismo', href: '/lugar/sumiyoshi' },
      { label: 'Kasuga Taisha, em Nara', href: '/lugar/nara' },
    ],
  },
  {
    id: 'nara',
    years: '538–794',
    title: 'O budismo chega e Nara vira capital',
    jp: '飛鳥 · 奈良時代',
    lead: 'O Japão copia a China de propósito, e o Grande Buda é a prova de que deu certo.',
    paragraphs: [
      'Em 538 (ou 552), o rei do reino coreano de Baekje mandou ao imperador do Japão uma estátua de Buda e sutras, com uma carta dizendo que era a melhor doutrina que existia. O clã Soga adotou; o clã Mononobe resistiu; os Soga venceram na guerra e o budismo virou religião de Estado. Com ele veio o pacote inteiro da civilização chinesa: **a escrita, o calendário, a arquitetura, a burocracia, a ideia de um Estado com leis**. O príncipe Shōtoku (574–622) escreveu uma "constituição" de 17 artigos que era mais um sermão confucionista, e fundou o Shitennō-ji, em Osaka, o templo mais antigo do país.',
      'Em 710 a corte se instalou numa capital nova, **Heijō-kyō, a atual Nara**, desenhada em grade como Chang\'an, a capital dos Tang. Foi o auge da imitação: roupas, música, comida e etiqueta chinesas. E foi um século de epidemias e revoltas, que o imperador Shōmu decidiu combater com fé: em 743 mandou fundir **a maior estátua de bronze do mundo**, o Grande Buda de Tōdai-ji, e construir o maior prédio de madeira para abrigá-la. O projeto quase quebrou o país (usou quase todo o cobre disponível e o ouro descoberto no norte) e é o que vocês vão ver em Nara, reconstruído.',
      'O problema de Nara foram os monges. Os grandes templos ganharam terras, exércitos e influência; um monge, Dōkyō, quase virou imperador com o apoio de uma imperatriz. Foi para escapar disso que o imperador Kanmu mudou a capital, em 794, para um vale a 40 km ao norte, e deixou os templos para trás. Nara nunca mais foi capital, e por isso sobreviveu: ninguém a destruiu para reconstruir.',
    ],
    noRoteiro: [
      { label: 'Tōdai-ji e o Grande Buda', href: '/roteiro/d2026-11-30#d30-todaiji' },
      { label: 'Shitennō-ji, em Osaka', href: '/roteiro/d2026-11-26#d26-shitennoji' },
      { label: 'Kōfuku-ji, o templo do clã Fujiwara', href: '/roteiro/d2026-11-30#d30-kofukuji' },
    ],
  },
  {
    id: 'heian',
    years: '794–1185',
    title: 'Heian: quatro séculos de corte em Kyoto',
    jp: '平安時代',
    lead: 'A capital da paz, onde se inventou o japonês escrito, o primeiro romance do mundo e o gosto pela impermanência.',
    paragraphs: [
      'Heian-kyō, "capital da paz e tranquilidade", é a Kyoto de hoje. Durante quase 400 anos a corte viveu ali um mundo fechado de uns poucos milhares de aristocratas, numa cultura de refinamento que não tem igual: os homens escreviam em chinês clássico, mas as mulheres, proibidas de aprender chinês, escreveram em japonês com um silabário novo, o *kana*, e produziram a melhor literatura da época. **Murasaki Shikibu** escreveu por volta de 1008 o *Genji Monogatari*, "A História de Genji", considerado o primeiro romance do mundo; **Sei Shōnagon** escreveu o *Livro do Travesseiro*, uma lista de coisas elegantes, irritantes e comoventes que se lê hoje como um blog.',
      'A estética dessa corte é a estética que vocês vão encontrar em cada templo: **mono no aware**, a comoção diante do que passa. As cerejeiras são bonitas porque caem em uma semana; os bordos, porque ficam vermelhos e somem. O outono em Kyoto é uma festa dessa ideia, e o calendário da corte era todo de festivais de estação.',
      'Politicamente, o imperador virou um cargo cerimonial cedo. Quem mandava era o clã **Fujiwara**, que casava suas filhas com os imperadores e governava como regente dos netos. Os Fujiwara fundaram o Kōfuku-ji e o Kasuga Taisha de Nara, que vocês vão ver. Enquanto a corte compunha poemas, nas províncias os proprietários de terra armavam homens para defender suas propriedades. Esses homens eram os **samurais**, "os que servem". No fim do período, dois clãs de guerreiros, Taira e Minamoto, disputaram o controle da corte numa guerra de cinco anos, a Genpei, e o vencedor, Minamoto no Yoritomo, não quis morar em Kyoto.',
      'O Fushimi Inari foi fundado em 711 e o Kiyomizu-dera em 778, mas o que existe de Heian em Kyoto é sobretudo o traçado das ruas: a grade da capital chinesa, reta e numerada, que ainda organiza a cidade. Quase todos os prédios queimaram e foram refeitos.',
    ],
    noRoteiro: [
      { label: 'Fushimi Inari, fundado em 711', href: '/lugar/fushimi-inari' },
      { label: 'Kiyomizu-dera, de 778', href: '/roteiro/d2026-11-28#d28-kiyomizu' },
      { label: 'Sanjūsangen-dō, as mil estátuas de 1164', href: '/roteiro/d2026-12-01#d01-sanjusangendo' },
    ],
  },
  {
    id: 'kamakura',
    years: '1185–1333',
    title: 'Kamakura: os samurais tomam o poder',
    jp: '鎌倉時代',
    lead: 'O primeiro xogunato, o zen, o Grande Buda e os mongóis que o vento afundou.',
    paragraphs: [
      'Minamoto no Yoritomo venceu os Taira em 1185 e fez uma coisa nova: em vez de tomar o lugar do imperador, montou um governo paralelo de guerreiros em **Kamakura**, uma vila de pescadores protegida por morros e pelo mar, a 400 km da corte. Em 1192 o imperador lhe deu o título de *sei-i tai-shōgun*, "grande general que subjuga os bárbaros", e daí vem a palavra **xogum**. O arranjo durou quase 700 anos: o imperador reina em Kyoto, o xogum governa de onde estiver o exército.',
      'O governo de Kamakura era pobre e austero, e adotou uma religião que combinava com isso: o **zen**, trazido da China pelos monges Eisai (1191) e Dōgen. Meditação, disciplina, poucos adornos. O Kenchō-ji, que vocês visitam, foi o primeiro mosteiro zen construído como tal no Japão, em 1253, com um abade chinês. O Engaku-ji, de 1282, foi fundado para rezar pelos mortos dos dois lados da invasão mongol.',
      'Porque foi nessa época que **Kublai Khan** tentou invadir o Japão, em 1274 e 1281, com as maiores frotas que o mundo tinha visto. Nas duas vezes um tufão destruiu a frota mongol na baía de Hakata. Os japoneses chamaram isso de *kamikaze*, "vento divino", e a ideia de que o país é protegido pelos deuses ficou até 1945, quando deu o nome aos pilotos suicidas.',
      'O Grande Buda de Kamakura foi fundido por volta de 1252, dentro de um salão; o salão foi levado por tsunamis (o último em 1498) e a estátua ficou ao ar livre desde então, o que é o motivo de ser tão bonita. O xogunato de Kamakura acabou em 1333, quando um imperador tentou retomar o poder e um general traiu o regime. Durou pouco: outro general, Ashikaga Takauji, virou xogum e voltou o governo para Kyoto.',
    ],
    noRoteiro: [
      { label: 'Kamakura, o dia inteiro', href: '/lugar/kamakura' },
      { label: 'Kenchō-ji, o primeiro mosteiro zen', href: '/roteiro/d2026-11-20#d20-kenchoji' },
      { label: 'O Grande Buda', href: '/roteiro/d2026-11-20#d20-daibutsu' },
    ],
  },
  {
    id: 'muromachi',
    years: '1336–1573',
    title: 'Muromachi: o ouro, a prata e a guerra de todos contra todos',
    jp: '室町時代',
    lead: 'Os Ashikaga inventaram a cultura japonesa que vocês conhecem, e depois perderam o país.',
    paragraphs: [
      'Os xoguns Ashikaga governaram de Kyoto, de um palácio no bairro de Muromachi, e gostavam da vida da corte. O terceiro, **Yoshimitsu**, construiu em 1397 o **Pavilhão Dourado** como villa de aposentadoria; o oitavo, Yoshimasa, construiu em 1482 o **Pavilhão de Prata**, que nunca ganhou prata porque a guerra estourou. Entre um e outro, quase tudo que hoje se chama "cultura japonesa tradicional" ganhou forma: **a cerimônia do chá, o teatro Nō, o ikebana, os jardins de pedra, a arquitetura de tatame e portas de correr**. Muito disso nasceu no círculo de Yoshimasa, no Ginkaku-ji, enquanto a cidade queimava em volta.',
      'Porque a **Guerra Ōnin** (1467–1477), uma briga de sucessão, destruiu Kyoto quase inteira e desencadeou um século de guerra civil, o **Sengoku**, "os Estados em guerra". O xogum virou um figurante; cada província tinha um senhor, o *daimyō*, com um castelo e um exército, e todos lutavam com todos. O Ryōan-ji, com seu jardim de 15 pedras, foi construído em 1450 e queimado em 1467; o jardim é do que sobrou.',
      'Foi nesse caos que os portugueses chegaram, em **1543**, numa ilha ao sul, trazendo o arcabuz. Os daimyō adotaram a arma em dez anos e mudaram a guerra. Chegou também **Francisco Xavier**, em 1549, e o cristianismo; por volta de 1600 havia 300.000 cristãos no Japão. Os "bárbaros do sul" deixaram palavras (*pan* de pão, *tempura* de "têmporas", *botan* de botão), a tempura e a ideia de que existia um mundo para além da China.',
    ],
    noRoteiro: [
      { label: 'Kinkaku-ji e Ryōan-ji', href: '/lugar/kinkakuji' },
      { label: 'Ginkaku-ji, o Pavilhão de Prata', href: '/roteiro/d2026-11-28#d28-ginkakuji' },
    ],
  },
  {
    id: 'unificacao',
    years: '1573–1615',
    title: 'Os três unificadores',
    jp: '安土桃山時代',
    lead: 'Nobunaga destruiu, Hideyoshi construiu, Ieyasu ficou com tudo. Metade dos castelos e templos que vocês vão ver é dessa geração.',
    paragraphs: [
      'Há um poema japonês que resume os três: diante de um cuco que não canta, **Oda Nobunaga** diz "mate-o"; **Toyotomi Hideyoshi** diz "faça-o cantar"; **Tokugawa Ieyasu** diz "espere". Nobunaga, um daimyō pequeno de Nagoya, venceu exércitos dez vezes maiores com arcabuzes e brutalidade (queimou o monte Hiei com seus 3.000 monges em 1571), tomou Kyoto e estava a caminho de unificar o país quando um general traidor o cercou num templo, em 1582, e ele cometeu suicídio.',
      'Hideyoshi era filho de camponês e tinha começado como carregador de sandálias de Nobunaga. Em treze anos vingou o chefe, submeteu todos os daimyō e unificou o Japão pela primeira vez em 120 anos. Construiu o **Castelo de Osaka** (1583) para ser o maior do país; ordenou o **Rōmon do Fushimi Inari** (1589) em agradecimento pela cura da mãe; fez o censo, fixou os camponeses na terra e confiscou as armas deles na "caçada às espadas", criando as castas que durariam 300 anos. Também mandou executar 26 cristãos em Nagasaki e invadiu a Coreia duas vezes, sem sucesso. Morreu em 1598 com um filho de cinco anos.',
      'Ieyasu, o aliado mais paciente, esperou. Em 1600 venceu a batalha de **Sekigahara**, a maior da história japonesa, e em 1603 virou xogum. Em 1614–15 cercou Osaka, aterrou os fossos numa trégua desonesta e destruiu os Toyotomi. O filho de Hideyoshi e a mãe, Yodo-dono, se mataram no castelo em chamas. Começaram 250 anos de paz. O **Castelo de Himeji**, na sua forma atual, é de 1609, construído por um genro de Ieyasu para vigiar os daimyō do oeste: é o castelo mais bem preservado do país porque nunca foi atacado.',
    ],
    noRoteiro: [
      { label: 'Castelo de Osaka', href: '/lugar/castelo-osaka' },
      { label: 'Castelo de Himeji', href: '/lugar/himeji' },
      { label: 'Kōdai-ji, construído pela viúva de Hideyoshi', href: '/roteiro/d2026-11-28#d28-kodaiji' },
      { label: 'Sanmon de Nanzen-ji, de 1628', href: '/roteiro/d2026-11-28#d28-nanzenji' },
    ],
  },
  {
    id: 'edo',
    years: '1603–1868',
    title: 'Edo: o país fechado e a cidade de um milhão',
    jp: '江戸時代',
    lead: 'Dois séculos e meio sem guerra, sem estrangeiros e sem mudança, e a cultura popular que nasceu disso.',
    paragraphs: [
      'Os Tokugawa organizaram o Japão para que nada mudasse. Cada daimyō tinha de passar metade do tempo em **Edo**, a capital do xogum, e deixar a família lá como refém (o sistema *sankin-kōtai*); a viagem anual de ida e volta, com centenas de servos, esvaziava os cofres e enchia as estradas de estalagens. A sociedade foi congelada em quatro castas: samurais, camponeses, artesãos, mercadores, nessa ordem de prestígio, e na ordem inversa de dinheiro.',
      'Em 1639 o país foi fechado: o cristianismo proibido a ferro e fogo, os japoneses proibidos de sair, os estrangeiros proibidos de entrar, exceto os holandeses e chineses numa ilhota artificial em Nagasaki. Foi o **sakoku**, 215 anos de isolamento. E funcionou: sem guerra e sem fronteira, Edo cresceu até ser, por volta de 1720, **a maior cidade do mundo**, com um milhão de habitantes, enquanto Londres tinha 600 mil.',
      'Os samurais, sem guerra, viraram burocratas endividados. Os mercadores, que oficialmente não valiam nada, ficaram ricos, e como não podiam comprar status compraram prazer: o teatro **kabuki**, os bairros de prazer de Yoshiwara e Gion, as estampas **ukiyo-e** de Hokusai e Hiroshige, o sushi de Edo (o *nigiri* foi inventado como comida de rua por volta de 1820), o soba, a tempura, o haikai de Bashō. Osaka virou "a cozinha do país", Kurashiki enriqueceu com arroz e algodão sob controle direto do xogum.',
      'Edo era uma cidade de madeira que pegava fogo tanto que os incêndios ganharam apelido, "as flores de Edo". Por isso quase nada dela sobrou de pé: o que vocês verão em Tóquio são traçados de rua, nomes de bairro e prédios refeitos onde estavam. Em Kyoto e Nara, ao contrário, o período Edo foi de reconstrução: a maior parte dos templos que vocês vão ver foi refeita nesses séculos.',
    ],
    noRoteiro: [
      { label: 'Jardim Leste do Palácio Imperial, o antigo Castelo de Edo', href: '/roteiro/d2026-12-02#d02-jardim-imperial' },
      { label: 'Kurashiki, os armazéns do xogum', href: '/lugar/kurashiki' },
      { label: 'Gion, o bairro das gueixas', href: '/roteiro/d2026-11-28#d28-gion' },
      { label: 'Nihonbashi, o quilômetro zero de Edo', href: '/roteiro/d2026-12-02#d02-nihonbashi' },
    ],
  },
  {
    id: 'meiji',
    years: '1853–1912',
    title: 'Os navios negros e a Restauração Meiji',
    jp: '幕末 · 明治時代',
    lead: 'Em 40 anos o Japão saiu da Idade Média e derrotou a Rússia. O preço foi um país que se achava invencível.',
    paragraphs: [
      'Em julho de **1853** quatro navios de guerra americanos entraram na baía de Edo soltando fumaça preta e disparando canhões de saudação. O comodoro **Perry** trazia uma carta exigindo a abertura dos portos e disse que voltaria no ano seguinte com uma frota maior. O xogunato, que não tinha como resistir, cedeu, e isso destruiu sua legitimidade: se o xogum não sabia "subjugar os bárbaros", para que servia? Quinze anos de agitação, assassinatos e guerra civil terminaram em 1868 com a **Restauração Meiji**: o último xogum devolveu o poder ao imperador de 16 anos, que se mudou de Kyoto para Edo, rebatizada **Tōkyō**, "capital do leste".',
      'O que veio depois não tem paralelo. O governo Meiji mandou missões ao mundo inteiro copiar o melhor de cada país: a marinha da Inglaterra, o exército da Prússia, o direito da França, a escola dos Estados Unidos. Aboliu as castas e os domínios feudais, proibiu os samurais de portar espada (a última revolta deles foi esmagada em 1877), construiu ferrovias, fábricas, universidades e um parlamento. Adotou o calendário ocidental, a carne bovina, o terno e a valsa. Em 1895 derrotou a China; em **1905**, a Rússia, a primeira vitória de um país asiático sobre uma potência europeia. Tóquio de repente era uma capital mundial.',
      'O Shintō foi separado do budismo à força (o *shinbutsu bunri* de 1868), e milhares de estátuas budistas foram destruídas nos santuários; é por isso que hoje templo e santuário são coisas visivelmente diferentes. O imperador virou um deus vivo, descendente da deusa do Sol, e essa ideologia sustentou o Estado até 1945. O **Meiji Jingū**, construído em 1920 para o imperador morto, é o monumento dessa era: uma floresta plantada por 100.000 voluntários em volta de um santuário de cipreste sem pintura.',
    ],
    noRoteiro: [
      { label: 'Meiji Jingū', href: '/lugar/meiji-jingu' },
      { label: 'Museu Nacional de Tóquio, de 1872', href: '/roteiro/d2026-11-19#d19-museu-nacional' },
      { label: 'Museu Ōhara, em Kurashiki, o primeiro de arte ocidental', href: '/roteiro/d2026-11-25#d25-ohara' },
    ],
  },
  {
    id: 'guerra',
    years: '1912–1945',
    title: 'Taishō, Shōwa e a catástrofe',
    jp: '大正 · 昭和前期',
    lead: 'Uma democracia curta, o terremoto que apagou Tóquio, o militarismo e as duas bombas.',
    paragraphs: [
      'Os anos 1910 e 1920 foram a "democracia Taishō": partidos, sindicatos, cinema, jazz, as *moga* (modern girls) de cabelo curto na Ginza. O terremoto de **1º de setembro de 1923** matou 140.000 pessoas em Tóquio e Yokohama, quase todas nos incêndios, e a cidade reconstruída foi outra: mais larga, de concreto, moderna. Muitos dos "monumentos antigos" de Tóquio são reconstruções de 1930.',
      'A crise de 1929 quebrou o Japão rural, e os militares, que respondiam só ao imperador, foram tomando o governo por assassinatos e faits accomplis: a Manchúria em 1931, a China em 1937 (com o massacre de Nanquim), o pacto com Hitler, e em **7 de dezembro de 1941** Pearl Harbor. Quatro anos depois, o país tinha 3 milhões de mortos, 66 cidades bombardeadas com bombas incendiárias (o ataque a Tóquio de 10 de março de 1945 matou 100.000 pessoas numa noite, mais que Hiroshima no dia) e, em **6 e 9 de agosto**, Hiroshima e Nagasaki.',
      'Kyoto estava na lista de alvos da bomba atômica, e era o alvo preferido dos militares americanos por ser grande e intacta. Foi riscada pelo secretário de Guerra Henry Stimson, que conhecera a cidade em lua de mel. Nara e Kamakura também escaparam dos bombardeios. É por isso que existem 1.600 templos de pé em Kyoto e nenhum prédio de antes de 1945 no centro de Hiroshima, exceto a ruína do Domo.',
      'Em 15 de agosto de 1945 o imperador falou pelo rádio pela primeira vez, numa língua de corte que quase ninguém entendeu, anunciando a rendição. A ocupação americana (1945–52) escreveu uma constituição pacifista, deu o voto às mulheres, desmontou os grandes conglomerados e fez a reforma agrária. O imperador renunciou à divindade num discurso de Ano Novo de 1946.',
    ],
    noRoteiro: [
      { label: 'Parque da Paz e o Domo', href: '/lugar/parque-da-paz' },
      { label: 'Museu Memorial da Paz', href: '/roteiro/d2026-11-23#d23-museu-paz' },
    ],
  },
  {
    id: 'milagre',
    years: '1945–1989',
    title: 'O milagre econômico',
    jp: '戦後 · 高度経済成長',
    lead: 'De país arrasado a segunda economia do mundo em 25 anos, com trem-bala, Godzilla e Sony.',
    paragraphs: [
      'A Guerra da Coreia (1950) virou encomenda para as fábricas japonesas, e daí em diante o país cresceu 10% ao ano por duas décadas. Os **Jogos Olímpicos de Tóquio de 1964** foram a festa de reapresentação ao mundo, e o **Shinkansen**, inaugurado nove dias antes, o símbolo: 210 km/h entre Tóquio e Osaka, quando o trem mais rápido da Europa fazia 160. A Tokyo Tower é de 1958; o Castelo de Osaka de concreto, de 1931, sobreviveu à guerra; o de Hiroshima foi refeito em 1958.',
      'Foi a época das grandes marcas (Sony, Honda, Toyota, Nintendo, que fazia baralhos), do *salaryman* de terno cinza, dos subúrbios, e da cultura pop que iria conquistar o mundo: **Godzilla** (1954, um monstro acordado por testes nucleares), o mangá de Osamu Tezuka, o anime, e a partir dos anos 1980 os videogames. O Japão dos anos 80 se achava o futuro: comprava o Rockefeller Center, tinha as dez maiores empresas do mundo em valor de mercado, e o terreno do Palácio Imperial valia, no papel, mais que toda a Califórnia.',
    ],
    noRoteiro: [
      { label: 'Akihabara', href: '/roteiro/d2026-11-19#d19-akihabara' },
      { label: 'Torre Tsūtenkaku e Shinsekai, em Osaka', href: '/roteiro/d2026-11-26#d26-shinsekai' },
    ],
  },
  {
    id: 'hoje',
    years: '1989–hoje',
    title: 'Heisei e Reiwa: o Japão que vocês vão ver',
    jp: '平成 · 令和',
    lead: 'A bolha estourou em 1991 e nunca voltou. O que ficou é um país estável, envelhecido, limpo, e de repente cheio de turistas.',
    paragraphs: [
      'A bolha imobiliária estourou em 1991 e o Japão entrou nas "décadas perdidas": crescimento zero, deflação, salários parados. O terremoto de Kobe (1995), o atentado com gás sarin no metrô de Tóquio (1995, pela seita Aum) e o terremoto e tsunami de **11 de março de 2011**, com o desastre de Fukushima, marcaram a era Heisei. A população começou a cair em 2008; hoje quase 30% do país tem mais de 65 anos, e é isso que explica as vilas vazias, os robôs em restaurante e o cuidado com quem anda devagar.',
      'Em 2019 o imperador Akihito abdicou, coisa que não acontecia havia 200 anos, e o filho Naruhito inaugurou a era **Reiwa**, "bela harmonia". A pandemia fechou o país por dois anos e meio; quando reabriu, em 2022, com o iene mais fraco em 30 anos, o turismo explodiu: 37 milhões de visitantes em 2024, o dobro de 2019. Kyoto em novembro é o pico disso. Os horários cedo do roteiro (Kiyomizu às 6h, Tōfuku-ji na abertura, Fushimi Inari às 15h30 quando todos descem) são a resposta.',
      'O que não mudou: o trem sai na hora, ninguém fala ao telefone no vagão, o troco vem certo, a chave do quarto pode ficar na porta, e um lugar de 1.300 anos fica ao lado de uma loja de conveniência aberta 24 horas. As duas coisas são o mesmo país.',
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Temas transversais
// ─────────────────────────────────────────────────────────────────────────

export const THEMES: Chapter[] = [
  {
    id: 'templo-santuario',
    title: 'Templo ou santuário? Como saber onde vocês estão',
    jp: '寺 · 神社',
    lead: 'Torii é santuário e é Shintō; portão de madeira com estátuas de guarda é templo e é budista. O resto segue disso.',
    paragraphs: [
      'O Japão tem duas religiões ao mesmo tempo, e a maioria das pessoas pratica as duas sem sentir contradição: **nasce Shintō, casa Shintō (ou cristão, pela estética) e morre budista**. O Shintō cuida da vida, da fertilidade, das colheitas, da sorte; o budismo cuida da morte, dos ancestrais, da salvação. Um *jinja* (santuário) tem torii, cordas de palha com papéis em zigue-zague, raposas ou cães de guarda, e se pede sorte batendo palmas duas vezes. Um *tera* ou *-ji* (templo) tem portão com dois guardiões de cara feia, incenso, estátuas de Buda e bodisatvas, sino, e se reza em silêncio com as mãos juntas.',
      'Até 1868 os dois estavam misturados: quase todo santuário tinha um templo dentro, e vice-versa. A separação forçada da era Meiji destruiu muita coisa, mas a mistura sobrevive nos detalhes: o pagode de cinco andares do Itsukushima é budista num santuário Shintō; o Fushimi Inari tem altares budistas na montanha; a raposa de Inari é Shintō, mas Inari também é uma divindade budista.',
      'Etiqueta mínima: no santuário, curve-se de leve antes de passar o torii e ande pelo lado do caminho (o meio é dos deuses); lave as mãos na bacia (esquerda, direita, boca com a mão, cabo); jogue uma moeda, curve-se duas vezes, bata palmas duas vezes, peça, curve-se uma vez. No templo, não bata palmas. Fotos são bem-vindas no pátio e quase sempre proibidas dentro dos salões.',
    ],
  },
  {
    id: 'samurai',
    title: 'Samurais, xoguns e daimyō',
    jp: '武士 · 将軍 · 大名',
    lead: 'Quem era quem nos 700 anos de governo militar, sem o cinema.',
    paragraphs: [
      'O **samurai** ("o que serve") era um guerreiro a serviço de um senhor, com direito a portar duas espadas e a matar um plebeu por desrespeito. O **daimyō** ("grande nome") era o senhor de uma província, com castelo e exército próprios. O **xogum** era o daimyō mais forte, que governava o país em nome do imperador, e o **imperador** reinava sem governar, de Kyoto, desde o século XII até 1868.',
      'O *bushidō*, "caminho do guerreiro", como código escrito, é em grande parte uma invenção do período Edo (quando já não havia guerra) e da era Meiji (quando o Estado precisava de soldados leais). O samurai real do Sengoku trocava de lado, negociava e sobrevivia. O suicídio ritual, o *seppuku*, era real, mas era um privilégio de classe: o direito de morrer com honra em vez de ser executado.',
      'Com a paz Tokugawa, os samurais viraram funcionários públicos com espada. Eram 7% da população, pagos em arroz, endividados com os mercadores, e muitos viveram do ensino, da caligrafia e da administração. Em 1876 foram proibidos de portar espada e em 1877 a última revolta deles foi esmagada por um exército de camponeses recrutados com fuzis. Os castelos que vocês vão ver, Himeji e Osaka, são de uma geração de 30 anos (1580–1615) em que se construíram mais de cem; quase todos foram demolidos pelo governo Meiji como símbolo feudal. Sobraram doze originais; Himeji é o maior.',
    ],
  },
  {
    id: 'zen-jardins',
    title: 'Zen, chá e o jardim de pedras',
    jp: '禅 · 茶 · 枯山水',
    lead: 'Por que um retângulo de cascalho com quinze pedras é uma das obras de arte mais famosas do mundo.',
    paragraphs: [
      'O zen chegou da China no século XII e foi a religião dos samurais porque não pedia estudo nem ritual, só disciplina: sentar em silêncio, esvaziar a mente, aceitar. Os mosteiros zen de Kyoto e Kamakura viraram centros de cultura chinesa (pintura a nanquim, poesia, arquitetura) e desse círculo saiu o **jardim seco**, *karesansui*: pedras e cascalho representando montanhas e água, ou representando nada, para olhar sentado na varanda.',
      'O de **Ryōan-ji** (c. 1500) é o exemplo absoluto: 15 pedras em 5 grupos, num retângulo de 25 por 10 metros, sem uma árvore. De nenhum ponto da varanda se veem as 15 ao mesmo tempo. Ninguém sabe quem o fez nem o que significa, e essa é a graça. O do Hōjō de **Tōfuku-ji** (1939) é a versão moderna: Mirei Shigemori usou pedras de fundação de prédios demolidos e fez um jardim de xadrez de musgo. Os dois estão no roteiro, com dois dias de intervalo.',
      'A **cerimônia do chá** vem do mesmo mundo: o chá em pó (*matcha*) era remédio de monge, virou passatempo de samurai e, com Sen no Rikyū (1522–1591), virou uma arte de simplicidade extrema, na casa de chá de dois tatames com entrada baixa que obriga todos, inclusive o daimyō, a entrar de joelhos. Rikyū era mestre de chá de Hideyoshi, que o obrigou a cometer seppuku em 1591, ninguém sabe bem por quê. A viúva de Hideyoshi construiu o Kōdai-ji com casas de chá desenhadas por Rikyū; o Ōkōchi Sansō, em Arashiyama, serve matcha com o ingresso.',
    ],
  },
  {
    id: 'comida',
    title: 'O que vocês vão comer, e de onde veio',
    jp: '食',
    lead: 'Sushi era fast-food de Edo, ramen é chinês, tempura é português e okonomiyaki é comida de pós-guerra.',
    paragraphs: [
      'O **sushi** nasceu como conserva: peixe fermentado no arroz por meses, o arroz jogado fora. Em Edo, por volta de 1820, um cozinheiro chamado Hanaya Yohei teve a ideia de servir o peixe cru sobre arroz avinagrado, na hora, em barracas de rua: o *nigiri*, "apertado na mão". Era comida rápida e barata; virou cara com a refrigeração e o atum, que até 1960 era peixe de gato. Tsukiji e o mercado externo são o que sobrou do mercado que abasteceu isso por 80 anos.',
      'O **ramen** é chinês: macarrão de trigo com caldo, que os imigrantes chineses vendiam em Yokohama e Asakusa por volta de 1910. Virou comida nacional depois de 1945, com a farinha americana da ajuda humanitária e o ramen instantâneo de 1958. Cada cidade tem o seu: shōyu em Tóquio, tonkotsu em Fukuoka, o caldo de Kyoto mais gorduroso do que parece. O **okonomiyaki** de Hiroshima nasceu da mesma penúria do pós-guerra: farinha, água, repolho, e o que houvesse, em camadas, numa chapa de rua. O de Osaka mistura tudo na massa; o de Hiroshima empilha, com macarrão no meio, e a cidade leva a diferença a sério.',
      'A **tempura** veio dos portugueses do século XVI (que fritavam peixe nas "têmporas", os dias de jejum de carne), o *tonkatsu* é a costeleta à milanesa adotada na era Meiji, o **curry** é indiano via marinha britânica, e o *kakinoha-zushi* de Nara é o sushi antigo, prensado e embrulhado em folha de caqui, de antes da invenção do nigiri. O **saquê** de Fushimi, no dia 27, é famoso por causa da água: o bairro fica sobre um aquífero, e as cervejarias estão ali desde o século XVII.',
    ],
  },
  {
    id: 'pop',
    title: 'Manga, anime, gachapon: a cultura pop e Akihabara',
    jp: 'アキバ · 秋葉原',
    lead: 'De mercado negro de peças de rádio a capital mundial do otaku, em 70 anos.',
    paragraphs: [
      'Akihabara era um terreno baldio criado por um incêndio em 1869 (o santuário do "deus do fogo", Akiba, deu o nome). Depois de 1945 virou mercado negro de peças de rádio debaixo dos trilhos, depois a rua das lojas de eletrônicos ("Electric Town"), e nos anos 1990, quando os computadores baratearam, a rua dos videogames, dos mangás e dos fãs de tudo isso, os **otaku**. O Radio Kaikan, de 1962, foi o primeiro prédio alto do bairro e é o do *Steins;Gate* porque a lenda do bairro se escreve sobre si mesma.',
      'O mangá moderno começa com **Osamu Tezuka** (Astro Boy, 1952), que adaptou a linguagem do cinema para os quadrinhos; o anime, com a série de TV do Astro Boy em 1963. O **Pokémon** (1996) é uma ideia de Satoshi Tajiri, que colecionava insetos na infância nos subúrbios de Tóquio; o **gachapon**, as máquinas de cápsulas, existe desde 1965 e é o motivo de vocês irem a Ikebukuro. Os personagens de tudo isso estão nos trens, nos konbini, nas placas de obra: a cultura pop não é um nicho, é o ambiente.',
    ],
  },
  {
    id: 'trens',
    title: 'Por que o trem funciona',
    jp: '鉄道',
    lead: 'A primeira ferrovia é de 1872, o Shinkansen de 1964, e a pontualidade média é de segundos.',
    paragraphs: [
      'O primeiro trem japonês ligou Tóquio a Yokohama em 1872, com locomotivas inglesas; em 1900 o país já fabricava as suas. A malha ferroviária virou a espinha dorsal das cidades: as grandes empresas de trem (Hankyu, Tōkyū, Kintetsu, Nankai) construíram os subúrbios, as lojas de departamento em cima das estações e os parques de diversão no fim da linha, para vender passagens nos dois sentidos. É por isso que cada estação grande é um shopping.',
      'A JR (Japan Railways) é a antiga estatal, privatizada em 1987 e dividida em regiões: JR East em Tóquio e Kamakura, JR Central no Shinkansen Tōkaidō, JR West em Osaka, Kyoto e Hiroshima. O **Shinkansen** nunca teve um acidente fatal por descarrilamento em 60 anos; o atraso médio anual é de menos de um minuto, incluindo tufões. O Nozomi para em menos estações; o Hikari e o Kodama param em mais, e é por isso que o Nozomi nem sempre serve Himeji. Os assentos são reservados por carro e número, e a fila na plataforma é na marca do chão do seu carro.',
      'A **Suica** (e a Pasmo, e a ICOCA, e a Sugoca) são o mesmo cartão com nomes regionais; qualquer um funciona em qualquer lugar, nos trens, ônibus, bondes, konbini e máquinas de bebida. O bonde de Hiroshima, o Enoden de Kamakura, o Randen de Arashiyama e o Hankai de Osaka são sobreviventes de uma época em que toda cidade tinha bonde.',
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────
// As cidades
// ─────────────────────────────────────────────────────────────────────────

export const CITY_HISTORIES: CityHistory[] = [
  {
    id: 'tokyo',
    name: 'Tóquio',
    jp: '東京',
    lead: 'Edo, a cidade do xogum, destruída e refeita quatro vezes, e ainda organizada pelo castelo que já não existe.',
    dayIds: ['d2026-11-18', 'd2026-11-19', 'd2026-11-21', 'd2026-11-22', 'd2026-12-01', 'd2026-12-02'],
    paragraphs: [
      'Até 1590, Edo era um vilarejo de pescadores num estuário pantanoso, com um castelo abandonado num morro. Naquele ano, Toyotomi Hideyoshi deu as províncias do leste a Tokugawa Ieyasu, em parte para mantê-lo longe. Ieyasu drenou o pântano, desviou rios, cavou um sistema de canais em espiral em volta do castelo e, quando virou xogum em 1603, fez de Edo a capital de facto de um país cujo imperador continuava em Kyoto. Os daimyō foram obrigados a manter residências ali, com suas famílias como reféns, e cada residência era um bairro: os altos, a oeste do castelo (Yamanote, "o lado da mão da montanha"), para os senhores; os baixos, a leste, no aterro (Shitamachi, "a cidade de baixo"), para os artesãos e mercadores. A divisão sobrevive: Ginza, Marunouchi e Shinjuku são Yamanote; Asakusa, Ueno e Kuramae são Shitamachi.',
      'Por volta de 1720 Edo tinha um milhão de habitantes e era a maior cidade do mundo. Era também a mais inflamável: casas de madeira e papel, coladas, e ventos secos de inverno. O incêndio de Meireki, em 1657, matou 100.000 pessoas e destruiu o torreão do castelo, que nunca foi reconstruído; é a base de pedra vazia que vocês vão ver no Jardim Leste. O Sensō-ji, o Nihonbashi (a ponte de onde se mediam todas as distâncias do país) e os bairros de prazer eram os centros da vida popular, e a cultura de Edo (kabuki, ukiyo-e, sushi, soba, as estampas de Hokusai com o Fuji) é a cultura que o mundo chama de japonesa.',
      'Em 1868 o imperador Meiji entrou no Castelo de Edo e a cidade virou Tōkyō. A modernização foi rápida e desigual: a Ginza foi reconstruída em tijolo à europeia em 1872, a primeira ferrovia chegou no mesmo ano, e Marunouchi, os terrenos dos daimyō ao lado do palácio, virou o distrito financeiro. O **terremoto de 1923** apagou tudo isso: 140.000 mortos, a maior parte nos incêndios, Asakusa e Shitamachi inteiros. A cidade foi refeita com ruas largas e concreto. Vinte e dois anos depois, os **bombardeios incendiários de 1945** (o de 10 de março matou 100.000 pessoas numa noite) destruíram de novo metade da área urbana.',
      'Tóquio de hoje é a reconstrução do pós-guerra, acelerada pelas Olimpíadas de 1964 (as vias expressas sobre os canais, o Shinkansen, o Prédio do Governo em Shinjuku de 1991, o Skytree de 2012). Não tem centro histórico porque nunca teve chance de guardar um. O que tem é a memória do traçado: a Yamanote circula onde eram os limites da cidade de Edo, o palácio ocupa o castelo, Shinjuku e Shibuya eram estalagens nas estradas de saída, Ueno era o morro dos templos dos Tokugawa, Akihabara era um terreno queimado. O roteiro vai atrás dessas camadas: Asakusa e Kuramae pela Edo popular, o Palácio e Nihonbashi pela Edo oficial, Meiji Jingū e o Museu Nacional pela era Meiji, Ginza e Shibuya pelo século XX, Akihabara e Ikebukuro pelo XXI.',
    ],
  },
  {
    id: 'kamakura',
    name: 'Kamakura',
    jp: '鎌倉',
    lead: 'A capital dos samurais por 150 anos, protegida por morros e pelo mar, com o zen, o Grande Buda e um trem de 1902.',
    dayIds: ['d2026-11-20'],
    paragraphs: [
      'Minamoto no Yoritomo escolheu Kamakura em 1180 por razões militares: um vale fechado por morros em três lados, com o mar no quarto, acessível só por sete passagens cortadas na rocha, os *kiridōshi*. Ali instalou o primeiro governo de guerreiros do Japão, o *bakufu* ("governo da tenda"), e por 150 anos Kamakura foi a capital real do país, enquanto Kyoto ficava com a cerimônia. O Tsurugaoka Hachimangū, dedicado ao deus da guerra, patrono dos Minamoto, era o centro: a avenida Wakamiya-ōji, que vai do santuário ao mar, foi construída por Yoritomo em 1182 para a mulher rezar por um parto seguro.',
      'Depois da morte de Yoritomo, sua viúva Hōjō Masako e o clã dela governaram como regentes. Foram os Hōjō que trouxeram o zen: o Kenchō-ji (1253) foi o primeiro mosteiro zen do Japão, com um abade vindo da China, e o Engaku-ji (1282) foi fundado depois da segunda invasão mongol, para rezar pelos mortos dos dois lados, coisa rara. A cidade, austera e militar, produziu uma arte própria: as esculturas realistas de Buda, com olhos de cristal, e o Grande Buda de bronze (c. 1252), que perdeu o salão num tsunami em 1498 e desde então fica ao ar livre.',
      'O xogunato caiu em 1333, quando o exército imperial entrou pelo mar; conta-se que o general Nitta Yoshisada jogou a espada no mar e a maré recuou para deixá-lo passar. Os Hōjō, 870 pessoas, se mataram num templo. Kamakura voltou a ser uma vila de pescadores e templos, foi redescoberta no fim do século XIX pelos escritores e pelos banhos de mar (Yuigahama foi uma das primeiras praias de banho do país), e o trenzinho Enoden, de 1902, ainda passa entre os quintais até Enoshima. Hoje é o "Kyoto do leste", a 1 hora de Tóquio, com 65 templos e 19 santuários num lugar de 170.000 habitantes.',
    ],
  },
  {
    id: 'hiroshima',
    name: 'Hiroshima',
    jp: '広島',
    lead: 'Cidade-castelo de um delta, quartel-general do exército, a primeira bomba atômica, e os oleandros que floresceram na primavera seguinte.',
    dayIds: ['d2026-11-23', 'd2026-11-24'],
    paragraphs: [
      'Hiroshima, "ilha larga", é o delta de seis braços do rio Ōta. Mōri Terumoto, senhor da região, construiu ali um castelo em 1589, para trocar a montanha pelo mar e pelo comércio; depois de Sekigahara, os Mōri foram punidos e a cidade passou aos Asano, que a governaram por 250 anos. Era um porto de médio porte do Mar Interior, conhecido por ostras e pelo santuário de Miyajima.',
      'A era Meiji fez dela uma cidade militar: a guerra contra a China (1894) foi comandada daqui, com o imperador e o parlamento instalados na cidade por sete meses; o porto de Ujina embarcou tropas para todas as guerras seguintes. Em 1945 abrigava o quartel-general do 2º Exército, 40.000 soldados e fábricas de armamento, e, ao contrário de quase todas as grandes cidades, não tinha sido bombardeada. Foi justamente por isso que foi escolhida: um alvo intacto onde se poderia medir o efeito.',
      'Em **6 de agosto de 1945, às 8h15**, a bomba "Little Boy" explodiu a 600 m de altura, quase em cima do Salão de Promoção Industrial, o atual Domo. Cerca de 70.000 pessoas morreram no instante e 140.000 até o fim do ano, numa cidade de 350.000. Havia previsão de que nada cresceria por 70 anos; os oleandros floresceram na primavera de 1946 e são a flor da cidade. O bonde voltou a rodar três dias depois da bomba, e dois vagões que sobreviveram ainda circulam. A reconstrução foi planejada em 1949 com a lei que fez de Hiroshima "cidade da paz": o parque de Kenzō Tange no eixo do Domo, o museu sobre pilotis, o cenotáfio com a inscrição "descansem em paz, o erro não se repetirá".',
      'Hoje é uma cidade de 1,2 milhão, alegre, com o maior sistema de bondes do Japão, um time de beisebol (os Carp) adorado e a melhor okonomiyaki do país, que nasceu da fome do pós-guerra. Os sobreviventes, os *hibakusha*, ainda dão depoimentos no museu; a organização deles, Nihon Hidankyō, ganhou o Nobel da Paz em 2024. A visita ao parque funciona melhor de tarde, como está no roteiro, com o Domo iluminado na volta.',
    ],
  },
  {
    id: 'miyajima',
    name: 'Miyajima',
    jp: '宮島 · 厳島',
    lead: 'Uma ilha inteira sagrada, onde não se nascia nem se morria, com o santuário construído sobre o mar para não tocar o chão.',
    dayIds: ['d2026-11-24'],
    paragraphs: [
      'O nome oficial é Itsukushima, "a ilha da adoração"; Miyajima, "a ilha do santuário", é o apelido. A ilha era o deus: por isso o santuário foi construído sobre estacas na maré, para que os fiéis pudessem rezar sem pisar em terreno sagrado, e o torii plantado no mar para que os barcos entrassem por ele. Até a era Meiji não se permitiam partos nem enterros na ilha, e ainda hoje não há cemitério; os cervos, mensageiros dos deuses, andam soltos.',
      'O santuário existe desde 593, diz a tradição, mas quem o fez como é foi **Taira no Kiyomori**, o primeiro samurai a governar o Japão, em 1168. Kiyomori enriqueceu com o comércio com a China pelo Mar Interior e adotou Itsukushima como santuário da família; os corredores de laca vermelha, o palco de Nō sobre a água e os sutras ilustrados que ele doou são do gosto de corte que os Taira imitaram, e que custou a eles a guerra contra os Minamoto. O torii atual é de 1875, de cânfora, sustentado pelo próprio peso (não está enterrado) e restaurado em 2019–2022.',
      'Hideyoshi mandou construir o Senjōkaku em 1587, um salão de sutras enorme, e morreu antes de terminar: ficou sem teto e sem paredes, e assim está. O Monte Misen, 535 m, é lugar de ascese desde que Kūkai, o fundador do budismo Shingon, acendeu no cume em 806 uma chama que, dizem, arde até hoje no salão Reikadō; foi ela que acendeu a Chama da Paz de Hiroshima. Da era Edo em diante a ilha virou destino de peregrinação e turismo, e a "vista das três mais belas do Japão" (com Matsushima e Amanohashidate) é um ranking de 1643.',
    ],
  },
  {
    id: 'kurashiki',
    name: 'Kurashiki',
    jp: '倉敷',
    lead: '"Onde ficam os armazéns": o porto do arroz do xogum, a fiação que virou museu, e o primeiro Greco do Japão.',
    dayIds: ['d2026-11-25'],
    paragraphs: [
      'No período Edo, Kurashiki era *tenryō*, território direto do xogunato, sem daimyō: os mercadores respondiam a um magistrado distante e tinham uma autonomia rara. O canal foi cavado para levar o arroz e o algodão do interior até o Mar Interior, e cada armazém branco de parede *namako* (as telhas pretas em losango com juntas de reboco branco, à prova de fogo) guardava a fortuna de uma família. O bairro foi tombado em 1979 e é dos poucos do país onde uma rua inteira do século XVIII está de pé.',
      'A era Meiji trouxe a fiação Kurabō (1888), instalada onde hoje é o Ivy Square, e a família Ōhara, dona dela, fez algo incomum: usou o dinheiro em cultura e serviço social. Magosaburō Ōhara financiou a viagem do pintor Torajirō Kojima à Europa, e Kojima voltou com um El Greco comprado numa loja de Paris em 1922, mais Monet, Gauguin, Matisse. O museu de 1930, com fachada de templo grego, foi o primeiro de arte ocidental do Japão, numa cidade de 30.000 habitantes. A cidade não foi bombardeada, o que preservou tudo isso.',
      'O algodão continuou: em Kojima, a 30 minutos, se fez em 1965 o primeiro jeans japonês, e a região é hoje a capital mundial do denim artesanal. A lona *Kurashiki hanpu*, de algodão grosso, é a lembrança boa daqui.',
    ],
  },
  {
    id: 'himeji',
    name: 'Himeji',
    jp: '姫路',
    lead: 'O castelo branco que nunca foi atacado, construído para vigiar o oeste, e que sobreviveu a uma bomba que não explodiu.',
    dayIds: ['d2026-11-25'],
    paragraphs: [
      'Himeji fica onde a planície de Harima estreita entre montanha e mar, na estrada que liga Kyoto ao oeste do Japão: quem controla Himeji controla a passagem. Houve um forte no morro Himeyama desde 1333; Hideyoshi fez ali um castelo de três andares em 1580, quando era general de Nobunaga na conquista do oeste. Depois de Sekigahara, Ieyasu deu Himeji ao genro **Ikeda Terumasa** com uma missão: vigiar os daimyō do oeste, que tinham lutado contra ele. Terumasa demoliu o castelo de Hideyoshi e construiu o atual entre 1601 e 1609, com 80 prédios, três fossos, muralhas em espiral e um torreão de seis andares sobre uma base de 15 m.',
      'O castelo nunca foi atacado. Sobreviveu à era Meiji porque o exército o usou como quartel (a maioria dos castelos foi demolida, e Himeji foi vendido em leilão por 23 ienes a um homem que desistiu de desmontá-lo quando viu o custo). Sobreviveu ao bombardeio de 3 de julho de 1945, que destruiu a cidade em volta: uma bomba incendiária caiu no último andar do torreão e não explodiu. A restauração de 2009–2015 refez o reboco branco, e o castelo ficou tão branco que ganhou o apelido de "garça branca", *Shirasagi-jō*, mais que nunca.',
      'A cidade de Himeji é uma cidade de 530.000 habitantes reconstruída em volta da avenida que vai da estação ao castelo, feita de propósito para que o torreão apareça no fim, à vista do trem. O jardim Kōko-en, ao lado, é de 1992, construído onde ficavam as casas dos samurais, com nove jardins murados no traçado antigo.',
    ],
  },
  {
    id: 'osaka',
    name: 'Osaka',
    jp: '大阪',
    lead: 'A cozinha do país, a cidade dos comerciantes, do primeiro mercado futuro do mundo e da comida de rua que virou identidade.',
    dayIds: ['d2026-11-25', 'd2026-11-26', 'd2026-11-27'],
    paragraphs: [
      'O lugar já era o porto de Nara e Kyoto no século V (o santuário de Sumiyoshi, dos deuses do mar, é de 211 pela tradição), e o Shitennō-ji, de 593, é o templo mais antigo do país. Em 1496 um monge construiu no morro da foz do rio Yodo o Ishiyama Hongan-ji, um templo-fortaleza de uma seita budista tão poderosa que Nobunaga levou 11 anos para tomá-lo. Nas ruínas, Hideyoshi construiu em 1583 o maior castelo do Japão, e Osaka virou capital de fato até a morte dele.',
      'Os Tokugawa destruíram o castelo e os Toyotomi em 1615, reconstruíram tudo maior por cima e fizeram de Osaka a cidade do dinheiro: cada domínio do país mantinha ali armazéns para converter o arroz dos impostos em moeda, e a bolsa de arroz de Dōjima (1697) negociava contratos a termo padronizados um século antes de Chicago. Era **tenka no daidokoro**, "a cozinha do país", e uma cidade de comerciantes sem samurais que importassem: a saudação era *mōkarimakka?*, "está lucrando?". O teatro de bonecos *bunraku*, o kabuki de Osaka e a literatura de Ihara Saikaku, sobre dinheiro e sexo, são daqui.',
      'A era Meiji fez de Osaka a "Manchester do Oriente", a cidade das fábricas de algodão; nos anos 1920 foi a maior cidade do Japão, maior que Tóquio, e construiu o Tsūtenkaku (1912) copiando a Torre Eiffel e o Arco do Triunfo num bairro chamado "Novo Mundo". Os bombardeios de 1945 arrasaram tudo, e a reconstrução deu a Osaka de hoje: Umeda ao norte, Namba ao sul, a Midōsuji ligando os dois, e a cultura do *kuidaore*, "comer até cair", nas ruas de Dōtonbori, com o takoyaki (1935), o okonomiyaki e o kushikatsu de Shinsekai. A Expo de 1970 e a de 2025 são as duas vezes que a cidade se reapresentou ao mundo.',
    ],
  },
  {
    id: 'kyoto',
    name: 'Kyoto',
    jp: '京都',
    lead: 'Capital por 1.074 anos, riscada da lista da bomba por um americano que a visitara em lua de mel, com 1.600 templos e 17 patrimônios da humanidade.',
    dayIds: ['d2026-11-27', 'd2026-11-28', 'd2026-11-29', 'd2026-12-01'],
    paragraphs: [
      'O imperador Kanmu fundou Heian-kyō em 794 num vale cercado de montanhas por três lados, com rios a leste e oeste, seguindo a geomancia chinesa: a cidade foi desenhada em grade, 4,5 por 5,2 km, com uma avenida central de 85 m de largura que ia do palácio ao portão Rashōmon. Essa grade ainda está lá; as ruas têm nome numerado (Shijō é a "quarta avenida", Gojō a quinta) e os endereços se dão dizendo "acima" ou "abaixo" de cada cruzamento. A metade oeste da cidade planejada foi abandonada cedo, pantanosa; a cidade cresceu para o leste, para os morros de Higashiyama, onde estão os templos do roteiro.',
      'Kyoto foi capital por 1.074 anos, mas sede do poder real só nos primeiros 400 e nos 240 dos Ashikaga. Foi destruída pela Guerra Ōnin (1467–77), reconstruída por Hideyoshi (que a cercou com um muro de terra, o Odoi, e mudou os templos de lugar), e viveu o período Edo como cidade de artesãos, de seda, de cerâmica e do imperador sem poder. Quase todos os templos que vocês vão ver foram reconstruídos entre 1600 e 1850. Em 1868 o imperador foi embora para Tóquio e levou a corte; a cidade encolheu e temeu virar província. A resposta foi a modernização: a primeira usina hidrelétrica do Japão (1891), o canal do lago Biwa que passa pelo aqueduto de Nanzen-ji, o primeiro bonde elétrico do país (1895).',
      'Em 1945 Kyoto estava na lista de alvos da bomba atômica, no topo, por ser intacta e grande o bastante para medir o efeito. O secretário de Guerra Henry Stimson, que a conhecera nos anos 1920, a riscou pessoalmente, duas vezes, contra a opinião dos militares. É a razão de Kyoto ser a única grande cidade japonesa com o passado de pé. Hoje tem 1,4 milhão de habitantes, 1.600 templos budistas, 400 santuários, 17 lugares Patrimônio Mundial, e em novembro recebe mais turistas do que consegue: por isso o roteiro começa às 6h em Kiyomizu e termina nas iluminações noturnas, quando os ônibus de excursão já foram embora.',
    ],
  },
  {
    id: 'nara',
    name: 'Nara',
    jp: '奈良',
    lead: 'A primeira capital de verdade, o Grande Buda que quase quebrou o país, e os cervos que são mensageiros dos deuses desde 768.',
    dayIds: ['d2026-11-30'],
    paragraphs: [
      'Heijō-kyō foi capital de 710 a 784, uma cópia da capital chinesa dos Tang com 100.000 habitantes, e o século de Nara foi o século em que o Japão virou um Estado: o primeiro código de leis, o primeiro censo, as primeiras crônicas oficiais (Kojiki e Nihon Shoki, que contam a origem divina dos imperadores), a primeira moeda, e os grandes templos que faziam tudo isso funcionar. O Tōdai-ji era o templo do Estado, chefe de uma rede de templos provinciais; o Kōfuku-ji era o templo do clã Fujiwara, que governava; o Kasuga Taisha era o santuário do mesmo clã, fundado em 768 sobre um deus que chegou montado num cervo branco. É por isso que os cervos são sagrados e andam soltos há 1.250 anos.',
      'Quando a corte foi embora, em 784, os templos ficaram, ricos e armados. O Kōfuku-ji governou a província de Yamato de fato durante a Idade Média, com monges-soldados que desciam a Kyoto para intimidar a corte. O Tōdai-ji queimou duas vezes em guerras, em 1180 e 1567, e o Daibutsuden atual, de 1709, é dois terços do original e ainda assim um dos maiores prédios de madeira do mundo. O Grande Buda perdeu a cabeça mais de uma vez e a atual é de 1692.',
      'Nara nunca mais foi grande, e é isso que a preservou: uma cidade de 350.000 habitantes com o parque de 500 hectares no meio, os cervos, as ruas de casas de mercadores de Naramachi (do período Edo, quando o bairro fazia saquê e tinta), e o hábito dos turistas de Kyoto de passar só o dia. O roteiro faz isso também, mas o parque de manhã cedo, antes das excursões, é dos lugares mais bonitos da viagem.',
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Os lugares, em mais detalhe (chave: id da parada do roteiro)
// ─────────────────────────────────────────────────────────────────────────

export const PLACE_HISTORIES: Record<string, PlaceHistory> = {
  'd19-sensoji': {
    title: 'Sensō-ji, o templo mais antigo de Tóquio',
    jp: '浅草寺',
    paragraphs: [
      'A lenda diz que em 628 dois irmãos pescadores tiraram do rio Sumida, na rede, uma estátua de ouro de Kannon, a bodisatva da compaixão, de 5 cm. Devolveram ao rio, a estátua voltou, e o chefe da aldeia a consagrou num templo. A estátua nunca foi mostrada a ninguém, nem ao imperador; fica escondida no altar e o que se vê é uma cópia. O templo cresceu com Edo: os Tokugawa o adotaram como templo de orações da família, e o bairro em volta virou o centro de diversão da cidade, com o kabuki, o bairro de prazer de Yoshiwara logo atrás e, na era Meiji, o primeiro cinema e o primeiro arranha-céu do Japão, o Ryōunkaku de 12 andares, que o terremoto de 1923 derrubou.',
      'Tudo queimou em 1945; o salão principal e o pagode são de concreto, de 1958 e 1973, e o Kaminarimon com a lanterna gigante é de 1960, doado pelo fundador da Panasonic depois de se curar de uma doença rezando aqui. A Nakamise, a rua de lojas entre o portão e o templo, é de 1685: as famílias que limpavam o pátio ganharam permissão de vender ali, e algumas das 90 lojas são as mesmas. Os japoneses vêm aqui para o *hatsumōde*, a primeira visita do ano (3 milhões em três dias), e para o Sanja Matsuri, em maio, quando 100 andores atravessam o bairro carregados por 1,5 milhão de pessoas.',
    ],
  },
  'd19-museu-nacional': {
    title: 'Museu Nacional de Tóquio',
    jp: '東京国立博物館',
    paragraphs: [
      'O museu mais antigo e maior do Japão nasceu em 1872 de uma exposição no templo de Yushima, organizada pelo governo Meiji para inventariar o que o país tinha, na hora em que o país estava vendendo e destruindo tudo que era antigo para parecer moderno. Boa parte da coleção veio de templos falidos pela separação entre budismo e Shintō, e de coleções de daimyō arruinados. Foi instalado em Ueno em 1882, no morro onde ficava o templo dos Tokugawa, Kan\'ei-ji, destruído na batalha de 1868 entre o exército imperial e os últimos defensores do xogum.',
      'O prédio principal, de 1938, é do estilo "coroa imperial", telhado japonês sobre corpo de concreto, que era a arquitetura oficial do militarismo. A Galeria dos Tesouros de Hōryū-ji, de 1999, é de Yoshio Taniguchi, que depois fez o MoMA de Nova York. O museu tem 120.000 peças, 89 Tesouros Nacionais, e o roteiro sugere o essencial: as espadas, as estátuas budistas, os biombos, a armadura, e a sala de ukiyo-e, onde se veem os Hokusai e Hiroshige originais, que em Edo custavam o preço de uma tigela de soba.',
    ],
  },
  'd19-akihabara': {
    title: 'Akihabara',
    jp: '秋葉原',
    paragraphs: [
      'Em 1869 um incêndio destruiu o bairro e o governo deixou o terreno vazio como corta-fogo, com um santuário ao deus do fogo, Akiba, no meio; "Akiba-ga-hara" é "o campo de Akiba". A estação de 1890 fez dele um entreposto de carga e, em 1945, o mercado negro do pós-guerra se instalou debaixo dos trilhos vendendo peças de rádio, que eram o único entretenimento disponível. Nos anos 1950 as barracas viraram lojas de eletrodomésticos, nos 80 de computador, nos 90 de videogame e mangá, e no fim da década o bairro tinha virado a capital dos otaku: lojas de figuras, cafés de maids, karaokê, e prédios de dez andares dedicados a um só hobby.',
      'A Yodobashi Akiba (2005) e o fim das lojas de rua mudaram a cara do bairro, mas a Chūō-dōri é fechada para carros aos domingos desde 1973 e a rua ainda é o centro do mundo para quem gosta de anime. O Radio Kaikan (1962, reconstruído em 2014) aparece no *Steins;Gate* com um satélite cravado no telhado; o Super Potato é um museu de videogame que vende; e o santuário de Hanabusa Inari, num beco atrás do Don Quijote, é o que sobrou do bairro de antes do incêndio.',
    ],
  },
  'd20-hachimangu': {
    title: 'Tsurugaoka Hachimangū',
    jp: '鶴岡八幡宮',
    paragraphs: [
      'Hachiman é o deus da guerra, a divinização do imperador Ōjin, e o patrono do clã Minamoto. Yoritomo trouxe o santuário da família para o centro da nova capital em 1180 e fez dele o eixo da cidade: a avenida Wakamiya-ōji, de 1,8 km, corta em linha reta do santuário ao mar, e foi construída com um trecho elevado no meio, o Dankazura, para a mulher dele, Masako, rezar por um parto seguro. Os 61 degraus levam ao salão principal, reconstruído em 1828 pelo xogum Tokugawa. Em 1219 o terceiro xogum, Sanetomo, foi assassinado nessa escadaria pelo sobrinho, escondido atrás de um ginkgo gigante; o ginkgo, de mil anos, caiu numa tempestade em 2010, e brotou de novo da raiz.',
      'O santuário é também um dos lugares onde a separação de 1868 foi mais violenta: havia um templo budista inteiro dentro dele, com pagode e estátuas, que foi demolido em semanas. O lago de lótus da entrada, o Genpei-ike, tem lótus brancos de um lado e vermelhos do outro: as cores dos Minamoto e dos Taira, os vencedores e os vencidos da guerra que fundou a cidade.',
    ],
  },
  'd20-daibutsu': {
    title: 'O Grande Buda de Kamakura',
    jp: '鎌倉大仏',
    paragraphs: [
      'O Amida de bronze tem 11,3 m de altura, 121 toneladas, e foi fundido por volta de 1252 em partes soldadas, com dinheiro arrecadado de porta em porta por um monge e uma senhora da corte, sem patrocínio do governo. A técnica é visível de perto: as linhas das juntas, a superfície ondulada, o dourado que sobrou perto das orelhas. Ficava dentro de um salão de madeira, destruído por tempestades em 1334 e 1369 e por um tsunami em 1498; desde então está ao ar livre, o que os japoneses acham comovente e os poetas transformaram em tema (Kipling escreveu sobre ele em 1892). Sobreviveu ao terremoto de 1923 deslizando 50 cm sobre a base, e hoje está sobre uma base que absorve o tranco.',
      'Por dentro é oco, e por ¥50 se entra e se vê a estrutura. Os chinelos de palha gigantes na parede foram feitos por crianças de uma escola do norte em 1951, para que o Buda pudesse andar pelo Japão, e são renovados a cada três anos. Amida é o Buda da Terra Pura, o do budismo popular medieval: bastava repetir o nome dele para se salvar, sem estudo nem ritual, e por isso a estátua foi paga pelo povo.',
    ],
  },
  'd21-tsukiji': {
    title: 'O mercado de Tsukiji',
    jp: '築地',
    paragraphs: [
      'Tsukiji quer dizer "terra construída": é o aterro que os Tokugawa fizeram na baía depois do incêndio de 1657, para dar espaço ao templo Hongan-ji, cuja versão atual, de 1934, parece um templo indiano de propósito. O mercado de peixe de Edo era em Nihonbashi, a 2 km; foi destruído pelo terremoto de 1923 e refeito aqui em 1935, num prédio em curva desenhado para os vagões de trem. Por 83 anos foi o maior mercado de peixe do mundo: 2.000 toneladas por dia, o leilão de atum às 5h da manhã, 60.000 pessoas trabalhando. Em 2018 o mercado interno mudou para Toyosu, do outro lado da baía, num prédio moderno e fechado.',
      'O mercado externo, o *jōgai*, ficou: as 400 lojas que serviam os atacadistas (facas, chá, ovos, ovas, nori, os balcões de sushi de café da manhã) continuam nas ruas em volta do terreno vazio. É um mercado de varejo para gente da cidade e para turistas, e a regra de ouro é chegar cedo: às 8h as lojas abrem, às 10h a rua lota, às 14h fecha. O roteiro chega às 7h30 e come de pé.',
    ],
  },
  'd21-ginza': {
    title: 'Ginza',
    jp: '銀座',
    paragraphs: [
      'O nome vem da casa da moeda de prata (*gin-za*) que os Tokugawa instalaram aqui em 1612. Em 1872 um incêndio destruiu o bairro, e o governo Meiji o reconstruiu como vitrine da modernização: ruas largas, calçadas, os primeiros prédios de tijolo, os primeiros postes de gás, os primeiros salgueiros. Foi o bairro onde o Japão aprendeu a ser ocidental: as primeiras lojas de departamento (Mitsukoshi vem do quimono, Wako do relógio), os cafés, as *moga* dos anos 1920 de cabelo curto, o hábito de passear na Ginza só para ser visto, o *gin-bura*.',
      'Destruída em 1945, reconstruída como bairro de luxo, foi nos anos 1980 o metro quadrado mais caro do mundo. Aos sábados e domingos à tarde a avenida Chūō fecha para carros desde 1970, o "paraíso dos pedestres". O bairro conserva a grade de Edo: quadras numeradas de 1 a 8 (*chōme*), e o cruzamento da Chūō com a Harumi, com o relógio da Wako de 1932, é o centro simbólico. Para as compras do roteiro: Uniqlo de 12 andares, Itōya de papelaria de 1904, Ginza Six, e os *depachika*, os subsolos de comida das lojas de departamento, que são a melhor comida rápida do país.',
    ],
  },
  'd22-meiji-jingu': {
    title: 'Meiji Jingū, a floresta plantada',
    jp: '明治神宮',
    paragraphs: [
      'O imperador Meiji morreu em 1912 e a nação decidiu fazer dele um deus, o que era coerente com a ideologia que ele mesmo tinha inaugurado. O lugar escolhido foi um terreno de 70 hectares de campos de íris onde ele e a imperatriz passeavam. O santuário foi construído em cipreste de Kiso sem pintura, no estilo antigo, e em volta se plantou uma floresta: 100.000 árvores doadas de todo o país e das colônias, plantadas por 110.000 voluntários entre 1915 e 1920, seguindo um plano de 150 anos desenhado por três botânicos. A ideia era que em 100 anos parecesse uma floresta natural de sempre-verdes de folha larga, e pareceu antes: hoje ninguém percebe que é plantada.',
      'Os prédios foram destruídos em 1945 e reconstruídos em 1958; a floresta sobreviveu. Os barris de saquê na alameda são doações anuais das cervejarias, e os de vinho de Borgonha, em frente, doações de produtores franceses desde 2006, em homenagem ao gosto do imperador pelo vinho. Meiji Jingū recebe 3 milhões de pessoas nos três primeiros dias do ano, mais que qualquer outro santuário; no resto do tempo é o lugar mais silencioso do centro de Tóquio, a 5 minutos de Harajuku.',
    ],
  },
  'd23-museu-paz': {
    title: 'O Museu Memorial da Paz',
    jp: '広島平和記念資料館',
    paragraphs: [
      'O museu abriu em 1955, no prédio sobre pilotis de Kenzō Tange, que ganhou o concurso para o parque em 1949 com uma ideia simples: um eixo reto do museu ao Domo, passando pelo cenotáfio, de modo que quem olha pelo arco do cenotáfio vê a chama e a ruína alinhadas. A coleção começou com os objetos que um geólogo da universidade recolheu nas ruínas, contra o conselho de todos: relógios parados às 8h15, uma lancheira carbonizada com o arroz dentro, o triciclo de Shin, de três anos, que o pai enterrou com ele e desenterrou 40 anos depois para doar, a sombra de uma pessoa gravada na pedra da escada de um banco.',
      'A reforma de 2019 tirou os bonecos de cera e as maquetes e deixou os objetos e as fotos, com os nomes das pessoas. É deliberadamente difícil, e a visita é feita para durar: o roteiro reserva 1h30 a 2h e põe o museu antes do parque, para sair dele e andar ao ar livre. Presidentes visitaram: Obama em 2016, o G7 inteiro em 2023. A mensagem do museu não é sobre culpa; é sobre o que uma bomba faz, e por que não pode acontecer de novo.',
    ],
  },
  'd23-parque-domo': {
    title: 'O Domo da Bomba Atômica',
    jp: '原爆ドーム',
    paragraphs: [
      'O prédio era o Salão de Promoção Industrial da Prefeitura de Hiroshima, de 1915, projeto do arquiteto tcheco Jan Letzel, com a cúpula de cobre que era a coisa mais moderna da cidade. A bomba explodiu 160 m ao lado e 600 m acima; a onda de choque veio quase na vertical, e por isso as paredes ficaram de pé enquanto tudo em volta foi varrido. As 30 pessoas dentro morreram no instante.',
      'Nos anos 1950 a cidade discutiu demoli-lo: era doloroso e perigoso. Uma menina que morreu de leucemia em 1960, Hiroko Kajiyama, deixou num diário o pedido de que ficasse, e a campanha dos estudantes pela preservação venceu em 1966. Foi reforçado por dentro com aço e virou Patrimônio Mundial em 1996, contra a objeção dos Estados Unidos e da China. Fica do outro lado do rio Motoyasu, onde as pessoas queimadas entraram na água naquela manhã, e é para lá que se soltam as lanternas de papel todo 6 de agosto.',
    ],
  },
  'd24-itsukushima': {
    title: 'O santuário de Itsukushima',
    jp: '厳島神社',
    paragraphs: [
      'O santuário é dedicado a três deusas do mar, filhas da deusa do Sol, e foi construído sobre estacas na maré por Taira no Kiyomori em 1168, com o desenho de um palácio da corte de Heian: corredores cobertos de laca vermelha, um palco sobre a água, pátios que somem com a maré alta. Kiyomori era o homem mais poderoso do Japão e usou o santuário como demonstração: doou 33 rolos de sutras copiados pela própria família em papel decorado com ouro, que são Tesouro Nacional e o auge da arte de Heian.',
      'O torii no mar, a 200 m do santuário, tem 16 m de altura e é de 1875, o oitavo desde o século XII; os pilares são de cânfora de 600 anos, escolhidos porque a madeira resiste à água, e não estão enterrados: o peso do topo, cheio de pedras, é o que o mantém de pé. Com maré baixa se caminha até ele e se veem as moedas cravadas nas rachaduras. O palco de Nō sobre a água, de 1680, é o único do país onde o ator se apresenta com o mar embaixo; o som do tablado muda com a maré. O pagode de cinco andares no morro, de 1407, é budista, e ficou do lado Shintō da separação de 1868 porque os monges já tinham ido embora.',
    ],
  },
  'd24-misen': {
    title: 'Monte Misen',
    jp: '弥山',
    paragraphs: [
      'O monge Kūkai (Kōbō Daishi), que fundou o budismo Shingon depois de estudar na China, fez ascese no cume em 806 e acendeu uma chama que, dizem, nunca se apagou: arde no salão Reikadō, ao lado do cume, e foi dela que se acendeu a Chama da Paz de Hiroshima em 1964. O monte tem 535 m, é floresta primária desde que a ilha é sagrada, e as pedras enormes do cume são o motivo da subida: o Kuguri-iwa, uma rocha que se atravessa por baixo, e o mirante de onde se vê o Mar Interior com suas 700 ilhas até Shikoku em dia claro.',
      'O teleférico é de 1959, em dois trechos (cabines pequenas até Kayatani, cabine grande até Shishiiwa), e termina a 30 minutos a pé do cume. O caminho do topo passa pelo Reikadō e pelas rochas. Na descida, o último teleférico é às 17h, e do Shishiiwa ao cume e de volta são uma hora; por isso o roteiro põe o Misen ao meio-dia.',
    ],
  },
  'd25-himeji': {
    title: 'Castelo de Himeji, por dentro',
    jp: '姫路城',
    paragraphs: [
      'O que vocês vão percorrer é uma máquina de defesa que nunca foi usada. Da entrada ao torreão são 1 km de caminho em espiral, passando por portões cada vez mais estreitos, com curvas fechadas onde o atacante fica de lado para os defensores, muralhas com buracos circulares (para arcabuz), triangulares e retangulares (para flechas), e o "labirinto": do portão Hishi-no-mon se vê o torreão logo ali, mas o caminho o afasta primeiro. As pedras da base incluem lápides e mós de moinho recolhidas com pressa; uma delas, a "pedra da velha", foi doada por uma senhora que vendia bolinhos, diz a lenda.',
      'O torreão tem seis andares por dentro e cinco por fora, sustentado por dois pilares de 24 m que vão do porão ao topo; um deles, o original de 1609, foi trocado em 1959. Os andares são vazios de propósito (eram depósito de armas e último refúgio), com prateleiras para lanças e uma cozinha. O último andar tem um santuário, o Osakabe, a um deus da montanha que, dizem, o daimyō visitava uma vez por ano, com medo. O poço de Okiku, no pátio, é o de uma história de fantasma do século XVIII: a criada que quebrou um prato de um jogo de dez e foi jogada no poço, e conta os pratos toda noite, "um, dois... nove", e grita.',
    ],
  },
  'd26-castelo-osaka': {
    title: 'O Castelo de Osaka',
    jp: '大阪城',
    paragraphs: [
      'Hideyoshi começou o castelo em 1583, no lugar do templo-fortaleza que Nobunaga demorara 11 anos para tomar, e fez dele o maior do país: um torreão de cinco andares com telhado de ouro, fossos de 90 m de largura, e um palácio onde recebia embaixadores com paredes forradas de ouro. Levou 30.000 homens e as pedras vieram de barco de ilhas do Mar Interior. Morreu em 1598 deixando um filho de cinco anos, Hideyori, e a viúva Yodo-dono como regente.',
      'Ieyasu esperou 16 anos. No cerco de inverno de 1614, com 200.000 homens contra 100.000 dentro, não conseguiu tomar as muralhas e negociou uma trégua cuja condição era aterrar o fosso externo. Aterrou também o interno, alegando erro. No verão de 1615 o castelo sem fossos caiu em dois dias; Hideyori e a mãe se mataram numa torre, e o filho de oito anos de Hideyori foi executado. Os Tokugawa reconstruíram tudo maior por cima, em 1620–29, com pedras ainda maiores (a Tako-ishi, 108 toneladas) enviadas por cada daimyō como demonstração de lealdade e de ruína financeira. O torreão deles queimou por um raio em 1665 e nunca foi refeito. O atual, de 1931, é de concreto, com elevador, pago por doações dos cidadãos de Osaka, e a única coisa do castelo que Hideyoshi reconheceria são o traçado e as pedras.',
    ],
  },
  'd27-sumiyoshi': {
    title: 'Sumiyoshi Taisha',
    jp: '住吉大社',
    paragraphs: [
      'A tradição diz que a imperatriz Jingū fundou o santuário em 211, ao voltar de uma expedição à Coreia, para agradecer aos três deuses Sumiyoshi que protegem os navegantes. O santuário ficava à beira-mar e era a última parada das embaixadas japonesas antes de zarpar para a China dos Tang, no século VIII; Osaka aterrou o mar desde então e hoje a costa está a 5 km. Os quatro salões estão em estilo *sumiyoshi-zukuri*, um dos três mais antigos do país, de antes do budismo: telhado reto, madeira crua, os chifres cruzados, todos olhando para o oeste, para o mar. Os atuais são de 1810 e são Tesouro Nacional.',
      'É o santuário mais popular de Osaka: 2 milhões de pessoas no Ano Novo, os comerciantes no primeiro dia de cada mês comprando um gato de cerâmica no Nankun-sha, e a ponte arqueada, Sorihashi, que as crianças escalam e que Tanizaki e Kawabata puseram em romances. O bonde Hankai passa na porta desde 1911.',
    ],
  },
  'd27-fushimi-inari': {
    title: 'Fushimi Inari, os dez mil torii',
    jp: '伏見稲荷大社',
    paragraphs: [
      'Inari é a divindade do arroz, e portanto da prosperidade, e portanto dos negócios; é a mais popular do Japão, com 30.000 santuários, e este é a matriz de todos, fundado em 711 pelo clã Hata, imigrantes coreanos que trouxeram a sericultura e a metalurgia para Kyoto. As raposas são mensageiras de Inari, não a divindade, e as chaves na boca delas abrem os celeiros de arroz. O Rōmon, o portão de dois andares, foi doado por Hideyoshi em 1589 quando a mãe se curou de uma doença.',
      'Os torii são doações: cada empresa ou pessoa que tem um pedido atendido paga um torii com o nome gravado atrás, de ¥400.000 o pequeno a ¥1,3 milhão o grande, e as fileiras se renovam quando a madeira apodrece, a cada dez anos. O costume começou no período Edo e há hoje uns 10.000 torii na montanha, com 800 no trecho duplo do Senbon Torii. A subida ao cume, 233 m, leva duas horas e passa por milhares de altares particulares de pedra, os *otsuka*, cada um com o nome de uma família e um Inari próprio. É o lugar mais visitado de Kyoto e, de tarde, quando as excursões descem, o mais bonito para subir.',
    ],
  },
  'd28-kiyomizu': {
    title: 'Kiyomizu-dera',
    jp: '清水寺',
    paragraphs: [
      'O templo foi fundado em 778 por um monge que seguiu uma fonte de água pura ("kiyomizu") até a encosta, e adotado em 798 pelo general Sakanoue no Tamuramaro, que conquistou o norte do Japão para o imperador Kanmu. É dedicado a Kannon de onze cabeças e mil braços, e foi por 1.000 anos um dos destinos de peregrinação mais populares do país, com a corte de Heian, os peregrinos de Edo e o *Genji* passando por aqui. Queimou nove vezes; o salão atual é de 1633, construído pelo terceiro xogum Tokugawa.',
      'O palco, de 13 m de altura sobre 18 pilares de zelkova de 12 m sem um prego, foi feito para as danças oferecidas a Kannon, e deu à língua japonesa a expressão "pular do palco de Kiyomizu", que quer dizer tomar uma decisão irreversível: 234 pessoas pularam entre 1694 e 1864, com uma sobrevivência de 85%, porque a encosta é de árvores. A cascata Otowa, embaixo, tem três canais: saúde, amor e estudos, e a tradição diz que beber dos três é ganância. O roteiro chega às 6h da manhã, quando o templo abre, todos os dias do ano, e a Sannenzaka está vazia.',
    ],
  },
  'd28-ginkakuji': {
    title: 'Ginkaku-ji, o pavilhão que nunca ganhou prata',
    jp: '銀閣寺',
    paragraphs: [
      'O xogum Ashikaga Yoshimasa era um governante desastroso e um esteta genial. Enquanto a Guerra Ōnin destruía Kyoto (uma guerra provocada em parte pela própria sucessão dele), construiu em 1482 uma villa de aposentadoria ao pé das montanhas do leste, copiando o Pavilhão Dourado do avô, e reuniu ali pintores, mestres de chá, jardineiros e monges. Do círculo dele, a cultura Higashiyama, saíram a cerimônia do chá, o ikebana, o tatame de sala inteira, a alcova de exposição (*tokonoma*), as portas de correr de papel: a casa japonesa tradicional foi inventada aqui. O pavilhão ia ser coberto de folha de prata; nunca foi, e o nome ficou pela ironia.',
      'O jardim é de duas partes: o cone de areia (o "monte que olha a lua") e o mar de areia rastelado, do período Edo, e o jardim de musgo com o lago, atribuído ao pintor Sōami. Um caminho sobe a encosta e mostra a villa por cima, com a cidade ao fundo. É menos visitado que o Dourado e mais amado pelos japoneses, pela mesma razão que o Grande Buda ao ar livre: o inacabado é mais bonito que o perfeito. O Caminho do Filósofo começa na porta.',
    ],
  },
  'd28-nanzenji': {
    title: 'Nanzen-ji e o aqueduto',
    jp: '南禅寺',
    paragraphs: [
      'O imperador Kameyama construiu uma villa aqui em 1264 e a transformou em templo zen em 1291, dizem que para expulsar um fantasma que nenhum monge conseguia expulsar e um mestre zen expulsou meditando. Virou o templo zen de maior categoria do Japão, acima dos "Cinco Montes" de Kyoto, e queimou na Guerra Ōnin; o Sanmon, o portão colossal de 1628, foi construído por um general de Ieyasu em memória dos mortos do cerco de Osaka. Um ladrão do kabuki, Ishikawa Goemon, sobe nele e diz "que vista magnífica" antes de ser preso e cozido vivo numa panela, o que deu nome à banheira de ferro japonesa.',
      'O aqueduto de tijolo vermelho que atravessa o pátio é de 1888, parte do canal do lago Biwa, o projeto com que Kyoto reagiu à perda da capital: 20 km de canal que trouxeram água, transporte e a primeira hidrelétrica do país, que moveu o primeiro bonde elétrico do Japão. Um aqueduto vitoriano dentro de um mosteiro zen de 1291 é uma imagem exata do que Kyoto fez com a modernidade. O jardim do Hōjō, "os tigres atravessando o rio", é de Kobori Enshū, o paisagista dos Tokugawa.',
    ],
  },
  'd29-bambu': {
    title: 'O bambuzal de Arashiyama',
    jp: '嵐山 竹林',
    paragraphs: [
      'Arashiyama era o lugar de villas de fim de semana da corte de Heian desde o século IX: o imperador Saga tinha um palácio aqui, os nobres vinham ver os bordos no outono e as cerejeiras na primavera, e o *Genji* descreve passeios de barco no rio Ōi. O bambuzal fica atrás do Tenryū-ji, e não é natural nem antigo: os bambus *mōsō*, que chegaram da China no século XVIII, foram plantados para produzir brotos e cestas, e a trilha de 500 m entre cercas de bambu trançado é um caminho de serviço que virou a foto mais famosa de Kyoto. O bambu cresce até um metro por dia, e o som do vento nas hastes foi eleito pelo governo uma das "cem paisagens sonoras do Japão".',
      'O Tenryū-ji, na entrada, foi fundado em 1339 pelo xogum Ashikaga Takauji para apaziguar o espírito do imperador Go-Daigo, que ele tinha traído; o jardim de Musō Soseki, com o lago e a montanha ao fundo, é o único que sobrou dos incêndios e tem 680 anos. O Nonomiya, no meio do bambuzal, é o santuário onde as princesas imperiais se purificavam por um ano antes de servir em Ise, e tem o torii de madeira com casca, o mais antigo estilo que existe.',
    ],
  },
  'd29-kinkakuji': {
    title: 'Kinkaku-ji, o Pavilhão Dourado',
    jp: '金閣寺',
    paragraphs: [
      'O xogum Ashikaga Yoshimitsu, o mais poderoso dos Ashikaga, que unificou as duas cortes rivais e se fez chamar "Rei do Japão" pelo imperador da China, comprou uma villa de um aristocrata em 1397 e a transformou num palácio de aposentadoria com um pavilhão de três andares à beira de um lago. Cada andar é de um estilo: o térreo é palácio de Heian, o segundo é casa de samurai, o terceiro é templo zen chinês, e os dois de cima são cobertos de folha de ouro. Era a declaração de que ele reunia as três culturas do país. Virou templo depois da morte dele, em 1408, com o nome oficial de Rokuon-ji.',
      'Em 1950 um monge noviço de 21 anos, Hayashi Yōken, pôs fogo no pavilhão, que sobrevivera à Guerra Ōnin e a todas as outras, e tentou se matar no morro atrás. Ele disse que odiava a beleza do prédio; Yukio Mishima escreveu sobre isso *O Templo do Pavilhão Dourado* (1956), um dos grandes romances japoneses. O pavilhão atual é de 1955, mais dourado do que o original tinha sido em séculos (o ouro foi renovado em 1987, com 20 kg de folha), e a fênix do telhado é a única peça que se salvou do incêndio, porque estava em restauro. O lago-espelho, Kyōko-chi, com as ilhas e as pedras doadas por daimyō, é o original de 1397.',
    ],
  },
  'd29-ryoanji': {
    title: 'Ryōan-ji, as quinze pedras',
    jp: '龍安寺',
    paragraphs: [
      'O templo foi fundado em 1450 pelo general Hosokawa Katsumoto, um dos dois chefes da Guerra Ōnin, na villa de um aristocrata com um lago do século XII. Queimou na guerra que ele próprio começou e foi reconstruído pelo filho por volta de 1499; o jardim seco é dessa época, ou de 1680, ou de 1799, dependendo de quem conta, e o autor é desconhecido (há nomes gravados numa pedra, provavelmente de dois jardineiros de casta inferior, os *kawaramono*). São 15 pedras em cinco grupos num retângulo de cascalho branco de 25 por 10 m, cercado por um muro de barro cozido em óleo que ficou manchado com os séculos, e nada mais.',
      'Nunca se veem as 15 de uma vez de nenhum ponto da varanda; a tradição diz que só quem atinge a iluminação vê todas. As interpretações (tigres atravessando um rio, ilhas no mar, o infinito) são todas posteriores; o jardim ficou obscuro até que a rainha Elizabeth II o elogiou na visita de 1975 e o mundo descobriu. O tsukubai, a bacia de pedra no fundo, tem quatro caracteres que se leem com o quadrado do meio: "só sei o que basta". O Kyōyō-chi, o lago com a ilha, é o pedaço de Heian que sobrou, e em novembro é o lugar dos bordos.',
    ],
  },
  'd30-todaiji': {
    title: 'Tōdai-ji e o Grande Buda',
    jp: '東大寺',
    paragraphs: [
      'O imperador Shōmu viveu uma sequência de desastres (varíola que matou um terço da população, terremoto, revolta, fome) e concluiu que o remédio era religioso: em 743 ordenou uma estátua de Vairocana, o Buda cósmico, tão grande quanto a fé do país, e um templo que fosse o chefe de todos os templos provinciais. O Buda tem 15 m, 500 toneladas de bronze, e foi fundido em oito etapas em três anos, usando quase todo o cobre do Japão e o ouro que tinha acabado de ser descoberto no norte; a inauguração de 752, com 10.000 monges e um monge indiano pintando os olhos, foi a maior cerimônia da história antiga do país. O projeto arruinou o Estado.',
      'O salão queimou em 1180 (nas guerras Genpei, incendiado pelos Taira) e em 1567; o atual é de 1709, dois terços da largura do original e ainda um dos maiores prédios de madeira do mundo. O Buda atual é uma colagem: as pernas e o pedestal de lótus são do século VIII, o corpo do XII, a cabeça de 1692. O portão Nandaimon, de 1199, com os dois guardiões Niō de 8 m esculpidos em 69 dias por Unkei e Kaikei, é a obra-prima da escultura de Kamakura. O buraco no pilar do salão tem o tamanho da narina do Buda, e quem passa por ele, dizem, tem a iluminação garantida; adultos passam, com esforço.',
    ],
  },
  'd30-kasuga-taisha': {
    title: 'Kasuga Taisha e as 3.000 lanternas',
    jp: '春日大社',
    paragraphs: [
      'O clã Fujiwara, que governou o Japão de fato por 300 anos casando as filhas com os imperadores, fundou aqui em 768 o santuário da família, para quatro deuses, um dos quais chegou de Ibaraki montado num cervo branco. Os cervos de Nara descendem dessa história: eram sagrados, matar um dava pena de morte até 1637, e continuam soltos, 1.200 deles, curvando-se para pedir biscoito. O santuário era reconstruído a cada 20 anos, como Ise, até 1863; os salões vermelhos são dessa última reconstrução.',
      'As lanternas são a marca: 2.000 de pedra ao longo das alamedas, 1.000 de bronze penduradas nos corredores, doadas ao longo de 800 anos por samurais, mercadores e camponeses, com o nome gravado. São acesas todas de uma vez só duas vezes por ano, em fevereiro e em agosto, no festival Mantōrō. A floresta atrás do santuário, Kasuga-yama, é primária: a caça e o corte são proibidos desde 841, e é Patrimônio Mundial como parte de Nara. É uma das paisagens mais antigas intactas do Japão, a 15 minutos do centro da cidade.',
    ],
  },
  'd01-tofukuji': {
    title: 'Tōfuku-ji, o vale de bordos',
    jp: '東福寺',
    paragraphs: [
      'O regente Kujō Michiie, do clã Fujiwara, quis em 1236 um templo em Kyoto do tamanho dos dois grandes de Nara, e o nome é uma sílaba de cada: Tō-daiji e Kō-fuku-ji. Levou 19 anos, o fundador foi Enni Ben\'en, que estudara na China e trouxera com o zen as sementes de chá de Shizuoka, e o templo virou um dos "Cinco Montes" zen de Kyoto, com 25 subtemplos. O Sanmon de 1425 é o portão zen mais antigo do país; o banheiro, o salão de meditação e a casa de banho do século XIV são Bens Culturais porque o zen levava o cotidiano a sério e os prédios de serviço eram tão importantes quanto os de culto.',
      'O vale que corta o templo, Sengyoku-kan, tem 2.000 bordos, muitos de uma variedade chinesa de folha pequena e três pontas trazida pelo fundador, que amarela em vez de avermelhar, e três pontes cobertas passam por cima: a Tsūten-kyō, de 1380 (reconstruída em 1961), é a mais famosa vista de outono de Kyoto. Os jardins do Hōjō, de 1939, do paisagista Mirei Shigemori, são o momento em que o jardim zen virou moderno: um tabuleiro de xadrez de musgo e pedra, cilindros de pedra dispostos como a Ursa Maior, feitos com material de demolição. No pico de novembro o templo proíbe fotos nas pontes para a multidão andar; às 8h30, na abertura, não há multidão.',
    ],
  },
  'd02-jardim-imperial': {
    title: 'O Castelo de Edo, hoje Jardim Leste',
    jp: '皇居東御苑',
    paragraphs: [
      'O Jardim Leste é a parte do Castelo de Edo que se pode visitar: o *honmaru* e o *ninomaru*, os recintos centrais onde ficavam o palácio do xogum, com mil salas e o "corredor dos pinheiros" onde em 1701 um daimyō atacou um oficial e desencadeou a vingança dos 47 rōnin, e o torreão de cinco andares, o maior do Japão, que queimou no incêndio de 1657 e nunca foi refeito: um conselheiro disse que era enfeite inútil em tempo de paz. Sobrou a base de pedra, de 11 m, de onde se vê Marunouchi.',
      'O castelo tinha 16 km de fossos em espiral, dos quais boa parte está lá, e as muralhas de pedra foram construídas pelos daimyō do oeste, obrigados a mandar pedras de Izu de barco; os brasões deles estão gravados. Depois de 1868 virou o Palácio Imperial e o interior é fechado; o Jardim Leste abriu em 1968 e é gratuito. O terreno inteiro, 115 hectares, valia no papel, no auge da bolha de 1989, mais que todos os imóveis da Califórnia. Em novembro os bordos do jardim do ninomaru, plantado pelo paisagista dos Tokugawa, estão vermelhos.',
    ],
  },
  'd02-nihonbashi': {
    title: 'Nihonbashi, o quilômetro zero',
    jp: '日本橋',
    paragraphs: [
      'A "ponte do Japão" foi construída em 1603, o ano em que Ieyasu virou xogum, e no ano seguinte foi declarada o ponto de partida das cinco estradas do país: todas as distâncias do Japão se mediam daqui, e ainda se medem (a placa de bronze no meio da ponte é o marco zero das rodovias). Em volta ficava o mercado de peixe de Edo, os armazéns dos mercadores de Osaka, a casa da moeda de ouro (*kin-za*) e as lojas de quimono que viraram a Mitsukoshi (1673) e a Takashimaya. A ponte de madeira da estampa de Hiroshige foi refeita dez vezes; a de pedra atual, de 1911, com leões e dragões de bronze, tem o nome escrito pelo último xogum, Tokugawa Yoshinobu.',
      'Em 1963, para as Olimpíadas, a via expressa foi construída por cima da ponte, a metros da balaustrada, e por 60 anos o marco zero do Japão ficou na sombra de um viaduto. As obras para enterrar a via expressa começaram em 2021 e terminam em 2040; vocês vão ver a ponte no meio disso.',
    ],
  },
};

export const placeHistory = (stopId: string) => PLACE_HISTORIES[stopId];
export const cityHistory = (id: string) => CITY_HISTORIES.find((c) => c.id === id);
