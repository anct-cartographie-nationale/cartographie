import { Column, Hr, Link, Row, Section, Text } from '@react-email/components';
import { EmailLayout } from '@/libraries/react-email';
import type { ContactFormData } from '../domain/contact-form.schema';

const BADGE_COLORS: Record<string, { bg: string; text: string }> = {
  Bug: { bg: '#ffe9e9', text: '#ce0600' },
  'Renseignements sur un lieu': { bg: '#e8edff', text: '#0163cb' },
  'Demander de mettre à jour une page': { bg: '#b8fec9', text: '#18753c' },
  'Demander de supprimer une information': { bg: '#fee9b8', text: '#716043' }
};

const DEFAULT_BADGE = { bg: '#e8edff', text: '#0163cb' };

const Badge = ({ label }: { label: string }) => {
  const { bg, text } = BADGE_COLORS[label] ?? DEFAULT_BADGE;
  return (
    <span
      style={{
        backgroundColor: bg,
        color: text,
        padding: '4px 10px',
        borderRadius: '4px',
        fontSize: '13px',
        fontWeight: 600
      }}
    >
      {label}
    </span>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <Row className='mb-3'>
    <Column className='w-36 align-top'>
      <Text className='m-0 text-xs text-neutral font-bold uppercase'>{label}</Text>
    </Column>
    <Column className='align-top'>
      <Text className='m-0 text-sm'>{children}</Text>
    </Column>
  </Row>
);

const formatDate = (date: Date): string =>
  date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

type ContactMessageEmailProps = ContactFormData & {
  sentAt?: Date;
};

export const ContactMessageEmail = ({
  prenom,
  nom,
  email,
  statut,
  typeDemande,
  pageUrl,
  description,
  sentAt = new Date()
}: ContactMessageEmailProps) => (
  <EmailLayout preview={`${typeDemande} — ${prenom} ${nom}`}>
    <Section className='mt-6 mb-2'>
      <Badge label={typeDemande} />
    </Section>

    <Text className='text-sm text-neutral mb-6'>
      {prenom} {nom} -{' '}
      <Link href={`mailto:${email}`} className='text-primary'>
        {email}
      </Link>
    </Text>

    <Section className='bg-[#f6f6f6] rounded p-5 mb-6'>
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
      <Field label='Envoyé le'>{formatDate(sentAt)}</Field>
    </Section>

    {description && (
      <Section className='mb-6'>
        <Hr className='border-base-300 mb-6' />
        <Text className='text-xs text-neutral font-bold uppercase mb-4'>Description</Text>
        <Text className='text-sm mt-0 whitespace-pre-line'>{description}</Text>
      </Section>
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
    "Bonjour,\n\nLes horaires du lieu ne sont plus à jour.\nLe lieu est désormais ouvert le samedi de 9h à 12h.\n\nMerci d'avance.",
  sentAt: new Date('2026-04-30T14:30:00')
} satisfies ContactMessageEmailProps;

export default ContactMessageEmail;
