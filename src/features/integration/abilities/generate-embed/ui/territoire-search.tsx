'use client';

import { Button, Input, Loading } from '@arckit/daisyui/primitives';
import { tryPromise } from 'effect/Effect';
import { type ReactNode, useId, useMemo } from 'react';
import { RiSearchLine } from 'react-icons/ri';
import { ComboBox } from '@/libraries/ui/primitives/combobox';
import { debouncedSuggestions, loadingSuggestions } from '@/libraries/ui/primitives/debounced-suggestions';
import { Options } from '@/libraries/ui/primitives/options';

const INPUT_MIN_LENGTH = 2;

type Searchable = { code: string; nom: string };

type TerritoireSearchProps<TItem extends Searchable> = {
  label: string;
  placeholder: string;
  search: (query: string) => Promise<TItem[]>;
  onSelect: (item: TItem) => void;
  itemToDetail?: (item: TItem) => string;
};

const itemToString = (item: Searchable | null): string => item?.nom ?? '';

const itemToKey = (item: Searchable): string => item.code;

const codeDetail = (item: Searchable): string => item.code;

const renderItemWith =
  <TItem extends Searchable>(itemToDetail: (item: TItem) => string) =>
  ({ item }: { item: TItem }): ReactNode => (
    <span className='flex flex-col gap-0 items-start'>
      <span className='font-bold'>{item.nom}</span>
      <span className='text-xs'>{itemToDetail(item)}</span>
    </span>
  );

export const TerritoireSearch = <TItem extends Searchable>({
  label,
  placeholder,
  search,
  onSelect,
  itemToDetail = codeDetail
}: TerritoireSearchProps<TItem>) => {
  const inputId = useId();
  const renderItem = useMemo(() => renderItemWith(itemToDetail), [itemToDetail]);
  const loadSuggestions = useMemo(
    () =>
      debouncedSuggestions(
        (query: string) =>
          tryPromise({ try: () => search(query), catch: (err) => new Error(`territoire search failed: ${err}`) }),
        { minLength: INPUT_MIN_LENGTH }
      ),
    [search]
  );

  return (
    <ComboBox<TItem, { isLoading: boolean; error?: string }>
      itemToString={itemToString}
      beforeLoadSuggestions={loadingSuggestions}
      loadSuggestions={loadSuggestions}
      onSelectedItemChange={onSelect}
    >
      {({ getLabelProps, getInputProps, getToggleButtonProps, payload, ...options }) => (
        <div className='relative'>
          <label htmlFor={inputId} {...getLabelProps()} className='label mb-1'>
            {label}
          </label>
          <Input
            id={inputId}
            type='text'
            className='w-full'
            placeholder={placeholder}
            autoComplete='off'
            right={
              payload.isLoading ? (
                <Loading isLoading />
              ) : (
                <Button
                  kind='btn-ghost'
                  className='p-2'
                  title='Afficher les résultats'
                  {...getToggleButtonProps({ type: 'button' })}
                >
                  <RiSearchLine size={20} />
                </Button>
              )
            }
            {...getInputProps()}
          />
          <Options
            {...options}
            itemToKey={itemToKey}
            renderItem={renderItem}
            showEmpty={!payload.isLoading && options.inputValue.trim().length >= INPUT_MIN_LENGTH}
          >
            <span className='px-4 py-2 text-sm'>
              {payload.error ? 'La recherche a échoué, veuillez réessayer.' : 'Aucun résultat'}
            </span>
          </Options>
        </div>
      )}
    </ComboBox>
  );
};
