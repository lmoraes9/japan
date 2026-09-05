import * as THREE from 'three';
import type { SceneSpec } from '../engine';
import { peak, noise } from '../engine';
import { MAT, add, box, cyl } from '../parts';
import { group, shrine, station, machiya, kura, bridge, boat, tower, stairs, train, bigTorii } from '../buildings';

/** Kurashiki: o canal com salgueiros e armazéns brancos, o museu grego, a fiação de hera e o morro do santuário */
const spec: SceneSpec = {
  center: { lat: 34.5964, lng: 133.7676 },
  scale: 0.75,
  size: { w: 900, d: 620 },
  terrain: (x, z) => 10 + peak(x, z, 250, 40, 34, 70) + noise(x, z, 0.3),
  rivers: [{ through: [{ x: 250, z: -110 }, { x: 258, z: -60 }, { x: 262, z: 10 }, { x: 275, z: 90 }, { x: 290, z: 180 }, { x: 300, z: 300 }], width: 12, depth: 2 }],
  ground: (x, z, y) => (y > 16 ? [0.42, 0.55, 0.3] : x > 150 && z > -100 ? [0.74, 0.7, 0.62] : [0.68, 0.67, 0.63]),
  paths: [
    { through: ['estacao', { x: 120, z: -150 }, { x: 220, z: -140 }, 'achi'], width: 6 },
    { through: [{ x: 220, z: -140 }, 'ohara', 'canal', 'nakabashi', { x: 290, z: 110 }, 'ivy'], width: 5 },
    { through: ['ivy', 'honmachi', { x: 300, z: -60 }], width: 4 },
    { through: [{ x: -440, z: -220 }, { x: 440, z: -220 }], width: 12, kind: 'asphalt' },
  ],
  forest: { count: 700, kinds: ['pine', 'broad', 'cedar'], pathGap: 8, allow: (x, z, y) => y > 14 },
  build: ({ root, H, P, rng }) => {
    const y0 = H(0, 0);
    const G = (id: string, yaw = 0, dx = 0, dz = 0) => group(root, P[id].x + dx, H(P[id].x + dx, P[id].z + dz), P[id].z + dz, yaw, 1.2);
    // estação, trilhos e a rua coberta até o bairro
    station(G('estacao', Math.PI / 2), { railLen: 800, modern: true });
    train(group(root, P.estacao.x + 60, y0 + 0.3, P.estacao.z - 17, Math.PI / 2), { cars: 4, color: 0xdfe6ee });
    const arcade = group(root, P.estacao.x + 20, y0, P.estacao.z + 70, 0);
    for (let i = 0; i < 12; i++) { add(arcade, box(14, 0.3, 10), new THREE.MeshStandardMaterial({ color: 0xcfd8e0, roughness: 0.4, transparent: true, opacity: 0.6 }), i * 10 - 10, 6.2, 0, false); for (const s of [-1, 1]) add(arcade, box(0.3, 6, 0.3), MAT.rail, i * 10 - 10, 3, s * 5, false); }
    // os armazéns brancos ao longo do canal, dos dois lados
    const canalPts = [{ x: 250, z: -110 }, { x: 258, z: -60 }, { x: 262, z: 10 }, { x: 275, z: 90 }, { x: 290, z: 180 }];
    for (let i = 0; i < canalPts.length - 1; i++) {
      const a = canalPts[i], b = canalPts[i + 1];
      const dir = Math.atan2(b.x - a.x, b.z - a.z);
      const n = Math.floor(Math.hypot(b.x - a.x, b.z - a.z) / 16);
      for (let k = 0; k < n; k++) for (const s of [-1, 1]) {
        const t = (k + 0.5) / n;
        const x = a.x + (b.x - a.x) * t + Math.cos(dir) * s * 16, z = a.z + (b.z - a.z) * t - Math.sin(dir) * s * 16;
        if (Math.hypot(x - P.ohara.x, z - P.ohara.z) < 22) continue;
        const g = group(root, x, H(x, z), z, dir + (s > 0 ? -Math.PI / 2 : Math.PI / 2));
        if ((k + i) % 3 === 0) machiya(g, { w: 10, d: 9, dark: true, noren: 0x3b6fb6 }); else kura(g, { w: 9 + (k % 2) * 3, d: 10, h: 7 });
      }
    }
    // salgueiros na margem: copas caídas verdes
    const wm = new THREE.MeshStandardMaterial({ color: 0x7d9a4a, roughness: 1 });
    for (let i = 0; i < 24; i++) { const t = i / 24; const a = canalPts[Math.min(3, Math.floor(t * 4))], b = canalPts[Math.min(4, Math.floor(t * 4) + 1)]; const u = (t * 4) % 1; const s = i % 2 ? 1 : -1; const x = a.x + (b.x - a.x) * u + s * 8.5, z = a.z + (b.z - a.z) * u; add(root, cyl(0.25, 0.4, 4, 5), MAT.wood, x, H(x, z) + 2, z, false); const c = add(root, new THREE.SphereGeometry(2.8, 8, 6), wm, x, H(x, z) + 5.4, z); c.scale.y = 1.2; for (let k = 0; k < 5; k++) { const an = (k / 5) * Math.PI * 2; add(root, new THREE.ConeGeometry(0.5, 3.4, 5), wm, x + Math.cos(an) * 2.4, H(x, z) + 3.5, z + Math.sin(an) * 2.4, false); } }
    // os barcos de fundo chato
    for (let i = 0; i < 4; i++) boat(group(root, 262 + i * 6, H(262, 10 + i * 40) - 2 + 0.3, 10 + i * 40, 0.1), { len: 6 });
    // Museu Ōhara: a fachada de templo grego
    const oh = G('ohara', Math.PI / 2);
    add(oh, box(22, 1.2, 16), MAT.stone, 0, 0.6, 0);
    add(oh, box(18, 9, 12), new THREE.MeshStandardMaterial({ color: 0xd9d2c0, roughness: 0.9 }), 0, 5.6, -1);
    for (let i = 0; i < 6; i++) add(oh, cyl(0.6, 0.6, 8, 12), MAT.white, -7.5 + i * 3, 5.2, 7);
    add(oh, box(20, 1, 3), MAT.white, 0, 9.6, 7);
    add(oh, new THREE.CylinderGeometry(0.01, 11, 3.2, 3, 1), MAT.white, 0, 11.6, 6).rotation.set(Math.PI / 2, 0, Math.PI / 2 + Math.PI);
    // Yūrinsō: a villa de telhas verdes
    const yr = G('yurinso', -Math.PI / 2);
    machiya(yr, { w: 14, d: 10 });
    add(yr, box(16, 0.6, 12), new THREE.MeshStandardMaterial({ color: 0x3f7a5a, roughness: 0.5, metalness: 0.2 }), 0, 6.9, 0);
    // Nakabashi: a ponte de pedra em arco, e o Kurashiki-kan branco ao lado
    const nb = P.nakabashi;
    bridge(root, new THREE.Vector3(nb.x - 12, H(nb.x, nb.z) + 0.6, nb.z), new THREE.Vector3(nb.x + 14, H(nb.x, nb.z) + 0.6, nb.z), { kind: 'stone', width: 4 });
    const kk = group(root, nb.x + 26, H(nb.x + 26, nb.z + 6), nb.z + 6, -Math.PI / 2);
    add(kk, box(12, 9, 10), MAT.white, 0, 4.5, 0); add(kk, box(4, 4, 4), MAT.white, 3, 11, 0); add(kk, box(13, 0.6, 11), new THREE.MeshStandardMaterial({ color: 0x3f7a5a, roughness: 0.6 }), 0, 9.3, 0);
    for (let i = 0; i < 3; i++) add(kk, box(1.4, 2.2, 0.2), MAT.black, -3.5 + i * 3.5, 4, 5.05, false);
    // Ivy Square: a fiação de tijolo coberta de hera, com a chaminé
    const iv = G('ivy', 0);
    const brick = new THREE.MeshStandardMaterial({ color: 0x8a4a3a, roughness: 1 });
    const ivy = new THREE.MeshStandardMaterial({ color: 0x9a2f2a, roughness: 1 });
    for (const [x, z, w, d] of [[-20, 0, 24, 14], [20, 0, 24, 14], [0, 20, 40, 12], [0, -20, 40, 12]] as [number, number, number, number][]) {
      add(iv, box(w, 8, d), brick, x, 4, z);
      add(iv, box(w * 0.9, 6, 0.4), ivy, x, 3.5, z + d / 2 + 0.2, false); add(iv, box(w * 0.9, 6, 0.4), ivy, x, 3.5, z - d / 2 - 0.2, false);
      add(iv, box(w + 1, 0.6, d + 1), MAT.black, x, 8.3, z);
    }
    add(iv, cyl(1.2, 1.6, 26, 10), brick, 26, 13, -22);
    add(iv, box(18, 0.2, 18), new THREE.MeshStandardMaterial({ color: 0x6d8a3a, roughness: 1 }), 0, 0.1, 0, false);
    // Achi-jinja: escadaria e santuário no morro
    const ac = G('achi', Math.PI);
    shrine(ac, 9, { torii: true });
    stairs(group(root, P.achi.x - 10, H(P.achi.x - 10, P.achi.z + 40), P.achi.z + 40, Math.PI, 1.4), 6, 22, 0.5, 0.9);
    bigTorii(root, P.achi.x - 10, H(P.achi.x - 10, P.achi.z + 62), P.achi.z + 62, 0, 7, 8);
    // Honmachi: a rua antiga paralela ao canal
    for (let i = 0; i < 10; i++) for (const s of [-1, 1]) { const x = P.honmachi.x + 30 + s * 9, z = P.honmachi.z + 40 - i * 12; machiya(group(root, x, H(x, z), z, s > 0 ? -Math.PI / 2 : Math.PI / 2), { w: 8, d: 8, dark: i % 2 === 0, noren: i % 3 === 0 ? 0xd94c3d : undefined }); }
    // a cidade moderna em volta da estação e ao norte da avenida
    for (let bx = -440; bx <= 440; bx += 38) for (let bz = -300; bz <= 300; bz += 38) {
      if (bx > 150 && bz > -180) continue; // o bairro histórico e o morro
      if (Math.abs(bz + 220) < 16 || Math.hypot(bx - P.estacao.x, bz - P.estacao.z) < 60 || Math.abs(bz - P.estacao.z) < 20) continue;
      const h = 8 + rng() * (bz < -220 ? 26 : 12);
      if (rng() < 0.4) machiya(group(root, bx, H(bx, bz), bz, rng() * 0.2), { w: 10, d: 10 });
      else tower(group(root, bx + (rng() - 0.5) * 6, H(bx, bz), bz + (rng() - 0.5) * 6), 18 + rng() * 10, 16 + rng() * 10, h, { color: [0xe6e2da, 0xcfd3d8, 0xd9cfc0][Math.floor(rng() * 3)] });
    }
  },
  camera: (P, H) => ({
    pos: new THREE.Vector3(P.canal.x - 260, 180, P.canal.z + 260),
    target: new THREE.Vector3(P.canal.x + 10, H(P.canal.x, P.canal.z) + 6, P.canal.z - 20),
  }),
  markerLift: 22,
};
export default spec;
