import { Skeleton } from '@/libraries/ui/primitives/skeleton';

export const LieuDetailSkeleton = () => (
  <div className='flex flex-col gap-6 p-6'>
    <div className='flex justify-between items-start'>
      <div className='flex-1'>
        <Skeleton className='h-8 w-3/4 mb-2' />
        <Skeleton className='h-5 w-1/2' />
      </div>
      <Skeleton className='h-12 w-12 rounded' />
    </div>
    <div className='flex gap-2'>
      <Skeleton className='h-6 w-20' />
      <Skeleton className='h-6 w-28' />
    </div>
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
      <div className='flex flex-col gap-4'>
        <Skeleton className='h-32 w-full' />
        <Skeleton className='h-48 w-full' />
      </div>
      <div className='flex flex-col gap-4'>
        <Skeleton className='h-40 w-full' />
        <Skeleton className='h-24 w-full' />
      </div>
    </div>
  </div>
);
