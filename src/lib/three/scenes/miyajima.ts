import * as THREE from 'three';
import type { SceneSpec } from '../engine';
import { peak, noise, smooth, instances } from '../engine';
import { MAT, add, box, cyl, lantern } from '../parts';
import { group, hall, pagoda, shrine, stalls, machiya, stage, stairs, bigTorii, boat, ropeway, deerGeometry } from '../buildings';

const CENTER = { lat: 34.296, lng: 132.3215 };
const S = 0.32;
const coastX = (z: number) => -62 + 14 * Math.sin(z / 90) + 6 * Math.cos(z / 37); // a costa oeste da ilha, logo a leste do torii

/** Miyajima: a ilha inteira, da balsa ao cume do Misen, com o torii dentro do mar */
const spec: SceneSpec = {
  center: CENTER,
  scale: S,
  size: { w: 720, d: 1220 },
  terrain: (x, z) => {
    const cx = coastX(z);
    const land = smooth(cx, cx + 40, x) * smooth(-600, -560, z); // a ilha termina ao norte (z negativo)
    const misen = peak(x, z, 60, 560, 210, 300) + peak(x, z, 160, 300, 120, 220) + peak(x, z, 220, -100, 80, 200) + peak(x, z, 120, 40, 40, 140);
    return -8 + land * (14 + misen * smooth(cx, cx + 120, x) + noise(x, z, 2));
  },
  sea: { level: 0 },
  flats: [{ at: 'itsukushima', r: 40, edge: 20, y: 1.5 }, { at: 'senjokaku', r: 28, edge: 14 }, { at: 'daishoin', r: 28, edge: 14 }, { at: 'teleferico', r: 18 }, { at: 'misen', r: 20, edge: 12 }, { at: 'balsa', r: 30, y: 4 }],
  paths: [
    { through: ['balsa', 'omotesando', 'cervos', 'senjokaku', 'itsukushima', 'daishoin'], width: 5 },
    { through: ['itsukushima', 'momijidani', 'teleferico'], width: 4 },
    { through: ['teleferico', { x: 40, z: 300 }, { x: 90, z: 440 }, 'misen'], width: 3 },
  ],
  forest: { count: 3600, kinds: ['broad', 'cedar', 'pine', 'maple', 'maple'], pathGap: 7, allow: (x, z, y) => y > 6 },
  build: ({ root, H, P, quality, addInstanced, rng }) => {
    const G = (id: string, yaw = 0, dx = 0, dz = 0) => group(root, P[id].x + dx, H(P[id].x + dx, P[id].z + dz), P[id].z + dz, yaw, 1.3);
    // a balsa e o píer
    const pier = group(root, P.balsa.x - 30, 0, P.balsa.z, 0);
    add(pier, box(14, 1.2, 60), MAT.stoneDark, 0, 3.0, 0);
    for (let i = 0; i < 6; i++) add(pier, cyl(0.5, 0.5, 4, 6), MAT.wood, -6 + (i % 2) * 12, 1.5, -25 + i * 10);
    add(pier, box(20, 6, 16), MAT.plaster, 12, 6.6, 0);
    add(pier, box(22, 0.6, 18), MAT.vermilion, 12, 9.8, 0);
    const ferry = group(root, P.balsa.x - 70, 0, P.balsa.z + 10, 0.3);
    add(ferry, box(12, 3, 36), MAT.white, 0, 1.5, 0);
    add(ferry, box(10, 3, 24), new THREE.MeshStandardMaterial({ color: 0xdfe6ee, roughness: 0.5 }), 0, 4.5, -2);
    add(ferry, box(12.2, 0.6, 36.2), MAT.awning2, 0, 0.6, 0);
    add(ferry, cyl(0.6, 0.8, 3, 8), MAT.black, 0, 7.5, -8);
    // rua de comércio: lojas com beirais
    stalls(root, H, P.omotesando, P.cervos, 12, 6);
    for (let i = 0; i < 10; i++) for (const s of [-1, 1]) { const t = i / 10; const x = P.omotesando.x + (P.cervos.x - P.omotesando.x) * t + s * 12, z = P.omotesando.z + (P.cervos.z - P.omotesando.z) * t; machiya(group(root, x, H(x, z), z, s > 0 ? -Math.PI / 2 : Math.PI / 2), { w: 7, d: 8, noren: i % 2 ? 0xd94c3d : 0x3b6fb6 }); }
    // os cervos
    const deer: THREE.Matrix4[] = [];
    const tmp = new THREE.Object3D();
    for (let i = 0; i < 26; i++) {
      const c = i < 14 ? P.cervos : P.itsukushima;
      const x = c.x + (rng() - 0.5) * 60, z = c.z + (rng() - 0.5) * 60;
      const y = H(x, z); if (y < 1) continue;
      tmp.position.set(x, y, z); tmp.rotation.set(0, rng() * Math.PI * 2, 0); tmp.scale.setScalar(1.4); tmp.updateMatrix(); deer.push(tmp.matrix.clone());
    }
    addInstanced(instances(deerGeometry(), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 }), deer, quality === 'alta'));
    // Senjōkaku, o salão aberto de Hideyoshi, e o pagode ao lado
    hall(G('senjokaku', Math.PI / 2), { bays: 8, depthBays: 5, bay: 3.6, two: false, open: true, lanterns: false });
    pagoda(G('senjokaku', 0, 0, -36), 5, 9);
    // o santuário sobre estacas, no nível do mar
    const it = P.itsukushima;
    const sh = group(root, it.x, 0, it.z, Math.PI / 2 + 0.3);
    stage(group(sh, 0, -2, 0), 60, 40, 4);
    hall(group(sh, 0, 2.5, 0), { bays: 6, depthBays: 3, bay: 4, two: false, open: true, lanterns: false });
    // os corredores (kairō) em volta, cobertos
    for (const [x, z, len, yaw] of [[-34, 0, 40, 0], [34, 0, 40, 0], [0, 24, 68, Math.PI / 2]] as [number, number, number, number][]) {
      const c = group(sh, x, 2.5, z, yaw);
      add(c, box(4, 0.4, len), MAT.woodLight, 0, 0.2, 0);
      for (let i = 0; i <= len / 4; i++) for (const s of [-1, 1]) add(c, cyl(0.2, 0.2, 3, 6), MAT.vermilion, s * 1.8, 1.9, -len / 2 + i * 4);
      add(c, box(5, 0.5, len + 1), MAT.black, 0, 3.6, 0);
    }
    for (let i = 0; i < 8; i++) for (const s of [-1, 1]) lantern(sh, s * 30, 2.5, -20 + i * 6, 2.0);
    // o grande torii, plantado no mar
    const ot = P.otorii;
    bigTorii(root, ot.x, -2.5, ot.z, Math.PI / 2 + 0.3, 16, 18);
    for (const s of [-1, 1]) for (const t of [-1, 1]) add(root, cyl(0.5, 0.6, 12, 8), MAT.vermilion, ot.x + s * 8.6 + t * 2.4 * Math.cos(0.3), 3.5, ot.z + t * 2.6, true).rotation.z = t * 0.35;
    // Daishō-in: templo na encosta, escadaria e as 500 estátuas
    const ds = G('daishoin', Math.PI);
    hall(group(ds, 0, 0, 0), { bays: 5, depthBays: 3, bay: 3.4, two: true });
    stairs(group(ds, 0, 0, 28, Math.PI), 8, 16);
    for (let i = 0; i < 60; i++) add(ds, cyl(0.3, 0.4, 1.2, 6), MAT.stone, -16 + (i % 12) * 2.9, 0.6 + Math.floor(i / 12) * 1.0, 30 + Math.floor(i / 12) * 2.2, false);
    for (let i = 0; i < 60; i++) add(ds, new THREE.SphereGeometry(0.28, 6, 5), new THREE.MeshStandardMaterial({ color: 0xd94c3d }), -16 + (i % 12) * 2.9, 1.5 + Math.floor(i / 12) * 1.0, 30 + Math.floor(i / 12) * 2.2, false);
    // o teleférico até perto do cume
    const tf = P.teleferico, ms = P.misen;
    const a = new THREE.Vector3(tf.x, H(tf.x, tf.z), tf.z);
    const m = new THREE.Vector3(tf.x + (ms.x - tf.x) * 0.45, H(tf.x + (ms.x - tf.x) * 0.45, tf.z + (ms.z - tf.z) * 0.45), tf.z + (ms.z - tf.z) * 0.45);
    const b = new THREE.Vector3(ms.x - 20, H(ms.x - 20, ms.z - 60) + 2, ms.z - 60);
    ropeway(root, a, m, 5);
    ropeway(root, m, b, 3);
    // o cume: rochas enormes e o salão da chama eterna
    const cm = G('misen', 0);
    for (let i = 0; i < 9; i++) add(cm, new THREE.DodecahedronGeometry(3 + (i % 3) * 1.6), MAT.stone, Math.cos(i * 1.7) * 12, 1.5, Math.sin(i * 1.7) * 12);
    add(cm, box(10, 6, 10), MAT.stoneDark, 0, 3, 0); add(cm, box(11, 1, 11), MAT.black, 0, 6.5, 0);
    shrine(group(cm, 0, 0, -30), 6);
    // Momijidani: ponte vermelha sobre o riacho
    const mj = G('momijidani', 0.8);
    add(mj, box(3, 0.4, 14), MAT.vermilion, 0, 1.2, 0);
    for (let i = 0; i < 5; i++) for (const s of [-1, 1]) add(mj, box(0.15, 1, 0.15), MAT.vermilion, s * 1.5, 1.9, -6 + i * 3, false);
  },
  camera: (P, H) => ({
    pos: new THREE.Vector3(P.otorii.x - 380, 240, P.otorii.z - 260),
    target: new THREE.Vector3(P.itsukushima.x + 60, H(P.itsukushima.x, P.itsukushima.z) + 20, P.itsukushima.z + 120),
  }),
  markerLift: 26,
};
export default spec;
