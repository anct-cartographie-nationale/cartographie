import { Column, Hr, Link, Row, Section, Text } from '@react-email/components';
import { EmailLayout } from '@/libraries/react-email';
import type { ContactFormData } from './contact-form.schema';

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <Row className='mb-2'>
    <Column className='w-36 align-top'>
      <Text className='m-0 text-xs text-neutral font-bold uppercase'>{label}</Text>
    </Column>
    <Column className='align-top'>
      <Text className='m-0 text-sm'>{children}</Text>
    </Column>
  </Row>
);

export const ContactMessageEmail = ({ prenom, nom, email, statut, typeDemande, pageUrl, description }: ContactFormData) => (
  <EmailLayout preview={`${typeDemande} — ${prenom} ${nom}`}>
    <Text className='text-lg font-bold mb-0'>{typeDemande}</Text>
    <Text className='text-sm text-neutral mt-1'>
      {prenom} {nom} -{' '}
      <Link href={`mailto:${email}`} className='text-primary'>
        {email}
      </Link>
    </Text>

    <Section className='bg-[#f6f6f6] rounded p-4 my-4'>
      <Field label='Statut'>{statut}</Field>
      <Field label='Page concernée'>
        {pageUrl ? (
          <Link href={pageUrl} className='text-primary'>
            {pageUrl}
          </Link>
        ) : (
          'Non renseignée'
        )}
      </Field>
    </Section>

    {description && (
      <>
        <Hr className='border-base-300' />
        <Text className='text-xs text-neutral font-bold uppercase mb-4'>Description</Text>
        <Text className='text-sm mt-0 whitespace-pre-line'>{description}</Text>
      </>
    )}
  </EmailLayout>
);

ContactMessageEmail.PreviewProps = {
  prenom: 'Marie',
  nom: 'Dupont',
  email: 'marie.dupont@example.fr',
  statut: 'Médiateur numérique',
  typeDemande: 'Demander de mettre à jour une page',
  pageUrl: 'https://cartographie.societenumerique.gouv.fr/ile-de-france/paris/lieux/exemple-lieu',
  description:
    "Bonjour,\n\nLes horaires du lieu ne sont plus à jour.\nLe lieu est désormais ouvert le samedi de 9h à 12h.\n\nMerci d'avance."
} satisfies ContactFormData;

export default ContactMessageEmail;
