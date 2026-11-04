export type NiveauFraicheur = 'a-jour' | 'a-surveiller' | 'a-verifier' | 'a-actualiser';

export type Fraicheur = {
  niveau: NiveauFraicheur;
  libelle: string;
  explication: string;
  date?: string;
};

const MILLISECONDES_PAR_MOIS = 1000 * 60 * 60 * 24 * 30.44;
const PREMIERE_ANNEE_FIABLE = 2000;

const FRAICHEURS: Record<NiveauFraicheur, Omit<Fraicheur, 'date' | 'niveau'>> = {
  'a-jour': {
    libelle: 'À jour',
    explication: 'Informations mises à jour il y a moins de 6 mois. Aucune action nécessaire.'
  },
  'a-surveiller': {
    libelle: 'À surveiller',
    explication: 'Informations mises à jour il y a 6 à 12 mois. Un contrôle ponctuel est conseillé.'
  },
  'a-verifier': {
    libelle: 'À vérifier',
    explication: 'Informations datant de 12 à 18 mois. Une vérification est recommandée en priorité.'
  },
  'a-actualiser': {
    libelle: 'À actualiser',
    explication:
      "Informations non mises à jour depuis plus de 18 mois. Une mise à jour est recommandée pour qu'elles restent fiables sur la cartographie."
  }
};

const EXPLICATION_DATE_INCONNUE =
  'Date de dernière mise à jour inconnue. Une mise à jour est recommandée pour que les informations restent fiables sur la cartographie.';

const niveauSelonAge = (ageEnMois: number): NiveauFraicheur => {
  if (ageEnMois < 6) return 'a-jour';
  if (ageEnMois < 12) return 'a-surveiller';
  if (ageEnMois < 18) return 'a-verifier';
  return 'a-actualiser';
};

const isDateFiable = (date: Date): boolean => !Number.isNaN(date.getTime()) && date.getUTCFullYear() >= PREMIERE_ANNEE_FIABLE;

const dateEnFrancais = (date: Date): string =>
  date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Europe/Paris' });

export const fraicheurDuLieu = (dateMaj: string | undefined, maintenant: Date): Fraicheur => {
  const date = new Date(dateMaj ?? Number.NaN);

  if (!isDateFiable(date)) {
    return { niveau: 'a-actualiser', ...FRAICHEURS['a-actualiser'], explication: EXPLICATION_DATE_INCONNUE };
  }

  const niveau = niveauSelonAge((maintenant.getTime() - date.getTime()) / MILLISECONDES_PAR_MOIS);

  return { niveau, ...FRAICHEURS[niveau], date: dateEnFrancais(date) };
};

const LIBELLES_SOURCE: Record<string, string> = {
  'Coop numérique': 'la Coop'
};

export const origineDesInformations = (date: string | undefined, source: string | undefined): string =>
  [date && `Mise à jour le ${date}`, source && `Via ${LIBELLES_SOURCE[source] ?? source}`].filter(Boolean).join(' · ');
