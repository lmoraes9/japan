import * as THREE from 'three';
import { ALTURA_TERRA } from './diorama';

/**
 * O controlador de câmera. Quatro enquadramentos autorados, mais um desvio
 * de órbita que o dedo pode dar e que volta sozinho. A câmera nunca é
 * arrastada por um toque de seleção: quem seleciona é o trilho.
 */

export type Enquadramento =
  | { tipo: 'panorama' }
  | { tipo: 'regiao'; lugares: string[] }
  | { tipo: 'cidade'; lugarId: string }
  | { tipo: 'travelling'; de: number; para: number };

interface Alvo {
  pos: THREE.Vector3;
  mira: THREE.Vector3;
}

/**
 * A obliquidade da câmera. Alta de propósito: a viagem é uma faixa leste-oeste
 * de 322 por 76 unidades, e numa tela vertical só um olhar quase de cima faz
 * essa faixa ocupar a tela em vez de virar um fio no meio do mar.
 */
const OBL_X = 0.30;
const OBL_Y = 0.92;
const OBL_Z = 0.36;

const AZ_MAX = (22 * Math.PI) / 180;
const POL_MIN = (12 * Math.PI) / 180;
const POL_MAX = (58 * Math.PI) / 180;

export interface Controlador {
  definir(e: Enquadramento, imediato?: boolean): void;
  /** desvio de órbita vindo do arrasto, em pixels */
  orbitar(dx: number, dy: number): void;
  soltar(): void;
  /** avança um quadro; devolve true enquanto está se movendo */
  passo(dt: number): boolean;
  /** progresso do travelling, 0..1, ou null */
  progressoTravelling(): number | null;
  enquadramento(): Enquadramento;
}

export function criarControlador(
  camera: THREE.PerspectiveCamera,
  ctx: {
    posicoes: Record<string, THREE.Vector3>;
    curva: THREE.CatmullRomCurve3 | null;
    fracoes: number[];
    aspecto: () => number;
    reduzido: () => boolean;
  },
): Controlador {
  let atual: Enquadramento = { tipo: 'panorama' };
  let alvo: Alvo = { pos: camera.position.clone(), mira: new THREE.Vector3() };
  let de: Alvo = { pos: camera.position.clone(), mira: new THREE.Vector3() };
  let t = 1;
  let dur = 1;
  let orb = { az: 0, pol: 0 };
  let ocioso = 0;
  let arrastando = false;

  const suave = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

  /**
   * Enquadra um conjunto de pontos por busca binária na distância, dentro de
   * uma caixa útil em coordenadas de tela. A caixa é menor que a tela porque
   * os controles ocupam as bordas: enquadrar na tela inteira esconderia
   * Tóquio atrás de um botão.
   */
  function enquadrar(pontos: THREE.Vector3[], minDist: number, sepMinPx: number, alturaPx: number, caixa = { x: 0.86, y: 0.52 }): Alvo {
    const centro = pontos
      .reduce((a, p) => a.add(p.clone()), new THREE.Vector3())
      .divideScalar(Math.max(1, pontos.length));
    const mira = new THREE.Vector3(centro.x, ALTURA_TERRA + 12, centro.z);
    const cam = camera.clone() as THREE.PerspectiveCamera;
    cam.aspect = ctx.aspecto();

    const cabe = (d: number) => {
      cam.position.set(mira.x + d * OBL_X, d * OBL_Y, mira.z + d * OBL_Z);
      cam.lookAt(mira);
      cam.updateMatrixWorld();
      cam.updateProjectionMatrix();
      const tela: THREE.Vector2[] = [];
      for (const p of pontos) {
        const v = p.clone().project(cam);
        if (Math.abs(v.x) > caixa.x || Math.abs(v.y) > caixa.y) return false;
        tela.push(new THREE.Vector2(v.x, v.y));
      }
      // separação mínima em pixels entre dois marcos do conjunto
      if (sepMinPx > 0 && tela.length > 1) {
        const px = (a: THREE.Vector2, b: THREE.Vector2) =>
          Math.hypot(((a.x - b.x) / 2) * (alturaPx * ctx.aspecto()), ((a.y - b.y) / 2) * alturaPx);
        for (let i = 0; i < tela.length; i++)
          for (let j = i + 1; j < tela.length; j++)
            if (px(tela[i], tela[j]) < sepMinPx) return false;
      }
      return true;
    };

    let lo = minDist;
    let hi = 2400;
    if (!cabe(hi)) hi = 2400;
    else {
      for (let i = 0; i < 22; i++) {
        const meio = (lo + hi) / 2;
        if (cabe(meio)) hi = meio;
        else lo = meio;
      }
    }
    const d = Math.max(minDist, hi);
    return { pos: new THREE.Vector3(mira.x + d * OBL_X, d * OBL_Y, mira.z + d * OBL_Z), mira };
  }

  function alvoDe(e: Enquadramento, alturaPx: number): Alvo {
    if (e.tipo === 'panorama') {
      // sobra espaço para os chips de região embaixo e o título em cima
      return enquadrar(Object.values(ctx.posicoes), 300, 0, alturaPx, { x: 0.86, y: 0.46 });
    }
    if (e.tipo === 'regiao') {
      const ps = e.lugares.map((id) => ctx.posicoes[id]).filter(Boolean);
      return enquadrar(ps, 110, 48, alturaPx, { x: 0.8, y: 0.5 });
    }
    if (e.tipo === 'cidade') {
      const p = ctx.posicoes[e.lugarId];
      if (!p) return alvo;
      const d = 230;
      return {
        pos: new THREE.Vector3(p.x + d * 0.46, d * 0.62, p.z + d * 0.58),
        mira: new THREE.Vector3(p.x, ALTURA_TERRA + 10, p.z),
      };
    }
    // travelling: o alvo é recalculado a cada quadro em passo()
    return alvo;
  }

  let alturaPx = 452;

  function definir(e: Enquadramento, imediato = false) {
    atual = e;
    de = { pos: camera.position.clone(), mira: alvo.mira.clone() };
    if (e.tipo !== 'travelling') alvo = alvoDe(e, alturaPx);
    t = imediato || ctx.reduzido() ? 1 : 0;
    dur = e.tipo === 'travelling' ? 2.4 : 1.1;
    if (ctx.reduzido()) dur = 0.4;
    if (e.tipo === 'travelling') t = 0;
    orb = { az: 0, pol: 0 };
    if (imediato && e.tipo !== 'travelling') {
      camera.position.copy(alvo.pos);
      camera.lookAt(alvo.mira);
    }
  }

  function aplicarOrbita() {
    if (!orb.az && !orb.pol) return;
    const mira = alvo.mira;
    const v = camera.position.clone().sub(mira);
    const raio = v.length();
    const az = Math.atan2(v.x, v.z) + orb.az;
    const pol = Math.min(POL_MAX, Math.max(POL_MIN, Math.acos(Math.min(1, Math.max(-1, v.y / raio))) + orb.pol));
    camera.position.set(
      mira.x + raio * Math.sin(pol) * Math.sin(az),
      mira.y + raio * Math.cos(pol),
      mira.z + raio * Math.sin(pol) * Math.cos(az),
    );
  }

  return {
    enquadramento: () => atual,
    definir,
    orbitar(dx, dy) {
      arrastando = true;
      ocioso = 0;
      orb.az = Math.max(-AZ_MAX, Math.min(AZ_MAX, orb.az - dx * 0.004));
      orb.pol = Math.max(-0.4, Math.min(0.4, orb.pol + dy * 0.004));
    },
    soltar() {
      arrastando = false;
      ocioso = 0;
    },
    progressoTravelling: () => (atual.tipo === 'travelling' ? Math.min(1, t) : null),
    passo(dt) {
      alturaPx = 452;
      let movendo = false;

      if (atual.tipo === 'travelling' && ctx.curva) {
        t = Math.min(1, t + dt / dur);
        const u0 = ctx.fracoes[atual.de] ?? 0;
        const u1 = ctx.fracoes[atual.para] ?? 1;
        const u = u0 + (u1 - u0) * suave(t);
        const p = ctx.curva.getPointAt(Math.max(0, Math.min(1, u)));
        const frente = ctx.curva.getTangentAt(Math.max(0.001, Math.min(0.999, u)));
        const mira = p.clone().addScaledVector(frente, 20);
        const pos = p.clone().addScaledVector(frente, -46).add(new THREE.Vector3(0, 26, 0));
        camera.position.lerp(pos, 1 - Math.pow(0.001, dt));
        alvo = { pos, mira };
        camera.lookAt(mira);
        movendo = t < 1;
      } else {
        if (t < 1) {
          t = Math.min(1, t + dt / dur);
          const k = suave(t);
          camera.position.lerpVectors(de.pos, alvo.pos, k);
          movendo = true;
        }
        if (!arrastando) {
          ocioso += dt;
          if (ocioso > 1.5) {
            orb.az *= 1 - Math.min(1, dt * 2.5);
            orb.pol *= 1 - Math.min(1, dt * 2.5);
            if (Math.abs(orb.az) < 0.0005) orb.az = 0;
            if (Math.abs(orb.pol) < 0.0005) orb.pol = 0;
          }
        }
        aplicarOrbita();
        camera.lookAt(alvo.mira);
      }
      return movendo || !!orb.az || !!orb.pol;
    },
  };
}
