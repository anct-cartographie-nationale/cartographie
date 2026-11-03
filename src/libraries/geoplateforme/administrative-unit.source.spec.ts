import { describe, expect, it } from 'vitest';
import { featureToCommune, featureToEpci, municipalityToCommune } from './administrative-unit.source';

describe('featureToCommune', () => {
  it('should map a commune point of interest', () => {
    expect(
      featureToCommune({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [8.736, 41.927] },
        properties: { toponym: 'Ajaccio', citycode: ['2A004'], depcode: ['2A'], extrafields: { population: '76320' } }
      })
    ).toStrictEqual({
      code: '2A004',
      nom: 'Ajaccio',
      codeDepartement: '2A',
      population: 76320,
      latitude: 41.927,
      longitude: 8.736
    });
  });

  it('should default missing codes and population', () => {
    expect(
      featureToCommune({ type: 'Feature', geometry: { type: 'Point', coordinates: [1, 2] }, properties: { toponym: 'X' } })
    ).toStrictEqual({ code: '', nom: 'X', codeDepartement: '', population: 0, latitude: 2, longitude: 1 });
  });
});

describe('municipalityToCommune', () => {
  it('should map a municipality from the address index, reading the departement from the context', () => {
    expect(
      municipalityToCommune({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [55.45, -20.88] },
        properties: { citycode: '97411', name: 'Saint-Denis', context: '974, La Réunion', population: 153810 }
      })
    ).toStrictEqual({
      code: '97411',
      nom: 'Saint-Denis',
      codeDepartement: '974',
      population: 153810,
      latitude: -20.88,
      longitude: 55.45
    });
  });
});

describe('featureToEpci', () => {
  it('should map an EPCI point of interest with its member communes', () => {
    expect(
      featureToEpci({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [-4.456, 48.387] },
        properties: {
          toponym: 'Brest Métropole',
          extrafields: { cleabs: 'EPCI____0000002150236789', codes_insee_des_communes_membres: ['29019', '29075'] }
        }
      })
    ).toStrictEqual({
      id: 'EPCI____0000002150236789',
      nom: 'Brest Métropole',
      communes: ['29019', '29075'],
      latitude: 48.387,
      longitude: -4.456
    });
  });

  it('should default to no member communes', () => {
    expect(
      featureToEpci({ type: 'Feature', geometry: { type: 'Point', coordinates: [1, 2] }, properties: { toponym: 'X' } })
        .communes
    ).toStrictEqual([]);
  });
});
