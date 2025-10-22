import type { BadgeProps } from '@/libraries/ui/primitives/badge';
import { Indicator, type IndicatorProps } from '@/libraries/ui/primitives/indicator';
import { cn } from '@/libraries/utils';

type IndicatorBadgeProps = IndicatorProps & BadgeProps;

export const IndicatorBadge = ({ color, kind, scale, className, ...props }: IndicatorBadgeProps) => (
  <Indicator className={cn('badge', color, kind, scale, className)} {...props} />
);
