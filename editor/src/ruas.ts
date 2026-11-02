/** Ruas em volta das paradas (OpenStreetMap), no formato do ruas.json da pasta pública. */
type Linha = [number, number][];
export interface RuasDoLugar {
  grandes: Linha[];
  pequenas: Linha[];
  trilhos: Linha[];
}
export type Ruas = Record<string, RuasDoLugar>;

export const chaveRua = (lat: number, lng: number) => `${lat.toFixed(4)}_${lng.toFixed(4)}`;
