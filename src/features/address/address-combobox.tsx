import { pipe } from 'effect';
import { all, type Effect, flatMap, map, runPromise, runSync, sleep, tap } from 'effect/Effect';
import { get, set, unsafeMake } from 'effect/Ref';
import type { ReactNode } from 'react';
import type { Address } from './address';
import { fetchBanSuggestions } from './ban.source';
import { fetchLieuxSuggestions } from './lieux.source';

const INPUT_MIN_LENGTH = 3;

const INPUT_DEBOUNCE_DELAY = 300;

const lastInputRef = unsafeMake('');
const lastItemsRef = unsafeMake<Address[]>([]);

const fetchSuggestionsEffect = (input: string): Effect<Address[], Error> =>
  all([fetchLieuxSuggestions(input), fetchBanSuggestions(input)]).pipe(map(([lieux, ban]) => [...lieux, ...ban]));

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
          tap((addresses) => set(lastItemsRef, addresses)),
          map((addresses: Address[]): { items: Address[] } & SuggestionsPayload => ({
            items: addresses,
            isLoading: runSync(get(lastInputRef)) !== input
          }))
        )
      );

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
