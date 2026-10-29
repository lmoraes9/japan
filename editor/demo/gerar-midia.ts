/**
 * Gera as fotos e vídeos FALSOS do teste em entrada/, com os metadados que o
 * Android do Leonardo e o iPhone da Priscila gravariam de verdade:
 *  - iPhone (.MOV): GPS e data com fuso nas chaves QuickTime da Apple
 *  - Android (.mp4): GPS no átomo ©xyz e data só em UTC, sem fuso
 *  - fotos (.jpg): EXIF com GPS, hora local e OffsetTimeOriginal
 * Uma foto vai sem GPS de propósito, para o importador deduzir pelo horário.
 * As coordenadas saem levemente deslocadas da parada, como no mundo real.
 */
import { existsSync, mkdirSync, renameSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { bundle } from '@remotion/bundler';
import { renderMedia, renderStill, selectComposition } from '@remotion/renderer';
import { exiftool } from 'exiftool-vendored';
import { ffmpeg, navegador } from '../scripts/lib/ferramentas.ts';

interface Item {
  cena: string;
  aparelho: 'leo-android' | 'pri-iphone';
  arquivo: string;
  /** hora local com fuso */
  quando: string;
  gps?: [number, number];
}

const ITENS: Item[] = [
  { cena: 'aeroporto-gru', aparelho: 'pri-iphone', arquivo: 'IMG_4101.JPG', quando: '2026-11-16T21:58:12-03:00', gps: [-23.4321, -46.4697] },
  { cena: 'aeroporto-jfk', aparelho: 'leo-android', arquivo: 'IMG_20261117_100544.jpg', quando: '2026-11-17T10:05:44-05:00', gps: [40.6447, -73.7826] },
  { cena: 'yokocho', aparelho: 'pri-iphone', arquivo: 'IMG_4127.MOV', quando: '2026-11-18T20:41:05+09:00', gps: [35.69365, 139.69905] },
  { cena: 'sensoji', aparelho: 'leo-android', arquivo: 'VID_20261119_081207.mp4', quando: '2026-11-19T08:12:07+09:00', gps: [35.71105, 139.79622] },
  { cena: 'akihabara', aparelho: 'pri-iphone', arquivo: 'IMG_4188.MOV', quando: '2026-11-19T16:48:30+09:00', gps: [35.69905, 139.77085] },
  { cena: 'domo', aparelho: 'leo-android', arquivo: 'VID_20261123_155210.mp4', quando: '2026-11-23T15:52:10+09:00', gps: [34.39505, 132.45281] },
  { cena: 'okonomiyaki', aparelho: 'pri-iphone', arquivo: 'IMG_4302.JPG', quando: '2026-11-23T18:41:55+09:00' },
  { cena: 'miyajima', aparelho: 'pri-iphone', arquivo: 'IMG_4315.MOV', quando: '2026-11-24T09:05:31+09:00', gps: [34.29745, 132.31872] },
];

/** '2026-11-19T08:12:07+09:00' → partes no fuso local e em UTC, no formato do exiftool */
function datas(iso: string) {
  const local = iso.slice(0, 19).replace('T', ' ').replace(/-/g, ':');
  const tz = iso.slice(19);
  const utc = new Date(iso).toISOString().slice(0, 19).replace('T', ' ').replace(/-/g, ':');
  return { local, tz, utc };
}

async function main() {
  const serve = await bundle({ entryPoint: join(import.meta.dirname, 'index.ts') });
  const tmp = join('trabalho', 'tmp-demo');
  mkdirSync(tmp, { recursive: true });

  for (const it of ITENS) {
    const dir = join('entrada', it.aparelho);
    mkdirSync(dir, { recursive: true });
    const destino = join(dir, it.arquivo);
    const foto = /\.jpe?g$/i.test(it.arquivo);
    const comp = await selectComposition({ serveUrl: serve, id: it.cena, browserExecutable: navegador });

    if (existsSync(destino) && !process.argv.includes('--refazer')) {
      // já renderizado: só regrava os metadados
    } else if (foto) {
      await renderStill({ composition: comp, serveUrl: serve, output: destino, imageFormat: 'jpeg', jpegQuality: 88, browserExecutable: navegador });
    } else {
      const mp4 = join(tmp, `${it.cena}.mp4`);
      await renderMedia({ composition: comp, serveUrl: serve, codec: 'h264', outputLocation: mp4, browserExecutable: navegador, concurrency: 4 });
      if (it.arquivo.toLowerCase().endsWith('.mov')) ffmpeg(['-i', mp4, '-c', 'copy', '-f', 'mov', destino]);
      else renameSync(mp4, destino);
    }

    const d = datas(it.quando);
    const tags: Record<string, string | number> = {};
    const iphone = it.aparelho === 'pri-iphone';
    if (foto) {
      Object.assign(tags, {
        Make: iphone ? 'Apple' : 'samsung',
        Model: iphone ? 'iPhone 15' : 'SM-S921B',
        DateTimeOriginal: d.local,
        CreateDate: d.local,
        OffsetTimeOriginal: d.tz,
      });
      if (it.gps) {
        Object.assign(tags, {
          GPSLatitude: it.gps[0],
          GPSLatitudeRef: it.gps[0] >= 0 ? 'N' : 'S',
          GPSLongitude: it.gps[1],
          GPSLongitudeRef: it.gps[1] >= 0 ? 'E' : 'W',
        });
      }
    } else if (iphone) {
      Object.assign(tags, {
        'QuickTime:CreateDate': d.utc,
        'Keys:CreationDate': `${d.local}${d.tz}`,
        'Keys:Make': 'Apple',
        'Keys:Model': 'iPhone 15',
      });
      if (it.gps) tags['Keys:GPSCoordinates'] = `${it.gps[0]}, ${it.gps[1]}, 12`;
    } else {
      Object.assign(tags, { 'QuickTime:CreateDate': d.utc, 'QuickTime:ModifyDate': d.utc });
      if (it.gps) tags['UserData:GPSCoordinates'] = `${it.gps[0]}, ${it.gps[1]}`;
    }
    await exiftool.write(destino, tags as any, { writeArgs: ['-overwrite_original'] });
    console.log(`✓ ${it.aparelho}/${it.arquivo}${it.gps ? '' : '  (sem GPS)'}`);
  }

  rmSync(tmp, { recursive: true, force: true });
  await exiftool.end();
}

main().catch(async (e) => {
  console.error(e);
  await exiftool.end();
  process.exit(1);
});
