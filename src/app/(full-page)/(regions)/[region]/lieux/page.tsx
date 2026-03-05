import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  appendCollectivites,
  type Region,
  regionMatchingSlug,
  regions,
  withRegion
} from '@/features/collectivites-territoriales';
import { LieuxPage } from '@/features/lieux-inclusion-numerique';
import { asCount, buildAndFilter, countFromHeaders, filterUnion } from '@/libraries/api/options';
import {
  applyFilters,
  codeInseeStartWithFilterTemplate,
  filtersSchema,
  inclusionNumeriqueFetchApi,
  LIEU_LIST_FIELDS,
  LIEUX_ROUTE,
  type LieuxRouteOptions
} from '@/libraries/inclusion-numerique-api';
import { toLieuListItem } from '@/libraries/inclusion-numerique-api/transfer/to-lieu-list-item';
import { hrefWithSearchParams } from '@/libraries/next';
import { page, withSearchParams, withUrlSearchParams } from '@/libraries/next/page';
import { appPageTitle, pageSchema } from '@/libraries/utils';

type PageProps = {
  params: Promise<{ region: string }>;
  searchParams?: Promise<{ page: string }>;
};

export const generateStaticParams = async () => regions.map(({ slug }: Region) => ({ region: slug }));

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const slug: string = (await params).region;
  const region: Region | undefined = regions.find(regionMatchingSlug(slug));

  if (!region) return notFound();

  return {
    title: appPageTitle('Liste des lieux', region.nom),
    description: `Consultez la liste de tous les lieux d'inclusion numérique de la région ${region.nom}.`
  };
};

export default page
  .withAll(withRegion(), withSearchParams<{ page: string }>(), withUrlSearchParams())
  .render(async ({ region, searchParams, urlSearchParams }) => {
    const curentPage = pageSchema.parse(searchParams?.page);
    const limit = 24;

    const filter = buildAndFilter(
      filterUnion(region.departements)(codeInseeStartWithFilterTemplate),
      applyFilters(filtersSchema.parse(searchParams))
    );

    const [[lieux], [, headers]] = await Promise.all([
      inclusionNumeriqueFetchApi(LIEUX_ROUTE, {
        paginate: { limit, offset: (curentPage - 1) * limit },
        select: [...LIEU_LIST_FIELDS, 'telephone'],
        filter,
        order: ['nom', 'asc']
      }),
      inclusionNumeriqueFetchApi(LIEUX_ROUTE, ...asCount<LieuxRouteOptions>({ filter }))
    ]);

    return (
      <LieuxPage
        totalLieux={countFromHeaders(headers)}
        pageSize={limit}
        curentPage={curentPage}
        lieux={lieux.map((lieu) => toLieuListItem(new Date())(appendCollectivites(lieu)))}
        breadcrumbsItems={[
          { label: 'France', href: hrefWithSearchParams('/')(urlSearchParams, ['page']) },
          { label: region.nom }
        ]}
        mapHref={hrefWithSearchParams(`/${region.slug}`)(urlSearchParams, ['page'])}
        exportHref={hrefWithSearchParams(`/${region.slug}/lieux/exporter`)(urlSearchParams, ['page'])}
      />
    );
  });
