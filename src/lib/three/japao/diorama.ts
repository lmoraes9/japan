import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { ILHAS } from './costa';
import { FUJI, BIWA } from './lugares';
import { MAT, add, box, cyl, toriiGeometry } from '../parts';
import { group, castle, pagoda, buddha, domeRuin, kura, tower, bigTorii, hall, deerGeometry, gate2, stage, bridge } from '../buildings';

/**
 * O diorama do Japão. É só figura: nenhum objeto desta cena responde a toque.
 * No fim da montagem toda a árvore recebe `raycast` vazio, para que nem por
 * engano alguém consiga transformar um marco de 20 px num alvo de dedo — foi
 * exatamente isso que tornou a tela anterior impossível de usar.
 */

/** graus por unidade da cena: o Japão inteiro cabe em ~700 unidades */
const K = 55;
const LAT0 = 37.5;
const LNG0 = 137.5;
const COS0 = Math.cos((LAT0 * Math.PI) / 180);
/** longitude/latitude → x/z da cena (equirretangular, boa nesta escala) */
export function proj(lng: number, lat: number): [number, number] {
  return [(lng - LNG0) * COS0 * K, -(lat - LAT0) * K];
}

const ESPESSURA = 5;
export const ALTURA_TERRA = ESPESSURA;

const MAT_TERRA = new THREE.MeshStandardMaterial({ color: 0x7d8a63, roughness: 0.95 });
const MAT_BORDA = new THREE.MeshStandardMaterial({ color: 0xcbb992, roughness: 1 });
const MAT_MAR = new THREE.MeshStandardMaterial({ color: 0x5e87a6, roughness: 0.35, metalness: 0.18 });
const MAT_MONTE = new THREE.MeshStandardMaterial({ color: 0x6b7856, roughness: 1 });
const MAT_NEVE = new THREE.MeshStandardMaterial({ color: 0xf2f4f7, roughness: 0.8 });
const MAT_TELHADO = new THREE.MeshStandardMaterial({ color: 0x8f97a3, roughness: 0.75, side: THREE.DoubleSide });
const MAT_BAMBU = new THREE.MeshStandardMaterial({ color: 0x7fa35a, roughness: 0.8 });
/** o branco do avião, o mesmo branco do trem-bala */
const MAT_AVIAO = new THREE.MeshStandardMaterial({ color: 0xf4f6f8, roughness: 0.4, metalness: 0.1 });
const MAT_SOMBRA = new THREE.MeshBasicMaterial({ color: 0x2a3326, transparent: true, opacity: 0.17, depthWrite: false });
/**
 * Tamanho de referência dos ícones. A cena guarda todos com esta altura e a
 * tela depois os reescala conforme a distância da câmera, para que um ícone
 * ocupe sempre os mesmos pixels: de longe eles não viram alfinetes, de perto
 * não viram torres. Sem isso, aproximar em Kyoto encheria a tela de um
 * torii de oito quilômetros de altura.
 */
export const ALTURA_ICONE = 26;

function pontoDentro(anel: [number, number][], x: number, y: number) {
  let dentro = false;
  for (let i = 0, j = anel.length - 1; i < anel.length; j = i++) {
    const [xi, yi] = anel[i];
    const [xj, yj] = anel[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) dentro = !dentro;
  }
  return dentro;
}

function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** As ilhas, extrudadas como um diorama de mesa. */
function ilhas(pai: THREE.Object3D) {
  for (const ilha of ILHAS) {
    const forma = new THREE.Shape();
    ilha.anel.forEach(([lng, lat], i) => {
      const [x, z] = proj(lng, lat);
      if (i === 0) forma.moveTo(x, -z);
      else forma.lineTo(x, -z);
    });
    const geo = new THREE.ExtrudeGeometry(forma, {
      depth: ESPESSURA,
      bevelEnabled: true,
      bevelThickness: 1.1,
      bevelSize: 1.1,
      bevelSegments: 2,
    });
    geo.rotateX(-Math.PI / 2);
    geo.translate(0, ESPESSURA, 0);
    const m = new THREE.Mesh(geo, [MAT_TERRA, MAT_BORDA]);
    m.receiveShadow = true;
    m.castShadow = true;
    m.userData.ilha = ilha.id;
    pai.add(m);
  }
}

/** A espinha de montanhas, semeada só onde há terra e longe dos marcos. */
function montanhas(pai: THREE.Object3D, leve: boolean, evitar: { lat: number; lng: number }[] = []) {
  const honshu = ILHAS.find((i) => i.id === 'honshu')!;
  const outras = ILHAS.filter((i) => ['hokkaido', 'kyushu', 'shikoku'].includes(i.id));
  const rng = mulberry32(20261118);
  const geos: THREE.BufferGeometry[] = [];
  const alvo = leve ? 90 : 190;
  let tentativas = 0;
  while (geos.length < alvo && tentativas < alvo * 60) {
    tentativas++;
    const lng = 129 + rng() * 17;
    const lat = 30.5 + rng() * 15.5;
    const emHonshu = pontoDentro(honshu.anel, lng, lat);
    const emOutra = !emHonshu && outras.some((i) => pontoDentro(i.anel, lng, lat));
    if (!emHonshu && !emOutra) continue;
    if (Math.hypot(lng - FUJI.lng, lat - FUJI.lat) < 0.8) continue;
    // não encostar nos lugares da viagem: o ícone é que tem de ser visto
    if (evitar.some((l) => Math.hypot((lng - l.lng) * COS0, lat - l.lat) < 0.42)) continue;
    const [x, z] = proj(lng, lat);
    const alta = emHonshu && lat > 34.9 && lat < 38.6 && lng > 136.2 && lng < 140.4; // Alpes
    const h = (alta ? 6 : 2.6) + rng() * (alta ? 6 : 3);
    const r = h * (0.5 + rng() * 0.28);
    const g = new THREE.ConeGeometry(r, h, leve ? 5 : 6);
    g.translate(x, ESPESSURA + h / 2 - 0.8, z);
    geos.push(g);
  }
  const merge = mergeSimples(geos);
  if (merge) {
    const m = new THREE.Mesh(merge, MAT_MONTE);
    m.castShadow = !leve;
    m.receiveShadow = true;
    pai.add(m);
  }

  // o Fuji, no lugar certo, com a neve encaixada no cone
  const [fx, fz] = proj(FUJI.lng, FUJI.lat);
  const H = 30;
  const R = 13;
  const base = new THREE.Mesh(new THREE.ConeGeometry(R, H, 28), MAT_MONTE);
  base.position.set(fx, ESPESSURA + H / 2 - 1, fz);
  base.castShadow = !leve;
  base.receiveShadow = true;
  pai.add(base);
  // a neve é o topo do mesmo cone: raio proporcional à altura que sobra
  const frac = 0.34;
  const neve = new THREE.Mesh(new THREE.ConeGeometry(R * frac, H * frac, 28), MAT_NEVE);
  neve.position.set(fx, ESPESSURA + H - 1 - (H * frac) / 2 + 0.05, fz);
  pai.add(neve);
}

/** O lago Biwa, que o contorno da costa do Natural Earth não traz. */
function paisagem(pai: THREE.Object3D) {
  const [bx, bz] = proj(BIWA.lng, BIWA.lat);
  const lago = new THREE.Mesh(new THREE.CircleGeometry(1, 28), MAT_MAR);
  lago.rotation.x = -Math.PI / 2;
  lago.scale.set(BIWA.rx * COS0 * K, BIWA.rz * K, 1);
  lago.position.set(bx, ESPESSURA + 0.15, bz);
  pai.add(lago);
}

/** Uma miniatura por mapa ilustrado: a mesma linguagem dos marcos, menor. */
function miniatura(pai: THREE.Object3D, mapaId: string): THREE.Object3D {
  const g = new THREE.Group();
  pai.add(g);
  switch (mapaId) {
    case 'fushimi-inari': {
      for (let i = 0; i < 4; i++) {
        const t = new THREE.Mesh(toriiGeometry(5, 7, 0.45), MAT.vermilion);
        t.position.set(0, 0, -i * 2.4);
        g.add(t);
      }
      break;
    }
    case 'sensoji':
      gate2(group(g, 0, 0, 3, 0), { w: 9, d: 3.5, lanternBig: true });
      pagoda(group(g, 7, 0, -4, 0), 5, 4.5);
      break;
    case 'meiji-jingu':
      bigTorii(g, 0, 0, 0, 0, 10, 12, MAT.wood);
      break;
    case 'shibuya':
      tower(group(g, -4, 0, 0, 0), 5, 5, 16, { color: 0x6f7784, screen: true });
      tower(group(g, 5, 0, 2, 0.3), 4, 4, 11, { color: 0x8a919c });
      break;
    case 'castelo-osaka':
      castle(group(g, 0, 0, 0, 0), { tiers: 5, size: 9, base: 5 });
      break;
    case 'himeji':
      castle(group(g, 0, 0, 0, 0), { tiers: 5, size: 9, base: 4, turrets: true });
      break;
    case 'sumiyoshi': {
      bridge(g, new THREE.Vector3(-7, 0, 0), new THREE.Vector3(7, 0, 0), { kind: 'arch', width: 3.5 });
      break;
    }
    case 'kinkakuji': {
      const pavilhao = group(g, 0, 0, 0, 0);
      hall(pavilhao, { bays: 3, depthBays: 2, bay: 3, two: true, gold: true });
      // no mapa o pavilhão é visto de cima, e de cima só se vê telhado: sem
      // dourá-lo também, o Pavilhão Dourado chega cinza
      pavilhao.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh && m.material !== MAT.stone) m.material = MAT.gold;
      });
      break;
    }
    case 'arashiyama': {
      for (let i = 0; i < 14; i++) {
        const a = (i / 14) * Math.PI * 2;
        const r = 3 + (i % 3) * 1.6;
        const h = 10 + (i % 4) * 2;
        add(g, cyl(0.28, 0.34, h, 6), MAT_BAMBU, Math.cos(a) * r, h / 2, Math.sin(a) * r);
      }
      break;
    }
    case 'higashiyama':
      stage(group(g, 0, 0, 0, 0), 16, 10, 9);
      break;
    case 'tofukuji':
      bridge(g, new THREE.Vector3(-8, 4, 0), new THREE.Vector3(8, 4, 0), { kind: 'covered', width: 3 });
      add(g, box(1.2, 4, 1.2), MAT.wood, -5, 2, 0);
      add(g, box(1.2, 4, 1.2), MAT.wood, 5, 2, 0);
      break;
    case 'kamakura':
      buddha(group(g, 0, 0, 0, 0), 1);
      break;
    case 'parque-da-paz':
      domeRuin(group(g, 0, 0, 0, 0));
      break;
    case 'miyajima':
      bigTorii(g, 0, 0, 0, 0, 10, 12);
      break;
    case 'kurashiki':
      kura(group(g, 0, 0, 0, 0), { w: 7, d: 6, h: 7 });
      break;
    case 'nara': {
      const v = new THREE.Mesh(deerGeometry(), MAT.woodLight);
      v.scale.setScalar(2.4);
      g.add(v);
      hall(group(g, 0, 0, -6, 0), { bays: 3, depthBays: 2, bay: 2.6 });
      break;
    }
    case 'aviao': {
      // o avião da chegada e o da volta
      const fus = new THREE.Mesh(new THREE.CapsuleGeometry(1.5, 11, 6, 12), MAT_AVIAO);
      fus.rotation.z = Math.PI / 2;
      fus.position.y = 3;
      g.add(fus);
      const asa = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.5, 15), MAT_AVIAO);
      asa.position.set(0, 3, 0);
      g.add(asa);
      const cauda = new THREE.Mesh(new THREE.BoxGeometry(2.4, 4, 0.5), MAT.vermilion);
      cauda.position.set(-6, 5, 0);
      g.add(cauda);
      const estab = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.4, 6), MAT_AVIAO);
      estab.position.set(-6, 3.2, 0);
      g.add(estab);
      break;
    }
    case 'mercado': {
      // as barracas de Tsukiji e as vitrines da Ginza
      for (let i = 0; i < 3; i++) {
        const x = (i - 1) * 6;
        add(g, box(5, 3.4, 5), MAT.plaster, x, 1.7, 0);
        const toldo = new THREE.Mesh(new THREE.BoxGeometry(6, 0.4, 6), i % 2 ? MAT.awning : MAT.awning2);
        toldo.position.set(x, 3.8, 0);
        toldo.rotation.x = 0.12;
        g.add(toldo);
        add(g, box(0.3, 4, 0.3), MAT.wood, x - 2.6, 2, 2.6, false);
        add(g, box(0.3, 4, 0.3), MAT.wood, x + 2.6, 2, 2.6, false);
      }
      break;
    }
    case 'cidade': {
      // o último dia: prédios de Akihabara e Nihonbashi
      tower(group(g, -5, 0, 0, 0.2), 4.5, 4.5, 14, { color: 0x7e8691, screen: true });
      tower(group(g, 1, 0, 3, -0.3), 4, 4, 10, { color: 0x8e959f });
      tower(group(g, 5.5, 0, -2, 0.1), 3.6, 3.6, 17, { color: 0x6f7784 });
      break;
    }
    default:
      add(g, box(4, 6, 4), MAT.stone, 0, 3, 0);
  }
  g.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh) return;
    const troca = (mat: THREE.Material) => ((mat as THREE.MeshStandardMaterial).map ? MAT_TELHADO : mat);
    m.material = Array.isArray(m.material) ? m.material.map(troca) : troca(m.material as THREE.Material);
  });
  compactar(g);
  return g;
}

function mergeSimples(geos: THREE.BufferGeometry[]): THREE.BufferGeometry | null {
  if (!geos.length) return null;
  const pos: number[] = [];
  const nor: number[] = [];
  for (const g of geos) {
    const gn = g.index ? g.toNonIndexed() : g;
    pos.push(...Array.from(gn.attributes.position.array as Float32Array));
    nor.push(...Array.from(gn.attributes.normal.array as Float32Array));
    if (gn !== g) gn.dispose();
    g.dispose();
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  return out;
}

/**
 * Funde as malhas de um grupo por material, num mesh por material. Cada
 * marco e cada miniatura é montado com dezenas de peças; sem isto o mapa
 * chegaria a 2.500 chamadas de desenho, que é o que trava celular.
 */
function compactar(g: THREE.Object3D) {
  const porMaterial = new Map<THREE.Material, THREE.BufferGeometry[]>();
  const remover: THREE.Mesh[] = [];
  g.updateMatrixWorld(true);
  const inverso = new THREE.Matrix4().copy(g.matrixWorld).invert();
  g.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh || Array.isArray(m.material)) return;
    const mat = m.material as THREE.Material;
    const geo = m.geometry.clone().applyMatrix4(new THREE.Matrix4().multiplyMatrices(inverso, m.matrixWorld));
    const semIndice = geo.index ? geo.toNonIndexed() : geo;
    if (semIndice !== geo) geo.dispose();
    // só posição, normal e uv: atributos diferentes impedem a fusão
    const limpa = new THREE.BufferGeometry();
    for (const nome of ['position', 'normal', 'uv']) {
      const a = semIndice.getAttribute(nome);
      if (a) limpa.setAttribute(nome, a);
    }
    if (!limpa.getAttribute('normal')) limpa.computeVertexNormals();
    if (!limpa.getAttribute('uv')) {
      const n = limpa.getAttribute('position').count;
      limpa.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(n * 2), 2));
    }
    const lista = porMaterial.get(mat) ?? [];
    lista.push(limpa);
    porMaterial.set(mat, lista);
    remover.push(m);
  });
  for (const m of remover) m.parent?.remove(m);
  for (const [mat, geos] of porMaterial) {
    const juntas = geos.length === 1 ? geos[0] : mergeGeometries(geos, false);
    if (!juntas) continue;
    const malha = new THREE.Mesh(juntas, mat);
    malha.castShadow = true;
    malha.receiveShadow = true;
    g.add(malha);
  }
}

export interface Diorama {
  /**
   * Os ícones vivem fora da cena do país, numa camada própria que a tela
   * desenha depois, com a profundidade zerada. É o que faz um marcador se
   * comportar como marcador: de perto, onde o ícone fica menor que as
   * montanhas, ele continua por cima delas em vez de sumir dentro do relevo.
   */
  camada: THREE.Group;
  /** posição no mundo de cada dia, para a camada de etiquetas projetar */
  posicoes: Record<string, THREE.Vector3>;
  /** o grupo do ícone de cada dia, para acender e apagar */
  icones: Record<string, THREE.Object3D>;
  /** escala com que o ícone nasceu, para a tela multiplicar pela distância */
  escalas: Record<string, number>;
  dispose: () => void;
}

/**
 * Monta o mapa: as ilhas, as montanhas, e um ícone por dia no lugar certo.
 * Nada aqui responde a toque — a árvore inteira recebe `raycast` vazio.
 */
export function construirDiorama(
  scene: THREE.Scene,
  dias: { dayId: string; icone: string; lat: number; lng: number }[],
  leve: boolean,
): Diorama {
  const raiz = new THREE.Group();
  scene.add(raiz);

  const mar = new THREE.Mesh(new THREE.PlaneGeometry(2600, 2600), MAT_MAR);
  mar.rotation.x = -Math.PI / 2;
  mar.position.y = -0.4;
  mar.receiveShadow = true;
  raiz.add(mar);

  ilhas(raiz);
  montanhas(raiz, leve, dias);
  paisagem(raiz);

  const posicoes: Record<string, THREE.Vector3> = {};
  const icones: Record<string, THREE.Object3D> = {};
  const escalas: Record<string, number> = {};

  const camada = new THREE.Group();

  for (const d of dias) {
    const [x, z] = proj(d.lng, d.lat);
    posicoes[d.dayId] = new THREE.Vector3(x, ALTURA_TERRA, z);
    const g = miniatura(camada, d.icone);
    // todos os ícones com a mesma altura: no mapa eles são símbolos, e um
    // símbolo maior que o outro mentiria sobre a importância do dia
    const caixa = new THREE.Box3().setFromObject(g);
    // a medida é a maior das três dimensões, não a altura: senão um torii
    // alto e fino sairia pequeno e um salão largo e baixo sairia gigante
    const tam = caixa.getSize(new THREE.Vector3());
    const medida = Math.max(0.001, tam.x, tam.z, caixa.max.y - Math.min(0, caixa.min.y));
    // uma sombra de contato: sem ela o ícone, desenhado por cima de tudo,
    // parece recortado e colado sobre o mapa
    const largo = Math.max(tam.x, tam.z);
    const disco = new THREE.Mesh(new THREE.CircleGeometry((largo * 0.46) / (g.scale.x || 1), 24), MAT_SOMBRA);
    disco.rotation.x = -Math.PI / 2;
    disco.position.y = 0.02;
    disco.renderOrder = -1;
    g.add(disco);

    const base = (ALTURA_ICONE / medida) * g.scale.x;
    g.scale.setScalar(base);
    g.position.set(x, ALTURA_TERRA, z);
    icones[d.dayId] = g;
    escalas[d.dayId] = base;
  }

  raiz.traverse((o) => { o.raycast = () => {}; });
  camada.traverse((o) => { o.raycast = () => {}; });

  return {
    camada,
    posicoes,
    icones,
    escalas,
    dispose: () => {
      for (const no of [raiz, camada])
        no.traverse((o) => {
          const m = o as THREE.Mesh;
          if (m.geometry) m.geometry.dispose();
        });
      scene.remove(raiz);
      camada.removeFromParent();
    },
  };
}
