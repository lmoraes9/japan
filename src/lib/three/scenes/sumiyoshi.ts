import * as THREE from 'three';
import type { SceneSpec } from '../engine';
import { noise } from '../engine';
import { MAT, add, box, cyl, lantern, toriiGeometry } from '../parts';
import { group, shrine, station, machiya, bridge, bigTorii, train, fence, stalls } from '../buildings';

/** Sumiyoshi Taisha: a ponte arqueada, o torii de pilares quadrados, os quatro salões de telhado reto e o bonde na porta */
const spec: SceneSpec = {
  center: { lat: 34.6112, lng: 135.4932 },
  scale: 1.5,
  size: { w: 760, d: 700 },
  terrain: (x, z) => 12 + noise(x, z, 0.3),
  ponds: [{ at: 'sorihashi', rx: 30, rz: 44, depth: 2 }],
  ground: (x, z) => (x > -100 && x < 260 && z > -180 && z < 240 ? [0.78, 0.74, 0.66] : [0.68, 0.67, 0.63]),
  paths: [
    { through: ['estacao', 'bonde', { x: -90, z: 0 }, 'sorihashi', 'torii', 'honden'], width: 12 },
    { through: ['honden', 'goshogozen', 'nankun', 'omokaru'], width: 6 },
    { through: [{ x: -80, z: -340 }, { x: -80, z: 340 }], width: 10, kind: 'asphalt' },
  ],
  forest: { count: 500, kinds: ['pine', 'broad', 'cedar'], pathGap: 10, allow: (x, z, y, P) => x > -90 && x < 260 && z > -180 && z < 240 && !['honden', 'sorihashi', 'goshogozen', 'nankun', 'torii'].some((id) => Math.hypot(x - P[id].x, z - P[id].z) < 34) },
  build: ({ root, H, P, rng }) => {
    const y0 = H(0, 0);
    const G = (id: string, yaw = 0, dx = 0, dz = 0) => group(root, P[id].x + dx, y0, P[id].z + dz, yaw);
    // a estação Nankai, elevada, e a linha do bonde Hankai na rua
    station(G('estacao', 0, 0, 0), { railLen: 500, modern: true });
    for (const dx of [-1.6, 1.6]) add(root, box(0.4, 0.3, 680), MAT.rail, -80 + dx, y0 + 0.3, 0, false);
    train(G('bonde', 0, -0, 30), { cars: 1, color: 0x2f7a4a, tram: true });
    // o muro do recinto e o torii de pedra da entrada
    for (const [x1, z1, x2, z2] of [[-90, -180, 260, -180], [260, -180, 260, 240], [260, 240, -90, 240], [-90, 240, -90, 30], [-90, -30, -90, -180]] as [number, number, number, number][]) {
      const g = group(root, (x1 + x2) / 2, y0, (z1 + z2) / 2, Math.atan2(x2 - x1, z2 - z1));
      const len = Math.hypot(x2 - x1, z2 - z1);
      add(g, box(1, 2.2, len), MAT.stone, 0, 1.1, 0, false);
    }
    bigTorii(root, -92, y0, 0, Math.PI / 2, 9, 11, MAT.stone);
    // a ponte arqueada (Sorihashi) sobre o lago
    const sb = P.sorihashi;
    bridge(root, new THREE.Vector3(sb.x - 26, y0 + 0.4, sb.z), new THREE.Vector3(sb.x + 26, y0 + 0.4, sb.z), { kind: 'arch', width: 5 });
    // o torii de pilares quadrados
    const tq = G('torii', Math.PI / 2);
    for (const s of [-1, 1]) add(tq, box(1.2, 8, 1.2), MAT.stone, 0, 4, s * 4);
    add(tq, box(1.4, 0.8, 11), MAT.stone, 0, 8.4, 0); add(tq, box(1.0, 0.6, 9.4), MAT.stone, 0, 6.8, 0);
    // os quatro salões: três em fila e o quarto ao lado, todos de telhado reto olhando para o oeste
    const hn = P.honden;
    for (const [i, [dx, dz]] of ([[0, 0], [34, 0], [68, 0], [0, 34]] as [number, number][]).entries()) {
      const g = group(root, hn.x + dx, y0, hn.z + dz, -Math.PI / 2);
      shrine(g, 11, { straight: true });
      fence(root, new THREE.Vector3(hn.x + dx - 12, y0, hn.z + dz - 12), new THREE.Vector3(hn.x + dx + 12, y0, hn.z + dz - 12), 1.6);
      fence(root, new THREE.Vector3(hn.x + dx - 12, y0, hn.z + dz + 12), new THREE.Vector3(hn.x + dx + 12, y0, hn.z + dz + 12), 1.6);
      void i;
    }
    // o Goshogozen: o cercado de pedra com o cascalho e as pedrinhas
    const gs = G('goshogozen');
    add(gs, box(10, 0.4, 10), new THREE.MeshStandardMaterial({ color: 0xd9d2c0, roughness: 1 }), 0, 0.2, 0, false);
    for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; add(gs, box(0.4, 1.2, 0.4), MAT.stoneDark, Math.cos(a) * 5.5, 0.6, Math.sin(a) * 5.5, false); }
    add(gs, box(1.2, 2.2, 0.8), MAT.stoneDark, 0, 1.1, 0);
    for (let i = 0; i < 30; i++) add(gs, new THREE.SphereGeometry(0.16, 5, 4), i % 10 === 0 ? MAT.vermilion : MAT.stone, (rng() - 0.5) * 8, 0.45, (rng() - 0.5) * 8, false);
    // Nankun-sha: a cânfora de mil anos e as prateleiras de gatos
    const nk = G('nankun', 0);
    shrine(nk, 7);
    const trunk = add(nk, cyl(1.6, 2.4, 9, 10), MAT.wood, -14, 4.5, -4);
    trunk.castShadow = true;
    const crown = add(nk, new THREE.SphereGeometry(11, 10, 7), new THREE.MeshStandardMaterial({ color: 0x4c6f33, roughness: 1 }), -14, 12, -4); crown.scale.y = 0.7;
    add(nk, cyl(0.15, 0.15, 6, 5), new THREE.MeshStandardMaterial({ color: 0xd8c9a0 }), -14, 5.5, -4).rotation.x = Math.PI / 2; // a corda sagrada
    for (let r = 0; r < 3; r++) for (let c = 0; c < 10; c++) add(nk, new THREE.SphereGeometry(0.26, 6, 5), MAT.white, -8 + c * 1.1, 1.0 + r * 0.9, 8, false);
    for (let r = 0; r < 3; r++) add(nk, box(12, 0.12, 1), MAT.wood, -3, 0.7 + r * 0.9, 8, false);
    // Ōtoshi-sha e a omokaru-ishi
    const om = G('omokaru', 0);
    shrine(om, 6);
    add(om, box(3, 1, 1.2), MAT.stone, 5, 0.5, 6);
    for (let k = 0; k < 3; k++) add(om, new THREE.SphereGeometry(0.4, 8, 6), MAT.stoneDark, 4 + k, 1.3, 6);
    // lanternas de pedra ao longo do eixo e o bairro em volta
    for (let i = 0; i < 6; i++) for (const s of [-1, 1]) lantern(root, -60 + i * 22, y0, s * 10, 2.6);
    stalls(root, H, { x: -60, z: -30 }, { x: 40, z: -30 }, 5, 0, { both: false });
    for (let bx = -360; bx <= 360; bx += 34) for (let bz = -330; bz <= 330; bz += 34) {
      if (bx > -110 && bx < 280 && bz > -200 && bz < 260) continue;
      if (Math.abs(bx + 80) < 14) continue;
      if (Math.hypot(bx - P.estacao.x, bz - P.estacao.z) < 40) continue;
      machiya(group(root, bx + (rng() - 0.5) * 6, y0, bz + (rng() - 0.5) * 6, rng() * 0.2), { w: 9 + rng() * 6, d: 9, dark: rng() < 0.3 });
    }
  },
  camera: (P) => ({
    pos: new THREE.Vector3(P.estacao.x - 120, 200, P.estacao.z + 300),
    target: new THREE.Vector3(P.torii.x, 16, P.torii.z),
  }),
  markerLift: 22,
};
export default spec;
