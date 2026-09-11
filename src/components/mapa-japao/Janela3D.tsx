'use client';

import { useEffect, useRef } from 'react';
import type { Enquadramento } from '@/lib/three/japao/camera';

export interface MotorJanela {
  definir: (e: Enquadramento, imediato?: boolean) => void;
  /** leva o trem à fração de arco u (0..1) e acende o tubo até lá */
  trem: (u: number) => void;
  /** acende o anel de miniaturas de uma cidade (ou nenhuma) */
  anel: (lugarId: string | null) => void;
  /** destaca a miniatura de um mapa ilustrado enquanto o dedo está no chip */
  destacarMapa: (mapaId: string | null) => void;
  /** posição de tela de um ponto do mundo, para a camada de tinta */
  projetar: (lugarId: string) => { x: number; y: number; visivel: boolean } | null;
  projetarRegiao: (regiaoId: string) => { x: number; y: number; visivel: boolean } | null;
  /** a região cujo centroide está mais perto deste ponto da tela */
  regiaoMaisProxima: (x: number, y: number) => string | null;
  /** a cidade de um conjunto cujo marco está mais perto deste ponto */
  lugarMaisProximo: (x: number, y: number, entre: string[]) => string | null;
  /** true quando o travelling passa perto do Fuji */
  pertoDoFuji: () => boolean;
}

/**
 * A janela do diorama. Não tem um único alvo de toque: o canvas só recebe
 * arrasto (órbita) e toque curto (mira grossa, que o pai resolve). Nenhum
 * objeto 3D tem `raycast`, por construção da cena.
 */
export function Janela3D({
  altura,
  qualidade,
  onPronto,
  onMira,
  aoQuadro,
}: {
  altura: number;
  qualidade: 'alta' | 'leve';
  onPronto: (m: MotorJanela) => void;
  /** toque curto: coordenadas dentro da janela */
  onMira: (x: number, y: number) => void;
  aoQuadro?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onProntoRef = useRef(onPronto);
  const onMiraRef = useRef(onMira);
  const aoQuadroRef = useRef(aoQuadro);
  onProntoRef.current = onPronto;
  onMiraRef.current = onMira;
  aoQuadroRef.current = aoQuadro;

  useEffect(() => {
    let vivo = true;
    let limpar = () => {};
    const canvas = canvasRef.current;
    if (!canvas) return;

    (async () => {
      const [THREE, { construirDiorama, ALTURA_TERRA }, { criarControlador }, { ROTA_LUGARES }] = await Promise.all([
        import('three'),
        import('@/lib/three/japao/diorama'),
        import('@/lib/three/japao/camera'),
        import('@/lib/mapa-japao/rota'),
      ]);
      if (!vivo) return;

      const leve = qualidade === 'leve';
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: !leve, alpha: true, powerPreference: 'high-performance' });
      renderer.setPixelRatio(leve ? 1 : Math.min(devicePixelRatio, 2));
      renderer.shadowMap.enabled = !leve;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;

      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0xb7c9d8, 700, 2100);
      const camera = new THREE.PerspectiveCamera(40, 1, 1, 4000);
      scene.add(new THREE.HemisphereLight(0xdfe9f5, 0x54513f, 0.85));
      const sol = new THREE.DirectionalLight(0xfff2dd, 1.5);
      sol.position.set(-420, 640, 420);
      sol.castShadow = !leve;
      sol.shadow.mapSize.set(2048, 2048);
      const sc = sol.shadow.camera;
      sc.left = -700; sc.right = 700; sc.top = 700; sc.bottom = -700; sc.near = 100; sc.far = 1800;
      sol.shadow.bias = -0.0008;
      scene.add(sol);

      const d = construirDiorama(scene, ROTA_LUGARES, leve);
      const reduzido = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
      const controlador = criarControlador(camera, {
        posicoes: d.posicoes,
        curva: d.curva,
        fracoes: d.fracoes,
        aspecto: () => {
          const r = canvas.getBoundingClientRect();
          return r.width / Math.max(1, r.height);
        },
        reduzido,
      });
      controlador.definir({ tipo: 'panorama' }, true);

      const v = new THREE.Vector3();
      const projetarPonto = (p: import('three').Vector3) => {
        const r = canvas.getBoundingClientRect();
        v.copy(p).project(camera);
        return { x: ((v.x + 1) / 2) * r.width, y: ((1 - v.y) / 2) * r.height, visivel: v.z <= 1 };
      };

      let anelAtivo: string | null = null;
      const destaque = { mapaId: null as string | null, y: 0 };

      const motor: MotorJanela = {
        definir: (e, imediato) => controlador.definir(e, imediato),
        trem: (u) => {
          if (!d.curva) return;
          const uu = Math.max(0, Math.min(1, u));
          const p = d.curva.getPointAt(uu);
          const tg = d.curva.getTangentAt(Math.max(0.001, Math.min(0.999, uu)));
          d.trem.position.set(p.x, p.y + 5.5, p.z);
          d.trem.lookAt(p.x + tg.x, p.y + 5.5 + tg.y, p.z + tg.z);
          d.trem.visible = true;
          if (d.tuboAceso && d.curva) {
            const par = d.curva.getUtoTmapping(uu, uu * d.curva.getLength());
            const segs = Math.max(1, Math.round(par * d.segmentosTubo));
            d.tuboAceso.geometry.setDrawRange(0, segs * d.radiaisTubo * 6);
          }
        },
        anel: (id) => { anelAtivo = id; },
        destacarMapa: (id) => { destaque.mapaId = id; },
        projetar: (id) => (d.posicoes[id] ? projetarPonto(d.posicoes[id]) : null),
        projetarRegiao: (id) => (d.centroidesRegiao[id] ? projetarPonto(d.centroidesRegiao[id]) : null),
        regiaoMaisProxima: (x, y) => {
          let melhor: string | null = null;
          let md = Infinity;
          for (const [id, p] of Object.entries(d.centroidesRegiao)) {
            const s = projetarPonto(p);
            const dd = (s.x - x) ** 2 + (s.y - y) ** 2;
            if (dd < md) { md = dd; melhor = id; }
          }
          return melhor;
        },
        lugarMaisProximo: (x, y, entre) => {
          let melhor: string | null = null;
          let md = Infinity;
          for (const id of entre) {
            const p = d.posicoes[id];
            if (!p) continue;
            const s = projetarPonto(p);
            const dd = (s.x - x) ** 2 + (s.y - y) ** 2;
            if (dd < md) { md = dd; melhor = id; }
          }
          return melhor;
        },
        pertoDoFuji: () => d.trem.position.distanceTo(d.posicaoFuji) < 60,
      };

      // arrasto = órbita; toque curto = mira grossa. Nada mais.
      let dedo: { x: number; y: number; ultimo: { x: number; y: number } } | null = null;
      const onDown = (e: PointerEvent) => {
        dedo = { x: e.clientX, y: e.clientY, ultimo: { x: e.clientX, y: e.clientY } };
        canvas.setPointerCapture?.(e.pointerId);
      };
      const onMove = (e: PointerEvent) => {
        if (!dedo) return;
        controlador.orbitar(e.clientX - dedo.ultimo.x, e.clientY - dedo.ultimo.y);
        dedo.ultimo = { x: e.clientX, y: e.clientY };
      };
      const onUp = (e: PointerEvent) => {
        if (!dedo) return;
        const andou = Math.hypot(e.clientX - dedo.x, e.clientY - dedo.y);
        const r = canvas.getBoundingClientRect();
        dedo = null;
        controlador.soltar();
        if (andou < 8) onMiraRef.current(e.clientX - r.left, e.clientY - r.top);
      };
      canvas.addEventListener('pointerdown', onDown);
      canvas.addEventListener('pointermove', onMove);
      canvas.addEventListener('pointerup', onUp);
      canvas.addEventListener('pointercancel', onUp);

      const redimensionar = () => {
        const r = canvas.getBoundingClientRect();
        if (!r.width || !r.height) return;
        renderer.setSize(r.width, r.height, false);
        camera.aspect = r.width / r.height;
        camera.updateProjectionMatrix();
      };
      redimensionar();
      const ro = new ResizeObserver(redimensionar);
      ro.observe(canvas);

      let raf = 0;
      let anterior = 0;
      const laco = (agora: number) => {
        raf = requestAnimationFrame(laco);
        const dt = anterior ? Math.min(0.05, (agora - anterior) / 1000) : 0.016;
        anterior = agora;
        controlador.passo(dt);

        // o trem mantém comprimento constante na tela
        if (d.trem.visible) {
          const r = canvas.getBoundingClientRect();
          if (r.height) {
            const k = (2 * Math.tan((camera.fov * Math.PI) / 360)) / r.height;
            const dc = camera.position.distanceTo(d.trem.position);
            d.trem.scale.setScalar(Math.min(4.2, Math.max(0.9, (46 * k * dc) / 21)));
          }
        }

        // anel da cidade selecionada, e o destaque do chip pressionado
        for (const [id, anel] of Object.entries(d.aneis)) {
          const querVisivel = id === anelAtivo && camera.position.distanceTo(d.posicoes[id]) < 700;
          anel.visible = querVisivel;
          if (!querVisivel) continue;
          for (const filho of anel.children) {
            const alvoY = filho.userData.mapaId && filho.userData.mapaId === destaque.mapaId ? 6 : 0;
            filho.position.y += (alvoY - filho.position.y) * Math.min(1, dt * 12);
          }
        }

        aoQuadroRef.current?.();
        renderer.render(scene, camera);
      };
      raf = requestAnimationFrame(laco);

      if (typeof window !== 'undefined' && location.search.includes('debug')) {
        (window as unknown as { __mj: unknown }).__mj = { d, camera, scene, renderer, controlador };
      }
      onProntoRef.current(motor);

      limpar = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        canvas.removeEventListener('pointerdown', onDown);
        canvas.removeEventListener('pointermove', onMove);
        canvas.removeEventListener('pointerup', onUp);
        canvas.removeEventListener('pointercancel', onUp);
        d.dispose();
        renderer.dispose();
      };
      void ALTURA_TERRA;
    })();

    return () => {
      vivo = false;
      limpar();
    };
  }, [qualidade]);

  // absoluto de propósito: o gradiente de céu é irmão posicionado e, em fluxo
  // normal, o canvas ficaria pintado por baixo dele
  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full touch-none" style={{ height: altura }} />;
}
