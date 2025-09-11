export type LieuListItem = {
  id: string;
  region: string;
  departement: string;
  nom: string;
  adresse: string;
  commune: string;
  codePostal: string;
  phone?: string;
  distance?: string;
  isOpen?: boolean;
  isByAppointment?: boolean;
  isFranceServices?: boolean;
  isConum?: boolean;
};
