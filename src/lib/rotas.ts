import { ALL_DAYS } from '@/data/days';
import { PLACE_MAPS } from '@/data/placeMaps';
import { MAPS_3D } from '@/lib/three/available';
import { CITY_HISTORIES, PLACE_HISTORIES, JAPAN_CHAPTERS } from '@/data/historia';

const ESTATICAS = [
  '/',
  '/roteiro',
  '/mapa',
  '/gastos',
  '/mais',
  '/mais/ajustes',
  '/mais/compras',
  '/mais/emergencia',
  '/mais/extras',
  '/mais/favoritos',
  '/mais/frases',
  '/mais/historia',
  '/mais/hoteis',
  '/mais/ingressos',
  '/mais/konbini',
  '/mais/logistica',
  '/mais/mala',
  '/mais/mapas',
  '/mais/reservas',
];

/**
 * Todas as páginas do app, para deixar o app inteiro no telefone antes de
 * viajar. As fotos já vão no cache de instalação; faltavam as páginas.
 */
export function todasAsRotas(): string[] {
  return [
    ...ESTATICAS,
    ...ALL_DAYS.map((d) => `/roteiro/${d.id}`),
    ...ALL_DAYS.map((d) => `/rua?day=${d.id}`),
    ...PLACE_MAPS.map((m) => `/lugar/${m.id}`),
    ...MAPS_3D.map((id) => `/3d/${id}`),
    ...CITY_HISTORIES.map((c) => `/mais/historia/${c.id}`),
    ...Object.keys(PLACE_HISTORIES).map((id) => `/mais/historia/${id}`),
    ...JAPAN_CHAPTERS.map((c) => `/mais/historia/japao/${c.id}`),
  ];
}
