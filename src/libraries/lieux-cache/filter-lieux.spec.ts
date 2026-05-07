import { describe, expect, it } from 'vitest';
import type { FiltersSchema, LieuxRouteResponse } from '@/libraries/inclusion-numerique-api';
import { filterLieux } from './filter-lieux';
import { OpeningHoursCache } from './opening-hours-cache';

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

const lieu = (overrides: Partial<LieuxRouteResponse[number]> = {}): LieuxRouteResponse[number] =>
  ({
    id: 'lieu-1',
    nom: 'Lieu test',
    pivot: '',
    adresse: { code_insee: '75056', commune: 'Paris', nom_voie: '', code_postal: '75000', numero_voie: '', repetition: '' },
    date_maj: '2024-01-01',
    source: 'test',
    services: [],
    ...overrides
  }) as LieuxRouteResponse[number];

describe('filterLieux', () => {
  describe('sans filtre', () => {
    it('retourne tous les lieux avec des filtres vides', () => {
      const lieux = [lieu({ id: '1' }), lieu({ id: '2' }), lieu({ id: '3' })];

      expect(filterLieux(lieux, emptyFilters)).toHaveLength(3);
    });
  });

  describe('filtres par services', () => {
    it('garde les lieux qui ont le service demandé', () => {
      const lieux = [
        lieu({ id: '1', services: ['Aide aux démarches administratives'] }),
        lieu({ id: '2', services: ['Accès internet et matériel informatique'] }),
        lieu({ id: '3', services: [] })
      ];

      const result = filterLieux(lieux, { ...emptyFilters, services: ['Aide aux démarches administratives'] });

      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe('1');
    });

    it('garde les lieux qui ont au moins un des services demandés (OR)', () => {
      const lieux = [
        lieu({ id: '1', services: ['Aide aux démarches administratives'] }),
        lieu({ id: '2', services: ['Accès internet et matériel informatique'] }),
        lieu({ id: '3', services: ['Loisirs et créations numériques'] })
      ];

      const result = filterLieux(lieux, {
        ...emptyFilters,
        services: ['Aide aux démarches administratives', 'Accès internet et matériel informatique']
      });

      expect(result).toHaveLength(2);
    });

    it('exclut les lieux sans services', () => {
      const lieux = [lieu({ id: '1' })];

      const result = filterLieux(lieux, { ...emptyFilters, services: ['Aide aux démarches administratives'] });

      expect(result).toHaveLength(0);
    });
  });

  describe('filtres par publics spécifiquement adressés', () => {
    it('garde les lieux qui ciblent le public demandé', () => {
      const lieux = [
        lieu({ id: '1', publics_specifiquement_adresses: ['Jeunes'] }),
        lieu({ id: '2', publics_specifiquement_adresses: ['Seniors'] })
      ];

      const result = filterLieux(lieux, { ...emptyFilters, publics_specifiquement_adresses: ['Jeunes'] });

      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe('1');
    });
  });

  describe('filtre par prise de RDV', () => {
    it('garde les lieux qui ont une prise de RDV', () => {
      const lieux = [lieu({ id: '1', prise_rdv: 'https://rdv.example.com' }), lieu({ id: '2' })];

      const result = filterLieux(lieux, { ...emptyFilters, prise_rdv: ['Prise de RDV en ligne'] });

      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe('1');
    });
  });

  describe('filtres par dispositif programmes nationaux', () => {
    it('garde les lieux France Services', () => {
      const lieux = [
        lieu({ id: '1', dispositif_programmes_nationaux: ['France Services'] }),
        lieu({ id: '2', dispositif_programmes_nationaux: ['Conseillers numériques'] }),
        lieu({ id: '3' })
      ];

      const result = filterLieux(lieux, { ...emptyFilters, dispositif_programmes_nationaux: ['France Services'] });

      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe('1');
    });
  });

  describe('combinaison de filtres (AND entre types)', () => {
    it('combine services ET dispositif (les deux doivent matcher)', () => {
      const lieux = [
        lieu({
          id: '1',
          services: ['Aide aux démarches administratives'],
          dispositif_programmes_nationaux: ['France Services']
        }),
        lieu({ id: '2', services: ['Aide aux démarches administratives'] }),
        lieu({ id: '3', dispositif_programmes_nationaux: ['France Services'] })
      ];

      const result = filterLieux(lieux, {
        ...emptyFilters,
        services: ['Aide aux démarches administratives'],
        dispositif_programmes_nationaux: ['France Services']
      });

      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe('1');
    });
  });

  describe('filtre par territoire', () => {
    it('filtre par commune (code INSEE exact)', () => {
      const lieux = [
        lieu({
          id: '1',
          adresse: { code_insee: '75056', commune: 'Paris', nom_voie: '', code_postal: '', numero_voie: '', repetition: '' }
        }),
        lieu({
          id: '2',
          adresse: { code_insee: '13055', commune: 'Marseille', nom_voie: '', code_postal: '', numero_voie: '', repetition: '' }
        })
      ];

      const result = filterLieux(lieux, { ...emptyFilters, territoire_type: 'communes', territoires: ['75056'] });

      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe('1');
    });

    it('filtre par département (préfixe code INSEE)', () => {
      const lieux = [
        lieu({
          id: '1',
          adresse: { code_insee: '75056', commune: 'Paris', nom_voie: '', code_postal: '', numero_voie: '', repetition: '' }
        }),
        lieu({
          id: '2',
          adresse: { code_insee: '13055', commune: 'Marseille', nom_voie: '', code_postal: '', numero_voie: '', repetition: '' }
        }),
        lieu({
          id: '3',
          adresse: { code_insee: '75101', commune: 'Paris 1er', nom_voie: '', code_postal: '', numero_voie: '', repetition: '' }
        })
      ];

      const result = filterLieux(lieux, { ...emptyFilters, territoire_type: 'departements', territoires: ['75'] });

      expect(result).toHaveLength(2);
    });

    it('filtre par région (expansion vers départements)', () => {
      const lieux = [
        lieu({
          id: '1',
          adresse: { code_insee: '75056', commune: 'Paris', nom_voie: '', code_postal: '', numero_voie: '', repetition: '' }
        }),
        lieu({
          id: '2',
          adresse: { code_insee: '13055', commune: 'Marseille', nom_voie: '', code_postal: '', numero_voie: '', repetition: '' }
        })
      ];

      const result = filterLieux(lieux, { ...emptyFilters, territoire_type: 'regions', territoires: ['11'] });

      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe('1');
    });

    it('gère les départements DOM (préfixe 3 caractères)', () => {
      const lieux = [
        lieu({
          id: '1',
          adresse: {
            code_insee: '97105',
            commune: 'Pointe-à-Pitre',
            nom_voie: '',
            code_postal: '',
            numero_voie: '',
            repetition: ''
          }
        }),
        lieu({
          id: '2',
          adresse: {
            code_insee: '97209',
            commune: 'Fort-de-France',
            nom_voie: '',
            code_postal: '',
            numero_voie: '',
            repetition: ''
          }
        })
      ];

      const result = filterLieux(lieux, { ...emptyFilters, territoire_type: 'departements', territoires: ['971'] });

      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe('1');
    });
  });

  describe('filtre ouvert actuellement', () => {
    it('garde les lieux ouverts à la date donnée', () => {
      const lieux = [
        lieu({ id: '1', horaires: 'Mo-Fr 09:00-18:00' }),
        lieu({ id: '2', horaires: 'Sa 09:00-12:00' }),
        lieu({ id: '3' })
      ];
      const ohCache = new OpeningHoursCache(lieux);
      const wednesdayAt12UTC = '2026-05-06T12:00:00.000Z';

      const result = filterLieux(lieux, { ...emptyFilters, ouvert_actuellement: wednesdayAt12UTC }, undefined, ohCache);

      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe('1');
    });

    it('exclut les lieux sans horaires', () => {
      const lieux = [lieu({ id: '1' })];
      const ohCache = new OpeningHoursCache(lieux);

      const result = filterLieux(
        lieux,
        { ...emptyFilters, ouvert_actuellement: '2026-05-06T12:00:00.000Z' },
        undefined,
        ohCache
      );

      expect(result).toHaveLength(0);
    });

    it('exclut les lieux avec des horaires invalides', () => {
      const lieux = [lieu({ id: '1', horaires: 'invalid format' })];
      const ohCache = new OpeningHoursCache(lieux);

      const result = filterLieux(
        lieux,
        { ...emptyFilters, ouvert_actuellement: '2026-05-06T12:00:00.000Z' },
        undefined,
        ohCache
      );

      expect(result).toHaveLength(0);
    });
  });

  describe('filtre ouvert le week-end', () => {
    it('garde les lieux ouverts le samedi', () => {
      const lieux = [lieu({ id: '1', horaires: 'Mo-Sa 09:00-18:00' }), lieu({ id: '2', horaires: 'Mo-Fr 09:00-18:00' })];
      const ohCache = new OpeningHoursCache(lieux);

      const result = filterLieux(lieux, { ...emptyFilters, ouvert_le_week_end: true }, undefined, ohCache);

      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe('1');
    });

    it('garde les lieux ouverts le dimanche', () => {
      const lieux = [lieu({ id: '1', horaires: 'Su 10:00-16:00' }), lieu({ id: '2', horaires: 'Mo-Fr 09:00-18:00' })];
      const ohCache = new OpeningHoursCache(lieux);

      const result = filterLieux(lieux, { ...emptyFilters, ouvert_le_week_end: true }, undefined, ohCache);

      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe('1');
    });

    it('exclut les lieux sans horaires', () => {
      const lieux = [lieu({ id: '1' })];
      const ohCache = new OpeningHoursCache(lieux);

      const result = filterLieux(lieux, { ...emptyFilters, ouvert_le_week_end: true }, undefined, ohCache);

      expect(result).toHaveLength(0);
    });

    it('ne filtre pas quand ouvert_le_week_end est undefined', () => {
      const lieux = [lieu({ id: '1', horaires: 'Mo-Fr 09:00-18:00' })];

      const result = filterLieux(lieux, { ...emptyFilters, ouvert_le_week_end: undefined });

      expect(result).toHaveLength(1);
    });
  });

  describe('filtre par collectivité', () => {
    it('filtre par département', () => {
      const lieux = [
        lieu({
          id: '1',
          adresse: { code_insee: '64102', commune: 'Pau', nom_voie: '', code_postal: '', numero_voie: '', repetition: '' }
        }),
        lieu({
          id: '2',
          adresse: { code_insee: '33063', commune: 'Bordeaux', nom_voie: '', code_postal: '', numero_voie: '', repetition: '' }
        })
      ];

      const departement = {
        code: '64',
        nom: 'Pyrénées-Atlantiques',
        slug: 'pyrenees-atlantiques',
        zoom: 9,
        localisation: { latitude: 0, longitude: 0 }
      };

      const result = filterLieux(lieux, emptyFilters, departement);

      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe('1');
    });

    it('filtre par région (tous les départements de la région)', () => {
      const lieux = [
        lieu({
          id: '1',
          adresse: { code_insee: '75056', commune: 'Paris', nom_voie: '', code_postal: '', numero_voie: '', repetition: '' }
        }),
        lieu({
          id: '2',
          adresse: { code_insee: '92012', commune: 'Boulogne', nom_voie: '', code_postal: '', numero_voie: '', repetition: '' }
        }),
        lieu({
          id: '3',
          adresse: { code_insee: '13055', commune: 'Marseille', nom_voie: '', code_postal: '', numero_voie: '', repetition: '' }
        })
      ];

      const region = {
        code: '11',
        departements: ['75', '77', '78', '91', '92', '93', '94', '95'],
        nom: 'Île-de-France',
        slug: 'ile-de-france',
        zoom: 9,
        localisation: { latitude: 0, longitude: 0 }
      };

      const result = filterLieux(lieux, emptyFilters, region);

      expect(result).toHaveLength(2);
    });

    it('combine collectivité ET filtres de recherche', () => {
      const lieux = [
        lieu({
          id: '1',
          adresse: { code_insee: '64102', commune: 'Pau', nom_voie: '', code_postal: '', numero_voie: '', repetition: '' },
          dispositif_programmes_nationaux: ['France Services']
        }),
        lieu({
          id: '2',
          adresse: { code_insee: '64103', commune: 'Bayonne', nom_voie: '', code_postal: '', numero_voie: '', repetition: '' }
        }),
        lieu({
          id: '3',
          adresse: { code_insee: '33063', commune: 'Bordeaux', nom_voie: '', code_postal: '', numero_voie: '', repetition: '' },
          dispositif_programmes_nationaux: ['France Services']
        })
      ];

      const departement = {
        code: '64',
        nom: 'Pyrénées-Atlantiques',
        slug: 'pyrenees-atlantiques',
        zoom: 9,
        localisation: { latitude: 0, longitude: 0 }
      };

      const result = filterLieux(lieux, { ...emptyFilters, dispositif_programmes_nationaux: ['France Services'] }, departement);

      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe('1');
    });
  });
});
