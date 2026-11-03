import type { Metadata } from 'next';
import { appVersion } from '@/configuration/app/version';
import { clientEnv } from '@/env.client';
import { serverEnv } from '@/env.server';
import { IntegrationGenerator } from '@/features/integration';
import { Link } from '@/libraries/ui/primitives/link';

const DEFAULT_SITE_URL = 'https://cartographie.societenumerique.gouv.fr';

export const metadata: Metadata = {
  title: 'Intégrer la cartographie | Cartographie Nationale',
  description:
    "Générez un lien, un code d'intégration ou un QR code de la cartographie nationale des lieux d'inclusion numérique pour votre territoire."
};

const IntegrerPage = () => (
  <div className='flex flex-col gap-8'>
    <header className='flex flex-col gap-3'>
      <h1 className='text-3xl font-bold'>Intégrer la cartographie sur vos supports</h1>
      <p>
        Choisissez votre territoire et obtenez immédiatement un lien vers une vue de la cartographie centrée sur vos lieux, à
        partager sur votre site, dans une signature e-mail ou un document. Vous pouvez aussi récupérer le code pour afficher la
        carte directement dans une page de votre site, à vos couleurs, ou un QR code pour vos supports imprimés.
      </p>
    </header>
    <IntegrationGenerator siteUrl={clientEnv.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL} version={appVersion} />
    <aside className='rounded-box border border-base-300 bg-base-200 p-6'>
      <p className='font-bold mb-1'>Une question, un besoin particulier ?</p>
      <p>L'équipe de la cartographie vous accompagne dans votre intégration.</p>
      <p>
        Écrivez-nous à{' '}
        <Link href={`mailto:${serverEnv.CONTACT_EMAIL_TO}`} color='link-primary'>
          {serverEnv.CONTACT_EMAIL_TO}
        </Link>
        .
      </p>
    </aside>
  </div>
);

export default IntegrerPage;
