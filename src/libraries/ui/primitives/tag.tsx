import type { ComponentProps } from 'react';
import { cn } from '@/libraries/utils';
import type { Color } from './color';
import type { Kind } from './kind';
import type { Scale } from './scale';

export type TagClass<Prefix extends `${string}badge` = 'badge'> = {
  color?: `${Prefix}-${Color}`;
  kind?: `${Prefix}-${Kind}`;
  scale?: `${Prefix}-${Scale}`;
};

export type TagProps = ComponentProps<'span'> & TagClass;

export const Tag = ({ className, color, kind, scale, ...props }: TagProps) => (
  <span className={cn('tag', color, kind, scale, className)} {...props} />
);
