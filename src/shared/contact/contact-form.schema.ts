import { z } from 'zod';

export const contactFormSchema = z.object({
  prenom: z.string().min(1, 'Le champ prénom est obligatoire'),
  nom: z.string().min(1, 'Le champ nom est obligatoire'),
  email: z.string().email('Adresse e-mail invalide'),
  statut: z.string().min(1, 'Le champ statut est obligatoire'),
  pageUrl: z.string(),
  typeDemande: z.string().min(1, 'Le champ type de demande est obligatoire'),
  description: z.string()
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
