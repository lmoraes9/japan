/**
 * Prepara o que vai para a Ilha de Edição (o painel no claude.ai onde eles escolhem a música e
 * o que entra em cada edit): miniaturas pequenas de cada foto e vídeo, as folhas de contato
 * reduzidas e a lista de mídias e músicas. Só as miniaturas sobem; o original fica no PC.
 *
 *   npm run painel   → trabalho/painel/{miniaturas,quadros}/*.jpg + trabalho/painel/painel.json
 *
 * O Claude sobe os jpg como assets do artefato e grava as linhas no banco dele
 * (coleções midias e musicas), com a url de cada miniatura.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import type { Midia } from './lib/catalogo.ts';
import { ffmpeg } from './lib/ferramentas.ts';

const PASTA = 'trabalho/painel';
mkdirSync(join(PASTA, 'miniaturas'), { recursive: true });
mkdirSync(join(PASTA, 'quadros'), { recursive: true });

const catalogo = (JSON.parse(readFileSync('trabalho/catalogo.json', 'utf8')) as Midia[]).filter((m) => m.quando);
/** id estável pelo nome do arquivo: '20261030_090720.mp4' → '20261030_090720-mp4' */
const idDe = (m: Midia) => basename(m.original ?? m.arquivo).replace(/[^\w-]+/g, '-');

const midias = catalogo.map((m) => {
  const id = idDe(m);
  const mini = join(PASTA, 'miniaturas', `${id}.jpg`);
  if (!existsSync(mini)) {
    // vídeo: um quadro a um terço, onde a câmera já achou o enquadramento
    const pular = m.tipo === 'video' ? ['-ss', ((m.duracao ?? 3) / 3).toFixed(2)] : [];
    ffmpeg([...pular, '-i', m.arquivo, '-frames:v', '1', '-vf', 'scale=360:360:force_original_aspect_ratio=increase', '-q:v', '6', mini]);
  }
  const quadros = m.quadros && join(PASTA, 'quadros', `${id}.jpg`);
  if (quadros && !existsSync(quadros)) ffmpeg(['-i', m.quadros!.imagem, '-vf', 'scale=720:-2', '-q:v', '6', quadros]);
  return {
    id,
    arquivo: m.arquivo,
    tipo: m.tipo,
    /** de que celular veio: 'leo-android', 'pri-iphone' (a Ilha mostra Leo / Pri) */
    aparelho: m.aparelho,
    quando: m.quando,
    lugar: m.lugar?.nome ?? '',
    cidade: m.lugar?.cidade ?? '',
    duracao: m.duracao && Math.round(m.duracao * 10) / 10,
    passo: m.quadros?.passo,
    colunas: m.quadros?.colunas,
    miniatura: mini,
    folha: quadros,
  };
});

const musicas = existsSync('trabalho/musicas.json')
  ? (JSON.parse(readFileSync('trabalho/musicas.json', 'utf8')) as { arquivo: string; dur: number; bpm: number; unidade: number; inicio: number }[]).map((m) => ({
      id: basename(m.arquivo, '.mp3'),
      arquivo: m.arquivo,
      bpm: Math.round(m.bpm),
      dur: Math.round(m.dur),
    }))
  : [];

writeFileSync(join(PASTA, 'painel.json'), JSON.stringify({ midias, musicas }, null, 1));
console.log(`${midias.length} mídias, ${musicas.length} músicas → ${PASTA}/painel.json`);
