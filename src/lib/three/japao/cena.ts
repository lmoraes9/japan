import * as THREE from 'three';
import { ILHAS } from './costa';
import { LUGARES, FUJI, BIWA, ROTULOS, passagensEntre, type LugarMapa, type Marco } from './lugares';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { MAT, add, box, cyl, toriiGeometry } from '../parts';
import { group, castle, pagoda, buddha, domeRuin, kura, tower, bigTorii, hall, deerGeometry, gate2, stage, bridge, train } from '../buildings';

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
const MAT_BAMBU = new THREE.MeshStandardMaterial({ color: 0x7fa35a, roughness: 0.8 });
const MAT_FIO = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.45 });
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

/** Texto solto sobre o mar ou a montanha, sem balão, em itálico. */
function rotulo(texto: string, sub?: string): THREE.Sprite {
  const L = 640;
  const A = sub ? 150 : 90;
  const cv = document.createElement('canvas');
  cv.width = L;
  cv.height = A;
  const c = cv.getContext('2d')!;
  c.textAlign = 'center';
  c.fillStyle = 'rgba(255,255,255,0.82)';
  c.font = 'italic 600 46px Georgia, "Times New Roman", serif';
  c.shadowColor = 'rgba(0,0,0,0.45)';
  c.shadowBlur = 8;
  c.fillText(texto, L / 2, 56);
  if (sub) {
    c.font = 'italic 30px Georgia, "Times New Roman", serif';
    c.fillStyle = 'rgba(255,255,255,0.7)';
    c.fillText(sub, L / 2, 112);
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true, opacity: 0.95 }));
  sp.scale.set(64, sub ? 15 : 9, 1);
  sp.renderOrder = 9;
  return sp;
}

function paisagem(pai: THREE.Object3D) {
  // o lago Biwa, que o contorno da costa não tem
  const [bx, bz] = proj(BIWA.lng, BIWA.lat);
  const lago = new THREE.Mesh(new THREE.CircleGeometry(1, 28), MAT_MAR);
  lago.rotation.x = -Math.PI / 2;
  lago.scale.set(BIWA.rx * COS0 * K, BIWA.rz * K, 1);
  lago.position.set(bx, ESPESSURA + 0.15, bz);
  pai.add(lago);

  for (const r of ROTULOS) {
    const [x, z] = proj(r.lng, r.lat);
    const sp = rotulo(r.texto, r.sub);
    const noFuji = r.texto.startsWith('Fuji');
    sp.position.set(x, noFuji ? ESPESSURA + 40 : ESPESSURA + 4, z);
    pai.add(sp);
  }
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
    case 'kinkakuji':
      hall(group(g, 0, 0, 0, 0), { bays: 3, depthBays: 2, bay: 3, two: true, gold: true });
      break;
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
  const caixa = new THREE.Box3().setFromObject(g);
  const alto = Math.max(0.001, caixa.max.y - Math.min(0, caixa.min.y));
  g.scale.setScalar(ALTURA_MINIATURA / alto);
  return g;
}

const ALTURA_MINIATURA = 13;
const RAIO_ANEL = 42;

/**
 * O anel de miniaturas de uma cidade: cada mapa ilustrado dela vira um
 * modelo pequeno, disposto na direção real em que fica, com placa e uma
 * linha até o centro. Começa invisível: a interface acende quando a
 * câmera chega perto.
 */
function anelMiniaturas(pai: THREE.Object3D, l: LugarMapa, cx: number, cz: number, escala: number, coletaPlacas: THREE.Sprite[]): THREE.Group | null {
  if (!l.mapas || l.mapas.length < 2) return null;
  const anel = new THREE.Group();
  anel.position.set(cx, ALTURA_TERRA, cz);
  anel.visible = false;
  anel.userData.lugarId = l.id;
  const raio = RAIO_ANEL * escala;
  for (const m of l.mapas) {
    const a = ((90 - m.rumo) * Math.PI) / 180; // rumo 0 = norte = -z
    const x = Math.cos(a) * raio;
    const z = -Math.sin(a) * raio;
    const mini = miniatura(anel, m.id);
    mini.position.set(x, 0, z);
    mini.rotation.y = -a + Math.PI / 2;
    mini.userData.mapaId = m.id;
    mini.userData.lugarId = l.id;
    // fio até o centro
    const fio = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, raio, 5), MAT_FIO);
    fio.position.set(x / 2, 0.6, z / 2);
    fio.rotation.z = Math.PI / 2;
    fio.rotation.y = -Math.atan2(z, x);
    anel.add(fio);
    const sp = placa(m.nome, '', { pequena: true });
    sp.position.set(x, ALTURA_MINIATURA + 7, z);
    sp.scale.set(30, 7.5, 1);
    sp.userData.mapaId = m.id;
    sp.userData.lugarId = l.id;
    anel.add(sp);
    coletaPlacas.push(sp);
  }
  pai.add(anel);
  return anel;
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

  compactar(g);

  // normaliza a altura para todos os marcos lerem no mesmo zoom
  const caixa = new THREE.Box3().setFromObject(g);
  const alto = Math.max(0.001, caixa.max.y - Math.min(0, caixa.min.y));
  g.scale.setScalar((ALTURA_MARCO[tipo] / alto) * escalaExtra);
  return g;
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

/** Placa com o nome da cidade, sempre virada para a câmera. */
export function placa(nome: string, jp: string, o: { pequena?: boolean; cor?: string; texto?: string } = {}): THREE.Sprite {
  const L = 512;
  const A = o.pequena ? 128 : 160;
  const cv = document.createElement('canvas');
  cv.width = L;
  cv.height = A;
  const c = cv.getContext('2d')!;
  c.fillStyle = o.cor ?? 'rgba(255,255,255,0.92)';
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
  c.fillStyle = o.texto ?? '#1d2b3a';
  c.textAlign = 'center';
  // a fonte encolhe até o nome caber na placa
  const caber = (base: number) => {
    let px = base;
    do {
      c.font = `bold ${px}px system-ui, -apple-system, sans-serif`;
      if (c.measureText(nome).width <= L - 48) break;
      px -= 2;
    } while (px > 22);
  };
  if (o.pequena) {
    caber(50);
    c.fillText(nome, L / 2, 66);
  } else {
    caber(64);
    c.fillText(nome, L / 2, 74);
    c.fillStyle = o.texto ? 'rgba(255,255,255,0.75)' : 'rgba(29,43,58,0.55)';
    c.font = '34px system-ui, -apple-system, sans-serif';
    c.fillText(jp, L / 2, 112);
  }
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
  /** anel de miniaturas por cidade (só as que têm mais de um mapa) */
  aneis: Record<string, THREE.Group>;
  /** as placas das miniaturas, para a interface manter o tamanho na tela */
  placasMini: THREE.Sprite[];
  rota: THREE.Object3D;
  /** o tubo apagado, para achar em que trecho o dedo tocou */
  tuboFundo: THREE.Mesh | null;
  curva: THREE.CatmullRomCurve3 | null;
  trem: THREE.Group;
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
  paisagem(raiz);

  const posicoes: Record<string, THREE.Vector3> = {};
  const marcos: Record<string, THREE.Object3D> = {};
  const placas: Record<string, THREE.Sprite> = {};
  const aneis: Record<string, THREE.Group> = {};
  const placasMini: THREE.Sprite[] = [];
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
    const anel = anelMiniaturas(raiz, l, x, z, l.escala ?? 1, placasMini);
    if (anel) aneis[l.id] = anel;
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
  let tuboFundo: THREE.Mesh | null = null;
  let curva: THREE.CatmullRomCurve3 | null = null;
  const fracoes: number[] = [];
  const SEG = leve ? 200 : 480;
  const RAD = 6;
  if (pontos.length > 1) {
    const altos = pontos.map((p) => new THREE.Vector3(p.x, ALTURA_TERRA + 4, p.z));
    curva = new THREE.CatmullRomCurve3(altos, false, 'catmullrom', 0.12);
    const geo = new THREE.TubeGeometry(curva, SEG, 2.6, RAD, false);
    tuboFundo = new THREE.Mesh(geo, MAT_ROTA_APAGADA);
    rota.add(tuboFundo);
    tuboPercorrido = new THREE.Mesh(geo.clone(), MAT_ROTA);
    tuboPercorrido.renderOrder = 2;
    rota.add(tuboPercorrido);

    // Fração de COMPRIMENTO DE ARCO (u) de cada cidade sobre a curva. Tem de
    // ser em arco, e não em corda, porque é assim que getPointAt caminha —
    // senão o trem e o trecho tocado apontam para lugares diferentes.
    const N = 1000;
    const espacados = curva.getSpacedPoints(N);
    for (const i of indiceDaCidade) {
      const alvo = altos[i];
      let melhor = 0;
      let md = Infinity;
      for (let k = 0; k <= N; k++) {
        const dd = espacados[k].distanceToSquared(alvo);
        if (dd < md) { md = dd; melhor = k; }
      }
      fracoes.push(melhor / N);
    }

    for (const i of indiceDaCidade) {
      const p = pontos[i];
      const d = new THREE.Mesh(new THREE.SphereGeometry(4.4, 14, 10), MAT_ROTA);
      d.position.set(p.x, ALTURA_TERRA + 4, p.z);
      d.renderOrder = 3;
      rota.add(d);
    }
  }
  raiz.add(rota);

  // o Shinkansen, que a interface leva pela linha
  const trem = new THREE.Group();
  const carroceria = new THREE.Group();
  train(carroceria, { cars: 3, color: 0xf7f8fa });
  carroceria.scale.setScalar(0.36);
  trem.add(carroceria);
  const nariz = new THREE.Mesh(new THREE.ConeGeometry(0.62, 3, 10), new THREE.MeshStandardMaterial({ color: 0xf7f8fa, roughness: 0.5 }));
  nariz.rotation.x = -Math.PI / 2;
  nariz.position.set(0, 0.95, -11.5);
  trem.add(nariz);
  const faixa = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.3, 20), new THREE.MeshBasicMaterial({ color: 0x1c4f9c }));
  faixa.position.set(0, 1.3, 0);
  trem.add(faixa);
  trem.traverse((o) => { (o as THREE.Mesh).castShadow = true; });
  trem.visible = false;
  raiz.add(trem);

  const caixa = new THREE.Box3().setFromObject(raiz);
  return {
    posicoes,
    marcos,
    placas,
    aneis,
    placasMini,
    rota,
    tuboFundo,
    curva,
    trem,
    tuboPercorrido,
    fracoes,
    segmentosTubo: SEG,
    radiaisTubo: RAD,
    limites: { min: caixa.min, max: caixa.max },
  };
}

export { LUGARES };
export type { LugarMapa };
