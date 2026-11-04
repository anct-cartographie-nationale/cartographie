'use client';

import { autourHref, autourNavigation } from '@/libraries/inclusion-numerique-api/filters/autour';
import { userMapCentre$ } from '@/libraries/map';
import { usePathname, useRouter, useSearchParams } from '@/libraries/nextjs/shim';
import { useTap } from '@/libraries/reactivity/Subscribe';

export const useAutourFromMapMoves = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useTap(userMapCentre$, (centre) => {
    const currentParams = new URLSearchParams(searchParams);
    router[autourNavigation(pathname, currentParams)](autourHref(centre, currentParams));
  });
};
