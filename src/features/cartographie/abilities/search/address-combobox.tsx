import { all, type Effect, map } from 'effect/Effect';
import type { ReactNode } from 'react';
import type { Address } from '@/libraries/geoplateforme';
import { fetchAddressSuggestions } from '@/libraries/geoplateforme';
import { fetchLieuxSuggestions, fetchMediateursSuggestions } from '@/libraries/inclusion-numerique-api/search';
import { debouncedSuggestions, loadingSuggestions } from '@/libraries/ui/primitives/debounced-suggestions';

const fetchSuggestionsEffect = (input: string): Effect<Address[], Error> =>
  all([fetchMediateursSuggestions(input), fetchLieuxSuggestions(input), fetchAddressSuggestions(input)]).pipe(
    map(([mediateurs, lieux, ban]) => [...mediateurs, ...lieux, ...ban])
  );

const loadSuggestions = debouncedSuggestions(fetchSuggestionsEffect);

const itemToString = (item: Address | null): string => (item == null ? '' : (item.name ?? item.label));

const itemToKey = (item: Address): string => item.id;

const renderItem = ({ item }: { item: Address }): ReactNode => (
  <span className='flex flex-col gap-0 items-start'>
    {item.name != null && <span className='font-bold'>{item.name}</span>}
    <span>{item.label}</span>
  </span>
);

export const addressCombobox: {
  itemToString: typeof itemToString;
  itemToKey: typeof itemToKey;
  loadSuggestions: typeof loadSuggestions;
  beforeLoadSuggestions: typeof loadingSuggestions;
} = {
  itemToString,
  itemToKey,
  loadSuggestions,
  beforeLoadSuggestions: loadingSuggestions
};

export const addressOptions: { itemToKey: typeof itemToKey; renderItem: typeof renderItem } = {
  itemToKey,
  renderItem
};
