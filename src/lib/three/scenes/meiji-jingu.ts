import * as THREE from 'three';
import type { SceneSpec } from '../engine';
import { noise } from '../engine';
import { MAT, add, box, cyl, roof, treeGeometry } from '../parts';
import { group, hall, shrine, station, stalls, machiya, tower, sakeBarrels, bigTorii, train } from '../buildings';

const cypress = new THREE.MeshStandardMaterial({ color: 0x7a5a3a, roughness: 0.85 });

/** Meiji Jingū: a floresta plantada, o torii de cipreste, os barris, o santuário e Harajuku ao lado */
const spec: SceneSpec = {
  center: { lat: 35.6735, lng: 139.7005 },
  scale: 0.9,
  size: { w: 900, d: 780 },
  terrain: (x, z) => 20 + noise(x, z, 1.5) + 6 * Math.exp(-((x + 120) ** 2 + (z + 200) ** 2) / 90000),
  flats: [{ at: 'honden', r: 60, edge: 20 }, { at: 'harajuku', r: 40 }],
  ponds: [{ at: 'kiyomasa', rx: 28, rz: 18, depth: 2, dx: -20, dz: 10 }],
  ground: (x, z) => (x > 130 || z > 300 ? [0.7, 0.68, 0.64] : [0.42, 0.55, 0.3]),
  paths: [
    { through: ['harajuku', 'otorii', 'barris', 'floresta', 'temizuya', 'honden'], width: 12 },
    { through: ['barris', 'kiyomasa'], width: 4 },
    { through: ['honden', 'meoto'], width: 4, kind: 'none' },
    { through: ['harajuku', 'museu'], width: 5 },
    { through: [{ x: 180, z: 340 }, 'takeshita', { x: 420, z: 320 }], width: 8, kind: 'asphalt' },
    { through: [{ x: 150, z: -400 }, { x: 150, z: 400 }], width: 16, kind: 'asphalt' },
  ],
  forest: { count: 4200, kinds: ['broad', 'broad', 'cedar', 'pine'], pathGap: 9, allow: (x, z, _y, P) => x < 130 && z < 300 && ![['honden', 80], ['barris', 30], ['kiyomasa', 40], ['harajuku', 50], ['museu', 40], ['otorii', 20], ['meoto', 18]].some(([id, r]) => Math.hypot(x - P[id as string].x, z - P[id as string].z) < (r as number)) },
  build: ({ root, H, P, rng }) => {
    const G = (id: string, yaw = 0, dx = 0, dz = 0) => group(root, P[id].x + dx, H(P[id].x + dx, P[id].z + dz), P[id].z + dz, yaw);
    // Harajuku: estação nova e a linha Yamanote
    const st = G('harajuku', Math.PI / 2, 20, 0);
    station(st, { railLen: 700, modern: true });
    train(group(st, -14, 0.3, 90), { cars: 4, color: 0x8fbf6a });
    // o grande torii de cipreste, sem pintura
    const a = P.harajuku, b = P.otorii;
    bigTorii(root, b.x, H(b.x, b.z), b.z, Math.atan2(b.x - a.x, b.z - a.z), 14, 16, cypress);
    // os barris de saquê e, em frente, os de vinho da Borgonha
    sakeBarrels(G('barris', -0.4, -10, 0), 4, 16);
    const wine = G('barris', -0.4 + Math.PI, 12, -8);
    const wmat = new THREE.MeshStandardMaterial({ color: 0x8a5a3a, roughness: 0.9 });
    add(wine, box(16, 0.6, 2), MAT.wood, 0, 0.3, 0);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 12; c++) add(wine, cyl(0.5, 0.5, 1.0, 8), wmat, -7 + c * 1.25, 1.1 + r * 1.05, 0).rotation.x = Math.PI / 2;
    // o jardim interno: poço de Kiyomasa e o campo de íris
    const kg = G('kiyomasa', 0, 0, 0);
    add(kg, cyl(1.2, 1.4, 1.0, 10), MAT.stone, 0, 0.5, 0);
    add(kg, cyl(0.9, 0.9, 0.2, 10), MAT.water, 0, 1.0, 0, false);
    for (let i = 0; i < 40; i++) add(kg, box(1.2, 0.9, 0.3), new THREE.MeshStandardMaterial({ color: 0x5f8a3a, roughness: 1 }), -22 + (i % 8) * 3, 0.45, 12 + Math.floor(i / 8) * 2.6, false);
    // temizuya: a bacia coberta
    const tz = G('temizuya', 0, 0, 0);
    add(tz, box(6, 1.0, 2.2), MAT.stone, 0, 0.5, 0);
    add(tz, box(5.6, 0.2, 1.8), MAT.water, 0, 1.05, 0, false);
    for (const [x, z] of [[-3.4, -1.6], [3.4, -1.6], [-3.4, 1.6], [3.4, 1.6]]) add(tz, cyl(0.18, 0.18, 3.2, 6), cypress, x, 1.6, z);
    roof(tz, { W: 9, D: 6, H: 1.4, L: 5, lift: 0.3, y: 3.2, ridge: false, rafters: false, thickness: 0.22 });
    // o santuário: segundo torii, pátio murado, salão principal em cipreste e telhado de cobre
    const hn = G('honden', 0, 0, 0);
    hall(hn, { bays: 5, depthBays: 3, bay: 4.2, two: false, open: true });
    bigTorii(root, P.honden.x, H(P.honden.x, P.honden.z + 60), P.honden.z + 60, 0, 10, 12, cypress);
    for (const s of [-1, 1]) {
      const w = add(hn, box(0.6, 3, 70), MAT.plaster, s * 36, 1.5, 15); w.castShadow = true;
      add(hn, box(1.2, 0.3, 70), MAT.black, s * 36, 3.1, 15);
    }
    add(hn, box(73, 3, 0.6), MAT.plaster, 0, 1.5, 50);
    add(hn, box(73, 0.3, 1.2), MAT.black, 0, 3.1, 50);
    add(hn, box(10, 4.5, 0.8), cypress, 0, 2.2, 50);
    // Meoto kusu: as duas cânforas casadas, com a corda entre elas
    const tm = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 });
    for (const s of [-1, 1]) {
      const t = new THREE.Mesh(treeGeometry('broad'), tm);
      t.position.set(P.meoto.x + s * 7, H(P.meoto.x, P.meoto.z), P.meoto.z);
      t.scale.setScalar(3.2); t.castShadow = true; root.add(t);
    }
    const rope = add(root, cyl(0.15, 0.15, 14, 5), new THREE.MeshStandardMaterial({ color: 0xd8c9a0 }), P.meoto.x, H(P.meoto.x, P.meoto.z) + 7, P.meoto.z, false);
    rope.rotation.z = Math.PI / 2;
    // o museu de Kengo Kuma: baixo, comprido, telhado plano largo
    const mu = G('museu', 0.3, 0, 0);
    add(mu, box(40, 5, 14), new THREE.MeshStandardMaterial({ color: 0x8a9aa8, roughness: 0.3, metalness: 0.3 }), 0, 2.5, 0);
    add(mu, box(46, 0.5, 20), MAT.wood, 0, 5.4, 0);
    for (let i = 0; i < 8; i++) add(mu, box(0.4, 5, 0.4), cypress, -20 + i * 5.7, 2.5, 9.2);
    // Takeshita-dōri e o Harajuku de prédios
    stalls(root, H, { x: 180, z: 340 }, { x: 420, z: 320 }, 16, 7);
    for (let bx = 170; bx <= 430; bx += 40) for (let bz = -380; bz <= 400; bz += 40) {
      if (Math.abs(bz - 330) < 24 && bx > 160) continue;
      if (Math.abs(bx - 150) < 18) continue;
      const h = 10 + rng() * 40;
      tower(group(root, bx + (rng() - 0.5) * 6, H(bx, bz), bz + (rng() - 0.5) * 6), 16 + rng() * 14, 16 + rng() * 10, h, { color: [0xe6e2da, 0xcfd3d8, 0xd9cfc0][Math.floor(rng() * 3)] });
    }
    for (let bx = -400; bx <= 100; bx += 40) for (let bz = 330; bz <= 380; bz += 40) machiya(group(root, bx, H(bx, bz), bz), { w: 12, d: 10 });
    // o santuário de Harajuku, ao lado da estação (Tōgō-jinja, pequeno)
    shrine(group(root, 250, H(250, 250), 250, Math.PI), 8, { torii: true });
  },
  camera: (P, H) => ({
    pos: new THREE.Vector3(P.harajuku.x + 120, 210, P.harajuku.z + 300),
    target: new THREE.Vector3(P.floresta.x, H(P.floresta.x, P.floresta.z) + 6, P.floresta.z),
  }),
  markerLift: 26,
};
export default spec;
