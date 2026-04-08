import { LieuCardSkeleton } from './lieu-card.skeleton';

type LieuxListSkeletonProps = {
  count?: number;
};

export const LieuxListSkeleton = ({ count = 6 }: LieuxListSkeletonProps) =>
  Array.from({ length: count }).map((_, index) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
    <LieuCardSkeleton key={index} />
  ));
