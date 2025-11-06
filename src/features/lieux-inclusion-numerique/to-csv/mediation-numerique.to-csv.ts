import type { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';

const HEADERS: (keyof SchemaLieuMediationNumerique)[] = [
  'id',
  'pivot',
  'nom',
  'commune',
  'code_postal',
  'code_insee',
  'adresse',
  'complement_adresse',
  'latitude',
  'longitude',
  'typologie',
  'telephone',
  'courriels',
  'site_web',
  'horaires',
  'presentation_resume',
  'presentation_detail',
  'source',
  'itinerance',
  'structure_parente',
  'date_maj',
  'services',
  'publics_specifiquement_adresses',
  'prise_en_charge_specifique',
  'frais_a_charge',
  'dispositif_programmes_nationaux',
  'formations_labels',
  'autres_formations_labels',
  'modalites_acces',
  'modalites_accompagnement',
  'fiche_acces_libre',
  'prise_rdv'
];

const toDoubleQuoted = (header?: string): string => (header == null ? '' : `"${header}"`);

const fieldsArrayFrom = (lieuMediationNumerique: SchemaLieuMediationNumerique): (string | undefined)[] => [
  lieuMediationNumerique.id,
  lieuMediationNumerique.pivot,
  lieuMediationNumerique.nom.replace(/"/g, '').replace(/\n/g, ''),
  lieuMediationNumerique.commune,
  lieuMediationNumerique.code_postal,
  lieuMediationNumerique.code_insee,
  lieuMediationNumerique.adresse.replace(/"/g, '').replace(/\n/g, '').replace(/\s$/g, '').replace(/\s+/g, ' '),
  lieuMediationNumerique.complement_adresse?.replace(/"/g, '').replace(/\n/g, '').replace(/\s$/g, '').replace(/\s+/g, ' '),
  lieuMediationNumerique.latitude?.toString(),
  lieuMediationNumerique.longitude?.toString(),
  lieuMediationNumerique.typologie,
  lieuMediationNumerique.telephone,
  lieuMediationNumerique.courriels,
  lieuMediationNumerique.site_web,
  lieuMediationNumerique.horaires?.replace(/"/g, '').replace(/\n/g, ''),
  lieuMediationNumerique.presentation_resume?.replace(/"/g, '＂').replace(/\n/g, ''),
  lieuMediationNumerique.presentation_detail?.replace(/"/g, '＂').replace(/\n/g, ''),
  lieuMediationNumerique.source,
  lieuMediationNumerique.itinerance,
  lieuMediationNumerique.structure_parente,
  lieuMediationNumerique.date_maj,
  lieuMediationNumerique.services?.replace(/"/g, '＂').replace(/\n/g, ''),
  lieuMediationNumerique.publics_specifiquement_adresses,
  lieuMediationNumerique.prise_en_charge_specifique,
  lieuMediationNumerique.frais_a_charge,
  lieuMediationNumerique.dispositif_programmes_nationaux,
  lieuMediationNumerique.formations_labels,
  lieuMediationNumerique.autres_formations_labels?.replace(/"/g, '＂').replace(/\n/g, ''),
  lieuMediationNumerique.modalites_acces,
  lieuMediationNumerique.modalites_accompagnement,
  lieuMediationNumerique.fiche_acces_libre,
  lieuMediationNumerique.prise_rdv
];

export const csvLineFrom = (cells: (string | undefined)[]): string => cells.map(toDoubleQuoted).join(',');

const separator = { object: ' | ', array: '/', field: ', ' };

const formatValue = (value: unknown): string => {
  if (value == null) return '';
  if (Array.isArray(value)) return value.map(formatValue).join(separator.array);
  if (typeof value === 'object') {
    return Object.keys(value)
      .filter((key) => (value as Record<string, unknown>)[key] != null)
      .map((key) => `${key} : ${formatValue((value as Record<string, unknown>)[key])}`)
      .join(separator.field);
  }
  return String(value).replaceAll('"', ''); // primitive
};

const objectsToCsvCell = (items: unknown): string =>
  Array.isArray(items) ? items.map(formatValue).join(separator.object) : formatValue(items);

const toExtraFieldValueFrom =
  (lieuMediationNumerique: Record<string, unknown>) =>
  (field: string): string =>
    lieuMediationNumerique[field] ? objectsToCsvCell(lieuMediationNumerique[field]) : '';

const toLieuMediationNumeriqueCsvLine =
  (extraFields: string[]) =>
  (lieuMediationNumerique: SchemaLieuMediationNumerique): string =>
    csvLineFrom([
      ...fieldsArrayFrom(lieuMediationNumerique),
      ...extraFields.map(toExtraFieldValueFrom(lieuMediationNumerique))
    ]);

const notInSchemaLieuMediationNumerique = (field: string) => !(HEADERS as string[]).includes(field);

const toObjectFields = (fields: string[], obj: Record<string, unknown>) => [...fields, ...Object.keys(obj)];

const extraFieldsFor = (lieuxMediationNumerique: SchemaLieuMediationNumerique[]): string[] =>
  Array.from(new Set(lieuxMediationNumerique.reduce(toObjectFields, []).filter(notInSchemaLieuMediationNumerique)));

export const mediationNumeriqueToCsv = (lieuxMediationNumerique: SchemaLieuMediationNumerique[]): string => {
  const extraFields: string[] = extraFieldsFor(lieuxMediationNumerique);
  return `${csvLineFrom([...HEADERS, ...extraFields])}\n${lieuxMediationNumerique.map(toLieuMediationNumeriqueCsvLine(extraFields)).join('\n')}`;
};
