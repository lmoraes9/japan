/**
 * O mapinha do trajeto: globo para os voos, Japão para o trem bala, cidade
 * para o que se faz no mesmo dia. A rota se desenha da origem ao destino, o
 * selo do transporte vai na ponta, e as fotos do caminho aparecem como polaroid.
 *
 * A aparência (cores, pinos, rótulos, texturas) vem de um `VisualMapa`, que
 * cada estilo define; a lógica de tempo e câmera está em rota.ts.
 */
import React, { useMemo } from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { geoDistance, geoGraticule10, geoOrthographic, geoPath, type GeoProjection } from 'd3-geo';
import { divisasGlobo, provincias, terraGlobo, visiveis, vizinhos } from './geo.ts';
import type { Modo, Ponto } from './plano.ts';
import { clamp, enquadrar, ll, mercator, misturar, montarAgenda, naPerna, perto, rotaAte, suave, type Escala, type LngLat } from './rota.ts';
import { H, W } from './tema.ts';

export interface RotuloProps {
  x: number;
  y: number;
  p: Ponto;
  aparece: number;
  cinza?: boolean;
}
export interface PinoProps {
  p: Ponto;
  /** 0→1 quando a rota chega */
  s: number;
}
export interface SeloProps {
  modo: Modo;
  x: number;
  y: number;
  giro: number;
}
export interface PolaroidProps {
  x: number;
  y: number;
  foto: string;
  legenda: string;
  /** quadros desde que a foto deve aparecer (negativo = ainda não) */
  f: number;
  fps: number;
  lado: number;
}

export interface VisualMapa {
  /** CSS background do quadro */
  fundo: string;
  fonte: string;
  globo: { mar: string; borda: string; grade: string; terra: string; terraBorda: string; divisa: string; atmosfera?: string };
  /** mar no mapa plano: cor ou url(#padrao); sem ele, aparece o fundo */
  mar?: string;
  terra: string;
  terraBorda: string;
  divisa: string;
  larguraBorda?: number;
  /** contorno de costa no mapa plano (px); as divisas entre províncias ficam finas */
  costa?: number;
  vizinhosOpacidade?: number;
  /** filtro SVG aplicado à terra e à rota (ex.: traço tremido de caneta) */
  filtro?: string;
  rota: { cor: string; largura: number; brilho?: boolean; tracejado?: string; futura: string; futuraTracejado?: string };
  /** textura por cima da terra no mapa de cidade */
  texturaLocal?: string;
  /** <defs> extras (padrões, filtros) */
  defs?: React.ReactNode;
  /** SVG por cima de tudo (grão de papel, vinheta) */
  sobre?: React.ReactNode;
  Pino: React.FC<PinoProps>;
  Rotulo: React.FC<RotuloProps>;
  Selo: React.FC<SeloProps>;
  Polaroid?: React.FC<PolaroidProps>;
  /** onde fica o globo */
  globoCentro?: [number, number];
  globoRaio?: number;
}

export interface MapaProps {
  visual: VisualMapa;
  escala: Escala;
  pontos: Ponto[];
  modos: Modo[];
  contexto?: Ponto[];
  /** fração do segmento em que a rota começa e termina de se desenhar */
  janela?: [number, number];
  /** aproxima do destino no fim (desligado no resumo) */
  chegarPerto?: boolean;
  children?: (estado: { kmAteAgora: number; kmTotal: number; perna: number; u: number }) => React.ReactNode;
}

export const MapaCena: React.FC<MapaProps> = ({ visual: v, escala, pontos, modos, contexto = [], janela = [0.16, 0.8], chegarPerto = true, children }) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames: N } = useVideoConfig();
  const inicio = Math.round(N * janela[0]);
  const fimRota = Math.round(N * janela[1]);
  const ag = useMemo(() => montarAgenda(pontos, escala, inicio, fimRota, fps), [pontos, escala, inicio, fimRota, fps]);
  const { perna, u, km } = ag.ponta(f);
  const cabeca = naPerna(ag.pernas[perna], u, escala);
  const modo = modos[Math.min(perna, modos.length - 1)] ?? 'trem';
  const [gx, gy] = v.globoCentro ?? [W / 2, 985];
  const raio = v.globoRaio ?? 465;

  // ── projeção do quadro ──
  let proj: GeoProjection;
  const zoomGlobo = interpolate(f, [0, inicio], [0.9, 1], { ...clamp, easing: suave });
  if (escala === 'globo') {
    // a câmera segue um pouco atrás da ponta, para o avião ir na frente
    const atras = ag.ponta(Math.max(0, f - fps * 0.5));
    const alvo = naPerna(ag.pernas[atras.perna], atras.u, escala);
    proj = geoOrthographic()
      .scale(raio * zoomGlobo)
      .translate([gx, gy])
      .rotate([-alvo[0], -Math.max(-20, Math.min(32, alvo[1] * 0.55))])
      .clipAngle(90)
      .precision(0.4);
  } else {
    const todos = pontos.map(ll);
    const spanPerto = escala === 'regiao' ? 3.2 : 0.018;
    const geral = enquadrar(todos, escala === 'regiao' ? 4.5 : 0.03);
    const origem = enquadrar([todos[0]], spanPerto);
    const destino = enquadrar([todos[todos.length - 1]], spanPerto);
    let vista = geral;
    if (f < inicio) vista = misturar(origem, geral, suave(f / inicio));
    else if (chegarPerto && f > fimRota) vista = misturar(geral, destino, 0.55 * suave((f - fimRota) / Math.max(1, N - fimRota)));
    proj = mercator(vista);
  }
  const caminho = geoPath(proj);
  const xy = (p: LngLat) => proj(p) as [number, number] | null;
  const visivel = (p: LngLat) => escala !== 'globo' || geoDistance(p, proj.rotate().map((r) => -r) as LngLat) < Math.PI / 2 - 0.08;

  // ── rota ──
  const feita = rotaAte(ag, perna, u, escala);
  const inteira = rotaAte(ag, ag.pernas.length - 1, 1, escala);
  const linha = (pts: LngLat[]) => {
    if (escala === 'globo') return caminho({ type: 'LineString', coordinates: pts }) ?? '';
    return pts.map((p, i) => `${i ? 'L' : 'M'}${xy(p)!.join(',')}`).join('');
  };

  // ── direção do selo (para o avião apontar) ──
  const frente = naPerna(ag.pernas[perna], Math.min(1, u + 0.02), escala);
  const pa = xy(cabeca);
  const pb = xy(frente);
  const giro = pa && pb ? (Math.atan2(pb[1] - pa[1], pb[0] - pa[0]) * 180) / Math.PI + 90 : 0;
  const andando = f >= inicio && f <= fimRota + fps * 0.3;

  // ── terra ──
  let terra: React.ReactNode;
  if (escala === 'globo') {
    const g = v.globo;
    terra = (
      <>
        <path d={caminho({ type: 'Sphere' }) ?? ''} fill={g.mar} stroke={g.borda} strokeWidth={2.5} />
        <path d={caminho(geoGraticule10()) ?? ''} fill="none" stroke={g.grade} strokeWidth={1.2} />
        <path d={caminho(terraGlobo as any) ?? ''} fill={g.terra} stroke={g.terraBorda} strokeWidth={v.larguraBorda ?? 1.4} />
        <path d={caminho(divisasGlobo) ?? ''} fill="none" stroke={g.divisa} strokeWidth={1} />
      </>
    );
  } else {
    const a = proj.invert!([0, 0])!;
    const b = proj.invert!([W, H])!;
    const caixa: [[number, number], [number, number]] = [[Math.min(a[0], b[0]), Math.min(a[1], b[1])], [Math.max(a[0], b[0]), Math.max(a[1], b[1])]];
    const provs = visiveis(provincias, caixa);
    terra = (
      <>
        {v.mar ? <rect width={W} height={H} fill={v.mar} /> : null}
        {visiveis(vizinhos, caixa).map((ft, i) => (
          <path key={`v${i}`} d={caminho(ft as any) ?? ''} fill={v.terra} stroke={v.terraBorda} strokeWidth={v.larguraBorda ?? 1.2} opacity={v.vizinhosOpacidade ?? 0.75} />
        ))}
        {/* costa: traço largo por baixo; o preenchimento das províncias cobre a metade de dentro */}
        {v.costa
          ? provs.map((ft, i) => <path key={`c${i}`} d={caminho(ft as any) ?? ''} fill="none" stroke={v.terraBorda} strokeWidth={v.costa! * 2} strokeLinejoin="round" />)
          : null}
        {provs.map((ft, i) => (
          <path key={`p${i}`} d={caminho(ft as any) ?? ''} fill={v.terra} stroke={v.divisa} strokeWidth={1.2} />
        ))}
      </>
    );
  }

  const aparece = (q: number) => interpolate(f, [q - 4, q + 8], [0, 1], clamp);
  const R = v.rota;

  return (
    <AbsoluteFill style={{ background: v.fundo, fontFamily: v.fonte }}>
      <svg width={W} height={H} style={{ position: 'absolute' }}>
        <defs>
          <radialGradient id="atmosfera">
            <stop offset="0.86" stopColor={v.globo.atmosfera ?? '#5fb4ff'} stopOpacity={0} />
            <stop offset="0.93" stopColor={v.globo.atmosfera ?? '#5fb4ff'} stopOpacity={0.18} />
            <stop offset="1" stopColor={v.globo.atmosfera ?? '#5fb4ff'} stopOpacity={0} />
          </radialGradient>
          <filter id="brilho" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
          {v.defs}
        </defs>
        {escala === 'globo' && v.globo.atmosfera !== 'none' ? <circle cx={gx} cy={gy} r={raio * 1.08 * zoomGlobo} fill="url(#atmosfera)" /> : null}
        <g filter={v.filtro}>
          {terra}
          {escala === 'local' && v.texturaLocal ? <rect width={W} height={H} fill={v.texturaLocal} /> : null}
        </g>

        {/* contexto: as próximas cidades, discretas */}
        {contexto.map((p, i) => {
          const q = xy(ll(p));
          return q && visivel(ll(p)) ? <circle key={i} cx={q[0]} cy={q[1]} r={7} fill={R.futura} /> : null;
        })}

        {/* rota inteira, tracejada, e a parte já percorrida */}
        <g filter={v.filtro}>
          <path d={linha(inteira)} fill="none" stroke={R.futura} strokeWidth={4} strokeDasharray={R.futuraTracejado ?? '2 14'} strokeLinecap="round" />
          {f >= inicio ? (
            <>
              {R.brilho ? <path d={linha(feita)} fill="none" stroke={R.cor} strokeWidth={R.largura * 2} opacity={0.5} filter="url(#brilho)" /> : null}
              <path d={linha(feita)} fill="none" stroke={R.cor} strokeWidth={R.largura} strokeDasharray={R.tracejado} strokeLinecap="round" strokeLinejoin="round" />
            </>
          ) : null}
        </g>

        {/* pinos */}
        {pontos.map((p, k) => {
          const q = xy(ll(p));
          if (!q || !visivel(ll(p))) return null;
          const s = spring({ frame: f - ag.chegada[k] + (k === 0 ? inicio : 0), fps, config: { damping: 12 } });
          return (
            <g key={k} transform={`translate(${q[0]},${q[1]})`}>
              <v.Pino p={p} s={s} />
            </g>
          );
        })}

        {andando && pa && visivel(cabeca) ? <v.Selo modo={modo} x={pa[0]} y={pa[1]} giro={giro} /> : null}
        {v.sobre}
      </svg>

      {/* rótulos e polaroids em HTML (texto mais bonito) */}
      {contexto.map((p, i) => {
        const q = xy(ll(p));
        return q && visivel(ll(p)) ? <v.Rotulo key={`c${i}`} x={q[0]} y={q[1]} p={p} aparece={0.9} cinza /> : null;
      })}
      {pontos.map((p, k) => {
        const q = xy(ll(p));
        if (!q || !visivel(ll(p))) return null;
        if (p.passagem && pontos.some((o) => !o.passagem && perto(xy(ll(o)), q, 150))) return null;
        const chegou = k === 0 ? 0 : ag.chegada[k];
        return <v.Rotulo key={`r${k}`} x={q[0]} y={q[1]} p={p} aparece={aparece(chegou)} />;
      })}
      {v.Polaroid
        ? pontos.map((p, k) => {
            if (!p.foto || !v.Polaroid) return null;
            const q = xy(ll(p));
            if (!q || !visivel(ll(p))) return null;
            return <v.Polaroid key={`f${k}`} x={q[0]} y={q[1]} foto={p.foto} legenda={p.nome} f={f - (k === 0 ? Math.round(inicio * 0.3) : ag.chegada[k])} fps={fps} lado={q[0] > W / 2 ? -1 : 1} />;
          })
        : null}

      {children?.({ kmAteAgora: km, kmTotal: ag.kmTotal, perna, u })}
    </AbsoluteFill>
  );
};

// sem toLocaleString: o Chrome do render nem sempre traz os dados de locale
export const fmtKm = (km: number) => (km >= 100 ? String(Math.round(km)).replace(/\B(?=(\d{3})+(?!\d))/g, '.') : km.toFixed(1).replace('.', ','));
