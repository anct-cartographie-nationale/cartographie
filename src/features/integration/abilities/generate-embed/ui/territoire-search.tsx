'use client';

import { Button, Input, Loading } from '@arckit/daisyui/primitives';
import { type ReactNode, useId } from 'react';
import { RiSearchLine } from 'react-icons/ri';
import { ComboBox } from '@/libraries/ui/primitives/combobox';
import { Options } from '@/libraries/ui/primitives/options';
import { debouncedSuggestions } from './debounced-suggestions';

type Searchable = { code: string; nom: string };

type TerritoireSearchProps<TItem extends Searchable> = {
  label: string;
  placeholder: string;
  search: (query: string) => Promise<TItem[]>;
  onSelect: (item: TItem) => void;
  isPending?: boolean;
};

const itemToString = (item: Searchable | null): string => item?.nom ?? '';

const itemToKey = (item: Searchable): string => item.code;

const renderItem = ({ item }: { item: Searchable }): ReactNode => (
  <span className='flex flex-col gap-0 items-start'>
    <span className='font-bold'>{item.nom}</span>
    <span className='text-xs'>{item.code}</span>
  </span>
);

export const TerritoireSearch = <TItem extends Searchable>({
  label,
  placeholder,
  search,
  onSelect,
  isPending = false
}: TerritoireSearchProps<TItem>) => {
  const inputId = useId();

  return (
    <ComboBox<TItem, { isLoading: boolean }>
      itemToString={itemToString}
      loadSuggestions={debouncedSuggestions(search)}
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
              payload.isLoading || isPending ? (
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
          <Options {...options} itemToKey={itemToKey} renderItem={renderItem} showEmpty={options.inputValue.length >= 2}>
            <span className='px-4 py-2 text-sm'>Aucun résultat</span>
          </Options>
        </div>
      )}
    </ComboBox>
  );
};
