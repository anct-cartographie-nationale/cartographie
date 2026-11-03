import { type Effect, tryPromise } from 'effect/Effect';
import type { Feature, FeatureCollection, Point } from 'geojson';
import type { GeocodedCommune, GeocodedEpci } from './administrative-unit';
import { fetchGeocodage } from './geocodage';

const SUGGESTIONS_LIMIT = 8;

export type CommuneProperties = {
  toponym: string;
  citycode?: string[];
  depcode?: string[];
  extrafields?: { population?: string };
};

export type EpciProperties = {
  toponym: string;
  extrafields?: { cleabs?: string; codes_insee_des_communes_membres?: string[] };
};

export type MunicipalityProperties = {
  citycode: string;
  name: string;
  context: string;
  population?: number;
};

export type CommuneFeature = Feature<Point, CommuneProperties>;

export type MunicipalityFeature = Feature<Point, MunicipalityProperties>;

export type EpciFeature = Feature<Point, EpciProperties>;

export const featureToCommune = ({ properties, geometry }: CommuneFeature): GeocodedCommune => ({
  code: properties.citycode?.[0] ?? '',
  nom: properties.toponym,
  codeDepartement: properties.depcode?.[0] ?? '',
  population: Number(properties.extrafields?.population ?? 0),
  latitude: geometry.coordinates[1] ?? 0,
  longitude: geometry.coordinates[0] ?? 0
});

export const municipalityToCommune = ({ properties, geometry }: MunicipalityFeature): GeocodedCommune => ({
  code: properties.citycode,
  nom: properties.name,
  codeDepartement: properties.context.split(',')[0]?.trim() ?? '',
  population: properties.population ?? 0,
  latitude: geometry.coordinates[1] ?? 0,
  longitude: geometry.coordinates[0] ?? 0
});

export const featureToEpci = ({ properties, geometry }: EpciFeature): GeocodedEpci => ({
  id: properties.extrafields?.cleabs ?? '',
  nom: properties.toponym,
  communes: properties.extrafields?.codes_insee_des_communes_membres ?? [],
  latitude: geometry.coordinates[1] ?? 0,
  longitude: geometry.coordinates[0] ?? 0
});

const searchAdministrativeUnits = <TProperties>(
  category: 'commune' | 'epci',
  input: string
): Promise<FeatureCollection<Point, TProperties>> =>
  fetchGeocodage({ q: input, index: 'poi', category, limit: String(SUGGESTIONS_LIMIT) });

const isPostcode = (input: string): boolean => /^\d{5}$/.test(input);

const searchMunicipalitiesByPostcode = (postcode: string): Promise<FeatureCollection<Point, MunicipalityProperties>> =>
  fetchGeocodage({ q: postcode, type: 'municipality', limit: String(SUGGESTIONS_LIMIT) });

export const searchCommunes = (input: string): Effect<GeocodedCommune[], Error> =>
  tryPromise({
    try: async () =>
      isPostcode(input)
        ? (await searchMunicipalitiesByPostcode(input)).features.map(municipalityToCommune)
        : (await searchAdministrativeUnits<CommuneProperties>('commune', input)).features.map(featureToCommune),
    catch: (err) => new Error(`Géoplateforme commune search failed: ${err}`)
  });

export const searchEpcis = (input: string): Effect<GeocodedEpci[], Error> =>
  tryPromise({
    try: async () => (await searchAdministrativeUnits<EpciProperties>('epci', input)).features.map(featureToEpci),
    catch: (err) => new Error(`Géoplateforme EPCI search failed: ${err}`)
  });
