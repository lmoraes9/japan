import * as THREE from 'three';
import type { SceneSpec } from '../engine';
import { noise, smooth } from '../engine';
import { MAT, add, box, cyl } from '../parts';
import { group, tower, machiya, station, train, stalls } from '../buildings';

/** Shibuya à noite: o vale da estação, o cruzamento com os telões, a torre do Sky, as ruelas e o parque no telhado */
const spec: SceneSpec = {
  center: { lat: 35.66, lng: 139.701 },
  scale: 1.5,
  size: { w: 820, d: 720 },
  // um vale: a estação no fundo, as ruas sobem para todos os lados
  terrain: (x, z) => 20 + 12 * smooth(60, 300, Math.hypot(x, z)) + noise(x, z, 0.3),
  ground: () => [0.36, 0.36, 0.4],
  paths: [
    { through: ['cruzamento', { x: -160, z: -80 }, { x: -300, z: -180 }], width: 14, kind: 'asphalt' },
    { through: ['cruzamento', 'centergai', { x: -20, z: -300 }], width: 10, kind: 'asphalt' },
    { through: ['cruzamento', { x: -200, z: 120 }, { x: -320, z: 250 }], width: 14, kind: 'asphalt' },
    { through: ['cruzamento', 'hachiko', 'estacao', { x: 60, z: 300 }], width: 12, kind: 'asphalt' },
    { through: ['cruzamento', { x: 120, z: -60 }, 'nonbei', 'miyashita', { x: 200, z: -330 }], width: 12, kind: 'asphalt' },
    { through: [{ x: 60, z: -360 }, { x: 40, z: -100 }, 'estacao', { x: 20, z: 360 }], width: 8, kind: 'none' },
  ],
  forest: { count: 120, kinds: ['broad', 'cherry'], pathGap: 6, allow: (x, z, y, P) => Math.hypot(x - P.miyashita.x, z - P.miyashita.z) < 50 || Math.hypot(x - P.hachiko.x, z - P.hachiko.z) < 18 },
  build: ({ root, H, P, rng }) => {
    const G = (id: string, yaw = 0, dx = 0, dz = 0) => group(root, P[id].x + dx, H(P[id].x + dx, P[id].z + dz), P[id].z + dz, yaw);
    const neons = new Map<number, THREE.MeshStandardMaterial>();
    const neon = (c: number) => { let m = neons.get(c); if (!m) { m = new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.9, roughness: 0.4 }); neons.set(c, m); } return m; };
    // a linha Yamanote, elevada, cortando o vale de norte a sul, e a estação embaixo
    const yam = group(root, 40, H(40, 0), 0, 0);
    for (let z = -360; z <= 360; z += 30) { add(yam, box(3, 9, 3), MAT.stoneDark, 0, 4.5, z); }
    add(yam, box(14, 1.4, 740), MAT.stoneDark, 0, 9.7, 0);
    for (const dx of [-4, 4]) add(yam, box(0.5, 0.3, 740), MAT.rail, dx, 10.6, 0, false);
    train(group(yam, -4, 10.6, 120), { cars: 5, color: 0x8fbf6a });
    const st = G('estacao', 0);
    add(st, box(70, 12, 40), new THREE.MeshStandardMaterial({ color: 0xc9cdd3, roughness: 0.5 }), 0, 6, 0);
    add(st, box(72, 0.8, 42), MAT.rail, 0, 12.4, 0);
    add(st, box(24, 4, 0.4), neon(0x9fd8ff), 0, 8, 20.3, false);
    // Shibuya Scramble Square: a torre do Sky, com o mirante aberto no topo
    const sk = G('sky', 0);
    tower(sk, 38, 30, 230, { color: 0xbfc8d4 });
    add(sk, box(40, 1.2, 32), MAT.rail, 0, 230.6, 0);
    for (let i = 0; i < 8; i++) for (const s of [-1, 1]) add(sk, box(0.3, 1.6, 0.3), MAT.white, -18 + i * 5, 232, s * 15.5, false);
    add(sk, box(20, 0.4, 14), neon(0xd7e6ff), 0, 231.4, 0, false);
    // o cruzamento: as faixas em X e os prédios com telões em volta
    const cr = G('cruzamento', 0);
    const zebra = new THREE.MeshStandardMaterial({ color: 0xe8e8e8, roughness: 0.9 });
    for (const yaw of [0, Math.PI / 2, Math.PI / 4, -Math.PI / 4]) { const g = group(cr, 0, 0.35, 0, yaw); for (let k = 0; k < 9; k++) add(g, box(2.2, 0.1, 5), zebra, -14 + k * 3.5, 0, 0, false); }
    const screens: [number, number, number, number, number][] = [[-48, -40, 26, 60, 0], [38, -44, 30, 48, 0], [-52, 34, 24, 40, 0], [40, 36, 26, 36, 0]];
    for (const [dx, dz, w, h] of screens) {
      const t = group(cr, dx, 0, dz, Math.atan2(-dx, -dz));
      tower(t, w, w * 0.8, h, { color: 0xaeb6c2, screen: true });
      add(t, box(w * 0.8, h * 0.28, 0.4), neon([0x39c5ff, 0xff5ab8, 0xffd23f][Math.floor(rng() * 3)]), 0, h * 0.5, (w * 0.8) / 2 + 0.3, false);
    }
    // o Hachikō de bronze e o vagão verde ao lado
    const hk = G('hachiko', 0);
    add(hk, box(2.4, 1.2, 2.4), MAT.stoneDark, 0, 0.6, 0);
    const bronze = new THREE.MeshStandardMaterial({ color: 0x5a6a4a, metalness: 0.6, roughness: 0.5 });
    add(hk, new THREE.SphereGeometry(0.7, 8, 6), bronze, 0, 1.9, 0).scale.set(0.8, 1, 1.4);
    add(hk, new THREE.SphereGeometry(0.42, 8, 6), bronze, 0, 2.7, 0.7);
    for (const s of [-1, 1]) add(hk, new THREE.ConeGeometry(0.15, 0.4, 5), bronze, s * 0.25, 3.1, 0.6);
    train(group(hk, 6, 0, -4, 0.3), { cars: 1, color: 0x2f7a4a, tram: true });
    // Shibuya 109: o cilindro prateado na bifurcação
    const c9 = G('cento-e-nove', 0);
    tower(c9, 26, 26, 42, { color: 0xd8dde4, round: true });
    add(c9, cyl(13.4, 13.4, 3, 20), neon(0xff5ab8), 0, 36, 0, false);
    // Center-gai: a rua de pedestres com letreiros até o quinto andar
    const cg = P.centergai, cz = P.cruzamento;
    const dir = Math.atan2(cg.x - cz.x, cg.z - cz.z);
    for (let i = 0; i < 10; i++) for (const s of [-1, 1]) {
      const t = 0.3 + i * 0.16;
      const x = cz.x + (cg.x - cz.x) * t * 1.6 + Math.cos(dir) * s * 12, z = cz.z + (cg.z - cz.z) * t * 1.6 - Math.sin(dir) * s * 12;
      const g = group(root, x, H(x, z), z, dir + (s > 0 ? -Math.PI / 2 : Math.PI / 2));
      const h = 16 + rng() * 22;
      tower(g, 12, 12, h, { color: 0xb9bfc8 });
      for (let k = 0; k < Math.floor(h / 5); k++) add(g, box(4, 1.4, 0.3), neon([0xff3b3b, 0xffd23f, 0x39c5ff, 0xff5ab8, 0x5dff7a][(i + k) % 5]), -3 + (k % 2) * 6, 3 + k * 5, 6.2, false);
    }
    // Nonbei Yokochō: duas vielas de barzinhos de dois andares, rente aos trilhos
    const nb = G('nonbei', 0);
    for (let i = 0; i < 12; i++) for (const s of [-1, 1]) { const g = group(nb, -16 + i * 3, 0, s * 4, s > 0 ? Math.PI : 0); machiya(g, { w: 2.8, d: 3.2, dark: true, noren: [0xd94c3d, 0xe8b830, 0x3b6fb6][i % 3] }); add(g, box(1.2, 0.8, 0.2), neon(0xffd23f), 0, 2.4, 1.8, false); }
    // Miyashita Park: o parque no telhado do shopping, com o skate e o Shibuya Yokochō embaixo
    const mp = G('miyashita', 0);
    add(mp, box(40, 16, 130), new THREE.MeshStandardMaterial({ color: 0xc9cdd3, roughness: 0.5 }), 0, 8, 0);
    add(mp, box(38, 0.4, 126), new THREE.MeshStandardMaterial({ color: 0x5d8a3a, roughness: 1 }), 0, 16.3, 0, false);
    add(mp, box(14, 0.3, 30), MAT.stoneDark, -8, 16.5, -30, false); // o skatepark
    for (let i = 0; i < 10; i++) add(mp, cyl(0.15, 0.15, 5, 5), MAT.rail, -18 + i * 4, 19, 60, false);
    for (let i = 0; i < 8; i++) { add(mp, new THREE.SphereGeometry(2.4, 7, 5), new THREE.MeshStandardMaterial({ color: 0x4c6f33, roughness: 1 }), -12 + (i % 4) * 8, 19.4, -50 + Math.floor(i / 4) * 90); }
    stalls(root, H, { x: P.miyashita.x - 30, z: P.miyashita.z + 70 }, { x: P.miyashita.x + 30, z: P.miyashita.z + 70 }, 5, 3, { both: false });
    // a cidade: prédios em toda a volta, mais altos perto da estação
    for (let bx = -400; bx <= 400; bx += 34) for (let bz = -350; bz <= 350; bz += 34) {
      const near = ['cruzamento', 'hachiko', 'estacao', 'sky', 'cento-e-nove', 'nonbei', 'miyashita', 'centergai'].some((id) => Math.hypot(bx - P[id].x, bz - P[id].z) < (id === 'miyashita' ? 80 : id === 'sky' ? 40 : 46));
      if (near) continue;
      if (Math.abs(bx - 40) < 16) continue; // os trilhos
      if (Math.hypot(bx - cz.x, bz - cz.z) < 90) continue;
      const d = Math.hypot(bx, bz);
      const h = 14 + rng() * (d < 200 ? 70 : 30);
      const g = group(root, bx + (rng() - 0.5) * 8, H(bx, bz), bz + (rng() - 0.5) * 8);
      tower(g, 16 + rng() * 14, 16 + rng() * 12, h, { color: [0xaeb6c2, 0x9aa3ad, 0xc4b9a8][Math.floor(rng() * 3)] });
      if (rng() < 0.3) add(g, box(6, 2, 0.3), neon([0xff3b3b, 0x39c5ff, 0xff5ab8, 0xffd23f][Math.floor(rng() * 4)]), 0, h * 0.6, 9, false);
    }
  },
  camera: (P, H) => ({
    pos: new THREE.Vector3(P.cruzamento.x - 260, 260, P.cruzamento.z + 320),
    target: new THREE.Vector3(P.cruzamento.x + 30, H(P.cruzamento.x, P.cruzamento.z) + 30, P.cruzamento.z),
  }),
  fog: { color: 0x1c2340, near: 500, far: 1300 },
  markerLift: 30,
};
export default spec;
