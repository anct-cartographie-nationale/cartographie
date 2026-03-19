import { headers } from 'next/headers';
import type { ReactNode } from 'react';
import ClientLayout from '@/app/(with-map)/client.layout';
import {
  getCachedDepartementsStats,
  getCachedRegionsStats
} from '@/features/collectivites-territoriales/abilities/stats-query';
import { filtersSchema } from '@/libraries/inclusion-numerique-api';

type LayoutProps = {
  children: ReactNode;
};

const Layout = async ({ children }: LayoutProps) => {
  const requestHeaders = await headers();
  const currentUrl = requestHeaders.get('x-url');
  const searchParams = currentUrl ? Object.fromEntries(new URL(currentUrl).searchParams) : {};
  const filters = filtersSchema.parse(searchParams);

  const [regionsAvecTotaux, departementsAvecTotaux] = await Promise.all([
    getCachedRegionsStats(filters),
    getCachedDepartementsStats(filters)
  ]);

  return (
    <ClientLayout regions={regionsAvecTotaux} departements={departementsAvecTotaux}>
      {children}
    </ClientLayout>
  );
};

export default Layout;
