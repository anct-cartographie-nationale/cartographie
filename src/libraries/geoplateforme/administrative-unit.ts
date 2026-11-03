export type GeocodedCommune = {
  code: string;
  nom: string;
  codeDepartement: string;
  population: number;
  latitude: number;
  longitude: number;
};

export type GeocodedEpci = {
  id: string;
  nom: string;
  communes: string[];
  latitude: number;
  longitude: number;
};
