import type { LieuxRouteResponse } from '@/external-api/inclusion-numerique';
import { geographicDistance } from '@/external-api/inclusion-numerique/transfer/geographic-distance';
import { isOpenNow } from '@/features/lieux-inclusion-numerique/fiche-lieu/opening-hours.presenter';
import type { LieuListItem } from '@/features/lieux-inclusion-numerique/lieu-list-item';
import { formatPhoneNumber } from './format-phone-number';

const isDefined = <T>(value: T | null | undefined): value is T => value != null;

const isOpen =
  (date: Date) =>
  (horaires: string | undefined): boolean =>
    isDefined(horaires) ? isOpenNow(date)(horaires) : false;

export const toLieuListItem =
  (
    date: Date,
    localisation?: {
      latitude: number;
      longitude: number;
    }
  ) =>
  ({
    id,
    nom,
    adresse,
    departement,
    region,
    latitude,
    longitude,
    telephone,
    horaires,
    dispositif_programmes_nationaux,
    modalites_acces
  }: LieuxRouteResponse[number] & { region: string; departement: string }): LieuListItem => ({
    id,
    nom,
    adresse,
    departement,
    region,
    ...(localisation && latitude && longitude
      ? { distance: (geographicDistance({ latitude, longitude }, localisation) / 1000).toFixed(2) }
      : {}),
    ...(telephone ? { telephone: formatPhoneNumber(telephone) } : {}),
    isOpen: isOpen(date)(horaires),
    isByAppointment: modalites_acces?.includes('Se présenter') ?? false,
    isFranceServices: dispositif_programmes_nationaux?.includes('France Services') ?? false,
    isConum: dispositif_programmes_nationaux?.includes('Conseillers numériques') ?? false
  });
