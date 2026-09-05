import * as THREE from 'three';
import type { SceneSpec } from '../engine';
import { peak, noise, smooth, alongPath, instances } from '../engine';
import { MAT, add, box, cyl, lantern, toriiGeometry } from '../parts';
import { group, hall, gate1, shrine, station, stalls, machiya, buddha, stage, stairs, bigTorii, train, boat } from '../buildings';

/** Kamakura: os morros em três lados, o mar ao sul, os templos zen ao norte, o Buda a oeste */
const spec: SceneSpec = {
  center: { lat: 35.3235, lng: 139.545 },
  scale: 0.28,
  size: { w: 1100, d: 820 },
  terrain: (x, z) => {
    // vale central aberto para o mar (sul = +z); morros ao norte, leste e oeste
    const hills = Math.max(
      peak(x, z, -80, -320, 90, 260), peak(x, z, 200, -300, 80, 220), peak(x, z, 380, -60, 70, 180),
      peak(x, z, -420, -120, 85, 200), peak(x, z, -300, 40, 60, 150), peak(x, z, 320, 160, 40, 120), peak(x, z, -160, -160, 45, 120),
    );
    const sea = 1 - smooth(300, 380, z); // o mar começa ao sul
    return -6 + (12 + hills + noise(x, z, 1.5)) * sea;
  },
  sea: { level: 0 },
  flats: [{ at: 'daibutsu', r: 40, edge: 20 }, { at: 'hachimangu', r: 40, edge: 14 }, { at: 'engakuji', r: 30 }, { at: 'kenchoji', r: 34 }, { at: 'hasedera', r: 26, edge: 14 }, { at: 'zeniarai', r: 22, edge: 10 }],
  paths: [
    { through: ['kita-kamakura', 'engakuji', 'kenchoji', 'hachimangu', 'komachi', 'estacao'], width: 5 },
    { through: ['estacao', { x: -180, z: 150 }, 'daibutsu', 'hasedera', 'yuigahama'], width: 5 },
    { through: ['estacao', { x: -120, z: 60 }, 'zeniarai'], width: 4 },
    { through: ['hachimangu', { x: 0, z: 240 }], width: 10 }, // Wakamiya-ōji, a avenida até o mar
  ],
  forest: { count: 3400, kinds: ['broad', 'cedar', 'pine', 'maple'], pathGap: 8, allow: (x, z, y) => y > 14 || (y > 8 && Math.abs(Math.sin(x * 0.7 + z * 1.3)) > 0.6) },
  build: ({ root, H, P, quality, addInstanced }) => {
    const G = (id: string, yaw = 0, dx = 0, dz = 0) => group(root, P[id].x + dx, H(P[id].x + dx, P[id].z + dz), P[id].z + dz, yaw, 1.7);
    // linha JR Yokosuka: de Kita-Kamakura à estação, e a Enoden para o oeste
    const rail = (a: { x: number; z: number }, b: { x: number; z: number }) => {
      const dir = Math.atan2(b.x - a.x, b.z - a.z), len = Math.hypot(b.x - a.x, b.z - a.z);
      const g = group(root, (a.x + b.x) / 2, 0, (a.z + b.z) / 2, dir);
      for (const dx of [-1.6, 1.6]) { const r = add(g, box(0.4, 0.3, len), MAT.rail, dx, 0, 0, false); r.position.y = 0; }
      return g;
    };
    const kk = P['kita-kamakura'], es = P.estacao;
    const mid = { x: (kk.x + es.x) / 2 - 20, z: (kk.z + es.z) / 2 };
    for (const [a, b] of [[kk, mid], [mid, es], [es, { x: P.hasedera.x, z: P.hasedera.z + 30 }], [{ x: P.hasedera.x, z: P.hasedera.z + 30 }, { x: -540, z: P.hasedera.z + 40 }]] as [{ x: number; z: number }, { x: number; z: number }][]) {
      const g = rail(a, b);
      // eleva os trilhos ao terreno em cada trecho (aproximação: altura média)
      g.position.y = (H(a.x, a.z) + H(b.x, b.z)) / 2 + 0.3;
    }
    station(G('kita-kamakura', Math.PI / 2), { railLen: 40 });
    station(G('estacao', Math.PI / 2, 0, 0), { railLen: 40, modern: true });
    train(group(root, P.hasedera.x - 40, H(P.hasedera.x - 40, P.hasedera.z + 32) + 0.3, P.hasedera.z + 32, Math.PI / 2), { cars: 2, color: 0x2f6f3f, tram: true });
    // Engaku-ji: portão Sanmon de dois andares e o salão, subindo o morro
    const en = G('engakuji', Math.PI / 2 + 0.2);
    gate1(group(en, 0, 0, 30), { w: 14, d: 8, h: 8, white: true });
    hall(group(en, 0, 0, -6), { bays: 5, depthBays: 3, bay: 3.6, two: false });
    stairs(group(en, 0, 0, 52), 8, 10);
    // Kenchō-ji: o mais antigo mosteiro zen, com o portão, o salão e os juníperos
    const ke = G('kenchoji', -Math.PI / 2 + 0.3);
    gate1(group(ke, 0, 0, 34), { w: 16, d: 9, h: 9 });
    hall(group(ke, 0, 0, -4), { bays: 6, depthBays: 3, bay: 3.6, two: true });
    // Hachimangū: a avenida com o torii, a escadaria de 61 degraus e o salão vermelho no alto
    const hm = G('hachimangu', 0);
    bigTorii(root, P.hachimangu.x, H(P.hachimangu.x, P.hachimangu.z + 70), P.hachimangu.z + 70, 0, 12, 14);
    bigTorii(root, P.hachimangu.x, H(P.hachimangu.x, P.hachimangu.z + 200), P.hachimangu.z + 200, 0, 10, 12);
    const st = group(hm, 0, 0, 30); stairs(st, 12, 18, 0.5, 0.9);
    const up = group(hm, 0, 9, -8);
    hall(up, { bays: 5, depthBays: 3, bay: 3.6, two: false, lanterns: false });
    shrine(group(hm, -30, 0, 36, 0), 8);
    add(hm, new THREE.CircleGeometry(20, 24), MAT.water, 40, 0.2, 40, false).rotation.x = -Math.PI / 2;
    for (let i = 0; i < 6; i++) for (const s of [-1, 1]) lantern(root, P.hachimangu.x + s * 8, H(P.hachimangu.x, P.hachimangu.z + 90 + i * 18), P.hachimangu.z + 90 + i * 18, 2.4);
    // Komachi-dōri: lojas e cafés
    stalls(root, H, P.komachi, { x: P.komachi.x - 10, z: P.komachi.z - 70 }, 10, 6);
    for (let i = 0; i < 8; i++) for (const s of [-1, 1]) machiya(group(root, P.komachi.x + s * 12 - i * 1.4, H(P.komachi.x, P.komachi.z - i * 9), P.komachi.z - i * 9, s > 0 ? -Math.PI / 2 : Math.PI / 2), { w: 6, d: 7, noren: [0xd94c3d, 0x3b6fb6, 0xe8b830][i % 3] });
    // o Grande Buda, no pátio do Kōtoku-in
    const db = G('daibutsu', 0);
    buddha(db, 1.1);
    add(db, box(60, 0.4, 44), MAT.stone, 0, 0.2, 10, false);
    gate1(group(db, 0, 0, 36, 0), { w: 10, d: 6, h: 6 });
    for (const s of [-1, 1]) lantern(db, s * 10, 0.4, 14, 2.6);
    // Hase-dera: salão no palco com vista para o mar
    const hs = G('hasedera', Math.PI, 0, 0);
    stage(group(hs, 0, -8, 4), 26, 14, 9);
    hall(group(hs, 0, 1.5, 0), { bays: 5, depthBays: 2, bay: 3.6, two: false, lanterns: false });
    stairs(group(hs, 20, -8, 30, Math.PI), 6, 14);
    // Yuigahama: a praia, com barcos e guarda-sóis
    for (let i = 0; i < 5; i++) boat(group(root, P.yuigahama.x - 60 + i * 30, 0.2, P.yuigahama.z + 40 + (i % 2) * 20, 0.4 * i), { len: 8, color: [0xffffff, 0x3b6fb6, 0xd94c3d][i % 3] });
    for (let i = 0; i < 8; i++) { const x = P.yuigahama.x - 100 + i * 28, z = P.yuigahama.z - 6; add(root, cyl(0.06, 0.06, 2.6, 5), MAT.white, x, H(x, z) + 1.3, z, false); add(root, new THREE.ConeGeometry(2.2, 0.8, 8), i % 2 ? MAT.awning : MAT.awning2, x, H(x, z) + 2.7, z, false); }
    // Zeniarai Benten: o túnel na rocha, o vale fechado e os torii em fila
    const zb = G('zeniarai', 0);
    add(zb, box(6, 6, 14), MAT.stoneDark, 0, 3, 24);
    add(zb, box(3.4, 4, 14.2), MAT.black, 0, 2, 24, false);
    shrine(group(zb, 0, 0, -6), 7);
    add(zb, box(8, 3, 6), MAT.stoneDark, -12, 1.5, -4); add(zb, box(4, 2.4, 4), MAT.black, -12, 1.2, -1, false); // a gruta da água
    const zt: THREE.Matrix4[] = [];
    const tmp = new THREE.Object3D();
    for (let i = 0; i < 14; i++) { tmp.position.set(P.zeniarai.x, H(P.zeniarai.x, P.zeniarai.z) + 0, P.zeniarai.z + 8 + i * 1.1); tmp.rotation.set(0, 0, 0); tmp.updateMatrix(); zt.push(tmp.matrix.clone()); }
    addInstanced(instances(toriiGeometry(2.6, 3.6, 0.16), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.6 }), zt, quality === 'alta'));
    void alongPath;
  },
  camera: (P, H) => ({
    pos: new THREE.Vector3(P.estacao.x + 40, 380, P.estacao.z + 640),
    target: new THREE.Vector3(P.hachimangu.x - 40, H(P.estacao.x, P.estacao.z) + 10, P.hachimangu.z + 40),
  }),
  markerLift: 24,
};
export default spec;
