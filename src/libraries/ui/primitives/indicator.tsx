import type { ReactNode } from 'react';
import { cn } from '@/libraries/utils';

export type IndicatorClass<Prefix extends `${string}indicator` = 'indicator'> = {
  placementX?: `${Prefix}-${'start' | 'center' | 'end'}`;
  placementY?: `${Prefix}-${'top' | 'bottom'}`;
};

export type IndicatorProps = {
  displayIndicator?: boolean;
  indicatorContent?: ReactNode;
  className?: string;
  children: ReactNode;
} & IndicatorClass;

export const Indicator = ({
  displayIndicator = true,
  indicatorContent,
  placementX,
  placementY,
  className,
  children
}: IndicatorProps) => (
  <div className='indicator'>
    {displayIndicator && <span className={cn('indicator-item', placementX, placementY, className)}>{indicatorContent}</span>}
    {children}
  </div>
);
