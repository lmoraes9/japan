import * as THREE from 'three';
import type { SceneSpec } from '../engine';
import { noise } from '../engine';
import { MAT, add, box, cyl } from '../parts';
import { group, tower, machiya, bridge, domeRuin, cenotaph, childrenMonument, flame, stalls, train } from '../buildings';

/** a ilha do parque, entre o Honkawa e o Motoyasu */
const island = (x: number, z: number) => x > -175 + (z + 260) * 0.03 && x < -30 - (z + 260) * 0.02 && z > -250 && z < 380;

/** Parque da Paz: a ilha entre os dois rios, o Domo do outro lado da água, o museu sobre pilotis e a Ponte Aioi em T */
const spec: SceneSpec = {
  center: { lat: 34.3945, lng: 132.4545 },
  scale: 1.0,
  size: { w: 1000, d: 760 },
  terrain: (x, z) => 8 + noise(x, z, 0.3),
  // Motoyasu (leste da ilha) e Honkawa (oeste), que se juntam ao norte na Aioi
  rivers: [
    { through: [{ x: -110, z: -420 }, { x: -125, z: -240 }, { x: -60, z: -100 }, { x: -20, z: 100 }, { x: -10, z: 400 }], width: 46, depth: 4 },
    { through: [{ x: -110, z: -420 }, { x: -140, z: -200 }, { x: -170, z: 0 }, { x: -190, z: 400 }], width: 40, depth: 4 },
  ],
  ground: (x, z) => (island(x, z) ? [0.5, 0.62, 0.36] : [0.68, 0.67, 0.63]),
  paths: [
    { through: ['museu', 'cenotafio', 'chama', 'criancas', 'aioi'], width: 10 },
    { through: ['criancas', 'sino', 'monte', 'rest-house'], width: 4 },
    { through: [{ x: -300, z: 250 }, { x: 300, z: 250 }], width: 16, kind: 'asphalt' },
    { through: [{ x: 330, z: -300 }, 'okonomimura', { x: 330, z: 300 }], width: 10, kind: 'asphalt' },
  ],
  forest: { count: 500, kinds: ['broad', 'pine', 'cherry', 'willow'], pathGap: 8, allow: (x, z, y, P) => island(x, z) && !['cenotafio', 'chama', 'museu', 'criancas', 'sino', 'monte'].some((id) => Math.hypot(x - P[id].x, z - P[id].z) < 24) },
  build: ({ root, H, P, rng }) => {
    const y0 = H(0, 0);
    const G = (id: string, yaw = 0, dx = 0, dz = 0) => group(root, P[id].x + dx, y0, P[id].z + dz, yaw);
    // o museu: o bloco comprido sobre pilotis, com o eixo apontando para o cenotáfio e o Domo
    const mu = G('museu', 0);
    for (let i = 0; i < 12; i++) for (const s of [-1, 1]) add(mu, cyl(0.7, 0.7, 6, 8), MAT.stoneDark, -55 + i * 10, 3, s * 5);
    add(mu, box(120, 8, 16), new THREE.MeshStandardMaterial({ color: 0xb9b3a6, roughness: 0.9 }), 0, 10, 0);
    for (let i = 0; i < 30; i++) add(mu, box(0.3, 8, 0.3), MAT.stoneDark, -58 + i * 4, 10, 8.1, false);
    add(mu, box(40, 7, 20), new THREE.MeshStandardMaterial({ color: 0xc9c4b8, roughness: 0.9 }), -90, 3.5, 0);
    add(mu, box(40, 7, 20), new THREE.MeshStandardMaterial({ color: 0xc9c4b8, roughness: 0.9 }), 90, 3.5, 0);
    cenotaph(G('cenotafio', Math.PI / 2));
    add(root, new THREE.CircleGeometry(30, 32), MAT.water, P.chama.x, y0 + 0.1, P.chama.z - 18, false).rotation.x = -Math.PI / 2;
    flame(G('chama', Math.PI / 2));
    childrenMonument(G('criancas'));
    // as guirlandas de tsuru de origami, em caixas de vidro ao lado do monumento
    for (let i = 0; i < 6; i++) add(root, box(2, 2.4, 1.2), new THREE.MeshStandardMaterial({ color: [0xe84c4c, 0x4c8be8, 0xf1c40f, 0x2ecc71][i % 4], roughness: 0.4, transparent: true, opacity: 0.85 }), P.criancas.x + 14, y0 + 1.2, P.criancas.z - 10 + i * 4, false);
    // o Sino da Paz, no pavilhão sobre o lago de lótus
    const sn = G('sino');
    add(sn, new THREE.CircleGeometry(12, 24), MAT.water, 0, 0.1, 0, false).rotation.x = -Math.PI / 2;
    for (let i = 0; i < 4; i++) { const a = (i / 4) * Math.PI * 2 + Math.PI / 4; add(sn, cyl(0.3, 0.3, 4, 8), MAT.stoneDark, Math.cos(a) * 3.5, 2, Math.sin(a) * 3.5); }
    add(sn, new THREE.SphereGeometry(5, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0x4f6a5a, metalness: 0.5, roughness: 0.5 }), 0, 4, 0);
    add(sn, cyl(1.0, 1.2, 2.2, 12), new THREE.MeshStandardMaterial({ color: 0x5a6a4a, metalness: 0.6, roughness: 0.4 }), 0, 2.4, 0);
    add(sn, cyl(0.15, 0.15, 3, 6), MAT.wood, 2.2, 2.2, 0).rotation.z = Math.PI / 2;
    // o monte memorial: a colina de grama com o pequeno pagode em cima
    const mt = G('monte');
    add(mt, new THREE.SphereGeometry(16, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0x5d7a3a, roughness: 1 }), 0, 0, 0).scale.y = 0.35;
    add(mt, box(3, 1.2, 3), MAT.stone, 0, 6.2, 0); add(mt, cyl(0.2, 0.2, 3, 6), MAT.stone, 0, 8, 0);
    // Rest House: o único prédio de antes da bomba no parque
    const rh = G('rest-house', 0);
    add(rh, box(16, 9, 12), new THREE.MeshStandardMaterial({ color: 0xd9d2c0, roughness: 0.9 }), 0, 4.5, 0);
    add(rh, box(17, 0.6, 13), MAT.stoneDark, 0, 9.3, 0);
    for (let i = 0; i < 4; i++) for (const s of [-1, 1]) add(rh, box(1.6, 2.2, 0.2), MAT.black, -6 + i * 4, 3 + s * 2, 6.05, false);
    // o Domo, do outro lado do rio Motoyasu
    domeRuin(G('domo', 0.4));
    // a Ponte Aioi, em T: o alvo
    const ai = P.aioi;
    bridge(root, new THREE.Vector3(ai.x - 90, y0 + 1.6, ai.z), new THREE.Vector3(ai.x + 80, y0 + 1.6, ai.z), { kind: 'flat', width: 10 });
    bridge(root, new THREE.Vector3(ai.x - 40, y0 + 1.6, ai.z + 2), new THREE.Vector3(ai.x - 40, y0 + 1.6, ai.z + 90), { kind: 'flat', width: 8 });
    // a ponte Motoyasu, entre o museu e o Domo
    bridge(root, new THREE.Vector3(P.cenotafio.x + 20, y0 + 1.6, P.cenotafio.z + 90), new THREE.Vector3(P.cenotafio.x + 90, y0 + 1.6, P.cenotafio.z + 90), { kind: 'flat', width: 8 });
    // barcos de passeio no rio
    for (let i = 0; i < 3; i++) { const b = group(root, -40 + i * 4, y0 - 3.4, -60 + i * 90, 0.1); add(b, box(4, 1.2, 12), MAT.white, 0, 0.6, 0); add(b, box(3.6, 1.6, 8), MAT.awning2, 0, 1.9, 0); }
    // a cidade: quadras ao redor, mais altas perto de Hondōri, com o bonde na avenida
    for (let bx = -480; bx <= 480; bx += 40) for (let bz = -360; bz <= 360; bz += 40) {
      if (bx > -230 && bx < 30 && bz > -300 && bz < 400) continue; // a ilha e os rios
      if (Math.abs(bz - 250) < 16 || (Math.abs(bx - 330) < 12)) continue;
      if (Math.hypot(bx - P.domo.x, bz - P.domo.z) < 46 || Math.hypot(bx - P.okonomimura.x, bz - P.okonomimura.z) < 30) continue;
      const h = 10 + rng() * (bz > 100 ? 40 : 24);
      tower(group(root, bx + (rng() - 0.5) * 8, y0, bz + (rng() - 0.5) * 8), 20 + rng() * 12, 18 + rng() * 10, h, { color: [0xe6e2da, 0xcfd3d8, 0xd9cfc0][Math.floor(rng() * 3)] });
    }
    // Okonomimura: o prédio com 4 andares de barracas de okonomiyaki
    const ok = G('okonomimura', 0);
    tower(ok, 22, 22, 18, { color: 0xe8d9b8 });
    for (let k = 0; k < 4; k++) add(ok, box(23, 0.4, 23), MAT.awning, 0, 4 + k * 4.2, 0, false);
    stalls(root, H, { x: P.okonomimura.x - 40, z: P.okonomimura.z + 20 }, { x: P.okonomimura.x + 40, z: P.okonomimura.z + 20 }, 5, 6, { both: false });
    train(group(root, -60, y0 + 0.3, 250, Math.PI / 2), { cars: 2, color: 0x3b8f3b, tram: true });
    for (const dx of [-1.6, 1.6]) add(root, box(700, 0.2, 0.4), MAT.rail, 0, y0 + 0.3, 250 + dx, false);
    for (let i = 0; i < 12; i++) machiya(group(root, -300 + i * 24, y0, -420, 0, 1.4), { w: 12, d: 10 });
  },
  camera: (P) => ({
    pos: new THREE.Vector3(P.museu.x - 120, 240, P.museu.z + 330),
    target: new THREE.Vector3(P.cenotafio.x, 12, P.cenotafio.z - 40),
  }),
  markerLift: 22,
};
export default spec;
