import { csvStreamResponse, routeBuilder, withFetch, withSearchParams } from '@arckit/nextjs/route';
import { withErrorHandler } from '@/configuration/telemetry/error-reporter/server';
import { withLogger } from '@/configuration/telemetry/logger/server';
import { withDepartement, withRegion } from '@/features/collectivites-territoriales/middlewares/route';
import { mediationNumeriqueToCsvLines } from '@/features/lieux-inclusion-numerique';
import { fetchAllLieux } from '@/features/lieux-inclusion-numerique/abilities/export/query';
import { filtersSchema } from '@/libraries/inclusion-numerique-api';
import { toSchemaLieuMediationNumerique } from '@/libraries/inclusion-numerique-api/transfer/to-schema-lieu-mediation-numerique';

const DEFAULT_ERROR_MESSAGE = "Erreur lors de l'export des lieux.";

const ERROR_MESSAGE_MAP: { [key: number]: string } = {
  504: "L'export n'a pas pu être généré dans le délai imparti. Limitez le périmètre géographique ou ajoutez des filtres."
};

export const GET = routeBuilder()
  .use(
    withRegion(),
    withDepartement(),
    withSearchParams((raw) => filtersSchema.parse(raw))
  )
  .use(withFetch('lieux', ({ departement, searchParams }) => fetchAllLieux(departement)(searchParams)))
  .handle(
    withLogger('page:lieux:export:departement')(
      withErrorHandler(
        ERROR_MESSAGE_MAP,
        DEFAULT_ERROR_MESSAGE
      )(async ({ lieux, departement }) =>
        csvStreamResponse(mediationNumeriqueToCsvLines(lieux.map(toSchemaLieuMediationNumerique)), {
          filename: `lieux-inclusion-numerique-${departement.slug}`
        })
      )
    )
  );
