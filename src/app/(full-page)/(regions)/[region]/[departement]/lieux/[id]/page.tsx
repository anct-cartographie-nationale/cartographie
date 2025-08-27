import type { Metadata } from 'next';
import { FicheLieuPage } from '@/features/lieux-inclusion-numerique/fiche-lieu.page';
import { appPageTitle } from '@/libraries/utils';

export const generateMetadata = async ({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> => {
  const id: string = (await params).id;

  return {
    title: appPageTitle('Fiche du lieu', id),
    description: `Consultez la fiche du lieu de médiation numéérique ${id}.`
  };
};

const Page = async () => {
  return (
    <FicheLieuPage
      breadcrumbsItems={[
        { label: 'France', href: '/' },
        { label: 'Bourgogne-Franche-Comté', href: '/bourgogne-franche-comte' },
        { label: 'Territoire de Belfort (90)', href: '/bourgogne-franche-comte/territoire-de-belfort' },
        { label: '90300 Éloie' }
      ]}
      listHref='/bourgogne-franche-comte/territoire-de-belfort'
    />
  );
};

export default Page;
