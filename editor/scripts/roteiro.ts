/**
 * Exporta os lugares do roteiro para trabalho/lugares.json — é o que o Claude
 * lê para escrever as notas de história e conferir nomes, datas e trajetos.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { carregarLugares } from './lib/lugares.ts';

const lugares = carregarLugares();
mkdirSync('trabalho', { recursive: true });
writeFileSync('trabalho/lugares.json', JSON.stringify(lugares, null, 2));
const comHistoria = lugares.filter((l) => l.historia).length;
console.log(`${lugares.length} lugares (${comHistoria} com história) → trabalho/lugares.json`);
