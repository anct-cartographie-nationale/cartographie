import { pipe } from 'effect';
import { type Effect, flatMap, map, runPromise, runSync, sleep, tap } from 'effect/Effect';
import { get, set, unsafeMake } from 'effect/Ref';

export type Suggestions<TItem> = { items: TItem[]; isLoading: boolean };

export type DebounceOptions = {
  minLength?: number;
  delay?: number;
};

const DEFAULT_MIN_LENGTH = 3;
const DEFAULT_DELAY = 300;

export const loadingSuggestions = <TItem>(): Partial<Suggestions<TItem>> => ({ isLoading: true });

export const debouncedSuggestions = <TItem>(
  search: (input: string) => Effect<TItem[], Error>,
  { minLength = DEFAULT_MIN_LENGTH, delay = DEFAULT_DELAY }: DebounceOptions = {}
): ((input: string) => Promise<Suggestions<TItem>>) => {
  const lastInputRef = unsafeMake('');
  const lastItemsRef = unsafeMake<TItem[]>([]);

  return (input: string): Promise<Suggestions<TItem>> =>
    input.trim().length < minLength
      ? Promise.resolve({ items: [], isLoading: false })
      : runPromise(
          pipe(
            set(lastInputRef, input),
            flatMap(() => sleep(delay)),
            flatMap(() => get(lastInputRef)),
            flatMap((latestInput: string) => (latestInput !== input ? get(lastItemsRef) : search(input))),
            tap((items) => set(lastItemsRef, items)),
            map((items: TItem[]): Suggestions<TItem> => ({ items, isLoading: runSync(get(lastInputRef)) !== input }))
          )
        );
};
