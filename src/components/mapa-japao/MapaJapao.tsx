'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BedDouble, Maximize2, Plus, Minus } from 'lucide-react';
import { BASES, baseDaNoite, type Base } from '@/lib/mapa-japao/bases';
import { DIAS_MAPA, diaPorId } from '@/lib/mapa-japao/dias';
import type { Foco } from '@/lib/mapa-japao/foco';
import {
  diasDe,
  larguraEtiqueta,
  marcadores,
  noDoDia,
  numero,
  quemAbre,
  type Marcador,
  type No,
  type Ponto,
} from '@/lib/mapa-japao/hierarquia';
import { hojeNaViagem, type Hoje } from '@/lib/mapa-japao/hoje';
import { getNow } from '@/lib/now';
import { corDaEtapa, kmAte, TRECHOS } from '@/lib/mapa-japao/rota';
import { Cartao } from './Cartao';
import { TiraDias } from './TiraDias';

/** a altura da etiqueta em pixels, e a folga que ela pede em volta */
const ETIQUETA_PX = 32;
const ALT = ETIQUETA_PX + 4;
/** o pé do ícone fica aqui embaixo da etiqueta */
const ACIMA = 54;
/** quantos pixels de altura um ícone ocupa, em qualquer distância */
const ICONE_PX = 48;
/** o tanto que a palavra 'hoje' acrescenta a uma etiqueta */
const EXTRA_HOJE = 34;
/** a cama: o tamanho do botão, e a distância mínima de um ícone para ela aparecer */
const CAMA_PX = 28;
const CAMA_LONGE = 44;

/** margens reservadas: título em cima, cartão e tira dos dias embaixo, etiquetas nos lados */
const MARGEM_X = 48;
const MARGEM_TOPO = 112;
const MARGEM_BASE = 160;

/** quanto dura o voo da câmera de um lugar a outro */
const VOO_MS = 520;
/** um toque: pouco tempo, pouco movimento; dois toques seguidos aproximam */
const TOQUE_MS = 300;
const TOQUE_PX = 8;
const DUPLO_MS = 320;
const DUPLO_PX = 30;
/** a velocidade máxima com que o mapa sai deslizando, em pixels por milissegundo */
const INERCIA_MAX = 2.5;
/** a barra de escala: o mais longo destes que couber em tantos pixels */
const ESCALAS_KM = [1, 2, 5, 10, 20, 50, 100, 200, 500];
const ESCALA_MAX_PX = 120;

interface Motor {
  pontos: () => Record<string, Ponto>;
  tela: () => { largura: number; altura: number };
  /** quantos quilômetros cabem num pixel, no meio da tela */
  kmPorPixel: () => number;
  zoom: (fator: number) => void;
  /** enquadra um nó e, se ele for um grupo, aproxima o bastante para abri-lo */
  abrir: (no: No) => void;
  /** voa até um dia e aproxima só o bastante para ele aparecer sozinho */
  irParaDia: (dayId: string) => void;
  /** voa até um ponto do chão, de perto o bastante para ver a cidade */
  irParaPonto: (chave: string) => void;
  tudo: () => void;
  mostrar: (dayIds: Set<string>) => void;
  dispose: () => void;
}

interface Cama {
  base: Base;
  x: number;
  y: number;
}

/** o dia que o mapa marca como 'aqui': o de hoje, ou o primeiro enquanto a viagem não começa */
function diaDeHoje(hoje: Hoje | null): string | null {
  if (!hoje) return null;
  if (hoje.fase === 'durante') return hoje.dayId;
  if (hoje.fase === 'antes') return DIAS_MAPA[0].dayId;
  return null;
}

/** a largura de cada etiqueta, com a palavra 'hoje' na que a tem */
function larguraCom(hojeId: string | null) {
  return (no: No) => larguraEtiqueta(no, hojeId && no.dias.some((d) => d.dayId === hojeId) ? EXTRA_HOJE : 0);
}

/** este marcador contém o que está escolhido? é ele que ganha o anel */
function contem(m: Marcador, foco: Foco | null) {
  return foco?.tipo === 'no' && foco.no.dias.every((d) => m.no.dias.includes(d));
}

/**
 * O mapa da viagem.
 *
 * Um ícone por dia, no lugar onde o dia acontece, com uma etiqueta de número
 * e nome. Quando dois ícones não cabem lado a lado eles aparecem como um só
 * — 'Kansai' — e aproximar desfaz o grupo: primeiro nas cidades, depois nos
 * dias. Uma linha liga cada dia à cama de onde ele sai e à que ele volta,
 * com a cor de cada etapa; de perto, as camas aparecem; o dia de hoje
 * pulsa; tocar em qualquer coisa a escolhe e abre o cartão na base; e a
 * tira dos dias leva a câmera a qualquer dia com um toque.
 */
export function MapaJapao() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const motorRef = useRef<Motor | null>(null);
  const hojeRef = useRef<Hoje | null>(null);
  const [marcas, setMarcas] = useState<Marcador[]>([]);
  const [camas, setCamas] = useState<Cama[]>([]);
  const [escala, setEscala] = useState<{ km: number; px: number } | null>(null);
  const [estado, setEstado] = useState<'carregando' | 'pronto' | 'erro'>('carregando');
  const [erro, setErro] = useState('');
  const [hoje, setHoje] = useState<Hoje | null>(null);
  const [foco, setFoco] = useState<Foco | null>(null);

  // a data só existe no aparelho: no servidor a página não sabe que dia é
  useEffect(() => {
    const h = hojeNaViagem(getNow());
    hojeRef.current = h;
    setHoje(h);
    const id = diaDeHoje(h);
    const no = id ? noDoDia(id) : undefined;
    setFoco(no ? { tipo: 'no', no } : null);
  }, []);

  useEffect(() => {
    let vivo = true;
    let limpar = () => {};
    const canvas = canvasRef.current;
    if (!canvas) return;

    (async () => {
      try {
        const [THREE, { construirDiorama, ALTURA_TERRA, ALTURA_ICONE, KM_POR_UNIDADE, proj }, { construirLinha }] =
          await Promise.all([import('three'), import('@/lib/three/japao/diorama'), import('@/lib/three/japao/linha')]);
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

        // as camas também têm lugar no chão, para a tela projetar
        const posicoes: Record<string, import('three').Vector3> = { ...d.posicoes };
        for (const b of BASES) {
          const [x, z] = proj(b.lng, b.lat);
          posicoes[`base:${b.id}`] = new THREE.Vector3(x, ALTURA_TERRA, z);
        }

        // a linha sabe que trecho já passou: o de hoje salta, os anteriores apagam
        const agora = hojeNaViagem(getNow());
        const hojeN = (agora.fase === 'durante' && diaPorId(agora.dayId)?.n) || 0;
        const larguraDe = larguraCom(diaDeHoje(agora));
        const linha = construirLinha(TRECHOS, (t) => {
          if (!hojeN || t.dia.n > hojeN) return 'futuro';
          return t.dia.n === hojeN ? 'hoje' : 'passado';
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
        /** a distância de onde se vê uma cidade inteira, para ir até uma cama */
        const D_CIDADE = 18;

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

        const arrastar = (dx: number, dy: number) => {
          const k = porPixel(dist);
          alvo.x -= dx * k;
          alvo.z -= (dy * k) / ACHATA;
          aplicar();
        };

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
          const fs = no.filhos.filter((f) => d.posicoes[f.principal.dayId]);
          const ps = fs.map((f) => naTela(d.posicoes[f.principal.dayId]));
          for (let i = 0; i < ps.length; i += 1)
            for (let j = i + 1; j < ps.length; j += 1) {
              const perto = Math.abs(ps[i].x - ps[j].x) < (larguraDe(fs[i]) + larguraDe(fs[j])) / 2;
              if (perto && Math.abs(ps[i].y - ps[j].y) < ALT) return false;
            }
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

        /**
         * O ponto do chão que está debaixo de um pixel. É o que deixa o zoom
         * acontecer em volta do dedo — o lugar tocado fica parado na tela e o
         * resto do mapa cresce ou encolhe ao redor dele.
         */
        const raio = new THREE.Raycaster();
        const chao = new THREE.Plane(new THREE.Vector3(0, 1, 0), -ALTURA_TERRA);
        const ndc = new THREE.Vector2();
        const chaoSob = (px: number, py: number) => {
          const r = canvas.getBoundingClientRect();
          ndc.set(((px - r.left) / Math.max(1, r.width)) * 2 - 1, -((py - r.top) / Math.max(1, r.height)) * 2 + 1);
          raio.setFromCamera(ndc, camera);
          const p = new THREE.Vector3();
          return raio.ray.intersectPlane(chao, p) ? p : null;
        };
        const zoomEm = (f: number, px: number, py: number) => {
          voo = null;
          const p = chaoSob(px, py);
          const novo = Math.max(D_MIN, Math.min(D_MAX, dist * f));
          const fe = novo / dist;
          dist = novo;
          if (p) {
            alvo.x = p.x + (alvo.x - p.x) * fe;
            alvo.z = p.z + (alvo.z - p.z) * fe;
          }
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
          inercia = null;
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

        /** o mapa continua deslizando depois que o dedo solta, e vai parando */
        let inercia: { vx: number; vy: number; t: number } | null = null;
        const passoDaInercia = (agoraMs: number) => {
          if (!inercia) return;
          const dt = Math.min(50, agoraMs - inercia.t);
          inercia.t = agoraMs;
          arrastar(inercia.vx * dt, inercia.vy * dt);
          const k = Math.pow(0.93, dt / 16);
          inercia.vx *= k;
          inercia.vy *= k;
          if (Math.hypot(inercia.vx, inercia.vy) < 0.02) inercia = null;
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
            for (const [id, p] of Object.entries(posicoes)) {
              v.copy(p).project(camera);
              out[id] = { x: ((v.x + 1) / 2) * r.width, y: ((1 - v.y) / 2) * r.height, visivel: v.z <= 1 };
            }
            return out;
          },
          tela: () => {
            const r = canvas.getBoundingClientRect();
            return { largura: r.width, altura: r.height };
          },
          kmPorPixel: () => porPixel(dist) * KM_POR_UNIDADE,
          zoom: (f) => {
            // os botões aproximam em volta do meio da parte visível do mapa
            const r = canvas.getBoundingClientRect();
            zoomEm(f, r.left + r.width / 2, r.top + (r.height + MARGEM_TOPO - MARGEM_BASE) / 2);
          },
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
          irParaPonto: (chave) =>
            voar(() => {
              const p = posicoes[chave];
              if (!p) return;
              dist = Math.min(dist, D_CIDADE);
              centrarEm(p.x, p.z);
            }),
          tudo: () => voar(() => enquadrar(DIAS_MAPA.map((x) => x.dayId))),
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

        /**
         * Os dedos. Um arrasta e, ao soltar, o mapa desliza; dois pinçam e
         * arrastam juntos. Um toque limpo desfaz a escolha; dois toques
         * seguidos aproximam em volta do dedo; um toque com dois dedos afasta.
         */
        const dedos = new Map<number, { x: number; y: number }>();
        let pinca = 0;
        let meio: { x: number; y: number } | null = null;
        /** o dedo que desceu e ainda não se mexeu: pode virar um toque */
        let toque: { x: number; y: number; t: number } | null = null;
        let ultimoToque: { x: number; y: number; t: number } | null = null;
        /** dois dedos que desceram juntos: se subirem parados, é um toque duplo-dedo */
        let doisDedos: { t: number; movimento: number } | null = null;
        /** as últimas posições do arrasto, para medir a velocidade ao soltar */
        let amostras: { t: number; x: number; y: number }[] = [];
        const meioDe = () => {
          const l = [...dedos.values()];
          return { x: (l[0].x + l[1].x) / 2, y: (l[0].y + l[1].y) / 2 };
        };

        const onDown = (e: PointerEvent) => {
          voo = null;
          inercia = null;
          dedos.set(e.pointerId, { x: e.clientX, y: e.clientY });
          canvas.setPointerCapture?.(e.pointerId);
          const t = performance.now();
          if (dedos.size === 1) {
            toque = { x: e.clientX, y: e.clientY, t };
            amostras = [{ t, x: e.clientX, y: e.clientY }];
          } else if (dedos.size === 2) {
            toque = null;
            pinca = 0;
            meio = meioDe();
            doisDedos = { t, movimento: 0 };
          } else {
            toque = null;
            doisDedos = null;
          }
        };
        const onMove = (e: PointerEvent) => {
          const ant = dedos.get(e.pointerId);
          if (!ant) return;
          dedos.set(e.pointerId, { x: e.clientX, y: e.clientY });
          if (dedos.size >= 2) {
            const l = [...dedos.values()];
            const dd = Math.hypot(l[0].x - l[1].x, l[0].y - l[1].y);
            const m = meioDe();
            if (meio && doisDedos) doisDedos.movimento += Math.hypot(m.x - meio.x, m.y - meio.y) + Math.abs(dd - (pinca || dd));
            if (pinca) zoomEm(pinca / Math.max(1, dd), m.x, m.y);
            if (meio) arrastar(m.x - meio.x, m.y - meio.y);
            pinca = dd;
            meio = m;
          } else {
            arrastar(e.clientX - ant.x, e.clientY - ant.y);
            const t = performance.now();
            amostras.push({ t, x: e.clientX, y: e.clientY });
            if (amostras.length > 6) amostras.shift();
            if (toque && Math.hypot(e.clientX - toque.x, e.clientY - toque.y) > TOQUE_PX) toque = null;
          }
        };
        const onUp = (e: PointerEvent) => {
          const eram = dedos.size;
          dedos.delete(e.pointerId);
          const t = performance.now();
          if (eram === 2 && doisDedos) {
            if (t - doisDedos.t < TOQUE_MS && doisDedos.movimento < 12 && meio) zoomEm(2, meio.x, meio.y);
            doisDedos = null;
          }
          if (dedos.size < 2) {
            pinca = 0;
            meio = null;
          }
          if (eram !== 1) return;
          if (toque && t - toque.t < TOQUE_MS) {
            const x = e.clientX;
            const y = e.clientY;
            if (ultimoToque && t - ultimoToque.t < DUPLO_MS && Math.hypot(x - ultimoToque.x, y - ultimoToque.y) < DUPLO_PX) {
              zoomEm(0.5, x, y);
              ultimoToque = null;
            } else {
              ultimoToque = { x, y, t };
              // um toque no mapa vazio desfaz a escolha
              setFoco(null);
            }
          } else if (amostras.length >= 2) {
            // a velocidade dos últimos instantes do arrasto vira inércia
            const fim = amostras[amostras.length - 1];
            const ini = amostras.find((a) => fim.t - a.t <= 90) ?? amostras[0];
            const dt = fim.t - ini.t;
            if (dt > 0 && t - fim.t < 60) {
              let vx = (fim.x - ini.x) / dt;
              let vy = (fim.y - ini.y) / dt;
              // um piso e um teto: devagar demais não desliza, rápido demais
              // não atira o mapa para fora da tela
              const vel = Math.hypot(vx, vy);
              if (vel > INERCIA_MAX) {
                vx *= INERCIA_MAX / vel;
                vy *= INERCIA_MAX / vel;
              }
              if (vel > 0.15) inercia = { vx, vy, t };
            }
          }
          toque = null;
          amostras = [];
        };
        const onWheel = (e: WheelEvent) => {
          e.preventDefault();
          zoomEm(e.deltaY > 0 ? 1.12 : 0.89, e.clientX, e.clientY);
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
          passoDaInercia(agoraMs);
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

  // as etiquetas, as camas e a escala são recalculadas a cada quadro, a partir da projeção
  useEffect(() => {
    if (estado !== 'pronto') return;
    let raf = 0;
    let anterior = '';
    const larguraDe = larguraCom(diaDeHoje(hojeRef.current));
    const laco = () => {
      raf = requestAnimationFrame(laco);
      const m = motorRef.current;
      if (!m) return;
      // a faixa do cartão e da tira não recebe etiqueta: ela ficaria por baixo
      const tela = m.tela();
      const util = { largura: tela.largura, altura: tela.altura - MARGEM_BASE };
      const pontos = m.pontos();
      const ms = marcadores(pontos, util, larguraDe, ALT, ACIMA, ICONE_PX);
      // só o ícone que representa cada marcador fica aceso
      m.mostrar(new Set(ms.map((x) => x.no.principal.dayId)));

      // as camas aparecem quando estão longe de todo ícone aceso e fora de
      // toda etiqueta: de longe, a cama e o ícone da cidade são o mesmo pixel
      const cs: Cama[] = [];
      for (const b of BASES) {
        const p = pontos[`base:${b.id}`];
        if (!p || !p.visivel) continue;
        // nem debaixo do título e dos botões, onde o toque não chegaria nela
        if (p.x < 16 || p.x > util.largura - 16 || p.y < MARGEM_TOPO || p.y > util.altura - 8) continue;
        if (ms.some((k) => Math.hypot(k.x - p.x, k.y - p.y) < CAMA_LONGE)) continue;
        const cx0 = p.x - CAMA_PX / 2;
        const cx1 = p.x + CAMA_PX / 2;
        const cy0 = p.y - CAMA_PX;
        const cy1 = p.y;
        const tapada = ms.some((k) => {
          const x0 = k.etiquetaX - k.larg / 2;
          const x1 = k.etiquetaX + k.larg / 2;
          return x0 < cx1 && cx0 < x1 && k.topo < cy1 && cy0 < k.topo + k.alt;
        });
        if (!tapada) cs.push({ base: b, x: p.x, y: p.y });
      }

      // a barra de escala: o maior tamanho redondo que cabe
      const kmPx = m.kmPorPixel();
      const km = [...ESCALAS_KM].reverse().find((k) => k / kmPx <= ESCALA_MAX_PX) ?? ESCALAS_KM[0];
      const px = Math.round(km / kmPx);

      const chave =
        ms.map((x) => `${x.no.id}${x.etiqueta ? '' : '*'}@${Math.round(x.x)},${Math.round(x.y)},${Math.round(x.topo)}`).join('|') +
        '#' + cs.map((c) => `${c.base.id}@${Math.round(c.x)},${Math.round(c.y)}`).join('|') +
        `#${km}:${px}`;
      if (chave !== anterior) {
        anterior = chave;
        setMarcas(ms);
        setCamas(cs);
        setEscala({ km, px });
      }
    };
    raf = requestAnimationFrame(laco);
    return () => cancelAnimationFrame(raf);
  }, [estado]);

  const escolherDia = useCallback((dayId: string) => {
    const no = noDoDia(dayId);
    setFoco(no ? { tipo: 'no', no } : null);
    motorRef.current?.irParaDia(dayId);
  }, []);
  /** o botão do cartão: abre o grupo, ou centra o dia ou a cama */
  const localizar = useCallback(() => {
    const m = motorRef.current;
    if (!foco || !m) return;
    if (foco.tipo === 'base') m.irParaPonto(`base:${foco.base.id}`);
    else if (foco.no.filhos.length) m.abrir(foco.no);
    else m.irParaDia(foco.no.principal.dayId);
  }, [foco]);

  const hojeId = diaDeHoje(hoje);
  const marcaHoje = hojeId ? marcas.find((m) => m.no.dias.some((x) => x.dayId === hojeId)) : undefined;
  const diaHoje = hoje?.fase === 'durante' ? diaPorId(hoje.dayId) : undefined;
  const hojeN = diaHoje?.n ?? 0;
  /** a cama desta noite */
  const camaHoje = diaHoje ? baseDaNoite(diaHoje.day.date)?.id : undefined;

  const periodo = `${DIAS_MAPA[0].data} – ${DIAS_MAPA[DIAS_MAPA.length - 1].data}`;
  let subtitulo = `${DIAS_MAPA.length} dias · ${periodo}`;
  if (hoje?.fase === 'antes') subtitulo = `faltam ${hoje.dias} ${hoje.dias === 1 ? 'dia' : 'dias'} · ${periodo}`;
  else if (diaHoje) subtitulo = `dia ${diaHoje.n} de ${DIAS_MAPA.length} · ${diaHoje.cidade} · ${kmAte(diaHoje.n).toLocaleString('pt-BR')} km`;
  else if (hoje?.fase === 'depois') subtitulo = `${DIAS_MAPA.length} dias · ${kmAte().toLocaleString('pt-BR')} km`;

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

      {camas.map((c) => (
        <CamaMarca
          key={c.base.id}
          cama={c}
          hoje={c.base.id === camaHoje}
          foco={foco?.tipo === 'base' && foco.base.id === c.base.id}
          onEscolher={() => setFoco({ tipo: 'base', base: c.base })}
        />
      ))}

      {marcas.map((m) => (
        <Etiqueta
          key={m.no.id}
          marca={m}
          hoje={m === marcaHoje}
          foco={contem(m, foco)}
          onEscolher={() => setFoco({ tipo: 'no', no: m.no })}
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

      {escala && (
        <div aria-hidden className="pointer-events-none absolute left-3 z-10" style={{ bottom: MARGEM_BASE + 10 }}>
          <div className="h-[6px] border-x-2 border-b-2 border-rail/80" style={{ width: escala.px }} />
          <p className="mt-0.5 font-mono text-[10px] leading-none text-rail/80 drop-shadow-[0_0_2px_rgba(255,255,255,0.9)]">
            {escala.km} km
          </p>
        </div>
      )}

      <div
        className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/30 to-transparent pt-8"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {foco && <Cartao foco={foco} corDe={corDaEtapa} onLocalizar={localizar} onEscolherDia={escolherDia} />}
        <TiraDias
          dias={DIAS_MAPA}
          hojeId={hojeId}
          passadoAte={hojeN}
          focoDias={foco?.tipo === 'no' ? foco.no.dias.map((x) => x.dayId) : []}
          corDe={corDaEtapa}
          onEscolher={escolherDia}
        />
      </div>
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

/** a cama de uma etapa: onde se dorme, na cor dela, com anel na cama desta noite */
function CamaMarca({ cama, hoje, foco, onEscolher }: { cama: Cama; hoje: boolean; foco: boolean; onEscolher: () => void }) {
  const anel = foco ? 'ring-2 ring-accent' : hoje ? 'ring-2 ring-accent/60' : 'ring-1 ring-black/10';
  return (
    <button type="button" onClick={onEscolher} aria-label={`${cama.base.nome}, ${cama.base.noites} noites`}
      className={`tappable absolute flex -translate-x-1/2 -translate-y-full items-center justify-center rounded-full bg-white shadow-md ${anel}`}
      style={{ left: cama.x, top: cama.y, width: CAMA_PX, height: CAMA_PX, color: cama.base.cor }}>
      <BedDouble size={15} />
    </button>
  );
}

const BOLHA =
  'flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-accent font-mono text-[11px] font-bold leading-none text-white';

/**
 * A etiqueta: o número da sequência e o nome, numa linha. Quando ela
 * precisou subir para desviar de outra, uma haste fina a liga de volta ao
 * seu ícone; quando não coube em lugar nenhum, sobra a bolha do número.
 * Tocar escolhe o marcador, e o cartão na base conta o resto.
 */
function Etiqueta({ marca, hoje, foco, onEscolher }: { marca: Marcador; hoje: boolean; foco: boolean; onEscolher: () => void }) {
  const { no, x, y, etiquetaX, topo, larg, etiqueta } = marca;

  if (!etiqueta) {
    return (
      <button type="button" onClick={onEscolher} aria-label={no.nome}
        className={`tappable absolute -translate-x-1/2 shadow-md ring-2 ${foco ? 'ring-accent' : 'ring-white'} ${BOLHA} h-[28px] w-[28px]`}
        style={{ left: etiquetaX, top: topo }}>
        {numero(no)}
      </button>
    );
  }

  const classe = `tappable absolute flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-white/93 py-[3px] pl-[3px] pr-2.5 shadow-md backdrop-blur ${
    foco ? 'ring-2 ring-accent' : 'ring-1 ring-black/5'
  }`;
  const estilo = { left: etiquetaX, top: topo, width: larg - 4, height: ETIQUETA_PX };
  // a haste liga a etiqueta ao seu ícone quando ela não está bem em cima
  // dele — mas não quando ela está ao lado: aí a vizinhança já diz de quem é
  const abaixo = topo > y;
  const vao = abaixo ? topo - y : y - (topo + ETIQUETA_PX);
  const aoLado = Math.abs(etiquetaX - x) >= larg / 2;
  const haste = !aoLado && (vao > 6 || Math.abs(etiquetaX - x) > 1);

  return (
    <>
      {haste && (
        <span aria-hidden className="pointer-events-none absolute bg-rail/35"
          style={{
            left: Math.min(x, etiquetaX) - 1,
            top: abaixo ? y : topo + ETIQUETA_PX,
            width: Math.abs(etiquetaX - x) + 2,
            height: Math.max(2, vao),
            clipPath:
              etiquetaX >= x
                ? 'polygon(100% 0, 100% 2px, 0 100%, 0 calc(100% - 2px))'
                : 'polygon(0 0, 0 2px, 100% 100%, 100% calc(100% - 2px))',
          }} />
      )}
      <button type="button" onClick={onEscolher} className={classe} style={estilo}>
        {/* o mesmo lugar em dias diferentes ganha uma bolha por dia */}
        {no.nivel === 'lugar' ? (
          <span className="flex shrink-0 gap-1">
            {no.dias.map((d) => <span key={d.dayId} className={BOLHA}>{d.n}</span>)}
          </span>
        ) : (
          <span className={BOLHA}>{numero(no)}</span>
        )}
        <span className="min-w-0 flex-1 truncate text-left text-[12.5px] font-bold leading-none text-rail">
          {no.nome}
          {hoje && <span className="ml-1.5 font-mono text-[9.5px] font-bold text-accent">hoje</span>}
        </span>
      </button>
    </>
  );
}
