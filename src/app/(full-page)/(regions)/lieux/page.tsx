import type { Metadata } from 'next';
import { inclusionNumeriqueFetchApi, LIEU_LIST_FIELDS, LIEUX_ROUTE, REGIONS_ROUTE } from '@/api/inclusion-numerique';
import { toLieuListItem } from '@/api/inclusion-numerique/transfer/toLieuListItem';
import { totalLieux } from '@/api/inclusion-numerique/transfer/total-lieux';
import { appendCollectivites } from '@/features/collectivites-territoriales/append-collectivites';
import { LieuxPage } from '@/features/lieux-inclusion-numerique/lieux.page';
import { appPageTitle } from '@/libraries/utils';
import { pageSchema } from '@/libraries/utils/page.schema';

export const generateMetadata = async (): Promise<Metadata> => ({
  title: appPageTitle('Liste des lieux', 'France'),
  description: "Consultez la liste de tous les lieux d'inclusion numérique de France."
});

type PageProps = {
  searchParams?: Promise<{ page: string }>;
};

const Page = async ({ searchParams }: PageProps) => {
  const curentPage = pageSchema.parse((await searchParams)?.page);
  const limit = 24;

  const regionRouteResponse = await inclusionNumeriqueFetchApi(REGIONS_ROUTE);

  const lieux = await inclusionNumeriqueFetchApi(LIEUX_ROUTE, {
    paginate: { limit, offset: (curentPage - 1) * limit },
    select: LIEU_LIST_FIELDS,
    order: ['nom', 'asc']
  });

  return (
    <LieuxPage
      totalLieux={totalLieux(regionRouteResponse)}
      pageSize={limit}
      curentPage={curentPage}
      lieux={lieux.map((lieu) => toLieuListItem(new Date())(appendCollectivites(lieu)))}
      href='/'
    />
  );
};

export default Page;
