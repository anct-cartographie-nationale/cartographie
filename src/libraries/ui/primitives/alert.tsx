import type { ComponentProps } from 'react';
import { cn } from '@/libraries/utils';
import type { StatusColor } from './color';
import type { Direction } from './direction';
import type { BlockKind } from './kind';

export type AlertClass<Prefix extends `${string}alert` = 'alert'> = {
  color?: `${Prefix}-${StatusColor}`;
  kind?: `${Prefix}-${BlockKind}`;
  direction?: `${Prefix}-${Direction}`;
};

export type AlertProps = ComponentProps<'div'> & AlertClass;

export const Alert = ({ className, children, color, kind, direction, ...props }: AlertProps) => (
  <div role='alert' className={cn('alert', color, kind, direction, className)} {...props}>
    {children}
  </div>
);
