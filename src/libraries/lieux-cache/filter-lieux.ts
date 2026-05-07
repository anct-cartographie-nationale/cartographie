import type { Region } from '@/libraries/collectivites';
import { regions } from '@/libraries/collectivites';
import type { Collectivite, FiltersSchema, LieuxRouteResponse } from '@/libraries/inclusion-numerique-api';
import type { OpeningHoursCache } from './opening-hours-cache';

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

const isOpenAt =
  (date: Date, ohCache: OpeningHoursCache): LieuPredicate =>
  (lieu) => {
    const oh = ohCache.get(lieu.id);
    if (!oh) return false;
    try {
      return oh.getState(date);
    } catch {
      return false;
    }
  };

const isOpenOnWeekend = (ohCache: OpeningHoursCache): LieuPredicate => {
  const now = new Date();

  const saturdayStart = new Date(now);
  saturdayStart.setDate(saturdayStart.getDate() + ((6 - now.getDay() + 7) % 7 || 7));
  saturdayStart.setHours(0, 0, 0, 0);
  const saturdayEnd = new Date(saturdayStart);
  saturdayEnd.setHours(23, 59, 59, 999);

  const sundayStart = new Date(now);
  sundayStart.setDate(sundayStart.getDate() + ((7 - now.getDay()) % 7 || 7));
  sundayStart.setHours(0, 0, 0, 0);
  const sundayEnd = new Date(sundayStart);
  sundayEnd.setHours(23, 59, 59, 999);

  return (lieu) => {
    const oh = ohCache.get(lieu.id);
    if (!oh) return false;
    return oh.getOpenIntervals(saturdayStart, saturdayEnd).length > 0 || oh.getOpenIntervals(sundayStart, sundayEnd).length > 0;
  };
};

const toFastPredicates = (filters: FiltersSchema, collectivite?: Collectivite): LieuPredicate[] =>
  [
    collectivite != null ? codeInseeStartsWith(collectiviteCodes(collectivite)) : undefined,
    filters.territoire_type && filters.territoires.length > 0
      ? TERRITOIRE_MATCHERS[filters.territoire_type](filters.territoires)
      : undefined,
    containsAny((l) => l.services, filters.services),
    containsAny((l) => l.publics_specifiquement_adresses, filters.publics_specifiquement_adresses),
    containsAny((l) => l.prise_en_charge_specifique, filters.prise_en_charge_specifique),
    containsAny((l) => l.frais_a_charge, filters.frais_a_charge),
    containsAny((l) => l.dispositif_programmes_nationaux, filters.dispositif_programmes_nationaux),
    containsAny((l) => l.autres_formations_labels, filters.autres_formations_labels),
    filters.prise_rdv.length > 0 ? (lieu: Lieu) => lieu.prise_rdv != null : undefined
  ].filter((p): p is LieuPredicate => p != null);

const toOHPredicates = (filters: FiltersSchema, ohCache?: OpeningHoursCache): LieuPredicate[] =>
  [
    filters.ouvert_actuellement != null && ohCache != null
      ? isOpenAt(new Date(filters.ouvert_actuellement), ohCache)
      : undefined,
    filters.ouvert_le_week_end === true && ohCache != null ? isOpenOnWeekend(ohCache) : undefined
  ].filter((p): p is LieuPredicate => p != null);

export const filterLieux = (
  lieux: LieuxRouteResponse,
  filters: FiltersSchema,
  collectivite?: Collectivite,
  ohCache?: OpeningHoursCache
): LieuxRouteResponse => {
  const fastPredicates = toFastPredicates(filters, collectivite);
  const ohPredicates = toOHPredicates(filters, ohCache);

  const afterFast = fastPredicates.length > 0 ? lieux.filter((lieu) => fastPredicates.every((p) => p(lieu))) : lieux;

  return ohPredicates.length > 0 ? afterFast.filter((lieu) => ohPredicates.every((p) => p(lieu))) : afterFast;
};
