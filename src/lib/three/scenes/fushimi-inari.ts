import * as THREE from 'three';
import type { SceneSpec } from '../engine';
import { peak, noise, smooth, alongPath, nearestIndex, instances } from '../engine';
import { MAT, add, box, cyl, fox, toriiGeometry, lantern, roof } from '../parts';
import { group, hall, gate2, shrine, station, stalls, bigTorii } from '../buildings';

const spec: SceneSpec = {
  center: { lat: 34.9676, lng: 135.779 },
  scale: 0.6,
  size: { w: 1000, d: 640 },
  terrain: (x, z) => {
    const m = Math.max(peak(x, z, 355, -13, 205, 230), peak(x, z, 300, 60, 170, 150), peak(x, z, 262, -110, 155, 140));
    const flat = 1 - smooth(-330, -230, x);
    return 30 + m + 42 * smooth(-260, 120, x) + noise(x, z, 4) * (1 - flat * 0.85);
  },
  flats: [{ at: 'yotsutsuji', r: 16, edge: 12 }, { at: 'cume', r: 22, edge: 10 }],
  ponds: [{ at: 'shinike', rx: 30, rz: 20, depth: 3 }],
  paths: [{ through: ['estacao', 'barracas', 'romon', 'kitsune', 'honden', 'senbon', { x: -60, z: -70 }, { x: -20, z: -50 }, 'omokaru', { x: 70, z: -10 }, { x: 120, z: -60 }, { x: 170, z: -40 }, 'shinike', { x: 250, z: -90 }, { x: 300, z: -60 }, { x: 330, z: -30 }, 'yotsutsuji', 'cume'] }],
  forest: { count: 3200, allow: (x, z, y) => !(x < -300 && Math.abs(z) < 70) && (y > 34 || Math.abs(Math.sin(x * 3.1 + z)) > 0.7) },
  build: ({ root, H, P, paths, quality, addInstanced }) => {
    const s = paths[0];
    const toriiMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.6 });
    // torii ao longo da subida: densos no Senbon, esparsos até o cume
    const iSenbon = nearestIndex(s, P.senbon), iOku = nearestIndex(s, P.omokaru);
    const dense: THREE.Matrix4[] = [], sparse: THREE.Matrix4[] = [];
    alongPath(s, iSenbon, iOku, quality === 'alta' ? 1 : 2, (m) => dense.push(m), { scale: (i) => 0.75 + ((i * 7) % 5) * 0.02 });
    alongPath(s, iOku + 6, s.length - 8, quality === 'alta' ? 4 : 7, (m) => sparse.push(m), { scale: (i) => 0.9 + ((i * 3) % 7) * 0.03 });
    const geo = toriiGeometry(3.2, 4.8, 0.24);
    addInstanced(instances(geo, toriiMat, dense, quality === 'alta'));
    addInstanced(instances(geo, toriiMat, sparse, quality === 'alta'));
    const a = P.barracas, b = P.romon;
    bigTorii(root, (a.x + b.x) / 2, H((a.x + b.x) / 2, (a.z + b.z) / 2), (a.z + b.z) / 2, Math.atan2(b.x - a.x, b.z - a.z), 9, 12, toriiMat);

    station(group(root, P.estacao.x, H(P.estacao.x, P.estacao.z), P.estacao.z), { railLen: 260 });
    stalls(root, H, P.estacao, P.romon, 14);
    gate2(group(root, P.romon.x, H(P.romon.x, P.romon.z), P.romon.z, Math.PI / 2 + 0.15), { w: 18, d: 10 });
    fox(root, P.kitsune.x, H(P.kitsune.x, P.kitsune.z), P.kitsune.z - 5, Math.PI + 0.3, 1.5);
    fox(root, P.kitsune.x, H(P.kitsune.x, P.kitsune.z), P.kitsune.z + 5, -0.3, 1.5);
    hall(group(root, P.honden.x, H(P.honden.x, P.honden.z), P.honden.z, Math.PI / 2 + 0.15), { bays: 5, depthBays: 3, bay: 4 });

    // Okusha, a pedra pesada-leve e o muro de mini-torii
    const ok = group(root, P.omokaru.x, H(P.omokaru.x, P.omokaru.z), P.omokaru.z, 0.4);
    shrine(ok, 9);
    for (const sd of [-1, 1]) add(ok, new THREE.SphereGeometry(0.42, 10, 8), MAT.stoneDark, sd * 5.5, 0.8 + 0.6 + 2.2 * 0.45 + 0.3 + 1.7, 7.5);
    fox(ok, -4, 0.8, 10, 0.8, 1.1); fox(ok, 4, 0.8, 10, -0.8, 1.1);
    const mini = toriiGeometry(0.8, 1.2, 0.06);
    const wallList: THREE.Matrix4[] = [];
    const tmp = new THREE.Object3D();
    ok.updateMatrix();
    for (let i = 0; i < 90; i++) { const row = Math.floor(i / 30), k = i % 30; tmp.position.set(-7 + k * 0.5, 0.8 + row * 1.4, -7 - row * 0.4); tmp.rotation.set(0, 0, 0); tmp.updateMatrix(); wallList.push(tmp.matrix.clone().premultiply(ok.matrix)); }
    addInstanced(instances(mini, toriiMat, wallList, false));

    // santuário da lagoa
    const sh = group(root, P.shinike.x - 34, H(P.shinike.x - 34, P.shinike.z - 12), P.shinike.z - 12, 0.9);
    shrine(sh, 6);
    for (let i = 0; i < 14; i++) { const an = (i / 14) * Math.PI * 2; add(root, new THREE.DodecahedronGeometry(1.2 + (i % 3) * 0.5), MAT.stoneDark, P.shinike.x + Math.cos(an) * 33, H(P.shinike.x + Math.cos(an) * 33, P.shinike.z + Math.sin(an) * 22) + 0.6, P.shinike.z + Math.sin(an) * 22); }

    // Yotsutsuji: a casa de chá e o corrimão da vista
    const yt = group(root, P.yotsutsuji.x, H(P.yotsutsuji.x, P.yotsutsuji.z), P.yotsutsuji.z);
    add(yt, box(34, 0.6, 22), MAT.stoneDark, 0, 0.3, 0, false);
    const tea = group(yt, 6, 0.6, -4, -0.5);
    add(tea, box(12, 3.4, 8), MAT.wood, 0, 1.7, 0);
    add(tea, box(11, 1.2, 0.2), MAT.plaster, 0, 2.4, 4.05);
    add(tea, box(12.4, 0.5, 8.4), MAT.vermilion, 0, 3.6, 0);
    roof(tea, { W: 16, D: 12, H: 2.6, L: 8, lift: 0.5, y: 3.7, ridge: true, rafters: false });
    for (let i = 0; i < 5; i++) add(tea, box(0.6, 0.9, 0.1), MAT.awning, -4 + i * 2, 4.9, 6.1);
    for (const x of [-10, -4]) add(yt, box(4, 0.4, 1), MAT.wood, x, 1.1, 7);
    for (let i = 0; i <= 8; i++) add(yt, box(0.15, 1.1, 0.15), MAT.wood, -16 + i * 4, 1.15, 10.5, false);
    lantern(yt, -14, 0.6, -6, 2.2); lantern(yt, 14, 0.6, 6, 2.2);

    // o cume: santuário, altares de pedra e a clareira de mini-torii
    const cm = group(root, P.cume.x, H(P.cume.x, P.cume.z), P.cume.z);
    add(cm, cyl(20, 26, 1.2, 24), MAT.stoneDark, 0, 0.6, 0, false);
    const cs = group(cm, 0, 1.2, 0); shrine(cs, 7);
    const top: THREE.Matrix4[] = [];
    const rng2 = (() => { let a = 3; return () => { a = (a * 16807) % 2147483647; return a / 2147483647; }; })();
    for (let i = 0; i < 240; i++) { const an = rng2() * Math.PI * 2, r = 9 + rng2() * 12; tmp.position.set(P.cume.x + Math.cos(an) * r, H(P.cume.x, P.cume.z) + 1.2 + Math.floor(rng2() * 3) * 1.3, P.cume.z + Math.sin(an) * r); tmp.rotation.set(0, -an + Math.PI / 2, 0); tmp.updateMatrix(); top.push(tmp.matrix.clone()); }
    addInstanced(instances(mini, toriiMat, top, false));
    for (let i = 0; i < 16; i++) { const an = (i / 16) * Math.PI * 2; add(cm, box(1.2, 2.2 + (i % 3) * 0.6, 0.5), MAT.stoneDark, Math.cos(an) * 15, 2.2, Math.sin(an) * 15).rotation.y = -an; }
  },
  camera: (P, H) => ({
    pos: new THREE.Vector3(P.estacao.x - 210, 150, P.estacao.z + 260),
    target: new THREE.Vector3((P.estacao.x + P.cume.x) / 2 - 60, 70, (P.estacao.z + P.cume.z) / 2),
  }),
};
export default spec;
