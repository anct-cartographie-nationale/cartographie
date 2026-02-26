import { notFound } from 'next/navigation';
import type { NextRequest } from 'next/server';
import {
  codeInseeStartWithFilterTemplate,
  inclusionNumeriqueFetchApi,
  isResponseError,
  LIEUX_ROUTE
} from '@/external-api/inclusion-numerique';
import { toSchemaLieuMediationNumerique } from '@/external-api/inclusion-numerique/transfer/to-schema-lieu-mediation-numerique';
import { type Region, regionMatchingSlug } from '@/features/collectivites-territoriales/region';
import regions from '@/features/collectivites-territoriales/regions.json';
import { applyFilters } from '@/features/lieux-inclusion-numerique/apply-filters';
import { mediationNumeriqueToCsv } from '@/features/lieux-inclusion-numerique/to-csv/mediation-numerique.to-csv';
import { filtersSchema } from '@/features/lieux-inclusion-numerique/validations';
import { buildAndFilter, filterUnion } from '@/libraries/api/options';

const DEFAULT_ERROR_MESSAGE = "Erreur lors de l'export des lieux.";

const ERROR_MESSAGE_MAP: { [key: number]: string } = {
  504: "L'export n'a pas pu aboutir : le nombre de lieux combiné aux filtres sélectionnés est trop important pour être traité dans un délai raisonnable. Essayez de restreindre votre recherche en ajoutant davantage de filtres, ou téléchargez les données à un niveau plus local (par région ou département)."
};

type RouteParams = {
  params: Promise<{ region: string }>;
};

export const GET = async (request: NextRequest, { params }: RouteParams) => {
  const { region: regionSlug } = await params;
  const url = new URL(request.url);
  const searchParams = Object.fromEntries(url.searchParams.entries());

  const region: Region | undefined = regions.find(regionMatchingSlug(regionSlug));

  if (!region) return notFound();

  try {
    const [lieux] = await inclusionNumeriqueFetchApi(
      LIEUX_ROUTE,
      {
        filter: buildAndFilter(
          filterUnion(region.departements)(codeInseeStartWithFilterTemplate),
          applyFilters(filtersSchema.parse(searchParams))
        ),
        order: ['nom', 'asc']
      },
      undefined,
      { noCache: true }
    );

    return new Response(mediationNumeriqueToCsv(lieux.map(toSchemaLieuMediationNumerique)), {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="lieux-inclusion-numerique-${region.slug}-${new Date().toISOString().split('T')[0]}.csv"`,
        'Access-Control-Expose-Headers': 'Content-Disposition'
      }
    });
  } catch (error) {
    return isResponseError(error)
      ? new Response(ERROR_MESSAGE_MAP[error.response.status] ?? DEFAULT_ERROR_MESSAGE, {
          status: error.response.status
        })
      : new Response(DEFAULT_ERROR_MESSAGE, { status: 500 });
  }
};
