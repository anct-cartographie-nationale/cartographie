import type { MapRef } from 'react-map-gl/maplibre';
import { Button } from '@/libraries/ui/primitives/button';

export const FragiliteNumeriqueControl = ({ mapRef }: { mapRef: MapRef | undefined }) => {
  const handleAddFragiliteLayer = () => {
    if (mapRef == null) return;

    const map = mapRef.getMap();

    if (map == null) return;

    if (map.getSource('fragilite') && map.getLayer('fragilite-fill')) {
      map.removeLayer('fragilite-fill');
      map.removeSource('fragilite');
      return;
    }

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

    map.addSource('fragilite', {
      type: 'vector',
      tiles: [`${baseUrl}/api/fragilite-numerique/{z}/{x}/{y}`],
      minzoom: 0,
      maxzoom: 14
    });

    map.addLayer({
      id: 'fragilite-fill',
      type: 'fill',
      source: 'fragilite',
      'source-layer': 'department',
      paint: {
        'fill-color': [
          'interpolate',
          ['linear'],
          ['get', 'score'],
          0,
          '#4a6bae',
          2,
          '#5f8ec7',
          4,
          '#aac4e6',
          6,
          '#ebb5bd',
          8,
          '#dd7480',
          10,
          '#d95c5e'
        ],
        'fill-opacity': 0.6
      }
    });
  };

  return (
    <Button className='text-start inline' kind='btn-ghost' onClick={handleAddFragiliteLayer}>
      Fragilité numérique
    </Button>
  );
};
