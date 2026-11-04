'use client';

import { Breadcrumbs, NextPageLink, PageLink, Pagination, PreviousPageLink } from '@arckit/daisyui/blocks';
import type { Paginated } from '@arckit/resultset';
import { type ReactNode, useMemo, useRef } from 'react';
import { filter } from 'rxjs';
import type { LieuListItem } from '@/libraries/inclusion-numerique-api';
import { type Autour, autourKey, withoutAutourParams } from '@/libraries/inclusion-numerique-api/filters/autour';
import { hrefWithSearchParams } from '@/libraries/nextjs';
import { useSearchParams } from '@/libraries/nextjs/shim';
import { useTap } from '@/libraries/reactivity/Subscribe';
import { contentId } from '@/libraries/ui/blocks/skip-links/skip-links';
import SkipLinksPortal from '@/libraries/ui/blocks/skip-links/skip-links-portal';
import { Link } from '@/libraries/ui/primitives/link';
import { clearResultsFocusRequest, resultsFocusRequest$ } from '@/shared/ui/results-focus.stream';
import { autourBreadcrumbs, autourExit, autourStatus, autourTitle, withNearestCommune } from '../presenter/autour.presenter';
import { LieuxList } from './lieux-list';
import { useMapAutourLocation } from './use-map-autour-location';

const useResultsFocus = (key: string) => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const focusRequestForPlace$ = useMemo(() => resultsFocusRequest$.pipe(filter((requested) => requested === key)), [key]);

  useTap(focusRequestForPlace$, () => {
    titleRef.current?.focus();
    clearResultsFocusRequest();
  });

  return titleRef;
};

export const LieuxAutourPage = ({
  paginated: { items, totalItems, currentPage, pageSize },
  autour,
  breadcrumbsItems
}: {
  paginated: Paginated<LieuListItem>;
  autour: Autour;
  breadcrumbsItems?: { label: string; href?: string }[];
}): ReactNode => {
  const searchParams = useSearchParams();
  const filters = withoutAutourParams(searchParams);
  filters.delete('page');
  const territoire = withNearestCommune(autour, items);
  const exit = autourExit(territoire, filters);
  const titleRef = useResultsFocus(autourKey(autour));

  useMapAutourLocation(autour);

  return (
    <>
      <SkipLinksPortal />
      <Breadcrumbs items={breadcrumbsItems ?? autourBreadcrumbs(territoire, filters)} />
      <main id={contentId}>
        <div className='mb-4 mt-3'>
          <h1 ref={titleRef} tabIndex={-1} className='font-bold uppercase text-xs text-base-title'>
            {autourTitle(totalItems, autour)}
          </h1>
          <p role='status' className='sr-only'>
            {autourStatus(autour, items[0])}
          </p>
          {exit?.href && (
            <Link href={exit.href} className='inline-block mt-2 text-sm'>
              {exit.label}
            </Link>
          )}
        </div>
        <LieuxList searchParams={new URLSearchParams(filters)} lieux={items} className='flex flex-col gap-2' />
        <div className='text-center mt-10'>
          <Pagination
            currentPage={currentPage}
            itemsCount={totalItems}
            pageSize={pageSize}
            siblingCount={1}
            href={hrefWithSearchParams()(new URLSearchParams(searchParams), ['page'])}
            nav={{ previous: PreviousPageLink, next: NextPageLink }}
          >
            {PageLink}
          </Pagination>
        </div>
      </main>
    </>
  );
};
