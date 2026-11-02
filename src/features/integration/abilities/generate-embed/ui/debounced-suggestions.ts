const INPUT_MIN_LENGTH = 2;
const INPUT_DEBOUNCE_DELAY = 300;

export type Suggestions<TItem> = { items: TItem[]; isLoading: boolean };

export const debouncedSuggestions = <TItem>(search: (query: string) => Promise<TItem[]>) => {
  let lastInput = '';
  let lastItems: TItem[] = [];

  return async (input: string): Promise<Suggestions<TItem>> => {
    lastInput = input;
    if (input.trim().length < INPUT_MIN_LENGTH) return { items: [], isLoading: false };
    await new Promise((resolve) => setTimeout(resolve, INPUT_DEBOUNCE_DELAY));
    if (lastInput !== input) return { items: lastItems, isLoading: true };
    lastItems = await search(input);
    return { items: lastItems, isLoading: lastInput !== input };
  };
};
