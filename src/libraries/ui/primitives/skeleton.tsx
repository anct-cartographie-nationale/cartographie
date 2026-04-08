import type { ComponentProps } from 'react';
import { cn } from '@/libraries/utils';

export type SkeletonProps = ComponentProps<'div'>;

export const Skeleton = ({ className, ...props }: SkeletonProps) => <div className={cn('skeleton', className)} {...props} />;
