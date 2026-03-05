import { notFound } from 'next/navigation';
import type { NextRequest } from 'next/server';
import {
  type Departement,
  departementMatchingSlug,
  departements,
  type Region,
  regionMatchingSlug,
  regions
} from '@/features/collectivites-territoriales';
import { mediationNumeriqueToCsv } from '@/features/lieux-inclusion-numerique';
import {
  applyFilters,
  filtersSchema,
  inclusionNumeriqueFetchApi,
  isResponseError,
  LIEUX_ROUTE
} from '@/libraries/inclusion-numerique-api';
import { toSchemaLieuMediationNumerique } from '@/libraries/inclusion-numerique-api/transfer/to-schema-lieu-mediation-numerique';

const EXCLUDE_PARAMS = ['', 'lieux', 'exporter'];

const DEFAULT_ERROR_MESSAGE = "Erreur lors de l'export des lieux.";

const ERROR_MESSAGE_MAP: { [key: number]: string } = {
  504: 'L’export n’a pas pu être généré dans le délai imparti. Limitez le périmètre géographique ou ajoutez des filtres.'
};

export const GET = async (request: NextRequest) => {
  const url = new URL(request.url);
  const searchParams = Object.fromEntries(url.searchParams.entries());
  const [regionSlug, departementSlug] = url.pathname.split('/').filter((param) => !EXCLUDE_PARAMS.includes(param));

  const region: Region | undefined = regions.find(regionMatchingSlug(regionSlug));
  const departement: Departement | undefined = departements.find(departementMatchingSlug(departementSlug));

  if (!region || !departement) return notFound();

  try {
    const [lieux] = await inclusionNumeriqueFetchApi(LIEUX_ROUTE, {
      filter: { 'adresse->>code_insee': `like.${departement.code}%`, ...applyFilters(filtersSchema.parse(searchParams)) },
      order: ['nom', 'asc']
    });

    return new Response(mediationNumeriqueToCsv(lieux.map(toSchemaLieuMediationNumerique)), {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="lieux-inclusion-numerique-${departement.slug}-${new Date().toISOString().split('T')[0]}.csv"`
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
