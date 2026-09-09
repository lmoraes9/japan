import * as THREE from 'three';
import { ILHAS } from './costa';
import { LUGARES, FUJI, passagensEntre, type LugarMapa, type Marco } from './lugares';
import { MAT, add, box, cyl } from '../parts';
import { group, castle, pagoda, buddha, domeRuin, kura, tower, bigTorii, hall, deerGeometry } from '../buildings';

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
const MAT_MAR = new THREE.MeshStandardMaterial({ color: 0x2e4a66, roughness: 0.25, metalness: 0.3 });
const MAT_MONTE = new THREE.MeshStandardMaterial({ color: 0x6b7856, roughness: 1 });
const MAT_NEVE = new THREE.MeshStandardMaterial({ color: 0xf2f4f7, roughness: 0.8 });
const MAT_TELHADO = new THREE.MeshStandardMaterial({ color: 0x8f97a3, roughness: 0.75, side: THREE.DoubleSide });
const MAT_ROTA = new THREE.MeshBasicMaterial({ color: 0xc2402a });
const MAT_ROTA_APAGADA = new THREE.MeshBasicMaterial({ color: 0xc2402a, transparent: true, opacity: 0.22 });

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
function montanhas(pai: THREE.Object3D, leve: boolean) {
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
    // não encostar nas cidades: o marco é que tem de ser visto
    if (LUGARES.some((l) => Math.hypot((lng - l.lng) * COS0, lat - l.lat) < 0.42)) continue;
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

/** altura desejada de cada marco, para todos lerem juntos no zoom do país */
const ALTURA_MARCO: Record<Marco, number> = {
  torre: 26,
  buda: 20,
  domo: 20,
  torii: 22,
  kura: 18,
  castelo: 24,
  'castelo-osaka': 24,
  pagode: 26,
  veado: 19,
};

/** O marco 3D de cada cidade, montado com as mesmas peças dos outros mapas. */
function marco(pai: THREE.Object3D, tipo: Marco, escalaExtra: number) {
  const g = new THREE.Group();
  pai.add(g);
  switch (tipo) {
    case 'torre': {
      tower(group(g, -8, 0, 5, 0.4), 5, 5, 13, { color: 0x8e9199 });
      tower(group(g, 8, 0, 7, -0.3), 4.5, 4.5, 9, { color: 0x9aa0a8 });
      const t = group(g, 0, 0, -3, 0);
      add(t, cyl(0.7, 3.4, 20, 8), MAT.vermilion, 0, 10, 0);
      add(t, cyl(0.35, 0.7, 7, 6), MAT.vermilion, 0, 23, 0);
      add(t, box(6.5, 1.4, 6.5), MAT.white, 0, 14.5, 0);
      add(t, box(4.6, 1.1, 4.6), MAT.white, 0, 19, 0);
      break;
    }
    case 'buda':
      buddha(group(g, 0, 0, 0, 0), 1);
      break;
    case 'domo':
      domeRuin(group(g, 0, 0, 0, 0.3));
      break;
    case 'torii': {
      const agua = new THREE.Mesh(new THREE.CylinderGeometry(16, 16, 0.6, 28), MAT_MAR);
      agua.position.set(0, 0.1, 0);
      g.add(agua);
      bigTorii(g, 0, 0.4, 0, 0.5, 13, 16);
      break;
    }
    case 'kura':
      kura(group(g, -5, 0, 0, 0.2), { w: 7, d: 6, h: 7 });
      kura(group(g, 4, 0, 3, -0.15), { w: 6, d: 5, h: 6 });
      break;
    case 'castelo':
      castle(group(g, 0, 0, 0, 0.3), { tiers: 5, size: 11, base: 5, turrets: true });
      break;
    case 'castelo-osaka':
      castle(group(g, 0, 0, 0, -0.2), { tiers: 5, size: 10, base: 6, turrets: false });
      break;
    case 'pagode':
      pagoda(group(g, 0, 0, 0, 0.25), 5, 8);
      break;
    case 'veado': {
      hall(group(g, 0, 0, -2, 0.2), { bays: 4, depthBays: 3, bay: 3.4, two: true });
      const veado = new THREE.Mesh(deerGeometry(), MAT.woodLight);
      veado.scale.setScalar(2.4);
      veado.position.set(10, 0, 7);
      veado.rotation.y = -0.6;
      veado.castShadow = true;
      g.add(veado);
      break;
    }
  }
  // nesta escala a textura de telha vira uma mancha escura: troca por
  // um cinza chapado, que também economiza chamadas de desenho
  g.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh) return;
    const mats = Array.isArray(m.material) ? m.material : [m.material];
    m.material = (Array.isArray(m.material) ? mats : mats[0]) as THREE.Material;
    const troca = (mat: THREE.Material) =>
      (mat as THREE.MeshStandardMaterial).map ? MAT_TELHADO : mat;
    m.material = Array.isArray(m.material) ? m.material.map(troca) : troca(m.material);
  });

  // normaliza a altura para todos os marcos lerem no mesmo zoom
  const caixa = new THREE.Box3().setFromObject(g);
  const alto = Math.max(0.001, caixa.max.y - Math.min(0, caixa.min.y));
  g.scale.setScalar((ALTURA_MARCO[tipo] / alto) * escalaExtra);
  return g;
}

/** Placa com o nome da cidade, sempre virada para a câmera. */
function placa(nome: string, jp: string): THREE.Sprite {
  const L = 512;
  const A = 160;
  const cv = document.createElement('canvas');
  cv.width = L;
  cv.height = A;
  const c = cv.getContext('2d')!;
  c.fillStyle = 'rgba(255,255,255,0.92)';
  const r = 30;
  c.beginPath();
  c.moveTo(r, 6);
  c.arcTo(L - 6, 6, L - 6, A - 34, r);
  c.arcTo(L - 6, A - 34, 6, A - 34, r);
  c.arcTo(6, A - 34, 6, 6, r);
  c.arcTo(6, 6, L - 6, 6, r);
  c.closePath();
  c.fill();
  // o bico apontando para baixo
  c.beginPath();
  c.moveTo(L / 2 - 20, A - 36);
  c.lineTo(L / 2 + 20, A - 36);
  c.lineTo(L / 2, A - 4);
  c.closePath();
  c.fill();
  c.fillStyle = '#1d2b3a';
  c.font = 'bold 64px system-ui, -apple-system, sans-serif';
  c.textAlign = 'center';
  c.fillText(nome, L / 2, 74);
  c.fillStyle = 'rgba(29,43,58,0.55)';
  c.font = '34px system-ui, -apple-system, sans-serif';
  c.fillText(jp, L / 2, 112);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true }));
  sp.renderOrder = 10;
  return sp;
}

export interface MapaJapaoConstruido {
  posicoes: Record<string, THREE.Vector3>;
  marcos: Record<string, THREE.Object3D>;
  placas: Record<string, THREE.Sprite>;
  rota: THREE.Object3D;
  /** o tubo aceso: cortar o drawRange mostra só o trecho já percorrido */
  tuboPercorrido: THREE.Mesh | null;
  /** fração da curva (0–1) em cada ponto da rota */
  fracoes: number[];
  segmentosTubo: number;
  radiaisTubo: number;
  limites: { min: THREE.Vector3; max: THREE.Vector3 };
}

/** Monta o mapa inteiro na cena e devolve o que a interface precisa. */
export function construirMapaJapao(
  scene: THREE.Scene,
  rotaIds: string[],
  leve: boolean,
): MapaJapaoConstruido {
  const raiz = new THREE.Group();
  scene.add(raiz);

  const mar = new THREE.Mesh(new THREE.PlaneGeometry(2600, 2600), MAT_MAR);
  mar.rotation.x = -Math.PI / 2;
  mar.position.y = -0.4;
  mar.receiveShadow = true;
  scene.add(mar);

  ilhas(raiz);
  montanhas(raiz, leve);

  const posicoes: Record<string, THREE.Vector3> = {};
  const marcos: Record<string, THREE.Object3D> = {};
  const placas: Record<string, THREE.Sprite> = {};
  for (const l of LUGARES) {
    const [x, z] = proj(l.lng, l.lat);
    posicoes[l.id] = new THREE.Vector3(x, ALTURA_TERRA, z);
    const g = marco(raiz, l.marco, l.escala ?? 1);
    g.position.set(x, ALTURA_TERRA, z);
    g.userData.lugarId = l.id;
    marcos[l.id] = g;
    const sp = placa(l.nome, l.jp);
    sp.position.set(x, ALTURA_TERRA + ALTURA_MARCO[l.marco] * (l.escala ?? 1) + 11 + (l.placaOffset ?? 0), z);
    sp.scale.set(44, 13.8, 1);
    sp.userData.lugarId = l.id;
    raiz.add(sp);
    placas[l.id] = sp;
  }

  // a linha da viagem: um traço apagado com o caminho inteiro e, por cima,
  // o mesmo traço aceso, cortado no ponto em que a viagem está
  // a sequência de pontos da curva: cidades e, entre elas, as passagens
  const pontos: THREE.Vector3[] = [];
  const indiceDaCidade: number[] = [];
  for (let i = 0; i < rotaIds.length; i++) {
    const p = posicoes[rotaIds[i]];
    if (!p) continue;
    indiceDaCidade.push(pontos.length);
    pontos.push(p);
    const prox = rotaIds[i + 1];
    if (!prox) continue;
    for (const [lng, lat] of passagensEntre(rotaIds[i], prox)) {
      const [vx, vz] = proj(lng, lat);
      pontos.push(new THREE.Vector3(vx, ALTURA_TERRA, vz));
    }
  }
  const rota = new THREE.Group();
  let tuboPercorrido: THREE.Mesh | null = null;
  const fracoes: number[] = [];
  const SEG = leve ? 200 : 480;
  const RAD = 6;
  if (pontos.length > 1) {
    const altos = pontos.map((p) => new THREE.Vector3(p.x, ALTURA_TERRA + 4, p.z));
    const curva = new THREE.CatmullRomCurve3(altos, false, 'catmullrom', 0.12);
    const geo = new THREE.TubeGeometry(curva, SEG, 2.6, RAD, false);
    const fundo = new THREE.Mesh(geo, MAT_ROTA_APAGADA);
    rota.add(fundo);
    tuboPercorrido = new THREE.Mesh(geo.clone(), MAT_ROTA);
    tuboPercorrido.renderOrder = 2;
    rota.add(tuboPercorrido);

    // fração acumulada de comprimento até cada ponto
    let total = 0;
    const parciais = [0];
    for (let i = 1; i < altos.length; i++) {
      total += altos[i].distanceTo(altos[i - 1]);
      parciais.push(total);
    }
    fracoes.push(...indiceDaCidade.map((i) => (total ? parciais[i] / total : 0)));

    for (const i of indiceDaCidade) {
      const p = pontos[i];
      const d = new THREE.Mesh(new THREE.SphereGeometry(4.4, 14, 10), MAT_ROTA);
      d.position.set(p.x, ALTURA_TERRA + 4, p.z);
      d.renderOrder = 3;
      rota.add(d);
    }
  }
  raiz.add(rota);

  const caixa = new THREE.Box3().setFromObject(raiz);
  return {
    posicoes,
    marcos,
    placas,
    rota,
    tuboPercorrido,
    fracoes,
    segmentosTubo: SEG,
    radiaisTubo: RAD,
    limites: { min: caixa.min, max: caixa.max },
  };
}

export { LUGARES };
export type { LugarMapa };
