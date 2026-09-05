import { notFound } from 'next/navigation';
import { placeMapById } from '@/data/placeMaps';
import { MAPS_3D } from '@/lib/three/available';
import { Map3D } from '@/components/Map3D';

export function generateStaticParams() {
  return MAPS_3D.map((placeId) => ({ placeId }));
}

export default async function Map3DPage({ params }: { params: Promise<{ placeId: string }> }) {
  const { placeId } = await params;
  const map = placeMapById(placeId);
  if (!map || !MAPS_3D.includes(placeId)) notFound();
  return <Map3D map={map} />;
}
