'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { X, Map as MapIcon, Box, BookOpen, CalendarDays, Gauge, MapPin } from 'lucide-react';
import { LUGARES, DIA_LUGARES, rotaDaViagem, lugarPorId } from '@/lib/three/japao/lugares';
import { ALL_DAYS } from '@/data/days';
import { dayCover } from '@/lib/covers';
import { has3D } from '@/lib/three/available';

type Qualidade = 'alta' | 'leve';

interface Motor {
  irPara: (lugarId: string | null, dist?: number) => void;
  acenderAte: (indiceRota: number) => void;
  dispose: () => void;
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
        controls.minDistance = 60;
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

        const acenderAte = (i: number) => {
          const t = mapa.tuboPercorrido;
          if (!t) return;
          const f = mapa.fracoes[Math.max(0, Math.min(i, mapa.fracoes.length - 1))] ?? 1;
          const segs = Math.max(1, Math.round(f * mapa.segmentosTubo));
          t.geometry.setDrawRange(0, segs * mapa.radiaisTubo * 6);
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
          const alvos = [...Object.values(mapa.marcos), ...Object.values(mapa.placas)];
          const hit = ray.intersectObjects(alvos, true)[0];
          if (!hit) return;
          let o: import('three').Object3D | null = hit.object;
          while (o && !o.userData.lugarId) o = o.parent;
          if (o?.userData.lugarId) setLugarSel(o.userData.lugarId as string);
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

        // as placas ficam do mesmo tamanho na tela, perto ou longe
        const placas = Object.values(mapa.placas);
        const ASPECTO_PLACA = 512 / 160;
        /**
         * As placas crescem conforme a câmera se aproxima: na visão geral
         * são etiquetas pequenas, que não tapam o país; de perto ficam do
         * tamanho de leitura e param de crescer.
         */
        const ajustarPlacas = () => {
          const r = canvas.getBoundingClientRect();
          if (!r.height) return;
          const k = (2 * Math.tan((camera.fov * Math.PI) / 360)) / r.height;
          const dCam = camera.position.distanceTo(controls.target);
          const px = Math.min(34, Math.max(13, (34 * 300) / Math.max(1, dCam)));
          for (const sp of placas) {
            const d = camera.position.distanceTo(sp.position);
            const alt = Math.min(34, Math.max(4, px * k * d));
            sp.scale.set(alt * ASPECTO_PLACA, alt, 1);
          }
        };

        let raf = 0;
        let t = 0;
        const laco = () => {
          raf = requestAnimationFrame(laco);
          t += 0.016;
          ajustarPlacas();
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
    motorRef.current?.acenderAte(indiceNoFimDoDia(dia));
    if (!jaVoou.current) { jaVoou.current = true; return; }
    const lugares = DIA_LUGARES[DIAS[dia]] ?? [];
    const ultimo = lugares[lugares.length - 1];
    if (ultimo) motorRef.current?.irPara(ultimo, 260);
  }, [dia, estado]);

  useEffect(() => {
    if (estado === 'pronto' && lugarSel) motorRef.current?.irPara(lugarSel, 210);
  }, [lugarSel, estado]);

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
        <button
          type="button"
          onClick={() => setQualidade((q) => (q === 'alta' ? 'leve' : 'alta'))}
          className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1.5 font-mono text-[11px] font-semibold text-rail backdrop-blur"
        >
          <Gauge size={12} /> {qualidade}
        </button>
      </div>

      {/* régua dos dias */}
      {!lugar && (
        <div className="absolute inset-x-0 bottom-0 p-3">
          <div className="rounded-2xl bg-white/85 p-3 backdrop-blur">
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

          <div className="mt-3 grid grid-cols-2 gap-2">
            {lugar.placeMapId && (
              <Link
                href={`/lugar/${lugar.placeMapId}`}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-hairline bg-surface py-2.5 text-[13px] font-semibold"
              >
                <MapIcon size={14} /> Mapa ilustrado
              </Link>
            )}
            {lugar.placeMapId && has3D(lugar.placeMapId) && (
              <Link
                href={`/3d/${lugar.placeMapId}`}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-hairline bg-surface py-2.5 text-[13px] font-semibold"
              >
                <Box size={14} /> Ver em 3D
              </Link>
            )}
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
