import * as THREE from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import type { Trecho } from '@/lib/mapa-japao/rota';
import { ALTURA_TERRA, proj } from './diorama';

/** um trecho já percorrido, o de hoje, ou um que ainda vem */
export type Momento = 'passado' | 'hoje' | 'futuro';

export interface Linha {
  grupo: THREE.Group;
  /** a largura é em pixels, e o material precisa saber o tamanho da tela */
  redimensionar: (largura: number, altura: number) => void;
  /** os traços do tracejado medem sempre os mesmos pixels, em qualquer zoom */
  escalar: (mundoPorPx: number) => void;
  dispose: () => void;
}

/** um fio acima do chão, para não brigar com a terra pela profundidade */
const ALTURA = ALTURA_TERRA + 0.6;
const CINZA = 0x8b949c;

/** os dois dias e as passagens do corredor entre eles, suavizados numa curva */
function pontosDe(t: Trecho): number[] {
  const brutos = [[t.de.lng, t.de.lat], ...t.passagens, [t.para.lng, t.para.lat]].map(([lng, lat]) => {
    const [x, z] = proj(lng, lat);
    return new THREE.Vector3(x, ALTURA, z);
  });
  const lista =
    brutos.length > 2
      ? new THREE.CatmullRomCurve3(brutos, false, 'catmullrom', 0.15).getPoints(brutos.length * 10)
      : brutos;
  return lista.flatMap((p) => [p.x, p.y, p.z]);
}

/**
 * A linha da viagem desenhada no chão do diorama, um traço por trecho. O
 * trecho de hoje ganha um halo branco por baixo; os já percorridos ficam
 * cinza; os que voltam a uma cidade conhecida são tracejados.
 */
export function construirLinha(trechos: Trecho[], momentoDe: (t: Trecho) => Momento): Linha {
  const grupo = new THREE.Group();
  const materiais: LineMaterial[] = [];
  const geometrias: LineGeometry[] = [];

  const tracar = (pontos: number[], mat: LineMaterial, ordem: number) => {
    const geo = new LineGeometry();
    geo.setPositions(pontos);
    const linha = new Line2(geo, mat);
    linha.computeLineDistances();
    linha.renderOrder = ordem;
    linha.raycast = () => {};
    grupo.add(linha);
    materiais.push(mat);
    geometrias.push(geo);
  };

  for (const t of trechos) {
    const pontos = pontosDe(t);
    const cor = new THREE.Color(t.cor).getHex();
    const comum = { transparent: true, depthWrite: false, dashed: t.volta };
    switch (momentoDe(t)) {
      case 'hoje':
        tracar(pontos, new LineMaterial({ ...comum, dashed: false, color: 0xffffff, linewidth: 7, opacity: 0.9 }), 1);
        tracar(pontos, new LineMaterial({ ...comum, color: cor, linewidth: 3.5, opacity: 1 }), 2);
        break;
      case 'passado':
        tracar(pontos, new LineMaterial({ ...comum, color: CINZA, linewidth: 2.5, opacity: 0.6 }), 0);
        break;
      default:
        tracar(pontos, new LineMaterial({ ...comum, color: cor, linewidth: 3, opacity: 0.95 }), 0);
    }
  }

  return {
    grupo,
    redimensionar: (largura, altura) => {
      for (const m of materiais) m.resolution.set(largura, altura);
    },
    escalar: (mundoPorPx) => {
      for (const m of materiais) {
        if (!m.dashed) continue;
        m.dashScale = 1 / mundoPorPx;
        m.dashSize = 9;
        m.gapSize = 7;
      }
    },
    dispose: () => {
      for (const g of geometrias) g.dispose();
      for (const m of materiais) m.dispose();
    },
  };
}
