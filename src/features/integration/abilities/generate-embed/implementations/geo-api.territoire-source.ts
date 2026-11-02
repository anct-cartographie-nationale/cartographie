import { map, runPromise } from 'effect/Effect';
import type { Commune, CommuneAvecPopulation, Epci, TerritoireSource } from '@/features/integration/domain';
import { fetchGeoEpciCommunes, type GeoCommune, type GeoEpci, searchGeoCommunes, searchGeoEpcis } from '@/libraries/geo-api';

const toCommune = ({ code, nom, codeDepartement, centre, population = 0 }: GeoCommune): CommuneAvecPopulation => ({
  code,
  nom,
  codeDepartement,
  population,
  localisation: { latitude: centre?.coordinates[1] ?? 0, longitude: centre?.coordinates[0] ?? 0 }
});

const toEpci = ({ code, nom }: GeoEpci): Epci => ({ code, nom });

const hasLocalisation = ({ localisation }: Commune): boolean => localisation.latitude !== 0 && localisation.longitude !== 0;

const uniqueByCode = <T extends { code: string }>(items: T[]): T[] => [
  ...new Map(items.map((item) => [item.code, item])).values()
];

export const geoApiTerritoireSource: TerritoireSource = {
  searchCommunes: (query) =>
    runPromise(
      searchGeoCommunes(query.trim()).pipe(map((communes) => uniqueByCode(communes.map(toCommune).filter(hasLocalisation))))
    ),
  searchEpcis: (query) => runPromise(searchGeoEpcis(query.trim()).pipe(map((epcis) => epcis.map(toEpci)))),
  fetchEpciCommunes: (epciCode) => runPromise(fetchGeoEpciCommunes(epciCode).pipe(map((communes) => communes.map(toCommune))))
};
