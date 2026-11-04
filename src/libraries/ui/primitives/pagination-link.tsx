'use client';

import type { MouseEvent, ReactNode } from 'react';
import { Link } from '@/libraries/nextjs/shim';

const parentOf = (element: Element): Element | null => {
  const root = element.getRootNode();
  return element.parentElement ?? (root instanceof ShadowRoot ? root.host : null);
};

const scrollAncestorsToTop = (element: Element | null): void => {
  if (element == null) return;
  element.scrollTop = 0;
  scrollAncestorsToTop(parentOf(element));
};

const opensElsewhere = ({ metaKey, ctrlKey, shiftKey }: MouseEvent): boolean => metaKey || ctrlKey || shiftKey;

export const PaginationLink = (props: { href: string; children: ReactNode; className?: string; title?: string }) => (
  <Link
    prefetch={false}
    scroll={false}
    onClick={(event) => {
      if (!opensElsewhere(event)) scrollAncestorsToTop(event.currentTarget);
    }}
    {...props}
  />
);
