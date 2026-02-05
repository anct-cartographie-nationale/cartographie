import { Layer, type LayerProps, Source } from 'react-map-gl/maplibre';
import { API_BASE_URL, inject } from '@/libraries/injection';

const layerStyle: LayerProps = {
  id: 'fragilite-fill',
  type: 'fill',
  source: 'fragilite',
  paint: {
    'fill-color': [
      'interpolate',
      ['linear'],
      ['get', 'score'],
      ...[0, '#4a6bae', 2, '#5f8ec7', 4, '#aac4e6', 6, '#ebb5bd', 8, '#dd7480', 10, '#d95c5e']
    ],
    'fill-opacity': 0.6
  }
};

const departementLayerStyle: LayerProps = {
  ...layerStyle,
  'source-layer': 'department'
};

const epciLayerStyle: LayerProps = {
  ...layerStyle,
  'source-layer': 'epci'
};

const cityLayerStyle: LayerProps = {
  ...layerStyle,
  'source-layer': 'city'
};

export const FragiliteNumeriqueLayers = ({
  fragiliteNumeriqueLayer,
  zoom
}: {
  fragiliteNumeriqueLayer: boolean;
  zoom: number;
}) => {
  const baseUrl = inject(API_BASE_URL);

  return (
    <>
      {fragiliteNumeriqueLayer && zoom <= 9 && (
        <Source
          id='fragilite'
          type='vector'
          minzoom={0}
          maxzoom={9}
          tiles={[`${baseUrl}/fragilite-numerique/department/{z}/{x}/{y}`]}
        >
          <Layer {...departementLayerStyle} />
        </Source>
      )}
      {fragiliteNumeriqueLayer && zoom > 9 && zoom < 12 && (
        <Source
          id='fragilite'
          type='vector'
          minzoom={9}
          maxzoom={12}
          tiles={[`${baseUrl}/fragilite-numerique/epci/{z}/{x}/{y}`]}
        >
          <Layer {...epciLayerStyle} />
        </Source>
      )}
      {fragiliteNumeriqueLayer && zoom >= 12 && (
        <Source
          id='fragilite'
          type='vector'
          minzoom={12}
          maxzoom={14}
          tiles={[`${baseUrl}/fragilite-numerique/city/{z}/{x}/{y}`]}
        >
          <Layer {...cityLayerStyle} />
        </Source>
      )}
    </>
  );
};
