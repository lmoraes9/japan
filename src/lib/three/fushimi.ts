/**
 * Fushimi Inari em 3D: a montanha, o percurso da estação ao cume,
 * os milhares de torii, os prédios e as raposas. Coordenadas reais dos
 * pontos do mapa, com a horizontal comprimida a 60% para caber na tela.
 */
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { PlaceMap } from '@/data/placeMaps';
import { MAT, add, box, cyl, beam, roof, bracket, lantern, fox, toriiGeometry, treeGeometry, resetCount, meshCount } from './parts';

const CENTER = { lat: 34.9676, lng: 135.779 };
const SCALE = 0.6;
export const toXZ = (lat: number, lng: number) => ({
  x: (lng - CENTER.lng) * 91000 * SCALE,
  z: -(lat - CENTER.lat) * 111000 * SCALE,
});

// os três picos do monte Inari
const PEAKS = [
  { x: 355, z: -13, h: 205, r: 230 }, // Ichi-no-mine, o cume
  { x: 300, z: 60, h: 170, r: 150 }, // Ni-no-mine
  { x: 262, z: -110, h: 155, r: 140 }, // San-no-mine
];
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
export function terrainHeight(x: number, z: number) {
  let m = 0;
  for (const p of PEAKS) {
    const d = Math.hypot(x - p.x, z - p.z);
    m = Math.max(m, p.h * Math.exp(-((d / p.r) ** 2)));
  }
  const slope = 42 * smooth(-260, 120, x);
  const noise = 4 * Math.sin(x / 23) * Math.cos(z / 19) + 3 * Math.sin(x / 7.3 + z / 11) + 2 * Math.cos(x / 41 - z / 29);
  const flat = 1 - smooth(-330, -230, x); // o recinto de entrada é plano
  return 30 + m + slope + noise * (1 - flat * 0.85);
}

export interface Built {
  markers: Record<string, THREE.Vector3>;
  cameraStart: { pos: THREE.Vector3; target: THREE.Vector3 };
  instanced: THREE.InstancedMesh[];
  meshes: number;
  drawGroups: number;
}

export function buildFushimi(scene: THREE.Scene, map: PlaceMap, quality: 'alta' | 'leve'): Built {
  resetCount();
  const root = new THREE.Group();
  scene.add(root);
  const H = terrainHeight;
  const P: Record<string, { x: number; z: number }> = {};
  for (const h of map.hotspots) if (h.coords) P[h.id] = toXZ(h.coords.lat, h.coords.lng);

  // ── terreno ────────────────────────────────────────────────────────
  const TW = 1000, TD = 640, SEG = quality === 'alta' ? 200 : 110;
  const tg = new THREE.PlaneGeometry(TW, TD, SEG, Math.round((SEG * TD) / TW));
  tg.rotateX(-Math.PI / 2);
  const pos = tg.getAttribute('position') as THREE.BufferAttribute;
  const col = new Float32Array(pos.count * 3);
  const cLow = new THREE.Color(0x8f9a6a), cMid = new THREE.Color(0x4f6e3a), cHigh = new THREE.Color(0x3a5630), cRock = new THREE.Color(0x6e6a5e);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i);
    const y = H(x, z);
    pos.setY(i, y);
    const t = Math.min(1, (y - 30) / 200);
    const c = t < 0.25 ? cLow.clone().lerp(cMid, t / 0.25) : cMid.clone().lerp(cHigh, (t - 0.25) / 0.75);
    if (((x * 7.1 + z * 3.7) | 0) % 17 === 0 && t > 0.5) c.lerp(cRock, 0.5);
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
  }
  tg.setAttribute('color', new THREE.BufferAttribute(col, 3));
  tg.computeVertexNormals();
  const terrain = add(root, tg, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 }), 0, 0, 0, false);
  terrain.receiveShadow = true;

  // ── o percurso ─────────────────────────────────────────────────────
  const order = ['estacao', 'barracas', 'romon', 'kitsune', 'honden', 'senbon', 'omokaru', 'shinike', 'yotsutsuji', 'cume'];
  const wp = order.map((id) => P[id]);
  // desvios para a subida serpentear pela encosta
  const extra: Record<number, { x: number; z: number }[]> = {
    6: [{ x: -60, z: -70 }, { x: -20, z: -50 }],
    7: [{ x: 70, z: -10 }, { x: 120, z: -60 }, { x: 170, z: -40 }],
    8: [{ x: 250, z: -90 }, { x: 300, z: -60 }, { x: 330, z: -30 }],
  };
  const pts: THREE.Vector3[] = [];
  wp.forEach((p, i) => {
    pts.push(new THREE.Vector3(p.x, 0, p.z));
    (extra[i] ?? []).forEach((e) => pts.push(new THREE.Vector3(e.x, 0, e.z)));
  });
  pts.forEach((p) => (p.y = H(p.x, p.z)));
  const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal', 0.4);
  const samples = curve.getSpacedPoints(900);
  samples.forEach((p) => (p.y = H(p.x, p.z) + 0.35));
  // faixa do caminho (ribbon) colada no terreno
  {
    const w = 4.5;
    const rp: number[] = [], ri: number[] = [];
    for (let i = 0; i < samples.length; i++) {
      const p = samples[i];
      const q = samples[Math.min(samples.length - 1, i + 1)], o = samples[Math.max(0, i - 1)];
      const t = new THREE.Vector3().subVectors(q, o).setY(0).normalize();
      const n = new THREE.Vector3(-t.z, 0, t.x);
      for (const s of [-1, 1]) {
        const x = p.x + (n.x * s * w) / 2, z = p.z + (n.z * s * w) / 2;
        rp.push(x, H(x, z) + 0.4, z);
      }
      if (i < samples.length - 1) {
        const a = i * 2;
        ri.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
      }
    }
    const rg = new THREE.BufferGeometry();
    rg.setAttribute('position', new THREE.Float32BufferAttribute(rp, 3));
    rg.setIndex(ri);
    rg.computeVertexNormals();
    add(root, rg, new THREE.MeshStandardMaterial({ color: 0xb9ad98, roughness: 1, side: THREE.DoubleSide }), 0, 0, 0, false);
  }
  const nearPath = (x: number, z: number, r: number) => {
    for (let i = 0; i < samples.length; i += 3) {
      const p = samples[i];
      if ((p.x - x) ** 2 + (p.z - z) ** 2 < r * r) return true;
    }
    return false;
  };

  // ── torii instanciados ao longo da subida ──────────────────────────
  const instanced: THREE.InstancedMesh[] = [];
  const toriiMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.6 });
  {
    // trecho denso: do Senbon ao Okusha; depois esparso até o cume
    const iSenbon = nearestSampleIndex(samples, P.senbon), iOku = nearestSampleIndex(samples, P.omokaru);
    const dense: THREE.Matrix4[] = [], sparse: THREE.Matrix4[] = [];
    const tmp = new THREE.Object3D();
    const place = (i: number, list: THREE.Matrix4[], scale: number) => {
      const p = samples[i], q = samples[Math.min(samples.length - 1, i + 2)];
      const t = new THREE.Vector3().subVectors(q, p).setY(0);
      if (t.lengthSq() < 1e-6) return;
      tmp.position.set(p.x, p.y - 0.3, p.z);
      tmp.rotation.set(0, Math.atan2(t.x, t.z), 0);
      tmp.scale.setScalar(scale);
      tmp.updateMatrix();
      list.push(tmp.matrix.clone());
    };
    const stepDense = quality === 'alta' ? 1 : 2, stepSparse = quality === 'alta' ? 4 : 7;
    for (let i = iSenbon; i < iOku; i += stepDense) place(i, dense, 0.75 + ((i * 7) % 5) * 0.02);
    for (let i = iOku + 6; i < samples.length - 8; i += stepSparse) place(i, sparse, 0.9 + ((i * 3) % 7) * 0.03);
    const geo = toriiGeometry(3.2, 4.8, 0.24);
    for (const list of [dense, sparse]) {
      const im = new THREE.InstancedMesh(geo, toriiMat, list.length);
      list.forEach((m, k) => im.setMatrixAt(k, m));
      im.castShadow = quality === 'alta';
      im.receiveShadow = true;
      root.add(im);
      instanced.push(im);
    }
    // o primeiro torii, grande, na entrada
    const big = new THREE.Mesh(toriiGeometry(9, 12, 0.6), toriiMat);
    const a = P.barracas, b = P.romon;
    big.position.set((a.x + b.x) / 2, H((a.x + b.x) / 2, (a.z + b.z) / 2), (a.z + b.z) / 2);
    big.rotation.y = Math.atan2(b.x - a.x, b.z - a.z);
    big.castShadow = true;
    root.add(big);
  }

  // ── floresta instanciada ───────────────────────────────────────────
  {
    const rng = mulberry32(7);
    const count = quality === 'alta' ? 3200 : 1200;
    const kinds: Array<'cedar' | 'broad' | 'maple'> = ['cedar', 'cedar', 'cedar', 'broad', 'maple'];
    const lists: Record<string, THREE.Matrix4[]> = { cedar: [], broad: [], maple: [] };
    const tmp = new THREE.Object3D();
    let tries = 0;
    while (lists.cedar.length + lists.broad.length + lists.maple.length < count && tries++ < count * 6) {
      const x = -TW / 2 + rng() * TW, z = -TD / 2 + rng() * TD;
      const y = H(x, z);
      if (x < -300 && Math.abs(z) < 70) continue; // o recinto de entrada
      if (y < 34 && rng() < 0.7) continue; // planície: poucas árvores
      if (nearPath(x, z, 7)) continue;
      const k = kinds[Math.floor(rng() * kinds.length)];
      tmp.position.set(x, y - 0.4, z);
      tmp.rotation.set(0, rng() * Math.PI * 2, 0);
      tmp.scale.setScalar(0.8 + rng() * 1.1);
      tmp.updateMatrix();
      lists[k].push(tmp.matrix.clone());
    }
    const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 });
    for (const k of ['cedar', 'broad', 'maple'] as const) {
      const im = new THREE.InstancedMesh(treeGeometry(k), mat, lists[k].length);
      lists[k].forEach((m, i) => im.setMatrixAt(i, m));
      im.castShadow = quality === 'alta';
      im.receiveShadow = true;
      root.add(im);
      instanced.push(im);
    }
  }

  // ── estação e trilhos ──────────────────────────────────────────────
  {
    const p = P.estacao, y = H(p.x, p.z);
    for (const dx of [-3, 3]) add(root, box(0.5, 0.3, 260), MAT.rail, p.x + dx - 14, y + 0.2, p.z, false);
    for (let z = -128; z < 130; z += 4) add(root, box(8, 0.2, 1), MAT.wood, p.x - 14, y + 0.05, p.z + z, false);
    add(root, box(6, 1.0, 60), MAT.stoneDark, p.x - 7, y + 0.5, p.z); // plataforma
    const g = new THREE.Group(); g.position.set(p.x + 4, y, p.z); root.add(g);
    add(g, box(14, 4.5, 12), MAT.plaster, 0, 2.25, 0);
    add(g, box(14.4, 0.6, 12.4), MAT.vermilion, 0, 4.8, 0);
    add(g, box(5, 3, 0.2), MAT.black, 0, 1.6, 6.05, false);
    roof(g, { W: 18, D: 16, H: 2.6, L: 8, lift: 0.5, y: 5.0, rafters: false });
  }

  // ── barracas da alameda ────────────────────────────────────────────
  {
    const a = P.estacao, b = P.romon;
    for (let i = 0; i < 14; i++) {
      const t = 0.15 + (i / 14) * 0.7;
      const x = a.x + (b.x - a.x) * t, z = a.z + (b.z - a.z) * t;
      const dir = Math.atan2(b.x - a.x, b.z - a.z);
      for (const s of [-1, 1]) {
        const ox = Math.cos(dir) * s * 7, oz = -Math.sin(dir) * s * 7;
        const y = H(x + ox, z + oz);
        const g = new THREE.Group(); g.position.set(x + ox, y, z + oz); g.rotation.y = dir; root.add(g);
        add(g, box(4.2, 2.2, 3), MAT.wood, 0, 1.1, 0);
        add(g, box(4.8, 0.25, 3.8), i % 2 ? MAT.awning : MAT.awning2, 0, 2.4, 0);
        add(g, box(4.2, 0.6, 2.6), MAT.plaster, 0, 1.0, 0.3);
      }
    }
  }

  // ── Rōmon: o portão de dois andares ────────────────────────────────
  {
    const p = P.romon, y = H(p.x, p.z);
    const g = new THREE.Group(); g.position.set(p.x, y, p.z); g.rotation.y = Math.PI / 2 + 0.15; root.add(g);
    add(g, box(22, 1.2, 12), MAT.stone, 0, 0.6, 0);
    for (let i = 0; i < 4; i++) for (const s of [-1, 1]) {
      const x = -7.5 + i * 5;
      add(g, cyl(0.45, 0.5, 7, 12), MAT.vermilion, x, 4.7, s * 3.5);
      bracket(g, x, 8.2, s * 3.5, 0.8);
    }
    add(g, box(16, 0.5, 8), MAT.vermilion, 0, 8.0, 0);
    roof(g, { W: 24, D: 15, H: 2.0, L: 12, lift: 0.7, y: 9.6, ridge: false, rafters: true });
    add(g, box(15, 5, 7), MAT.plaster, 0, 12.6, 0);
    for (let i = 0; i < 4; i++) for (const s of [-1, 1]) add(g, cyl(0.35, 0.35, 5, 10), MAT.vermilion, -7.5 + i * 5, 12.6, s * 3.6);
    add(g, box(16, 0.4, 8), MAT.vermilion, 0, 12.6, 0);
    for (const s of [-1, 1]) { beam(g, new THREE.Vector3(-8, 11.4, s * 4.2), new THREE.Vector3(8, 11.4, s * 4.2), 0.12, MAT.vermilion); }
    roof(g, { W: 26, D: 17, H: 5.5, L: 11, lift: 1.1, y: 15.1, ridge: true, rafters: true });
    lantern(g, -11, 1.2, 6, 2.6); lantern(g, 11, 1.2, 6, 2.6);
  }

  // ── as raposas ─────────────────────────────────────────────────────
  {
    const p = P.kitsune, y = H(p.x, p.z);
    fox(root, p.x, y, p.z - 5, Math.PI + 0.3, 1.5);
    fox(root, p.x, y, p.z + 5, -0.3, 1.5);
    const q = P.omokaru, yq = H(q.x, q.z);
    fox(root, q.x - 4, yq, q.z + 4, 0.8, 1.1);
    fox(root, q.x + 4, yq, q.z + 4, -0.8, 1.1);
  }

  // ── Honden, o salão principal ──────────────────────────────────────
  {
    const p = P.honden, y = H(p.x, p.z);
    const g = new THREE.Group(); g.position.set(p.x, y, p.z); g.rotation.y = Math.PI / 2 + 0.15; root.add(g);
    add(g, box(26, 1.2, 18), MAT.stone, 0, 0.6, 0);
    add(g, box(24, 0.35, 16), MAT.woodLight, 0, 1.35, 0);
    for (let i = 0; i <= 5; i++) for (const s of [-1, 1]) add(g, cyl(0.32, 0.36, 5, 12), MAT.vermilion, -10 + i * 4, 4.0, s * 6);
    for (let j = 1; j < 3; j++) for (const s of [-1, 1]) add(g, cyl(0.32, 0.36, 5, 12), MAT.vermilion, s * 10, 4.0, -6 + j * 4);
    add(g, box(20, 3.6, 0.2), MAT.plaster, 0, 3.3, -6);
    add(g, box(0.2, 3.6, 12), MAT.plaster, -10, 3.3, 0); add(g, box(0.2, 3.6, 12), MAT.plaster, 10, 3.3, 0);
    add(g, box(20, 1.2, 0.2), MAT.plaster, 0, 5.8, 6);
    add(g, box(6, 3.4, 0.2), MAT.black, 0, 3.2, 5.9, false);
    for (const x of [-7, 7]) { add(g, box(5, 3.4, 0.14), MAT.black, x, 3.2, 5.9, false); for (let k = 0; k < 6; k++) add(g, box(0.08, 3.4, 0.2), MAT.woodLight, x - 2.2 + k * 0.88, 3.2, 6, false); }
    for (let i = 0; i <= 5; i++) for (const s of [-1, 1]) bracket(g, -10 + i * 4, 6.5, s * 6, 0.8);
    roof(g, { W: 32, D: 24, H: 2.0, L: 18, lift: 0.8, y: 7.9, ridge: false, rafters: true });
    add(g, box(19, 2.2, 11), MAT.plaster, 0, 9.6, 0);
    roof(g, { W: 34, D: 26, H: 6.5, L: 14, lift: 1.3, y: 10.6, ridge: true, rafters: true });
    // altar dourado visto pela porta
    add(g, cyl(0.6, 0.8, 2.2, 16), MAT.gold, 0, 2.6, -2);
    add(g, new THREE.SphereGeometry(0.55, 14, 10), MAT.gold, 0, 4.1, -2);
    lantern(g, -14, 1.2, 9, 2.4); lantern(g, 14, 1.2, 9, 2.4);
    lantern(g, -14, 1.2, -9, 2.4); lantern(g, 14, 1.2, -9, 2.4);
  }

  // ── Okusha e a omokaru-ishi ────────────────────────────────────────
  {
    const p = P.omokaru, y = H(p.x, p.z);
    const g = new THREE.Group(); g.position.set(p.x, y, p.z); g.rotation.y = 0.4; root.add(g);
    add(g, box(14, 0.8, 10), MAT.stone, 0, 0.4, 0);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) add(g, cyl(0.28, 0.3, 4, 10), MAT.vermilion, sx * 4.5, 2.8, sz * 3);
    add(g, box(9, 3.2, 6), MAT.plaster, 0, 2.4, 0);
    add(g, box(3, 2.6, 0.2), MAT.black, 0, 2.1, 3.05, false);
    roof(g, { W: 15, D: 11, H: 3.4, L: 6, lift: 0.8, y: 4.9, ridge: true, rafters: true });
    // as duas lanternas da pedra pesada-leve, com a esfera no topo
    for (const s of [-1, 1]) {
      lantern(g, s * 4, 0.8, 6.5, 2.2);
      add(g, new THREE.SphereGeometry(0.42, 12, 10), MAT.stoneDark, s * 4, 0.8 + 0.6 + 2.2 * 0.45 + 0.3 + 1.7, 6.5);
    }
    // muro de mini-torii de oferenda
    const mini = toriiGeometry(0.8, 1.2, 0.06);
    const im = new THREE.InstancedMesh(mini, toriiMat, 90);
    const tmp = new THREE.Object3D();
    for (let i = 0; i < 90; i++) {
      const row = Math.floor(i / 30), k = i % 30;
      tmp.position.set(-7 + k * 0.5, 0.8 + row * 1.4, -5.5 - row * 0.4);
      tmp.rotation.set(0, 0, 0); tmp.updateMatrix(); im.setMatrixAt(i, tmp.matrix);
    }
    g.add(im); instanced.push(im);
  }

  // ── Shin-ike, a lagoa ──────────────────────────────────────────────
  {
    const p = P.shinike;
    const y = H(p.x, p.z) - 1.2;
    const g = new THREE.Group(); g.position.set(p.x, 0, p.z); root.add(g);
    const pond = add(g, new THREE.CircleGeometry(22, 40), MAT.water, 0, y + 0.6, 0, false);
    pond.rotation.x = -Math.PI / 2; pond.scale.set(1.5, 1, 1);
    // aterra o terreno em volta da lagoa
    for (let i = 0; i < pos.count; i++) {
      const dx = (pos.getX(i) - p.x) / 1.5, dz = pos.getZ(i) - p.z;
      const d = Math.hypot(dx, dz);
      if (d < 30) pos.setY(i, Math.min(pos.getY(i), y + 0.2 + Math.max(0, (d - 22) / 8) * 6));
    }
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2;
      add(g, new THREE.DodecahedronGeometry(1.2 + (i % 3) * 0.5), MAT.stoneDark, Math.cos(a) * 34, y + 0.8, Math.sin(a) * 23);
    }
    // o santuário da lagoa, do outro lado
    const s = new THREE.Group(); s.position.set(-30, H(p.x - 30, p.z - 10), -10); s.rotation.y = 0.9; g.add(s);
    add(s, box(8, 0.6, 6), MAT.stone, 0, 0.3, 0);
    add(s, box(5, 2.6, 3.6), MAT.plaster, 0, 1.9, 0);
    for (const sx of [-1, 1]) add(s, cyl(0.2, 0.22, 3, 8), MAT.vermilion, sx * 2.6, 2.1, 1.9);
    roof(s, { W: 9, D: 7, H: 2.4, L: 3, lift: 0.6, y: 3.6, ridge: true, rafters: false });
    lantern(s, -4, 0.6, 4, 1.8); lantern(s, 4, 0.6, 4, 1.8);
  }
  pos.needsUpdate = true;
  tg.computeVertexNormals();

  // ── Yotsutsuji, o mirante ──────────────────────────────────────────
  {
    const p = P.yotsutsuji;
    const y = H(p.x, p.z);
    for (let i = 0; i < pos.count; i++) {
      const d = Math.hypot(pos.getX(i) - p.x, pos.getZ(i) - p.z);
      if (d < 26) pos.setY(i, Math.min(pos.getY(i), y + Math.max(0, (d - 16) / 10) * 8));
    }
    const g = new THREE.Group(); g.position.set(p.x, y, p.z); root.add(g);
    add(g, box(34, 0.6, 22), MAT.stoneDark, 0, 0.3, 0, false);
    // a casa de chá
    const t = new THREE.Group(); t.position.set(6, 0.6, -4); t.rotation.y = -0.5; g.add(t);
    add(t, box(12, 3.4, 8), MAT.wood, 0, 1.7, 0);
    add(t, box(11, 1.2, 0.2), MAT.plaster, 0, 2.4, 4.05);
    add(t, box(12.4, 0.5, 8.4), MAT.vermilion, 0, 3.6, 0);
    roof(t, { W: 16, D: 12, H: 2.6, L: 8, lift: 0.5, y: 3.7, ridge: true, rafters: false });
    for (let i = 0; i < 5; i++) add(t, box(0.6, 0.9, 0.1), MAT.awning, -4 + i * 2, 4.9, 6.1);
    // bancos e o corrimão da vista
    for (const x of [-10, -4]) add(g, box(4, 0.4, 1), MAT.wood, x, 1.1, 7);
    for (let i = 0; i <= 8; i++) add(g, box(0.15, 1.1, 0.15), MAT.wood, -16 + i * 4, 1.15, 10.5, false);
    beam(g, new THREE.Vector3(-16, 1.7, 10.5), new THREE.Vector3(16, 1.7, 10.5), 0.08, MAT.wood);
    lantern(g, -14, 0.6, -6, 2.2); lantern(g, 14, 0.6, 6, 2.2);
  }
  pos.needsUpdate = true;
  tg.computeVertexNormals();

  // ── o cume ─────────────────────────────────────────────────────────
  {
    const p = P.cume, y = H(p.x, p.z);
    const g = new THREE.Group(); g.position.set(p.x, y, p.z); root.add(g);
    add(g, cyl(20, 26, 1.2, 24), MAT.stoneDark, 0, 0.6, 0, false);
    add(g, box(12, 1, 9), MAT.stone, 0, 1.7, 0);
    add(g, box(7, 3.2, 5), MAT.plaster, 0, 3.8, 0);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) add(g, cyl(0.24, 0.26, 3.4, 10), MAT.vermilion, sx * 3.6, 3.9, sz * 2.6);
    roof(g, { W: 12, D: 9.5, H: 3, L: 4.5, lift: 0.8, y: 6.2, ridge: true, rafters: true });
    // a clareira de mini-torii e altares de pedra (otsuka)
    const mini = toriiGeometry(0.8, 1.2, 0.06);
    const im = new THREE.InstancedMesh(mini, toriiMat, 240);
    const tmp = new THREE.Object3D();
    const rng = mulberry32(3);
    for (let i = 0; i < 240; i++) {
      const a = rng() * Math.PI * 2, r = 8 + rng() * 12;
      tmp.position.set(Math.cos(a) * r, 1.2 + Math.floor(rng() * 3) * 1.3, Math.sin(a) * r);
      tmp.rotation.set(0, -a + Math.PI / 2, 0); tmp.updateMatrix(); im.setMatrixAt(i, tmp.matrix);
    }
    g.add(im); instanced.push(im);
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      add(g, box(1.2, 2.2 + (i % 3) * 0.6, 0.5), MAT.stoneDark, Math.cos(a) * 15, 2.2, Math.sin(a) * 15).rotation.y = -a;
    }
    lantern(g, -6, 1.2, 6, 2.2); lantern(g, 6, 1.2, 6, 2.2);
  }

  // ── marcadores dos pontos ──────────────────────────────────────────
  const markers: Record<string, THREE.Vector3> = {};
  for (const h of map.hotspots) {
    const p = P[h.id];
    if (!p) continue;
    markers[h.id] = new THREE.Vector3(p.x, H(p.x, p.z), p.z);
  }
  // ── funde as peças estáticas por material: de ~1.200 draws para ~30 ──
  const merged = mergeStatic(root);

  const e = P.estacao, c = P.cume;
  return {
    markers,
    cameraStart: {
      pos: new THREE.Vector3(e.x - 210, 150, e.z + 260),
      target: new THREE.Vector3((e.x + c.x) / 2 - 60, 70, (e.z + c.z) / 2),
    },
    instanced,
    meshes: meshCount,
    drawGroups: merged,
  };
}

function nearestSampleIndex(samples: THREE.Vector3[], p: { x: number; z: number }) {
  let best = 0, bd = Infinity;
  samples.forEach((s, i) => {
    const d = (s.x - p.x) ** 2 + (s.z - p.z) ** 2;
    if (d < bd) { bd = d; best = i; }
  });
  return best;
}
function mulberry32(a: number) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Junta todas as malhas simples (não instanciadas, sem textura) que usam o
 * mesmo material numa geometria só. É o que faz a cena caber num celular:
 * o custo de GPU é por chamada de desenho, não por peça.
 */
function mergeStatic(root: THREE.Group) {
  const groups = new Map<THREE.Material, THREE.BufferGeometry[]>();
  const remove: THREE.Mesh[] = [];
  root.updateMatrixWorld(true);
  root.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh || (m as THREE.InstancedMesh).isInstancedMesh) return;
    const mat = m.material as THREE.MeshStandardMaterial;
    if (Array.isArray(m.material) || mat.map || mat.vertexColors) return;
    const g = m.geometry.clone();
    if (!g.getAttribute('normal')) g.computeVertexNormals();
    if (!g.getAttribute('uv')) return;
    for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(k)) g.deleteAttribute(k);
    g.morphAttributes = {};
    if (g.index) { const ng = g.toNonIndexed(); g.dispose(); ng.applyMatrix4(m.matrixWorld); pushTo(groups, mat, ng); }
    else { g.applyMatrix4(m.matrixWorld); pushTo(groups, mat, g); }
    remove.push(m);
  });
  for (const m of remove) { m.parent?.remove(m); m.geometry.dispose(); }
  let n = 0;
  for (const [mat, geos] of groups) {
    const g = mergeGeometries(geos, false);
    geos.forEach((x) => x.dispose());
    if (!g) continue;
    const mesh = new THREE.Mesh(g, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    root.add(mesh);
    n++;
  }
  return n;
}
function pushTo(map: Map<THREE.Material, THREE.BufferGeometry[]>, k: THREE.Material, g: THREE.BufferGeometry) {
  const l = map.get(k);
  if (l) l.push(g); else map.set(k, [g]);
}
