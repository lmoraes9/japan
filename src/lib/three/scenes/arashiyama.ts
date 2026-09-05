import * as THREE from 'three';
import type { SceneSpec } from '../engine';
import { peak, noise, smooth, instances } from '../engine';
import { MAT, add, box, cyl } from '../parts';
import { group, hall, gate1, shrine, station, stalls, machiya, bridge, boat, bambooGrove, train, bigTorii, deerGeometry } from '../buildings';

/** Arashiyama: o rio Katsura com a ponte Togetsukyō, as montanhas dos dois lados, o bambu e o trem Torokko */
const spec: SceneSpec = {
  center: { lat: 35.0155, lng: 135.676 },
  scale: 0.62,
  size: { w: 1000, d: 820 },
  terrain: (x, z) => {
    // montanhas a oeste (x < -200) e ao sul do rio (z > 150); a planície fica a leste
    const west = 160 * smooth(-160, -420, x) + peak(x, z, -420, -60, 60, 200);
    const south = 130 * smooth(140, 380, z) * smooth(-380, -100, x) + peak(x, z, -60, 380, 60, 220);
    return 34 + Math.max(west, south) + noise(x, z, 1.5);
  },
  rivers: [{ through: [{ x: -480, z: 330 }, { x: -330, z: 250 }, { x: -160, z: 175 }, { x: 40, z: 150 }, { x: 300, z: 160 }, { x: 500, z: 200 }], width: 42, depth: 4 }],
  flats: [{ at: 'tenryuji', r: 50, edge: 16 }, { at: 'okochi', r: 24, edge: 14 }, { at: 'jojakkoji', r: 20, edge: 12 }, { at: 'macacos', r: 24, edge: 12 }, { at: 'estacao', r: 34 }, { at: 'torokko', r: 30 }],
  ground: (x, z, y) => (y > 100 ? [0.3, 0.44, 0.25] : x > 80 && z < 120 ? [0.66, 0.65, 0.6] : [0.47, 0.6, 0.33]),
  paths: [
    { through: ['estacao', 'torokko', 'rua', 'tenryuji', 'nonomiya', 'bambu', 'okochi', 'jojakkoji'], width: 5 },
    { through: ['rua', 'togetsukyo', 'macacos'], width: 6 },
    { through: [{ x: 500, z: -40 }, 'estacao'], width: 8, kind: 'asphalt' },
  ],
  forest: { count: 3400, kinds: ['cedar', 'broad', 'maple', 'maple', 'pine'], pathGap: 7, allow: (x, z, y, P) => (y > 60 || (x < 100 && z < 120 && Math.abs(Math.sin(x * 1.3 + z * 0.7)) > 0.5)) && Math.hypot(x - P.bambu.x, z - P.bambu.z) > 60 && Math.hypot(x - P.tenryuji.x, z - P.tenryuji.z) > 60 },
  build: ({ root, H, P, quality, addInstanced, rng }) => {
    const G = (id: string, yaw = 0, dx = 0, dz = 0) => group(root, P[id].x + dx, H(P[id].x + dx, P[id].z + dz), P[id].z + dz, yaw, 1.2);
    // estação JR Saga-Arashiyama e a linha para o leste; a estação Torokko ao lado
    station(G('estacao', Math.PI / 2), { railLen: 500, modern: true });
    const tk = G('torokko', Math.PI / 2, 0, 20);
    add(tk, box(8, 1, 40), MAT.stoneDark, -4, 0.5, 0);
    for (const dx of [-11, -17]) add(tk, box(0.5, 0.3, 320), MAT.rail, dx, 0.2, -120, false);
    train(group(tk, -14, 0.3, 10), { cars: 4, color: 0xc0392b, tram: true });
    add(tk, box(12, 4, 8), MAT.wood, 4, 2, 0); add(tk, box(13, 0.5, 9), MAT.black, 4, 4.3, 0);
    // a rua principal: lojas e cafés dos dois lados
    stalls(root, H, P.rua, P.tenryuji, 8, 7);
    for (let i = 0; i < 8; i++) for (const s of [-1, 1]) { const x = P.rua.x + 30 - i * 12, z = P.rua.z + s * 14; machiya(group(root, x, H(x, z), z, s > 0 ? Math.PI : 0), { w: 9, d: 8, noren: [0xd94c3d, 0x3b6fb6, 0x5f8a3a][i % 3] }); }
    // Tenryū-ji: o salão do abade, o lago Sōgen e o portão
    const tj = G('tenryuji', -Math.PI / 2);
    hall(group(tj, 0, 0, 0), { bays: 6, depthBays: 3, bay: 3.8, two: false });
    gate1(group(tj, 0, 0, 40), { w: 12, d: 7 });
    add(tj, new THREE.CircleGeometry(18, 28), MAT.water, -8, 0.2, -28, false).rotation.x = -Math.PI / 2;
    for (let i = 0; i < 9; i++) { const a = (i / 9) * Math.PI * 2; add(tj, new THREE.DodecahedronGeometry(1.4 + (i % 3) * 0.5), MAT.stoneDark, -8 + Math.cos(a) * 19, 0.8, -28 + Math.sin(a) * 19); }
    // Nonomiya: o torii de madeira com casca e a cerca de arbustos
    const nm = G('nonomiya', Math.PI / 2);
    shrine(nm, 6);
    bigTorii(root, P.nonomiya.x, H(P.nonomiya.x, P.nonomiya.z + 14), P.nonomiya.z + 14, Math.PI / 2, 5, 6, new THREE.MeshStandardMaterial({ color: 0x4a3526, roughness: 1 }));
    // o bosque de bambu: milhares de hastes e a cerca ao longo da trilha
    bambooGrove(addInstanced, H, P.bambu.x, P.bambu.z, 70, 50, quality === 'alta' ? 2600 : 900, rng);
    // Ōkōchi Sansō: a villa no alto com o jardim e a casa de chá
    const ok = G('okochi', Math.PI / 2 + 0.4);
    machiya(group(ok, 0, 0, 0), { w: 14, d: 10 });
    machiya(group(ok, 18, 0, 10, 0.5), { w: 7, d: 6 });
    add(ok, box(24, 0.3, 16), new THREE.MeshStandardMaterial({ color: 0x5d7a3a, roughness: 1 }), 0, 0.15, 16, false);
    // Jōjakkō-ji: o portão de sapé e o pagode na encosta de bordos
    const jj = G('jojakkoji', Math.PI / 2 + 0.3);
    gate1(group(jj, 0, 0, 24), { w: 8, d: 5, h: 5, white: true });
    hall(group(jj, 0, 0, 0), { bays: 4, depthBays: 2, bay: 3.4, two: false, lanterns: false });
    const pg = group(jj, -16, 6, -14);
    for (let t = 0; t < 2; t++) { add(pg, box(6 - t, 2.2, 6 - t), MAT.plaster, 0, t * 3.4 + 1.1, 0); add(pg, box(9 - t, 0.5, 9 - t), MAT.black, 0, t * 3.4 + 2.6, 0); }
    add(pg, cyl(0.1, 0.1, 5, 6), MAT.gold, 0, 9.5, 0);
    // Togetsukyō: a ponte de 155 m sobre o Katsura, com os barcos
    const tg = P.togetsukyo;
    const yb = H(tg.x, tg.z + 60) + 3.5;
    bridge(root, new THREE.Vector3(tg.x - 4, yb, tg.z - 40), new THREE.Vector3(tg.x + 6, yb, tg.z + 46), { kind: 'flat', width: 8 });
    for (let i = 0; i < 6; i++) boat(group(root, tg.x - 120 + i * 24, H(tg.x - 120 + i * 24, tg.z) - 3 + 0.3, tg.z + (i % 2) * 10 - 4, 1.4 + i * 0.3), { len: 7, roof: i % 2 === 0 });
    // o parque dos macacos, no alto do morro do outro lado do rio
    const mk = G('macacos', 0);
    add(mk, box(12, 3.4, 8), MAT.wood, 0, 1.7, 0); add(mk, box(13, 0.5, 9), MAT.black, 0, 3.8, 0);
    const monkey: THREE.Matrix4[] = [];
    const tmp = new THREE.Object3D();
    for (let i = 0; i < 20; i++) { tmp.position.set(P.macacos.x + (rng() - 0.5) * 40, H(P.macacos.x, P.macacos.z), P.macacos.z + (rng() - 0.5) * 30); tmp.rotation.set(0, rng() * 6, 0); tmp.scale.set(0.7, 0.55, 0.7); tmp.updateMatrix(); monkey.push(tmp.matrix.clone()); }
    addInstanced(instances(deerGeometry(), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, color: 0x9a8a7a }), monkey, false));
    // a cidade a leste da estação
    for (let bx = 120; bx <= 480; bx += 34) for (let bz = -400; bz <= 100; bz += 34) {
      if (Math.abs(bz - (-40)) < 14 && bx > 300) continue;
      if (Math.hypot(bx - P.estacao.x, bz - P.estacao.z) < 50 || Math.hypot(bx - P.torokko.x, bz - P.torokko.z) < 40) continue;
      machiya(group(root, bx + (rng() - 0.5) * 6, H(bx, bz), bz, rng() * 0.2), { w: 9 + rng() * 5, d: 9, dark: rng() < 0.3 });
    }
  },
  camera: (P, H) => ({
    pos: new THREE.Vector3(P.togetsukyo.x + 200, 260, P.togetsukyo.z + 420),
    target: new THREE.Vector3(P.tenryuji.x, H(P.tenryuji.x, P.tenryuji.z) + 10, P.tenryuji.z + 20),
  }),
  markerLift: 26,
};
export default spec;
