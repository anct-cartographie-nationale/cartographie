import { type Effect, tryPromise } from 'effect/Effect';
import type { Feature, FeatureCollection, Point } from 'geojson';
import type { Address } from './address';
import { fetchGeocodage } from './geocodage';

type AddressProperties = {
  banId: string;
  city: string;
  citycode: string;
  context: string;
  district?: string;
  housenumber: string;
  id: string;
  importance: number;
  label: string;
  name: string;
  postcode: string;
  score: number;
  street: string;
  type: string;
  x: number;
  y: number;
};

type AddressFeature = Feature<Point, AddressProperties>;

type AddressFeatureCollection = FeatureCollection<Point, AddressProperties>;

const featureToAddress = (feature: AddressFeature): Address => ({
  id: feature.properties.id,
  label: feature.properties.label,
  city: feature.properties.city,
  citycode: feature.properties.citycode,
  postcode: feature.properties.postcode,
  street: [feature.properties.housenumber, feature.properties.street].filter(Boolean).join(' '),
  x: feature.geometry.coordinates[1] ?? 0,
  y: feature.geometry.coordinates[0] ?? 0
});

const onlyWithDefinedCoordinates = (address: Address) =>
  address.x != null && address.x !== 0 && address.y != null && address.y !== 0;

export const fetchAddressSuggestions = (input: string): Effect<Address[], Error> =>
  tryPromise({
    try: async () => {
      const collection = await fetchGeocodage<AddressFeatureCollection>({ q: input });
      return collection.features.map(featureToAddress).filter(onlyWithDefinedCoordinates);
    },
    catch: (err) => new Error(`Géoplateforme address fetch failed: ${err}`)
  });
