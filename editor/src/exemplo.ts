import type { Plano } from './plano.ts';

/** plano mínimo, sem mídia, para abrir o Studio (`npm run studio`) e mexer no visual dos mapas */
export const exemplo: Plano = {
  titulo: 'exemplo',
  formato: 'reel',
  segmentos: [
    {
      tipo: 'mapa',
      escala: 'regiao',
      quando: '23 nov',
      titulo: 'Tóquio → Hiroshima',
      legenda: 'Shinkansen Nozomi · 3h55',
      modos: ['shinkansen'],
      pontos: [
        { nome: 'Tóquio', jp: '東京', lat: 35.6812, lng: 139.7671 },
        { nome: 'Hiroshima', jp: '広島', lat: 34.3977, lng: 132.4753 },
      ],
      contexto: [
        { nome: 'Osaka', lat: 34.6937, lng: 135.5023 },
        { nome: 'Kyoto', lat: 35.0116, lng: 135.7681 },
      ],
      segundos: 5,
    },
  ],
};
