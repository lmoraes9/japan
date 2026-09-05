/**
 * Motor genérico dos mapas em 3D: terreno, água, rios, percursos, floresta,
 * marcadores e a fusão de peças por material. Cada lugar descreve só o que
 * tem de próprio num SceneSpec (ver ./scenes).
 */
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { PlaceMap } from '@/data/placeMaps';
import { MAT, add, treeGeometry, resetCount, meshCount } from './parts';

export type Quality = 'alta' | 'leve';
export type XZ = { x: number; z: number };

export interface BuildCtx {
  root: THREE.Group;
  /** altura do terreno em qualquer ponto (já com platôs, lagos e rios) */
  H: (x: number, z: number) => number;
  /** posição XZ de cada ponto do mapa, pelo id */
  P: Record<string, XZ>;
  /** amostras de cada percurso, na ordem do spec.paths */
  paths: THREE.Vector3[][];
  quality: Quality;
  addInstanced: (im: THREE.InstancedMesh) => void;
  rng: () => number;
  /** deforma o terreno já construído (usar antes de qualquer add) */
  terrain: THREE.BufferAttribute;
}

export interface PathSpec {
  /** ids de pontos e/ou coordenadas soltas, na ordem */
  through: (string | XZ)[];
  width?: number;
  /** cor da faixa: pedra clara por padrão; 'asphalt' para cidade */
  kind?: 'stone' | 'asphalt' | 'none';
}

export interface SceneSpec {
  center: { lat: number; lng: number };
  scale: number;
  size: { w: number; d: number };
  /** altura base do terreno */
  terrain: (x: number, z: number) => number;
  /** platôs: dentro do raio a altura vira `y` (ou a altura do centro), com borda suave */
  flats?: { at: string | XZ; r: number; y?: number; edge?: number }[];
  /** lagos: elipse rebaixada com água */
  ponds?: { at: string | XZ; rx: number; rz: number; depth?: number; dx?: number; dz?: number }[];
  /** rios e canais: canal rebaixado ao longo de uma linha, com água */
  rivers?: { through: (string | XZ)[]; width: number; depth?: number }[];
  /** mar: água em todo terreno abaixo do nível */
  sea?: { level: number };
  paths?: PathSpec[];
  forest?: {
    count: number;
    /** decide se pode ter árvore aqui; padrão: fora dos caminhos */
    allow?: (x: number, z: number, y: number, P: Record<string, XZ>) => boolean;
    kinds?: Array<'cedar' | 'broad' | 'maple' | 'pine' | 'cherry' | 'willow'>;
    /** não colocar árvores mais perto que isso de um caminho */
    pathGap?: number;
  };
  /** cor do chão por altura/posição, em 0–1 */
  ground?: (x: number, z: number, y: number) => [number, number, number];
  build: (c: BuildCtx) => void;
  camera?: (P: Record<string, XZ>, H: (x: number, z: number) => number) => { pos: THREE.Vector3; target: THREE.Vector3 };
  fog?: { color: number; near: number; far: number };
  sky?: string;
  /** altura acima do chão para os marcadores */
  markerLift?: number;
}

export interface Built {
  markers: Record<string, THREE.Vector3>;
  cameraStart: { pos: THREE.Vector3; target: THREE.Vector3 };
  instanced: THREE.InstancedMesh[];
  meshes: number;
  drawGroups: number;
}

export function mulberry32(a: number) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
export const peak = (x: number, z: number, px: number, pz: number, h: number, r: number) => h * Math.exp(-(((x - px) ** 2 + (z - pz) ** 2) / (r * r)));
export const noise = (x: number, z: number, a = 1) => a * (Math.sin(x / 23) * Math.cos(z / 19) + 0.7 * Math.sin(x / 7.3 + z / 11) + 0.5 * Math.cos(x / 41 - z / 29));

function distToPolyline(x: number, z: number, pts: XZ[]) {
  let best = Infinity;
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    const dx = b.x - a.x, dz = b.z - a.z;
    const l2 = dx * dx + dz * dz || 1;
    const t = Math.max(0, Math.min(1, ((x - a.x) * dx + (z - a.z) * dz) / l2));
    const px = a.x + t * dx, pz = a.z + t * dz;
    best = Math.min(best, Math.hypot(x - px, z - pz));
  }
  return best;
}

export function buildScene(scene: THREE.Scene, map: PlaceMap, spec: SceneSpec, quality: Quality): Built {
  resetCount();
  const root = new THREE.Group();
  scene.add(root);
  const rng = mulberry32(11);

  const P: Record<string, XZ> = {};
  for (const h of map.hotspots)
    if (h.coords) P[h.id] = { x: (h.coords.lng - spec.center.lng) * 91000 * spec.scale, z: -(h.coords.lat - spec.center.lat) * 111000 * spec.scale };
  const at = (a: string | XZ): XZ => (typeof a === 'string' ? P[a] : a);

  // ── a função de altura, com platôs, lagos e rios aplicados ─────────
  const flats = (spec.flats ?? []).map((f) => ({ ...f, p: at(f.at) }));
  const ponds = (spec.ponds ?? []).map((p) => ({ ...p, p: at(p.at) }));
  const rivers = (spec.rivers ?? []).map((r) => ({ ...r, pts: r.through.map(at) }));
  const base = spec.terrain;
  const flatY = new Map<number, number>();
  flats.forEach((f, i) => flatY.set(i, f.y ?? base(f.p.x, f.p.z)));
  const H = (x: number, z: number) => {
    let y = base(x, z);
    flats.forEach((f, i) => {
      const d = Math.hypot(x - f.p.x, z - f.p.z);
      const e = f.edge ?? Math.max(6, f.r * 0.35);
      if (d < f.r + e) {
        const k = 1 - smooth(f.r, f.r + e, d);
        y = y + (flatY.get(i)! - y) * k;
      }
    });
    for (const p of ponds) {
      const d = Math.hypot((x - p.p.x - (p.dx ?? 0)) / p.rx, (z - p.p.z - (p.dz ?? 0)) / p.rz);
      if (d < 1.6) {
        const level = base(p.p.x, p.p.z) - 0.4;
        const k = 1 - smooth(1, 1.6, d);
        const bottom = level - (p.depth ?? 2.5) * (1 - Math.min(1, d) ** 2);
        y = Math.min(y, y + (bottom - y) * k);
      }
    }
    for (const r of rivers) {
      const d = distToPolyline(x, z, r.pts);
      const w = r.width / 2;
      if (d < w + 10) {
        const k = 1 - smooth(w, w + 10, d);
        const level = riverLevel(r, x, z);
        y = y + (level - (r.depth ?? 3) - y) * k;
      }
    }
    return y;
  };
  function riverLevel(r: { pts: XZ[] }, x: number, z: number) {
    // nível da água: a altura base no ponto mais próximo da linha, para o rio "descer" com o terreno
    let best = Infinity, bx = 0, bz = 0;
    for (let i = 0; i < r.pts.length - 1; i++) {
      const a = r.pts[i], b = r.pts[i + 1];
      const dx = b.x - a.x, dz = b.z - a.z, l2 = dx * dx + dz * dz || 1;
      const t = Math.max(0, Math.min(1, ((x - a.x) * dx + (z - a.z) * dz) / l2));
      const px = a.x + t * dx, pz = a.z + t * dz, d = Math.hypot(x - px, z - pz);
      if (d < best) { best = d; bx = px; bz = pz; }
    }
    return base(bx, bz);
  }

  // ── terreno ────────────────────────────────────────────────────────
  const TW = spec.size.w, TD = spec.size.d;
  const SEG = quality === 'alta' ? Math.min(220, Math.round(TW / 4.5)) : Math.round(TW / 9);
  const tg = new THREE.PlaneGeometry(TW, TD, SEG, Math.max(20, Math.round((SEG * TD) / TW)));
  tg.rotateX(-Math.PI / 2);
  const pos = tg.getAttribute('position') as THREE.BufferAttribute;
  const col = new Float32Array(pos.count * 3);
  const cLow = new THREE.Color(0x8f9a6a), cMid = new THREE.Color(0x4f6e3a), cHigh = new THREE.Color(0x3a5630), cSand = new THREE.Color(0xd8cba8), cBed = new THREE.Color(0x6e7a6a);
  let minY = Infinity, maxY = -Infinity;
  for (let i = 0; i < pos.count; i++) { const y = base(pos.getX(i), pos.getZ(i)); minY = Math.min(minY, y); maxY = Math.max(maxY, y); }
  const seaLevel = spec.sea?.level;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i);
    const y = H(x, z);
    pos.setY(i, y);
    let c: THREE.Color;
    if (spec.ground) { const g = spec.ground(x, z, y); c = new THREE.Color(g[0], g[1], g[2]); }
    else {
      const t = Math.min(1, Math.max(0, (y - minY) / Math.max(40, maxY - minY)));
      c = t < 0.25 ? cLow.clone().lerp(cMid, t / 0.25) : cMid.clone().lerp(cHigh, (t - 0.25) / 0.75);
    }
    if (seaLevel !== undefined && y < seaLevel + 4) c.lerp(cSand, 1 - smooth(seaLevel - 2, seaLevel + 4, y));
    if (y < base(x, z) - 1.5) c.lerp(cBed, 0.6); // leito de lago/rio
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
  }
  tg.setAttribute('color', new THREE.BufferAttribute(col, 3));
  tg.computeVertexNormals();
  const terrain = add(root, tg, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 }), 0, 0, 0, false);
  terrain.receiveShadow = true;

  // ── água ───────────────────────────────────────────────────────────
  if (seaLevel !== undefined) {
    const sea = add(root, new THREE.PlaneGeometry(TW * 3, TD * 3), new THREE.MeshStandardMaterial({ color: 0x3f6f8f, roughness: 0.15, metalness: 0.25, transparent: true, opacity: 0.92 }), 0, seaLevel, 0, false);
    sea.rotation.x = -Math.PI / 2;
  }
  for (const p of ponds) {
    const level = base(p.p.x, p.p.z) - 0.4;
    const w = add(root, new THREE.CircleGeometry(1, 48), MAT.water, p.p.x + (p.dx ?? 0), level, p.p.z + (p.dz ?? 0), false);
    w.rotation.x = -Math.PI / 2;
    w.scale.set(p.rx * 1.02, p.rz * 1.02, 1);
  }
  for (const r of rivers) {
    // fita de água ao longo da linha do rio
    const pts = r.pts.map((p) => new THREE.Vector3(p.x, 0, p.z));
    const curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.3);
    const s = curve.getSpacedPoints(Math.max(20, Math.round(curve.getLength() / 6)));
    const rp: number[] = [], ri: number[] = [];
    for (let i = 0; i < s.length; i++) {
      const p = s[i], q = s[Math.min(s.length - 1, i + 1)], o = s[Math.max(0, i - 1)];
      const t = new THREE.Vector3().subVectors(q, o).setY(0).normalize();
      const n = new THREE.Vector3(-t.z, 0, t.x);
      const level = riverLevel(r, p.x, p.z) - 0.6;
      for (const sd of [-1, 1]) rp.push(p.x + (n.x * sd * (r.width + 6)) / 2, level, p.z + (n.z * sd * (r.width + 6)) / 2);
      if (i < s.length - 1) { const a = i * 2; ri.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
    }
    const rg = new THREE.BufferGeometry();
    rg.setAttribute('position', new THREE.Float32BufferAttribute(rp, 3));
    rg.setIndex(ri); rg.computeVertexNormals();
    add(root, rg, new THREE.MeshStandardMaterial({ color: 0x3f6f8f, roughness: 0.15, metalness: 0.25, side: THREE.DoubleSide }), 0, 0, 0, false);
  }

  // ── percursos ──────────────────────────────────────────────────────
  const paths: THREE.Vector3[][] = [];
  const allSamples: THREE.Vector3[] = [];
  for (const ps of spec.paths ?? []) {
    const pts = ps.through.map(at).map((p) => new THREE.Vector3(p.x, 0, p.z));
    pts.forEach((p) => (p.y = H(p.x, p.z)));
    const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal', 0.4);
    const n = Math.max(40, Math.round(curve.getLength() / 1.2));
    const samples = curve.getSpacedPoints(n);
    samples.forEach((p) => (p.y = H(p.x, p.z) + 0.35));
    paths.push(samples);
    allSamples.push(...samples);
    if (ps.kind === 'none') continue;
    const w = ps.width ?? 4.5;
    const rp: number[] = [], ri: number[] = [];
    for (let i = 0; i < samples.length; i++) {
      const p = samples[i], q = samples[Math.min(samples.length - 1, i + 1)], o = samples[Math.max(0, i - 1)];
      const t = new THREE.Vector3().subVectors(q, o).setY(0).normalize();
      const nn = new THREE.Vector3(-t.z, 0, t.x);
      for (const s of [-1, 1]) { const x = p.x + (nn.x * s * w) / 2, z = p.z + (nn.z * s * w) / 2; rp.push(x, H(x, z) + 0.4, z); }
      if (i < samples.length - 1) { const a = i * 2; ri.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
    }
    const rg = new THREE.BufferGeometry();
    rg.setAttribute('position', new THREE.Float32BufferAttribute(rp, 3));
    rg.setIndex(ri); rg.computeVertexNormals();
    add(root, rg, new THREE.MeshStandardMaterial({ color: ps.kind === 'asphalt' ? 0x5a5c60 : 0xb9ad98, roughness: 1, side: THREE.DoubleSide }), 0, 0, 0, false);
  }
  const nearPath = (x: number, z: number, r: number) => {
    for (let i = 0; i < allSamples.length; i += 3) {
      const p = allSamples[i];
      if ((p.x - x) ** 2 + (p.z - z) ** 2 < r * r) return true;
    }
    return false;
  };

  // ── floresta ───────────────────────────────────────────────────────
  const instanced: THREE.InstancedMesh[] = [];
  if (spec.forest) {
    const f = spec.forest;
    const count = quality === 'alta' ? f.count : Math.round(f.count * 0.4);
    const kinds = f.kinds ?? ['cedar', 'cedar', 'cedar', 'broad', 'maple'];
    const lists: Record<string, THREE.Matrix4[]> = {};
    kinds.forEach((k) => (lists[k] = []));
    const tmp = new THREE.Object3D();
    const frng = mulberry32(7);
    let tries = 0, placed = 0;
    while (placed < count && tries++ < count * 8) {
      const x = -TW / 2 + frng() * TW, z = -TD / 2 + frng() * TD;
      const y = H(x, z);
      if (seaLevel !== undefined && y < seaLevel + 2) continue;
      if (y < base(x, z) - 1) continue; // dentro de lago ou rio
      if (nearPath(x, z, f.pathGap ?? 7)) continue;
      if (f.allow && !f.allow(x, z, y, P)) continue;
      const k = kinds[Math.floor(frng() * kinds.length)];
      tmp.position.set(x, y - 0.4, z);
      tmp.rotation.set(0, frng() * Math.PI * 2, 0);
      tmp.scale.setScalar(0.8 + frng() * 1.1);
      tmp.updateMatrix();
      lists[k].push(tmp.matrix.clone());
      placed++;
    }
    const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 });
    for (const k of Object.keys(lists)) {
      if (!lists[k].length) continue;
      const im = new THREE.InstancedMesh(treeGeometry(k as 'cedar'), mat, lists[k].length);
      lists[k].forEach((m, i) => im.setMatrixAt(i, m));
      im.castShadow = quality === 'alta';
      im.receiveShadow = true;
      root.add(im);
      instanced.push(im);
    }
  }

  // ── o que é próprio do lugar ───────────────────────────────────────
  spec.build({ root, H, P, paths, quality, addInstanced: (im) => { root.add(im); instanced.push(im); }, rng, terrain: pos });
  pos.needsUpdate = true;
  tg.computeVertexNormals();

  const drawGroups = mergeStatic(root);

  const markers: Record<string, THREE.Vector3> = {};
  for (const h of map.hotspots) {
    const p = P[h.id];
    if (!p) continue;
    markers[h.id] = new THREE.Vector3(p.x, Math.max(H(p.x, p.z), seaLevel ?? -Infinity), p.z);
  }
  let cameraStart: Built['cameraStart'];
  if (spec.camera) cameraStart = spec.camera(P, H);
  else {
    const b = new THREE.Box3();
    Object.values(markers).forEach((m) => b.expandByPoint(m));
    const c = b.getCenter(new THREE.Vector3());
    const ext = Math.max(b.max.x - b.min.x, b.max.z - b.min.z, 120);
    cameraStart = { pos: new THREE.Vector3(c.x - ext * 0.55, c.y + ext * 0.75, c.z + ext * 0.95), target: new THREE.Vector3(c.x, c.y, c.z) };
  }
  return { markers, cameraStart, instanced, meshes: meshCount, drawGroups };
}

/**
 * Junta todas as malhas simples (não instanciadas, sem textura) que usam o
 * mesmo material numa geometria só: o custo de GPU é por chamada de desenho.
 */
function mergeStatic(root: THREE.Group) {
  const groups = new Map<THREE.Material, THREE.BufferGeometry[]>();
  const remove: THREE.Mesh[] = [];
  root.updateMatrixWorld(true);
  root.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh || (m as THREE.InstancedMesh).isInstancedMesh) return;
    const mat = m.material as THREE.MeshStandardMaterial;
    if (Array.isArray(m.material) || mat.vertexColors || mat.transparent) return;
    if (!m.geometry.getAttribute('uv')) return;
    const g = m.geometry.clone();
    if (!g.getAttribute('normal')) g.computeVertexNormals();
    for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(k)) g.deleteAttribute(k);
    g.morphAttributes = {};
    const ng = g.index ? g.toNonIndexed() : g;
    if (ng !== g) g.dispose();
    ng.applyMatrix4(m.matrixWorld);
    const l = groups.get(mat);
    if (l) l.push(ng); else groups.set(mat, [ng]);
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

/** espalha instâncias de uma geometria ao longo de um percurso */
export function alongPath(samples: THREE.Vector3[], from: number, to: number, step: number, fn: (m: THREE.Matrix4, i: number) => void, opts: { scale?: (i: number) => number; lift?: number; side?: number } = {}) {
  const tmp = new THREE.Object3D();
  for (let i = from; i < Math.min(to, samples.length - 2); i += step) {
    const p = samples[i], q = samples[Math.min(samples.length - 1, i + 2)];
    const t = new THREE.Vector3().subVectors(q, p).setY(0);
    if (t.lengthSq() < 1e-6) continue;
    t.normalize();
    const n = new THREE.Vector3(-t.z, 0, t.x);
    const side = opts.side ?? 0;
    tmp.position.set(p.x + n.x * side, p.y + (opts.lift ?? -0.3), p.z + n.z * side);
    tmp.rotation.set(0, Math.atan2(t.x, t.z), 0);
    tmp.scale.setScalar(opts.scale ? opts.scale(i) : 1);
    tmp.updateMatrix();
    fn(tmp.matrix.clone(), i);
  }
}
export function nearestIndex(samples: THREE.Vector3[], p: XZ) {
  let best = 0, bd = Infinity;
  samples.forEach((s, i) => { const d = (s.x - p.x) ** 2 + (s.z - p.z) ** 2; if (d < bd) { bd = d; best = i; } });
  return best;
}
export function instances(geo: THREE.BufferGeometry, mat: THREE.Material, list: THREE.Matrix4[], shadow = true) {
  const im = new THREE.InstancedMesh(geo, mat, list.length);
  list.forEach((m, i) => im.setMatrixAt(i, m));
  im.castShadow = shadow;
  im.receiveShadow = true;
  return im;
}
