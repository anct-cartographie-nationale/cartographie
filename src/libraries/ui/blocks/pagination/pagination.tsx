import { Fragment, type ReactNode } from 'react';
import { cn } from '@/libraries/utils';
import { paginate } from './paginate';

type PaginationProps = {
  itemsCount: number;
  pageSize: number;
  curentPage?: number;
  siblingCount?: number;
  boundaryCount?: number;
  nav?: {
    previous: (props: { number: number; disabled: boolean; href: string }) => ReactNode;
    next: (props: { number: number; disabled: boolean; href: string }) => ReactNode;
  };
  href?: string;
  className?: string;
  children: (props: { number: number; isCurrent: boolean; href: string }) => ReactNode;
};

export const Pagination = ({
  itemsCount,
  pageSize,
  curentPage = 1,
  siblingCount = 2,
  boundaryCount = 1,
  nav,
  href = '',
  className,
  children
}: PaginationProps) => {
  const { pages, lastPage, previousPage, nextPage } = paginate({
    itemsCount,
    pageSize,
    curentPage,
    siblingCount,
    boundaryCount
  });

  return (
    <div className={cn('join', className)}>
      {nav?.previous({ number: previousPage, disabled: curentPage <= 1, href })}
      {pages.map((page) =>
        'spacer' in page ? (
          <span key={page.spacer} className='p-2 mx-2'>
            ...
          </span>
        ) : (
          <Fragment key={page.number}>{children({ ...page, href })}</Fragment>
        )
      )}
      {nav?.next({ number: nextPage, disabled: curentPage >= lastPage, href })}
    </div>
  );
};
