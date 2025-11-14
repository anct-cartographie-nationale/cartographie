import { formatInTimeZone } from 'date-fns-tz';
import type { LieuxRouteResponse } from '@/external-api/inclusion-numerique';
import type { LieuDetails } from '@/features/lieux-inclusion-numerique/lieu-details';
import { formatPhoneNumber } from './format-phone-number';

const COMPETENCES_SERVICES = [
  'Aide aux démarches administratives',
  'Maîtrise des outils numériques du quotidien',
  'Insertion professionnelle via le numérique',
  'Utilisation sécurisée du numérique',
  'Parentalité et éducation avec le numérique'
];

const CULTURE_NUMERIQUE_SERVICES = ['Loisirs et créations numériques', 'Compréhension du monde numérique'];

const MATERIEL_INFORMATIQUE_SERVICES = [
  'Accès internet et matériel informatique',
  'Acquisition de matériel informatique à prix solidaire'
];

export const toLieuDetails = ({
  id,
  nom,
  adresse,
  departement,
  region,
  latitude,
  longitude,
  telephone,
  courriels,
  site_web,
  fiche_acces_libre,
  prise_rdv,
  horaires,
  date_maj,
  source,
  presentation_resume,
  presentation_detail,
  services,
  dispositif_programmes_nationaux,
  formations_labels,
  autres_formations_labels,
  modalites_accompagnement,
  publics_specifiquement_adresses,
  frais_a_charge,
  prise_en_charge_specifique,
  modalites_acces,
  mediateurs
}: LieuxRouteResponse[number] & { region: string; departement: string }): LieuDetails => ({
  id,
  nom,
  adresse: [
    [[adresse.numero_voie, adresse.repetition].filter(Boolean).join(''), adresse.nom_voie].filter(Boolean).join(' '),
    [adresse.code_postal, adresse.commune].join(' ')
  ].join(', '),
  departement,
  region,
  ...(latitude ? { latitude } : {}),
  ...(longitude ? { longitude } : {}),
  ...(horaires ? { osmOpeningHours: horaires } : {}),
  isFranceServices: dispositif_programmes_nationaux?.includes('France Services') ?? false,
  isConum: dispositif_programmes_nationaux?.includes('Conseillers numériques') ?? false,
  ...(telephone ? { telephone: formatPhoneNumber(telephone) } : {}),
  ...(courriels ? { courriel: courriels } : {}),
  ...(site_web ? { siteInternet: site_web } : {}),
  ...(fiche_acces_libre ? { accessibilite: fiche_acces_libre } : {}),
  ...(prise_rdv ? { priseRDV: prise_rdv } : {}),
  ...(presentation_resume ? { description: presentation_resume } : {}),
  ...(presentation_detail ? { description: presentation_detail } : {}),
  labels: [...(formations_labels ? formations_labels : []), ...(autres_formations_labels ? autres_formations_labels : [])],
  services: {
    competences: services.filter((service) => COMPETENCES_SERVICES.includes(service)),
    cultureNumerique: services.filter((service) => CULTURE_NUMERIQUE_SERVICES.includes(service)),
    materielInformatique: services.filter((service) => MATERIEL_INFORMATIQUE_SERVICES.includes(service))
  },
  source,
  dateMiseAJour: formatInTimeZone(date_maj, 'Europe/Paris', "dd/MM/yyyy, H'h'mm"),
  typesAccompagnement: modalites_accompagnement ?? [],
  publicsSpecifiques: publics_specifiquement_adresses ?? [],
  fraisACharge: frais_a_charge ?? [],
  prisesEnChargeSpecifiques: prise_en_charge_specifique ?? [],
  modalitesAcces: modalites_acces ?? [],
  mediateurs:
    mediateurs?.map((mediateur) => ({
      nom: `${mediateur.prenom} ${mediateur.nom}`,
      labels: mediateur?.label ?? [],
      ...(mediateur.email ? { email: mediateur.email } : {}),
      ...(mediateur.telephone ? { phone: formatPhoneNumber(mediateur.telephone) } : {})
    })) ?? []
});
