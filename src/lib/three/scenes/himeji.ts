import * as THREE from 'three';
import type { SceneSpec } from '../engine';
import { peak, noise, smooth } from '../engine';
import { MAT, add, box, cyl } from '../parts';
import { group, castle, gate1, station, stalls, machiya, tower, wall, bridge, train } from '../buildings';

/** Himeji: a avenida reta da estação ao castelo branco no morro, os fossos, o labirinto de muralhas e o jardim Kōko-en */
const spec: SceneSpec = {
  center: { lat: 34.833, lng: 134.6915 },
  scale: 0.55,
  size: { w: 620, d: 940 },
  terrain: (x, z) => 20 + peak(x, z, 5, -395, 46, 110) + peak(x, z, 40, -330, 12, 80) + noise(x, z, 0.4),
  flats: [{ at: 'tenshu', r: 34, edge: 16 }, { at: 'nishinomaru', r: 30, edge: 12 }, { at: 'kokoen', r: 40, edge: 12 }],
  rivers: [{ through: [{ x: -160, z: -520 }, { x: -160, z: -200 }, { x: 170, z: -200 }, { x: 170, z: -520 }], width: 26, depth: 3 }],
  ground: (x, z) => (z < -200 && Math.abs(x) < 160 ? [0.5, 0.62, 0.36] : [0.7, 0.68, 0.64]),
  paths: [
    { through: ['otemae', 'almoco', 'otemon', 'hishinomon', 'espiral', 'okiku', 'tenshu'], width: 6 },
    { through: ['hishinomon', 'nishinomaru'], width: 4 },
    { through: ['otemon', 'kokoen'], width: 4 },
    { through: [{ x: -300, z: 400 }, 'otemae', { x: 300, z: 400 }], width: 14, kind: 'asphalt' },
  ],
  forest: { count: 900, kinds: ['cherry', 'cherry', 'pine', 'broad'], pathGap: 8, allow: (x, z, y, P) => z < -200 && Math.abs(x) < 165 && Math.hypot(x - P.tenshu.x, z - P.tenshu.z) > 46 && Math.hypot(x - P.nishinomaru.x, z - P.nishinomaru.z) > 30 },
  build: ({ root, H, P, rng }) => {
    const G = (id: string, yaw = 0, dx = 0, dz = 0) => group(root, P[id].x + dx, H(P[id].x + dx, P[id].z + dz), P[id].z + dz, yaw, 1.3);
    // o castelo, no morro
    castle(G('tenshu', 0.1), { tiers: 5, size: 26, base: 18, turrets: true });
    // Nishi-no-maru: o corredor comprido de cem metros e as muralhas
    const nw = G('nishinomaru', 0.2);
    add(nw, box(6, 6, 80), MAT.plaster, 0, 3, 0);
    add(nw, box(7.5, 0.6, 82), MAT.black, 0, 6.3, 0);
    add(nw, new THREE.CylinderGeometry(6, 9, 8, 4, 1), new THREE.MeshStandardMaterial({ color: 0x7f7b72, roughness: 1 }), 0, -4, -40).rotation.y = Math.PI / 4;
    for (let i = 0; i < 12; i++) add(nw, box(0.2, 1.2, 1.4), MAT.black, 3.1, 3.6, -36 + i * 6.5, false);
    // muralhas do labirinto: segmentos brancos em ziguezague subindo até o torreão
    const y0 = H(P.espiral.x, P.espiral.z);
    const segs: [number, number, number, number][] = [[-50, 40, -20, 10], [-20, 10, 20, 20], [20, 20, 30, -20], [30, -20, -10, -40], [-10, -40, -40, -10], [-40, -10, -30, 30], [10, 40, 50, 30], [50, 30, 60, -10]];
    for (const [x1, z1, x2, z2] of segs) wall(root, new THREE.Vector3(P.espiral.x + x1, H(P.espiral.x + x1, P.espiral.z + z1), P.espiral.z + z1), new THREE.Vector3(P.espiral.x + x2, H(P.espiral.x + x2, P.espiral.z + z2), P.espiral.z + z2), 3.2);
    void y0;
    // portões: Ōtemon (na ponte sobre o fosso) e Hishi-no-mon
    gate1(G('otemon', 0), { w: 12, d: 7, h: 6, white: true });
    gate1(G('hishinomon', 0.3), { w: 14, d: 8, h: 7, white: true });
    bridge(root, new THREE.Vector3(P.otemon.x, H(P.otemon.x, P.otemon.z) + 1.5, P.otemon.z + 34), new THREE.Vector3(P.otemon.x, H(P.otemon.x, P.otemon.z) + 1.5, P.otemon.z + 6), { kind: 'flat', width: 8 });
    // o poço de Okiku
    const ok = G('okiku', 0);
    add(ok, cyl(1.6, 1.8, 1.4, 12), MAT.stone, 0, 0.7, 0);
    add(ok, cyl(1.2, 1.2, 0.2, 12), MAT.black, 0, 1.45, 0, false);
    add(ok, box(4, 0.15, 4), MAT.wood, 0, 3.2, 0); for (const s of [-1, 1]) add(ok, cyl(0.12, 0.12, 3.2, 6), MAT.wood, s * 1.7, 1.6, 0);
    // Kōko-en: nove jardins murados com lago, ponte e casa de chá
    const kk = G('kokoen', 0);
    add(kk, new THREE.CircleGeometry(16, 24), MAT.water, 0, 0.2, -6, false).rotation.x = -Math.PI / 2;
    bridge(root, new THREE.Vector3(P.kokoen.x - 10, H(P.kokoen.x, P.kokoen.z) + 1, P.kokoen.z - 10), new THREE.Vector3(P.kokoen.x + 12, H(P.kokoen.x, P.kokoen.z) + 1, P.kokoen.z - 4), { kind: 'flat', width: 2.5 });
    machiya(group(kk, 16, 0, 12, -0.6), { w: 10, d: 8 });
    for (const [x1, z1, x2, z2] of [[-34, -30, 34, -30], [34, -30, 34, 30], [34, 30, -34, 30], [-34, 30, -34, -30]] as [number, number, number, number][]) wall(root, new THREE.Vector3(P.kokoen.x + x1, H(P.kokoen.x + x1, P.kokoen.z + z1), P.kokoen.z + z1), new THREE.Vector3(P.kokoen.x + x2, H(P.kokoen.x + x2, P.kokoen.z + z2), P.kokoen.z + z2), 2.2);
    for (let i = 0; i < 8; i++) add(kk, new THREE.DodecahedronGeometry(1.1), MAT.stoneDark, -14 + Math.cos(i * 1.4) * 12, 0.6, -6 + Math.sin(i * 1.4) * 10);
    // a estação e a avenida Ōtemae, com os prédios dos dois lados até o castelo
    station(G('otemae', Math.PI / 2, 0, 40), { railLen: 500, modern: true });
    train(group(root, P.otemae.x - 18, H(P.otemae.x, P.otemae.z + 60) + 0.3, P.otemae.z + 60, Math.PI / 2), { cars: 3, color: 0xdfe6ee });
    stalls(root, H, P.almoco, { x: P.almoco.x, z: P.almoco.z - 60 }, 6, 10);
    for (let bx = -290; bx <= 290; bx += 36) for (let bz = -170; bz <= 360; bz += 36) {
      if (Math.abs(bx) < 26) continue; // a avenida
      if (Math.abs(bz - 400) < 20 || Math.hypot(bx - P.otemae.x, bz - P.otemae.z - 40) < 40) continue;
      const h = 10 + rng() * (Math.abs(bx) < 80 ? 30 : 16);
      tower(group(root, bx + (rng() - 0.5) * 6, H(bx, bz), bz + (rng() - 0.5) * 6), 18 + rng() * 12, 18 + rng() * 10, h, { color: [0xe6e2da, 0xcfd3d8, 0xd9cfc0][Math.floor(rng() * 3)] });
    }
    // cerejeiras no fosso: a linha de árvores rosa em volta
    for (let i = 0; i < 20; i++) { const x = -150 + i * 16, z = -186; add(root, new THREE.SphereGeometry(3, 7, 5), new THREE.MeshStandardMaterial({ color: 0xe8b4c6, roughness: 1 }), x, H(x, z) + 4.5, z); add(root, cyl(0.2, 0.3, 3.5, 5), MAT.wood, x, H(x, z) + 1.7, z, false); }
  },
  camera: (P, H) => ({
    pos: new THREE.Vector3(P.otemon.x - 200, 200, P.otemon.z + 260),
    target: new THREE.Vector3(P.tenshu.x, H(P.tenshu.x, P.tenshu.z) + 20, P.tenshu.z + 30),
  }),
  markerLift: 26,
};
export default spec;
