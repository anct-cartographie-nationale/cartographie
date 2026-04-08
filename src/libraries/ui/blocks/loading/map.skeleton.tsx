import { Skeleton } from '@/libraries/ui/primitives/skeleton';

export const MapSkeleton = () => (
  <div className='relative h-full w-full'>
    <Skeleton className='h-full w-full' />
    <div className='absolute inset-0 flex items-center justify-center'>
      <span className='loading loading-bars loading-lg text-primary' />
    </div>
  </div>
);
