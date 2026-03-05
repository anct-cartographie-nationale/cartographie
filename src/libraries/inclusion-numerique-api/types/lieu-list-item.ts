export type LieuListItem = {
  id: string;
  region: string;
  departement: string;
  nom: string;
  adresse: {
    numero_voie: string;
    repetition: string;
    nom_voie: string;
    commune: string;
    code_postal: string;
    code_insee: string;
  };
  telephone?: string;
  distance?: string;
  isOpen?: boolean;
  isByAppointment?: boolean;
  isFranceServices?: boolean;
  isConum?: boolean;
};
