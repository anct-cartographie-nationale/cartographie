import type { Region } from '@/libraries/collectivites';
import { regions } from '@/libraries/collectivites';
import type { Collectivite, FiltersSchema, LieuxRouteResponse } from '@/libraries/inclusion-numerique-api';

type Lieu = LieuxRouteResponse[number];
type LieuPredicate = (lieu: Lieu) => boolean;

const codeInseeOf = (lieu: Lieu): string | undefined => lieu.adresse?.code_insee;

const codeInseeStartsWith =
  (codes: string[]): LieuPredicate =>
  (lieu) =>
    codes.some((code) => codeInseeOf(lieu)?.startsWith(code) ?? false);

const regionToDeptCodes = (regionCodes: string[]): string[] =>
  regionCodes.flatMap((code) => (regions as Region[]).find((r) => r.code === code)?.departements ?? []);

const collectiviteCodes = (collectivite: Collectivite): string[] =>
  'departements' in collectivite ? collectivite.departements : [collectivite.code];

const TERRITOIRE_MATCHERS: Record<NonNullable<FiltersSchema['territoire_type']>, (codes: string[]) => LieuPredicate> = {
  communes: (codes) => (lieu) => codes.includes(codeInseeOf(lieu) ?? ''),
  departements: codeInseeStartsWith,
  regions: (codes) => codeInseeStartsWith(regionToDeptCodes(codes))
};

const containsAny = (accessor: (lieu: Lieu) => string[] | undefined, values: string[]): LieuPredicate | undefined =>
  values.length > 0 ? (lieu) => accessor(lieu)?.some((v) => values.includes(v)) ?? false : undefined;

const toPredicates = (filters: FiltersSchema, collectivite?: Collectivite): LieuPredicate[] =>
  [
    containsAny((l) => l.services, filters.services),
    containsAny((l) => l.publics_specifiquement_adresses, filters.publics_specifiquement_adresses),
    containsAny((l) => l.prise_en_charge_specifique, filters.prise_en_charge_specifique),
    containsAny((l) => l.frais_a_charge, filters.frais_a_charge),
    containsAny((l) => l.dispositif_programmes_nationaux, filters.dispositif_programmes_nationaux),
    containsAny((l) => l.autres_formations_labels, filters.autres_formations_labels),
    filters.prise_rdv.length > 0 ? (lieu: Lieu) => lieu.prise_rdv != null : undefined,
    filters.territoire_type && filters.territoires.length > 0
      ? TERRITOIRE_MATCHERS[filters.territoire_type](filters.territoires)
      : undefined,
    collectivite != null ? codeInseeStartsWith(collectiviteCodes(collectivite)) : undefined
  ].filter((p): p is LieuPredicate => p != null);

export const filterLieux = (
  lieux: LieuxRouteResponse,
  filters: FiltersSchema,
  collectivite?: Collectivite
): LieuxRouteResponse => {
  const predicates = toPredicates(filters, collectivite);
  return predicates.length > 0 ? lieux.filter((lieu) => predicates.every((p) => p(lieu))) : lieux;
};
