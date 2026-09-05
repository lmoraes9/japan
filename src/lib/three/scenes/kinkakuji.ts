import * as THREE from 'three';
import type { SceneSpec } from '../engine';
import { peak, noise, smooth } from '../engine';
import { MAT, add, box, cyl, lantern, roof } from '../parts';
import { group, hall, gate1, machiya, wall, rockGarden, bridge, stalls } from '../buildings';

/** Kinkaku-ji e Ryōan-ji: o pavilhão dourado no lago-espelho, a estrada Kinukake e o jardim das quinze pedras */
const spec: SceneSpec = {
  center: { lat: 35.0368, lng: 135.7245 },
  scale: 0.68,
  size: { w: 900, d: 640 },
  terrain: (x, z) => 30 + 90 * smooth(-40, -320, z) + peak(x, z, -300, -280, 60, 220) + peak(x, z, 340, -300, 50, 220) + noise(x, z, 1.2),
  flats: [{ at: 'pavilhao', r: 70, edge: 24 }, { at: 'pedras', r: 60, edge: 20 }, { at: 'sekkatei', r: 20, edge: 10 }],
  ponds: [{ at: 'lago', rx: 62, rz: 36, depth: 2.5, dx: -10 }, { at: 'ryoanji-lago', rx: 70, rz: 40, depth: 3 }],
  ground: (x, z, y) => (z > 60 && x > -200 ? [0.7, 0.68, 0.64] : y > 80 ? [0.3, 0.44, 0.25] : [0.47, 0.6, 0.33]),
  paths: [
    { through: ['entrada', { x: 200, z: 20 }, 'pavilhao', { x: 250, z: -70 }, 'lago', 'sekkatei'], width: 5 },
    { through: ['entrada', 'kinukake', { x: -80, z: 40 }, 'ryoanji-lago', 'pedras', 'tsukubai'], width: 6 },
    { through: [{ x: -440, z: 120 }, { x: 440, z: 120 }], width: 12, kind: 'asphalt' },
  ],
  forest: { count: 3200, kinds: ['cedar', 'broad', 'maple', 'pine'], pathGap: 8, allow: (x, z, y, P) => (z < 60 || x < -200) && Math.hypot(x - P.pavilhao.x, z - P.pavilhao.z) > 40 && Math.hypot(x - P.lago.x - 20, z - P.lago.z) > 60 && Math.hypot(x - P.pedras.x, z - P.pedras.z) > 44 && Math.hypot(x - P.entrada.x, z - P.entrada.z) > 26 },
  build: ({ root, H, P, rng }) => {
    const G = (id: string, yaw = 0, dx = 0, dz = 0) => group(root, P[id].x + dx, H(P[id].x + dx, P[id].z + dz), P[id].z + dz, yaw, 1.2);
    // a entrada: portão preto, muro e as barracas de omiyage
    gate1(G('entrada', 0), { w: 10, d: 6, h: 6, white: true });
    wall(root, new THREE.Vector3(P.entrada.x - 70, H(P.entrada.x - 70, P.entrada.z), P.entrada.z), new THREE.Vector3(P.entrada.x - 8, H(P.entrada.x - 8, P.entrada.z), P.entrada.z), 2.4);
    wall(root, new THREE.Vector3(P.entrada.x + 8, H(P.entrada.x + 8, P.entrada.z), P.entrada.z), new THREE.Vector3(P.entrada.x + 90, H(P.entrada.x + 90, P.entrada.z), P.entrada.z), 2.4);
    stalls(root, H, { x: P.entrada.x - 40, z: P.entrada.z + 30 }, { x: P.entrada.x + 40, z: P.entrada.z + 30 }, 5, 6, { both: false });
    // o Pavilhão Dourado, na margem norte do lago, com os dois andares de cima em ouro
    const pv = group(root, P.pavilhao.x, H(P.lago.x - 10, P.lago.z) - 0.2, P.pavilhao.z, Math.PI);
    add(pv, box(20, 1.2, 14), MAT.stone, 0, 0.6, 0);
    add(pv, box(18, 0.4, 12), MAT.woodLight, 0, 1.4, 0);
    for (let i = 0; i <= 4; i++) for (const s of [-1, 1]) add(pv, cyl(0.28, 0.3, 4, 8), MAT.wood, -8 + i * 4, 3.6, s * 5);
    add(pv, box(15, 3.6, 0.2), MAT.plaster, 0, 3.4, -5);
    add(pv, box(15, 1, 0.2), MAT.plaster, 0, 5.1, 5);
    for (let k = 0; k < 6; k++) add(pv, box(2, 3.4, 0.14), MAT.black, -6 + k * 2.4, 3.3, 4.9, false);
    add(pv, box(16.5, 0.5, 11), MAT.wood, 0, 5.8, 0);
    roof(pv, { W: 24, D: 18, H: 1.6, L: 12, lift: 0.6, y: 6.0, ridge: false, rafters: true, thickness: 0.25 });
    add(pv, box(13, 4, 9), MAT.gold, 0, 8.2, 0);
    for (let k = 0; k < 5; k++) for (const s of [-1, 1]) add(pv, box(1.4, 2.2, 0.14), MAT.black, -5 + k * 2.5, 8.2, s * 4.55, false);
    add(pv, box(14, 0.5, 10), MAT.gold, 0, 10.4, 0);
    roof(pv, { W: 20, D: 15, H: 1.5, L: 9, lift: 0.6, y: 10.6, ridge: false, rafters: true, thickness: 0.25 });
    add(pv, box(9, 3.6, 7), MAT.gold, 0, 12.6, 0);
    for (let k = 0; k < 3; k++) for (const s of [-1, 1]) add(pv, box(1.2, 2, 0.14), MAT.black, -2.6 + k * 2.6, 12.6, s * 3.55, false);
    add(pv, box(10, 0.5, 8), MAT.gold, 0, 14.5, 0);
    roof(pv, { W: 15, D: 12, H: 3.2, L: 5, lift: 0.8, y: 14.7, ridge: true, rafters: false, thickness: 0.25 });
    add(pv, new THREE.ConeGeometry(0.7, 1.4, 6), MAT.gold, 0, 19.2, 0); // a fênix dourada, simplificada
    // o lago-espelho: ilhas, pedras e o pinheiro-barco
    const lg = P.lago;
    const ly = H(lg.x - 10, lg.z) - 0.2;
    for (const [dx, dz, r] of [[-20, 6, 8], [10, 12, 5], [26, -4, 4], [-4, -10, 6]]) { const isl = add(root, new THREE.SphereGeometry(r, 12, 6), new THREE.MeshStandardMaterial({ color: 0x5d7a3a, roughness: 1 }), lg.x + dx - 10, ly - r * 0.7, lg.z + dz); isl.scale.y = 0.35; for (let k = 0; k < 3; k++) add(root, new THREE.DodecahedronGeometry(0.9), MAT.stoneDark, lg.x + dx - 10 + Math.cos(k * 2) * r * 0.6, ly + 0.5, lg.z + dz + Math.sin(k * 2) * r * 0.6); }
    for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2; add(root, new THREE.DodecahedronGeometry(1 + (i % 3) * 0.4), MAT.stoneDark, lg.x - 10 + Math.cos(a) * 60, ly + 0.5, lg.z + Math.sin(a) * 34); }
    // Sekkatei: a casa de chá e a cascata
    const sk = G('sekkatei', -0.8);
    machiya(group(sk, 0, 0, 0), { w: 8, d: 6, dark: true });
    lantern(sk, 6, 0, 4, 2.2);
    // Kinukake-no-michi: a estrada entre os templos, com muros
    wall(root, new THREE.Vector3(P.kinukake.x - 60, H(P.kinukake.x - 60, P.kinukake.z - 12), P.kinukake.z - 12), new THREE.Vector3(P.kinukake.x + 60, H(P.kinukake.x + 60, P.kinukake.z - 12), P.kinukake.z - 12), 2.4);
    // Ryōan-ji: o lago Kyōyōchi com a ilha, o Hōjō e o jardim de pedras murado
    const rl = P['ryoanji-lago'];
    const ry = H(rl.x, rl.z) - 0.2;
    const isl = add(root, new THREE.SphereGeometry(12, 12, 6), new THREE.MeshStandardMaterial({ color: 0x5d7a3a, roughness: 1 }), rl.x + 14, ry - 7, rl.z + 6); isl.scale.y = 0.4;
    bridge(root, new THREE.Vector3(rl.x + 14, ry + 0.8, rl.z + 16), new THREE.Vector3(rl.x + 14, ry + 0.8, rl.z + 44), { kind: 'flat', width: 2.5 });
    const pd = G('pedras', 0);
    hall(group(pd, 0, 0, -12), { bays: 6, depthBays: 3, bay: 3.6, two: false, lanterns: false });
    rockGarden(group(pd, 0, 0, 14), 30, 12);
    // o tsukubai: a bacia de pedra com a inscrição
    const tk = G('tsukubai', 0);
    add(tk, cyl(1.2, 1.4, 1.0, 10), MAT.stone, 0, 0.5, 0);
    add(tk, cyl(0.5, 0.5, 0.2, 10), MAT.water, 0, 1.02, 0, false);
    add(tk, cyl(0.06, 0.06, 2.4, 5), new THREE.MeshStandardMaterial({ color: 0x8fb35a }), 1.6, 1.2, 0).rotation.z = 0.5;
    // a cidade ao sul da avenida
    for (let bx = -180; bx <= 440; bx += 36) for (let bz = 150; bz <= 300; bz += 36) machiya(group(root, bx + (rng() - 0.5) * 6, H(bx, bz), bz, rng() * 0.2), { w: 9 + rng() * 5, d: 9, dark: rng() < 0.3 });
  },
  camera: (P, H) => ({
    pos: new THREE.Vector3((P.pavilhao.x + P.pedras.x) / 2 + 40, 520, (P.pavilhao.z + P.pedras.z) / 2 + 640),
    target: new THREE.Vector3((P.pavilhao.x + P.pedras.x) / 2, H(P.kinukake.x, P.kinukake.z) + 6, (P.pavilhao.z + P.pedras.z) / 2 + 10),
  }),
  markerLift: 24,
};
export default spec;
