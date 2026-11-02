import { describe, expect, it } from 'vitest';
import type { Departement, Region } from '@/libraries/collectivites';
import { territoireFromCommune, territoireFromDepartement, territoireFromEpci, territoireFromRegion } from './territoire';

const bretagne: Region = {
  code: '53',
  departements: ['22', '29', '35', '56'],
  nom: 'Bretagne',
  slug: 'bretagne',
  zoom: 8,
  localisation: { latitude: 48.2, longitude: -2.9 }
};

const finistere: Departement = {
  code: '29',
  nom: 'Finistère',
  slug: 'finistere',
  zoom: 9.3,
  localisation: { latitude: 48.26, longitude: -4.06 }
};

const regions: Region[] = [bretagne];
const departements: Departement[] = [finistere];

describe('territoire', () => {
  it('should build a territoire from a region', () => {
    expect(territoireFromRegion(bretagne)).toStrictEqual({
      type: 'region',
      code: '53',
      nom: 'Bretagne',
      localisation: { latitude: 48.2, longitude: -2.9 },
      zoom: 8,
      path: '/bretagne',
      filtre: { type: 'regions', codes: ['53'] }
    });
  });

  it('should build a territoire from a departement with its region path', () => {
    expect(territoireFromDepartement(finistere, regions)).toStrictEqual({
      type: 'departement',
      code: '29',
      nom: 'Finistère',
      localisation: { latitude: 48.26, longitude: -4.06 },
      zoom: 9.3,
      path: '/bretagne/finistere',
      filtre: { type: 'departements', codes: ['29'] }
    });
  });

  it('should fall back to root path when the departement region is unknown', () => {
    expect(territoireFromDepartement(finistere, []).path).toBe('/');
  });

  it('should build a territoire from a commune centered on it', () => {
    const landerneau = {
      code: '29103',
      nom: 'Landerneau',
      codeDepartement: '29',
      localisation: { latitude: 48.4512, longitude: -4.2486 }
    };

    expect(territoireFromCommune(landerneau, departements, regions)).toStrictEqual({
      type: 'commune',
      code: '29103',
      nom: 'Landerneau',
      localisation: { latitude: 48.4512, longitude: -4.2486 },
      zoom: 13,
      path: '/bretagne/finistere',
      filtre: { type: 'communes', codes: ['29103'] }
    });
  });

  it('should build a territoire from an EPCI filtered on all its communes', () => {
    const epci = { code: '242900835', nom: 'CA du Pays de Landerneau-Daoulas' };
    const communes = [
      {
        code: '29103',
        nom: 'Landerneau',
        codeDepartement: '29',
        population: 16000,
        localisation: { latitude: 48.45, longitude: -4.25 }
      },
      {
        code: '29043',
        nom: 'Daoulas',
        codeDepartement: '29',
        population: 1800,
        localisation: { latitude: 48.36, longitude: -4.26 }
      },
      {
        code: '29240',
        nom: 'La Roche-Maurice',
        codeDepartement: '29',
        population: 1900,
        localisation: { latitude: 48.47, longitude: -4.2 }
      }
    ];

    expect(territoireFromEpci(epci, communes, departements, regions)).toStrictEqual({
      type: 'epci',
      code: '242900835',
      nom: 'CA du Pays de Landerneau-Daoulas',
      localisation: { latitude: 48.45, longitude: -4.25 },
      zoom: 11,
      path: '/bretagne/finistere',
      filtre: { type: 'communes', codes: ['29103', '29043', '29240'] }
    });
  });

  it('should attach an EPCI to its most represented departement', () => {
    const epci = { code: '200000000', nom: 'CC à cheval' };
    const morbihan: Departement = {
      code: '56',
      nom: 'Morbihan',
      slug: 'morbihan',
      zoom: 9,
      localisation: { latitude: 47.8, longitude: -2.8 }
    };
    const communes = [
      { code: '56001', nom: 'A', codeDepartement: '56', population: 100, localisation: { latitude: 47.9, longitude: -2.9 } },
      { code: '56002', nom: 'B', codeDepartement: '56', population: 200, localisation: { latitude: 47.8, longitude: -2.8 } },
      { code: '29001', nom: 'C', codeDepartement: '29', population: 5000, localisation: { latitude: 48.1, longitude: -4.0 } }
    ];

    const territoire = territoireFromEpci(epci, communes, [finistere, morbihan], regions);

    expect(territoire.path).toBe('/bretagne/morbihan');
    expect(territoire.localisation).toStrictEqual({ latitude: 48.1, longitude: -4.0 });
  });
});
