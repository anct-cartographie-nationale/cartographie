import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  appendCollectivites,
  type Departement,
  departementMatchingSlug,
  departements,
  type Region,
  regionMatchingDepartement,
  regions,
  withDepartement,
  withRegion
} from '@/features/collectivites-territoriales';
import { LieuxPage } from '@/features/lieux-inclusion-numerique';
import { asCount, countFromHeaders } from '@/libraries/api/options';
import {
  applyFilters,
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
  params: Promise<{ region: string; departement: string }>;
  searchParams?: Promise<{ page: string }>;
};

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const slug: string = (await params).departement;
  const departement: Departement | undefined = departements.find(departementMatchingSlug(slug));

  if (!departement) return notFound();

  return {
    title: appPageTitle('Liste des lieux', departement.nom),
    description: `Consultez la liste de tous les lieux d'inclusion numérique du département ${departement.nom}.`
  };
};

export const generateStaticParams = () =>
  departements.map((departement: Departement) => {
    const region: Region | undefined = regions.find(regionMatchingDepartement(departement));
    if (!region) return null;

    return {
      region: region.slug,
      departement: departement.slug
    };
  });

export default page
  .withAll(withRegion(), withDepartement(), withSearchParams<{ page: string }>(), withUrlSearchParams())
  .render(async ({ region, departement, searchParams, urlSearchParams }) => {
    const curentPage = pageSchema.parse(searchParams?.page);
    const limit = 24;

    const filter = { 'adresse->>code_insee': `like.${departement.code}%`, ...applyFilters(filtersSchema.parse(searchParams)) };

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
          { label: region.nom, href: hrefWithSearchParams(`/${region.slug}`)(urlSearchParams, ['page']) },
          { label: departement.nom }
        ]}
        mapHref={hrefWithSearchParams(`/${region.slug}/${departement.slug}`)(urlSearchParams, ['page'])}
        exportHref={hrefWithSearchParams(`/${region.slug}/${departement.slug}/lieux/exporter`)(urlSearchParams, ['page'])}
      />
    );
  });
