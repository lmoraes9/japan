/**
 * Emergência e documentos. Os números fixos aqui são os oficiais e conhecidos;
 * o que varia por pessoa (seguro, passaporte, contatos) é preenchido no app e
 * sincroniza entre os dois celulares. Confiram os telefones do consulado no
 * site oficial antes de embarcar — eles mudam.
 */

export interface Contato {
  label: string;
  phone: string;
  /** como discar do celular brasileiro em roaming / eSIM */
  note?: string;
  jp?: string;
}

export const NUMEROS_JAPAO: Contato[] = [
  { label: 'Polícia', phone: '110', jp: '警察', note: 'Também para objeto perdido/roubado — o boletim é exigido pelo seguro' },
  { label: 'Ambulância e bombeiros', phone: '119', jp: '救急・消防', note: 'Diga "kyūkyū" (ambulância) e o lugar; a maioria dos atendentes consegue inglês básico' },
  { label: 'Japan Visitor Hotline (JNTO)', phone: '050-3816-2787', note: '24h, em inglês: emergência, hospital, tufão, terremoto. Ligar de eSIM japonês ou pelo hotel' },
  { label: 'Guarda costeira (mar)', phone: '118', note: 'Só se acontecer algo na balsa ou na orla de Miyajima' },
];

export const CONSULADO = {
  title: 'Consulado-Geral do Brasil em Tóquio',
  address: 'Gotanda Fuji Bldg. 2F, 1-13-12 Nishi-Gotanda, Shinagawa-ku, Tokyo 141-0031',
  addressJp: '東京都品川区西五反田1-13-12 五反田富士ビル2階',
  phone: '+81 3-5488-5451',
  site: 'https://www.gov.br/mre/pt-br/embaixada-toquio',
  note: 'Perto da estação Gotanda (JR Yamanote). Segunda a sexta, 9h às 13h para atendimento. Fora do horário, o plantão consular só atende emergência grave (morte, prisão, hospitalização) — o número do plantão está no site e vale anotar abaixo antes de viajar.',
  maps: 'Consulado-Geral do Brasil em Tóquio Gotanda',
};

export interface Hospital {
  city: string;
  name: string;
  jp: string;
  phone?: string;
  note: string;
  maps: string;
}

export const HOSPITAIS: Hospital[] = [
  {
    city: 'Tóquio',
    name: "St. Luke's International Hospital",
    jp: '聖路加国際病院',
    phone: '03-3541-5151',
    note: 'Tsukiji, ao lado de Ginza. Atendimento em inglês de rotina; é a referência para estrangeiros na cidade.',
    maps: "St. Luke's International Hospital Tsukiji",
  },
  {
    city: 'Tóquio',
    name: 'Tokyo Medical and Surgical Clinic',
    jp: '東京メディカルアンドサージカルクリニック',
    note: 'Shiba-koen. Clínica de estrangeiros, médicos estrangeiros, consulta com hora marcada (não é pronto-socorro).',
    maps: 'Tokyo Medical and Surgical Clinic Shibakoen',
  },
  {
    city: 'Hiroshima',
    name: 'Hiroshima University Hospital',
    jp: '広島大学病院',
    note: 'Hospital universitário, o maior da cidade; pronto-socorro 24h.',
    maps: 'Hiroshima University Hospital',
  },
  {
    city: 'Osaka',
    name: 'Osaka University Hospital',
    jp: '大阪大学医学部附属病院',
    note: 'Suita, norte da cidade. Para algo menor, qualquer clínica com placa 内科 (clínica geral) atende turista pagando na hora.',
    maps: 'Osaka University Hospital',
  },
  {
    city: 'Kyoto',
    name: 'Japan Baptist Hospital',
    jp: '日本バプテスト病院',
    note: 'Sakyō, perto do Caminho do Filósofo. Tradição de atender estrangeiros em inglês.',
    maps: 'Japan Baptist Hospital Kyoto',
  },
  {
    city: 'Kyoto',
    name: 'Kyoto University Hospital',
    jp: '京都大学医学部附属病院',
    phone: '075-751-3111',
    note: 'Pronto-socorro 24h, o grande hospital da cidade.',
    maps: 'Kyoto University Hospital',
  },
];

export const CARTOES: Contato[] = [
  { label: 'Visa — assistência global (Japão, grátis)', phone: '00531-11-1555', note: 'Cancelar cartão e adiantamento de emergência' },
  { label: 'Mastercard — assistência global (Japão, grátis)', phone: '00531-11-3886' },
  { label: 'Visa (a cobrar, de qualquer país)', phone: '+1 303-967-1096' },
  { label: 'Mastercard (a cobrar, de qualquer país)', phone: '+1 636-722-7111' },
];

export const COMO_AGIR: { label: string; steps: string[] }[] = [
  {
    label: 'Passaporte perdido ou roubado',
    steps: [
      'Ir ao **kōban** (posto policial de bairro) mais próximo e registrar o **遺失届 / 盗難届** (boletim de perda/roubo). Peçam o número do registro — o consulado e o seguro exigem.',
      'Ligar para o consulado (acima) e ir a Gotanda com o boletim, a **foto do passaporte** guardada aqui no app e 2 fotos 3×4 (tem cabine em qualquer estação grande).',
      'O consulado emite uma **autorização de retorno** em 1 a 2 dias úteis — por isso a foto do passaporte importa: acelera tudo.',
    ],
  },
  {
    label: 'Cartão perdido / clonado',
    steps: [
      'Bloquear pelo app do banco primeiro (funciona com wi-fi do hotel); só depois ligar para a bandeira.',
      'Dinheiro de emergência: caixa eletrônico do **7-Eleven** ou dos **Correios (ゆうちょ)** com o outro cartão; Western Union tem balcão em Shinjuku e Ginza.',
    ],
  },
  {
    label: 'Doente ou machucado',
    steps: [
      'Coisa pequena: **drugstore** (Matsumoto Kiyoshi, Welcia, Sundrug) tem farmacêutico e vende analgésico (Loxonin S, EVE), remédio de estômago (Ōta Isan, Seirogan) e de resfriado (Pabron). As frases estão em **Frases → Saúde**.',
      'Coisa séria: ligar **119** ou ir ao hospital da lista. Levar passaporte e o cartão/apólice do seguro. **Pagam na hora e pedem reembolso** — guardem todo recibo com detalhamento (明細書).',
      'Antes de qualquer procedimento caro, ligar para a central do seguro (seção Seguro-viagem, acima): alguns só reembolsam se avisados antes.',
    ],
  },
  {
    label: 'Terremoto',
    steps: [
      'Todo celular no Japão apita um **alerta de terremoto** segundos antes (não dá para desligar). Ao apitar: longe de janela e prateleira, debaixo de mesa se houver, e esperar acabar. **Não sair correndo do prédio** — os prédios japoneses são feitos para balançar.',
      'No hotel: a porta do quarto abre, elevador fica fora de uso, e o hotel avisa em inglês pelo alto-falante. Sigam as instruções, não a intuição.',
      'Depois: **Japan Visitor Hotline** (acima) ou o app **Safety tips** da JNTO para saber se trens pararam. O Shinkansen para sozinho e volta em horas.',
    ],
  },
  {
    label: 'Perdeu o último trem',
    steps: [
      'Metrô e JR param por volta da **meia-noite/0h30**. Táxi de Shibuya a Shinjuku sai ~¥2.000; de Ginza ~¥3.000. Mostrem o endereço do hotel em japonês (**Reservas → Mostrar ao taxista**).',
      'Alternativa clássica: karaokê ou manga café 24h até o primeiro trem (~5h). Não é emergência, é folclore.',
    ],
  },
];

/** O seguro-viagem dos dois, do bilhete emitido em 11/08/2026 */
export const SEGURO = {
  empresa: 'Universal Assistance',
  produto: 'Universal 40K (60 dias) · vigência 16/11 a 03/12/2026 · destino Ásia',
  pessoas: [
    { nome: 'Leonardo Antunes de Moraes', voucher: 'TA6795543', bilhete: 'ZBBR003938343' },
    { nome: 'Priscila Pinheiro de Toledo Werneck', voucher: 'TA6795544', bilhete: 'ZBBR003938344' },
  ],
  telefones: [
    { label: 'Central 24h no Japão', phone: '0053-153-0002', note: 'de telefone fixo ou celular local (eSIM); de chip brasileiro em roaming a ligação pode não completar' },
    { label: 'A cobrar, de qualquer lugar', phone: '+54 11 4323-7770', note: 'via operadora, chamada a cobrar' },
    { label: 'Brasil', phone: '0800-555-6651' },
  ],
  email: 'asistencias@universal-assistance.com',
  coberturas: [
    ['Despesas médicas e hospitalares (por evento)', 'US$ 40.000'],
    ['Odontológicas', 'US$ 600'],
    ['Farmacêuticas', 'US$ 600'],
    ['Perda de bagagem', 'US$ 1.300'],
    ['Atraso de voo (a partir de 6 h)', 'US$ 300'],
    ['Regresso sanitário / traslado médico', 'US$ 5.000 cada'],
    ['Prorrogação de estadia', 'US$ 1.200'],
  ],
  regras: [
    '**Ligar para a central ANTES de qualquer atendimento** — é condição do seguro. Sem o aviso prévio, o reembolso pode ser negado.',
    'Pagam na hora e pedem reembolso depois: **guardar todo recibo detalhado** (明細書) e o relatório médico.',
    'Perda ou roubo: primeiro o boletim no kōban (遺失届 / 盗難届), depois a central. Sem boletim não há cobertura de bagagem.',
    'Doença pré-existente não é coberta; leia as exclusões antes de contar com algo.',
  ],
  site: 'http://bilhete.universal-assistance.com',
};

/** campos que vocês preenchem no app (texto, sincronizado) */
export const DOC_FIELDS: { key: string; label: string; placeholder: string; multiline?: boolean }[] = [
  { key: 'consulado-plantao', label: 'Plantão consular (emergências, fora do horário)', placeholder: 'anotar o número do site do consulado' },
  { key: 'passaporte-l', label: 'Passaporte Leonardo (número e validade)', placeholder: 'ex.: FX123456 · válido até 03/2031' },
  { key: 'passaporte-p', label: 'Passaporte Priscila (número e validade)', placeholder: 'ex.: FX654321 · válido até 07/2030' },
  { key: 'saude', label: 'Alergias, remédios de uso contínuo, tipo sanguíneo', placeholder: 'para mostrar ao médico', multiline: true },
  { key: 'contato-brasil', label: 'Contatos de emergência no Brasil', placeholder: 'nome · telefone · parentesco', multiline: true },
  { key: 'banco', label: 'Bancos: telefone internacional para bloqueio', placeholder: 'ex.: Nubank +55 11 ... · Itaú +55 11 ...', multiline: true },
];
