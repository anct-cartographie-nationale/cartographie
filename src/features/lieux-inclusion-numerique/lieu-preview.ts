export type LieuPreview = {
  id: string;
  nom: string;
  adresse: string;
  commune: string;
  code_postal: string;
  phone?: string;
  departement: string | undefined;
  region: string | undefined;
  distance?: number;
  isOpen?: boolean;
  isByAppointment?: boolean;
  isFranceServices?: boolean;
  isConum?: boolean;
};
