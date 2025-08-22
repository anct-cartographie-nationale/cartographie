import type { Metadata } from 'next';
import { LieuxPage } from '@/features/lieux-inclusion-numerique/lieux.page';
import { appPageTitle } from '@/libraries/utils';

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: appPageTitle('Liste des lieux', 'France'),
    description: "Consultez la liste de tous les lieux d'inclusion numérique de France."
  };
};

const Page = async () => <LieuxPage mapHref='/' />;

export default Page;
