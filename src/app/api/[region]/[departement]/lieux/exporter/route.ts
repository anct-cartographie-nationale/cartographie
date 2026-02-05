import { notFound } from 'next/navigation';
import type { NextRequest } from 'next/server';
import { inclusionNumeriqueFetchApi, isResponseError, LIEUX_ROUTE } from '@/external-api/inclusion-numerique';
import { toSchemaLieuMediationNumerique } from '@/external-api/inclusion-numerique/transfer/to-schema-lieu-mediation-numerique';
import { type Departement, departementMatchingSlug } from '@/features/collectivites-territoriales/departement';
import departements from '@/features/collectivites-territoriales/departements.json';
import { type Region, regionMatchingSlug } from '@/features/collectivites-territoriales/region';
import regions from '@/features/collectivites-territoriales/regions.json';
import { applyFilters } from '@/features/lieux-inclusion-numerique/apply-filters';
import { mediationNumeriqueToCsv } from '@/features/lieux-inclusion-numerique/to-csv/mediation-numerique.to-csv';
import { filtersSchema } from '@/features/lieux-inclusion-numerique/validations';

const DEFAULT_ERROR_MESSAGE = "Erreur lors de l'export des lieux.";

const ERROR_MESSAGE_MAP: { [key: number]: string } = {
  504: "L'export n'a pas pu être généré dans le délai imparti. Limitez le périmètre géographique ou ajoutez des filtres."
};

type RouteParams = {
  params: Promise<{ region: string; departement: string }>;
};

export const GET = async (request: NextRequest, { params }: RouteParams) => {
  const { region: regionSlug, departement: departementSlug } = await params;
  const url = new URL(request.url);
  const searchParams = Object.fromEntries(url.searchParams.entries());

  const region: Region | undefined = regions.find(regionMatchingSlug(regionSlug));
  const departement: Departement | undefined = departements.find(departementMatchingSlug(departementSlug));

  if (!region || !departement) return notFound();

  try {
    const [lieux] = await inclusionNumeriqueFetchApi(
      LIEUX_ROUTE,
      {
        filter: { 'adresse->>code_insee': `like.${departement.code}%`, ...applyFilters(filtersSchema.parse(searchParams)) },
        order: ['nom', 'asc']
      },
      undefined,
      { noCache: true }
    );

    return new Response(mediationNumeriqueToCsv(lieux.map(toSchemaLieuMediationNumerique)), {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="lieux-inclusion-numerique-${departement.slug}-${new Date().toISOString().split('T')[0]}.csv"`,
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
