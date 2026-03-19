import { pipe } from 'effect';
import { mediationNumeriqueToCsv } from '@/features/lieux-inclusion-numerique';
import { fetchAllLieuxForDepartement } from '@/features/lieux-inclusion-numerique/abilities/export/query';
import { departementMatchingSlug, departements, regionMatchingSlug, regions } from '@/libraries/collectivites';
import { filtersSchema } from '@/libraries/inclusion-numerique-api';
import { toSchemaLieuMediationNumerique } from '@/libraries/inclusion-numerique-api/transfer/to-schema-lieu-mediation-numerique';
import {
  csvResponse,
  fromRoute,
  handle,
  use,
  withDerive,
  withErrorHandler,
  withFetch,
  withPathParam,
  withRequired,
  withSearchParams
} from '@/libraries/nextjs/route';

const DEFAULT_ERROR_MESSAGE = "Erreur lors de l'export des lieux.";

const ERROR_MESSAGE_MAP: { [key: number]: string } = {
  504: "L'export n'a pas pu être généré dans le délai imparti. Limitez le périmètre géographique ou ajoutez des filtres."
};

export const GET = pipe(
  fromRoute,
  (r) => use(r)(withPathParam('regionSlug', 0), withPathParam('departementSlug', 1), withSearchParams(filtersSchema)),
  (r) =>
    use(r)(
      withDerive('region', ({ regionSlug }) => regions.find(regionMatchingSlug(regionSlug))),
      withDerive('departement', ({ departementSlug }) => departements.find(departementMatchingSlug(departementSlug)))
    ),
  (r) => use(r)(withRequired('region', 'departement')),
  (r) => use(r)(withFetch('lieux', ({ departement, searchParams }) => fetchAllLieuxForDepartement(departement)(searchParams))),
  (r) =>
    handle(r)(
      withErrorHandler(
        ERROR_MESSAGE_MAP,
        DEFAULT_ERROR_MESSAGE
      )(async ({ lieux, departement }) =>
        csvResponse(mediationNumeriqueToCsv(lieux.map(toSchemaLieuMediationNumerique)), {
          filename: `lieux-inclusion-numerique-${departement.slug}`
        })
      )
    )
);
