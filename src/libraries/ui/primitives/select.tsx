import type { ComponentProps } from 'react';
import { cn } from '@/libraries/utils';
import type { Color } from './color';
import type { Scale } from './scale';

export type SelectClass<Prefix extends `${string}select` = 'select'> = {
  color?: `${Prefix}-${Color}`;
  scale?: `${Prefix}-${Scale}`;
};

export type SelectProps = ComponentProps<'select'> & SelectClass;

export const Select = ({ className, color, scale, ...props }: SelectProps) => (
  <select className={cn('select bg-input', color, scale, className)} {...props} />
);
