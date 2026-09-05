import * as THREE from 'three';
import type { SceneSpec } from '../engine';
import { peak, noise, smooth } from '../engine';
import { MAT, add, box, cyl, lantern } from '../parts';
import { group, hall, gate1, gate2, pagoda, shrine, machiya, stage, stairs, bigTorii, bridge, wall, tower } from '../buildings';

/** Higashiyama: a encosta leste de Kyoto, de Kiyomizu ao Ginkaku-ji, com as ruas antigas no sopé e a cidade a oeste */
const spec: SceneSpec = {
  center: { lat: 35.011, lng: 135.7867 },
  scale: 0.24,
  size: { w: 900, d: 1000 },
  terrain: (x, z) => {
    // as montanhas Higashiyama sobem para leste (x positivo); a cidade é plana a oeste
    const ridge = 150 * smooth(-40, 260, x) + peak(x, z, 260, 300, 60, 200) + peak(x, z, 300, -80, 40, 220) + peak(x, z, 280, -420, 50, 200);
    return 40 + ridge + noise(x, z, 2) * smooth(-60, 60, x);
  },
  flats: [{ at: 'kiyomizu', r: 36, edge: 18 }, { at: 'kodaiji', r: 30, edge: 12 }, { at: 'yasaka-jinja', r: 34, edge: 12 }, { at: 'nanzenji', r: 44, edge: 16 }, { at: 'ginkakuji', r: 34, edge: 14 }, { at: 'yasaka-pagoda', r: 16 }, { at: 'sannenzaka', r: 14, edge: 8 }],
  rivers: [{ through: [{ x: -150, z: -520 }, { x: -140, z: -100 }, { x: -150, z: 300 }, { x: -160, z: 520 }], width: 14, depth: 2 }, { through: ['filosofo', { x: 150, z: -300 }, 'ginkakuji'], width: 4, depth: 1.2 }],
  ground: (x, z, y) => (x < -40 ? [0.7, 0.68, 0.64] : y > 120 ? [0.3, 0.42, 0.24] : [0.46, 0.58, 0.32]),
  paths: [
    { through: ['kiyomizu', 'jishu'], width: 4 },
    { through: ['kiyomizu', 'sannenzaka', 'yasaka-pagoda', 'kodaiji', 'yasaka-jinja', 'gion'], width: 5 },
    { through: ['yasaka-jinja', { x: 90, z: -60 }, 'nanzenji', { x: 140, z: -320 }, 'filosofo', 'ginkakuji'], width: 4 },
    { through: [{ x: -150, z: 150 }, 'gion', { x: 60, z: 150 }], width: 8, kind: 'asphalt' },
  ],
  forest: { count: 3600, kinds: ['cedar', 'broad', 'maple', 'maple', 'pine'], pathGap: 7, allow: (x, z, y, P) => x > -20 && !['kiyomizu', 'kodaiji', 'yasaka-jinja', 'nanzenji', 'ginkakuji', 'yasaka-pagoda', 'gion'].some((id) => Math.hypot(x - P[id].x, z - P[id].z) < 40) },
  build: ({ root, H, P, rng }) => {
    const G = (id: string, yaw = 0, dx = 0, dz = 0) => group(root, P[id].x + dx, H(P[id].x + dx, P[id].z + dz), P[id].z + dz, yaw, 1.5);
    // Kiyomizu-dera: o salão no palco de 13 m, o portão vermelho e o pagode na encosta
    const km = G('kiyomizu', -Math.PI / 2);
    stage(group(km, 0, -10, 6), 26, 16, 11);
    hall(group(km, 0, 1.5, 0), { bays: 6, depthBays: 3, bay: 3.6, two: false, lanterns: false });
    gate2(group(km, 0, 2, 46, 0), { w: 12, d: 7 });
    pagoda(group(km, -16, 2, 40), 3, 6);
    // Jishu-jinja: as duas pedras do amor
    const js = G('jishu', -Math.PI / 2);
    shrine(js, 6, { torii: true });
    for (const s of [-1, 1]) add(js, new THREE.DodecahedronGeometry(0.9), MAT.stoneDark, s * 5, 1.2, 7);
    // Sannenzaka e Ninenzaka: ladeiras de casas de madeira, com degraus
    const sz = P.sannenzaka, kz = P.kiyomizu;
    const dir = Math.atan2(kz.x - sz.x, kz.z - sz.z);
    for (let i = 0; i < 12; i++) for (const s of [-1, 1]) {
      const t = -0.3 + i * 0.09;
      const x = sz.x + (kz.x - sz.x) * t + Math.cos(dir) * s * 8, z = sz.z + (kz.z - sz.z) * t - Math.sin(dir) * s * 8;
      machiya(group(root, x, H(x, z), z, dir + (s > 0 ? -Math.PI / 2 : Math.PI / 2), 1.2), { w: 7, d: 7, dark: i % 3 === 0, noren: [0xd94c3d, 0x3b6fb6, 0xe8b830, 0x5f8a3a][i % 4] });
    }
    stairs(group(root, sz.x, H(sz.x, sz.z), sz.z, dir + Math.PI, 1.2), 6, 14, 0.4, 0.9);
    // o pagode Yasaka, sozinho no meio das casas
    pagoda(G('yasaka-pagoda', 0), 5, 9);
    // Kōdai-ji: salão, jardim com lago e o bosque de bambu
    const kd = G('kodaiji', Math.PI / 2);
    hall(group(kd, 0, 0, 0), { bays: 5, depthBays: 3, bay: 3.4, two: false });
    add(kd, new THREE.CircleGeometry(14, 24), MAT.water, 0, 0.2, 30, false).rotation.x = -Math.PI / 2;
    bridge(root, new THREE.Vector3(P.kodaiji.x + 10, H(P.kodaiji.x, P.kodaiji.z) + 1, P.kodaiji.z + 20), new THREE.Vector3(P.kodaiji.x + 40, H(P.kodaiji.x, P.kodaiji.z) + 1, P.kodaiji.z + 36), { kind: 'covered', width: 3 });
    // Yasaka-jinja: o portão vermelho de dois andares na avenida e o palco de lanternas
    const yj = G('yasaka-jinja', Math.PI / 2);
    gate2(group(yj, 0, 0, 40), { w: 16, d: 9 });
    shrine(group(yj, 0, 0, 0), 12);
    const st = group(yj, 0, 0, 20);
    add(st, box(14, 1.2, 14), MAT.stone, 0, 0.6, 0);
    for (const sx of [-1, 1]) for (const sz2 of [-1, 1]) add(st, cyl(0.25, 0.25, 4, 8), MAT.vermilion, sx * 6, 3.2, sz2 * 6);
    add(st, box(15, 0.6, 15), MAT.black, 0, 5.4, 0);
    for (let i = 0; i < 24; i++) add(st, cyl(0.45, 0.45, 0.9, 8), MAT.white, -6 + (i % 8) * 1.7, 4.4, -6 + Math.floor(i / 8) * 6, false);
    // Gion: Hanamikōji, fileiras de ochaya de madeira escura
    const gi = P.gion;
    for (let i = 0; i < 9; i++) for (const s of [-1, 1]) machiya(group(root, gi.x - 40 + i * 10, H(gi.x, gi.z + s * 12), gi.z + s * 12, s > 0 ? Math.PI : 0, 1.3), { w: 8, d: 8, dark: true, noren: i % 2 ? 0xd94c3d : undefined });
    for (let i = 0; i < 6; i++) add(root, cyl(0.06, 0.06, 3, 5), MAT.black, gi.x - 40 + i * 16, H(gi.x, gi.z) + 1.5, gi.z, false);
    // Nanzen-ji: o Sanmon enorme e o aqueduto de tijolo
    const nz = G('nanzenji', -Math.PI / 2);
    gate1(group(nz, 0, 0, 30), { w: 22, d: 12, h: 12, white: false });
    hall(group(nz, 0, 0, -10), { bays: 6, depthBays: 3, bay: 3.6, two: false });
    const aq = group(nz, 20, 0, 50, 0.4);
    const brick = new THREE.MeshStandardMaterial({ color: 0x9a6a4a, roughness: 1 });
    for (let i = 0; i < 9; i++) { add(aq, box(2.2, 8, 3), brick, -20 + i * 5, 4, 0); }
    add(aq, box(46, 2, 3.4), brick, 0, 9, 0);
    for (let i = 0; i < 8; i++) add(aq, new THREE.CylinderGeometry(2.4, 2.4, 3.2, 12, 1, false, 0, Math.PI), brick, -17.5 + i * 5, 8, 0, false).rotation.set(Math.PI / 2, 0, Math.PI);
    // Caminho do Filósofo: o canal com cerejeiras e a trilha ao lado
    for (let i = 0; i < 40; i++) { const t = i / 40; const x = P.filosofo.x + (P.ginkakuji.x - P.filosofo.x) * t * 0.9 + 6, z = P.filosofo.z + (P.ginkakuji.z - P.filosofo.z) * t; const m = add(root, new THREE.SphereGeometry(2.2, 6, 5), new THREE.MeshStandardMaterial({ color: 0xe8b4c6, roughness: 1 }), x, H(x, z) + 3.6, z); m.scale.y = 0.8; add(root, cyl(0.18, 0.25, 3, 5), MAT.wood, x, H(x, z) + 1.5, z, false); }
    // Ginkaku-ji: o Pavilhão de Prata e o cone de areia
    const gk = G('ginkakuji', -Math.PI / 2 - 0.3);
    hall(group(gk, 0, 0, 0), { bays: 3, depthBays: 2, bay: 3.8, two: true, lanterns: false });
    add(gk, new THREE.ConeGeometry(4, 3, 20), new THREE.MeshStandardMaterial({ color: 0xd9d2c0, roughness: 1 }), 14, 1.5, 12);
    add(gk, box(20, 0.6, 8), new THREE.MeshStandardMaterial({ color: 0xd9d2c0, roughness: 1 }), 0, 0.3, 20);
    add(gk, new THREE.CircleGeometry(12, 24), MAT.water, -18, 0.2, 10, false).rotation.x = -Math.PI / 2;
    wall(root, new THREE.Vector3(P.ginkakuji.x - 30, H(P.ginkakuji.x - 30, P.ginkakuji.z + 30), P.ginkakuji.z + 30), new THREE.Vector3(P.ginkakuji.x + 30, H(P.ginkakuji.x + 30, P.ginkakuji.z + 30), P.ginkakuji.z + 30), 2.4);
    // a cidade, a oeste: quadras baixas até o rio Kamo, e o rio com as pontes
    for (let bx = -430; bx <= -70; bx += 34) for (let bz = -480; bz <= 480; bz += 34) {
      if (Math.abs(bx + 148) < 16) continue;
      if (Math.hypot(bx - P.gion.x, bz - P.gion.z) < 60) continue;
      if (Math.abs(bz - 150) < 12) continue;
      const h = 6 + rng() * 14;
      if (rng() < 0.35) machiya(group(root, bx, H(bx, bz), bz, 0, 1.3), { w: 10, d: 10, dark: rng() < 0.4 });
      else tower(group(root, bx, H(bx, bz), bz), 16 + rng() * 10, 16 + rng() * 10, h, { color: [0xe6e2da, 0xd9cfc0, 0xcfd3d8][Math.floor(rng() * 3)] });
    }
    for (const z of [-300, 150, 380]) bridge(root, new THREE.Vector3(-172, H(-175, z) + 2.6, z), new THREE.Vector3(-124, H(-124, z) + 2.6, z), { kind: 'flat', width: 8 });
    // lanternas de pedra ao longo do caminho de Kiyomizu
    for (let i = 0; i < 5; i++) lantern(root, P.sannenzaka.x + 12, H(P.sannenzaka.x + 12, P.sannenzaka.z + 10 + i * 12), P.sannenzaka.z + 10 + i * 12, 2.6);
    bigTorii(root, P['yasaka-jinja'].x - 60, H(P['yasaka-jinja'].x - 60, P['yasaka-jinja'].z), P['yasaka-jinja'].z, Math.PI / 2, 9, 11);
  },
  camera: (P, H) => ({
    pos: new THREE.Vector3(P.gion.x - 260, 300, P.gion.z + 420),
    target: new THREE.Vector3(P.kodaiji.x + 40, H(P.kodaiji.x, P.kodaiji.z) + 20, P.kodaiji.z - 60),
  }),
  markerLift: 26,
};
export default spec;
