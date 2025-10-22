import type { ComponentProps } from 'react';
import { cn } from '@/libraries/utils';
import type { Color } from './color';
import type { Scale } from './scale';

export type CheckboxClass<Prefix extends `${string}checkbox` = 'checkbox'> = {
  color?: `${Prefix}-${Color}`;
  scale?: `${Prefix}-${Scale}`;
};

export type CheckboxProps = ComponentProps<'input'> & CheckboxClass;

export const Checkbox = ({ className, color, scale, ...props }: CheckboxProps) => (
  <input type='checkbox' className={cn('checkbox mb-1', color, scale, className)} {...props} />
);
