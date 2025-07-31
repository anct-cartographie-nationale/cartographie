import type { ComponentProps } from 'react';
import { cn } from '@/libraries/utils';
import type { Color } from './color';
import type { Kind } from './kind';
import type { Scale } from './scale';

export type ButtonClass<Prefix extends `${string}btn` = 'btn'> = {
  color?: `${Prefix}-${Color}`;
  kind?: `${Prefix}-${Kind}`;
  behavior?: `${Prefix}-${'active' | 'disabled'}`;
  scale?: `${Prefix}-${Scale}`;
  modifier?: `${Prefix}-${'wide' | 'block' | 'square' | 'circle'}`;
};

export type ButtonProps = ComponentProps<'button'> & ButtonClass;

export const Button = ({ className, color, kind, behavior, scale, modifier, ...props }: ButtonProps) => (
  <button className={cn('btn', color, kind, behavior, scale, modifier, className)} {...props} />
);
