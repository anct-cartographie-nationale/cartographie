import {
  autresFormationsLabelsContainsFilter,
  dispositifProgrammesNationauxContainsFilter,
  fraisAChargeContainsFilter,
  priseEnChargeSpecifiqueContainsFilter,
  publicsSpecifiquementAdressesContainsFilter,
  serviceContainsFilterTemplate
} from '@/external-api/inclusion-numerique';
import { filterUnion } from '@/libraries/api/options';
import type { FiltersSchema } from './validations';

export const applyFilters = (filters: FiltersSchema) => ({
  ...(filters.prise_rdv.length > 0 ? { or: '(prise_rdv.not.is.null)' } : {}),
  ...filterUnion(filters.services)(serviceContainsFilterTemplate),
  ...filterUnion(filters.prise_en_charge_specifique)(priseEnChargeSpecifiqueContainsFilter),
  ...filterUnion(filters.publics_specifiquement_adresses)(publicsSpecifiquementAdressesContainsFilter),
  ...filterUnion(filters.frais_a_charge)(fraisAChargeContainsFilter),
  ...filterUnion(filters.dispositif_programmes_nationaux)(dispositifProgrammesNationauxContainsFilter),
  ...filterUnion(filters.autres_formations_labels)(autresFormationsLabelsContainsFilter)
});
