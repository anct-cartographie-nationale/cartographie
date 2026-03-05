import { notFound } from 'next/navigation';
import type { PageProps } from '@/libraries/next/page';
import { type Departement, departementMatchingSlug, departements } from '../../domain';

export const withDepartement =
  (slugKey: string = 'departement') =>
  async <TContext extends object>(_ctx: TContext, props: PageProps): Promise<{ ctx: { departement: Departement } }> => {
    const params = await props.params;
    const slug = params[slugKey];

    if (slug === undefined) {
      notFound();
    }

    const departement: Departement | undefined = departements.find(departementMatchingSlug(slug));

    if (!departement) {
      notFound();
    }

    return { ctx: { departement } };
  };
