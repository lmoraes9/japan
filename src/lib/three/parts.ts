/**
 * Peças 3D geradas por código para os mapas em 3D: telhados curvos,
 * torii, árvores, lanternas, raposas. Nada é baixado; tudo é geometria.
 * Este módulo só é carregado nas páginas /3d (import dinâmico).
 */
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export const MAT = {
  vermilion: new THREE.MeshStandardMaterial({ color: 0xb8432a, roughness: 0.62 }),
  plaster: new THREE.MeshStandardMaterial({ color: 0xf0e9db, roughness: 0.95 }),
  wood: new THREE.MeshStandardMaterial({ color: 0x5a3a24, roughness: 0.8 }),
  woodLight: new THREE.MeshStandardMaterial({ color: 0x8a5e3b, roughness: 0.8 }),
  stone: new THREE.MeshStandardMaterial({ color: 0x9a968c, roughness: 0.95 }),
  stoneDark: new THREE.MeshStandardMaterial({ color: 0x6d6a63, roughness: 1 }),
  gold: new THREE.MeshStandardMaterial({ color: 0xd8b04f, metalness: 0.85, roughness: 0.3 }),
  white: new THREE.MeshStandardMaterial({ color: 0xf4f1ea, roughness: 0.9 }),
  black: new THREE.MeshStandardMaterial({ color: 0x1b1a1a, roughness: 0.6 }),
  water: new THREE.MeshStandardMaterial({ color: 0x35506b, roughness: 0.12, metalness: 0.25 }),
  rail: new THREE.MeshStandardMaterial({ color: 0x4a4d55, roughness: 0.6, metalness: 0.4 }),
  awning: new THREE.MeshStandardMaterial({ color: 0xd9534f, roughness: 0.9 }),
  awning2: new THREE.MeshStandardMaterial({ color: 0x3b6fb6, roughness: 0.9 }),
  roofUnder: new THREE.MeshStandardMaterial({ color: 0x7c5233, roughness: 0.9, side: THREE.DoubleSide }),
};

let tileTex: THREE.CanvasTexture | null = null;
function tileTexture() {
  if (tileTex) return tileTex;
  const s = 128;
  const cv = document.createElement('canvas');
  cv.width = cv.height = s;
  const g = cv.getContext('2d')!;
  g.fillStyle = '#3d4149';
  g.fillRect(0, 0, s, s);
  for (let y = 0; y < s; y += 16) {
    g.fillStyle = 'rgba(0,0,0,.35)';
    g.fillRect(0, y, s, 3);
    g.fillStyle = 'rgba(255,255,255,.07)';
    g.fillRect(0, y + 4, s, 2);
    for (let x = 0; x < s; x += 16) {
      g.fillStyle = 'rgba(0,0,0,.28)';
      g.fillRect(x + ((y / 16) % 2) * 8, y, 2, 16);
    }
  }
  tileTex = new THREE.CanvasTexture(cv);
  tileTex.wrapS = tileTex.wrapT = THREE.RepeatWrapping;
  tileTex.anisotropy = 8;
  tileTex.colorSpace = THREE.SRGBColorSpace;
  return tileTex;
}
let tileMatShared: THREE.MeshStandardMaterial | null = null;
/** um material de telha só, para todos os telhados: a repetição vai no UV de cada geometria */
function tileMat() {
  if (!tileMatShared) tileMatShared = new THREE.MeshStandardMaterial({ map: tileTexture(), color: 0xbfc3cc, roughness: 0.75, metalness: 0.05, side: THREE.DoubleSide });
  return tileMatShared;
}

export let meshCount = 0;
export function resetCount() {
  meshCount = 0;
}
export function add(parent: THREE.Object3D, geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0, shadow = true) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  m.castShadow = shadow;
  m.receiveShadow = true;
  parent.add(m);
  meshCount++;
  return m;
}
export const box = (w: number, h: number, d: number) => new THREE.BoxGeometry(w, h, d);
export const cyl = (rt: number, rb: number, h: number, seg = 14) => new THREE.CylinderGeometry(rt, rb, h, seg);
const UP = new THREE.Vector3(0, 1, 0);
export function beam(parent: THREE.Object3D, a: THREE.Vector3, b: THREE.Vector3, r: number, mat: THREE.Material) {
  const dir = new THREE.Vector3().subVectors(b, a);
  const len = dir.length();
  const m = add(parent, cyl(r, r, len, 6), mat);
  m.position.copy(a).add(dir.clone().multiplyScalar(0.5));
  m.quaternion.setFromUnitVectors(UP, dir.normalize());
  return m;
}

/** telhado de quatro águas com curva côncava e beirais levantados nos cantos */
function hipRoofGeometry(W: number, D: number, H: number, L: number, lift: number, N = 22, Mv = 10) {
  const pos: number[] = [], idx: number[] = [], uv: number[] = [];
  const yOf = (u: number, v: number) => H * Math.pow(1 - v, 1.55) + lift * Math.pow(Math.max(0, Math.abs(u) - 0.5) / 0.5, 2.2) * v;
  function face(fn: (u: number, v: number) => [number, number, number], flip: boolean) {
    const base = pos.length / 3;
    for (let i = 0; i <= N; i++)
      for (let j = 0; j <= Mv; j++) {
        const u = -1 + (2 * i) / N, v = j / Mv;
        const p = fn(u, v);
        pos.push(p[0], p[1], p[2]);
        uv.push(i / N, v);
      }
    for (let i = 0; i < N; i++)
      for (let j = 0; j < Mv; j++) {
        const a = base + i * (Mv + 1) + j, b = a + Mv + 1;
        if (!flip) idx.push(a, b, a + 1, b, b + 1, a + 1);
        else idx.push(a, a + 1, b, b, a + 1, b + 1);
      }
  }
  const sx = (u: number, v: number) => u * (L / 2 + v * (W / 2 - L / 2));
  face((u, v) => [sx(u, v), yOf(u, v), (v * D) / 2], false);
  face((u, v) => [sx(u, v), yOf(u, v), (-v * D) / 2], true);
  face((u, v) => [L / 2 + v * (W / 2 - L / 2), yOf(u, v), (u * v * D) / 2], true);
  face((u, v) => [-(L / 2 + v * (W / 2 - L / 2)), yOf(u, v), (u * v * D) / 2], false);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  for (let i = 0; i < uv.length; i += 2) { uv[i] *= W / 1.1; uv[i + 1] *= D / 1.1; }
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}
function eavePoints(W: number, D: number, lift: number, y0: number) {
  const pts: THREE.Vector3[] = [];
  const yOf = (u: number) => lift * Math.pow(Math.max(0, Math.abs(u) - 0.5) / 0.5, 2.2);
  for (let i = 0; i <= 16; i++) { const u = -1 + i / 8; pts.push(new THREE.Vector3((u * W) / 2, y0 + yOf(u), D / 2)); }
  for (let i = 1; i <= 16; i++) { const u = 1 - i / 8; pts.push(new THREE.Vector3(W / 2, y0 + yOf(u), (u * D) / 2)); }
  for (let i = 1; i <= 16; i++) { const u = 1 - i / 8; pts.push(new THREE.Vector3((u * W) / 2, y0 + yOf(u), -D / 2)); }
  for (let i = 1; i < 16; i++) { const u = -1 + i / 8; pts.push(new THREE.Vector3(-W / 2, y0 + yOf(u), (u * D) / 2)); }
  return pts;
}

export interface RoofOpts {
  W: number; D: number; H: number; L: number; lift: number; y: number;
  ridge?: boolean; rafters?: boolean; thickness?: number;
}
/** telhado completo: telhas, forro, beira, caibros, cumeeira e ornamentos */
export function roof(parent: THREE.Object3D, o: RoofOpts) {
  const { W, D, H, L, lift, y } = o;
  const th = o.thickness ?? 0.28;
  const g = hipRoofGeometry(W, D, H, L, lift);
  add(parent, g, tileMat(), 0, y, 0);
  const under = add(parent, g, MAT.roofUnder, 0, y - th, 0, false);
  under.scale.set(0.995, 1, 0.995);
  const curve = new THREE.CatmullRomCurve3(eavePoints(W, D, lift, y - th / 2), true, 'catmullrom', 0.2);
  add(parent, new THREE.TubeGeometry(curve, 120, th * 0.55, 6, true), MAT.wood);
  add(parent, new THREE.TubeGeometry(curve, 120, th * 0.32, 6, true), MAT.white, 0, th * 0.4, 0, false);
  if (o.rafters !== false) {
    const yOf = (u: number, v: number) => H * Math.pow(1 - v, 1.55) + lift * Math.pow(Math.max(0, Math.abs(u) - 0.5) / 0.5, 2.2) * v;
    const step = Math.max(0.7, W / 26);
    for (let x = -W / 2 + step; x < W / 2 - step / 2; x += step) {
      const u = x / (W / 2);
      for (const s of [1, -1]) {
        const a = new THREE.Vector3(x * 0.75, y + yOf(u * 0.75, 0.62) - th - 0.06, (s * 0.62 * D) / 2);
        const b = new THREE.Vector3(x, y + yOf(u, 1) - th - 0.06, (s * D) / 2 - s * 0.1);
        beam(parent, a, b, th * 0.25, MAT.woodLight);
      }
    }
    for (let z = -D / 2 + step; z < D / 2 - step / 2; z += step) {
      const u = z / (D / 2);
      for (const s of [1, -1]) {
        const a = new THREE.Vector3(s * (L / 2 + 0.62 * (W / 2 - L / 2)), y + yOf(u * 0.75, 0.62) - th - 0.06, z * 0.75);
        const b = new THREE.Vector3((s * W) / 2 - s * 0.1, y + yOf(u, 1) - th - 0.06, z);
        beam(parent, a, b, th * 0.25, MAT.woodLight);
      }
    }
  }
  if (o.ridge !== false) {
    add(parent, box(L + 0.8, 0.55, 0.9), MAT.black, 0, y + H + 0.22, 0);
    const sh = new THREE.Shape();
    sh.moveTo(0, 0); sh.quadraticCurveTo(0.7, 0.3, 0.55, 1.5); sh.lineTo(0.1, 1.75); sh.quadraticCurveTo(-0.25, 0.9, -0.2, 0);
    const sg = new THREE.ExtrudeGeometry(sh, { depth: 0.55, bevelEnabled: true, bevelSize: 0.06, bevelThickness: 0.06, bevelSegments: 2 });
    for (const s of [1, -1]) {
      const m = add(parent, sg, MAT.gold, s * (L / 2 + 0.25), y + H + 0.45, -0.27);
      m.scale.x = s;
    }
  }
}

/** conjunto de brackets (tokyō) sobre um pilar */
export function bracket(parent: THREE.Object3D, x: number, y: number, z: number, s = 1) {
  add(parent, box(0.95 * s, 0.5 * s, 0.95 * s), MAT.vermilion, x, y + 0.25 * s, z);
  add(parent, box(2.0 * s, 0.28 * s, 0.5 * s), MAT.vermilion, x, y + 0.64 * s, z);
  add(parent, box(0.5 * s, 0.28 * s, 2.0 * s), MAT.vermilion, x, y + 0.64 * s, z);
  for (const [dx, dz] of [[0.75, 0], [-0.75, 0], [0, 0.75], [0, -0.75], [0, 0]])
    add(parent, box(0.5 * s, 0.42 * s, 0.5 * s), MAT.white, x + dx * s, y + 0.99 * s, z + dz * s);
  add(parent, box(2.8 * s, 0.26 * s, 0.42 * s), MAT.vermilion, x, y + 1.32 * s, z);
  add(parent, box(0.42 * s, 0.26 * s, 2.8 * s), MAT.vermilion, x, y + 1.32 * s, z);
}

/** lanterna de pedra */
export function lantern(parent: THREE.Object3D, x: number, y0: number, z: number, h = 2.6) {
  add(parent, box(1.1, 0.25, 1.1), MAT.stoneDark, x, y0 + 0.12, z);
  add(parent, cyl(0.42, 0.5, 0.35, 8), MAT.stone, x, y0 + 0.42, z);
  add(parent, cyl(0.16, 0.2, h * 0.45, 8), MAT.stone, x, y0 + 0.6 + h * 0.225, z);
  add(parent, cyl(0.45, 0.3, 0.3, 8), MAT.stone, x, y0 + 0.6 + h * 0.45 + 0.15, z);
  const fy = y0 + 0.6 + h * 0.45 + 0.3;
  add(parent, box(0.7, 0.7, 0.7), MAT.stone, x, fy + 0.35, z);
  add(parent, box(0.74, 0.3, 0.3), MAT.black, x, fy + 0.35, z);
  add(parent, box(0.3, 0.3, 0.74), MAT.black, x, fy + 0.35, z);
  add(parent, cyl(0.25, 0.85, 0.55, 4), MAT.stone, x, fy + 0.98, z).rotation.y = Math.PI / 4;
  add(parent, new THREE.SphereGeometry(0.16, 8, 6), MAT.stone, x, fy + 1.35, z);
}

/** raposa de pedra (kitsune) sobre pedestal, com babador vermelho */
export function fox(parent: THREE.Object3D, x: number, y0: number, z: number, yaw: number, s = 1) {
  const g = new THREE.Group();
  g.position.set(x, y0, z);
  g.rotation.y = yaw;
  g.scale.setScalar(s);
  parent.add(g);
  add(g, box(1.6, 1.4, 1.6), MAT.stoneDark, 0, 0.7, 0);
  add(g, box(1.3, 0.2, 1.3), MAT.stone, 0, 1.5, 0);
  // corpo sentado
  const body = add(g, new THREE.SphereGeometry(0.55, 12, 10), MAT.stone, 0, 2.2, -0.1);
  body.scale.set(0.8, 1.25, 1);
  add(g, new THREE.SphereGeometry(0.42, 12, 10), MAT.stone, 0, 2.05, 0.35).scale.set(1, 0.6, 1); // patas/peito
  // cabeça e focinho
  add(g, new THREE.SphereGeometry(0.38, 12, 10), MAT.stone, 0, 3.05, 0.1);
  const snout = add(g, new THREE.ConeGeometry(0.2, 0.5, 8), MAT.stone, 0, 2.95, 0.5);
  snout.rotation.x = Math.PI / 2;
  // orelhas em pé
  for (const sx of [-1, 1]) {
    const ear = add(g, new THREE.ConeGeometry(0.13, 0.42, 6), MAT.stone, sx * 0.22, 3.48, 0.0);
    ear.rotation.z = -sx * 0.25;
  }
  // babador vermelho
  add(g, new THREE.TorusGeometry(0.3, 0.09, 6, 16), MAT.vermilion, 0, 2.7, 0.15).rotation.x = Math.PI / 2 - 0.3;
  // cauda levantada
  const tail = add(g, new THREE.ConeGeometry(0.22, 1.2, 8), MAT.stone, 0.25, 2.5, -0.6);
  tail.rotation.x = -0.5;
  add(g, new THREE.SphereGeometry(0.16, 8, 6), MAT.white, 0.28, 3.05, -0.85);
}

/** um torii como geometria única (para instanciar aos milhares) */
export function toriiGeometry(w = 4, h = 6, r = 0.32) {
  const parts: THREE.BufferGeometry[] = [];
  const paint = (g: THREE.BufferGeometry, c: THREE.Color) => {
    const n = g.getAttribute('position').count;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { arr[i * 3] = c.r; arr[i * 3 + 1] = c.g; arr[i * 3 + 2] = c.b; }
    g.setAttribute('color', new THREE.BufferAttribute(arr, 3));
    return g;
  };
  const red = new THREE.Color(0xc2492b), black = new THREE.Color(0x1b1a1a);
  for (const s of [-1, 1]) {
    parts.push(paint(new THREE.CylinderGeometry(r, r * 1.1, h, 8).translate((s * w) / 2, h / 2, 0), red));
    parts.push(paint(new THREE.CylinderGeometry(r * 1.4, r * 1.4, 0.25, 8).translate((s * w) / 2, 0.12, 0), black));
  }
  parts.push(paint(new THREE.BoxGeometry(w + 1.4, 0.42, 0.5).translate(0, h + 0.05, 0), red)); // kasagi
  parts.push(paint(new THREE.BoxGeometry(w + 1.8, 0.28, 0.6).translate(0, h + 0.4, 0), black)); // shimaki
  parts.push(paint(new THREE.BoxGeometry(w + 0.6, 0.34, 0.3).translate(0, h - 1.3, 0), red)); // nuki
  parts.push(paint(new THREE.BoxGeometry(0.4, 0.9, 0.24).translate(0, h - 0.6, 0), black)); // gakuzuka
  const g = mergeGeometries(parts, false)!;
  parts.forEach((p) => p.dispose());
  return g;
}

/** árvore: cedro (cones) ou copa redonda, geometria única com cores */
export type TreeKind = 'cedar' | 'broad' | 'maple' | 'pine' | 'cherry' | 'willow';
export function treeGeometry(kind: TreeKind) {
  const parts: THREE.BufferGeometry[] = [];
  const paint = (g: THREE.BufferGeometry, c: THREE.Color, jitter = 0.06) => {
    const n = g.getAttribute('position').count;
    const arr = new Float32Array(n * 3);
    const pos = g.getAttribute('position');
    for (let i = 0; i < n; i++) {
      const k = 1 + (pos.getY(i) / 8) * jitter * 4 - jitter;
      arr[i * 3] = c.r * k; arr[i * 3 + 1] = c.g * k; arr[i * 3 + 2] = c.b * k;
    }
    g.setAttribute('color', new THREE.BufferAttribute(arr, 3));
    return g;
  };
  const trunk = new THREE.Color(0x4a3526);
  if (kind === 'cedar') {
    parts.push(paint(new THREE.CylinderGeometry(0.22, 0.34, 3.2, 6).translate(0, 1.6, 0), trunk));
    const c = new THREE.Color(0x2c4a2a);
    parts.push(paint(new THREE.ConeGeometry(2.3, 4.2, 6).translate(0, 4.2, 0), c));
    parts.push(paint(new THREE.ConeGeometry(1.7, 3.6, 6).translate(0, 6.6, 0), c));
    parts.push(paint(new THREE.ConeGeometry(1.0, 3.0, 6).translate(0, 8.8, 0), c));
  } else if (kind === 'pine') {
    parts.push(paint(new THREE.CylinderGeometry(0.22, 0.36, 4.5, 6).translate(0, 2.2, 0), trunk));
    const c = new THREE.Color(0x35583a);
    for (const [dx, dy, dz, r] of [[0, 5.2, 0, 2.2], [1.6, 4.4, 0.4, 1.5], [-1.4, 4.8, -0.6, 1.4], [0.3, 6.3, 0.8, 1.2]]) {
      const s = new THREE.SphereGeometry(r, 7, 4).translate(dx, dy, dz); s.scale(1, 0.45, 1); parts.push(paint(s, c, 0.1));
    }
  } else if (kind === 'willow') {
    parts.push(paint(new THREE.CylinderGeometry(0.25, 0.4, 4.0, 6).translate(0, 2, 0), trunk));
    const c = new THREE.Color(0x7d9a4a);
    const s = new THREE.SphereGeometry(2.6, 8, 6).translate(0, 5.2, 0); s.scale(1, 1.15, 1); parts.push(paint(s, c, 0.12));
    for (let k = 0; k < 6; k++) { const a = (k / 6) * Math.PI * 2; parts.push(paint(new THREE.ConeGeometry(0.5, 3.2, 5).translate(Math.cos(a) * 2.2, 3.4, Math.sin(a) * 2.2), c, 0.1)); }
  } else {
    parts.push(paint(new THREE.CylinderGeometry(0.2, 0.3, 3.0, 6).translate(0, 1.5, 0), trunk));
    const c = new THREE.Color(kind === 'maple' ? 0xc2401f : kind === 'cherry' ? 0xe8b4c6 : 0x4c6f33);
    const crown = new THREE.SphereGeometry(2.4, 7, 5).translate(0, 4.6, 0);
    crown.scale(1, 0.8, 1);
    parts.push(paint(crown, c, 0.12));
    const crown2 = new THREE.SphereGeometry(1.6, 6, 4).translate(1.2, 5.6, 0.6);
    parts.push(paint(crown2, c, 0.12));
  }
  const g = mergeGeometries(parts, false)!;
  parts.forEach((p) => p.dispose());
  return g;
}

/** sprite numerado, para os marcadores dos pontos */
export function numberSprite(n: number, accent: string) {
  const s = 128;
  const cv = document.createElement('canvas');
  cv.width = cv.height = s;
  const g = cv.getContext('2d')!;
  g.beginPath(); g.arc(s / 2, s / 2, s / 2 - 6, 0, Math.PI * 2);
  g.fillStyle = accent; g.fill();
  g.lineWidth = 6; g.strokeStyle = '#fff'; g.stroke();
  g.fillStyle = '#fff';
  g.font = 'bold 64px system-ui, sans-serif';
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(String(n), s / 2, s / 2 + 4);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, depthTest: false, transparent: true }));
  sp.renderOrder = 10;
  return sp;
}
