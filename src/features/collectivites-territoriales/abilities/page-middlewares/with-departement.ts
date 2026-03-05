import { notFound } from 'next/navigation';
import { type Departement, departementMatchingSlug, departements } from '@/libraries/collectivites';
import type { PageProps } from '@/libraries/nextjs/page';

export const withDepartement =
  (slugKey: string = 'departement') =>
  async <TContext extends object>(_ctx: TContext, props: PageProps): Promise<{ ctx: { departement: Departement } }> => {
    const params = await props.params;
    const slug = params[slugKey];

    if (slug === undefined) return notFound();

    const departement: Departement | undefined = departements.find(departementMatchingSlug(slug));

    return departement ? { ctx: { departement } } : notFound();
  };
