import type { ReactNode } from 'react';
import { cn } from '@/libraries/utils';
import type { Scale } from './scale';

export type LoadingClass<Prefix extends `${string}loading` = 'loading'> = {
  style?: `${Prefix}-${'ball' | 'bars' | 'infinity'}`;
  scale?: `${Prefix}-${Scale}`;
};

export type LoadingProps = {
  isLoading: boolean;
  className?: string;
  children?: ReactNode;
} & LoadingClass;

export const Loading = ({ isLoading = false, className, children, style, scale }: LoadingProps) =>
  isLoading ? <span className={cn('loading', style, scale, className)} aria-hidden={true} /> : children;
