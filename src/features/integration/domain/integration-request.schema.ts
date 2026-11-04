import { z } from 'zod';

export const emailSchema = z.email('Adresse e-mail invalide');

export const sortieSchema = z.enum(['lien', 'qr-code', 'iframe', 'web-component']);

export type Sortie = z.infer<typeof sortieSchema>;

export const SORTIE_LABELS: Record<Sortie, string> = {
  lien: 'Lien',
  'qr-code': 'QR code',
  iframe: 'iframe',
  'web-component': 'Web component'
};

export const integrationRequestSchema = z.object({
  email: emailSchema,
  territoire: z.object({
    type: z.enum(['region', 'departement', 'epci', 'commune']),
    code: z.string().min(1),
    nom: z.string().min(1),
    nombreCommunes: z.number().int().positive().optional()
  }),
  vue: z.enum(['filtree', 'centree']),
  sortie: sortieSchema,
  personnalisation: z
    .object({
      titre: z.string(),
      logoUrl: z.string(),
      couleurPrincipale: z.string().optional()
    })
    .optional(),
  lien: z.url(),
  code: z.string().optional()
});

export type IntegrationRequest = z.infer<typeof integrationRequestSchema>;

const SORTIE_SUBJECTS: Record<Sortie, string> = {
  lien: 'via un copier / coller',
  'qr-code': 'via le QR Code',
  iframe: 'via une intégration',
  'web-component': 'via une intégration'
};

export const integrationRequestSubject = ({ sortie, territoire }: Pick<IntegrationRequest, 'sortie' | 'territoire'>): string =>
  `[Cartographie] Nouvelle intégration de la cartographie ${SORTIE_SUBJECTS[sortie]} - ${territoire.nom}`;
