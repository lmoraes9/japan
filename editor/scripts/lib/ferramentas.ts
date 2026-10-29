/** Onde estão o ffmpeg e o navegador usados pelo Remotion, em Windows ou Linux. */
import { execFileSync, spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);

function noPath(bin: string) {
  const r = spawnSync(process.platform === 'win32' ? 'where' : 'which', [bin], { encoding: 'utf8' });
  return r.status === 0 ? r.stdout.split(/\r?\n/)[0].trim() : undefined;
}

/** ffmpeg/ffprobe: $FFMPEG, o do PATH, ou o que vem junto com o Remotion */
export function bin(nome: 'ffmpeg' | 'ffprobe'): string {
  const env = nome === 'ffmpeg' ? process.env.FFMPEG : process.env.FFPROBE;
  if (env) return env;
  const sys = noPath(nome);
  if (sys) return sys;
  const pkgs = ['@remotion/compositor-win32-x64-msvc', '@remotion/compositor-linux-x64-gnu', '@remotion/compositor-darwin-arm64', '@remotion/compositor-darwin-x64'];
  for (const p of pkgs) {
    try {
      const d = dirname(require.resolve(`${p}/package.json`));
      const f = join(d, process.platform === 'win32' ? `${nome}.exe` : nome);
      if (existsSync(f)) return f;
    } catch {}
  }
  throw new Error(`${nome} não encontrado. No Windows: winget install Gyan.FFmpeg`);
}

export function ffmpeg(args: string[]) {
  execFileSync(bin('ffmpeg'), ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'inherit' });
}

export function ffprobeJson(file: string): any {
  const out = execFileSync(bin('ffprobe'), ['-v', 'error', '-print_format', 'json', '-show_format', '-show_streams', file], { encoding: 'utf8' });
  return JSON.parse(out);
}

/** Navegador para o Remotion. Sem $REMOTION_BROWSER ele baixa o próprio (é o normal no PC). */
export const navegador = process.env.REMOTION_BROWSER || undefined;
