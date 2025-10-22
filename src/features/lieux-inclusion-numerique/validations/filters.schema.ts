import { z } from 'zod';

const servicesEnum = z.enum([
  'Maîtrise des outils numériques du quotidien',
  'Utilisation sécurisée du numérique',
  'Parentalité et éducation avec le numérique',
  'Loisirs et créations numériques',
  'Compréhension du monde numérique',
  'Aide aux démarches administratives',
  'Insertion professionnelle via le numérique',
  'Accès internet et matériel informatique',
  'Acquisition de matériel informatique à prix solidaire'
]);

const publicsSpecifiquementAdressesEnum = z.enum(['Jeunes', 'Seniors', 'Étudiants', 'Familles et/ou enfants']);

const priseEnChargeSpecifiqueEnum = z.enum([
  'Surdité',
  'Handicaps moteurs',
  'Handicaps mentaux',
  'Illettrisme',
  'Surdité',
  'Langues étrangères',
  'Déficience visuelle'
]);

const fraisAChargeEnum = z.enum(['Gratuit']);

const priseRDVEnum = z.enum(['Prise de RDV en ligne']);

const dispositifProgrammesNationauxEnum = z.enum(['Conseillers numériques', 'France Services']);

const autresFormationsLabelsEnum = z.enum(['QPV', 'ZRR']);

const commaSeparatedEnumArray = <T extends z.ZodEnum<Readonly<Record<string, string>>>>(schema: T) =>
  z
    .string()
    .transform((val) =>
      val
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    )
    .pipe(z.array(schema))
    .catch([]);

export const filtersSchema = z.object({
  services: commaSeparatedEnumArray(servicesEnum),
  publics_specifiquement_adresses: commaSeparatedEnumArray(publicsSpecifiquementAdressesEnum),
  prise_en_charge_specifique: commaSeparatedEnumArray(priseEnChargeSpecifiqueEnum),
  frais_a_charge: commaSeparatedEnumArray(fraisAChargeEnum),
  prise_rdv: commaSeparatedEnumArray(priseRDVEnum),
  dispositif_programmes_nationaux: commaSeparatedEnumArray(dispositifProgrammesNationauxEnum),
  autres_formations_labels: commaSeparatedEnumArray(autresFormationsLabelsEnum)
});

export type FiltersSchema = z.infer<typeof filtersSchema>;
