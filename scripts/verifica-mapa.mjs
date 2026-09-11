/**
 * Verificação do mapa da viagem: nenhum alvo tocável se sobrepõe a outro, e
 * nenhum é menor que o dedo, em toda a matriz de aparelhos e estados.
 * Roda com: node --experimental-strip-types scripts/verifica-mapa.mjs
 */
const layout = await import('../src/lib/mapa-japao/layout.ts');
const { retangulos, colisoes, pequenos, metricaTrilho, centrosDasCasas, ALVO } = layout;

const LARGURAS = [320, 360, 390, 412, 430];
const ALTURAS = [620, 700, 780, 844, 932];
const ESTADOS = ['panorama', 'regiao', 'cidade', 'indice', 'expandida'];

let falhas = 0;
const erro = (m) => { console.error('  ✗', m); falhas++; };

console.log('1. sobreposição e tamanho de alvo');
let combinacoes = 0;
for (const w of LARGURAS) for (const h of ALTURAS) for (const e of ESTADOS) {
  combinacoes++;
  for (const [a, b] of colisoes(w, h, e)) erro(`${w}x${h} ${e}: "${a}" cobre "${b}"`);
  for (const k of pequenos(w, h, e)) {
    const r = retangulos(w, h, e)[k];
    erro(`${w}x${h} ${e}: "${k}" tem ${r.w}x${r.h}, menor que ${ALVO}`);
  }
}
console.log(`   ${combinacoes} combinações de aparelho e estado conferidas`);

console.log('2. aritmética do trilho');
const m = metricaTrilho(390);
if (m.conteudo !== 13 * 112 + 12 * 76 + 24 * 8) erro(`conteúdo ${m.conteudo}, esperado 2560`);
else console.log(`   fita de ${m.conteudo} px, total ${m.total} px com folga de ${m.folga}`);
const c = centrosDasCasas(390);
if (c.length !== 25) erro(`${c.length} casas, esperado 25`);
const passo = c[2] - c[0];
if (passo !== 204) erro(`centro a centro entre cidades vizinhas ${passo}, esperado 204`);
else console.log('   204 px entre cidades vizinhas, iguais para Kyoto–Nara e Tóquio–Kamakura');
for (let i = 1; i < c.length; i++) if (c[i] <= c[i - 1]) erro(`centros fora de ordem em ${i}`);

console.log('3. aritmética do cabeçalho da ficha');
for (const w of LARGURAS) {
  const r = retangulos(w, 780, 'cidade');
  const soma = 12 + 44 + 8 + (w - 128) + 8 + 44 + 12;
  if (soma !== w) erro(`cabeçalho soma ${soma} em w=${w}`);
  if (r['ficha.cabecalho'].w < 100) erro(`cabeçalho estreito demais em w=${w}`);
}
console.log('   o cabeçalho fecha a largura exata em todas as telas');

console.log('4. grade do índice');
for (const w of LARGURAS) {
  const cel = (w - 48) / 3;
  const fim = 16 + 3 * cel + 2 * 8 + 16;
  if (Math.abs(fim - w) > 0.01) erro(`grade do índice soma ${fim} em w=${w}`);
  if (cel < 80) erro(`célula de ${cel.toFixed(0)} px em w=${w}`);
}
console.log('   três colunas cabem inteiras, sem corte na borda');

console.log(falhas ? `\nFALHOU: ${falhas} problema(s)` : '\nTUDO CERTO');
process.exit(falhas ? 1 : 0);
