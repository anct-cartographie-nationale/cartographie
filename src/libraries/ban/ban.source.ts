import { type Effect, tryPromise } from 'effect/Effect';
import type { Feature, FeatureCollection, Point } from 'geojson';
import type { Address } from './address';

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

type AddressFeatureCollection = FeatureCollection<Point, AddressFeature['properties']>;

const banFeatureToAddress = (feature: AddressFeature): Address => ({
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

export const fetchBanSuggestions = (input: string): Effect<Address[], Error> =>
  tryPromise({
    try: async () => {
      const res = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(input)}`);
      if (!res.ok) throw new Error(res.statusText);
      const address: AddressFeatureCollection = await res.json();
      return address.features.map(banFeatureToAddress).filter(onlyWithDefinedCoordinates);
    },
    catch: (err) => new Error(`BAN fetch failed: ${err}`)
  });
