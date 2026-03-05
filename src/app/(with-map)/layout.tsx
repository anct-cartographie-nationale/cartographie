import { headers } from 'next/headers';
import type { ReactNode } from 'react';
import ClientLayout from '@/app/(with-map)/client.layout';
import { getCachedDepartementsStats, getCachedRegionsStats } from '@/features/collectivites-territoriales/stats';
import { filtersSchema } from '@/features/lieux-inclusion-numerique/validations';

type LayoutProps = {
  children: ReactNode;
};

const Layout = async ({ children }: LayoutProps) => {
  const referer = (await headers()).get('referer');
  const searchParams = referer ? Object.fromEntries(new URL(referer).searchParams) : {};
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
