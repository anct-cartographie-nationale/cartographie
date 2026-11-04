import {
  NextPageLink as ArckitNextPageLink,
  PageLink as ArckitPageLink,
  PreviousPageLink as ArckitPreviousPageLink
} from '@arckit/daisyui/blocks';
import type { ComponentProps, ReactNode } from 'react';
import { PaginationLink } from '../primitives/pagination-link';

const renderPaginationLink = (props: { href: string; children: ReactNode; className: string; title: string }) => (
  <PaginationLink {...props} />
);

export const PreviousPageLink = (props: Omit<ComponentProps<typeof ArckitPreviousPageLink>, 'renderLink'>) => (
  <ArckitPreviousPageLink {...props} renderLink={renderPaginationLink} />
);

export const NextPageLink = (props: Omit<ComponentProps<typeof ArckitNextPageLink>, 'renderLink'>) => (
  <ArckitNextPageLink {...props} renderLink={renderPaginationLink} />
);

export const PageLink = (props: Omit<ComponentProps<typeof ArckitPageLink>, 'renderLink'>) => (
  <ArckitPageLink {...props} renderLink={renderPaginationLink} />
);
