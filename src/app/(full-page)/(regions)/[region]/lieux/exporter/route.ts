import { pipe } from 'effect';
import { mediationNumeriqueToCsv } from '@/features/lieux-inclusion-numerique';
import { fetchAllLieuxForRegion } from '@/features/lieux-inclusion-numerique/abilities/export/query';
import { regionMatchingSlug, regions } from '@/libraries/collectivites';
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
  withPathParams,
  withRequired,
  withSearchParams
} from '@/libraries/nextjs/route';

const DEFAULT_ERROR_MESSAGE = "Erreur lors de l'export des lieux.";

const ERROR_MESSAGE_MAP: { [key: number]: string } = {
  504: "L'export n'a pas pu être généré dans le délai imparti. Limitez le périmètre géographique ou ajoutez des filtres."
};

export const GET = pipe(
  fromRoute,
  (r) => use(r)(withPathParams({ regionSlug: 'region' }), withSearchParams(filtersSchema)),
  (r) => use(r)(withDerive('region', ({ regionSlug }) => regions.find(regionMatchingSlug(regionSlug)))),
  (r) => use(r)(withRequired('region')),
  (r) => use(r)(withFetch('lieux', ({ region, searchParams }) => fetchAllLieuxForRegion(region)(searchParams))),
  (r) =>
    handle(r)(
      withErrorHandler(
        ERROR_MESSAGE_MAP,
        DEFAULT_ERROR_MESSAGE
      )(async ({ lieux, region }) =>
        csvResponse(mediationNumeriqueToCsv(lieux.map(toSchemaLieuMediationNumerique)), {
          filename: `lieux-inclusion-numerique-${region.slug}`
        })
      )
    )
);
