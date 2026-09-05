import * as THREE from 'three';
import type { SceneSpec } from '../engine';
import { noise } from '../engine';
import { MAT, add, box, cyl, lantern, roof } from '../parts';
import { group, hall, gate1, gate2, pagoda, shrine, stalls, machiya, tower, spire, wall, bigTorii } from '../buildings';

/** Sensō-ji: o eixo Kaminarimon → Nakamise → Hōzōmon → Hondō, com o pagode, o bairro em volta e a Skytree ao longe */
const spec: SceneSpec = {
  center: { lat: 35.713, lng: 139.796 },
  scale: 1.0,
  size: { w: 760, d: 720 },
  terrain: (x, z) => 10 + noise(x, z, 0.5),
  ground: (x, z) => {
    // recinto do templo calçado; resto da cidade em cinza quente
    const inside = Math.abs(x + 20) < 110 && z > -230 && z < 210;
    return inside ? [0.78, 0.74, 0.66] : [0.66, 0.65, 0.62];
  },
  paths: [
    { through: ['kaminarimon', 'nakamise', 'hozomon', 'jokoro', 'omikuji', 'hondo'], width: 12 },
    { through: ['hondo', 'asakusa-jinja', 'nitenmon'], width: 6 },
    { through: ['hozomon', 'pagode'], width: 5 },
    { through: [{ x: -60, z: 40 }, 'hoppy', { x: -230, z: -30 }], width: 8, kind: 'asphalt' },
    { through: [{ x: -330, z: 250 }, 'kaminarimon', { x: 330, z: 250 }], width: 14, kind: 'asphalt' },
  ],
  forest: { count: 260, kinds: ['broad', 'pine', 'cherry'], allow: (x, z) => Math.abs(x + 20) < 130 && z > -250 && z < -20 && !(Math.abs(x + 20) < 30 && z > -200) },
  build: ({ root, H, P, rng }) => {
    const G = (id: string, yaw = 0, dx = 0, dz = 0) => group(root, P[id].x + dx, H(P[id].x + dx, P[id].z + dz), P[id].z + dz, yaw);
    // o portão do trovão com a lanterna gigante
    gate2(G('kaminarimon'), { w: 16, d: 8, lanternBig: true });
    // Nakamise: 90 lojas em fila, dos dois lados
    stalls(root, H, P.kaminarimon, P.hozomon, 22, 8);
    for (let i = 0; i < 12; i++) for (const s of [-1, 1]) machiya(group(root, P.nakamise.x + s * 20, H(0, 0), P.kaminarimon.z - 20 - i * 22, s > 0 ? -Math.PI / 2 : Math.PI / 2), { w: 8, d: 9, noren: i % 2 ? 0xd94c3d : 0x3b6fb6 });
    gate2(G('hozomon'), { w: 24, d: 12 });
    // muro do recinto
    const y0 = H(0, 0);
    wall(root, new THREE.Vector3(-130, y0, P.hozomon.z + 10), new THREE.Vector3(-130, y0, -240), 2.6);
    wall(root, new THREE.Vector3(90, y0, P.hozomon.z + 10), new THREE.Vector3(90, y0, -240), 2.6);
    wall(root, new THREE.Vector3(-130, y0, -240), new THREE.Vector3(90, y0, -240), 2.6);
    pagoda(G('pagode'), 5, 11);
    // Jōkōrō: o incensário
    const jk = G('jokoro');
    add(jk, cyl(3.2, 3.2, 2.4, 16), MAT.black, 0, 1.2, 0);
    add(jk, cyl(3.6, 3.6, 0.3, 16), MAT.black, 0, 2.55, 0);
    const jr = group(jk, 0, 2.7, 0); roof(jr, { W: 9, D: 9, H: 2.2, L: 1, lift: 0.5, y: 0, ridge: false, rafters: false, thickness: 0.2 });
    for (let i = 0; i < 4; i++) { const a = (i / 4) * Math.PI * 2 + Math.PI / 4; add(jk, cyl(0.2, 0.2, 2.7, 6), MAT.black, Math.cos(a) * 3.4, 1.35, Math.sin(a) * 3.4); }
    // as gavetas de omikuji: uma fileira de balcões
    const om = G('omikuji', 0, 0, 0);
    for (let i = 0; i < 6; i++) { add(om, box(3, 2.2, 1.2), MAT.wood, -8 + i * 3.2, 1.1, 0); add(om, box(3.2, 0.2, 1.6), MAT.vermilion, -8 + i * 3.2, 2.3, 0); }
    hall(G('hondo'), { bays: 7, depthBays: 4, bay: 4.6, two: true });
    // lanternas ao longo do eixo
    for (let i = 0; i < 6; i++) for (const s of [-1, 1]) lantern(root, P.hozomon.x + s * 12, H(0, 0), P.hozomon.z - 20 - i * 14, 2.8);
    shrine(G('asakusa-jinja', 0), 11, { torii: true });
    gate1(G('nitenmon', Math.PI / 2), { w: 12, d: 7 });
    // Hoppy Street: a rua dos botecos
    const hp = P.hoppy;
    for (let i = 0; i < 9; i++) for (const s of [-1, 1]) machiya(group(root, hp.x - 40 + i * 10 + (s > 0 ? 0 : 0), H(0, 0), hp.z + s * 9, s > 0 ? Math.PI : 0), { w: 8, d: 7, dark: true, noren: [0xd94c3d, 0xe8b830, 0x3b6fb6][i % 3] });
    for (let i = 0; i < 9; i++) for (const s of [-1, 1]) add(root, box(4, 0.15, 2.4), MAT.awning, hp.x - 40 + i * 10, H(0, 0) + 3.2, hp.z + s * 5.2, false);
    // o bairro: quadras de prédios baixos e médios em volta do recinto
    const blocks: [number, number, number, number, number][] = [];
    for (let bx = -340; bx <= 340; bx += 44) for (let bz = -330; bz <= 330; bz += 44) {
      if (Math.abs(bx + 20) < 150 && bz > -260 && bz < 236) continue; // o templo
      if (Math.abs(bz - 250) < 14) continue; // a avenida
      if (Math.hypot(bx - hp.x, bz - hp.z) < 60) continue;
      const h = 8 + rng() * (Math.hypot(bx, bz) > 260 ? 34 : 18);
      blocks.push([bx + (rng() - 0.5) * 8, bz + (rng() - 0.5) * 8, 18 + rng() * 14, 16 + rng() * 12, h]);
    }
    for (const [x, z, w, d, h] of blocks) tower(group(root, x, H(x, z), z, (rng() - 0.5) * 0.1), w, d, h, { color: [0xe6e2da, 0xcfd3d8, 0xd9cfc0, 0xbfc6cc][Math.floor(rng() * 4)] });
    // a Skytree, no horizonte a leste
    spire(group(root, 350, H(350, 40), 40), 200, 9);
    // um torii pequeno do outro lado da rua: a estação de Asakusa fica ali
    bigTorii(root, -80, H(-80, 300), 300, 0, 5, 7);
  },
  camera: (P, H) => ({
    pos: new THREE.Vector3(P.kaminarimon.x - 150, 190, P.kaminarimon.z + 260),
    target: new THREE.Vector3(P.hozomon.x, H(0, 0) + 10, P.hozomon.z - 20),
  }),
  fog: { color: 0xd9dfe6, near: 450, far: 1300 },
  markerLift: 22,
};
export default spec;
