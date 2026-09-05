import type { SceneSpec } from '../engine';

/** carrega o spec de um lugar sob demanda (cada um é um chunk separado) */
export async function loadScene(id: string): Promise<SceneSpec | null> {
  switch (id) {
    case 'fushimi-inari': return (await import('./fushimi-inari')).default;
    case 'sensoji': return (await import('./sensoji')).default;
    case 'meiji-jingu': return (await import('./meiji-jingu')).default;
    case 'kamakura': return (await import('./kamakura')).default;
    case 'miyajima': return (await import('./miyajima')).default;
    case 'nara': return (await import('./nara')).default;
    case 'higashiyama': return (await import('./higashiyama')).default;
    case 'arashiyama': return (await import('./arashiyama')).default;
    case 'parque-da-paz': return (await import('./parque-da-paz')).default;
    case 'himeji': return (await import('./himeji')).default;
    case 'tofukuji': return (await import('./tofukuji')).default;
    case 'kinkakuji': return (await import('./kinkakuji')).default;
    case 'sumiyoshi': return (await import('./sumiyoshi')).default;
    case 'castelo-osaka': return (await import('./castelo-osaka')).default;
    case 'kurashiki': return (await import('./kurashiki')).default;
    case 'shibuya': return (await import('./shibuya')).default;
    default: return null;
  }
}
