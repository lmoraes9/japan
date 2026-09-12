import type { Stop } from '@/data/types';
import type { PlacePhoto } from '@/data/placeMaps';
import { PLACE_MAPS, photoKey } from '@/data/placeMaps';
import { PLACE_PHOTOS } from '@/data/placePhotos.generated';

export interface FotoDeLugar {
  photo: PlacePhoto;
  /** o que esta foto mostra, quando não é só "o lugar" */
  legenda?: string;
}

/**
 * Todas as fotos de uma parada, em ordem.
 *
 * A primeira é a foto da própria parada. Depois vêm as dos pontos do mapa
 * ilustrado daquele lugar, quando ele tem um — o Meiji Jingū tem nove, o
 * Sensō-ji tem dez, e até hoje o roteiro mostrava uma só. Cada uma entra com
 * o nome do ponto por legenda, que é mais útil que repetir o nome do lugar.
 */
export function fotosDaParada(stop: Pick<Stop, 'id' | 'placeMapId'>): FotoDeLugar[] {
  const fotos: FotoDeLugar[] = [];
  const vistas = new Set<string>();
  const juntar = (photo: PlacePhoto | undefined, legenda?: string) => {
    if (!photo || vistas.has(photo.src)) return;
    vistas.add(photo.src);
    fotos.push({ photo, legenda });
  };

  juntar(PLACE_PHOTOS[`stops/${stop.id}`]);

  const mapa = stop.placeMapId ? PLACE_MAPS.find((m) => m.id === stop.placeMapId) : undefined;
  if (mapa) {
    // a capa do mapa primeiro, para a foto de abertura ser a melhor do lugar
    const ordenados = [...mapa.hotspots].sort(
      (a, b) => Number(b.id === mapa.coverHotspotId) - Number(a.id === mapa.coverHotspotId),
    );
    for (const h of ordenados) {
      juntar(PLACE_PHOTOS[photoKey(mapa.id, h.id)], h.photoCaption ?? h.title);
    }
  }

  return fotos;
}
