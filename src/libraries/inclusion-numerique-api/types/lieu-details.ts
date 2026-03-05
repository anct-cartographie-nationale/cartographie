export type LieuDetails = {
  id: string;
  nom: string;
  osmOpeningHours?: string;
  isFranceServices?: boolean;
  isConum?: boolean;
  latitude?: number;
  longitude?: number;
  adresse: string;
  region: string;
  departement: string;
  siteInternet?: string;
  accessibilite?: string;
  telephone?: string;
  courriel?: string;
  priseRDV?: string;
  description?: string;
  labels: string[];
  source: string;
  dateMiseAJour: string;
  services: {
    competences: string[];
    cultureNumerique: string[];
    materielInformatique: string[];
  };
  typesAccompagnement: string[];
  publicsSpecifiques: string[];
  prisesEnChargeSpecifiques: string[];
  fraisACharge: string[];
  modalitesAcces: string[];
  mediateurs: {
    nom: string;
    labels?: string[];
    email?: string;
    phone?: string;
  }[];
};
