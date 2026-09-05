import type { Day, StageId, Stop } from '@/data/types';
import type { PlaceMap, PlacePhoto } from '@/data/placeMaps';
import { photoKey, placeMapByStopId } from '@/data/placeMaps';
import { PLACE_PHOTOS } from '@/data/placePhotos.generated';

/** foto de uma parada do roteiro, se o CI baixou uma */
export const stopPhoto = (stop: Pick<Stop, 'id'>): PlacePhoto | undefined =>
  PLACE_PHOTOS[`stops/${stop.id}`];

/** capa de um mapa ilustrado: o ponto escolhido no mapa, ou a foto da parada */
export const mapCover = (map: Pick<PlaceMap, 'id' | 'coverHotspotId' | 'stopId'>): PlacePhoto | undefined =>
  PLACE_PHOTOS[photoKey(map.id, map.coverHotspotId)] ?? PLACE_PHOTOS[`stops/${map.stopId}`];

/** capa de um dia: a primeira parada "de lugar" com foto (pula comida e trem) */
export function dayCover(day: Pick<Day, 'stops'>): PlacePhoto | undefined {
  // se o dia tem mapa ilustrado, a capa do mapa é a melhor foto do dia
  for (const s of day.stops) {
    const m = placeMapByStopId(s.id);
    if (m) {
      const c = mapCover(m);
      if (c) return c;
    }
  }
  const ordem = [...day.stops].sort((a, b) => {
    const peso = (s: Stop) => (s.kind === 'food' || s.kind === 'transit' || s.kind === 'hotel' || s.kind === 'flight' ? 1 : 0);
    return peso(a) - peso(b);
  });
  for (const s of ordem) {
    const p = stopPhoto(s);
    if (p) return p;
  }
  return undefined;
}

/** foto de fundo do cabeçalho de cada etapa do roteiro */
const STAGE_COVERS: Record<StageId, string> = {
  tokyo1: 'sensoji/kaminarimon',
  hiroshima: 'miyajima/otorii',
  osaka: 'stops/d26-castelo-osaka',
  kyoto: 'fushimi-inari/senbon',
  tokyo2: 'stops/d02-jardim-imperial',
};
export const stageCover = (stageId: StageId): PlacePhoto | undefined => PLACE_PHOTOS[STAGE_COVERS[stageId]];
