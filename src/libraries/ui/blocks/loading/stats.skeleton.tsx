import { Skeleton } from '@/libraries/ui/primitives/skeleton';

export const StatsSkeleton = () => (
  <div className='flex flex-col gap-3 p-4'>
    <Skeleton className='h-8 w-32' />
    <div className='flex flex-col gap-2'>
      {Array.from({ length: 5 }).map((_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
        <div key={index} className='flex justify-between items-center'>
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-4 w-8' />
        </div>
      ))}
    </div>
  </div>
);
