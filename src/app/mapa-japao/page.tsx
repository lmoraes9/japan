import { MapaJapao } from '@/components/mapa-japao/MapaJapao';

export const metadata = { title: 'A viagem inteira · mapa do Japão' };

export default function MapaJapaoPage() {
  // sangria total: a tela é o mapa, sem margem nem cabeçalho do app
  return (
    <div className="fixed inset-0 overflow-hidden">
      <MapaJapao />
    </div>
  );
}
