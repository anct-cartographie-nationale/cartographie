import { describe, expect, it } from 'vitest';
import { applyFilters, applySearchFilters } from './apply-filters';
import type { FiltersSchema } from './filters.schema';

const emptyFilters: FiltersSchema = {
  services: [],
  publics_specifiquement_adresses: [],
  prise_en_charge_specifique: [],
  frais_a_charge: [],
  prise_rdv: [],
  dispositif_programmes_nationaux: [],
  autres_formations_labels: [],
  territoires: []
};

describe('applySearchFilters', () => {
  it('should return empty object when no filters are provided', () => {
    expect(applySearchFilters(emptyFilters)).toEqual({});
  });

  it('should add prise_rdv filter when prise_rdv is not empty', () => {
    const filters: FiltersSchema = {
      ...emptyFilters,
      prise_rdv: ['Prise de RDV en ligne']
    };

    const result = applySearchFilters(filters);

    expect(result.or).toContain('prise_rdv.not.is.null');
  });

  it('should add services filter', () => {
    const filters: FiltersSchema = {
      ...emptyFilters,
      services: ['Aide aux démarches administratives']
    };

    const result = applySearchFilters(filters);

    expect(result.or).toContain('services.cs.{Aide aux démarches administratives}');
  });

  it('should add dispositif_programmes_nationaux filter', () => {
    const filters: FiltersSchema = {
      ...emptyFilters,
      dispositif_programmes_nationaux: ['France Services']
    };

    const result = applySearchFilters(filters);

    expect(result.or).toContain('dispositif_programmes_nationaux.cs.{France Services}');
  });
});

describe('applyFilters', () => {
  it('should return empty object when no filters are provided', () => {
    expect(applyFilters(emptyFilters)).toEqual({});
  });

  it('should combine territoire and search filters', () => {
    const filters: FiltersSchema = {
      ...emptyFilters,
      territoire_type: 'departements',
      territoires: ['75'],
      services: ['Aide aux démarches administratives']
    };

    const result = applyFilters(filters);

    expect(result.and).toBeDefined();
    expect(result.and).toContain('adresse->>code_insee.like.75*');
    expect(result.and).toContain('services.cs.{Aide aux démarches administratives}');
  });

  it('should return only territoire filter when no search filters', () => {
    const filters: FiltersSchema = {
      ...emptyFilters,
      territoire_type: 'departements',
      territoires: ['75']
    };

    const result = applyFilters(filters);

    expect(result).toEqual({
      and: '(or(adresse->>code_insee.like.75*))'
    });
  });
});
