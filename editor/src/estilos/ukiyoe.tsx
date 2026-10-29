/**
 * Estilo "ukiyo-e", inspirado nas 53 Estações da Tōkaidō de Hiroshige: azul da
 * Prússia, papel washi, céu em degradê (bokashi), mar de escamas (seigaiha),
 * cartucho vermelho vertical com o nome em japonês, selo vermelho, e a troca
 * de cena desenrolando como um rolo (emaki), da direita para a esquerda.
 */
import '@fontsource/yuji-syuku/400.css';
import '@fontsource/shippori-mincho/500.css';
import '@fontsource/shippori-mincho/800.css';
import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import type { TransitionPresentation, TransitionPresentationComponentProps } from '@remotion/transitions';
import { IconeHtml, Selo } from '../icones.tsx';
import { MapaCena, fmtKm, type PinoProps, type RotuloProps, type VisualMapa } from '../Mapa.tsx';
import { Midia } from '../Midia.tsx';
import type { Modo, Plano, Ponto, SegClipe, SegFim } from '../plano.ts';
import { clamp } from '../rota.ts';
import { H, SEGURO, W } from '../tema.ts';
import { ReelPadrao, type SegProps } from './base.tsx';
import { Polaroid } from './noite.tsx';

const C = {
  washi: '#efe4c9',
  washiClaro: '#f6eed9',
  ai: '#1d3a6e',
  aiMedio: '#2f5891',
  aiClaro: '#d7e2ec',
  sumi: '#221a14',
  beni: '#c23a2b',
  kihada: '#e2b54a',
};
const PINCEL = '"Yuji Syuku", "Shippori Mincho", serif';
const MINCHO = '"Shippori Mincho", serif';

/** escamas de onda (seigaiha): fileiras de leques sobrepostos */
const Seigaiha: React.FC<{ id: string; r?: number }> = ({ id, r = 34 }) => {
  const centros: [number, number][] = [
    [r, -r / 2],
    [0, 0],
    [2 * r, 0],
    [r, r / 2],
    [0, r],
    [2 * r, r],
    [r, (3 * r) / 2],
  ];
  return (
    <pattern id={id} width={2 * r} height={r} patternUnits="userSpaceOnUse">
      <rect width={2 * r} height={r} fill={C.aiMedio} />
      {centros.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={r} fill={C.aiMedio} />
          {[0.9, 0.7, 0.5, 0.3].map((k) => (
            <circle key={k} cx={x} cy={y} r={r * k} fill="none" stroke={C.aiClaro} strokeWidth={r * 0.06} opacity={0.75} />
          ))}
        </g>
      ))}
    </pattern>
  );
};

/** degradê de céu escuro no alto, como nas gravuras */
const Bokashi: React.FC<{ forte?: number }> = ({ forte = 0.92 }) => (
  <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(20,38,78,${forte}) 0%, rgba(20,38,78,${forte * 0.6}) 9%, rgba(20,38,78,0) 22%)`, pointerEvents: 'none' }} />
);

/** textura de papel por cima de tudo */
const Washi: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'multiply', opacity: 0.5 }}>
    <svg width={W} height={H}>
      <filter id="fibras">
        <feTurbulence type="fractalNoise" baseFrequency="0.012 0.5" numOctaves="3" seed="11" />
        <feColorMatrix type="matrix" values="0 0 0 0 0.55  0 0 0 0 0.45  0 0 0 0 0.3  0 0 0 0.22 0" />
      </filter>
      <rect width={W} height={H} filter="url(#fibras)" />
    </svg>
  </AbsoluteFill>
);

/** cartucho vertical: retângulo com borda dupla e texto de cima para baixo */
export const Cartucho: React.FC<{ texto: string; cor?: string; tinta?: string; tam?: number; largura?: number }> = ({ texto, cor = C.beni, tinta = C.washiClaro, tam = 54, largura = 96 }) => (
  <div
    style={{
      background: cor,
      border: `3px solid ${C.sumi}`,
      outline: `2px solid ${cor}`,
      outlineOffset: 3,
      width: largura,
      padding: '18px 0',
      display: 'flex',
      justifyContent: 'center',
      boxShadow: '0 6px 14px rgba(0,0,0,0.25)',
    }}
  >
    <div style={{ writingMode: 'vertical-rl', fontFamily: PINCEL, fontSize: tam, color: tinta, letterSpacing: 6, lineHeight: 1 }}>{texto}</div>
  </div>
);

/** selo (hanko) quadrado vermelho com um kanji */
const Hanko: React.FC<{ kanji: string; tam?: number; giro?: number }> = ({ kanji, tam = 84, giro = 0 }) => (
  <div
    style={{
      width: tam,
      height: tam,
      background: C.beni,
      borderRadius: 6,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transform: `rotate(${giro}deg)`,
      boxShadow: 'inset 0 0 0 4px rgba(239,228,201,0.55)',
      mixBlendMode: 'multiply',
    }}
  >
    <span style={{ fontFamily: PINCEL, fontSize: tam * 0.62, color: C.washiClaro }}>{kanji}</span>
  </div>
);

// ─── mapa ────────────────────────────────────────────────────────────────

const Rotulo: React.FC<RotuloProps> = ({ x, y, p, aparece, cinza }) => {
  const esquerda = x > W * 0.62;
  const pequeno = p.passagem || cinza;
  if (pequeno) {
    return (
      <div style={{ position: 'absolute', left: esquerda ? undefined : x + 16, right: esquerda ? W - x + 16 : undefined, top: y - 18, opacity: aparece * (cinza ? 0.6 : 1), fontFamily: MINCHO, fontSize: 24, fontWeight: 500, color: C.sumi, whiteSpace: 'nowrap' }}>
        {p.nome}
      </div>
    );
  }
  return (
    <div
      style={{
        position: 'absolute',
        left: esquerda ? undefined : x + 30,
        right: esquerda ? W - x + 30 : undefined,
        top: y - 40,
        opacity: aparece,
        transform: `translateY(${(1 - aparece) * 10}px)`,
        display: 'flex',
        flexDirection: esquerda ? 'row-reverse' : 'row',
        alignItems: 'flex-start',
        gap: 8,
        whiteSpace: 'nowrap',
      }}
    >
      {p.jp ? <Cartucho texto={p.jp} tam={30} largura={50} /> : null}
      <div style={{ background: C.washiClaro, border: `2px solid ${C.sumi}`, padding: '6px 14px 8px', textAlign: esquerda ? 'right' : 'left' }}>
        <div style={{ fontFamily: MINCHO, fontSize: 36, fontWeight: 800, color: C.sumi, lineHeight: 1.1 }}>{p.nome}</div>
        {p.sub ? <div style={{ fontFamily: MINCHO, fontSize: 22, fontWeight: 500, color: C.aiMedio }}>{p.sub}</div> : null}
      </div>
    </div>
  );
};

const Pino: React.FC<PinoProps> = ({ p, s }) => (p.passagem ? <circle r={7 * s} fill={C.sumi} /> : <circle r={13 * s} fill={C.beni} stroke={C.sumi} strokeWidth={4} />);

const UKIYOE: VisualMapa = {
  fundo: C.washi,
  fonte: MINCHO,
  globo: { mar: 'url(#seigaiha)', borda: C.sumi, grade: 'rgba(0,0,0,0)', terra: C.washi, terraBorda: C.sumi, divisa: 'rgba(34,26,20,0.3)', atmosfera: 'none' },
  mar: 'url(#seigaiha)',
  terra: C.washi,
  terraBorda: C.sumi,
  divisa: 'rgba(34,26,20,0.15)',
  costa: 2.2,
  larguraBorda: 2.4,
  vizinhosOpacidade: 1,
  rota: { cor: C.beni, largura: 8, futura: 'rgba(34,26,20,0.45)', futuraTracejado: '2 12' },
  defs: <Seigaiha id="seigaiha" />,
  Pino,
  Rotulo,
  Selo: ({ modo, x, y, giro }) => <Selo modo={modo} x={x} y={y} giro={giro} cor={C.beni} corIcone={C.washiClaro} borda={C.sumi} halo={false} />,
  Polaroid: (p) => <Polaroid {...p} papel={C.washiClaro} tinta={C.sumi} fonte={MINCHO} />,
};

/** título do mapa: faixa de papel à esquerda + cartucho vermelho com o destino à direita */
const Cabecalho: React.FC<{ quando?: string; titulo?: string; destino?: Ponto }> = ({ quando, titulo, destino }) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [2, 18], [0, 1], clamp);
  return (
    <>
      <div style={{ position: 'absolute', top: SEGURO.topo - 10, left: SEGURO.esquerda, maxWidth: 760, opacity: a, background: C.washiClaro, border: `3px solid ${C.sumi}`, padding: '12px 24px 16px', boxShadow: '0 8px 18px rgba(0,0,0,0.25)' }}>
        {quando ? <div style={{ fontFamily: MINCHO, fontSize: 26, fontWeight: 500, color: C.beni, letterSpacing: 3 }}>{quando}</div> : null}
        {titulo ? <div style={{ fontFamily: MINCHO, fontSize: 58, fontWeight: 800, color: C.sumi, lineHeight: 1.1 }}>{titulo}</div> : null}
      </div>
      {destino?.jp ? (
        <div style={{ position: 'absolute', top: SEGURO.topo - 30, right: 56, opacity: a, transform: `translateY(${(1 - a) * -30}px)` }}>
          <Cartucho texto={destino.jp} tam={64} largura={104} />
        </div>
      ) : null}
    </>
  );
};

const Legenda: React.FC<{ modos: Modo[]; texto?: string; km?: number }> = ({ modos, texto, km }) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [10, 26], [0, 1], clamp);
  const unicos = modos.filter((m, i) => modos.indexOf(m) === i);
  return (
    <div style={{ position: 'absolute', bottom: SEGURO.base + 16, left: SEGURO.esquerda, right: SEGURO.esquerda, opacity: a, display: 'flex', alignItems: 'center', gap: 16, background: C.washiClaro, border: `3px solid ${C.sumi}`, padding: '14px 22px' }}>
      {unicos.map((m) => (
        <div key={m} style={{ width: 52, height: 52, borderRadius: 26, background: C.beni, border: `3px solid ${C.sumi}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconeHtml modo={m} tam={28} cor={C.washiClaro} />
        </div>
      ))}
      <div style={{ flex: 1, fontFamily: MINCHO, fontSize: 30, fontWeight: 800, color: C.sumi }}>{texto}</div>
      {km !== undefined ? (
        <div style={{ fontFamily: MINCHO, fontSize: 40, fontWeight: 800, color: C.beni, whiteSpace: 'nowrap' }}>
          {fmtKm(km)} <span style={{ fontSize: 22, color: C.sumi }}>km</span>
        </div>
      ) : null}
    </div>
  );
};

// ─── clipe: a gravura ────────────────────────────────────────────────────

const MARGEM = 46;

const Clipe: React.FC<{ seg: SegClipe }> = ({ seg }) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames: n } = useVideoConfig();
  const a = interpolate(f, [6, 22], [0, 1], clamp);
  const nota = interpolate(f, [fps * 0.7, fps * 1.15], [0, 1], clamp);
  const sai = interpolate(f, [n - fps * 0.45, n - fps * 0.1], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ background: C.washi }}>
      {/* a imagem, dentro da margem de papel, com filete de tinta */}
      <div style={{ position: 'absolute', left: MARGEM, top: MARGEM, right: MARGEM, bottom: MARGEM, overflow: 'hidden', outline: `3px solid ${C.sumi}`, outlineOffset: 6 }}>
        <AbsoluteFill style={{ filter: 'saturate(0.82) contrast(1.06) sepia(0.2)' }}>
          <Midia seg={seg} />
        </AbsoluteFill>
        <Bokashi forte={0.85} />
      </div>

      {/* cartucho com o nome em japonês, e o nome em português ao lado */}
      {seg.lugar ? (
        <div style={{ position: 'absolute', top: SEGURO.topo - 50, right: 76, display: 'flex', flexDirection: 'row-reverse', alignItems: 'flex-start', gap: 12, opacity: a, transform: `translateY(${(1 - a) * -24}px)` }}>
          {seg.lugar.jp ? <Cartucho texto={seg.lugar.jp} tam={seg.lugar.jp.length > 4 ? 46 : 58} largura={100} /> : null}
          <div style={{ background: C.washiClaro, border: `3px solid ${C.sumi}`, padding: '10px 18px 12px', maxWidth: 520, marginTop: 20 }}>
            <div style={{ fontFamily: MINCHO, fontSize: 44, fontWeight: 800, color: C.sumi, lineHeight: 1.1 }}>{seg.lugar.nome}</div>
            {seg.lugar.linha ? <div style={{ fontFamily: MINCHO, fontSize: 22, fontWeight: 500, color: C.aiMedio, marginTop: 4 }}>{seg.lugar.linha}</div> : null}
          </div>
        </div>
      ) : null}

      {/* assinatura e selo, como o artista fazia */}
      <div style={{ position: 'absolute', left: 82, bottom: SEGURO.base + (seg.nota ? 300 : 30), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, opacity: a }}>
        <div style={{ writingMode: 'vertical-rl', fontFamily: PINCEL, fontSize: 34, color: C.washiClaro, textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}>二〇二六年</div>
        <Hanko kanji="旅" tam={70} giro={-3} />
      </div>

      {seg.nota ? (
        <div
          style={{
            position: 'absolute',
            left: 82,
            right: SEGURO.direita,
            bottom: SEGURO.base + 16,
            background: C.washiClaro,
            border: `3px solid ${C.sumi}`,
            padding: '18px 26px 22px',
            opacity: nota * sai,
            transform: `translateY(${(1 - nota) * 20}px)`,
            boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
          }}
        >
          <div style={{ position: 'absolute', right: -16, top: -22 }}>
            <Hanko kanji="史" tam={54} giro={6} />
          </div>
          {seg.nota.titulo ? <div style={{ fontFamily: MINCHO, fontSize: 22, fontWeight: 800, letterSpacing: 3, color: C.beni, marginBottom: 6 }}>{seg.nota.titulo.toUpperCase()}</div> : null}
          <div style={{ fontFamily: MINCHO, fontSize: 31, fontWeight: 500, color: C.sumi, lineHeight: 1.42 }}>{seg.nota.texto}</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ─── fecho ───────────────────────────────────────────────────────────────

const Fim: React.FC<{ seg: SegFim }> = ({ seg }) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [4, 22], [0, 1], clamp);
  const k = interpolate(f, [10, 34], [0, 1], { ...clamp, easing: (x) => 1 - Math.pow(1 - x, 3) });
  return (
    <MapaCena visual={UKIYOE} escala="regiao" pontos={seg.pontos} modos={['trem']} janela={[0.05, 0.55]} chegarPerto={false}>
      {() => (
        <>
          <Bokashi />
          <div style={{ position: 'absolute', top: SEGURO.topo - 30, right: 56, opacity: a }}>
            <Cartucho texto="日本の旅" tam={64} largura={108} />
          </div>
          <div style={{ position: 'absolute', top: SEGURO.topo + 20, left: SEGURO.esquerda, opacity: a, background: C.washiClaro, border: `3px solid ${C.sumi}`, padding: '14px 26px 18px' }}>
            <div style={{ fontFamily: MINCHO, fontSize: 70, fontWeight: 800, color: C.sumi, lineHeight: 1.05 }}>{seg.titulo}</div>
            {seg.sub ? <div style={{ fontFamily: MINCHO, fontSize: 28, fontWeight: 500, color: C.aiMedio }}>{seg.sub}</div> : null}
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 1040, textAlign: 'center', fontFamily: PINCEL, fontSize: 300, color: C.sumi, opacity: k * 0.9, transform: `scale(${1.3 - 0.3 * k})` }}>旅</div>
          {seg.numeros ? (
            <div style={{ position: 'absolute', bottom: SEGURO.base + 16, left: SEGURO.esquerda, right: SEGURO.esquerda, display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
              {seg.numeros.map((n, i) => (
                <div key={i} style={{ fontFamily: MINCHO, fontSize: 28, fontWeight: 800, color: C.sumi, background: C.washiClaro, border: `3px solid ${C.sumi}`, padding: '8px 20px', opacity: interpolate(f, [24 + i * 6, 34 + i * 6], [0, 1], clamp) }}>
                  {n}
                </div>
              ))}
            </div>
          ) : null}
        </>
      )}
    </MapaCena>
  );
};

// ─── transição: o rolo desenrolando ──────────────────────────────────────

const Rolo: React.FC<TransitionPresentationComponentProps<Record<string, unknown>>> = ({ children, presentationDirection, presentationProgress: p }) => {
  if (presentationDirection === 'exiting') return <AbsoluteFill>{children}</AbsoluteFill>;
  const x = (1 - p) * W;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `inset(0 0 0 ${x}px)` }}>{children}</AbsoluteFill>
      {p < 1 ? (
        <div style={{ position: 'absolute', top: -20, bottom: -20, left: x - 22, width: 44, background: 'linear-gradient(90deg, #3b2414, #8a5a34 45%, #3b2414)', boxShadow: '-10px 0 30px rgba(0,0,0,0.45)', borderRadius: 10 }}>
          <div style={{ position: 'absolute', top: 0, left: -6, right: -6, height: 70, background: C.kihada, borderRadius: 8 }} />
          <div style={{ position: 'absolute', bottom: 0, left: -6, right: -6, height: 70, background: C.kihada, borderRadius: 8 }} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
const rolo = (): TransitionPresentation<Record<string, unknown>> => ({ component: Rolo, props: {} });

// ─── o reel ──────────────────────────────────────────────────────────────

const Segm: React.FC<SegProps> = ({ s }) => {
  if (s.tipo === 'clipe') return <Clipe seg={s} />;
  if (s.tipo === 'fim') return <Fim seg={s} />;
  return (
    <MapaCena visual={UKIYOE} escala={s.escala} pontos={s.pontos} modos={s.modos} contexto={s.contexto}>
      {({ kmAteAgora }) => (
        <>
          <Bokashi />
          <Cabecalho quando={s.quando} titulo={s.titulo} destino={s.pontos[s.pontos.length - 1]} />
          <Legenda modos={s.modos} texto={s.legenda} km={s.escala === 'globo' ? kmAteAgora : undefined} />
        </>
      )}
    </MapaCena>
  );
};

const FONTES = ['400 40px "Yuji Syuku"', '500 40px "Shippori Mincho"', '800 40px "Shippori Mincho"'];

export const ReelUkiyoe: React.FC<Plano> = (plano) => <ReelPadrao plano={plano} fontes={FONTES} Segmento={Segm} fundo={C.washi} transicao={() => rolo()} sobre={<Washi />} />;
