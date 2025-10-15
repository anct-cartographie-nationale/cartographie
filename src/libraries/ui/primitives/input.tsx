import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/libraries/utils';
import type { Color } from './color';
import type { Scale } from './scale';

export type InputClass<Prefix extends `${string}input` = 'input'> = {
  color?: `${Prefix}-${Color}`;
  kind?: `${Prefix}-${'ghost'}`;
  scale?: `${Prefix}-${Scale}`;
};

export type InputProps = ComponentProps<'input'> &
  InputClass & {
    left?: ReactNode;
    right?: ReactNode;
  };

const Input = ({ className, type, color, kind, scale, left, right, ...props }: InputProps) =>
  left == null && right == null ? (
    <input type={type} className={cn('input bg-input', color, kind, scale, className)} {...props} />
  ) : (
    <span className={cn('input bg-input', color, kind, scale, className)} tabIndex={-1}>
      {left}
      <input type={type} {...props} />
      {right}
    </span>
  );

export { Input };
