import { Card } from '@/libraries/ui/primitives/card';
import { Skeleton } from '@/libraries/ui/primitives/skeleton';

export const LieuCardSkeleton = () => (
  <Card kind='card-border'>
    <div className='card-body'>
      <div className='flex justify-between gap-4'>
        <div className='flex-1'>
          <Skeleton className='h-6 w-3/4' />
          <div className='flex gap-2 mt-3'>
            <Skeleton className='h-5 w-16' />
            <Skeleton className='h-5 w-24' />
          </div>
        </div>
        <Skeleton className='h-10 w-10 rounded' />
      </div>
      <div className='flex gap-1 justify-between mt-2'>
        <Skeleton className='h-4 w-32' />
        <Skeleton className='h-4 w-16' />
      </div>
    </div>
  </Card>
);
