import { notFound, redirect } from 'next/navigation';
import { inclusionNumeriqueFetchApi, LIEUX_ROUTE } from '@/external-api/inclusion-numerique';
import { departementMatchingCode } from '@/features/collectivites-territoriales/departement';
import departements from '@/features/collectivites-territoriales/departements.json';
import { regionMatchingDepartement } from '@/features/collectivites-territoriales/region';
import regions from '@/features/collectivites-territoriales/regions.json';
import { provide } from '@/libraries/injection';
import { hrefWithSearchParams, URL_SEARCH_PARAMS } from '@/libraries/next';

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ page: string }>;
};

const Page = async ({ params: paramsPromise, searchParams: searchParamsPromise }: PageProps) => {
  const [params, searchParams] = await Promise.all([paramsPromise, searchParamsPromise]);
  const urlSearchParams: URLSearchParams = new URLSearchParams(searchParams);
  provide(URL_SEARCH_PARAMS, urlSearchParams);

  const [lieux] = await inclusionNumeriqueFetchApi(LIEUX_ROUTE, {
    paginate: { limit: 1, offset: 0 },
    filter: { id: `eq.${decodeURIComponent(params.id)}` },
    select: ['code_insee']
  });

  const lieu = lieux[0];
  if (!lieu) return notFound();

  const code = lieu.code_insee.startsWith('97') ? lieu.code_insee.slice(0, 3) : lieu.code_insee.slice(0, 2);

  const departement = departements.find(departementMatchingCode(code));
  const region = regions.find(regionMatchingDepartement({ code }));

  if (!region || !departement) return notFound();

  redirect(hrefWithSearchParams(`/${region.slug}/${departement.slug}/lieux/${params.id}`)(urlSearchParams));
};

export default Page;
