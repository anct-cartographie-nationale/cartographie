import { pipe } from 'effect';
import { type Effect, flatMap, map, runPromise, runSync, sleep, tap, tryPromise } from 'effect/Effect';
import { get, set, unsafeMake } from 'effect/Ref';
import type { Feature, FeatureCollection, Point } from 'geojson';
import type { ReactNode } from 'react';

export type Address = {
  id: string;
  label: string;
  city: string;
  citycode: string;
  housenumber: string;
  postcode: string;
  street: string;
  x: number;
  y: number;
};

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

const INPUT_MIN_LENGTH = 3;

const INPUT_DEBOUNCE_DELAY = 300;

const lastInputRef = unsafeMake('');
const lastItemsRef = unsafeMake<AddressFeature[]>([]);

const fetchSuggestionsEffect = (input: string): Effect<AddressFeature[], Error> =>
  tryPromise({
    try: () =>
      fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(input)}`)
        .then((res: Response): Promise<AddressFeatureCollection> => {
          if (!res.ok) throw new Error(res.statusText);
          return res.json();
        })
        .then(({ features }: AddressFeatureCollection) => features),
    catch: (error: unknown) => new Error(`Fetch failed: ${error}`)
  });

const itemToValue = ({ properties, geometry: { coordinates } }: AddressFeature): Address => ({
  ...properties,
  street: [properties.housenumber, properties.street].filter((streetPart) => streetPart != null).join(' '),
  x: coordinates[1] ?? 0,
  y: coordinates[0] ?? 0
});

type SuggestionsPayload = {
  isLoading: boolean;
};

const beforeLoadSuggestions = (): Partial<SuggestionsPayload> => ({
  isLoading: true
});

const loadSuggestions = (input: string): Promise<{ items: Address[] } & SuggestionsPayload> =>
  input.trim().length < INPUT_MIN_LENGTH
    ? Promise.resolve({ items: [], isLoading: false })
    : runPromise(
        pipe(
          set(lastInputRef, input),
          flatMap(() => sleep(INPUT_DEBOUNCE_DELAY)),
          flatMap(() => get(lastInputRef)),
          flatMap((latestInput: string) => (latestInput !== input ? get(lastItemsRef) : fetchSuggestionsEffect(input))),
          tap((features) => set(lastItemsRef, features)),
          map((features: AddressFeature[]): { items: Address[] } & SuggestionsPayload => ({
            items: features.map(itemToValue),
            isLoading: runSync(get(lastInputRef)) !== input
          }))
        )
      );

const itemToString = (item: Address | null): string => (item == null ? '' : item.label);

const itemToKey = (item: Address): string => item.id;

const renderItem = ({ item }: { item: Address }): ReactNode => <span>{itemToString(item)}</span>;

export const addressCombobox: {
  itemToString: typeof itemToString;
  itemToKey: typeof itemToKey;
  loadSuggestions: typeof loadSuggestions;
  beforeLoadSuggestions?: typeof beforeLoadSuggestions;
} = {
  itemToString,
  itemToKey,
  loadSuggestions,
  beforeLoadSuggestions
};

export const addressOptions: { itemToKey: typeof itemToKey; renderItem: typeof renderItem } = {
  itemToKey,
  renderItem
};
