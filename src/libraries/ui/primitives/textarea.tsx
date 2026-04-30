import type { ComponentProps } from 'react';
import { cn } from '@/libraries/utils';
import type { Color } from './color';
import type { Scale } from './scale';

export type TextareaClass<Prefix extends `${string}textarea` = 'textarea'> = {
  color?: `${Prefix}-${Color}`;
  kind?: `${Prefix}-${'ghost'}`;
  scale?: `${Prefix}-${Scale}`;
};

export type TextareaProps = ComponentProps<'textarea'> & TextareaClass;

export const Textarea = ({ className, color, kind, scale, ...props }: TextareaProps) => (
  <textarea className={cn('textarea bg-input', color, kind, scale, className)} {...props} />
);
