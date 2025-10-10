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
  complement_adresse,
  commune,
  code_postal,
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
  adresse: `${adresse}${complement_adresse ? ` (${complement_adresse})` : ''}, ${code_postal} ${commune}`,
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
  labels: [
    ...(formations_labels ? formations_labels.split('|') : []),
    ...(autres_formations_labels ? autres_formations_labels.split('|') : [])
  ],
  services: {
    competences: services.split('|').filter((service) => COMPETENCES_SERVICES.includes(service)),
    cultureNumerique: services.split('|').filter((service) => CULTURE_NUMERIQUE_SERVICES.includes(service)),
    materielInformatique: services.split('|').filter((service) => MATERIEL_INFORMATIQUE_SERVICES.includes(service))
  },
  typesAccompagnement: modalites_accompagnement?.split('|') ?? [],
  publicsSpecifiques: publics_specifiquement_adresses?.split('|') ?? [],
  fraisACharge: frais_a_charge?.split('|') ?? [],
  prisesEnChargeSpecifiques: prise_en_charge_specifique?.split('|') ?? [],
  modalitesAcces: modalites_acces?.split('|') ?? [],
  mediateurs:
    mediateurs?.map((mediateur) => ({
      nom: `${mediateur.prenom} ${mediateur.nom}`,
      labels: mediateur?.label ?? [],
      ...(mediateur.email ? { email: mediateur.email } : {}),
      ...(mediateur.telephone ? { phone: formatPhoneNumber(mediateur.telephone) } : {})
    })) ?? []
});
