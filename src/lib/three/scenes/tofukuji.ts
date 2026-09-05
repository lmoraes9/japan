import * as THREE from 'three';
import type { SceneSpec } from '../engine';
import { noise, smooth } from '../engine';
import { MAT, add, box, cyl } from '../parts';
import { group, hall, gate1, shrine, station, machiya, bridge, wall, rockGarden, train } from '../buildings';

/** Tōfuku-ji: o vale de bordos cortando o recinto, as três pontes cobertas, o Sanmon e os jardins do Hōjō */
const spec: SceneSpec = {
  center: { lat: 34.977, lng: 135.7742 },
  scale: 1.0,
  size: { w: 760, d: 700 },
  terrain: (x, z) => {
    // o recinto sobe suavemente para leste; o vale Sengyokukan corta de oeste a leste
    const v = valley(x, z);
    return 24 + 10 * smooth(-200, 260, x) + noise(x, z, 0.8) - 11 * v;
  },
  flats: [{ at: 'hojo', r: 38, edge: 12 }, { at: 'sanmon', r: 30, edge: 10 }, { at: 'komyoin', r: 22, edge: 10 }, { at: 'kaisando', r: 24, edge: 10 }],
  ground: (x, z) => (valley(x, z) > 0.5 ? [0.48, 0.42, 0.28] : x < -180 ? [0.7, 0.68, 0.64] : [0.5, 0.62, 0.36]),
  paths: [
    { through: ['estacao', { x: -170, z: -40 }, 'gaunkyo', 'sanmon', 'hojo', 'tsutenkyo', 'kaisando'], width: 5 },
    { through: ['kaisando', 'engetsukyo'], width: 3 },
    { through: ['sanmon', 'komyoin'], width: 3 },
  ],
  forest: { count: 2600, kinds: ['maple', 'maple', 'maple', 'broad', 'cedar'], pathGap: 6, allow: (x, z, y, P) => (valley(x, z) > 0.2 && Math.abs(Math.sin(x * 1.7 + z * 0.9)) > 0.2) || (x > 240 && z < 0) || (valley(x, z) < 0.2 && x > -180 && Math.hypot(x - P.hojo.x, z - P.hojo.z) > 60 && Math.hypot(x - P.sanmon.x, z - P.sanmon.z) > 60 && Math.abs(Math.sin(x * 0.9 + z * 1.3)) > 0.75) },
  build: ({ root, H, P, rng }) => {
    const G = (id: string, yaw = 0, dx = 0, dz = 0) => group(root, P[id].x + dx, H(P[id].x + dx, P[id].z + dz), P[id].z + dz, yaw);
    // estação e trilhos (JR Nara Line + Keihan, lado a lado)
    station(G('estacao', 0), { railLen: 500 });
    train(group(root, P.estacao.x - 14, H(P.estacao.x, P.estacao.z) + 0.3, P.estacao.z + 60), { cars: 3, color: 0x2f5f3f });
    for (let i = 0; i < 10; i++) for (const s of [-1, 1]) machiya(group(root, P.estacao.x + 30 + s * 8, H(P.estacao.x + 30, P.estacao.z - 20 - i * 12), P.estacao.z - 20 - i * 12, s > 0 ? -Math.PI / 2 : Math.PI / 2), { w: 7, d: 8 });
    // as três pontes cobertas sobre o vale
    const cov = (id: string, yaw: number, len: number) => {
      const p = P[id];
      const y = 24 + 10 * smooth(-200, 260, p.x) + 1.2;
      const a = new THREE.Vector3(p.x - Math.sin(yaw) * len / 2, y, p.z - Math.cos(yaw) * len / 2);
      const b = new THREE.Vector3(p.x + Math.sin(yaw) * len / 2, y, p.z + Math.cos(yaw) * len / 2);
      bridge(root, a, b, { kind: 'covered', width: 4 });
    };
    cov('gaunkyo', 0.3, 44);
    cov('tsutenkyo', 0.2, 100);
    cov('engetsukyo', 0.2, 40);
    // Sanmon: o portão de dois andares mais antigo do zen, e o Zendō ao lado
    gate1(G('sanmon', 0), { w: 24, d: 12, h: 12 });
    hall(group(root, P.sanmon.x - 60, H(P.sanmon.x - 60, P.sanmon.z - 10), P.sanmon.z - 10, Math.PI / 2), { bays: 6, depthBays: 3, bay: 3.6, two: false, lanterns: false });
    hall(group(root, P.sanmon.x, H(P.sanmon.x, P.sanmon.z - 60), P.sanmon.z - 60, 0), { bays: 7, depthBays: 4, bay: 4, two: true, lanterns: false }); // o Hondō
    // Hōjō: o salão do abade e os quatro jardins de Shigemori, com o xadrez de musgo
    const hj = G('hojo', 0);
    hall(group(hj, 0, 0, 0), { bays: 6, depthBays: 3, bay: 3.6, two: false, lanterns: false });
    rockGarden(group(hj, 0, 0, 30), 34, 12);
    const moss = new THREE.MeshStandardMaterial({ color: 0x5d7a3a, roughness: 1 });
    for (let i = 0; i < 8; i++) for (let j = 0; j < 6; j++) if ((i + j) % 2 === 0 && rng() < 0.85 - i * 0.08) add(hj, box(2.6, 0.3, 2.6), moss, -20 + i * 2.9, 0.2, -28 - j * 2.9, false);
    for (let i = 0; i < 8; i++) for (let j = 0; j < 6; j++) if ((i + j) % 2 === 1) add(hj, box(2.6, 0.25, 2.6), MAT.stone, -20 + i * 2.9, 0.2, -28 - j * 2.9, false);
    for (let i = 0; i < 7; i++) add(hj, cyl(0.6, 0.6, 1.2 + (i % 3) * 0.6, 10), MAT.stoneDark, 26 + (i % 4) * 2.6, 0.6, -6 + Math.floor(i / 4) * 3 + (i % 2) * 1.5); // a Ursa Maior em cilindros de pedra
    wall(root, new THREE.Vector3(P.hojo.x - 30, H(P.hojo.x - 30, P.hojo.z + 44), P.hojo.z + 44), new THREE.Vector3(P.hojo.x + 30, H(P.hojo.x + 30, P.hojo.z + 44), P.hojo.z + 44), 2.4);
    // Kaisandō: o salão do fundador com o jardim dividido ao meio
    const kd = G('kaisando', 0);
    hall(group(kd, 0, 0, 0), { bays: 4, depthBays: 2, bay: 3.6, two: true, lanterns: false });
    add(kd, box(18, 0.3, 10), new THREE.MeshStandardMaterial({ color: 0xd9d2c0, roughness: 1 }), -10, 0.15, 18, false);
    add(kd, new THREE.CircleGeometry(6, 20), MAT.water, 10, 0.2, 18, false).rotation.x = -Math.PI / 2;
    // Kōmyō-in: o jardim de pedras em pé, raios saindo do centro
    const km = G('komyoin', Math.PI);
    machiya(group(km, 0, 0, -8), { w: 12, d: 8 });
    add(km, new THREE.CircleGeometry(14, 24), moss, 0, 0.2, 10, false).rotation.x = -Math.PI / 2;
    for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2; const r = add(km, box(0.6, 1.2 + (i % 3) * 0.6, 1.6), MAT.stoneDark, Math.cos(a) * (4 + (i % 3) * 3), 0.7, 10 + Math.sin(a) * (4 + (i % 3) * 3)); r.rotation.y = -a; }
    // subtemplos murados espalhados pelo recinto
    for (const [dx, dz] of [[-120, 60], [60, 120], [140, 90], [-80, -140], [200, -140]]) {
      const x = P.sanmon.x + dx, z = P.sanmon.z + dz;
      if (valley(x, z) > 0.3) continue;
      shrine(group(root, x, H(x, z), z, rng() * 6), 8);
      wall(root, new THREE.Vector3(x - 18, H(x - 18, z + 16), z + 16), new THREE.Vector3(x + 18, H(x + 18, z + 16), z + 16), 2.2);
    }
  },
  camera: (P, H) => ({
    pos: new THREE.Vector3(P.sanmon.x - 60, 230, P.sanmon.z + 300),
    target: new THREE.Vector3(P.tsutenkyo.x, H(P.tsutenkyo.x, P.tsutenkyo.z) + 6, P.tsutenkyo.z - 10),
  }),
  markerLift: 22,
};

/** 0 fora do vale, 1 no fundo: uma faixa ondulada que atravessa o recinto de oeste a leste */
function valley(x: number, z: number) {
  const cz = -60 + 40 * Math.sin(x / 120) + 18 * Math.cos(x / 47);
  const d = Math.abs(z - cz);
  const w = 26 + 8 * Math.sin(x / 70);
  return (1 - smooth(w * 0.4, w, d)) * smooth(-260, -200, x);
}
export default spec;
