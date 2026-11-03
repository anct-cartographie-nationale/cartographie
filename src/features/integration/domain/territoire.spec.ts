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
    const epci = {
      code: 'EPCI____0000002150236789',
      nom: 'CA du Pays de Landerneau-Daoulas',
      localisation: { latitude: 48.45, longitude: -4.25 },
      communes: ['29103', '29043', '29240']
    };

    expect(territoireFromEpci(epci, departements, regions)).toStrictEqual({
      type: 'epci',
      code: 'EPCI____0000002150236789',
      nom: 'CA du Pays de Landerneau-Daoulas',
      localisation: { latitude: 48.45, longitude: -4.25 },
      zoom: 11,
      path: '/bretagne/finistere',
      filtre: { type: 'communes', codes: ['29103', '29043', '29240'] }
    });
  });

  it('should attach an EPCI to its most represented departement', () => {
    const morbihan: Departement = {
      code: '56',
      nom: 'Morbihan',
      slug: 'morbihan',
      zoom: 9,
      localisation: { latitude: 47.8, longitude: -2.8 }
    };
    const epci = {
      code: 'EPCI____0000000000000001',
      nom: 'CC à cheval',
      localisation: { latitude: 47.9, longitude: -3.2 },
      communes: ['56001', '56002', '29001']
    };

    expect(territoireFromEpci(epci, [finistere, morbihan], regions).path).toBe('/bretagne/morbihan');
  });

  it('should attach an overseas EPCI to its three-digit departement', () => {
    const reunion: Departement = {
      code: '974',
      nom: 'La Réunion',
      slug: 'la-reunion',
      zoom: 10,
      localisation: { latitude: -21.1, longitude: 55.5 }
    };
    const reunionRegion: Region = {
      code: '04',
      departements: ['974'],
      nom: 'La Réunion',
      slug: 'la-reunion',
      zoom: 10,
      localisation: { latitude: -21.1, longitude: 55.5 }
    };
    const epci = {
      code: 'EPCI____0000000000000002',
      nom: 'CINOR',
      localisation: { latitude: -20.9, longitude: 55.5 },
      communes: ['97411', '97418', '97420']
    };

    expect(territoireFromEpci(epci, [reunion], [reunionRegion]).path).toBe('/la-reunion/la-reunion');
  });
});
