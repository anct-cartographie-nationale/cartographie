import type { ComponentProps } from 'react';
import { cn } from '@/libraries/utils';
import type { Scale } from './scale';

type Kind = 'dash' | 'border';

export type CardClass<Prefix extends `${string}card` = 'card'> = {
  scale?: `${Prefix}-${Scale}`;
  kind?: `${Prefix}-${Kind}`;
};

export type CardProps = ComponentProps<'div'> & CardClass;

export const Card = ({ className, color, scale, kind, ...props }: CardProps) => (
  <div className={cn('card', color, scale, kind, className)} {...props} />
);
