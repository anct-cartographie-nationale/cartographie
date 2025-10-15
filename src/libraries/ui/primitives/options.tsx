import type { ReactNode } from 'react';
import { cn } from '@/libraries/utils';

export type OptionsData<T> = {
  itemToKey: (item: T) => string;
  renderItem: ({
    item,
    index,
    isSelected,
    isHighlighted
  }: {
    item: T;
    index: number;
    isSelected: boolean;
    isHighlighted: boolean;
  }) => ReactNode;
};

export const Options = <T,>({
  items,
  isOpen = false,
  showEmpty = false,
  selectedItem,
  highlightedItem,
  getMenuProps,
  getItemProps,
  itemToKey,
  renderItem,
  children
}: {
  items: T[];
  isOpen?: boolean;
  showEmpty?: boolean;
  selectedItem: T | null;
  highlightedItem: T | null;
  getMenuProps?: () => object;
  getItemProps?: ({ item, index }: { item: T; index: number }) => object;
  children?: ReactNode;
} & OptionsData<T>) => {
  const isHighlighted = (item: T) => highlightedItem != null && itemToKey(item) === itemToKey(highlightedItem);

  const isSelected = (item: T) => selectedItem != null && itemToKey(item) === itemToKey(selectedItem);

  return (
    <div
      className={cn(
        'menu bg-input rounded-field border-base-200 absolute z-10 mt-1.5 w-72 flex-nowrap border shadow-lg',
        !(isOpen && (items.length || showEmpty)) && 'hidden'
      )}
    >
      <ul className='max-h-50 overflow-scroll' {...getMenuProps?.()}>
        {isOpen &&
          items.map(
            (item: T, index: number): ReactNode => (
              <li
                {...getItemProps?.({ item, index })}
                key={itemToKey(item)}
                className={cn(isHighlighted(item) && 'bg-base-200', isSelected(item) && 'font-bold')}
              >
                {renderItem({ item, index, isHighlighted: isHighlighted(item), isSelected: isSelected(item) })}
              </li>
            )
          )}
      </ul>
      {isOpen && items.length === 0 && children && <li className='fr-menu-options__item'>{children}</li>}
    </div>
  );
};
