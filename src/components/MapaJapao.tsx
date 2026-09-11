'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, Map as MapIcon, Box, BookOpen, CalendarDays, Gauge, MapPin, TrainFront, Clock, Coins, Maximize2 } from 'lucide-react';
import { LUGARES, DIA_LUGARES, rotaDaViagem, lugarPorId, trechoEntre, type Trecho } from '@/lib/three/japao/lugares';
import { ALL_DAYS } from '@/data/days';
import { TRIP } from '@/data/trip';
import { dayCover } from '@/lib/covers';
import { has3D } from '@/lib/three/available';

type Qualidade = 'alta' | 'leve';

interface Motor {
  irPara: (lugarId: string | null, dist?: number) => void;
  /** volta ao enquadramento inicial, com o arco inteiro na tela */
  verTudo: () => void;
  /** acende o anel de miniaturas de uma cidade (só um por vez) */
  mostrarAnel: (lugarId: string | null) => void;
  /** acende a linha e leva o trem até este ponto da rota, animando */
  acenderAte: (indiceRota: number, animar: boolean) => void;
  dispose: () => void;
}

/** o que a viagem é hoje, para o balão "vocês estão aqui" */
function hojeNaViagem(): { tipo: 'antes'; dias: number } | { tipo: 'durante'; indice: number } | { tipo: 'depois' } {
  const hoje = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tokyo' }).format(new Date());
  const i = ALL_DAYS.findIndex((d) => d.date === hoje);
  if (i >= 0) return { tipo: 'durante', indice: i };
  if (hoje < TRIP.start) {
    const dias = Math.ceil((new Date(`${TRIP.start}T00:00:00+09:00`).getTime() - Date.now()) / 86_400_000);
    return { tipo: 'antes', dias };
  }
  return { tipo: 'depois' };
}

const DIAS = ALL_DAYS.map((d) => d.id);
const ROTA = rotaDaViagem(DIAS);

const dataCurta = (iso: string) =>
  new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', timeZone: 'Asia/Tokyo' }).format(
    new Date(`${iso}T12:00:00+09:00`),
  );

/** o índice na rota onde a viagem está no fim do dia escolhido */
function indiceNoFimDoDia(dayIndex: number): number {
  const ate = DIAS.slice(0, dayIndex + 1);
  return Math.max(0, rotaDaViagem(ate).length - 1);
}

/** dias que acontecem num lugar */
const diasDoLugar = (lugarId: string) =>
  ALL_DAYS.filter((d) => (DIA_LUGARES[d.id] ?? []).includes(lugarId));

/**
 * O Japão inteiro num diorama 3D: cada cidade da viagem vira o seu marco
 * (o torii de Miyajima, a garça de Himeji, o pagode de Kyoto), a linha
 * vermelha é o caminho, e a régua de baixo percorre os 16 dias.
 */
export function MapaJapao() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const motorRef = useRef<Motor | null>(null);
  const [qualidade, setQualidade] = useState<Qualidade>('alta');
  const [lugarSel, setLugarSel] = useState<string | null>(null);
  const [trechoSel, setTrechoSel] = useState<{ trecho: Trecho; de: string; para: string } | null>(null);
  const lugarSelRef = useRef<string | null>(null);
  const router = useRouter();
  const [dia, setDia] = useState<number>(DIAS.length - 1);
  const [estado, setEstado] = useState<'carregando' | 'pronto' | 'erro'>('carregando');
  const [erro, setErro] = useState('');

  // a régua começa no dia de hoje, se a viagem estiver acontecendo
  useEffect(() => {
    const hoje = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tokyo' }).format(new Date());
    const i = ALL_DAYS.findIndex((d) => d.date === hoje);
    if (i >= 0) setDia(i);
  }, []);

  useEffect(() => {
    let vivo = true;
    const canvas = canvasRef.current;
    if (!canvas) return;

    (async () => {
      try {
        const [THREE, { OrbitControls }, { construirMapaJapao, proj, ALTURA_TERRA }] = await Promise.all([
          import('three'),
          import('three/examples/jsm/controls/OrbitControls.js'),
          import('@/lib/three/japao/cena'),
        ]);
        if (!vivo) return;

        const leve = qualidade === 'leve';
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: !leve, alpha: true, powerPreference: 'high-performance' });
        renderer.setPixelRatio(leve ? 1 : Math.min(devicePixelRatio, 2));
        renderer.shadowMap.enabled = !leve;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;

        const scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0xa9bed1, 1300, 3000);
        const camera = new THREE.PerspectiveCamera(40, 1, 1, 4000);
        const controls = new OrbitControls(camera, canvas);
        controls.enableDamping = true;
        controls.maxPolarAngle = Math.PI / 2 - 0.06;
        // a banda útil de zoom: mais perto que isto vira close de maquete,
        // e o anel de miniaturas da cidade deixa de caber na tela
        controls.minDistance = 210;
        controls.maxDistance = 1500;

        scene.add(new THREE.HemisphereLight(0xdfe9f5, 0x54513f, 0.85));
        const sol = new THREE.DirectionalLight(0xfff2dd, 1.5);
        sol.position.set(-420, 640, 420);
        sol.castShadow = !leve;
        sol.shadow.mapSize.set(2048, 2048);
        const sc = sol.shadow.camera;
        sc.left = -700; sc.right = 700; sc.top = 700; sc.bottom = -700; sc.near = 100; sc.far = 1800;
        sol.shadow.bias = -0.0008;
        scene.add(sol);

        const mapa = construirMapaJapao(scene, ROTA, leve);
        if (typeof window !== 'undefined' && location.search.includes('debug')) {
          (window as unknown as { __mj: unknown }).__mj = { mapa, camera, scene };
        }
        const { placa } = await import('@/lib/three/japao/cena');

        // o balão de hoje: onde a viagem está, ou quanto falta
        const hoje = hojeNaViagem();
        if (hoje.tipo !== 'depois') {
          const lugarHoje = hoje.tipo === 'durante'
            ? (DIA_LUGARES[DIAS[hoje.indice]] ?? ['tokyo']).slice(-1)[0]
            : 'tokyo';
          const p = mapa.posicoes[lugarHoje];
          const texto = hoje.tipo === 'durante'
            ? `Vocês estão aqui · dia ${hoje.indice + 1} de ${DIAS.length}`
            : `Faltam ${hoje.dias} dias`;
          const sub = hoje.tipo === 'durante'
            ? new Intl.DateTimeFormat('pt-BR', { timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit' }).format(new Date()) + ' no Japão'
            : 'até o pouso em Haneda';
          const balao = placa(texto, sub, { cor: 'rgba(194,64,42,0.95)', texto: '#ffffff' });
          balao.position.set(p.x, ALTURA_TERRA + 62, p.z);
          balao.scale.set(60, 18.7, 1);
          balao.renderOrder = 11;
          balao.userData.lugarId = lugarHoje;
          balao.userData.balaoHoje = true;
          scene.add(balao);
          mapa.placas['__hoje'] = balao;
        }

        // anel pulsante no lugar selecionado
        const anel = new THREE.Mesh(
          new THREE.RingGeometry(13, 16, 40),
          new THREE.MeshBasicMaterial({ color: 0xc2402a, transparent: true, opacity: 0.9, side: THREE.DoubleSide }),
        );
        anel.rotation.x = -Math.PI / 2;
        anel.visible = false;
        scene.add(anel);

        // câmera inicial: o arco inteiro da viagem, na diagonal da tela,
        // olhando de sudeste — assim Hiroshima fica no alto e Tóquio embaixo
        let alvoCam: { pos: InstanceType<typeof THREE.Vector3>; tgt: InstanceType<typeof THREE.Vector3> } | null = null;
        // enquanto ninguém mexeu na câmera, todo redimensionamento reenquadra
        let interagiu = false;
        controls.addEventListener('start', () => { interagiu = true; });

        const pontosRota = ROTA.map((id) => mapa.posicoes[id]).filter(Boolean);
        const caixaRota = new THREE.Box3();
        for (const p of pontosRota) {
          caixaRota.expandByPoint(p.clone().setY(p.y + 34)); // as placas ficam acima
          caixaRota.expandByPoint(p);
        }
        const centro = caixaRota.getCenter(new THREE.Vector3());
        const cantos = [
          caixaRota.min.clone(),
          caixaRota.max.clone(),
          ...pontosRota.map((p) => p.clone().setY(p.y + 34)),
          ...pontosRota,
        ];

        /**
         * Enquadra o arco inteiro. O alvo é fixo no centro do percurso e só
         * a distância varia, achada por busca binária: é impossível divergir.
         * A faixa útil exclui o quarto de baixo, onde fica a régua dos dias.
         */
        const alvoBase = new THREE.Vector3(centro.x, ALTURA_TERRA + 10, centro.z);
        const porDistancia = (d: number) => {
          camera.position.set(alvoBase.x + d * 0.5, d * 0.62, alvoBase.z + d * 0.6);
          camera.lookAt(alvoBase);
          camera.updateMatrixWorld();
        };
        const cabe = (d: number) => {
          porDistancia(d);
          for (const c of cantos) {
            const v = c.clone().project(camera);
            if (Math.abs(v.x) > 0.78 || v.y > 0.86 || v.y < -0.5) return false;
          }
          return true;
        };
        const enquadrar = () => {
          const r = canvas.getBoundingClientRect();
          camera.aspect = r.width / Math.max(1, r.height);
          camera.updateProjectionMatrix();
          controls.target.copy(alvoBase);
          let lo = 200;
          let hi = 2400;
          if (!cabe(hi)) { porDistancia(hi); return; }
          for (let i = 0; i < 22; i++) {
            const meio = (lo + hi) / 2;
            if (cabe(meio)) hi = meio;
            else lo = meio;
          }
          porDistancia(hi);
        };

        const irPara = (id: string | null, dist = 150) => {
          if (!id) { anel.visible = false; return; }
          interagiu = true;
          const p = mapa.posicoes[id];
          if (!p) return;
          anel.position.set(p.x, ALTURA_TERRA + 0.6, p.z);
          anel.visible = true;
          alvoCam = {
            // o alvo desce um pouco no mundo para o marco subir na tela,
            // acima da ficha que abre embaixo
            tgt: new THREE.Vector3(p.x, ALTURA_TERRA + 8, p.z + dist * 0.18),
            pos: new THREE.Vector3(p.x + dist * 0.5, dist * 0.66, p.z + dist * 0.62 + dist * 0.18),
          };
        };

        // o trem anda pela curva: fração atual, fração alvo, e o passo por quadro
        let fTrem = -1;
        let fAlvo = 0;
        const posicionarTrem = (f: number) => {
          const c = mapa.curva;
          if (!c) return;
          const u = Math.max(0, Math.min(1, f));
          const p = c.getPointAt(u);
          const tg = c.getTangentAt(Math.min(0.999, Math.max(0.001, u)));
          // sobre o tubo, não dentro dele
          // acima do tubo e dos marcos vizinhos, para não se confundir com eles
          mapa.trem.position.set(p.x, p.y + 5.5, p.z);
          mapa.trem.lookAt(p.x + tg.x, p.y + 5.5 + tg.y, p.z + tg.z);
          mapa.trem.visible = true;
          const t = mapa.tuboPercorrido;
          if (t) {
            // o tubo é dividido por parâmetro; a fração u é de comprimento
            const par = c.getUtoTmapping(u, u * c.getLength());
            const segs = Math.max(1, Math.round(par * mapa.segmentosTubo));
            t.geometry.setDrawRange(0, segs * mapa.radiaisTubo * 6);
          }
        };
        const acenderAte = (i: number, animar: boolean) => {
          const f = mapa.fracoes[Math.max(0, Math.min(i, mapa.fracoes.length - 1))] ?? 1;
          fAlvo = f;
          if (!animar || fTrem < 0) {
            fTrem = f;
            posicionarTrem(f);
          }
        };

        /**
         * O anel de miniaturas de uma cidade só por vez, com raio proporcional
         * à distância da câmera: assim ele ocupa sempre a mesma fatia da tela
         * e não se confunde com a cidade vizinha.
         */
        let anelAtivo: string | null = null;
        /** a cidade cujo anel está aceso agora, para o nome dela não sumir */
        let cidadeEmFoco: string | null = null;
        const mostrarAnel = (id: string | null) => { anelAtivo = id; };
        /**
         * O anel aparece por zoom: aproximar de uma cidade revela os mapas
         * ilustrados dela. Escolher a cidade na ficha também acende, mas o
         * caminho normal é chegar perto — que é o que se espera de um mapa.
         */
        const atualizarAneis = () => {
          let escolhido = anelAtivo;
          if (!escolhido) {
            let melhorD = Infinity;
            for (const id of Object.keys(mapa.aneis)) {
              const d = camera.position.distanceTo(mapa.posicoes[id]);
              const dAlvo = controls.target.distanceTo(mapa.posicoes[id]);
              if (d < 420 && dAlvo < melhorD) { melhorD = dAlvo; escolhido = id; }
            }
          }
          cidadeEmFoco = null;
          for (const [id, anel] of Object.entries(mapa.aneis)) {
            if (id !== escolhido) { anel.visible = false; continue; }
            anel.visible = camera.position.distanceTo(mapa.posicoes[id]) < 700;
            if (anel.visible) cidadeEmFoco = id;
          }
        };

        // toque nos marcos
        const ray = new THREE.Raycaster();
        const ndc = new THREE.Vector2();
        let dedo: { x: number; y: number } | null = null;
        const onDown = (e: PointerEvent) => { dedo = { x: e.clientX, y: e.clientY }; };
        const onUp = (e: PointerEvent) => {
          if (!dedo) return;
          const andou = Math.hypot(e.clientX - dedo.x, e.clientY - dedo.y);
          dedo = null;
          if (andou > 8) return;
          const r = canvas.getBoundingClientRect();
          ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
          ray.setFromCamera(ndc, camera);
          // 1) miniatura de um mapa ilustrado: é o alvo mais específico
          const aneisVisiveis = Object.values(mapa.aneis).filter((a) => a.visible);
          if (aneisVisiveis.length) {
            const alvosMini = aneisVisiveis.flatMap((a) => a.children.filter((c) => !(c as import('three').Sprite).isSprite || visiveis.has(c as import('three').Sprite)));
            const hm = ray.intersectObjects(alvosMini, true)[0];
            if (hm) {
              let o: import('three').Object3D | null = hm.object;
              while (o && !o.userData.mapaId) o = o.parent;
              if (o?.userData.mapaId) { router.push(`/lugar/${o.userData.mapaId as string}`); return; }
            }
          }

          // 2) a linha da viagem, medida na tela com tolerância curta: ela é
          // fina, então encostar nela só acontece de propósito
          if (mapa.curva) {
            const px = e.clientX - r.left;
            const py = e.clientY - r.top;
            const amostras = mapa.curva.getSpacedPoints(500);
            let melhor = -1;
            let md = 16 * 16;
            amostras.forEach((q, i) => {
              const v = q.clone().project(camera);
              if (v.z > 1) return;
              const sx = ((v.x + 1) / 2) * r.width;
              const sy = ((1 - v.y) / 2) * r.height;
              const dd = (sx - px) ** 2 + (sy - py) ** 2;
              if (dd < md) { md = dd; melhor = i; }
            });
            if (melhor >= 0) {
              const f = melhor / 500;
              let i = 0;
              while (i < mapa.fracoes.length - 1 && mapa.fracoes[i + 1] < f) i++;
              const de = ROTA[i];
              const para = ROTA[i + 1];
              const trecho = de && para ? trechoEntre(de, para) : undefined;
              if (trecho) { setLugarSel(null); setTrechoSel({ trecho, de, para }); return; }
            }
          }

          // 3) o marco ou a placa da cidade — placas escondidas pela
          // sobreposição não recebem toque: só vale o que está na tela
          const placasVisiveis = Object.values(mapa.placas).filter((sp) => visiveis.has(sp));
          const alvos = [...Object.values(mapa.marcos), ...placasVisiveis];
          const hit = ray.intersectObjects(alvos, true)[0];
          if (!hit) return;
          let o: import('three').Object3D | null = hit.object;
          while (o && !o.userData.lugarId) o = o.parent;
          if (o?.userData.lugarId) { setTrechoSel(null); setLugarSel(o.userData.lugarId as string); }
        };
        canvas.addEventListener('pointerdown', onDown);
        canvas.addEventListener('pointerup', onUp);

        // enquanto ninguém mexeu na câmera, todo redimensionamento reenquadra:
        // é o que garante o arco inteiro na tela seja qual for o aparelho
        const redimensionar = () => {
          const r = canvas.getBoundingClientRect();
          renderer.setSize(r.width, r.height, false);
          camera.aspect = r.width / Math.max(1, r.height);
          camera.updateProjectionMatrix();
          if (!interagiu && !alvoCam) enquadrar();
        };
        redimensionar();
        const ro = new ResizeObserver(redimensionar);
        ro.observe(canvas);

        /**
         * Rótulos com prioridade e sem sobreposição: a cada quadro cada placa
         * vira um retângulo em pixels; quem chega primeiro na ordem de
         * importância fica, quem colide some. É por isso que aproximar revela
         * mais nomes: os retângulos afastam-se e param de brigar.
         */
        const ASPECTO_PLACA = 512 / 160;
        const IMPORTANCIA = ['tokyo', 'kyoto', 'hiroshima', 'osaka', 'nara', 'miyajima', 'himeji', 'kamakura', 'kurashiki'];
        type Rot = { sp: import('three').Sprite; tipo: 'cidade' | 'mini' | 'paisagem'; id: string; prio: number; px: number };
        const rotulos: Rot[] = [];
        for (const [id, sp] of Object.entries(mapa.placas)) {
          if (id === '__hoje') continue;
          const i = IMPORTANCIA.indexOf(id);
          rotulos.push({ sp, tipo: 'cidade', id, prio: 10 + (i < 0 ? 50 : i), px: 30 });
        }
        for (const sp of mapa.placasMini) {
          rotulos.push({ sp, tipo: 'mini', id: (sp.userData.mapaId as string) ?? '', prio: 5, px: 20 });
        }
        for (const sp of mapa.rotulosPaisagem) {
          rotulos.push({ sp, tipo: 'paisagem', id: '', prio: 200, px: 22 });
        }
        const balaoHoje = mapa.placas['__hoje'];

        /** ids visíveis neste quadro: só eles respondem ao toque */
        const visiveis = new Set<import('three').Sprite>();

        const v3 = new THREE.Vector3();
        const mundo = new THREE.Vector3();
        const posicionarRotulos = () => {
          const r = canvas.getBoundingClientRect();
          if (!r.height) return;
          const k = (2 * Math.tan((camera.fov * Math.PI) / 360)) / r.height;
          const dCamAlvo = camera.position.distanceTo(controls.target);
          visiveis.clear();
          const ocupados: { x0: number; y0: number; x1: number; y1: number }[] = [];

          // o balão de hoje tem lugar cativo, é o primeiro a ocupar
          if (balaoHoje) {
            balaoHoje.getWorldPosition(mundo);
            const d = camera.position.distanceTo(mundo);
            const alt = 26 * k * d;
            balaoHoje.scale.set(alt * (512 / 160), alt, 1);
            v3.copy(mundo).project(camera);
            if (v3.z <= 1) {
              const cx = ((v3.x + 1) / 2) * r.width;
              const cy = ((1 - v3.y) / 2) * r.height;
              const w = 26 * ASPECTO_PLACA;
              ocupados.push({ x0: cx - w / 2, y0: cy - 13, x1: cx + w / 2, y1: cy + 13 });
            }
          }

          const prioridade = (r: Rot) => {
            if (r.id && r.id === lugarSelRef.current) return -100;
            if (r.tipo === 'cidade' && r.id === cidadeEmFoco) return -90;
            return r.prio;
          };
          // longe, as placas se desencontram na vertical para caberem lado a
          // lado; perto, voltam para cima do próprio marco
          const fator = Math.min(1, Math.max(0, (dCamAlvo - 260) / 320));
          for (const r of rotulos) {
            if (r.tipo !== 'cidade') continue;
            const yb = r.sp.userData.yBase as number | undefined;
            if (yb === undefined) continue;
            r.sp.position.y = yb + ((r.sp.userData.yOffset as number) ?? 0) * fator;
          }

          // o trem reserva o próprio espaço: nenhum rótulo escreve por cima dele
          if (mapa.trem.visible) {
            v3.copy(mapa.trem.position).project(camera);
            if (v3.z <= 1) {
              const cx = ((v3.x + 1) / 2) * r.width;
              const cy = ((1 - v3.y) / 2) * r.height;
              ocupados.push({ x0: cx - 26, y0: cy - 18, x1: cx + 26, y1: cy + 18 });
            }
          }

          const ordenados = [...rotulos].sort((a, b) => prioridade(a) - prioridade(b));

          for (const rot of ordenados) {
            const { sp, tipo, px } = rot;
            // miniaturas só contam quando o anel delas está aceso
            if (tipo === 'mini' && (!sp.parent || !sp.parent.visible)) { sp.visible = false; continue; }
            // as placas das miniaturas são filhas do anel: vale a posição no
            // mundo, não a local, senão elas são projetadas no meio do mar
            sp.getWorldPosition(mundo);
            const d = camera.position.distanceTo(mundo);
            const alt = px * k * d;
            sp.scale.set(alt * ASPECTO_PLACA, alt, 1);
            v3.copy(mundo).project(camera);
            if (v3.z > 1) { sp.visible = false; continue; }
            const cx = ((v3.x + 1) / 2) * r.width;
            const cy = ((1 - v3.y) / 2) * r.height;
            const w = px * ASPECTO_PLACA;
            const h = px;
            // fora da tela (ou atrás da régua) não ocupa lugar
            if (cx < -w || cx > r.width + w || cy < -h || cy > r.height * 0.82) { sp.visible = false; continue; }
            const cai = { x0: cx - w / 2, y0: cy - h / 2, x1: cx + w / 2, y1: cy + h / 2 };
            const bate = ocupados.some((o) => cai.x0 < o.x1 && cai.x1 > o.x0 && cai.y0 < o.y1 && cai.y1 > o.y0);
            if (bate) { sp.visible = false; continue; }
            ocupados.push(cai);
            sp.visible = true;
            visiveis.add(sp);
          }
        };

        /** o trem tem comprimento constante na tela: ~46 px, perto ou longe */
        const ajustarTrem = () => {
          if (!mapa.trem.visible) return;
          const r = canvas.getBoundingClientRect();
          if (!r.height) return;
          const k = (2 * Math.tan((camera.fov * Math.PI) / 360)) / r.height;
          const dc = camera.position.distanceTo(mapa.trem.position);
          mapa.trem.scale.setScalar(Math.min(4.2, Math.max(0.9, (46 * k * dc) / 21)));
        };

        let raf = 0;
        let t = 0;
        const laco = () => {
          raf = requestAnimationFrame(laco);
          t += 0.016;
          atualizarAneis();
          posicionarRotulos();
          ajustarTrem();
          if (fTrem >= 0 && Math.abs(fAlvo - fTrem) > 0.0005) {
            fTrem += (fAlvo - fTrem) * 0.06;
            if (Math.abs(fAlvo - fTrem) < 0.0005) fTrem = fAlvo;
            posicionarTrem(fTrem);
          }
          if (alvoCam) {
            camera.position.lerp(alvoCam.pos, 0.07);
            controls.target.lerp(alvoCam.tgt, 0.07);
            if (camera.position.distanceTo(alvoCam.pos) < 2) alvoCam = null;
          }
          if (anel.visible) {
            const s = 1 + Math.sin(t * 2.4) * 0.12;
            anel.scale.set(s, s, s);
            (anel.material as InstanceType<typeof THREE.MeshBasicMaterial>).opacity = 0.55 + Math.sin(t * 2.4) * 0.3;
          }
          controls.update();
          renderer.render(scene, camera);
        };
        laco();

        motorRef.current = {
          irPara,
          verTudo: () => {
            anel.visible = false;
            anelAtivo = null;
            alvoCam = null;
            enquadrar();
          },
          mostrarAnel,
          acenderAte,
          dispose: () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            canvas.removeEventListener('pointerdown', onDown);
            canvas.removeEventListener('pointerup', onUp);
            controls.dispose();
            renderer.dispose();
            scene.traverse((o) => {
              const m = o as InstanceType<typeof THREE.Mesh>;
              if (m.geometry) m.geometry.dispose();
            });
          },
        };
        setEstado('pronto');
      } catch (e) {
        setErro(e instanceof Error ? e.message : 'falhou');
        setEstado('erro');
      }
    })();

    return () => {
      vivo = false;
      motorRef.current?.dispose();
      motorRef.current = null;
    };
  }, [qualidade]);

  // a régua de dias acende a linha; a câmera só voa depois do primeiro quadro,
  // para a abertura ser o país inteiro e não um close
  const jaVoou = useRef(false);
  useEffect(() => {
    if (estado !== 'pronto') return;
    // a régua acende a linha e leva o trem; a câmera fica onde vocês deixaram
    motorRef.current?.acenderAte(indiceNoFimDoDia(dia), jaVoou.current);
    jaVoou.current = true;
  }, [dia, estado]);

  useEffect(() => {
    if (estado !== 'pronto') return;
    motorRef.current?.mostrarAnel(lugarSel);
    if (lugarSel) motorRef.current?.irPara(lugarSel, 240);
  }, [lugarSel, estado]);

  useEffect(() => { lugarSelRef.current = lugarSel; }, [lugarSel]);

  const lugar = lugarSel ? lugarPorId(lugarSel) : undefined;
  const diaAtual = ALL_DAYS[dia];

  return (
    <div className="relative -mx-4 -mt-3" style={{ height: 'calc(100dvh - 64px)' }}>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,#cfe0ee 0%,#e8eef3 55%,#dfe6ea 100%)' }} />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full touch-none" />

      {estado === 'carregando' && (
        <p className="absolute inset-x-0 top-1/2 text-center font-mono text-[12px] text-rail">montando o Japão…</p>
      )}
      {estado === 'erro' && (
        <p className="absolute inset-x-0 top-1/2 px-6 text-center text-[13px] text-accent">Não deu para montar o mapa 3D ({erro}).</p>
      )}

      {/* topo: título e qualidade */}
      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
        <div className="rounded-2xl bg-white/80 px-3 py-2 backdrop-blur">
          <p className="font-jp text-[10px] tracking-[0.3em] text-rail/70">日本一周</p>
          <p className="text-[14px] font-bold leading-tight text-rail">A viagem inteira</p>
          <p className="text-[11px] leading-tight text-rail/70">{LUGARES.length} lugares · {ALL_DAYS.length} dias</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button
            type="button"
            onClick={() => setQualidade((q) => (q === 'alta' ? 'leve' : 'alta'))}
            className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1.5 font-mono text-[11px] font-semibold text-rail backdrop-blur"
          >
            <Gauge size={12} /> {qualidade}
          </button>
          <button
            type="button"
            onClick={() => { setLugarSel(null); setTrechoSel(null); motorRef.current?.verTudo(); }}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-[12px] font-semibold text-rail backdrop-blur"
          >
            <Maximize2 size={13} /> Japão inteiro
          </button>
        </div>
      </div>

      {/* régua dos dias */}
      {!lugar && !trechoSel && (
        <div className="absolute inset-x-0 bottom-0 p-3">
          <div className="rounded-2xl bg-white/85 p-3 backdrop-blur">
            <p className="mb-2 text-[11px] leading-snug text-rail/60">
              Aproxime uma cidade para ver os lugares dela. Toque na linha para ver o trem do trecho.
            </p>
            <div className="flex items-baseline justify-between">
              <p className="font-mono text-[10.5px] uppercase tracking-widest text-rail/60">
                Dia {dia + 1} de {ALL_DAYS.length} · {dataCurta(diaAtual.date)}
              </p>
              <span className="font-mono text-[10.5px] text-rail/60">
                {(DIA_LUGARES[diaAtual.id] ?? []).map((l) => lugarPorId(l)?.nome).join(' → ')}
              </span>
            </div>
            <p className="mt-0.5 truncate text-[13.5px] font-semibold text-rail">{diaAtual.title}</p>
            <input
              type="range"
              min={0}
              max={ALL_DAYS.length - 1}
              value={dia}
              onChange={(e) => setDia(Number(e.target.value))}
              className="mt-2 w-full accent-[var(--accent)]"
              aria-label="dia da viagem"
            />
            <div className="mt-1 flex justify-between font-mono text-[9.5px] text-rail/50">
              <span>18 nov</span>
              <span>3 dez</span>
            </div>
            <Link
              href={`/roteiro/${diaAtual.id}`}
              className="mt-2 flex items-center justify-center gap-1.5 rounded-xl bg-rail py-2.5 text-[13px] font-semibold text-white"
            >
              <CalendarDays size={14} /> Abrir o dia {dataCurta(diaAtual.date)}
            </Link>
          </div>
        </div>
      )}

      {/* ficha do trecho de trem */}
      {trechoSel && !lugar && (
        <div className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-surface p-4 shadow-2xl">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-mono text-[10.5px] uppercase tracking-widest text-muted">
                {lugarPorId(trechoSel.de)?.nome} → {lugarPorId(trechoSel.para)?.nome}
              </p>
              <h2 className="mt-0.5 flex items-center gap-2 text-[18px] font-bold leading-tight">
                <TrainFront size={18} className="text-accent" /> {trechoSel.trecho.trem}
              </h2>
            </div>
            <button type="button" onClick={() => setTrechoSel(null)} className="shrink-0 rounded-full bg-surface-2 p-2" aria-label="fechar">
              <X size={16} />
            </button>
          </div>
          <div className="mt-3 flex gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1.5 font-mono text-[13px] font-semibold"><Clock size={13} /> {trechoSel.trecho.duracao}</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1.5 font-mono text-[13px] font-semibold"><Coins size={13} /> {trechoSel.trecho.custo}</span>
          </div>
          {trechoSel.trecho.nota && <p className="mt-2.5 text-[13.5px] leading-relaxed text-muted">{trechoSel.trecho.nota}</p>}
        </div>
      )}

      {/* ficha do lugar */}
      {lugar && (
        <div className="absolute inset-x-0 bottom-0 max-h-[68%] overflow-y-auto rounded-t-3xl bg-surface p-4 shadow-2xl">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-jp text-[13px] tracking-[0.25em] text-muted">{lugar.jp}</p>
              <h2 className="text-[22px] font-bold leading-tight">{lugar.nome}</h2>
            </div>
            <button
              type="button"
              onClick={() => setLugarSel(null)}
              className="shrink-0 rounded-full bg-surface-2 p-2"
              aria-label="fechar"
            >
              <X size={16} />
            </button>
          </div>

          <p className="mt-2 text-[14px] leading-relaxed">{lugar.resumo}</p>

          <p className="mt-3 flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-widest text-muted">
            <MapPin size={12} /> {diasDoLugar(lugar.id).length === 1 ? 'O dia aqui' : 'Os dias aqui'}
          </p>
          <div className="mt-1.5 space-y-1.5">
            {diasDoLugar(lugar.id).map((d) => {
              const capa = dayCover(d);
              return (
                <Link
                  key={d.id}
                  href={`/roteiro/${d.id}`}
                  className="flex items-center gap-3 rounded-2xl border border-hairline bg-surface-2/60 p-2 active:bg-surface-2"
                >
                  {capa && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={capa.src} alt="" loading="lazy" className="h-12 w-12 shrink-0 rounded-xl object-cover" />
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block font-mono text-[10.5px] uppercase tracking-wider text-muted">
                      {dataCurta(d.date)}
                    </span>
                    <span className="block truncate text-[13.5px] font-semibold leading-snug">{d.title}</span>
                  </span>
                </Link>
              );
            })}
          </div>

          {lugar.mapas && lugar.mapas.length > 0 && (
            <>
              <p className="mt-3 flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-widest text-muted">
                <MapIcon size={12} /> {lugar.mapas.length === 1 ? 'O mapa ilustrado' : `Os ${lugar.mapas.length} mapas ilustrados`}
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {lugar.mapas.map((m) => (
                  <span key={m.id} className="inline-flex overflow-hidden rounded-full border border-hairline bg-surface text-[12.5px] font-semibold">
                    <Link href={`/lugar/${m.id}`} className="px-3 py-1.5 active:bg-surface-2">{m.nome}</Link>
                    {has3D(m.id) && (
                      <Link href={`/3d/${m.id}`} className="border-l border-hairline px-2.5 py-1.5 text-accent active:bg-surface-2" aria-label={`${m.nome} em 3D`}>
                        <Box size={13} />
                      </Link>
                    )}
                  </span>
                ))}
              </div>
            </>
          )}

          <div className="mt-3 grid grid-cols-2 gap-2">
            {lugar.historiaId && (
              <Link
                href={`/mais/historia/${lugar.historiaId}`}
                className="col-span-2 flex items-center justify-center gap-1.5 rounded-xl border border-hairline bg-surface py-2.5 text-[13px] font-semibold"
              >
                <BookOpen size={14} /> A história de {lugar.nome}
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
