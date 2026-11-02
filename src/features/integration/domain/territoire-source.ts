import type { Commune, CommuneAvecPopulation, Epci } from './territoire';

export type TerritoireSource = {
  searchCommunes: (query: string) => Promise<Commune[]>;
  searchEpcis: (query: string) => Promise<Epci[]>;
  fetchEpciCommunes: (epciCode: string) => Promise<CommuneAvecPopulation[]>;
};
