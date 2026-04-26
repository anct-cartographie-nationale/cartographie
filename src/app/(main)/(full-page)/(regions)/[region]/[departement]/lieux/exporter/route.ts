import { withDepartement, withRegion } from '@/features/collectivites-territoriales/middlewares/route';
import { mediationNumeriqueToCsvLines } from '@/features/lieux-inclusion-numerique';
import { fetchAllLieux } from '@/features/lieux-inclusion-numerique/abilities/export/query';
import { filtersSchema } from '@/libraries/inclusion-numerique-api';
import { toSchemaLieuMediationNumerique } from '@/libraries/inclusion-numerique-api/transfer/to-schema-lieu-mediation-numerique';
import { csvStreamResponse, routeBuilder, withErrorHandler, withFetch, withSearchParams } from '@/libraries/nextjs/route';

const DEFAULT_ERROR_MESSAGE = "Erreur lors de l'export des lieux.";

const ERROR_MESSAGE_MAP: { [key: number]: string } = {
  504: "L'export n'a pas pu être généré dans le délai imparti. Limitez le périmètre géographique ou ajoutez des filtres."
};

export const GET = routeBuilder()
  .use(withRegion(), withDepartement(), withSearchParams(filtersSchema))
  .use(
    withFetch('lieux', ({ departement, searchParams }) => fetchAllLieux(departement)(searchParams), {
      cache: {
        cacheKey: ({ departement, searchParams }) => ['export', 'departement', departement.code, searchParams],
        revalidate: false,
        tags: ['lieux']
      }
    })
  )
  .handle(
    withErrorHandler(
      ERROR_MESSAGE_MAP,
      DEFAULT_ERROR_MESSAGE
    )(async ({ lieux, departement }) =>
      csvStreamResponse(mediationNumeriqueToCsvLines(lieux.map(toSchemaLieuMediationNumerique)), {
        filename: `lieux-inclusion-numerique-${departement.slug}`
      })
    )
  );
