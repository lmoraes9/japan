/** mapas que têm versão em 3D (sem importar o Three.js) */
export const MAPS_3D = ['fushimi-inari', 'sensoji', 'meiji-jingu', 'kamakura', 'miyajima', 'nara', 'higashiyama', 'arashiyama', 'parque-da-paz', 'himeji', 'tofukuji', 'kinkakuji', 'sumiyoshi', 'castelo-osaka', 'kurashiki', 'shibuya'];
export const has3D = (placeId: string) => MAPS_3D.includes(placeId);
