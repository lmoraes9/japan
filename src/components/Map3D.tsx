'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, X, ChevronLeft, ChevronRight, Navigation, Gauge, RotateCw, Mountain } from 'lucide-react';
import type { PlaceMap, PlaceHotspot } from '@/data/placeMaps';
import { photoKey } from '@/data/placeMaps';
import { PLACE_PHOTOS } from '@/data/placePhotos.generated';
import { searchUrl } from '@/lib/mapsLinks';
import { Rich } from './Rich';

type Quality = 'alta' | 'leve';

interface Engine {
  flyTo: (id: string | null) => void;
  setRotate: (on: boolean) => void;
  dispose: () => void;
}

interface Stats {
  fps: number;
  tris: number;
  calls: number;
  meshes: number;
  groups: number;
  instances: number;
  buildMs: number;
  memMb: number | null;
}

/**
 * O mapa inteiro em 3D (opção C): monta a cena com Three.js carregado sob
 * demanda, marcadores clicáveis para cada ponto do mapa e o mesmo painel de
 * texto do mapa ilustrado. O contador no topo mostra o custo real no aparelho.
 */
export function Map3D({ map }: { map: PlaceMap }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const [quality, setQuality] = useState<Quality>('alta');
  const [rotate, setRotate] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [status, setStatus] = useState<'carregando' | 'pronto' | 'erro'>('carregando');
  const selectedRef = useRef<string | null>(null);

  const selected = map.hotspots.find((h) => h.id === selectedId) ?? null;
  const index = selected ? map.hotspots.indexOf(selected) : -1;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let alive = true;
    let engine: Engine | null = null;
    setStatus('carregando');

    (async () => {
      const t0 = performance.now();
      const [THREE, { OrbitControls }, { buildFushimi }, { numberSprite }] = await Promise.all([
        import('three'),
        import('three/examples/jsm/controls/OrbitControls.js'),
        import('@/lib/three/fushimi'),
        import('@/lib/three/parts'),
      ]);
      if (!alive) return;

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: quality === 'alta', alpha: true, powerPreference: 'high-performance' });
      renderer.setPixelRatio(quality === 'alta' ? Math.min(devicePixelRatio, 2) : 1);
      renderer.shadowMap.enabled = quality === 'alta';
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;

      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0xd9dfe6, 500, 1400);
      const camera = new THREE.PerspectiveCamera(42, 1, 1, 3000);
      const controls = new OrbitControls(camera, canvas);
      controls.enableDamping = true;
      controls.maxPolarAngle = Math.PI / 2 - 0.05;
      controls.minDistance = 12;
      controls.maxDistance = 1100;
      controls.autoRotate = rotate;
      controls.autoRotateSpeed = 0.35;

      scene.add(new THREE.HemisphereLight(0xe8eef8, 0x5f5a48, 0.8));
      const sun = new THREE.DirectionalLight(0xfff0d8, 1.4);
      sun.position.set(-300, 420, 260);
      sun.castShadow = quality === 'alta';
      sun.shadow.mapSize.set(2048, 2048);
      const sc = sun.shadow.camera;
      sc.left = -520; sc.right = 520; sc.top = 520; sc.bottom = -520; sc.near = 50; sc.far = 1300;
      sun.shadow.bias = -0.0006;
      scene.add(sun);

      const built = buildFushimi(scene, map, quality);
      camera.position.copy(built.cameraStart.pos);
      controls.target.copy(built.cameraStart.target);

      // marcadores numerados, com uma haste até o chão
      const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c2402a';
      const sprites: { sprite: import('three').Sprite; id: string }[] = [];
      const markerGroup = new THREE.Group();
      scene.add(markerGroup);
      for (const h of map.hotspots) {
        const p = built.markers[h.id];
        if (!p) continue;
        const sp = numberSprite(h.n, accent);
        sp.position.set(p.x, p.y + 16, p.z);
        sp.scale.set(11, 11, 1);
        sp.userData.id = h.id;
        markerGroup.add(sp);
        sprites.push({ sprite: sp, id: h.id });
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 12, 6), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7 }));
        stem.position.set(p.x, p.y + 6.5, p.z);
        markerGroup.add(stem);
      }

      // toque: seleciona o marcador sob o dedo (sem confundir com arrastar)
      const ray = new THREE.Raycaster();
      const ndc = new THREE.Vector2();
      let down: { x: number; y: number } | null = null;
      const onDown = (e: PointerEvent) => { down = { x: e.clientX, y: e.clientY }; };
      const onUp = (e: PointerEvent) => {
        if (!down) return;
        const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
        down = null;
        if (moved > 8) return;
        const r = canvas.getBoundingClientRect();
        ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
        ray.setFromCamera(ndc, camera);
        const hit = ray.intersectObjects(sprites.map((s) => s.sprite), false)[0];
        if (hit) flyTo(hit.object.userData.id as string);
      };
      canvas.addEventListener('pointerdown', onDown);
      canvas.addEventListener('pointerup', onUp);

      // voo suave até um ponto
      let goal: { pos: import('three').Vector3; target: import('three').Vector3 } | null = null;
      const flyTo = (id: string | null) => {
        setSelectedId(id);
        selectedRef.current = id;
        if (!id) return;
        const p = built.markers[id];
        if (!p) return;
        controls.autoRotate = false;
        setRotate(false);
        const dir = new THREE.Vector3().subVectors(camera.position, controls.target).setY(0).normalize();
        if (dir.lengthSq() < 0.01) dir.set(-0.7, 0, 0.7);
        goal = {
          target: new THREE.Vector3(p.x, p.y + 6, p.z),
          pos: new THREE.Vector3(p.x, p.y + 6, p.z).add(dir.multiplyScalar(85)).add(new THREE.Vector3(0, 40, 0)),
        };
      };

      // laço de render + medição
      let frames = 0, acc = 0, last = performance.now(), raf = 0;
      const buildMs = Math.round(performance.now() - t0);
      const instances = built.instanced.reduce((n, im) => n + im.count, 0);
      const resize = () => {
        const w = canvas.clientWidth, h = canvas.clientHeight;
        const pr = renderer.getPixelRatio();
        if (canvas.width !== Math.floor(w * pr) || canvas.height !== Math.floor(h * pr)) {
          renderer.setSize(w, h, false);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
        }
      };
      const loop = (now: number) => {
        raf = requestAnimationFrame(loop);
        resize();
        if (goal) {
          controls.target.lerp(goal.target, 0.08);
          camera.position.lerp(goal.pos, 0.08);
          if (camera.position.distanceTo(goal.pos) < 0.5) goal = null;
        }
        controls.update();
        // marcadores com tamanho constante na tela
        for (const s of sprites) {
          const d = camera.position.distanceTo(s.sprite.position);
          const k = Math.max(3, d * 0.028) * (s.id === selectedRef.current ? 1.35 : 1);
          s.sprite.scale.set(k, k, 1);
        }
        renderer.render(scene, camera);
        frames++;
        acc += now - last;
        last = now;
        if (acc >= 1000) {
          const mem = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory;
          setStats({
            fps: Math.round((frames * 1000) / acc),
            tris: renderer.info.render.triangles,
            calls: renderer.info.render.calls,
            meshes: built.meshes,
            groups: built.drawGroups,
            instances,
            buildMs,
            memMb: mem ? Math.round(mem.usedJSHeapSize / 1048576) : null,
          });
          frames = 0;
          acc = 0;
        }
      };
      raf = requestAnimationFrame(loop);
      setStatus('pronto');

      engine = {
        flyTo,
        setRotate: (on) => { controls.autoRotate = on; },
        dispose: () => {
          cancelAnimationFrame(raf);
          canvas.removeEventListener('pointerdown', onDown);
          canvas.removeEventListener('pointerup', onUp);
          controls.dispose();
          scene.traverse((o) => {
            const m = o as import('three').Mesh;
            if (m.geometry) m.geometry.dispose();
          });
          renderer.dispose();
        },
      };
      engineRef.current = engine;
    })().catch((err) => {
      console.error(err);
      if (alive) setStatus('erro');
    });

    return () => {
      alive = false;
      engine?.dispose();
      engineRef.current = null;
    };
    // a cena é remontada quando a qualidade muda
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quality, map]);

  const step = (d: number) => {
    if (index < 0) return;
    const next = map.hotspots[(index + d + map.hotspots.length) % map.hotspots.length];
    engineRef.current?.flyTo(next.id);
  };
  const toggleRotate = () => {
    const on = !rotate;
    setRotate(on);
    engineRef.current?.setRotate(on);
  };

  const selectedPhoto = selected ? PLACE_PHOTOS[photoKey(map.id, selected.id)] : undefined;

  return (
    <div className="relative h-[100svh] w-full overflow-hidden" style={{ background: 'linear-gradient(180deg, #a9bcd3 0%, #d9dfe6 55%, #cfd3cf 100%)' }}>
      <canvas ref={canvasRef} className="block h-full w-full touch-none" />

      {status !== 'pronto' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="rounded-full bg-black/60 px-4 py-2 text-[13px] text-white backdrop-blur">
            {status === 'erro' ? 'Não deu para abrir o 3D neste aparelho.' : 'Montando a montanha…'}
          </p>
        </div>
      )}

      {/* topo: voltar, título, medidor */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-2 px-3" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 10px)' }}>
        <Link href={`/lugar/${map.id}`} className="pointer-events-auto inline-flex items-center gap-1 rounded-full bg-black/55 px-3 py-1.5 text-[13px] font-medium text-white backdrop-blur">
          <ArrowLeft size={15} /> Mapa
        </Link>
        <div className="pointer-events-auto rounded-2xl bg-black/55 px-3 py-2 text-white backdrop-blur">
          <p className="text-[13px] font-semibold leading-tight">{map.title} <span className="font-jp text-[11px] font-normal text-white/70">{map.jp}</span></p>
          {stats && (
            <p className="mt-0.5 font-mono text-[10px] tabular-nums text-white/80">
              <Gauge size={10} className="mr-1 inline" />
              <b className={stats.fps < 30 ? 'text-orange-300' : 'text-green-300'}>{stats.fps} fps</b>
              {' · '}{(stats.tris / 1000).toFixed(0)} mil tri · {stats.calls} draws
              {' · '}{stats.meshes} peças em {stats.groups} malhas + {stats.instances} instâncias
              {' · '}montou em {(stats.buildMs / 1000).toFixed(1)} s{stats.memMb ? ` · ${stats.memMb} MB` : ''}
            </p>
          )}
        </div>
      </div>

      {/* controles laterais */}
      <div className="absolute right-3 top-24 flex flex-col gap-2" style={{ top: 'calc(env(safe-area-inset-top) + 76px)' }}>
        <button onClick={toggleRotate} aria-pressed={rotate} aria-label="Girar sozinho" className={`flex h-10 w-10 items-center justify-center rounded-full backdrop-blur ${rotate ? 'bg-accent text-white' : 'bg-black/55 text-white'}`}>
          <RotateCw size={17} />
        </button>
        <button
          onClick={() => setQuality((q) => (q === 'alta' ? 'leve' : 'alta'))}
          aria-label="Qualidade"
          className="flex h-10 w-10 flex-col items-center justify-center rounded-full bg-black/55 text-white backdrop-blur"
        >
          <Mountain size={15} />
          <span className="font-mono text-[8px] uppercase leading-none">{quality}</span>
        </button>
      </div>

      {/* rodapé: lista de pontos ou painel do ponto */}
      {selected ? (
        <div className="sheet-in absolute inset-x-0 bottom-0 px-2" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 8px)' }}>
          <div className="mx-auto max-w-xl overflow-hidden rounded-3xl border border-hairline bg-surface shadow-2xl">
            <div className="flex items-center justify-between border-b border-hairline bg-surface-2/70 px-2 py-1">
              <button onClick={() => step(-1)} aria-label="Ponto anterior" className="flex h-9 w-9 items-center justify-center rounded-full text-foreground/70"><ChevronLeft size={20} /></button>
              <span className="font-mono text-[11px] uppercase tracking-widest text-muted">{index + 1} de {map.hotspots.length}{selected.walk ? <span className="ml-2 normal-case tracking-normal text-foreground/60">· {selected.walk} a pé</span> : null}</span>
              <div className="flex items-center">
                <button onClick={() => step(1)} aria-label="Próximo ponto" className="flex h-9 w-9 items-center justify-center rounded-full text-foreground/70"><ChevronRight size={20} /></button>
                <button onClick={() => engineRef.current?.flyTo(null)} aria-label="Fechar" className="flex h-9 w-9 items-center justify-center rounded-full text-muted"><X size={18} /></button>
              </div>
            </div>
            <div className="max-h-[38svh] overflow-y-auto overscroll-contain px-4 pb-3 pt-2.5">
              <h2 className="text-[15px] font-bold leading-snug">
                {selected.title}
                {selected.jp && <span className="ml-1.5 font-jp text-[12px] font-normal text-muted">{selected.jp}</span>}
              </h2>
              {selected.facts && <p className="mt-1 font-mono text-[11px] leading-relaxed text-muted"><Rich text={selected.facts} /></p>}
              {selectedPhoto && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={selectedPhoto.src} alt={selected.photoCaption ?? selected.title} loading="lazy" className="mt-2.5 max-h-[22svh] w-full rounded-2xl border border-hairline object-cover" />
              )}
              {selected.paragraphs.map((p, i) => (
                <p key={i} className="mt-2 text-[13px] leading-relaxed text-foreground/90"><Rich text={p} /></p>
              ))}
              <a href={searchUrl(selected.mapQuery ?? selected.title)} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1.5 text-[12px] font-medium text-white">
                <Navigation size={13} /> Navegar até aqui
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="absolute inset-x-0 bottom-0" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 10px)' }}>
          <p className="mb-1.5 text-center text-[11px] text-white drop-shadow">Toque num número, ou escolha um ponto:</p>
          <div className="no-scrollbar flex gap-2 overflow-x-auto px-3">
            {map.hotspots.map((h: PlaceHotspot) => (
              <button key={h.id} onClick={() => engineRef.current?.flyTo(h.id)} className="flex shrink-0 items-center gap-1.5 rounded-full bg-black/60 py-1.5 pl-1.5 pr-3 text-[12px] font-medium text-white backdrop-blur">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent font-mono text-[10px] font-bold">{h.n}</span>
                {h.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
