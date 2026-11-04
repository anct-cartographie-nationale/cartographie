import { Column, Hr, Link, Row, Section, Text } from 'react-email';
import { type IntegrationRequest, integrationRequestSubject, SORTIE_LABELS } from '@/features/integration/domain';
import { EmailLayout } from '@/libraries/react-email';

const TERRITOIRE_LABELS: Record<IntegrationRequest['territoire']['type'], string> = {
  region: 'Région',
  departement: 'Département',
  epci: 'Intercommunalité',
  commune: 'Commune'
};

const VUE_LABELS: Record<IntegrationRequest['vue'], string> = {
  filtree: 'Uniquement les lieux du territoire',
  centree: 'Carte centrée sur le territoire'
};

const territoireLabel = ({ type, nom, code, nombreCommunes }: IntegrationRequest['territoire']): string =>
  type === 'epci'
    ? `${TERRITOIRE_LABELS[type]} ${nom} (${nombreCommunes ?? 0} communes)`
    : `${TERRITOIRE_LABELS[type]} ${nom} (${code})`;

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

type IntegrationRequestEmailProps = IntegrationRequest & {
  sentAt?: Date;
};

export const IntegrationRequestEmail = ({
  email,
  territoire,
  vue,
  sortie,
  personnalisation,
  lien,
  code,
  sentAt = new Date()
}: IntegrationRequestEmailProps) => (
  <EmailLayout preview={integrationRequestSubject({ sortie, territoire })}>
    <Text className='text-lg font-bold mt-6 mb-2'>Nouvelle intégration de la cartographie</Text>
    <Text className='text-sm text-neutral mb-6'>
      Demande de{' '}
      <Link href={`mailto:${email}`} className='text-primary'>
        {email}
      </Link>
    </Text>

    <Section className='bg-[#f6f6f6] rounded p-5 mb-6'>
      <Field label='Territoire'>{territoireLabel(territoire)}</Field>
      <Field label='Vue'>{VUE_LABELS[vue]}</Field>
      <Field label='Sortie'>{SORTIE_LABELS[sortie]}</Field>
      {personnalisation && (
        <>
          <Field label='Titre'>{personnalisation.titre}</Field>
          <Field label='Logo'>{personnalisation.logoUrl || 'Non renseigné'}</Field>
          <Field label='Couleur'>{personnalisation.couleurPrincipale ?? 'Par défaut'}</Field>
        </>
      )}
      <Field label='Envoyé le'>{formatDate(sentAt)}</Field>
    </Section>

    <Section className='mb-6'>
      <Text className='text-xs text-neutral font-bold uppercase mb-2'>Lien</Text>
      <Link href={lien} className='text-primary text-sm break-all'>
        {lien}
      </Link>
    </Section>

    {code && (
      <Section className='mb-6'>
        <Hr className='border-base-300 mb-6' />
        <Text className='text-xs text-neutral font-bold uppercase mb-2'>Code</Text>
        <pre className='bg-[#f6f6f6] rounded p-4 text-xs whitespace-pre-wrap break-all m-0'>{code}</pre>
      </Section>
    )}
  </EmailLayout>
);

IntegrationRequestEmail.PreviewProps = {
  email: 'marie.dupont@example.fr',
  territoire: { type: 'departement', code: '29', nom: 'Finistère' },
  vue: 'filtree',
  sortie: 'iframe',
  lien: 'https://cartographie.societenumerique.gouv.fr/bretagne/finistere?territoire_type=departements&territoires=29',
  code: '<iframe src="https://cartographie.societenumerique.gouv.fr/bretagne/finistere?integration=iframe"></iframe>',
  sentAt: new Date('2026-11-03T15:30:00')
} satisfies IntegrationRequestEmailProps;

export default IntegrationRequestEmail;
