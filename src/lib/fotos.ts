import type { Stop } from '@/data/types';
import type { PlaceMap, PlacePhoto } from '@/data/placeMaps';
import { PLACE_MAPS, photoKey } from '@/data/placeMaps';
import { PLACE_PHOTOS } from '@/data/placePhotos.generated';

export interface FotoDeLugar {
  photo: PlacePhoto;
  /** o que esta foto mostra, quando não é só "o lugar" */
  legenda?: string;
}

/**
 * Quando o id da parada não é o id do ponto no mapa ilustrado.
 *
 * Na maioria dos casos bate sozinho — 'd28-kiyomizu' encontra o ponto
 * 'kiyomizu'. Estes são os que foram batizados diferente dos dois lados.
 */
const APELIDO: Record<string, string> = {
  'd19-sensoji': 'kaminarimon',
  'd20-trem-kamakura': 'kita-kamakura',
  'd20-enoden': 'estacao',
  'd22-meiji-jingu': 'otorii',
  'd22-omotesando': 'takeshita',
  'd23-museu-paz': 'museu',
  'd23-parque-domo': 'domo',
  'd23-okonomiyaki': 'okonomimura',
  'd24-ferry-miyajima': 'balsa',
  'd24-comer-miyajima': 'omotesando',
  'd25-himeji': 'tenshu',
  'd27-fushimi-inari': 'senbon',
  'd29-okochi-sanso': 'okochi',
  'd30-trem-nara': 'estacao',
  'd30-parque-nara': 'cervos',
  'd30-todaiji': 'daibutsuden',
  'd30-kasuga-taisha': 'kasuga',
};

/** o ponto do mapa que é esta parada, quando existe */
function pontoDaParada(stop: Pick<Stop, 'id'>, mapa: PlaceMap) {
  const alvo = APELIDO[stop.id] ?? stop.id.replace(/^d\d\d-/, '');
  return mapa.hotspots.find((h) => h.id === alvo);
}

const fotosDoMapa = (mapa: PlaceMap, primeiro?: string): { id: string; photo?: PlacePhoto; legenda: string }[] => {
  const ordenados = [...mapa.hotspots].sort(
    (a, b) => Number(b.id === primeiro) - Number(a.id === primeiro),
  );
  return ordenados.map((h) => ({
    id: h.id,
    photo: PLACE_PHOTOS[photoKey(mapa.id, h.id)],
    legenda: h.photoCaption ?? h.title,
  }));
};

/**
 * Todas as fotos de uma parada, em ordem.
 *
 * Três fontes, nesta ordem de preferência:
 *
 * 1. a foto da própria parada, e as extras que o buscador tiver baixado para
 *    ela (`stops/<id>-2`, `-3`…);
 * 2. os pontos do mapa ilustrado, quando a parada É o lugar do mapa — o Meiji
 *    Jingū tem nove pontos e cada um tem a sua foto;
 * 3. quando a parada é um dos pontos do mapa daquele dia sem ser o lugar-sede
 *    dele: o Kiyomizu, o Sannenzaka e o Kōdai-ji são três paradas do dia 28 e
 *    três pontos do mesmo mapa de Higashiyama. Aí a foto do ponto certo vem
 *    primeiro e o resto do passeio vem atrás, cada uma com o seu nome.
 */
export function fotosDaParada(stop: Pick<Stop, 'id' | 'placeMapId'>, dayId?: string): FotoDeLugar[] {
  const fotos: FotoDeLugar[] = [];
  const vistas = new Set<string>();
  const juntar = (photo: PlacePhoto | undefined, legenda?: string) => {
    if (!photo || vistas.has(photo.src)) return;
    vistas.add(photo.src);
    fotos.push({ photo, legenda });
  };

  const propria = PLACE_PHOTOS[`stops/${stop.id}`];
  const sede = stop.placeMapId ? PLACE_MAPS.find((m) => m.id === stop.placeMapId) : undefined;

  if (sede) {
    // a parada é o lugar do mapa: a capa primeiro, depois os pontos
    juntar(propria);
    for (const f of fotosDoMapa(sede, sede.coverHotspotId)) juntar(f.photo, f.legenda);
  } else {
    const doDia = dayId ? PLACE_MAPS.find((m) => m.dayId === dayId) : undefined;
    const ponto = doDia ? pontoDaParada(stop, doDia) : undefined;
    if (doDia && ponto) {
      // a parada é um ponto do passeio: a foto dela primeiro, o resto atrás
      juntar(PLACE_PHOTOS[photoKey(doDia.id, ponto.id)], ponto.photoCaption ?? ponto.title);
      juntar(propria);
      for (const f of fotosDoMapa(doDia)) juntar(f.photo, f.legenda);
    } else {
      juntar(propria);
    }
  }

  // extras baixadas para a própria parada, quando houver
  for (let n = 2; n <= 6; n += 1) juntar(PLACE_PHOTOS[`stops/${stop.id}-${n}`]);

  return fotos;
}
