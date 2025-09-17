export type LieuListItem = {
  id: string;
  region: string;
  departement: string;
  nom: string;
  adresse: string;
  commune: string;
  codePostal: string;
  telephone?: string;
  distance?: string;
  isOpen?: boolean;
  isByAppointment?: boolean;
  isFranceServices?: boolean;
  isConum?: boolean;
};
