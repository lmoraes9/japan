import * as THREE from 'three';
import type { SceneSpec } from '../engine';
import { noise, smooth } from '../engine';
import { MAT, add, box, cyl } from '../parts';
import { group, castle, gate1, shrine, station, tower, bridge, train, boat } from '../buildings';

/** Castelo de Osaka: dois fossos, muralhas em dois anéis, o torreão no centro, o Nishinomaru e a cidade em volta */
const spec: SceneSpec = {
  center: { lat: 34.6875, lng: 135.527 },
  scale: 0.75,
  size: { w: 960, d: 680 },
  terrain: (x, z) => 12 + 14 * inner(x, z) + 8 * outer(x, z) + noise(x, z, 0.3),
  rivers: [
    // fosso externo e fosso interno, como anéis
    { through: ring(-250, -190, 250, 150), width: 34, depth: 4 },
    { through: ring(-120, -100, 120, 70), width: 26, depth: 4 },
  ],
  ground: (x, z) => (inner(x, z) > 0.5 ? [0.78, 0.74, 0.66] : outer(x, z) > 0.5 ? [0.5, 0.62, 0.36] : [0.68, 0.67, 0.63]),
  paths: [
    { through: [{ x: -330, z: 60 }, 'otemon', 'nishinomaru', { x: -60, z: 110 }, 'sakuramon', 'tenshu'], width: 7 },
    { through: ['tenshu', 'hokoku', { x: 150, z: 20 }, 'aoyamon', { x: 300, z: -60 }, 'estacao'], width: 6 },
    { through: ['tenshu', 'gokurakubashi', { x: 0, z: -230 }], width: 5 },
    { through: [{ x: -460, z: 250 }, { x: 460, z: 250 }], width: 14, kind: 'asphalt' },
  ],
  forest: { count: 1600, kinds: ['cherry', 'broad', 'pine', 'maple'], pathGap: 8, allow: (x, z, y, P) => (outer(x, z) > 0.6 && inner(x, z) < 0.4 && Math.hypot(x - P.nishinomaru.x, z - P.nishinomaru.z) > 30) || (inner(x, z) > 0.6 && Math.hypot(x - P.tenshu.x, z - P.tenshu.z) > 60 && Math.hypot(x - P.hokoku.x, z - P.hokoku.z) > 30) },
  build: ({ root, H, P, rng }) => {
    const G = (id: string, yaw = 0, dx = 0, dz = 0) => group(root, P[id].x + dx, H(P[id].x + dx, P[id].z + dz), P[id].z + dz, yaw, 1.2);
    // muralhas: a inclinada de pedra em volta dos dois recintos
    const stone = new THREE.MeshStandardMaterial({ color: 0x7f7b72, roughness: 1 });
    const walls = (x1: number, z1: number, x2: number, z2: number, h: number) => {
      for (const [a, b] of [[[x1, z1], [x2, z1]], [[x2, z1], [x2, z2]], [[x2, z2], [x1, z2]], [[x1, z2], [x1, z1]]] as [number[], number[]][]) {
        const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
        const g = group(root, (a[0] + b[0]) / 2, H((a[0] + b[0]) / 2, (a[1] + b[1]) / 2) - 5, (a[1] + b[1]) / 2, Math.atan2(b[0] - a[0], b[1] - a[1]));
        const w = add(g, box(6, h, len + 6), stone, 0, h / 2, 0);
        w.scale.x = 1; w.rotation.z = 0;
        add(g, box(9, 1.5, len + 6), stone, 0, 0.75, 0);
        add(g, box(2, 2.2, len + 6), MAT.plaster, 1.6, h + 1.1, 0); add(g, box(3, 0.4, len + 6.4), MAT.black, 1.6, h + 2.3, 0);
      }
    };
    walls(-228, -170, 228, 130, 12);
    walls(-102, -84, 102, 54, 16);
    // o torreão, o santuário de Hideyoshi e os portões
    castle(G('tenshu', 0.15), { tiers: 5, size: 26, base: 16, turrets: false });
    shrine(G('hokoku', Math.PI), 12, { torii: true });
    gate1(G('otemon', Math.PI / 2), { w: 14, d: 8, h: 7, white: true });
    gate1(G('sakuramon', -0.4), { w: 12, d: 8, h: 7, white: true });
    gate1(G('aoyamon', -Math.PI / 2), { w: 10, d: 7, h: 6, white: true });
    // a pedra-polvo, em frente ao Sakuramon
    add(root, box(14, 6, 1.6), new THREE.MeshStandardMaterial({ color: 0x6a655c, roughness: 1 }), P.sakuramon.x + 14, H(P.sakuramon.x, P.sakuramon.z) + 3, P.sakuramon.z - 6);
    // pontes sobre os fossos
    const b = (id: string, dir: [number, number], len: number) => { const p = P[id]; const y = H(p.x, p.z) + 1.5; bridge(root, new THREE.Vector3(p.x - dir[0] * len / 2, y, p.z - dir[1] * len / 2), new THREE.Vector3(p.x + dir[0] * len / 2, y, p.z + dir[1] * len / 2), { kind: 'flat', width: 7 }); };
    b('otemon', [1, 0], 60); b('sakuramon', [0.3, 1], 50); b('gokurakubashi', [0, 1], 50); b('aoyamon', [1, 0], 50);
    // Nishinomaru: gramado com o torreão à vista
    const nw = G('nishinomaru', 0);
    add(nw, box(50, 0.2, 40), new THREE.MeshStandardMaterial({ color: 0x6d8a3a, roughness: 1 }), 0, 0.1, 0, false);
    add(nw, box(10, 3, 8), MAT.wood, -18, 1.5, -12); add(nw, box(11, 0.5, 9), MAT.black, -18, 3.2, -12); // a casa de chá
    // a estação JR e a Loop Line a leste, com os prédios
    station(G('estacao', 0), { railLen: 500, modern: true });
    train(group(root, P.estacao.x - 17, H(P.estacao.x, P.estacao.z) + 0.3, P.estacao.z + 40), { cars: 4, color: 0xd9541e });
    for (let bx = -460; bx <= 460; bx += 40) for (let bz = -320; bz <= 320; bz += 40) {
      if (outer(bx, bz) > 0.05) continue;
      if (Math.abs(bz - 250) < 18 || Math.hypot(bx - P.estacao.x, bz - P.estacao.z) < 46) continue;
      const h = 12 + rng() * (bx < -300 ? 60 : 30);
      tower(group(root, bx + (rng() - 0.5) * 6, H(bx, bz), bz + (rng() - 0.5) * 6), 20 + rng() * 12, 18 + rng() * 10, h, { color: [0xe6e2da, 0xcfd3d8, 0xd9cfc0][Math.floor(rng() * 3)] });
    }
    // o Osaka-jō Hall, redondo, junto ao fosso externo, e o barco do fosso
    tower(group(root, 300, H(300, -240), -240), 60, 60, 22, { color: 0xd9d2c0, round: true });
    boat(group(root, P.gokurakubashi.x - 30, H(P.gokurakubashi.x - 30, P.gokurakubashi.z) - 3, P.gokurakubashi.z, 0.2), { len: 10, roof: true, color: 0xd4a94f });
  },
  camera: (P, H) => ({
    pos: new THREE.Vector3(P.otemon.x - 300, 250, P.otemon.z + 260),
    target: new THREE.Vector3(P.tenshu.x, H(P.tenshu.x, P.tenshu.z) + 20, P.tenshu.z),
  }),
  markerLift: 26,
};

/** retângulo como polilinha fechada, para os fossos */
function ring(x1: number, z1: number, x2: number, z2: number) {
  return [{ x: x1, z: z1 }, { x: x2, z: z1 }, { x: x2, z: z2 }, { x: x1, z: z2 }, { x: x1, z: z1 - 1 }];
}
/** 1 dentro do recinto interno (dentro do fosso interno), com borda suave */
function inner(x: number, z: number) {
  return smooth(-118, -100, x) * (1 - smooth(100, 118, x)) * smooth(-100, -82, z) * (1 - smooth(52, 70, z));
}
/** 1 dentro do recinto externo */
function outer(x: number, z: number) {
  return smooth(-248, -226, x) * (1 - smooth(226, 248, x)) * smooth(-188, -168, z) * (1 - smooth(128, 148, z));
}
export default spec;
