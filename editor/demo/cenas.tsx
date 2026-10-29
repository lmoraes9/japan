/**
 * Cenas FALSAS, desenhadas em SVG, que fazem o papel das fotos e vídeos do
 * celular no teste do fluxo. Cada vídeo tem de propósito um trecho ruim
 * (câmera no chão, tremida, alguém na frente) e um trecho bom, para o editor
 * ter o que escolher. Nada daqui vai para o vídeo de verdade.
 */
import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

const W = 1080;
const H = 1920;
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

/** tremido de câmera na mão: soma de senos, sem aleatoriedade */
function tremido(f: number, amp: number) {
  const x = Math.sin(f * 0.31) * amp + Math.sin(f * 0.83 + 1) * amp * 0.5;
  const y = Math.cos(f * 0.27) * amp + Math.sin(f * 0.71 + 2) * amp * 0.5;
  const r = Math.sin(f * 0.19) * amp * 0.04;
  return { x, y, r };
}

const Camera: React.FC<{ amp?: number; zoom?: number; dx?: number; dy?: number; blur?: number; children: React.ReactNode }> = ({
  amp = 3,
  zoom = 1,
  dx = 0,
  dy = 0,
  blur = 0,
  children,
}) => {
  const f = useCurrentFrame();
  const t = tremido(f, amp);
  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width={W}
        height={H}
        style={{
          transform: `translate(${t.x + dx}px, ${t.y + dy}px) rotate(${t.r}deg) scale(${zoom})`,
          transformOrigin: '50% 50%',
          filter: blur > 0.2 ? `blur(${blur}px)` : undefined,
        }}
      >
        {children}
      </svg>
    </AbsoluteFill>
  );
};

const Pessoa: React.FC<{ x: number; y: number; s: number; cor?: string }> = ({ x, y, s, cor = '#1b1b22' }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} fill={cor}>
    <circle cx={0} cy={-150} r={34} />
    <rect x={-46} y={-118} width={92} height={150} rx={40} />
    <rect x={-40} y={20} width={30} height={110} rx={14} />
    <rect x={10} y={20} width={30} height={110} rx={14} />
  </g>
);

// ── Aeroporto (foto) ───────────────────────────────────────────────────────
export const Aeroporto: React.FC<{ variante: 'gru' | 'jfk' }> = ({ variante }) => {
  const noite = variante === 'gru';
  const placa = noite ? 'Portão 23 · GRU · Embarque' : 'Gate B32 · JFK · Connections';
  return (
    <Camera amp={0}>
      <defs>
        <linearGradient id="ceu" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={noite ? '#0b1026' : '#f6b26b'} />
          <stop offset="1" stopColor={noite ? '#28305a' : '#fde2b8'} />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#ceu)" />
      {/* pista e luzes */}
      <rect y={1180} width={W} height={740} fill={noite ? '#15172a' : '#8c8c94'} />
      {Array.from({ length: 14 }).map((_, i) => (
        <circle key={i} cx={40 + i * 78} cy={1240 + (i % 2) * 8} r={6} fill={noite ? '#ffd27a' : '#fff'} opacity={0.9} />
      ))}
      {/* avião */}
      <g transform="translate(560,1050)" fill={noite ? '#d9dbe6' : '#ffffff'}>
        <ellipse cx={0} cy={0} rx={420} ry={62} />
        <path d="M 300 -40 L 400 -230 L 450 -230 L 410 -30 Z" fill={noite ? '#c33' : '#1e4fa1'} />
        <path d="M -60 10 L 180 10 L 60 160 L 0 160 Z" opacity={0.85} />
        {Array.from({ length: 16 }).map((_, i) => (
          <rect key={i} x={-330 + i * 40} y={-16} width={16} height={12} rx={4} fill="#3a4466" />
        ))}
      </g>
      {/* janela do saguão */}
      <g fill="none" stroke="#2a2a2e" strokeWidth={46}>
        <rect x={0} y={0} width={W} height={1500} />
        <line x1={W / 2} y1={0} x2={W / 2} y2={1500} />
        <line x1={0} y1={700} x2={W} y2={700} />
      </g>
      <rect y={1500} width={W} height={420} fill="#3b3a40" />
      {/* placa */}
      <rect x={120} y={120} width={840} height={130} rx={18} fill="#111" />
      <text x={W / 2} y={203} textAnchor="middle" fontFamily="sans-serif" fontSize={46} fontWeight={700} fill="#ffcc33">
        {placa}
      </text>
      <Pessoa x={200} y={1640} s={1.6} />
      <Pessoa x={880} y={1700} s={1.9} cor="#25252d" />
    </Camera>
  );
};

// ── Yokochō de noite (vídeo) ───────────────────────────────────────────────
export const Yokocho: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const ruim = t < 1.8; // câmera procurando o enquadramento
  const blur = interpolate(t, [0, 1.5, 1.9], [14, 10, 0], clamp);
  const dy = interpolate(t, [0, 1.8], [500, 0], clamp);
  const zoom = 1 + t * 0.012;
  const lanternas = Array.from({ length: 9 });
  return (
    <Camera amp={ruim ? 16 : 3} blur={blur} dy={dy} zoom={zoom}>
      <defs>
        <radialGradient id="lant" cx="50%" cy="45%" r="60%">
          <stop offset="0" stopColor="#fff3c4" />
          <stop offset="0.5" stopColor="#ff8a3d" />
          <stop offset="1" stopColor="#b8261b" />
        </radialGradient>
        <radialGradient id="brilho" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ffb35c" stopOpacity={0.55} />
          <stop offset="1" stopColor="#ffb35c" stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill="#07070d" />
      {/* paredes em perspectiva */}
      <path d={`M 0 0 L 430 760 L 430 1160 L 0 ${H} Z`} fill="#2a1712" />
      <path d={`M ${W} 0 L 650 760 L 650 1160 L ${W} ${H} Z`} fill="#24130f" />
      <path d={`M 0 ${H} L 430 1160 L 650 1160 L ${W} ${H} Z`} fill="#1a1414" />
      <rect x={430} y={760} width={220} height={400} fill="#3a2a2a" />
      {/* placas */}
      <g fontFamily="sans-serif" fontWeight={900} textAnchor="middle">
        <rect x={60} y={520} width={150} height={420} fill="#f4efe2" transform="skewY(18)" />
        <text x={135} y={640} fontSize={110} fill="#b3211a" transform="skewY(18)" writingMode="tb">ラーメン</text>
        <rect x={870} y={760} width={130} height={360} fill="#c62d1f" transform="skewY(-18)" />
        <text x={935} y={860} fontSize={92} fill="#fff" transform="skewY(-18)" writingMode="tb">焼鳥</text>
      </g>
      {/* lanternas balançando */}
      {lanternas.map((_, i) => {
        const lado = i % 2 === 0 ? -1 : 1;
        const k = Math.floor(i / 2) / 4;
        const x = W / 2 + lado * (480 - k * 330);
        const y = 330 + k * 470;
        const s = 1 - k * 0.72;
        const sw = Math.sin(t * 2 + i) * 4;
        return (
          <g key={i} transform={`translate(${x},${y}) rotate(${sw}) scale(${s})`}>
            <circle r={260} fill="url(#brilho)" />
            <line y1={-200} y2={-110} stroke="#222" strokeWidth={8} />
            <ellipse rx={78} ry={110} fill="url(#lant)" />
            <rect x={-48} y={-120} width={96} height={22} fill="#1a1a1a" />
            <rect x={-48} y={98} width={96} height={22} fill="#1a1a1a" />
          </g>
        );
      })}
      {/* vapor */}
      {Array.from({ length: 6 }).map((_, i) => {
        const p = (t * 0.35 + i / 6) % 1;
        return <circle key={i} cx={300 + i * 35 + Math.sin(p * 6 + i) * 30} cy={1350 - p * 600} r={60 + p * 90} fill="#fff" opacity={0.12 * (1 - p)} />;
      })}
      {/* gente andando na direção da câmera */}
      <Pessoa x={interpolate(t, [0, 7], [560, 640])} y={interpolate(t, [0, 7], [1300, 1750])} s={interpolate(t, [0, 7], [0.9, 2.4])} cor="#0d0d12" />
      <Pessoa x={470} y={1250} s={0.7} cor="#120c0c" />
    </Camera>
  );
};

// ── Sensō-ji: Kaminarimon (vídeo) ─────────────────────────────────────────
export const Sensoji: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  // 0–2,5 s: câmera apontada pro chão, tremendo; depois sobe e mostra o portão
  const dy = interpolate(t, [0, 2.2, 3.2], [-1500, -1400, 0], { ...clamp, easing: (x) => x * x * (3 - 2 * x) });
  const zoom = interpolate(t, [3.2, 8], [1, 1.08], clamp);
  return (
    <Camera amp={t < 3 ? 12 : 2.5} dy={dy} zoom={zoom}>
      <defs>
        <linearGradient id="ceuS" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7fb6e8" />
          <stop offset="1" stopColor="#d9ecf7" />
        </linearGradient>
        <radialGradient id="chochin" cx="40%" cy="40%" r="70%">
          <stop offset="0" stopColor="#ff5a3c" />
          <stop offset="1" stopColor="#a8160e" />
        </radialGradient>
      </defs>
      <rect y={-1600} width={W} height={H + 3200} fill="url(#ceuS)" />
      {/* pagode ao fundo */}
      <g transform="translate(860,520)" fill="#7a2a22">
        {Array.from({ length: 5 }).map((_, i) => (
          <g key={i} transform={`translate(0,${i * 85})`}>
            <path d={`M ${-70 - i * 12} 0 L ${70 + i * 12} 0 L ${50 + i * 10} -26 L ${-50 - i * 10} -26 Z`} fill="#3c3c44" />
            <rect x={-34 - i * 5} y={0} width={68 + i * 10} height={58} />
          </g>
        ))}
        <line y1={-30} y2={-150} stroke="#c9a23a" strokeWidth={10} />
      </g>
      {/* portão */}
      <g transform="translate(540,0)">
        <path d="M -560 330 Q 0 250 560 330 L 520 430 L -520 430 Z" fill="#33343c" />
        <rect x={-500} y={430} width={1000} height={70} fill="#9e1c13" />
        <rect x={-440} y={500} width={90} height={1000} fill="#b5221a" />
        <rect x={350} y={500} width={90} height={1000} fill="#b5221a" />
        <rect x={-500} y={500} width={1000} height={36} fill="#7d150e" />
        {/* lanterna gigante */}
        <g transform={`translate(0,${860 + Math.sin(t * 1.3) * 4})`}>
          <rect x={-215} y={-330} width={430} height={46} rx={8} fill="#1d1d1f" />
          <ellipse rx={260} ry={300} fill="url(#chochin)" />
          {Array.from({ length: 7 }).map((_, i) => (
            <ellipse key={i} rx={260} ry={300 - i * 2} cy={-240 + i * 80} fill="none" stroke="#8d140c" strokeWidth={3} opacity={0.5} />
          ))}
          <text y={70} textAnchor="middle" fontFamily="serif" fontSize={240} fontWeight={900} fill="#111">雷門</text>
          <rect x={-215} y={284} width={430} height={46} rx={8} fill="#1d1d1f" />
        </g>
      </g>
      {/* chão e multidão */}
      <rect y={1500} width={W} height={2200} fill="#8f8a83" />
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={i} x1={0} y1={1560 + i * 140} x2={W} y2={1560 + i * 140} stroke="#7a756e" strokeWidth={6} />
      ))}
      {Array.from({ length: 9 }).map((_, i) => {
        const dir = i % 2 ? 1 : -1;
        const x = ((i * 170 + dir * t * 90) % 1300 + 1300) % 1300 - 110;
        return <Pessoa key={i} x={x} y={1640 + (i % 3) * 60} s={1.1 + (i % 3) * 0.25} cor={['#2b2b33', '#3d2f2a', '#20263a'][i % 3]} />;
      })}
      {/* pés do próprio fotógrafo, enquanto a câmera aponta para baixo */}
      <g transform="translate(540,2900)" fill="#26262c">
        <ellipse cx={-120} rx={90} ry={170} />
        <ellipse cx={120} rx={90} ry={170} />
      </g>
    </Camera>
  );
};

// ── Akihabara de noite (vídeo) ────────────────────────────────────────────
export const Akihabara: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const dx = interpolate(t, [0, 6], [120, -160]);
  // 4,4–5,3 s: alguém passa colado na lente
  const tampa = interpolate(t, [4.3, 4.6, 5.0, 5.3], [-1700, 0, 0, 1800], clamp);
  const placas = [
    { x: 40, y: 260, w: 200, h: 820, cor: '#ff2d7a', txt: 'アニメ' },
    { x: 280, y: 180, w: 170, h: 640, cor: '#28d7ff', txt: 'ゲーム' },
    { x: 700, y: 220, w: 200, h: 760, cor: '#ffe14a', txt: '秋葉原' },
    { x: 930, y: 320, w: 170, h: 600, cor: '#7cff6b', txt: '電気' },
  ];
  return (
    <Camera amp={3} dx={dx}>
      <rect x={-300} width={W + 600} height={H} fill="#090616" />
      {[-260, 0, 230, 470, 680, 900, 1120].map((x, i) => (
        <rect key={i} x={x} y={80 + (i % 3) * 60} width={230} height={1500} fill={['#16112b', '#1d1735', '#120e24'][i % 3]} />
      ))}
      {placas.map((p, i) => {
        const pisca = 0.75 + 0.25 * Math.sin(t * (6 + i * 3) + i);
        return (
          <g key={i} opacity={pisca}>
            <rect x={p.x} y={p.y} width={p.w} height={p.h} rx={14} fill="none" stroke={p.cor} strokeWidth={10} style={{ filter: `drop-shadow(0 0 18px ${p.cor})` }} />
            <text x={p.x + p.w / 2} y={p.y + 120} fontSize={130} fontFamily="sans-serif" fontWeight={900} fill={p.cor} textAnchor="middle" writingMode="tb" style={{ filter: `drop-shadow(0 0 14px ${p.cor})` }}>
              {p.txt}
            </text>
          </g>
        );
      })}
      <rect x={-300} y={1480} width={W + 600} height={440} fill="#1a1626" />
      <rect x={-300} y={1480} width={W + 600} height={8} fill="#ff2d7a" opacity={0.4} />
      {Array.from({ length: 11 }).map((_, i) => {
        const x = ((i * 140 + (i % 2 ? 1 : -1) * t * 120) % 1500 + 1500) % 1500 - 260;
        return <Pessoa key={i} x={x} y={1650 + (i % 3) * 50} s={1 + (i % 3) * 0.3} cor="#06050c" />;
      })}
      <ellipse cx={540 + tampa} cy={960} rx={900} ry={1300} fill="#050505" />
    </Camera>
  );
};

// ── Domo da Bomba Atômica (vídeo) ─────────────────────────────────────────
export const Domo: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const dx = interpolate(t, [0, 8], [-90, 90]);
  return (
    <Camera amp={2} dx={dx} zoom={1.08}>
      <defs>
        <linearGradient id="ceuD" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b2a5c" />
          <stop offset="0.55" stopColor="#e3795a" />
          <stop offset="1" stopColor="#f6c48a" />
        </linearGradient>
      </defs>
      <rect x={-200} width={W + 400} height={H} fill="url(#ceuD)" />
      <circle cx={820} cy={980} r={90} fill="#ffe0a3" opacity={0.9} />
      {/* prédio em ruínas */}
      <g transform="translate(540,1240)" fill="#2b2230" stroke="#2b2230">
        <rect x={-420} y={-300} width={840} height={300} />
        {Array.from({ length: 10 }).map((_, i) => (
          <rect key={i} x={-390 + i * 80} y={-250} width={40} height={90} fill="#e9a77a" stroke="none" opacity={i % 3 === 1 ? 0.95 : 0.6} />
        ))}
        <rect x={-150} y={-560} width={300} height={260} />
        {Array.from({ length: 3 }).map((_, i) => (
          <rect key={i} x={-120 + i * 90} y={-520} width={50} height={110} fill="#f2b787" stroke="none" />
        ))}
        {/* o esqueleto da cúpula */}
        <g fill="none" strokeWidth={9}>
          <path d="M -150 -560 Q 0 -820 150 -560" />
          {Array.from({ length: 7 }).map((_, i) => {
            const x = -150 + i * 50;
            return <line key={i} x1={x} y1={-560} x2={0} y2={-760} />;
          })}
          <path d="M -120 -640 Q 0 -700 120 -640" />
        </g>
        <path d="M -420 -300 L -380 -340 L -300 -300 L -240 -360 L -150 -300" fill="#2b2230" />
      </g>
      {/* árvores */}
      {[-120, 80, 960, 1150].map((x, i) => (
        <ellipse key={i} cx={x} cy={1170} rx={170} ry={230} fill="#1d1a24" />
      ))}
      {/* rio com reflexo */}
      <rect x={-200} y={1300} width={W + 400} height={620} fill="#3a2f52" />
      {Array.from({ length: 16 }).map((_, i) => (
        <rect key={i} x={((i * 97 + t * 40) % 1300) - 200} y={1340 + i * 34} width={160 - (i % 4) * 25} height={6} rx={3} fill="#f6c48a" opacity={0.35} />
      ))}
      <g transform="translate(540,1300) scale(1,-0.55)" opacity={0.25} fill="#120e18">
        <rect x={-420} y={-300} width={840} height={300} />
        <rect x={-150} y={-560} width={300} height={260} />
      </g>
    </Camera>
  );
};

// ── Okonomiyaki (foto, sem GPS) ───────────────────────────────────────────
export const Okonomiyaki: React.FC = () => (
  <Camera amp={0}>
    <defs>
      <radialGradient id="chapa" cx="50%" cy="40%" r="80%">
        <stop offset="0" stopColor="#5a5a60" />
        <stop offset="1" stopColor="#1e1e22" />
      </radialGradient>
    </defs>
    <rect width={W} height={H} fill="url(#chapa)" />
    <ellipse cx={540} cy={1020} rx={430} ry={330} fill="#3a1f0d" />
    <ellipse cx={540} cy={990} rx={420} ry={310} fill="#8a4a1c" />
    <ellipse cx={540} cy={960} rx={400} ry={290} fill="#4a2410" />
    {Array.from({ length: 9 }).map((_, i) => (
      <path key={i} d={`M ${200 + i * 20} ${780 + i * 45} q 70 -40 140 0 t 140 0 t 140 0 t 140 0`} fill="none" stroke="#f7f3e6" strokeWidth={9} opacity={0.9} />
    ))}
    {Array.from({ length: 70 }).map((_, i) => (
      <circle key={i} cx={260 + ((i * 137) % 560)} cy={760 + ((i * 89) % 420)} r={5} fill="#3f8a2a" />
    ))}
    <g transform="translate(830,1420) rotate(-28)">
      <rect x={-40} y={-260} width={80} height={300} rx={10} fill="#c9c9cf" />
      <rect x={-18} y={40} width={36} height={230} rx={14} fill="#6b3f1f" />
    </g>
  </Camera>
);

// ── Miyajima: o torii na água (vídeo) ─────────────────────────────────────
export const Miyajima: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const grade = interpolate(t, [0, 1.6], [0, -2600], clamp); // grade da balsa passando
  const blur = interpolate(t, [0, 1.4, 1.8], [6, 4, 0], clamp);
  const cervo = interpolate(t, [4.6, 7.6], [1350, 760], clamp);
  const barco = interpolate(t, [0, 8], [-300, 1250]);
  return (
    <Camera amp={t < 1.8 ? 9 : 2} zoom={interpolate(t, [1.8, 8], [1, 1.06], clamp)} blur={blur}>
      <defs>
        <linearGradient id="ceuM" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a9d3f0" />
          <stop offset="1" stopColor="#f3f1e4" />
        </linearGradient>
        <linearGradient id="mar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5d93ad" />
          <stop offset="1" stopColor="#2c5c78" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#ceuM)" />
      <path d="M -50 900 Q 200 620 420 780 Q 600 520 820 760 Q 980 640 1130 820 L 1130 1000 L -50 1000 Z" fill="#6f8f8a" />
      <path d="M -50 960 Q 260 800 520 900 Q 760 820 1130 930 L 1130 1020 L -50 1020 Z" fill="#4f6f62" />
      <rect y={1000} width={W} height={920} fill="url(#mar)" />
      {Array.from({ length: 22 }).map((_, i) => (
        <rect key={i} x={((i * 151 + t * 30 * (i % 2 ? 1 : -1)) % 1300 + 1300) % 1300 - 120} y={1040 + i * 38} width={120} height={5} rx={3} fill="#e6f3fa" opacity={0.45} />
      ))}
      {/* barquinho */}
      <g transform={`translate(${barco},1060)`}>
        <path d="M -60 0 L 60 0 L 40 22 L -40 22 Z" fill="#f2f2f2" />
        <rect x={-14} y={-26} width={28} height={26} fill="#d33" />
      </g>
      {/* torii */}
      <g transform="translate(540,1000)" fill="#d83a22">
        <path d="M -400 -560 Q 0 -620 400 -560 L 420 -520 Q 0 -575 -420 -520 Z" fill="#2a1a16" />
        <rect x={-390} y={-525} width={780} height={46} />
        <rect x={-330} y={-430} width={660} height={36} />
        <rect x={-34} y={-480} width={68} height={60} fill="#2a1a16" />
        <rect x={-290} y={-480} width={64} height={620} />
        <rect x={226} y={-480} width={64} height={620} />
        <rect x={-300} y={110} width={84} height={30} fill="#2a1a16" />
        <rect x={216} y={110} width={84} height={30} fill="#2a1a16" />
      </g>
      <g transform="translate(540,1140) scale(1,-0.6)" fill="#d83a22" opacity={0.28}>
        <rect x={-290} y={-140} width={64} height={620} />
        <rect x={226} y={-140} width={64} height={620} />
        <rect x={-390} y={420} width={780} height={46} />
      </g>
      {/* cervo de Miyajima entrando pela direita */}
      <g transform={`translate(${cervo},1700)`} fill="#9a6b3f">
        <ellipse rx={150} ry={80} />
        <rect x={-120} y={40} width={22} height={140} />
        <rect x={-60} y={40} width={22} height={140} />
        <rect x={60} y={40} width={22} height={140} />
        <rect x={110} y={40} width={22} height={140} />
        <path d="M -130 -30 L -190 -150 L -150 -160 L -100 -50 Z" />
        <ellipse cx={-190} cy={-170} rx={50} ry={38} />
        <ellipse cx={-226} cy={-160} rx={22} ry={16} fill="#5a3a20" />
        {Array.from({ length: 6 }).map((_, i) => (
          <circle key={i} cx={-70 + i * 30} cy={-20 + (i % 2) * 20} r={9} fill="#f1e2c8" />
        ))}
      </g>
      {/* grade da balsa, desfocada, passando na frente no começo */}
      <g transform={`translate(${grade},0)`} fill="#f4f4f4" opacity={0.95}>
        {Array.from({ length: 9 }).map((_, i) => (
          <rect key={i} x={i * 260} y={0} width={70} height={H} />
        ))}
        <rect x={0} y={1300} width={2600} height={60} />
      </g>
    </Camera>
  );
};
