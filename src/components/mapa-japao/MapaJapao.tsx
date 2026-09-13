'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Maximize2, Plus, Minus } from 'lucide-react';
import { DIAS_MAPA, diaPorId } from '@/lib/mapa-japao/dias';
import {
  diasDe,
  faixa,
  marcadores,
  noDoDia,
  numero,
  quemAbre,
  type Marcador,
  type No,
  type Ponto,
} from '@/lib/mapa-japao/hierarquia';
import { hojeNaViagem, type Hoje } from '@/lib/mapa-japao/hoje';
import { corDaEtapa, TRECHOS } from '@/lib/mapa-japao/rota';
import { TiraDias } from './TiraDias';

/** o tamanho da etiqueta, em pixels — é daqui que sai toda a separação */
const LARG = 168;
const ALT = 50;
/** o pé do ícone fica aqui embaixo da etiqueta */
const ACIMA = 60;
/** quantos pixels de altura um ícone ocupa, em qualquer distância */
const ICONE_PX = 48;

/** margens reservadas: título em cima, a tira dos dias embaixo, etiquetas nos lados */
const MARGEM_X = 48;
const MARGEM_TOPO = 112;
const MARGEM_BASE = 116;

/** quanto dura o voo da câmera de um lugar a outro */
const VOO_MS = 520;

interface Motor {
  pontos: () => Record<string, Ponto>;
  tela: () => { largura: number; altura: number };
  zoom: (fator: number) => void;
  /** enquadra um nó e, se ele for um grupo, aproxima o bastante para abri-lo */
  abrir: (no: No) => void;
  /** voa até um dia e aproxima só o bastante para ele aparecer sozinho */
  irParaDia: (dayId: string) => void;
  tudo: () => void;
  arrastar: (dx: number, dy: number) => void;
  mostrar: (dayIds: Set<string>) => void;
  dispose: () => void;
}

/** o dia que o mapa marca como 'aqui': o de hoje, ou o primeiro enquanto a viagem não começa */
function diaDeHoje(hoje: Hoje | null): string | null {
  if (!hoje) return null;
  if (hoje.fase === 'durante') return hoje.dayId;
  if (hoje.fase === 'antes') return DIAS_MAPA[0].dayId;
  return null;
}

/**
 * O mapa da viagem.
 *
 * Um ícone por dia, no lugar onde o dia acontece, com uma etiqueta que traz o
 * número da sequência, o nome e a data. Quando dois ícones não cabem lado a
 * lado eles aparecem como um só — 'Kansai, 25/nov – 1/dez' — e aproximar
 * desfaz o grupo: primeiro nas cidades, depois nos dias. Uma linha liga os
 * dias na ordem, com a cor de cada etapa; o dia de hoje pulsa; e a tira na
 * base leva a câmera a qualquer dia com um toque.
 */
export function MapaJapao() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const motorRef = useRef<Motor | null>(null);
  const [marcas, setMarcas] = useState<Marcador[]>([]);
  const [estado, setEstado] = useState<'carregando' | 'pronto' | 'erro'>('carregando');
  const [erro, setErro] = useState('');
  const [hoje, setHoje] = useState<Hoje | null>(null);
  const [foco, setFoco] = useState<string | null>(null);

  // a data só existe no aparelho: no servidor a página não sabe que dia é
  useEffect(() => {
    const h = hojeNaViagem();
    setHoje(h);
    setFoco(diaDeHoje(h));
  }, []);

  useEffect(() => {
    let vivo = true;
    let limpar = () => {};
    const canvas = canvasRef.current;
    if (!canvas) return;

    (async () => {
      try {
        const [THREE, { construirDiorama, ALTURA_TERRA, ALTURA_ICONE }, { construirLinha }] = await Promise.all([
          import('three'),
          import('@/lib/three/japao/diorama'),
          import('@/lib/three/japao/linha'),
        ]);
        if (!vivo) return;

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
        renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;

        const FOV = 38;
        const MEIA = (FOV * Math.PI) / 360;
        const TAN = Math.tan(MEIA);

        const scene = new THREE.Scene();
        const bruma = new THREE.Fog(0xb7c9d8, 900, 2600);
        scene.fog = bruma;
        const camera = new THREE.PerspectiveCamera(FOV, 1, 0.5, 9000);
        scene.add(new THREE.HemisphereLight(0xdfe9f5, 0x54513f, 0.9));
        const sol = new THREE.DirectionalLight(0xfff2dd, 1.45);
        sol.castShadow = true;
        sol.shadow.mapSize.set(2048, 2048);
        sol.shadow.bias = -0.0008;
        scene.add(sol);
        scene.add(sol.target);

        const d = construirDiorama(scene, DIAS_MAPA, false);

        // a linha sabe que trecho já passou: o de hoje salta, os anteriores apagam
        const agora = hojeNaViagem();
        const hojeN = (agora.fase === 'durante' && diaPorId(agora.dayId)?.n) || 0;
        const linha = construirLinha(TRECHOS, (t) => {
          if (!hojeN || t.para.n > hojeN) return 'futuro';
          return t.para.n === hojeN ? 'hoje' : 'passado';
        });

        // a camada dos ícones é desenhada num segundo passe, com a
        // profundidade zerada: um marcador nunca fica escondido atrás de uma
        // montanha, por menor que ele seja. A linha vai junto, pelo mesmo motivo.
        const cenaIcones = new THREE.Scene();
        cenaIcones.add(linha.grupo);
        cenaIcones.add(d.camada);
        cenaIcones.add(new THREE.HemisphereLight(0xdfe9f5, 0x54513f, 0.95));
        const luzIcones = new THREE.DirectionalLight(0xfff2dd, 1.5);
        cenaIcones.add(luzIcones);
        cenaIcones.add(luzIcones.target);

        /**
         * Câmera de mapa: sempre de cima, num ângulo fixo. Arrastar move o
         * alvo no plano do chão, pinçar muda a distância, e o norte continua
         * sendo o norte porque não há rotação nenhuma.
         */
        // a câmera fica exatamente ao sul do alvo: assim o norte aponta para
        // cima e o leste para a direita, e um pixel na horizontal vale sempre
        // o mesmo tanto de mundo. Uma inclinação torta faria o mapa girar e
        // com ele toda a conta de distância entre etiquetas.
        const ELEVACAO = (55 * Math.PI) / 180;
        const OBL = new THREE.Vector3(0, Math.sin(ELEVACAO), Math.cos(ELEVACAO));
        /** quanto do eixo z sobrevive à inclinação, ao ir para a tela */
        const ACHATA = Math.sin(ELEVACAO);
        const alvo = new THREE.Vector3();
        let dist = 900;
        const D_MIN = 8;
        const D_MAX = 2400;

        const aplicar = () => {
          dist = Math.max(D_MIN, Math.min(D_MAX, dist));
          camera.position.copy(alvo).addScaledVector(OBL, dist);
          camera.lookAt(alvo);
          camera.updateMatrixWorld();

          // a bruma acompanha a distância, para o ar ter sempre a mesma espessura
          bruma.near = dist * 0.75;
          bruma.far = dist * 3.1;

          // o sol e a sombra acompanham o alvo, para a sombra nunca perder resolução
          sol.target.position.copy(alvo);
          sol.position.copy(alvo).add(new THREE.Vector3(-0.38, 1.15, 0.42).multiplyScalar(dist * 1.2));
          const sc = sol.shadow.camera;
          const raio = Math.max(60, dist * 0.85);
          sc.left = -raio; sc.right = raio; sc.top = raio; sc.bottom = -raio;
          sc.near = 1; sc.far = dist * 3;
          sc.updateProjectionMatrix();
          sol.target.updateMatrixWorld();
          luzIcones.position.copy(sol.position);
          luzIcones.target.position.copy(alvo);
          luzIcones.target.updateMatrixWorld();

          // os ícones ocupam sempre os mesmos pixels: de longe não viram
          // alfinetes, de perto não viram torres
          const r = canvas.getBoundingClientRect();
          const mundoPorPx = (2 * dist * TAN) / Math.max(1, r.height);
          const fator = (ICONE_PX * mundoPorPx) / ALTURA_ICONE;
          for (const [id, g] of Object.entries(d.icones)) g.scale.setScalar((d.escalas[id] ?? 1) * fator);
          linha.escalar(mundoPorPx);
        };

        /** quanto de mundo cabe num pixel, a uma dada distância */
        const porPixel = (dd: number) => (2 * dd * TAN) / Math.max(1, canvas.getBoundingClientRect().height);

        /** centra o mapa num ponto do chão, com a margem de cima maior que a de baixo */
        const centrarEm = (x: number, z: number) => {
          alvo.set(x, ALTURA_TERRA, z);
          aplicar();
          arrastar(0, (MARGEM_TOPO - MARGEM_BASE) / 2);
        };

        const enquadrar = (dayIds: string[]) => {
          const ps = dayIds.map((id) => d.posicoes[id]).filter(Boolean);
          if (!ps.length) return;
          const caixa = new THREE.Box3();
          for (const p of ps) caixa.expandByPoint(p);
          const centro = caixa.getCenter(new THREE.Vector3());

          const r = canvas.getBoundingClientRect();
          const usavelW = Math.max(80, r.width - 2 * MARGEM_X);
          const usavelH = Math.max(80, r.height - MARGEM_TOPO - MARGEM_BASE);
          const tam = caixa.getSize(new THREE.Vector3());
          // um piso pequeno: um único lugar não deve aproximar até o infinito
          const largura = Math.max(tam.x, 1.2);
          const prof = Math.max(tam.z, 1.2) * ACHATA;
          const porX = (largura / usavelW) * r.height / (2 * TAN);
          const porZ = (prof / usavelH) * r.height / (2 * TAN);
          dist = Math.max(porX, porZ);
          centrarEm(centro.x, centro.z);
        };

        const v = new THREE.Vector3();
        const naTela = (p: import('three').Vector3) => {
          const r = canvas.getBoundingClientRect();
          v.copy(p).project(camera);
          return { x: ((v.x + 1) / 2) * r.width, y: ((1 - v.y) / 2) * r.height };
        };

        /** os filhos deste nó já cabem lado a lado, do jeito que a tela está agora? */
        const abertoNaTela = (no: No) => {
          const ps = no.filhos.map((f) => d.posicoes[f.principal.dayId]).filter(Boolean).map(naTela);
          for (let i = 0; i < ps.length; i += 1)
            for (let j = i + 1; j < ps.length; j += 1)
              if (Math.abs(ps[i].x - ps[j].x) < LARG && Math.abs(ps[i].y - ps[j].y) < ALT) return false;
          return true;
        };

        /**
         * Onde parar a câmera ao abrir um nó: no centro do grupo, se ele ainda
         * couber na tela; no lugar principal, quando não couber — como no
         * Kansai, largo demais para mostrar Himeji e Nara ao mesmo tempo de
         * perto. O resto fica a um arrasto de distância.
         */
        const ancorar = (no: No) => {
          const caixa = new THREE.Box3();
          for (const id of diasDe(no)) {
            const q = d.posicoes[id];
            if (q) caixa.expandByPoint(q);
          }
          const r = canvas.getBoundingClientRect();
          const tam = caixa.getSize(new THREE.Vector3());
          const cabe =
            tam.x <= 2 * dist * TAN * (r.width / Math.max(1, r.height)) && tam.z <= (2 * dist * TAN) / ACHATA;
          const p = cabe ? caixa.getCenter(new THREE.Vector3()) : d.posicoes[no.principal.dayId];
          if (p) centrarEm(p.x, p.z);
          else aplicar();
        };

        const arrastar = (dx: number, dy: number) => {
          const k = porPixel(dist);
          alvo.x -= dx * k;
          alvo.z -= (dy * k) / ACHATA;
          aplicar();
        };

        /**
         * A câmera não salta: ela voa. O destino é calculado do jeito de
         * sempre — as funções acima mexem no alvo e na distância e medem na
         * projeção — e depois a câmera volta para onde estava e percorre o
         * caminho em meio segundo. Como só se desenha no laço, o pulo de ida e
         * volta nunca aparece na tela.
         */
        type Pose = { x: number; z: number; dist: number };
        let voo: { t0: number; de: Pose; para: Pose } | null = null;
        const pose = (): Pose => ({ x: alvo.x, z: alvo.z, dist });
        const voar = (calcular: () => void) => {
          const de = pose();
          calcular();
          const para = pose();
          alvo.set(de.x, ALTURA_TERRA, de.z);
          dist = de.dist;
          aplicar();
          voo = { t0: performance.now(), de, para };
        };
        const passoDoVoo = (agoraMs: number) => {
          if (!voo) return;
          const t = Math.min(1, (agoraMs - voo.t0) / VOO_MS);
          const e = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
          alvo.x = voo.de.x + (voo.para.x - voo.de.x) * e;
          alvo.z = voo.de.z + (voo.para.z - voo.de.z) * e;
          // a distância anda no logaritmo, para o zoom parecer uniforme
          dist = Math.exp(Math.log(voo.de.dist) + (Math.log(voo.para.dist) - Math.log(voo.de.dist)) * e);
          aplicar();
          if (t >= 1) voo = null;
        };

        /** aproxima até os filhos do nó se separarem, sem tirar o ponto do centro */
        const abrirEmTorno = (no: No, x: number, z: number) => {
          // aproxima de pouco em pouco até o grupo se desfazer de verdade.
          // A conta de quanto bastaria erra: um lugar longe do centro da tela
          // encolhe pela perspectiva. Medir na projeção não erra.
          for (let i = 0; i < 20 && !abertoNaTela(no); i += 1) {
            if (dist <= D_MIN + 0.01) break;
            dist *= 0.86;
            centrarEm(x, z);
          }
        };

        const motor: Motor = {
          pontos: () => {
            const r = canvas.getBoundingClientRect();
            const out: Record<string, Ponto> = {};
            for (const [id, p] of Object.entries(d.posicoes)) {
              v.copy(p).project(camera);
              out[id] = { x: ((v.x + 1) / 2) * r.width, y: ((1 - v.y) / 2) * r.height, visivel: v.z <= 1 };
            }
            return out;
          },
          tela: () => {
            const r = canvas.getBoundingClientRect();
            return { largura: r.width, altura: r.height };
          },
          zoom: (f) => { voo = null; dist *= f; aplicar(); },
          abrir: (no) =>
            voar(() => {
              enquadrar(diasDe(no));
              if (no.filhos.length < 2) return;
              for (let i = 0; i < 20 && !abertoNaTela(no); i += 1) {
                if (dist <= D_MIN + 0.01) break;
                dist *= 0.86;
                ancorar(no);
              }
            }),
          irParaDia: (dayId) =>
            voar(() => {
              const folha = noDoDia(dayId);
              const p = d.posicoes[dayId];
              if (!folha || !p) return;
              // o zoom vem do grupo que precisa se abrir; o centro é o dia
              const grupo = quemAbre(folha);
              enquadrar(diasDe(grupo));
              centrarEm(p.x, p.z);
              if (grupo.filhos.length >= 2) abrirEmTorno(grupo, p.x, p.z);
            }),
          tudo: () => voar(() => enquadrar(DIAS_MAPA.map((x) => x.dayId))),
          arrastar,
          mostrar: (ids) => {
            for (const [id, g] of Object.entries(d.icones)) g.visible = ids.has(id);
          },
          dispose: () => { linha.dispose(); d.dispose(); renderer.dispose(); },
        };
        motorRef.current = motor;
        const redimensionar = () => {
          const r = canvas.getBoundingClientRect();
          if (!r.width || !r.height) return;
          renderer.setSize(r.width, r.height, false);
          camera.aspect = r.width / r.height;
          camera.updateProjectionMatrix();
          linha.redimensionar(r.width, r.height);
          aplicar();
        };
        redimensionar();
        // a primeira vista não voa: o mapa já nasce no lugar
        enquadrar(DIAS_MAPA.map((x) => x.dayId));
        const ro = new ResizeObserver(redimensionar);
        ro.observe(canvas);

        // um dedo arrasta o mapa, dois dedos pinçam
        const dedos = new Map<number, { x: number; y: number }>();
        let pinca = 0;
        const onDown = (e: PointerEvent) => {
          voo = null;
          dedos.set(e.pointerId, { x: e.clientX, y: e.clientY });
          canvas.setPointerCapture?.(e.pointerId);
        };
        const onMove = (e: PointerEvent) => {
          const ant = dedos.get(e.pointerId);
          if (!ant) return;
          dedos.set(e.pointerId, { x: e.clientX, y: e.clientY });
          const lista = [...dedos.values()];
          if (lista.length >= 2) {
            const dd = Math.hypot(lista[0].x - lista[1].x, lista[0].y - lista[1].y);
            if (pinca) motor.zoom(pinca / Math.max(1, dd));
            pinca = dd;
          } else {
            arrastar(e.clientX - ant.x, e.clientY - ant.y);
          }
        };
        const onUp = (e: PointerEvent) => {
          dedos.delete(e.pointerId);
          if (dedos.size < 2) pinca = 0;
        };
        const onWheel = (e: WheelEvent) => {
          e.preventDefault();
          motor.zoom(e.deltaY > 0 ? 1.12 : 0.89);
        };
        canvas.addEventListener('pointerdown', onDown);
        canvas.addEventListener('pointermove', onMove);
        canvas.addEventListener('pointerup', onUp);
        canvas.addEventListener('pointercancel', onUp);
        canvas.addEventListener('wheel', onWheel, { passive: false });

        let raf = 0;
        const laco = (agoraMs: number) => {
          raf = requestAnimationFrame(laco);
          passoDoVoo(agoraMs);
          renderer.render(scene, camera);
          renderer.autoClear = false;
          renderer.clearDepth();
          renderer.render(cenaIcones, camera);
          renderer.autoClear = true;
        };
        raf = requestAnimationFrame(laco);
        setEstado('pronto');

        limpar = () => {
          cancelAnimationFrame(raf);
          ro.disconnect();
          canvas.removeEventListener('pointerdown', onDown);
          canvas.removeEventListener('pointermove', onMove);
          canvas.removeEventListener('pointerup', onUp);
          canvas.removeEventListener('pointercancel', onUp);
          canvas.removeEventListener('wheel', onWheel);
          motor.dispose();
        };
      } catch (e) {
        setErro(e instanceof Error ? e.message : 'falhou');
        setEstado('erro');
      }
    })();

    return () => { vivo = false; limpar(); };
  }, []);

  // as etiquetas são recalculadas a cada quadro, a partir da projeção
  useEffect(() => {
    if (estado !== 'pronto') return;
    let raf = 0;
    let anterior = '';
    const laco = () => {
      raf = requestAnimationFrame(laco);
      const m = motorRef.current;
      if (!m) return;
      // a faixa da tira dos dias não recebe etiqueta: ela ficaria por baixo
      const tela = m.tela();
      const ms = marcadores(m.pontos(), { largura: tela.largura, altura: tela.altura - MARGEM_BASE }, LARG, ALT, ACIMA, ICONE_PX);
      // só o ícone que representa cada marcador fica aceso
      m.mostrar(new Set(ms.map((x) => x.no.principal.dayId)));
      const chave = ms.map((x) => `${x.no.id}@${Math.round(x.x)},${Math.round(x.y)},${Math.round(x.topo)}`).join('|');
      if (chave !== anterior) {
        anterior = chave;
        setMarcas(ms);
      }
    };
    raf = requestAnimationFrame(laco);
    return () => cancelAnimationFrame(raf);
  }, [estado]);

  const abrir = useCallback((no: No) => motorRef.current?.abrir(no), []);
  const escolherDia = useCallback((dayId: string) => {
    setFoco(dayId);
    motorRef.current?.irParaDia(dayId);
  }, []);

  const hojeId = diaDeHoje(hoje);
  const marcaHoje = hojeId ? marcas.find((m) => m.no.dias.some((x) => x.dayId === hojeId)) : undefined;
  const hojeN = (hoje?.fase === 'durante' && diaPorId(hoje.dayId)?.n) || 0;

  const periodo = `${DIAS_MAPA[0].data} – ${DIAS_MAPA[DIAS_MAPA.length - 1].data}`;
  let subtitulo = `${DIAS_MAPA.length} dias · ${periodo}`;
  if (hoje?.fase === 'antes') subtitulo = `faltam ${hoje.dias} ${hoje.dias === 1 ? 'dia' : 'dias'} · ${periodo}`;
  else if (hoje?.fase === 'durante') {
    const dh = diaPorId(hoje.dayId);
    if (dh) subtitulo = `dia ${dh.n} de ${DIAS_MAPA.length} · ${dh.cidade}`;
  }

  const topo = { top: 'calc(env(safe-area-inset-top) + 12px)' };

  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: 'linear-gradient(180deg,#cfe0ee 0%,#e8eef3 55%,#dfe6ea 100%)' }}>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full touch-none" />

      {estado === 'carregando' && (
        <p className="absolute inset-x-0 top-1/2 text-center font-mono text-[12px] text-rail">montando o Japão…</p>
      )}
      {estado === 'erro' && (
        <p className="absolute inset-x-0 top-1/2 px-6 text-center text-[13px] text-accent">Não deu para montar o mapa ({erro}).</p>
      )}

      {marcaHoje && <Pulso x={marcaHoje.x} y={marcaHoje.y} />}

      {marcas.map((m) => (
        <Etiqueta
          key={m.no.id}
          marca={m}
          hoje={m === marcaHoje}
          foco={!!foco && m.no.dias.some((x) => x.dayId === foco)}
          onAbrir={() => abrir(m.no)}
        />
      ))}

      {estado === 'pronto' && marcas.length === 0 && (
        <button type="button" onClick={() => motorRef.current?.tudo()}
          className="tappable absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 px-4 py-3 text-[13px] font-semibold text-rail shadow-md backdrop-blur">
          Nenhuma parada por aqui · ver o Japão inteiro
        </button>
      )}

      <div className="absolute left-3 flex items-start gap-2" style={{ ...topo, right: 68 }}>
        <Link href="/mais/mapas" aria-label="voltar aos mapas"
          className="tappable flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/85 text-rail backdrop-blur">
          <ArrowLeft size={18} />
        </Link>
        <div className="pointer-events-none min-w-0 rounded-2xl bg-white/85 px-3 py-2 backdrop-blur">
          <p className="font-jp text-[10px] tracking-[0.3em] text-rail/70">日本一周</p>
          <p className="truncate text-[15px] font-bold leading-tight text-rail">A viagem inteira</p>
          <p className="truncate text-[11px] leading-tight text-rail/70">{subtitulo}</p>
        </div>
      </div>

      <div className="absolute right-3 flex flex-col gap-2" style={topo}>
        <button type="button" onClick={() => motorRef.current?.tudo()} aria-label="Japão inteiro"
          className="tappable flex h-11 w-11 items-center justify-center rounded-full bg-white/85 text-rail backdrop-blur">
          <Maximize2 size={17} />
        </button>
        <button type="button" onClick={() => motorRef.current?.zoom(0.7)} aria-label="aproximar"
          className="tappable flex h-11 w-11 items-center justify-center rounded-full bg-white/85 text-rail backdrop-blur">
          <Plus size={19} />
        </button>
        <button type="button" onClick={() => motorRef.current?.zoom(1.42)} aria-label="afastar"
          className="tappable flex h-11 w-11 items-center justify-center rounded-full bg-white/85 text-rail backdrop-blur">
          <Minus size={19} />
        </button>
      </div>

      <TiraDias dias={DIAS_MAPA} hojeId={hojeId} passadoAte={hojeN} focoId={foco} corDe={corDaEtapa} onEscolher={escolherDia} />
    </div>
  );
}

/** o anel que pulsa em volta do ícone de hoje: 'vocês estão aqui' */
function Pulso({ x, y }: { x: number; y: number }) {
  const R = 30;
  return (
    <span aria-hidden className="pointer-events-none absolute" style={{ left: x - R, top: y - ICONE_PX / 2 - R, width: 2 * R, height: 2 * R }}>
      <span className="absolute inset-0 animate-ping rounded-full border-[3px] border-accent [animation-duration:1.8s]" />
      <span className="absolute inset-[9px] rounded-full border-2 border-accent/70" />
    </span>
  );
}

/**
 * A etiqueta: número da sequência, nome do lugar e a data. Quando ela precisou
 * subir para desviar de outra, uma haste fina a liga de volta ao seu ícone.
 */
function Etiqueta({ marca, hoje, foco, onAbrir }: { marca: Marcador; hoje: boolean; foco: boolean; onAbrir: () => void }) {
  const { no, x, y, etiquetaX, topo } = marca;
  /** um nó sem filhos não tem o que abrir: leva direto ao dia */
  const folha = no.filhos.length === 0;
  const classe = `tappable absolute flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-white/93 py-1.5 pl-1.5 pr-2.5 shadow-md backdrop-blur ${
    foco ? 'ring-2 ring-accent' : 'ring-1 ring-black/5'
  }`;
  const estilo = { left: etiquetaX, top: topo, width: LARG - 4, height: 44 };
  // a haste liga a etiqueta ao seu ícone quando ela não está bem em cima dele
  const abaixo = topo > y;
  const vao = abaixo ? topo - y : y - (topo + 44);
  const haste = vao > 6 || Math.abs(etiquetaX - x) > 1;

  const texto = (
    <span className="min-w-0 flex-1 text-left">
      <span className="block truncate text-[12.5px] font-bold leading-tight text-rail">{no.nome}</span>
      <span className="block truncate font-mono text-[9.5px] leading-tight text-rail/65">
        {hoje && <span className="font-bold text-accent">hoje · </span>}
        {faixa(no)}
      </span>
    </span>
  );
  const bolha = (rotulo: string) => (
    <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-accent font-mono text-[11px] font-bold leading-none text-white">
      {rotulo}
    </span>
  );

  let corpo;
  if (!folha) {
    // um grupo: tocar aproxima até ele se desfazer
    corpo = (
      <button type="button" onClick={onAbrir} className={classe} style={estilo}>
        {bolha(numero(no))}
        {texto}
      </button>
    );
  } else if (no.dias.length === 1) {
    corpo = (
      <Link href={`/roteiro/${no.principal.dayId}`} className={classe} style={estilo}>
        {bolha(numero(no))}
        {texto}
      </Link>
    );
  } else {
    // o mesmo lugar em dias diferentes: um número para cada dia, cada um um link
    corpo = (
      <span className={`${classe} pr-2`} style={estilo}>
        <span className="flex shrink-0 gap-1">
          {no.dias.map((d) => (
            <Link key={d.dayId} href={`/roteiro/${d.dayId}`} aria-label={`dia ${d.n}, ${d.titulo}`}
              className="tappable flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-accent font-mono text-[11px] font-bold leading-none text-white">
              {d.n}
            </Link>
          ))}
        </span>
        {texto}
      </span>
    );
  }

  return (
    <>
      {haste && (
        <span aria-hidden className="pointer-events-none absolute bg-rail/35"
          style={{
            left: Math.min(x, etiquetaX) - 1,
            top: abaixo ? y : topo + 44,
            width: Math.abs(etiquetaX - x) + 2,
            height: Math.max(2, vao),
            clipPath:
              etiquetaX >= x
                ? 'polygon(100% 0, 100% 2px, 0 100%, 0 calc(100% - 2px))'
                : 'polygon(0 0, 0 2px, 100% 100%, 100% calc(100% - 2px))',
          }} />
      )}
      {corpo}
    </>
  );
}
