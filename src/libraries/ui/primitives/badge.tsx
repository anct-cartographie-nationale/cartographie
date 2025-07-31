import type { ComponentProps } from 'react';
import { cn } from '@/libraries/utils';
import type { Color } from './color';
import type { Kind } from './kind';
import type { Scale } from './scale';

export type BadgeClass<Prefix extends `${string}badge` = 'badge'> = {
  color?: `${Prefix}-${Color}`;
  kind?: `${Prefix}-${Kind}`;
  scale?: `${Prefix}-${Scale}`;
};

export type BadgeProps = ComponentProps<'span'> & BadgeClass;

export const Badge = ({ className, color, kind, scale, ...props }: BadgeProps) => (
  <span className={cn('badge', color, kind, scale, className)} {...props} />
);
