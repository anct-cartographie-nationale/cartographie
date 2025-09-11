import type { LieuxRouteResponse } from '@/api/inclusion-numerique';
import { geographicDistance } from '@/api/inclusion-numerique/transfer/geographic-distance';
import { isOpenNow } from '@/features/lieux-inclusion-numerique/fiche-lieu/opening-hours.presenter';
import type { LieuListItem } from '@/features/lieux-inclusion-numerique/lieu-list-item';

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
    commune,
    code_postal,
    departement,
    region,
    latitude,
    longitude,
    horaires,
    dispositif_programmes_nationaux,
    modalites_acces
  }: LieuxRouteResponse[number] & { region: string; departement: string }): LieuListItem => ({
    id,
    nom,
    adresse,
    commune,
    codePostal: code_postal,
    departement,
    region,
    ...(localisation && latitude && longitude
      ? { distance: (geographicDistance({ latitude, longitude }, localisation) / 1000).toFixed(2) }
      : {}),
    isOpen: isOpen(date)(horaires),
    isByAppointment: modalites_acces?.includes('Se présenter') ?? false,
    isFranceServices: dispositif_programmes_nationaux?.includes('France Services') ?? false,
    isConum: dispositif_programmes_nationaux?.includes('Conseillers numériques') ?? false
  });
