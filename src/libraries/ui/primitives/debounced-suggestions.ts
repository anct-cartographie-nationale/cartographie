import { pipe } from 'effect';
import { catchAll, type Effect, flatMap, map, runPromise, sleep, succeed } from 'effect/Effect';
import { get, set, unsafeMake } from 'effect/Ref';

export type Suggestions<TItem> = { items: TItem[]; isLoading: boolean; error?: string };

export type DebounceOptions = {
  minLength?: number;
  delay?: number;
};

const DEFAULT_MIN_LENGTH = 3;
const DEFAULT_DELAY = 300;

export const loadingSuggestions = <TItem>(): Partial<Suggestions<TItem>> => ({ isLoading: true });

type SearchOutcome<TItem> = { items: TItem[] } | { error: string };

export const debouncedSuggestions = <TItem>(
  search: (input: string) => Effect<TItem[], Error>,
  { minLength = DEFAULT_MIN_LENGTH, delay = DEFAULT_DELAY }: DebounceOptions = {}
): ((input: string) => Promise<Suggestions<TItem>>) => {
  const latestInputRef = unsafeMake('');
  const settledInputRef = unsafeMake('');
  const settledItemsRef = unsafeMake<TItem[]>([]);

  const staleSuggestions = (): Effect<Suggestions<TItem>> =>
    pipe(
      get(settledItemsRef),
      flatMap((items) =>
        pipe(
          get(latestInputRef),
          flatMap((latest) => get(settledInputRef).pipe(map((settled) => ({ items, isLoading: latest !== settled }))))
        )
      )
    );

  const settle = (input: string, outcome: SearchOutcome<TItem>): Effect<Suggestions<TItem>> =>
    pipe(
      set(settledInputRef, input),
      flatMap(() => ('items' in outcome ? set(settledItemsRef, outcome.items) : set(settledItemsRef, []))),
      map(() =>
        'items' in outcome ? { items: outcome.items, isLoading: false } : { items: [], isLoading: false, error: outcome.error }
      )
    );

  const runSearch = (input: string): Effect<Suggestions<TItem>> =>
    pipe(
      search(input),
      map((items): SearchOutcome<TItem> => ({ items })),
      catchAll((error) => succeed<SearchOutcome<TItem>>({ error: error.message })),
      flatMap((outcome) =>
        get(latestInputRef).pipe(flatMap((latest) => (latest === input ? settle(input, outcome) : staleSuggestions())))
      )
    );

  return (input: string): Promise<Suggestions<TItem>> =>
    input.trim().length < minLength
      ? Promise.resolve({ items: [], isLoading: false })
      : runPromise(
          pipe(
            set(latestInputRef, input),
            flatMap(() => sleep(delay)),
            flatMap(() => get(latestInputRef)),
            flatMap((latest) => (latest !== input ? staleSuggestions() : runSearch(input)))
          )
        );
};
