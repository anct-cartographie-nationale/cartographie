import { map, runPromise } from 'effect/Effect';
import type { Commune, Epci, TerritoireSource } from '@/features/integration/domain';
import { type GeocodedCommune, type GeocodedEpci, searchCommunes, searchEpcis } from '@/libraries/geoplateforme';

const toCommune = ({ code, nom, codeDepartement, latitude, longitude }: GeocodedCommune): Commune => ({
  code,
  nom,
  codeDepartement,
  localisation: { latitude, longitude }
});

const toEpci = ({ id, nom, communes, latitude, longitude }: GeocodedEpci): Epci => ({
  code: id,
  nom,
  communes,
  localisation: { latitude, longitude }
});

const hasCode = ({ code }: { code: string }): boolean => code !== '';

const hasLocalisation = ({ localisation }: Commune | Epci): boolean =>
  localisation.latitude !== 0 && localisation.longitude !== 0;

const hasCommunes = ({ communes }: Epci): boolean => communes.length > 0;

export const geoplateformeTerritoireSource: TerritoireSource = {
  searchCommunes: (query) =>
    runPromise(
      searchCommunes(query.trim()).pipe(map((communes) => communes.map(toCommune).filter(hasCode).filter(hasLocalisation)))
    ),
  searchEpcis: (query) =>
    runPromise(
      searchEpcis(query.trim()).pipe(
        map((epcis) => epcis.map(toEpci).filter(hasCode).filter(hasLocalisation).filter(hasCommunes))
      )
    )
};
