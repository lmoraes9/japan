/** O formato de trabalho/catalogo.json, que o importador escreve e o rascunho lê. */
export interface Candidato {
  id: string;
  nome: string;
  distanciaM?: number;
  /** horário marcado no roteiro, quando é parada */
  hora?: string;
  nota: number;
}

export interface Midia {
  /** caminho relativo a editor/: 'entrada/pri-iphone/IMG_4127.MOV' (HEIC vira JPG em trabalho/jpg/) */
  arquivo: string;
  /** o HEIC de onde saiu o JPG, quando houve conversão */
  original?: string;
  /** pasta de origem: 'leo-android', 'pri-iphone' */
  aparelho: string;
  tipo: 'video' | 'foto';
  /** hora local com fuso, '2026-11-19T08:12:07+09:00' */
  quando?: string;
  /** de onde veio o fuso quando o arquivo não trazia: da mídia vizinha, do roteiro (Japão) ou do PC */
  fusoDeduzido?: 'vizinha' | 'roteiro' | 'pc';
  duracao?: number;
  largura?: number;
  altura?: number;
  gps?: { lat: number; lng: number };
  lugar?: {
    id: string;
    nome: string;
    jp?: string;
    cidade: string;
    lat: number;
    lng: number;
    /**
     * gps = pelas coordenadas; roteiro = sem GPS, pelo horário marcado no roteiro;
     * vizinha = sem GPS, o lugar da foto ou vídeo mais perto no tempo
     */
    metodo: 'gps' | 'roteiro' | 'vizinha';
    /** fora do roteiro: o nome é o da cidade pelo GPS; o Claude troca pelo que a imagem mostra */
    fora?: boolean;
    confianca: 'alta' | 'media' | 'baixa';
    distanciaM?: number;
  };
  /** os 3 melhores palpites — o Claude confirma olhando os quadros */
  candidatos?: Candidato[];
  /** folha de contato: quadros a cada `passo` segundos, da esquerda p/ direita, de cima p/ baixo */
  quadros?: { imagem: string; passo: number; colunas: number };
}
