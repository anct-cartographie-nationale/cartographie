import type { Commune, Epci } from './territoire';

export type TerritoireSource = {
  searchCommunes: (query: string) => Promise<Commune[]>;
  searchEpcis: (query: string) => Promise<Epci[]>;
};
