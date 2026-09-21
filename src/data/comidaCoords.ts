/**
 * Coordenadas dos lugares de comer do catálogo (src/data/comida.ts),
 * chaveadas por ComidaItem.id — o mesmo esquema de coords.ts para as paradas.
 *
 * São para o mapa responder "o que tem por perto?", não para navegar: o botão
 * de navegar usa a busca do Google pelo nome, que é exata. Os pontos foram
 * colocados pelo endereço, então valem para "está a duas quadras", não para
 * "é esta porta". Quem não está aqui (os konbini genéricos) não ganha estrela.
 */
export const COMIDA_COORDS: Record<string, { lat: number; lng: number }> = {
  // ── Tóquio · sushi ──
  'sushi-zanmai-akiba': { lat: 35.699, lng: 139.7717 },
  'midori-shinjuku': { lat: 35.6907, lng: 139.702 },
  'midori-shibuya': { lat: 35.6582, lng: 139.6993 }, // Shibuya Mark City
  uobei: { lat: 35.6577, lng: 139.6985 },
  'tsukiji-sushisei': { lat: 35.6653, lng: 139.7715 },
  'sushizanmai-honten': { lat: 35.6656, lng: 139.7708 },
  hanamaru: { lat: 35.6796, lng: 139.7645 }, // KITTE 5F
  'toyosu-sushi': { lat: 35.645, lng: 139.786 }, // prédio 6
  'midori-ginza': { lat: 35.6708, lng: 139.7635 },
  kyubey: { lat: 35.669, lng: 139.7616 },
  onodera: { lat: 35.6695, lng: 139.766 },
  'sushi-azabu': { lat: 35.6605, lng: 139.7415 }, // Azabudai Hills Tower Plaza
  'sushiro-akihabara': { lat: 35.6985, lng: 139.7725 },
  'tsukiji-uogashi': { lat: 35.6647, lng: 139.7693 }, // Odawarabashi

  // ── Tóquio · ramen, soba, chapa, katsu, curry ──
  'menya-musashi': { lat: 35.6947, lng: 139.6995 },
  ichiran: { lat: 35.6945, lng: 139.7013 },
  fuunji: { lat: 35.687, lng: 139.6998 },
  kikanbo: { lat: 35.6936, lng: 139.7705 },
  kagari: { lat: 35.6717, lng: 139.765 },
  'tokyo-ramen-street': { lat: 35.6809, lng: 139.7681 }, // First Avenue, lado Yaesu
  afuri: { lat: 35.6698, lng: 139.7065 },
  'yabu-soba': { lat: 35.7097, lng: 139.7751 },
  'gyoza-ro': { lat: 35.6683, lng: 139.706 },
  mansei: { lat: 35.6963, lng: 139.7708 },
  marugo: { lat: 35.6994, lng: 139.773 },
  'gyukatsu-depachika': { lat: 35.6716, lng: 139.7647 }, // Mitsukoshi Ginza
  maisen: { lat: 35.6688, lng: 139.7092 },
  wagyumafia: { lat: 35.644, lng: 139.699 }, // Nakameguro
  bondy: { lat: 35.6958, lng: 139.7576 },
  kyoeido: { lat: 35.6955, lng: 139.7592 },
  taimeiken: { lat: 35.6825, lng: 139.7745 },
  tamai: { lat: 35.6812, lng: 139.7752 },
  innsyotei: { lat: 35.7126, lng: 139.7731 },

  // ── Tóquio · mercado, depachika, rua, café, bar ──
  tsukiji: { lat: 35.6654, lng: 139.7707 },
  'tsukiji-manha': { lat: 35.6654, lng: 139.7707 },
  marutake: { lat: 35.666, lng: 139.77 },
  'ostras-tsukiji': { lat: 35.6657, lng: 139.7702 },
  toyosu: { lat: 35.645, lng: 139.786 },
  'depachika-ginza': { lat: 35.6716, lng: 139.7647 },
  'depachika-nihonbashi': { lat: 35.6866, lng: 139.7737 },
  'ameyoko-rua': { lat: 35.7104, lng: 139.7745 },
  'icho-matsuri': { lat: 35.6745, lng: 139.7174 },
  tomorrow: { lat: 35.7118, lng: 139.7955 },
  misojyu: { lat: 35.7126, lng: 139.7942 },
  omoide: { lat: 35.6938, lng: 139.6994 },
  triad: { lat: 35.6467, lng: 139.7086 },
  'golden-gai': { lat: 35.6942, lng: 139.7048 },

  // ── Kamakura ──
  'matsubara-an': { lat: 35.312, lng: 139.541 },
  'shirasu-don': { lat: 35.321, lng: 139.5522 },
  'kamakura-kohi': { lat: 35.3195, lng: 139.5518 },

  // ── Hiroshima e Miyajima ──
  nagataya: { lat: 34.3947, lng: 132.4531 },
  okonomimura: { lat: 34.3925, lng: 132.463 },
  hassei: { lat: 34.387, lng: 132.463 },
  bakudanya: { lat: 34.3948, lng: 132.4608 },
  suzumeya: { lat: 34.3945, lng: 132.4575 },
  'anago-ueno': { lat: 34.3116, lng: 132.303 }, // Miyajimaguchi
  'anago-wakana': { lat: 34.3, lng: 132.322 },
  'ostras-miyajima': { lat: 34.2985, lng: 132.321 },
  'momiji-manju': { lat: 34.2975, lng: 132.3215 },

  // ── Kurashiki, Osaka, Kōyasan ──
  kamoi: { lat: 34.595, lng: 133.7723 },
  tsurugata: { lat: 34.5955, lng: 133.7717 },
  daruma: { lat: 34.6688, lng: 135.5025 },
  takoyaki: { lat: 34.6672, lng: 135.504 }, // Wanaka Sennichimae
  mizuno: { lat: 34.6686, lng: 135.504 },
  hozenji: { lat: 34.6678, lng: 135.503 },
  kuromon: { lat: 34.6654, lng: 135.5062 },
  'depachika-namba': { lat: 34.664, lng: 135.502 },
  butaman: { lat: 34.665, lng: 135.5015 }, // 551 Hōrai honten
  'shojin-koyasan': { lat: 34.2145, lng: 135.5868 }, // Fumon-in

  // ── Kyoto ──
  musashi: { lat: 35.0088, lng: 135.769 },
  izuu: { lat: 35.004, lng: 135.7745 },
  'gion-tanto': { lat: 35.0035, lng: 135.7752 },
  pontocho: { lat: 35.006, lng: 135.771 },
  omen: { lat: 35.0244, lng: 135.7935 },
  yoshimura: { lat: 35.013, lng: 135.6775 },
  hisago: { lat: 35.0, lng: 135.779 },
  okutan: { lat: 35.011, lng: 135.7935 },
  shigetsu: { lat: 35.0158, lng: 135.6737 },
  nishiki: { lat: 35.005, lng: 135.7649 },
  'tako-tamago': { lat: 35.005, lng: 135.7649 },
  tsukemono: { lat: 35.005, lng: 135.7649 },
  'donut-konnamonja': { lat: 35.005, lng: 135.761 },
  torisei: { lat: 34.9325, lng: 135.7585 },
  kizakura: { lat: 34.9325, lng: 135.7595 },
  otesuji: { lat: 34.9335, lng: 135.7575 },
  'kyoto-ramen-koji': { lat: 34.9858, lng: 135.7588 },
  'isetan-kyoto': { lat: 34.9856, lng: 135.7585 },
  'sushiro-kawaramachi': { lat: 35.0055, lng: 135.7675 },
  'ichiran-kawaramachi': { lat: 35.0056, lng: 135.7674 },
  'onimaru-kawaramachi': { lat: 35.008, lng: 135.769 },
  karafuneya: { lat: 35.0083, lng: 135.7688 },
  'arabica-higashiyama': { lat: 34.999, lng: 135.78 },
  'hatoya-arashiyama': { lat: 35.0128, lng: 135.6785 },

  // ── Nara ──
  kakinoha: { lat: 34.6825, lng: 135.83 },
  tengyokudo: { lat: 34.6845, lng: 135.829 },
  azekuraya: { lat: 34.687, lng: 135.84 },
  nakatanido: { lat: 34.682, lng: 135.83 },
};
