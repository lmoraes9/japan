/**
 * Coordenadas dos marcos do roteiro, chaveadas por Stop.id.
 * Paradas genéricas (refeição sem local fixo, trechos de trem) não têm pin.
 */
export const COORDS: Record<string, { lat: number; lng: number }> = {
  // ── Tóquio I ──
  'd18-haneda': { lat: 35.5494, lng: 139.7798 },
  'd18-ramen': { lat: 35.6938, lng: 139.6994 }, // Omoide Yokochō
  'd19-sensoji': { lat: 35.7148, lng: 139.7967 },
  'd19-kuramae': { lat: 35.7062, lng: 139.7907 }, // Pelican Café
  'd19-kappabashi': { lat: 35.7139, lng: 139.7886 },
  'd19-museu-nacional': { lat: 35.7188, lng: 139.7765 },
  'd19-almoco-ueno': { lat: 35.7126, lng: 139.7731 }, // Innsyōtei, Ueno Park
  'd19-ameyoko': { lat: 35.7104, lng: 139.7745 },
  'd19-akihabara': { lat: 35.7022, lng: 139.7741 },
  'd19-jantar': { lat: 35.6936, lng: 139.7705 }, // Kikanbō, Kanda
  'd20-engakuji': { lat: 35.3378, lng: 139.5482 },
  'd20-kenchoji': { lat: 35.3312, lng: 139.5539 },
  'd20-hachimangu': { lat: 35.3251, lng: 139.5565 },
  'd20-komachi': { lat: 35.321, lng: 139.5522 },
  'd20-daibutsu': { lat: 35.3167, lng: 139.5358 },
  'd20-hasedera': { lat: 35.3126, lng: 139.533 },
  'd21-tsukiji': { lat: 35.6654, lng: 139.7707 },
  'd21-hamarikyu': { lat: 35.6604, lng: 139.7633 },
  'd21-almoco-ginza': { lat: 35.6717, lng: 139.765 }, // Ginza Kagari
  'd21-ginza': { lat: 35.6712, lng: 139.764 },
  'd21-kitte': { lat: 35.6796, lng: 139.7645 },
  'd21-jantar-estacao': { lat: 35.6812, lng: 139.7671 }, // Estação de Tóquio
  'd22-meiji-jingu': { lat: 35.6764, lng: 139.6993 },
  'd22-omotesando': { lat: 35.667, lng: 139.71 },
  'd22-almoco': { lat: 35.6698, lng: 139.7065 }, // Afuri Harajuku
  'd22-gaien': { lat: 35.6745, lng: 139.7174 },
  'd22-shibuya-sky': { lat: 35.6584, lng: 139.7023 },
  'd22-cruzamento': { lat: 35.6595, lng: 139.7005 },
  'd22-jantar': { lat: 35.658, lng: 139.6994 }, // Shibuya Mark City

  // ── Hiroshima ──
  'd23-chegada': { lat: 34.3978, lng: 132.4754 }, // Estação de Hiroshima
  'd23-museu-paz': { lat: 34.3917, lng: 132.4525 },
  'd23-parque-domo': { lat: 34.3955, lng: 132.4536 },
  'd23-okonomiyaki': { lat: 34.3947, lng: 132.4531 }, // Nagataya
  'd24-itsukushima': { lat: 34.296, lng: 132.3198 },
  'd24-daishoin': { lat: 34.2926, lng: 132.3175 },
  'd24-momijidani': { lat: 34.2934, lng: 132.323 },
  'd24-misen': { lat: 34.2886, lng: 132.3199 },
  'd24-shukkeien': { lat: 34.4013, lng: 132.4677 },

  // ── Osaka ──
  'd25-bikan': { lat: 34.5951, lng: 133.7719 },
  'd25-ohara': { lat: 34.5967, lng: 133.771 },
  'd25-himeji': { lat: 34.8394, lng: 134.6939 },
  'd25-dotonbori': { lat: 34.6687, lng: 135.5013 },
  'd26-castelo-osaka': { lat: 34.6873, lng: 135.5262 },
  'd26-kuromon': { lat: 34.6654, lng: 135.5062 },
  'd26-shitennoji': { lat: 34.6533, lng: 135.5164 },
  'd26-shinsekai': { lat: 34.6525, lng: 135.5063 }, // Tsūtenkaku
  'd26-umeda': { lat: 34.7052, lng: 135.4903 }, // Umeda Sky

  // ── Kyoto & Nara ──
  'd27-sumiyoshi': { lat: 34.6124, lng: 135.4932 },
  'd27-fushimi-inari': { lat: 34.9671, lng: 135.7727 },
  'd28-kiyomizu': { lat: 34.9949, lng: 135.785 },
  'd28-sannenzaka': { lat: 34.9966, lng: 135.781 },
  'd28-kodaiji': { lat: 35.0007, lng: 135.781 },
  'd28-ginkakuji': { lat: 35.027, lng: 135.7982 },
  'd28-filosofo': { lat: 35.0192, lng: 135.7955 },
  'd28-nanzenji': { lat: 35.0116, lng: 135.7943 },
  'd28-eikando': { lat: 35.0146, lng: 135.7942 },
  'd28-gion': { lat: 35.0037, lng: 135.771 },
  'd29-bambu': { lat: 35.017, lng: 135.671 },
  'd29-tenryuji': { lat: 35.0158, lng: 135.6737 },
  'd29-okochi-sanso': { lat: 35.0186, lng: 135.669 },
  'd29-togetsukyo': { lat: 35.0125, lng: 135.6779 },
  'd29-kinkakuji': { lat: 35.0394, lng: 135.7292 },
  'd29-ryoanji': { lat: 35.0345, lng: 135.7183 },
  'd29-nishiki': { lat: 35.005, lng: 135.7649 },
  'd30-parque-nara': { lat: 34.6851, lng: 135.843 },
  'd30-todaiji': { lat: 34.689, lng: 135.8398 },
  'd30-nigatsudo': { lat: 34.6891, lng: 135.8465 },
  'd30-kasuga-taisha': { lat: 34.6813, lng: 135.8484 },
  'd30-kofukuji': { lat: 34.683, lng: 135.8318 },
  'd30-naramachi': { lat: 34.6788, lng: 135.8306 },
  'd01-tofukuji': { lat: 34.9764, lng: 135.774 },
  'd01-sanjusangendo': { lat: 34.988, lng: 135.7715 },
  'd01-checkin-compras': { lat: 35.6712, lng: 139.764 }, // Ginza

  // ── Tóquio II ──
  'd02-jardim-imperial': { lat: 35.6863, lng: 139.7573 },
  'd02-nihonbashi': { lat: 35.684, lng: 139.7745 },
  'd02-compras-finais': { lat: 35.6749, lng: 139.7628 }, // Bic Camera Yūrakuchō
  'd03-haneda': { lat: 35.5494, lng: 139.7798 },
};
