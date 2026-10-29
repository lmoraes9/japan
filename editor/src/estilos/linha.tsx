/**
 * Estilo "linha de trem": a viagem contada como uma linha de trem japonesa.
 * - mapa → o painel de cima da porta do vagão (次は "próxima estação"), com o
 *   diagrama da linha e o trem andando; voos → painel de partidas de aeroporto
 * - vídeo → placa de estação (駅名標) embaixo, com estação anterior e próxima
 * - nota → painel de aviso do vagão
 * - troca de cena → as portas do trem fechando e abrindo
 * - fecho → o mapa da linha (路線図) com todas as "estações" da semana
 */
import '@fontsource/dotgothic16/400.css';
import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { TransitionPresentation, TransitionPresentationComponentProps } from '@remotion/transitions';
import { Icone, IconeHtml } from '../icones.tsx';
import { MidiaCheia } from './noite.tsx';
import type { Modo, Plano, SegClipe, SegFim, SegMapa } from '../plano.ts';
import { clamp, suave } from '../rota.ts';
import { FONTE, H, SEGURO, W } from '../tema.ts';
import { ReelPadrao, type SegProps } from './base.tsx';

const LED = '"DotGothic16", monospace';

const COR_MODO: Record<Modo, string> = {
  aviao: '#5b6470',
  shinkansen: '#1f6fd1',
  trem: '#2e9b4a',
  metro: '#f39700',
  bonde: '#7a4fa0',
  onibus: '#d14b6b',
  balsa: '#0097c8',
  teleferico: '#8a6d3b',
  taxi: '#d9a400',
  ape: '#8a8f98',
};
const NOME_MODO: Record<Modo, [string, string]> = {
  aviao: ['飛行機', 'AVIÃO'],
  shinkansen: ['新幹線', 'SHINKANSEN'],
  trem: ['JR線', 'TREM'],
  metro: ['地下鉄', 'METRÔ'],
  bonde: ['路面電車', 'BONDE'],
  onibus: ['バス', 'ÔNIBUS'],
  balsa: ['フェリー', 'BALSA'],
  teleferico: ['ロープウェイ', 'TELEFÉRICO'],
  taxi: ['タクシー', 'TÁXI'],
  ape: ['徒歩', 'A PÉ'],
};
const principal = (modos: Modo[]): Modo => modos.find((m) => m !== 'ape') ?? 'ape';

const JANELA: [number, number] = [0.16, 0.8];
/** progresso da viagem dentro do segmento de mapa, igual ao do mapa geográfico */
const progresso = (f: number, n: number) => suave(interpolate(f, [n * JANELA[0], n * JANELA[1]], [0, 1], clamp));
const useProgresso = () => {
  const f = useCurrentFrame();
  const { durationInFrames: n } = useVideoConfig();
  return progresso(f, n);
};
/** o quadro em que o progresso chega a `alvo` (para saber quando a situação do voo muda) */
function quadroDoProgresso(alvo: number, n: number) {
  let lo = n * JANELA[0];
  let hi = n * JANELA[1];
  for (let k = 0; k < 30; k++) {
    const mid = (lo + hi) / 2;
    if (progresso(mid, n) < alvo) lo = mid;
    else hi = mid;
  }
  return Math.round(hi);
}

// ─── letreiro de LED rolando ─────────────────────────────────────────────

const Letreiro: React.FC<{ texto: string; cor?: string; y?: number }> = ({ texto, cor = '#ff9a1f', y = SEGURO.topo - 10 }) => {
  const f = useCurrentFrame();
  const rep = `${texto}　　　${texto}　　　`;
  const x = -((f * 7) % (rep.length * 26));
  return (
    <div style={{ position: 'absolute', top: y, left: 0, right: 0, height: 92, background: '#0b0b0b', overflow: 'hidden', borderTop: '6px solid #2a2a2a', borderBottom: '6px solid #2a2a2a' }}>
      <div style={{ position: 'absolute', top: 12, left: x, whiteSpace: 'nowrap', fontFamily: LED, fontSize: 56, color: cor, textShadow: `0 0 10px ${cor}`, letterSpacing: 4 }}>
        {rep}
        {rep}
      </div>
      {/* grade de pontos do LED */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 56%)', backgroundSize: '5px 5px' }} />
    </div>
  );
};

// ─── painel da porta (次は) ──────────────────────────────────────────────

const PainelPorta: React.FC<{ seg: SegMapa }> = ({ seg }) => {
  const f = useCurrentFrame();
  const p = useProgresso();
  const modo = principal(seg.modos);
  const cor = COR_MODO[modo];
  const estacoes = seg.pontos;
  const destino = estacoes[estacoes.length - 1];
  const a = interpolate(f, [0, 12], [0, 1], clamp);
  // alterna japonês / português no "próxima", como os painéis de verdade
  const emJapones = Math.floor(f / 45) % 2 === 0;
  const x0 = 120;
  const x1 = W - 120;
  const yLinha = 1180;
  const xs = estacoes.map((_, i) => x0 + ((x1 - x0) * i) / (estacoes.length - 1));
  const xTrem = x0 + (x1 - x0) * p;
  const chegou = p >= 0.999;
  return (
    <AbsoluteFill style={{ background: '#f4f4f1', fontFamily: FONTE }}>
      <Letreiro texto={`${NOME_MODO[modo][0]}　${destino.jp ?? ''}${destino.jp ? ' 行' : ''}　·　${NOME_MODO[modo][1]} PARA ${destino.nome.toUpperCase()}　·　${seg.quando ?? ''}`} />

      {/* faixa com a cor da linha */}
      <div style={{ position: 'absolute', top: SEGURO.topo + 110, left: 0, right: 0, height: 74, background: cor, display: 'flex', alignItems: 'center', gap: 18, padding: '0 64px', opacity: a }}>
        <div style={{ width: 52, height: 52, borderRadius: 10, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconeHtml modo={modo} tam={36} cor={cor} />
        </div>
        <div style={{ fontSize: 36, fontWeight: 900, color: '#fff', letterSpacing: 2 }}>{seg.legenda ?? NOME_MODO[modo][1]}</div>
      </div>

      {/* 次は / próxima */}
      <div style={{ position: 'absolute', top: 470, left: 64, right: 64, opacity: a }}>
        <div style={{ fontSize: 44, fontWeight: 900, color: chegou ? '#d9302c' : '#1a1a1a' }}>{chegou ? (emJapones ? 'まもなく' : 'Chegando') : emJapones ? '次は' : 'Próxima'}</div>
        <div style={{ fontSize: destino.jp && emJapones ? 200 : 140, fontWeight: 900, color: '#111', lineHeight: 1.05, marginTop: 6, whiteSpace: 'nowrap' }}>{destino.jp && emJapones ? destino.jp : destino.nome}</div>
        <div style={{ fontSize: 46, fontWeight: 700, color: '#666', marginTop: 8 }}>{destino.jp && emJapones ? destino.nome : (destino.sub ?? seg.titulo ?? '')}</div>
      </div>

      {/* diagrama da linha */}
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        <line x1={x0} y1={yLinha} x2={x1} y2={yLinha} stroke={cor} strokeWidth={26} strokeLinecap="round" />
        <line x1={x0} y1={yLinha} x2={xTrem} y2={yLinha} stroke="#b9bcc2" strokeWidth={26} strokeLinecap="round" />
        {estacoes.map((e, i) => {
          const passou = xs[i] <= xTrem + 1;
          const atual = i === estacoes.length - 1;
          return (
            <g key={i}>
              <circle cx={xs[i]} cy={yLinha} r={e.passagem ? 16 : 26} fill="#fff" stroke={passou && !atual ? '#9a9da3' : '#111'} strokeWidth={8} />
              {atual ? <circle cx={xs[i]} cy={yLinha} r={44} fill="none" stroke="#d9302c" strokeWidth={6} opacity={0.5 + 0.5 * Math.sin(f / 4)} /> : null}
            </g>
          );
        })}
        {/* o trem: seta com o ícone */}
        <g transform={`translate(${xTrem},${yLinha - 86})`}>
          <path d="M -50 -34 H 30 L 58 0 L 30 34 H -50 Z" fill="#d9302c" />
          <g transform="translate(-6,0)">
            <Icone modo={modo} tam={44} cor="#fff" giro={90} />
          </g>
          <path d="M -8 34 L 0 54 L 8 34 Z" fill="#d9302c" />
        </g>
      </svg>
      {estacoes.map((e, i) => (
        <div key={i} style={{ position: 'absolute', top: yLinha + 44, left: xs[i] - 110, width: 220, textAlign: 'center', opacity: a }}>
          {e.jp ? <div style={{ fontSize: 30, fontWeight: 900, color: '#111' }}>{e.jp}</div> : null}
          <div style={{ fontSize: e.passagem ? 24 : 28, fontWeight: 700, color: e.passagem ? '#777' : '#222', lineHeight: 1.15 }}>{e.nome}</div>
        </div>
      ))}
    </AbsoluteFill>
  );
};

// ─── painel de partidas (voos) ───────────────────────────────────────────

const ROLETA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
/** texto de placa de palhetas: cada letra gira até parar, uma depois da outra */
const Palhetas: React.FC<{ texto: string; inicio: number; tam: number; cor?: string; largura?: number }> = ({ texto, inicio, tam, cor = '#ffd23f', largura }) => {
  const f = useCurrentFrame();
  const chars = (largura ? texto.padEnd(largura) : texto).split('');
  return (
    <span style={{ display: 'inline-flex', gap: 3 }}>
      {chars.map((c, k) => {
        const para = inicio + k * 1.1 + 4;
        const mostra = f >= para || c === ' ' ? c : ROLETA[(Math.floor(f * 1.7) + k * 7) % ROLETA.length];
        return (
          <span key={k} style={{ width: tam * 0.68, height: tam * 1.25, background: '#1b1b1b', borderRadius: 4, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: LED, fontSize: tam, color: cor, boxShadow: 'inset 0 -2px 0 #000, inset 0 2px 0 #2e2e2e', position: 'relative' }}>
            {mostra}
            <span style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 2, background: '#000' }} />
          </span>
        );
      })}
    </span>
  );
};

const PainelPartidas: React.FC<{ seg: SegMapa }> = ({ seg }) => {
  const f = useCurrentFrame();
  const { durationInFrames: n } = useVideoConfig();
  const p = useProgresso();
  const pernas = seg.pontos.slice(1).map((b, i) => ({ a: seg.pontos[i], b }));
  const tam = 40;
  return (
    <AbsoluteFill style={{ background: '#0e0f12', fontFamily: FONTE }}>
      <div style={{ position: 'absolute', top: SEGURO.topo, left: 50, right: 50, display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ width: 90, height: 90, borderRadius: 14, background: '#ffd23f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconeHtml modo="aviao" tam={60} cor="#0e0f12" />
        </div>
        <div>
          <div style={{ fontSize: 58, fontWeight: 900, color: '#fff', lineHeight: 1 }}>Partidas</div>
          <div style={{ fontSize: 30, fontWeight: 700, color: '#9aa0aa' }}>出発 · DEPARTURES · {seg.quando}</div>
        </div>
      </div>
      <div style={{ position: 'absolute', top: SEGURO.topo + 170, left: 40, right: 40 }}>
        <div style={{ display: 'flex', gap: 24, fontSize: 24, fontWeight: 700, color: '#9aa0aa', padding: '0 6px 10px', borderBottom: '2px solid #2a2c31' }}>
          <span style={{ width: 160 }}>VOO</span>
          <span style={{ flex: 1 }}>DESTINO</span>
          <span style={{ width: 230 }}>SITUAÇÃO</span>
        </div>
        {pernas.map(({ a, b }, i) => {
          const f0 = quadroDoProgresso(i / pernas.length, n);
          const f1 = quadroDoProgresso((i + 1) / pernas.length, n);
          const [status, desde] = f < f0 ? ['EMBARQUE', 14 + i * 8] : f < f1 ? ['EM VOO', f0] : ['POUSOU', f1];
          const corStatus = status === 'EM VOO' ? '#4ade80' : status === 'POUSOU' ? '#9aa0aa' : '#ffd23f';
          return (
            <div key={i} style={{ display: 'flex', gap: 24, alignItems: 'center', padding: '22px 6px', borderBottom: '2px solid #1f2125' }}>
              <span style={{ width: 160 }}>
                <Palhetas texto={`V${i + 1}`} inicio={6 + i * 8} tam={tam} largura={3} />
              </span>
              <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Palhetas texto={b.nome.toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g, '')} inicio={10 + i * 8} tam={tam} largura={10} />
                <span style={{ fontSize: 26, color: '#9aa0aa' }}>de {a.nome}{a.sub ? ` · ${a.sub}` : ''}</span>
              </span>
              <span style={{ width: 230 }}>
                <Palhetas texto={status as string} inicio={desde as number} tam={30} cor={corStatus} largura={8} />
              </span>
            </div>
          );
        })}
      </div>
      {/* o avião atravessando a rota */}
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        {(() => {
          const y = 1290;
          const xs = seg.pontos.map((_, i) => 120 + ((W - 240) * i) / (seg.pontos.length - 1));
          const xa = 120 + (W - 240) * p;
          return (
            <>
              <line x1={120} y1={y} x2={W - 120} y2={y} stroke="#2a2c31" strokeWidth={8} strokeDasharray="4 16" strokeLinecap="round" />
              <line x1={120} y1={y} x2={xa} y2={y} stroke="#ffd23f" strokeWidth={8} strokeLinecap="round" />
              {xs.map((x, i) => (
                <g key={i}>
                  <circle cx={x} cy={y} r={16} fill="#0e0f12" stroke="#ffd23f" strokeWidth={6} />
                  <text x={x} y={y + 60} fill="#fff" fontSize={30} fontWeight={700} textAnchor="middle" fontFamily={FONTE}>
                    {seg.pontos[i].sub?.split(' · ')[0] ?? seg.pontos[i].nome}
                  </text>
                </g>
              ))}
              <g transform={`translate(${xa},${y - 4})`}>
                <circle r={34} fill="#ffd23f" />
                <Icone modo="aviao" tam={44} cor="#0e0f12" giro={90} />
              </g>
            </>
          );
        })()}
      </svg>
      <div style={{ position: 'absolute', bottom: SEGURO.base + 20, left: 50, right: 50, fontSize: 34, fontWeight: 700, color: '#fff', opacity: interpolate(f, [n * 0.3, n * 0.4], [0, 1], clamp) }}>{seg.legenda}</div>
    </AbsoluteFill>
  );
};

// ─── clipe com a placa de estação ────────────────────────────────────────

export interface Estacao {
  nome: string;
  jp?: string;
  /** modo de transporte para chegar à próxima */
  modo: Modo;
}

/** as "estações" da semana: aeroportos do começo + cada lugar dos vídeos, com o modo entre elas */
export function estacoesDoPlano(plano: Plano): Estacao[] {
  const out: Estacao[] = [];
  let modo: Modo = 'ape';
  for (const s of plano.segmentos) {
    if (s.tipo === 'mapa') {
      modo = principal(s.modos);
      if (out.length) out[out.length - 1].modo = modo;
      if (s.escala === 'globo') s.pontos.slice(0, -1).forEach((p) => out.push({ nome: p.nome, jp: p.jp, modo: 'aviao' }));
    } else if (s.tipo === 'clipe' && s.lugar && out[out.length - 1]?.nome !== s.lugar.nome) {
      out.push({ nome: s.lugar.nome, jp: s.lugar.jp, modo: 'ape' });
    }
  }
  return out;
}

const PlacaEstacao: React.FC<{ seg: SegClipe; plano: Plano; cor: string }> = ({ seg, plano, cor }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - 4, fps, config: { damping: 15 } });
  const est = estacoesDoPlano(plano);
  const i = est.findIndex((e) => e.nome === seg.lugar?.nome);
  const ant = est[i - 1];
  const prox = est[i + 1];
  const jp = seg.lugar?.jp;
  return (
    <div style={{ position: 'absolute', left: 50, right: 50, bottom: SEGURO.base + 20, transform: `translateY(${(1 - s) * 420}px)`, fontFamily: FONTE }}>
      <div style={{ background: '#fbfbf8', borderRadius: 18, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.45)', border: '3px solid #d7d7d2' }}>
        <div style={{ position: 'relative', padding: '22px 30px 18px', textAlign: 'center' }}>
          <div style={{ position: 'absolute', left: 24, top: 24, width: 92, height: 92, borderRadius: 10, border: `8px solid ${cor}`, background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>
            <span style={{ fontSize: 20, fontWeight: 900, color: '#111' }}>JP</span>
            <span style={{ fontSize: 40, fontWeight: 900, color: '#111' }}>{String(i + 1).padStart(2, '0')}</span>
          </div>
          {jp ? <div style={{ fontSize: jp.length > 4 ? 76 : 100, fontWeight: 900, color: '#111', lineHeight: 1.05, letterSpacing: 8 }}>{jp}</div> : null}
          <div style={{ fontSize: jp ? 42 : 80, fontWeight: 900, color: '#222', marginTop: 2 }}>{seg.lugar?.nome}</div>
          {seg.lugar?.linha ? <div style={{ fontSize: 24, fontWeight: 700, color: '#888', marginTop: 4 }}>{seg.lugar.linha}</div> : null}
        </div>
        <div style={{ background: cor, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 26px', color: '#fff', fontSize: 30, fontWeight: 900 }}>
          <span>{ant ? `◀ ${ant.jp ?? ''} ${ant.nome}` : ''}</span>
          <span>{prox ? `${prox.nome} ${prox.jp ?? ''} ▶` : '終点 fim'}</span>
        </div>
      </div>
    </div>
  );
};

const Aviso: React.FC<{ titulo?: string; texto: string }> = ({ titulo, texto }) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames: n } = useVideoConfig();
  const a = interpolate(f, [fps * 0.7, fps * 1.0], [0, 1], clamp);
  const sai = interpolate(f, [n - fps * 0.4, n - fps * 0.1], [1, 0], clamp);
  return (
    <div style={{ position: 'absolute', top: SEGURO.topo, left: 50, right: SEGURO.direita - 40, opacity: a * sai, fontFamily: FONTE, borderRadius: 14, overflow: 'hidden', boxShadow: '0 14px 30px rgba(0,0,0,0.45)' }}>
      <div style={{ background: '#ff9a1f', color: '#111', fontSize: 26, fontWeight: 900, padding: '8px 22px', letterSpacing: 2 }}>ご案内 · HISTÓRIA{titulo ? ` · ${titulo}` : ''}</div>
      <div style={{ background: 'rgba(14,20,32,0.92)', color: '#fff', fontSize: 32, fontWeight: 700, lineHeight: 1.4, padding: '18px 22px 22px' }}>{texto}</div>
    </div>
  );
};

const Clipe: React.FC<{ seg: SegClipe; plano: Plano; i: number }> = ({ seg, plano, i }) => {
  // cor da linha: o modo do último mapa antes deste vídeo
  const antes = plano.segmentos.slice(0, i).reverse().find((s): s is SegMapa => s.tipo === 'mapa');
  const cor = COR_MODO[antes ? principal(antes.modos) : 'trem'];
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <MidiaCheia seg={seg} />
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)' }} />
      {seg.nota ? <Aviso {...seg.nota} /> : null}
      {seg.lugar ? <PlacaEstacao seg={seg} plano={plano} cor={cor} /> : null}
    </AbsoluteFill>
  );
};

// ─── fecho: o mapa da linha ──────────────────────────────────────────────

const Rosenzu: React.FC<{ seg: SegFim; plano: Plano }> = ({ seg, plano }) => {
  const f = useCurrentFrame();
  const { durationInFrames: n } = useVideoConfig();
  const est = estacoesDoPlano(plano);
  const y0 = 560;
  const y1 = H - SEGURO.base - 170;
  const ys = est.map((_, i) => y0 + ((y1 - y0) * i) / Math.max(1, est.length - 1));
  const p = interpolate(f, [8, n * 0.6], [0, 1], clamp);
  const yP = y0 + (y1 - y0) * p;
  const x = 170;
  return (
    <AbsoluteFill style={{ background: '#f4f4f1', fontFamily: FONTE }}>
      <Letreiro texto={`終点　·　${seg.titulo.toUpperCase()}　·　${seg.sub ?? ''}　·　ご乗車ありがとうございました`} />
      <div style={{ position: 'absolute', top: SEGURO.topo + 110, left: 64, right: 64 }}>
        <div style={{ fontSize: 34, fontWeight: 900, color: '#d9302c' }}>路線図 · mapa da linha</div>
        <div style={{ fontSize: 74, fontWeight: 900, color: '#111', lineHeight: 1.05 }}>{seg.titulo}</div>
      </div>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        {est.slice(0, -1).map((e, i) => {
          const ya = ys[i];
          const yb = ys[i + 1];
          const yv = Math.min(yb, Math.max(ya, yP));
          return yv > ya ? <line key={i} x1={x} y1={ya} x2={x} y2={yv} stroke={COR_MODO[e.modo]} strokeWidth={24} strokeDasharray={e.modo === 'aviao' ? '2 30' : e.modo === 'ape' ? '2 18' : undefined} strokeLinecap="round" /> : null;
        })}
        {est.map((e, i) => (ys[i] <= yP + 1 ? <circle key={i} cx={x} cy={ys[i]} r={22} fill="#fff" stroke="#111" strokeWidth={8} /> : null))}
      </svg>
      {est.map((e, i) =>
        ys[i] <= yP + 1 ? (
          <div key={i} style={{ position: 'absolute', left: x + 50, top: ys[i] - 30, display: 'flex', alignItems: 'baseline', gap: 16, whiteSpace: 'nowrap' }}>
            <span style={{ fontSize: 22, fontWeight: 900, color: '#fff', background: '#111', borderRadius: 6, padding: '2px 8px' }}>JP{String(i + 1).padStart(2, '0')}</span>
            {e.jp ? <span style={{ fontSize: 40, fontWeight: 900, color: '#111' }}>{e.jp}</span> : null}
            <span style={{ fontSize: 32, fontWeight: 700, color: '#444' }}>{e.nome}</span>
            {i < est.length - 1 && e.modo !== 'ape' ? (
              <span style={{ fontSize: 22, fontWeight: 900, color: '#fff', background: COR_MODO[e.modo], borderRadius: 999, padding: '4px 12px', alignSelf: 'center' }}>{NOME_MODO[e.modo][1]} ↓</span>
            ) : null}
          </div>
        ) : null,
      )}
      {seg.numeros ? (
        <div style={{ position: 'absolute', bottom: SEGURO.base + 10, left: 64, right: 64, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {seg.numeros.map((t, i) => (
            <span key={i} style={{ fontSize: 28, fontWeight: 900, color: '#111', border: '4px solid #111', borderRadius: 10, padding: '6px 16px', opacity: interpolate(f, [n * 0.6 + i * 5, n * 0.6 + i * 5 + 8], [0, 1], clamp) }}>
              {t}
            </span>
          ))}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ─── transição: portas do trem ───────────────────────────────────────────

const Portas: React.FC<TransitionPresentationComponentProps<Record<string, unknown>>> = ({ children, presentationDirection, presentationProgress: p }) => {
  if (presentationDirection === 'exiting') return <AbsoluteFill style={{ opacity: p < 0.5 ? 1 : 0 }}>{children}</AbsoluteFill>;
  const fecha = p < 0.5 ? p / 0.5 : (1 - p) / 0.5;
  const largura = (W / 2) * suave(fecha);
  const folha = (lado: 'esq' | 'dir') => (
    <div
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        [lado === 'esq' ? 'left' : 'right']: 0,
        width: largura,
        background: 'linear-gradient(90deg, #c9ccd1, #e6e8eb 40%, #c2c5ca)',
        borderRight: lado === 'esq' ? '10px solid #2a2a2a' : undefined,
        borderLeft: lado === 'dir' ? '10px solid #2a2a2a' : undefined,
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', top: 360, bottom: 760, [lado === 'esq' ? 'right' : 'left']: 70, width: 320, background: 'rgba(30,40,55,0.55)', borderRadius: 18, border: '6px solid #9a9da3' }} />
    </div>
  );
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: p >= 0.5 ? 1 : 0 }}>{children}</AbsoluteFill>
      {folha('esq')}
      {folha('dir')}
    </AbsoluteFill>
  );
};
const portas = (): TransitionPresentation<Record<string, unknown>> => ({ component: Portas, props: {} });

// ─── o reel ──────────────────────────────────────────────────────────────

const Segm: React.FC<SegProps> = ({ s, i, plano }) => {
  if (s.tipo === 'clipe') return <Clipe seg={s} plano={plano} i={i} />;
  if (s.tipo === 'fim') return <Rosenzu seg={s} plano={plano} />;
  return s.escala === 'globo' ? <PainelPartidas seg={s} /> : <PainelPorta seg={s} />;
};

const FONTES = ['400 40px "DotGothic16"', '700 40px "Zen Kaku Gothic New"', '900 40px "Zen Kaku Gothic New"'];

export const ReelLinha: React.FC<Plano> = (plano) => <ReelPadrao plano={plano} fontes={FONTES} Segmento={Segm} transicao={() => portas()} />;
