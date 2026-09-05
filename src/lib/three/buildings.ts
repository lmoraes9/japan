/**
 * Construções para os mapas em 3D: salões, portões, pagodes, castelos,
 * pontes, casas, torres, estátuas e o que mais aparece nos lugares.
 * Todas recebem um grupo já posicionado (x, y do chão, z) e a rotação.
 */
import * as THREE from 'three';
import { MAT, add, box, cyl, beam, roof, bracket, lantern, toriiGeometry } from './parts';
import { instances } from './engine';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export function group(parent: THREE.Object3D, x: number, y: number, z: number, yaw = 0, scale = 1) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.y = yaw;
  g.scale.setScalar(scale);
  parent.add(g);
  return g;
}

/** salão de templo: plataforma, pilares, paredes, brackets e telhado (dois, se `two`) */
export function hall(g: THREE.Object3D, o: { bays?: number; depthBays?: number; bay?: number; two?: boolean; gold?: boolean; lanterns?: boolean; open?: boolean } = {}) {
  const bays = o.bays ?? 5, db = o.depthBays ?? 3, bw = o.bay ?? 4;
  const W = bays * bw, D = db * bw;
  const wall = o.gold ? MAT.gold : MAT.plaster;
  add(g, box(W + 10, 1.2, D + 8), MAT.stone, 0, 0.6, 0);
  add(g, box(W + 7, 0.35, D + 5), MAT.woodLight, 0, 1.35, 0);
  const pH = 5;
  for (let i = 0; i <= bays; i++) for (const s of [-1, 1]) add(g, cyl(0.32, 0.36, pH, 10), MAT.vermilion, -W / 2 + i * bw, 1.5 + pH / 2, (s * D) / 2);
  for (let j = 1; j < db; j++) for (const s of [-1, 1]) add(g, cyl(0.32, 0.36, pH, 10), MAT.vermilion, (s * W) / 2, 1.5 + pH / 2, -D / 2 + j * bw);
  add(g, box(W - 0.3, 3.6, 0.25), wall, 0, 3.3, -D / 2);
  add(g, box(0.25, 3.6, D - 0.3), wall, -W / 2, 3.3, 0);
  add(g, box(0.25, 3.6, D - 0.3), wall, W / 2, 3.3, 0);
  add(g, box(W - 0.3, 1.2, 0.25), wall, 0, 5.8, D / 2);
  if (!o.open) {
    add(g, box(Math.min(6, bw * 1.4), 3.4, 0.2), MAT.black, 0, 3.2, D / 2 - 0.1, false);
    for (let i = 0; i < bays; i++) {
      const x = -W / 2 + i * bw + bw / 2;
      if (Math.abs(x) < bw) continue;
      add(g, box(bw - 0.6, 3.4, 0.14), MAT.black, x, 3.2, D / 2 - 0.1, false);
      for (let k = 0; k < 5; k++) add(g, box(0.08, 3.4, 0.2), MAT.woodLight, x - (bw - 0.8) / 2 + (k * (bw - 0.8)) / 4, 3.2, D / 2, false);
    }
  }
  for (let i = 0; i <= bays; i++) for (const s of [-1, 1]) bracket(g, -W / 2 + i * bw, 6.5, (s * D) / 2, 0.8);
  if (o.two !== false) {
    roof(g, { W: W + 14, D: D + 12, H: 2.0, L: W - 2, lift: 0.8, y: 7.9, ridge: false, rafters: true });
    add(g, box(W - 1, 2.2, D - 1), wall, 0, 9.6, 0);
    roof(g, { W: W + 16, D: D + 14, H: 6.5, L: W - 6, lift: 1.3, y: 10.6, ridge: true, rafters: true });
  } else {
    roof(g, { W: W + 14, D: D + 12, H: 5.5, L: W - 5, lift: 1.1, y: 7.9, ridge: true, rafters: true });
  }
  add(g, cyl(0.6, 0.8, 2.2, 12), MAT.gold, 0, 2.6, -2);
  add(g, new THREE.SphereGeometry(0.55, 10, 8), MAT.gold, 0, 4.1, -2);
  if (o.lanterns !== false) { lantern(g, -W / 2 - 4, 1.2, D / 2 + 3, 2.4); lantern(g, W / 2 + 4, 1.2, D / 2 + 3, 2.4); }
}

/** portão de um andar (Sanmon, Ōtemon…) */
export function gate1(g: THREE.Object3D, o: { w?: number; d?: number; h?: number; white?: boolean } = {}) {
  const W = o.w ?? 14, D = o.d ?? 8, h = o.h ?? 7;
  add(g, box(W + 4, 0.8, D + 4), MAT.stone, 0, 0.4, 0);
  const cols = Math.max(2, Math.round(W / 5));
  for (let i = 0; i <= cols; i++) for (const s of [-1, 1]) {
    const x = -W / 2 + (i * W) / cols;
    add(g, cyl(0.42, 0.46, h, 10), o.white ? MAT.wood : MAT.vermilion, x, 0.8 + h / 2, (s * D) / 2);
    bracket(g, x, 0.8 + h, (s * D) / 2, 0.75);
  }
  if (o.white) { add(g, box(W, h * 0.6, D), MAT.plaster, 0, 0.8 + h * 0.6, 0); add(g, box(W * 0.35, h * 0.55, D + 0.4), MAT.black, 0, 0.8 + h * 0.3, 0, false); }
  add(g, box(W + 1, 0.5, D + 1), MAT.vermilion, 0, 0.8 + h, 0);
  roof(g, { W: W + 10, D: D + 8, H: 4.5, L: W - 2, lift: 1.0, y: 0.8 + h + 1.5, ridge: true, rafters: true });
}

/** portão de dois andares (Rōmon, Hōzōmon, Nandaimon) */
export function gate2(g: THREE.Object3D, o: { w?: number; d?: number; lanternBig?: boolean } = {}) {
  const W = o.w ?? 18, D = o.d ?? 10;
  add(g, box(W + 6, 1.2, D + 4), MAT.stone, 0, 0.6, 0);
  const cols = Math.max(3, Math.round(W / 5));
  for (let i = 0; i <= cols; i++) for (const s of [-1, 1]) {
    const x = -W / 2 + (i * W) / cols;
    add(g, cyl(0.45, 0.5, 7, 10), MAT.vermilion, x, 4.7, (s * D) / 2);
    bracket(g, x, 8.2, (s * D) / 2, 0.8);
  }
  add(g, box(W, 0.5, D - 2), MAT.vermilion, 0, 8.0, 0);
  roof(g, { W: W + 8, D: D + 6, H: 2.0, L: W - 4, lift: 0.7, y: 9.6, ridge: false, rafters: true });
  add(g, box(W - 2, 5, D - 3), MAT.plaster, 0, 12.6, 0);
  for (let i = 0; i <= cols; i++) for (const s of [-1, 1]) add(g, cyl(0.35, 0.35, 5, 8), MAT.vermilion, -W / 2 + (i * W) / cols, 12.6, (s * D) / 2 - s * 0.4);
  add(g, box(W + 2, 0.4, D + 1), MAT.vermilion, 0, 12.4, 0);
  for (const s of [-1, 1]) beam(g, new THREE.Vector3(-W / 2 - 1, 11.4, (s * D) / 2 + s * 0.8), new THREE.Vector3(W / 2 + 1, 11.4, (s * D) / 2 + s * 0.8), 0.12, MAT.vermilion);
  roof(g, { W: W + 10, D: D + 8, H: 5.5, L: W - 6, lift: 1.1, y: 15.1, ridge: true, rafters: true });
  if (o.lanternBig) {
    // a lanterna gigante do Kaminarimon
    const l = add(g, cyl(2.6, 2.6, 5.5, 20), new THREE.MeshStandardMaterial({ color: 0xd8332a, roughness: 0.7 }), 0, 4.8, 0);
    l.scale.set(1, 1, 1);
    add(g, cyl(2.7, 2.7, 0.4, 20), MAT.black, 0, 7.7, 0);
    add(g, cyl(2.7, 2.7, 0.4, 20), MAT.black, 0, 1.9, 0);
    add(g, box(1.2, 3.2, 0.1), MAT.black, 0, 4.8, 2.62, false);
  } else {
    lantern(g, -W / 2 - 5, 1.2, D / 2 + 3, 2.6); lantern(g, W / 2 + 5, 1.2, D / 2 + 3, 2.6);
  }
}

/** pagode de N andares com a agulha de bronze */
export function pagoda(g: THREE.Object3D, tiers = 5, size0 = 7.2) {
  add(g, box(size0 + 5, 1.0, size0 + 5), MAT.stone, 0, 0.5, 0);
  let y = 1.0, size = size0;
  for (let t = 0; t < tiers; t++) {
    const h = 2.6;
    add(g, box(size - 0.4, h, size - 0.4), MAT.plaster, 0, y + h / 2, 0);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      add(g, cyl(0.22, 0.24, h, 8), MAT.vermilion, (sx * size) / 2, y + h / 2, (sz * size) / 2);
      bracket(g, (sx * size) / 2, y + h, (sz * size) / 2, 0.7);
    }
    for (const s of [1, -1]) {
      beam(g, new THREE.Vector3(-size / 2, y + h - 0.2, (s * size) / 2), new THREE.Vector3(size / 2, y + h - 0.2, (s * size) / 2), 0.13, MAT.vermilion);
      add(g, box(size - 1.6, 1.2, 0.12), MAT.black, 0, y + h * 0.5, s * (size / 2 - 0.12), false);
    }
    if (t > 0) {
      add(g, box(size + 1.6, 0.22, size + 1.6), MAT.woodLight, 0, y + 0.11, 0);
      const r = size / 2 + 0.8;
      for (const s of [1, -1]) {
        beam(g, new THREE.Vector3(-r, y + 0.85, s * r), new THREE.Vector3(r, y + 0.85, s * r), 0.05, MAT.vermilion);
        beam(g, new THREE.Vector3(s * r, y + 0.85, -r), new THREE.Vector3(s * r, y + 0.85, r), 0.05, MAT.vermilion);
      }
    }
    const last = t === tiers - 1;
    roof(g, { W: size + 4.6, D: size + 4.6, H: last ? 2.6 : 1.25, L: last ? 0.3 : size - 3.2, lift: 0.75, y: y + h + 1.45, ridge: false, rafters: t < 3 });
    y += h + 1.45 + (last ? 0 : 0.35);
    size *= 0.9;
  }
  const top = y + 2.6;
  add(g, cyl(0.7, 0.9, 0.6, 10), MAT.gold, 0, top + 0.3, 0);
  add(g, cyl(0.12, 0.16, 7.5, 8), MAT.gold, 0, top + 4.5, 0);
  for (let k = 0; k < 9; k++) add(g, new THREE.TorusGeometry(0.75 - k * 0.04, 0.07, 6, 20), MAT.gold, 0, top + 1.8 + k * 0.62, 0).rotation.x = Math.PI / 2;
  add(g, new THREE.ConeGeometry(0.5, 1.4, 8), MAT.gold, 0, top + 8.6, 0);
}

/** santuário pequeno, com telhado próprio e duas lanternas */
export function shrine(g: THREE.Object3D, size = 9, o: { straight?: boolean; torii?: boolean } = {}) {
  add(g, box(size + 5, 0.8, size * 0.8 + 4), MAT.stone, 0, 0.4, 0);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) add(g, cyl(0.26, 0.3, 4, 8), MAT.vermilion, (sx * size) / 2, 2.8, (sz * size * 0.7) / 2);
  add(g, box(size - 0.5, 3.2, size * 0.7 - 0.5), MAT.plaster, 0, 2.4, 0);
  add(g, box(size * 0.35, 2.6, 0.2), MAT.black, 0, 2.1, (size * 0.7) / 2 + 0.05, false);
  if (o.straight) {
    // telhado reto, estilo antigo (Sumiyoshi / Ise)
    const r = add(g, box(size + 3, 0.5, size * 0.7 + 3), MAT.black, 0, 5.8, 0);
    r.rotation.z = 0;
    add(g, new THREE.CylinderGeometry(0.01, size * 0.5 + 1.5, 3.2, 4, 1), MAT.black, 0, 6.5, 0).rotation.y = Math.PI / 4;
    for (const s of [-1, 1]) { add(g, box(0.3, 3, 0.3), MAT.black, s * (size / 2 + 1), 9, 0).rotation.z = s * 0.5; }
  } else {
    roof(g, { W: size + 6, D: size * 0.7 + 5, H: 3.4, L: size * 0.5, lift: 0.8, y: 4.9, ridge: true, rafters: true });
  }
  lantern(g, -size / 2 - 1, 0.8, size * 0.5 + 3, 2.2); lantern(g, size / 2 + 1, 0.8, size * 0.5 + 3, 2.2);
  if (o.torii) bigTorii(g, 0, 0.8, size * 0.5 + 9, 0, 6, 8);
}

export function bigTorii(parent: THREE.Object3D, x: number, y: number, z: number, yaw: number, w = 9, h = 12, mat?: THREE.Material) {
  const m = new THREE.Mesh(toriiGeometry(w, h, w * 0.06), mat ?? new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.6 }));
  m.position.set(x, y, z);
  m.rotation.y = yaw;
  m.castShadow = true;
  parent.add(m);
  return m;
}

/** castelo japonês: base de pedra inclinada, andares brancos, telhados cinza, gablões, shachihoko */
export function castle(g: THREE.Object3D, o: { tiers?: number; size?: number; base?: number; turrets?: boolean } = {}) {
  const tiers = o.tiers ?? 5, size0 = o.size ?? 22, baseH = o.base ?? 14;
  const stoneMat = new THREE.MeshStandardMaterial({ color: 0x7f7b72, roughness: 1 });
  const b = add(g, new THREE.CylinderGeometry(size0 * 0.62, size0 * 0.95, baseH, 4, 1), stoneMat, 0, baseH / 2, 0);
  b.rotation.y = Math.PI / 4;
  let y = baseH, size = size0;
  for (let t = 0; t < tiers; t++) {
    const h = t === 0 ? 6 : 4.6;
    add(g, box(size, h, size * 0.8), MAT.plaster, 0, y + h / 2, 0);
    add(g, box(size + 0.6, 0.9, size * 0.8 + 0.6), MAT.black, 0, y + 0.45, 0);
    // janelas
    const n = Math.max(2, Math.round(size / 4));
    for (let i = 0; i < n; i++) for (const s of [-1, 1]) {
      add(g, box(1.2, 1.4, 0.15), MAT.black, -size / 2 + (i + 0.5) * (size / n), y + h * 0.55, (s * size * 0.8) / 2, false);
      add(g, box(0.15, 1.4, 1.2), MAT.black, (s * size) / 2, y + h * 0.55, -size * 0.4 + (i + 0.5) * ((size * 0.8) / n), false);
    }
    const last = t === tiers - 1;
    roof(g, { W: size + 6, D: size * 0.8 + 6, H: last ? 4.5 : 1.6, L: last ? size * 0.3 : size - 4, lift: 1.0, y: y + h, ridge: last, rafters: false, thickness: 0.5 });
    // gablão triangular (chidori-hafu) alternado
    if (!last && t % 2 === 0) {
      const gb = add(g, new THREE.CylinderGeometry(0.01, size * 0.16, 2.2, 3, 1), MAT.plaster, 0, y + h + 1.2, (size * 0.8) / 2 + 1.5);
      gb.rotation.set(Math.PI / 2, 0, 0);
    }
    y += h + (last ? 0 : 1.9);
    size *= 0.82;
  }
  // shachihoko dourados nas pontas da cumeeira
  for (const s of [-1, 1]) {
    const f = add(g, new THREE.ConeGeometry(0.7, 2.4, 6), MAT.gold, s * size * 0.32, y + 5.4, 0);
    f.rotation.z = -s * 0.35;
  }
  if (o.turrets !== false) {
    // torres menores ligadas por muralha
    for (const [dx, dz] of [[-size0 * 1.1, size0 * 0.5], [size0 * 1.0, -size0 * 0.6]]) {
      const tg = group(g, dx, 0, dz);
      const tb = add(tg, new THREE.CylinderGeometry(5, 8, 8, 4, 1), stoneMat, 0, 4, 0); tb.rotation.y = Math.PI / 4;
      add(tg, box(8, 4, 7), MAT.plaster, 0, 10, 0);
      roof(tg, { W: 12, D: 11, H: 2.6, L: 4, lift: 0.7, y: 12, ridge: true, rafters: false, thickness: 0.4 });
    }
  }
}

/** estação pequena com plataforma e trilhos */
export function station(g: THREE.Object3D, o: { railLen?: number; modern?: boolean } = {}) {
  const L = o.railLen ?? 200;
  for (const dx of [-3, 3]) add(g, box(0.5, 0.3, L), MAT.rail, dx - 14, 0.2, 0, false);
  for (let z = -L / 2 + 2; z < L / 2; z += 4) add(g, box(8, 0.2, 1), MAT.wood, -14, 0.05, z, false);
  add(g, box(6, 1.0, 60), MAT.stoneDark, -7, 0.5, 0);
  if (o.modern) {
    add(g, box(16, 7, 12), new THREE.MeshStandardMaterial({ color: 0xc9cdd3, roughness: 0.6 }), 4, 3.5, 0);
    add(g, box(17, 0.5, 13), MAT.rail, 4, 7.2, 0);
    add(g, box(6, 4, 0.2), MAT.black, 4, 2.2, 6.1, false);
  } else {
    add(g, box(14, 4.5, 12), MAT.plaster, 4, 2.25, 0);
    add(g, box(14.4, 0.6, 12.4), MAT.vermilion, 4, 4.8, 0);
    add(g, box(5, 3, 0.2), MAT.black, 4, 1.6, 6.05, false);
    const rg = group(g, 4, 0, 0);
    roof(rg, { W: 18, D: 16, H: 2.6, L: 8, lift: 0.5, y: 5.0, rafters: false });
  }
}

/** um trem parado nos trilhos (ou bonde, se `tram`) */
export function train(g: THREE.Object3D, o: { cars?: number; color?: number; tram?: boolean } = {}) {
  const cars = o.cars ?? 3, mat = new THREE.MeshStandardMaterial({ color: o.color ?? 0x2f5f3f, roughness: 0.5, metalness: 0.2 });
  const L = o.tram ? 12 : 18;
  for (let i = 0; i < cars; i++) {
    const z = (i - (cars - 1) / 2) * (L + 1.2);
    add(g, box(3.2, 3.4, L), mat, 0, 2.6, z);
    add(g, box(3.4, 0.4, L + 0.2), MAT.rail, 0, 4.4, z);
    add(g, box(2.9, 0.9, L - 1), MAT.black, 0, 0.55, z);
    for (let k = 0; k < Math.floor(L / 3); k++) for (const s of [-1, 1]) add(g, box(0.1, 1.2, 1.8), MAT.black, s * 1.62, 3.0, z - L / 2 + 2 + k * 3, false);
  }
  if (o.tram) add(g, box(0.2, 2.5, 0.2), MAT.black, 0, 5.6, 0);
}

/** fileira de barracas ao longo de uma linha, dos dois lados */
export function stalls(parent: THREE.Object3D, H: (x: number, z: number) => number, a: { x: number; z: number }, b: { x: number; z: number }, n: number, offset = 7, o: { both?: boolean } = {}) {
  const dir = Math.atan2(b.x - a.x, b.z - a.z);
  for (let i = 0; i < n; i++) {
    const t = 0.1 + (i / n) * 0.8;
    const x = a.x + (b.x - a.x) * t, z = a.z + (b.z - a.z) * t;
    for (const s of o.both === false ? [1] : [-1, 1]) {
      const ox = Math.cos(dir) * s * offset, oz = -Math.sin(dir) * s * offset;
      const g = group(parent, x + ox, H(x + ox, z + oz), z + oz, dir);
      add(g, box(4.2, 2.2, 3), MAT.wood, 0, 1.1, 0);
      add(g, box(4.8, 0.25, 3.8), (i + (s > 0 ? 1 : 0)) % 2 ? MAT.awning : MAT.awning2, 0, 2.4, 0);
      add(g, box(4.2, 0.6, 2.6), MAT.plaster, 0, 1.0, 0.3);
    }
  }
}

/** Grande Buda sentado, em bronze */
export function buddha(g: THREE.Object3D, s = 1) {
  const bronze = new THREE.MeshStandardMaterial({ color: 0x4f6a5a, metalness: 0.6, roughness: 0.5 });
  add(g, box(14 * s, 1.5 * s, 12 * s), MAT.stone, 0, 0.75 * s, 0);
  // pernas cruzadas
  const legs = add(g, new THREE.SphereGeometry(5.2 * s, 14, 10), bronze, 0, 3.6 * s, 0.6 * s);
  legs.scale.set(1.25, 0.5, 0.9);
  // tronco e braços
  const body = add(g, new THREE.SphereGeometry(3.6 * s, 14, 10), bronze, 0, 7.6 * s, -0.4 * s);
  body.scale.set(1.15, 1.35, 0.85);
  add(g, new THREE.SphereGeometry(2.4 * s, 10, 8), bronze, 0, 5.2 * s, 1.4 * s).scale.set(1.3, 0.55, 0.8); // mãos no colo
  for (const sd of [-1, 1]) {
    const arm = add(g, new THREE.CylinderGeometry(0.9 * s, 1.1 * s, 6 * s, 8), bronze, sd * 3.6 * s, 6.6 * s, 0.3 * s);
    arm.rotation.z = sd * 0.25;
  }
  // cabeça, orelhas compridas e o coque
  add(g, new THREE.SphereGeometry(2.1 * s, 14, 12), bronze, 0, 12.2 * s, -0.2 * s);
  add(g, new THREE.SphereGeometry(1.1 * s, 10, 8), bronze, 0, 14.0 * s, -0.5 * s);
  for (const sd of [-1, 1]) add(g, new THREE.CylinderGeometry(0.3 * s, 0.4 * s, 1.8 * s, 6), bronze, sd * 2.1 * s, 11.6 * s, -0.2 * s);
  // auréola / prédio ao fundo opcional fica a cargo do lugar
}

/** ponte: em arco (vermelha ou pedra), reta de madeira, ou coberta */
export function bridge(parent: THREE.Object3D, a: THREE.Vector3, b: THREE.Vector3, o: { kind?: 'arch' | 'flat' | 'covered' | 'stone'; width?: number; rail?: boolean } = {}) {
  const kind = o.kind ?? 'flat', w = o.width ?? 4;
  const dir = new THREE.Vector3().subVectors(b, a);
  const len = dir.length();
  const yaw = Math.atan2(dir.x, dir.z);
  const mid = a.clone().add(b).multiplyScalar(0.5);
  const g = group(parent, mid.x, mid.y, mid.z, yaw);
  const deck = kind === 'stone' ? MAT.stone : kind === 'arch' ? MAT.vermilion : MAT.wood;
  if (kind === 'arch' || kind === 'stone') {
    const n = 14, rise = kind === 'arch' ? len * 0.28 : len * 0.08;
    for (let i = 0; i < n; i++) {
      const t0 = i / n, t1 = (i + 1) / n;
      const y0 = Math.sin(t0 * Math.PI) * rise, y1 = Math.sin(t1 * Math.PI) * rise;
      const seg = add(g, box(w, 0.5, len / n + 0.15), deck, 0, (y0 + y1) / 2 + 0.25, -len / 2 + ((t0 + t1) / 2) * len);
      seg.rotation.x = -Math.atan2(y1 - y0, len / n);
      if (o.rail !== false) for (const s of [-1, 1]) {
        add(g, box(0.18, 1.2, 0.18), deck, (s * w) / 2, (y0 + y1) / 2 + 0.9, -len / 2 + ((t0 + t1) / 2) * len);
      }
    }
    if (o.rail !== false) for (const s of [-1, 1]) {
      const pts = []; for (let i = 0; i <= n; i++) { const t = i / n; pts.push(new THREE.Vector3((s * w) / 2, Math.sin(t * Math.PI) * rise + 1.5, -len / 2 + t * len)); }
      add(g, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, 0.1, 5), deck);
    }
  } else {
    add(g, box(w, 0.5, len), deck, 0, 0.25, 0);
    const n = Math.max(2, Math.round(len / 6));
    for (let i = 0; i <= n; i++) {
      const z = -len / 2 + (i * len) / n;
      for (const s of [-1, 1]) {
        add(g, box(0.5, 4, 0.5), MAT.wood, (s * w) / 2, -2, z);
        if (o.rail !== false || kind === 'covered') add(g, box(0.18, 1.2, 0.18), MAT.wood, (s * w) / 2, 0.9, z);
      }
      if (kind === 'covered') for (const s of [-1, 1]) add(g, box(0.3, 3.6, 0.3), MAT.wood, (s * w) / 2, 2.3, z);
    }
    for (const s of [-1, 1]) beam(g, new THREE.Vector3((s * w) / 2, 1.5, -len / 2), new THREE.Vector3((s * w) / 2, 1.5, len / 2), 0.1, MAT.wood);
    if (kind === 'covered') {
      const rg = group(g, 0, 0, 0, Math.PI / 2);
      roof(rg, { W: len + 2, D: w + 3, H: 1.8, L: len - 2, lift: 0.3, y: 4.2, ridge: false, rafters: false, thickness: 0.25 });
    }
  }
  return g;
}

/** barco de fundo chato */
export function boat(g: THREE.Object3D, o: { len?: number; roof?: boolean; color?: number } = {}) {
  const L = o.len ?? 6;
  const hull = add(g, box(1.8, 0.7, L), new THREE.MeshStandardMaterial({ color: o.color ?? 0x5a3a24, roughness: 0.8 }), 0, 0.35, 0);
  hull.scale.set(1, 1, 1);
  add(g, box(1.5, 0.15, L - 0.6), MAT.woodLight, 0, 0.75, 0);
  if (o.roof) { for (const s of [-1, 1]) for (const z of [-L / 3, L / 3]) add(g, box(0.1, 1.6, 0.1), MAT.wood, s * 0.8, 1.5, z); add(g, box(2.2, 0.12, L * 0.8), MAT.awning2, 0, 2.3, 0); }
  add(g, cyl(0.05, 0.05, 3, 5), MAT.wood, 0.9, 1.5, L / 2 - 0.5).rotation.z = 0.5;
}

/** casa de madeira de dois andares (machiya) */
export function machiya(g: THREE.Object3D, o: { w?: number; d?: number; dark?: boolean; noren?: number } = {}) {
  const W = o.w ?? 7, D = o.d ?? 8;
  add(g, box(W, 6, D), o.dark ? MAT.wood : MAT.woodLight, 0, 3, 0);
  add(g, box(W - 0.4, 2.4, 0.2), MAT.plaster, 0, 4.6, D / 2 + 0.05);
  for (let k = 0; k < Math.floor(W / 0.5); k++) add(g, box(0.1, 2.4, 0.15), MAT.wood, -W / 2 + 0.3 + k * 0.5, 4.6, D / 2 + 0.2, false);
  add(g, box(W * 0.45, 2.6, 0.2), MAT.black, -W * 0.2, 1.5, D / 2 + 0.05, false);
  if (o.noren !== undefined) add(g, box(W * 0.42, 1.2, 0.08), new THREE.MeshStandardMaterial({ color: o.noren, roughness: 0.9 }), -W * 0.2, 2.3, D / 2 + 0.25, false);
  add(g, box(W + 1.2, 0.35, 1.2), MAT.black, 0, 3.1, D / 2 + 0.4); // beiral do térreo
  const rg = group(g, 0, 0, 0, Math.PI / 2);
  roof(rg, { W: D + 1.6, D: W + 1.6, H: 1.6, L: D - 1, lift: 0.2, y: 6.2, ridge: false, rafters: false, thickness: 0.25 });
}

/** armazém branco de parede namako (Kurashiki) */
export function kura(g: THREE.Object3D, o: { w?: number; d?: number; h?: number } = {}) {
  const W = o.w ?? 8, D = o.d ?? 10, h = o.h ?? 7;
  add(g, box(W, h, D), MAT.plaster, 0, h / 2, 0);
  const black = MAT.black;
  // grade preta na parte de baixo (padrão namako)
  for (let k = 0; k <= Math.floor(W / 1.2); k++) add(g, box(0.12, 2.6, 0.08), black, -W / 2 + k * 1.2, 1.4, D / 2 + 0.05, false);
  for (let k = 0; k <= 2; k++) add(g, box(W + 0.02, 0.12, 0.08), black, 0, 0.5 + k * 1.1, D / 2 + 0.05, false);
  add(g, box(1.6, 1.4, 0.12), black, W * 0.2, h - 2, D / 2 + 0.05, false);
  const rg = group(g, 0, 0, 0, Math.PI / 2);
  roof(rg, { W: D + 2.4, D: W + 2.4, H: 2.0, L: D - 1, lift: 0.1, y: h + 0.1, ridge: false, rafters: false, thickness: 0.35 });
}

let winTex: THREE.CanvasTexture | null = null;
function windowTexture() {
  if (winTex) return winTex;
  const cv = document.createElement('canvas'); cv.width = 64; cv.height = 64;
  const g = cv.getContext('2d')!;
  g.fillStyle = '#9aa3ad'; g.fillRect(0, 0, 64, 64);
  for (let y = 4; y < 64; y += 12) for (let x = 4; x < 64; x += 12) { g.fillStyle = Math.random() < 0.3 ? '#dfe6ee' : '#3b4652'; g.fillRect(x, y, 7, 8); }
  winTex = new THREE.CanvasTexture(cv);
  winTex.wrapS = winTex.wrapT = THREE.RepeatWrapping;
  winTex.colorSpace = THREE.SRGBColorSpace;
  return winTex;
}
/** prédio alto com janelas */
const towerMats = new Map<number, THREE.MeshStandardMaterial>();
const screenMat = new THREE.MeshStandardMaterial({ color: 0xff7a3d, emissive: 0xff5a1f, emissiveIntensity: 0.8, roughness: 0.4 });
export function tower(g: THREE.Object3D, w: number, d: number, h: number, o: { color?: number; screen?: boolean; round?: boolean } = {}) {
  const color = o.color ?? 0xffffff;
  let mat = towerMats.get(color);
  if (!mat) { mat = new THREE.MeshStandardMaterial({ map: windowTexture(), color, roughness: 0.5, metalness: 0.2 }); towerMats.set(color, mat); }
  const geo = o.round ? cyl(w / 2, w / 2, h, 20) : box(w, h, d);
  const uv = geo.getAttribute('uv') as THREE.BufferAttribute;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * Math.max(1, w / 6), uv.getY(i) * Math.max(1, h / 6));
  const m = add(g, geo, mat, 0, h / 2, 0);
  add(g, box(w + 0.4, 0.6, d + 0.4), MAT.rail, 0, h + 0.3, 0);
  if (o.screen) add(g, box(w * 0.7, h * 0.22, 0.3), screenMat, 0, h * 0.72, d / 2 + 0.2, false);
  return m;
}

/** bosque de bambu instanciado */
export function bambooGrove(addInstanced: (im: THREE.InstancedMesh) => void, H: (x: number, z: number) => number, cx: number, cz: number, rx: number, rz: number, count: number, rng: () => number) {
  const geo = new THREE.CylinderGeometry(0.16, 0.2, 16, 5).translate(0, 8, 0);
  const n = geo.getAttribute('position').count, col = new Float32Array(n * 3);
  const c = new THREE.Color(0x8fb35a);
  for (let i = 0; i < n; i++) { const k = 0.85 + (geo.getAttribute('position').getY(i) / 16) * 0.3; col[i * 3] = c.r * k; col[i * 3 + 1] = c.g * k; col[i * 3 + 2] = c.b * k; }
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const list: THREE.Matrix4[] = [];
  const tmp = new THREE.Object3D();
  for (let i = 0; i < count; i++) {
    const a = rng() * Math.PI * 2, r = Math.sqrt(rng());
    const x = cx + Math.cos(a) * r * rx, z = cz + Math.sin(a) * r * rz;
    tmp.position.set(x, H(x, z) - 0.3, z);
    tmp.rotation.set((rng() - 0.5) * 0.12, rng() * Math.PI, (rng() - 0.5) * 0.12);
    tmp.scale.set(1, 0.8 + rng() * 0.6, 1);
    tmp.updateMatrix();
    list.push(tmp.matrix.clone());
  }
  addInstanced(instances(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.8 }), list, false));
}

/** cervo (Nara, Miyajima), geometria única para instanciar */
export function deerGeometry() {
  const parts: THREE.BufferGeometry[] = [];
  const paint = (g: THREE.BufferGeometry, c: number) => { const n = g.getAttribute('position').count, col = new Float32Array(n * 3), cc = new THREE.Color(c); for (let i = 0; i < n; i++) { col[i * 3] = cc.r; col[i * 3 + 1] = cc.g; col[i * 3 + 2] = cc.b; } g.setAttribute('color', new THREE.BufferAttribute(col, 3)); return g; };
  const body = new THREE.SphereGeometry(0.55, 8, 6).translate(0, 1.1, 0); body.scale(1, 0.8, 1.7);
  parts.push(paint(body, 0x9a6b3c));
  parts.push(paint(new THREE.SphereGeometry(0.28, 7, 5).translate(0, 1.7, 1.05), 0x8d5f33));
  parts.push(paint(new THREE.CylinderGeometry(0.12, 0.16, 0.7, 5).translate(0, 1.5, 0.8).rotateX(-0.9), 0x8d5f33));
  for (const [x, z] of [[-0.3, 0.6], [0.3, 0.6], [-0.3, -0.6], [0.3, -0.6]]) parts.push(paint(new THREE.CylinderGeometry(0.07, 0.06, 1.0, 4).translate(x, 0.5, z), 0x6e4a28));
  for (const s of [-1, 1]) parts.push(paint(new THREE.CylinderGeometry(0.03, 0.05, 0.6, 4).translate(s * 0.15, 2.15, 1.0).rotateZ(-s * 0.4), 0xd9c9a8));
  return mergeGeometries(parts, false) as THREE.BufferGeometry;
}

/** lanterna de pedra como geometria única (para as fileiras de Kasuga) */
export function lanternGeometry(h = 2.6) {
  const parts: THREE.BufferGeometry[] = [];
  parts.push(new THREE.BoxGeometry(1.1, 0.25, 1.1).translate(0, 0.12, 0));
  parts.push(new THREE.CylinderGeometry(0.42, 0.5, 0.35, 8).translate(0, 0.42, 0));
  parts.push(new THREE.CylinderGeometry(0.16, 0.2, h * 0.45, 8).translate(0, 0.6 + h * 0.225, 0));
  parts.push(new THREE.CylinderGeometry(0.45, 0.3, 0.3, 8).translate(0, 0.6 + h * 0.45 + 0.15, 0));
  const fy = 0.6 + h * 0.45 + 0.3;
  parts.push(new THREE.BoxGeometry(0.7, 0.7, 0.7).translate(0, fy + 0.35, 0));
  parts.push(new THREE.CylinderGeometry(0.25, 0.85, 0.55, 4).translate(0, fy + 0.98, 0).rotateY(Math.PI / 4));
  parts.push(new THREE.SphereGeometry(0.16, 8, 6).translate(0, fy + 1.35, 0));
  return mergeGeometries(parts, false) as THREE.BufferGeometry;
}

/** muro de barris de saquê (Meiji Jingū) */
export function sakeBarrels(g: THREE.Object3D, rows = 4, cols = 12) {
  const mat = new THREE.MeshStandardMaterial({ color: 0xc9a35f, roughness: 0.9 });
  add(g, box(cols * 1.25 + 1, 0.6, 2.4), MAT.wood, 0, 0.3, 0);
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const b = add(g, cyl(0.55, 0.55, 1.1, 10), mat, -((cols - 1) * 1.25) / 2 + c * 1.25, 1.2 + r * 1.15, 0);
    b.rotation.x = Math.PI / 2;
    add(g, cyl(0.5, 0.5, 0.05, 10), MAT.white, b.position.x, b.position.y, 0.56, false).rotation.x = Math.PI / 2;
  }
}

/** o Domo da Bomba: paredes de tijolo em ruína e o esqueleto da cúpula */
export function domeRuin(g: THREE.Object3D) {
  const brick = new THREE.MeshStandardMaterial({ color: 0x8a6a55, roughness: 1 });
  const steel = new THREE.MeshStandardMaterial({ color: 0x4a4a48, roughness: 0.6, metalness: 0.5 });
  add(g, box(22, 1, 14), MAT.stoneDark, 0, 0.5, 0);
  // paredes parciais
  add(g, box(9, 9, 0.8), brick, -6, 5.5, 6);
  add(g, box(0.8, 11, 10), brick, -10.5, 6.5, 0);
  add(g, box(7, 7, 0.8), brick, 6, 4.5, -6);
  add(g, box(0.8, 6, 6), brick, 10.5, 4, 2);
  for (let i = 0; i < 6; i++) add(g, box(1.4, 3, 0.9), MAT.black, -9 + i * 1.5, 6.5 + (i % 2), 6.02, false);
  // o tambor e a cúpula de aço
  add(g, cyl(5.2, 5.2, 8, 16), brick, 0, 5, 0);
  for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; add(g, box(1.6, 5, 0.3), MAT.black, Math.cos(a) * 5.1, 6.5, Math.sin(a) * 5.1, false).rotation.y = -a + Math.PI / 2; }
  add(g, cyl(5.6, 5.6, 0.5, 16), steel, 0, 9.2, 0);
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const pts = []; for (let k = 0; k <= 8; k++) { const t = (k / 8) * (Math.PI / 2); pts.push(new THREE.Vector3(Math.cos(a) * 5.4 * Math.cos(t), 9.4 + 5.4 * Math.sin(t), Math.sin(a) * 5.4 * Math.cos(t))); }
    add(g, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 12, 0.12, 5), steel);
  }
  for (const r of [4.6, 3.2, 1.6]) add(g, new THREE.TorusGeometry(r, 0.1, 5, 24), steel, 0, 9.4 + Math.sqrt(5.4 * 5.4 - r * r), 0).rotation.x = Math.PI / 2;
  add(g, cyl(0.2, 0.2, 2.5, 6), steel, 0, 15.8, 0);
}

/** o Cenotáfio: o arco de sela sobre a pedra com os nomes */
export function cenotaph(g: THREE.Object3D) {
  add(g, box(14, 0.4, 10), MAT.stone, 0, 0.2, 0);
  add(g, box(3.2, 1.2, 2), MAT.stoneDark, 0, 1.0, 0);
  const shape = new THREE.Shape();
  shape.moveTo(-4.2, 0); shape.quadraticCurveTo(0, 5.2, 4.2, 0); shape.lineTo(3.4, 0); shape.quadraticCurveTo(0, 3.9, -3.4, 0); shape.closePath();
  const arch = add(g, new THREE.ExtrudeGeometry(shape, { depth: 3, bevelEnabled: false }), MAT.stone, 0, 0.4, -1.5);
  arch.rotation.y = Math.PI / 2;
}

/** monumento das crianças: cúpula com a estátua e o grou */
export function childrenMonument(g: THREE.Object3D) {
  add(g, cyl(5, 5.5, 0.6, 16), MAT.stone, 0, 0.3, 0);
  for (let i = 0; i < 3; i++) { const a = (i / 3) * Math.PI * 2; add(g, cyl(0.3, 0.4, 9, 6), MAT.stone, Math.cos(a) * 2.4, 5, Math.sin(a) * 2.4).rotation.set(Math.sin(a) * 0.12, 0, -Math.cos(a) * 0.12); }
  add(g, new THREE.SphereGeometry(3.2, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), MAT.stone, 0, 8.5, 0);
  add(g, cyl(0.3, 0.3, 2, 6), MAT.gold, 0, 12.5, 0);
  add(g, box(1.6, 0.2, 0.6), MAT.gold, 0, 13.6, 0).rotation.z = 0.3;
}

/** a Chama da Paz: pedestal em forma de mãos e a chama */
export function flame(g: THREE.Object3D) {
  add(g, box(10, 0.5, 6), MAT.stone, 0, 0.25, 0);
  add(g, box(4, 2.2, 2.4), MAT.stoneDark, 0, 1.6, 0);
  for (const s of [-1, 1]) { const w = add(g, box(2.6, 0.5, 3.6), MAT.stoneDark, s * 2.2, 3.2, 0); w.rotation.z = -s * 0.5; }
  const f = add(g, new THREE.ConeGeometry(0.5, 1.6, 6), new THREE.MeshStandardMaterial({ color: 0xffa040, emissive: 0xff6a00, emissiveIntensity: 1.2 }), 0, 3.7, 0, false);
  f.name = 'flame';
}

/** teleférico: cabos entre duas torres e gôndolas */
export function ropeway(parent: THREE.Object3D, a: THREE.Vector3, b: THREE.Vector3, gondolas = 4) {
  const steel = MAT.rail;
  for (const p of [a, b]) { add(parent, box(4, 8, 4), steel, p.x, p.y + 4, p.z); add(parent, cyl(0.4, 0.5, 12, 6), steel, p.x, p.y + 14, p.z); }
  for (const s of [-1.2, 1.2]) beam(parent, new THREE.Vector3(a.x + s, a.y + 20, a.z), new THREE.Vector3(b.x + s, b.y + 20, b.z), 0.12, MAT.black);
  for (let i = 1; i <= gondolas; i++) {
    const t = i / (gondolas + 1);
    const p = a.clone().lerp(b, t);
    add(parent, box(2.2, 2.4, 2.2), new THREE.MeshStandardMaterial({ color: i % 2 ? 0xd94c3d : 0x3b6fb6, roughness: 0.5 }), p.x + (i % 2 ? -1.2 : 1.2), p.y + 18.2, p.z);
    add(parent, box(0.15, 1.2, 0.15), MAT.black, p.x + (i % 2 ? -1.2 : 1.2), p.y + 19.9, p.z, false);
  }
}

/** jardim de pedras: retângulo de cascalho, muro de barro e as 15 pedras */
export function rockGarden(g: THREE.Object3D, W = 30, D = 12) {
  add(g, box(W, 0.3, D), new THREE.MeshStandardMaterial({ color: 0xd9d2c0, roughness: 1 }), 0, 0.15, 0, false);
  const wallMat = new THREE.MeshStandardMaterial({ color: 0xa88f6a, roughness: 1 });
  add(g, box(W + 1, 2.2, 0.8), wallMat, 0, 1.1, -D / 2);
  add(g, box(0.8, 2.2, D), wallMat, W / 2, 1.1, 0);
  add(g, box(0.8, 2.2, D), wallMat, -W / 2, 1.1, 0);
  const rg = group(g, 0, 0, -D / 2);
  roof(rg, { W: W + 3, D: 2.6, H: 0.8, L: W + 1, lift: 0.05, y: 2.2, ridge: false, rafters: false, thickness: 0.2 });
  const rocks = [[-10, -2, 1.3], [-8.5, -1, 0.7], [-7.4, -3, 0.6], [-2, 1.5, 1.0], [-0.5, 2, 0.6], [4, -2.5, 1.1], [5.5, -1.5, 0.6], [9, 1, 0.9], [10.5, 2, 0.5], [11.5, 0.5, 0.5], [-4, -3.5, 0.5], [1.5, -0.5, 0.4], [7, 2.5, 0.5], [-11.5, 0.5, 0.5], [3, 3, 0.4]];
  for (const [x, z, r] of rocks) { add(g, new THREE.DodecahedronGeometry(r), MAT.stoneDark, x, 0.3 + r * 0.5, z); add(g, new THREE.CircleGeometry(r * 2.2, 10), new THREE.MeshStandardMaterial({ color: 0x5d7a3a, roughness: 1 }), x, 0.32, z, false).rotation.x = -Math.PI / 2; }
}

/** muro branco de templo com telha em cima, entre dois pontos */
export function wall(parent: THREE.Object3D, a: THREE.Vector3, b: THREE.Vector3, h = 2.4) {
  const dir = new THREE.Vector3().subVectors(b, a);
  const len = dir.length();
  const mid = a.clone().add(b).multiplyScalar(0.5);
  const g = group(parent, mid.x, mid.y, mid.z, Math.atan2(dir.x, dir.z));
  add(g, box(0.7, h, len), MAT.plaster, 0, h / 2, 0);
  add(g, box(1.3, 0.35, len + 0.4), MAT.black, 0, h + 0.15, 0);
  for (let k = 0; k < 4; k++) add(g, box(0.72, 0.12, len), MAT.black, 0, h * 0.35 + k * 0.4, 0, false);
}

/** escadaria numa encosta */
export function stairs(g: THREE.Object3D, w: number, steps: number, rise = 0.45, run = 0.9) {
  for (let i = 0; i < steps; i++) add(g, box(w, rise, run + 0.1), MAT.stone, 0, i * rise + rise / 2, -i * run);
  for (const s of [-1, 1]) add(g, box(0.5, 1.0, steps * run), MAT.stoneDark, (s * w) / 2, (steps * rise) / 2 + 0.5, (-(steps - 1) * run) / 2).rotation.x = Math.atan2(steps * rise, steps * run) * 0;
}

/** palco de madeira sobre pilares em treliça (Kiyomizu) */
export function stage(g: THREE.Object3D, W = 24, D = 16, h = 13) {
  const cols = Math.round(W / 4), rows = Math.round(D / 4);
  for (let i = 0; i <= cols; i++) for (let j = 0; j <= rows; j++) {
    const x = -W / 2 + (i * W) / cols, z = -D / 2 + (j * D) / rows;
    add(g, box(0.7, h, 0.7), MAT.wood, x, h / 2, z);
    if (j < rows) add(g, box(0.25, 0.25, D / rows), MAT.wood, x, h * 0.35, z + D / rows / 2);
    if (j < rows) add(g, box(0.25, 0.25, D / rows), MAT.wood, x, h * 0.7, z + D / rows / 2);
    if (i < cols) add(g, box(W / cols, 0.25, 0.25), MAT.wood, x + W / cols / 2, h * 0.35, z);
    if (i < cols) add(g, box(W / cols, 0.25, 0.25), MAT.wood, x + W / cols / 2, h * 0.7, z);
  }
  add(g, box(W + 1, 0.5, D + 1), MAT.woodLight, 0, h + 0.25, 0);
  for (let i = 0; i <= cols * 2; i++) for (const s of [-1, 1]) add(g, box(0.18, 1.1, 0.18), MAT.wood, -W / 2 + (i * W) / (cols * 2), h + 1.0, (s * D) / 2, false);
  for (const s of [-1, 1]) beam(g, new THREE.Vector3(-W / 2, h + 1.5, (s * D) / 2), new THREE.Vector3(W / 2, h + 1.5, (s * D) / 2), 0.1, MAT.wood);
  beam(g, new THREE.Vector3(W / 2, h + 1.5, -D / 2), new THREE.Vector3(W / 2, h + 1.5, D / 2), 0.1, MAT.wood);
}

/** torre alta e fina (Skytree, mirantes) */
export function spire(g: THREE.Object3D, h = 120, r = 6) {
  const steel = new THREE.MeshStandardMaterial({ color: 0xdfe3ea, roughness: 0.4, metalness: 0.5 });
  add(g, cyl(r * 0.35, r, h * 0.55, 8), steel, 0, h * 0.275, 0);
  add(g, cyl(r * 1.6, r * 1.6, h * 0.05, 16), steel, 0, h * 0.57, 0);
  add(g, cyl(r * 0.25, r * 0.35, h * 0.2, 8), steel, 0, h * 0.7, 0);
  add(g, cyl(r * 1.2, r * 1.2, h * 0.04, 16), steel, 0, h * 0.82, 0);
  add(g, cyl(0.6, r * 0.25, h * 0.2, 6), steel, 0, h * 0.94, 0);
  for (let k = 0; k < 6; k++) add(g, new THREE.TorusGeometry(r * (1 - k * 0.1), 0.25, 5, 16), steel, 0, h * 0.08 + k * h * 0.08, 0).rotation.x = Math.PI / 2;
}

/** cerca de madeira vermelha (tamagaki) entre dois pontos */
export function fence(parent: THREE.Object3D, a: THREE.Vector3, b: THREE.Vector3, h = 1.4) {
  const dir = new THREE.Vector3().subVectors(b, a);
  const len = dir.length();
  const mid = a.clone().add(b).multiplyScalar(0.5);
  const g = group(parent, mid.x, mid.y, mid.z, Math.atan2(dir.x, dir.z));
  const n = Math.max(2, Math.round(len / 1.2));
  for (let i = 0; i <= n; i++) add(g, box(0.16, h, 0.16), MAT.vermilion, 0, h / 2, -len / 2 + (i * len) / n, false);
  add(g, box(0.12, 0.14, len), MAT.vermilion, 0, h * 0.85, 0, false);
  add(g, box(0.12, 0.14, len), MAT.vermilion, 0, h * 0.4, 0, false);
}
