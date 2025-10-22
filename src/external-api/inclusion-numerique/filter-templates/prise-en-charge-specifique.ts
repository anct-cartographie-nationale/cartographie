export const priseEnChargeSpecifiqueContainsFilter = (priseEnChargeSpecifique: string): string =>
  `prise_en_charge_specifique.like.%${priseEnChargeSpecifique}%`;
