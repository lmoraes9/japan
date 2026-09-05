import * as THREE from 'three';
import type { SceneSpec } from '../engine';
import { peak, noise, smooth, alongPath, instances } from '../engine';
import { MAT, add, box, cyl } from '../parts';
import { group, hall, gate2, pagoda, shrine, station, stalls, machiya, buddha, stage, bigTorii, deerGeometry, lanternGeometry } from '../buildings';

/** Nara: o parque dos cervos, o Daibutsuden, o Nandaimon, as lanternas de Kasuga e o monte Wakakusa ao fundo */
const spec: SceneSpec = {
  center: { lat: 34.6845, lng: 135.8385 },
  scale: 0.42,
  size: { w: 960, d: 680 },
  terrain: (x, z) => 30 + peak(x, z, 420, -40, 120, 260) + peak(x, z, 380, 200, 60, 200) + 14 * smooth(-100, 400, x) + noise(x, z, 1.2),
  flats: [{ at: 'daibutsuden', r: 70, edge: 24 }, { at: 'kasuga', r: 40, edge: 16 }, { at: 'kofukuji', r: 50, edge: 16 }, { at: 'nigatsudo', r: 20, edge: 10 }],
  ponds: [{ at: 'sarusawa', rx: 34, rz: 22, depth: 2 }],
  ground: (x, z, y) => (x < -160 && z > -60 ? [0.7, 0.68, 0.64] : y > 60 ? [0.55, 0.62, 0.32] : [0.5, 0.62, 0.34]),
  paths: [
    { through: ['estacao', 'kofukuji', 'cervos', 'nandaimon', 'daibutsuden'], width: 8 },
    { through: ['daibutsuden', 'nigatsudo'], width: 4 },
    { through: ['cervos', { x: 120, z: 140 }, 'kasuga'], width: 5 },
    { through: ['kofukuji', 'sarusawa', 'naramachi'], width: 5 },
  ],
  forest: { count: 2600, kinds: ['broad', 'cedar', 'pine', 'maple'], pathGap: 8, allow: (x, z, y, P) => !(x < -160 && z > -60) && Math.hypot(x - P.daibutsuden.x, z - P.daibutsuden.z) > 90 && Math.hypot(x - P.kofukuji.x, z - P.kofukuji.z) > 55 && (Math.hypot(x - P.cervos.x, z - P.cervos.z) > 70 || Math.abs(Math.sin(x * 0.9 + z * 1.7)) > 0.85) && !(x > 330 && y > 70) },
  build: ({ root, H, P, quality, addInstanced, rng }) => {
    const G = (id: string, yaw = 0, dx = 0, dz = 0) => group(root, P[id].x + dx, H(P[id].x + dx, P[id].z + dz), P[id].z + dz, yaw, 1.2);
    // estação Kintetsu e a cidade a oeste
    station(G('estacao', Math.PI / 2), { railLen: 200, modern: true });
    for (let bx = -470; bx <= -200; bx += 36) for (let bz = -40; bz <= 320; bz += 36) {
      if (Math.hypot(bx - P.estacao.x, bz - P.estacao.z) < 40) continue;
      machiya(group(root, bx + (rng() - 0.5) * 6, H(bx, bz), bz, rng() * 0.2), { w: 9 + rng() * 6, d: 9, dark: rng() < 0.3 });
    }
    // Kōfuku-ji: o pagode de cinco andares e o salão octogonal
    const kf = G('kofukuji', 0);
    pagoda(group(kf, 24, 0, 6), 5, 10);
    hall(group(kf, -20, 0, -10), { bays: 5, depthBays: 3, bay: 3.6, two: false });
    const oct = group(kf, -6, 0, 30);
    add(oct, cyl(9, 9, 5, 8), MAT.plaster, 0, 2.5, 0);
    add(oct, cyl(11, 11, 0.6, 8), MAT.vermilion, 0, 5.2, 0);
    add(oct, new THREE.ConeGeometry(12, 4.5, 8), MAT.black, 0, 7.8, 0);
    add(oct, new THREE.SphereGeometry(0.8, 8, 6), MAT.gold, 0, 10.4, 0);
    // os cervos, espalhados pelo parque
    const deer: THREE.Matrix4[] = [];
    const tmp = new THREE.Object3D();
    for (let i = 0; i < 90; i++) {
      const c = [P.cervos, P.cervos, P.nandaimon, P.kasuga, P.kofukuji][i % 5];
      const x = c.x + (rng() - 0.5) * 120, z = c.z + (rng() - 0.5) * 100;
      tmp.position.set(x, H(x, z), z); tmp.rotation.set(0, rng() * Math.PI * 2, 0); tmp.scale.setScalar(1.6); tmp.updateMatrix(); deer.push(tmp.matrix.clone());
    }
    addInstanced(instances(deerGeometry(), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 }), deer, quality === 'alta'));
    // Nandaimon: o portão gigante com os dois guardiões
    const nd = G('nandaimon', 0);
    gate2(nd, { w: 26, d: 12 });
    for (const s of [-1, 1]) { add(nd, box(3, 7, 2.4), MAT.wood, s * 8, 4.5, 3.5); add(nd, new THREE.SphereGeometry(1.2, 8, 6), MAT.wood, s * 8, 8.8, 3.5); }
    // Daibutsuden: o maior prédio de madeira, com o Buda dentro e o muro em volta
    const dd = G('daibutsuden', 0);
    hall(dd, { bays: 7, depthBays: 5, bay: 6.4, two: true, open: true, lanterns: false });
    add(dd, cyl(1.2, 1.2, 0.3, 10), MAT.black, 0, 1.6, 40);
    const gm = new THREE.MeshStandardMaterial({ color: 0x8a6a3a, metalness: 0.4, roughness: 0.6 });
    for (const s of [-1, 1]) add(dd, box(2, 0.6, 1), gm, s * 12, 10.5 + 5.5, 0); // os chifres dourados da cumeeira (aproximados)
    buddha(group(dd, 0, 1.5, -4), 0.55);
    const wy = 0;
    for (const [x1, z1, x2, z2] of [[-70, 50, 70, 50], [-70, -50, 70, -50], [-70, -50, -70, 50], [70, -50, 70, 50]]) {
      const c = group(dd, (x1 + x2) / 2, wy, (z1 + z2) / 2, Math.atan2(x2 - x1, z2 - z1));
      const len = Math.hypot(x2 - x1, z2 - z1);
      add(c, box(2.4, 3.2, len), MAT.plaster, 0, 1.6, 0); add(c, box(3.4, 0.5, len + 0.6), MAT.black, 0, 3.4, 0);
      for (let i = 0; i < len / 6; i++) add(c, cyl(0.25, 0.25, 3.2, 6), MAT.vermilion, 1.3, 1.6, -len / 2 + i * 6);
    }
    // o portão do meio (Chūmon), no muro sul
    gate2(group(dd, 0, 0, 50), { w: 16, d: 8 });
    // Nigatsu-dō: o salão no palco, na encosta
    const ng = G('nigatsudo', Math.PI + 0.6);
    stage(group(ng, 0, -9, 0), 24, 14, 10);
    hall(group(ng, 0, 1.5, -2), { bays: 5, depthBays: 2, bay: 3.6, two: false, lanterns: false });
    for (let i = 0; i < 8; i++) add(ng, box(1.2, 1.4, 0.2), MAT.awning, -12 + i * 3.4, 12.2, 8, false); // as lanternas penduradas na varanda
    // Kasuga Taisha: a alameda de lanternas de pedra e o santuário vermelho com as lanternas de bronze
    const lg = lanternGeometry(2.6);
    const lm = new THREE.MeshStandardMaterial({ color: 0x8e8a80, roughness: 1 });
    const ll: THREE.Matrix4[] = [];
    const s2 = (() => { const pts = [P.cervos, { x: 120, z: 140 }, P.kasuga]; const c = new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(p.x, 0, p.z))); const arr = c.getSpacedPoints(160); arr.forEach((p) => (p.y = H(p.x, p.z))); return arr; })();
    for (const side of [-4.5, 4.5]) alongPath(s2, 20, s2.length - 4, 3, (m) => ll.push(m), { side, lift: 0 });
    addInstanced(instances(lg, lm, ll, quality === 'alta'));
    const ks = G('kasuga', Math.PI - 0.8);
    shrine(ks, 12, { torii: true });
    for (let i = 0; i < 30; i++) { const a = (i / 30) * Math.PI * 2; add(ks, box(0.5, 0.9, 0.5), MAT.gold, Math.cos(a) * 11, 3.6, Math.sin(a) * 9, false); }
    for (const s of [-1, 1]) { const c = group(ks, s * 12, 0, 0); add(c, box(3, 0.4, 20), MAT.woodLight, 0, 0.6, 0); for (let i = 0; i < 6; i++) add(c, cyl(0.18, 0.18, 3, 6), MAT.vermilion, 0, 2.1, -9 + i * 3.6); add(c, box(4, 0.5, 21), MAT.black, 0, 3.8, 0); }
    bigTorii(root, P.cervos.x + 40, H(P.cervos.x + 40, P.cervos.z + 50), P.cervos.z + 50, -0.9, 9, 11);
    // Sarusawa: as pedras à volta da lagoa e os salgueiros
    for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; const x = P.sarusawa.x + Math.cos(a) * 38, z = P.sarusawa.z + Math.sin(a) * 26; add(root, new THREE.DodecahedronGeometry(0.9), MAT.stoneDark, x, H(x, z) + 0.4, z); }
    // Naramachi: ruas estreitas de casas antigas
    for (let i = 0; i < 6; i++) for (const s of [-1, 1]) machiya(group(root, P.naramachi.x - 30 + i * 11, H(P.naramachi.x, P.naramachi.z + s * 9), P.naramachi.z + s * 9, s > 0 ? Math.PI : 0), { w: 9, d: 8, dark: i % 2 === 0, noren: i % 3 === 0 ? 0x3b6fb6 : undefined });
    stalls(root, H, P.estacao, P.kofukuji, 8, 8, { both: false });
  },
  camera: (P, H) => ({
    pos: new THREE.Vector3(P.kofukuji.x - 120, 240, P.kofukuji.z + 380),
    target: new THREE.Vector3(P.cervos.x, H(P.cervos.x, P.cervos.z) + 10, P.cervos.z),
  }),
  markerLift: 24,
};
export default spec;
