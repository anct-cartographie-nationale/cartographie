import type { NextRequest } from 'next/server';
import { inclusionNumeriqueFetchApi, isResponseError, LIEUX_ROUTE } from '@/external-api/inclusion-numerique';
import { toSchemaLieuMediationNumerique } from '@/external-api/inclusion-numerique/transfer/to-schema-lieu-mediation-numerique';
import { applyFilters } from '@/features/lieux-inclusion-numerique/apply-filters';
import { mediationNumeriqueToCsv } from '@/features/lieux-inclusion-numerique/to-csv/mediation-numerique.to-csv';
import { filtersSchema } from '@/features/lieux-inclusion-numerique/validations';

const DEFAULT_ERROR_MESSAGE = "Erreur lors de l'exportation des lieux.";

const ERROR_MESSAGE_MAP: { [key: number]: string } = {
  504: 'L’export n’a pas pu aboutir : le nombre de lieux combiné aux filtres sélectionnés est trop important pour être traité dans un délai raisonnable. Essayez de restreindre votre recherche en ajoutant davantage de filtres, ou téléchargez les données à un niveau plus local (par région ou département).'
};

export const GET = async (request: NextRequest) => {
  const url = new URL(request.url);
  const searchParams = Object.fromEntries(url.searchParams.entries());

  try {
    const [lieux] = await inclusionNumeriqueFetchApi(LIEUX_ROUTE, {
      filter: applyFilters(filtersSchema.parse(searchParams)),
      order: ['nom', 'asc']
    });

    return new Response(mediationNumeriqueToCsv(lieux.map(toSchemaLieuMediationNumerique)), {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="lieux-inclusion-numerique-${new Date().toISOString().split('T')[0]}.csv"`
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
